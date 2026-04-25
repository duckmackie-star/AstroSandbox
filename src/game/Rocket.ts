import { Vector } from './Vector';
import { CATALOG, RocketPart } from '../store';
import { getGravityAt, PLANETS, getClosestPlanet } from './Physics';

export class Rocket {
  pos: Vector;
  vel: Vector;
  angle: number;
  angularVel: number;
  
  parts: RocketPart[];
  totalMass: number;
  fuel: number;
  maxFuel: number;
  maxThrust: number;
  buff: number = 1;
  power: number = 0;
  name: string;

  thrusting: boolean = false;
  dead: boolean = false;
  leakingParts: Map<number, boolean> = new Map();
  autoPilotTarget: Vector | null = null;

  constructor(partsList: string[], name: string, startPos: Vector) {
    this.parts = partsList.map(p => CATALOG[p]).filter(Boolean);
    this.name = name;
    this.pos = startPos;
    this.vel = new Vector(0, 0);
    this.angle = 0; // 0 is pointing straight UP
    this.angularVel = 0;

    let mass = 0;
    let fuel = 0;
    let thrust = 0;

    for (const p of this.parts) {
      mass += p.mass;
      if (p.type === 'Fuel' && p.capacity) fuel += p.capacity;
      if (p.type === 'Engine' && p.thrust) thrust += p.thrust;
    }

    const leaderPart = this.parts.find(p => p.buffFactor);
    this.buff = leaderPart?.buffFactor || 1;

    this.totalMass = mass || 10;
    this.maxFuel = fuel * this.buff;
    this.fuel = this.maxFuel;
    this.maxThrust = thrust * this.buff;
  }

  recomputeStats() {
    let mass = 0;
    let fuel = 0;
    let thrust = 0;
    for (const p of this.parts) {
      mass += p.mass;
      if (p.type === 'Fuel' && p.capacity) fuel += p.capacity;
      if (p.type === 'Engine' && p.thrust) thrust += p.thrust;
    }
    
    const leaderPart = this.parts.find(p => p.buffFactor);
    this.buff = leaderPart?.buffFactor || 1;
    
    this.totalMass = mass || 10;
    this.maxFuel = fuel * this.buff;
    if (this.fuel > this.maxFuel) this.fuel = this.maxFuel;
    this.maxThrust = thrust * this.buff;
  }

  update(keys: Set<string>) {
    if (this.dead) return;

    // Controls
    const hasRCS = this.parts.some(p => p.id === 'cmd_rcs');
    const rotStrength = hasRCS ? 0.02 : 0.005;
    
    let steering = 0;
    if (keys.has('ArrowLeft')) steering -= 1;
    if (keys.has('ArrowRight')) steering += 1;
    
    const hasAutoPilot = this.parts.some(p => p.id === 'cmd_auto');
    if (hasAutoPilot && this.autoPilotTarget) {
        const toTarget = this.autoPilotTarget.sub(this.pos);
        const targetAngle = Math.atan2(toTarget.x, -toTarget.y);
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        if (Math.abs(angleDiff) > 0.05) {
            steering += angleDiff > 0 ? 1 : -1;
        }
        
        // Auto-thrust if far enough
        if (toTarget.mag() > 50) {
           keys.add('ArrowUp');
        }
    }
    
    this.angularVel += steering * rotStrength;
    
    // Gyroscope dampening
    const hasGyro = this.parts.some(p => p.id === 'cmd_gyro');
    const dampening = hasGyro ? 0.9 : 0.95;
    
    // Friction for rotation
    this.angularVel *= dampening;
    this.angle += this.angularVel;

    this.thrusting = false;
    let acc = getGravityAt(this.pos);

    // Atmospheric drag
    const closest = getClosestPlanet(this.pos);
    if (closest.planet.hasAtmosphere && closest.altitude < 4000) {
      const density = Math.max(0, 1 - closest.altitude / 4000);
      const dragForce = 0.02 * density;
      this.vel = this.vel.mul(1 - dragForce);
      
      const hasFins = this.parts.some(p => p.id === 'struct_fin');
      const stability = hasFins ? 0.9 : 1; // Fins make angularVel damp faster in atmosphere
      this.angularVel *= (1 - dragForce * 2 * stability);
    }

    if (keys.has('ArrowUp')) { // Thrust
      if (this.fuel > 0 && this.maxThrust > 0) {
        this.thrusting = true;
        // Chance to explode if using experimental engine
        if (this.parts.some(p => p.id === 'eng_experimental') && Math.random() < (0.001 / this.buff)) {
            this.dead = true;
            return;
        }
        this.fuel -= (0.15 / this.buff); // Customize fuel burn rate
        const forceMult = 0.05 * (this.maxThrust / this.totalMass); // Thrust power multiplier
        
        let dx = Math.sin(this.angle) * forceMult;
        let dy = -Math.cos(this.angle) * forceMult;
        
        const thrustVec = new Vector(dx, dy);
        acc = acc.add(thrustVec);
      }
    }

    if (keys.has(' ')) {
      // Trying to deploy cargo? Handled by GameEngine/HUD.
    }

    this.vel = this.vel.add(acc);
    this.pos = this.pos.add(this.vel);

    // Collision with planets
    for (const p of PLANETS) {
      const diff = this.pos.sub(p.pos);
      const dist = diff.mag();
      if (dist < p.radius) {
        const normal = diff.normalize();
        const dot = this.vel.x * normal.x + this.vel.y * normal.y; // inward velocity

        if (dot < 0) {
          const hasRubber = this.parts.some(p => p.id === 'struct_rubber');
          const crashThreshold = hasRubber ? 30 : 15;
          const bounceFactor = hasRubber ? -0.8 : 0;
          
          if (Math.abs(dot) > crashThreshold) { // Crash threshold
            this.dead = true;
          } else {
            // Cancel inward velocity, apply friction/bounce
            this.vel = this.vel.sub(normal.mul(dot));
            if (hasRubber) {
                // Reflect velocity for bounce
                this.vel = this.vel.add(normal.mul(-dot * 0.5));
            }
            this.vel = this.vel.mul(0.9);
          }
        }
        
        // Push out
        this.pos = p.pos.add(normal.mul(p.radius));
        
        if (this.vel.mag() < 0.5) {
          this.angularVel = 0;
          this.angle = Math.atan2(normal.x, -normal.y);
        }
      }
    }
  }
}

import { Rocket } from './Rocket';
import { Vector } from './Vector';
import { getClosestPlanet, getGravityAt, PLANETS, Planet } from './Physics';
import { CATALOG, RocketPart } from '../store';

export class GameEngine {
  rocket: Rocket | null = null;
  keys: Set<string> = new Set();
  
  // Particles
  particles: { pos: Vector, vel: Vector, life: number, maxLife: number, color: string }[] = [];
  satellites: { pos: Vector, vel: Vector, dead?: boolean, trail: Vector[] }[] = [];
  rovers: { pos: Vector, vel: Vector, dead?: boolean, landed?: boolean, planet?: Planet, angle?: number }[] = [];
  orbitalLasers: { pos: Vector, vel: Vector, state: 'idle' | 'charging' | 'firing', timer: number, dead?: boolean }[] = [];
  bases: { pos: Vector, planet: Planet, lockedItems: string[], lastAccessed: number }[] = [];
  debris: { pos: Vector, vel: Vector, parts: RocketPart[] }[] = [];

  activeBase: { pos: Vector, planet: Planet, lockedItems: string[], lastAccessed: number } | null = null;
  inGorgUniverse: boolean = false;

  setAutoPilotTarget(target: Vector) {
      if (this.rocket) {
          this.rocket.autoPilotTarget = target;
      }
  }

  refuelRocket() {
      if (this.rocket) {
          this.rocket.fuel = this.rocket.maxFuel;
      }
  }

  constructor(
    public onMilestone: (msg: string) => void,
    public onDeployStation: (x: number, y: number) => void,
    public onDeploySatellite: () => void = () => {},
    public onDeployRover: () => void = () => {},
    public onUnlockPlanet: (name: string) => void = () => {},
    public onOpenBase: (base: { pos: Vector, planet: Planet, lockedItems: string[] }) => void = () => {}
  ) {}

  addPartToRocket(partId: string, base: { pos: Vector, planet: Planet, lockedItems: string[], lastAccessed: number } | null) {
    if (this.rocket) {
       const part = CATALOG[partId];
       if (part) {
           this.rocket.parts.push({ ...part });
           this.rocket.totalMass += part.mass;
           if (base) {
               base.lastAccessed = Date.now();
           }
       }
    }
  }

  resetToEarth() {
    if (this.rocket) {
        this.rocket.pos = new Vector(0, -10);
        this.rocket.vel = new Vector(0, 0);
        this.rocket.angle = 0;
        this.rocket.fuel = this.rocket.maxFuel;
    }
  }

  startFlight(blueprint: string[], name: string) {
    this.rocket = new Rocket(blueprint, name, new Vector(0, -10)); // Start slightly above 0 on Earth
    this.particles = [];
    this.satellites = [];
    this.rovers = [];
    this.orbitalLasers = [];
    this.bases = [];
  }

  handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key);
    
    // Fire Weapons
    if (e.key === 'e' && this.rocket && !this.rocket.dead) {
        this.fireWeapons();
    }
    
    // Deploy Station, Satellite or Rover
    if (e.key === ' ' && this.rocket && !this.rocket.dead) {
      const cargoIndex = this.rocket.parts.findIndex(p => p.type === 'Cargo');
      const closest = getClosestPlanet(this.rocket.pos);
      if (cargoIndex !== -1) {
        const part = this.rocket.parts[cargoIndex];
        this.rocket.parts.splice(cargoIndex, 1);
        this.rocket.totalMass -= part.mass; // payload mass
        
        if (part.id === 'cargo_sat') {
           this.satellites.push({ pos: this.rocket.pos, vel: this.rocket.vel, trail: [] });
           this.onDeploySatellite();
           this.onMilestone(`Satellite deployed into orbit around ${closest.planet.name}!`);
        } else if (part.id === 'cargo_rover') {
           this.rovers.push({ pos: this.rocket.pos, vel: this.rocket.vel, planet: closest.planet });
           this.onDeployRover();
           this.onMilestone(`Rover deployed towards ${closest.planet.name}!`);
        } else if (part.id === 'crg_orbital_laser') {
           this.orbitalLasers.push({ pos: this.rocket.pos, vel: this.rocket.vel, state: 'idle', timer: 0 });
           this.onMilestone(`Orbital Laser Cannon deployed into orbit!`);
        } else if (part.id === 'cargo_base') {
           this.bases.push({ pos: this.rocket.pos, planet: closest.planet, lockedItems: ['eng_warp', 'wpn_railgun'], lastAccessed: 0 });
           this.onMilestone(`Base deployed on ${closest.planet.name}!`);
        } else {
           this.onDeployStation(this.rocket.pos.x, this.rocket.pos.y);
           this.onMilestone(`Orbiting station deployed near ${closest.planet.name}!`);
        }
      }
    }
    
    // Interact with Base
    if (e.key === 'q' && this.rocket && !this.rocket.dead) {
       let foundBase = false;
       for (const base of this.bases) {
           if (base.pos.sub(this.rocket.pos).mag() < 60) {
               if (Date.now() - base.lastAccessed > 30000) {
                   this.activeBase = base;
                   this.onOpenBase(base);
                   foundBase = true;
               } else {
                   this.onMilestone("Base is on cooldown! Wait 30 seconds.");
               }
           }
       }
       if (!foundBase) {
           this.activeBase = null;
       }
    }
    
    // Tear apart
    if (e.key === 'f' && this.rocket && !this.rocket.dead) {
       const sepIndex = this.rocket.parts.findIndex(p => p.id === 'struct_separator');
       if (sepIndex !== -1) {
           const partsAfter = this.rocket.parts.splice(sepIndex);
           const debrisParts = partsAfter.slice(1);
           
           if (debrisParts.length > 0) {
               this.debris.push({
                   pos: this.rocket.pos,
                   vel: this.rocket.vel,
                   parts: debrisParts
               });
           }
           
           this.rocket.recomputeStats();
           this.onMilestone(`Rocket torn apart!`);
       }
    }
  }

  handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key);
  }

  fireWeapons() {
    if (!this.rocket) return;
    const weapons = this.rocket.parts.filter(p => p.type === 'Weapon');
    if (weapons.length === 0) {
      this.onMilestone("No weapons equipped!");
      return;
    }

    this.onMilestone(`Firing ${weapons.length} weapon(s)!`);
    for (const weapon of weapons) {
      // Fire effect - angle is 0 is up
      this.particles.push({
        pos: this.rocket.pos,
        // angle 0 is up, Vector(0, -1). 
        // sin(0)=0, cos(0)=1 -> (0, -1)
        // Fire straight up based on rocket orientation
        vel: new Vector(Math.sin(this.rocket.angle) * 50, -Math.cos(this.rocket.angle) * 50),
        life: 20,
        maxLife: 20,
        color: weapon.id === 'wpn_laser' ? '#ff0000' : (weapon.id === 'wpn_missile' ? '#ffff00' : '#00ffff')
      });
    }
  }

  reachedSpaceMap = new Set<string>();
  laserState: 'idle' | 'charging' | 'firing' = 'idle';
  laserTimer = 0;

  update(gameState: 'FLYING' | 'BUILDING' | 'MAIN_MENU') {
    // Update planetary orbits
    for (const p of PLANETS) {
      if (p.orbit) {
        p.orbit.angle += p.orbit.speed;
        p.pos = p.orbit.center.add(new Vector(Math.cos(p.orbit.angle), Math.sin(p.orbit.angle)).mul(p.orbit.radius));
      }
    }
    
    if (this.rocket) {
      if (gameState === 'BUILDING') {
         // Freeze the rocket and don't process keys
         this.rocket.vel = new Vector(0,0);
         this.rocket.pos = new Vector(0, -10);
         this.rocket.angle = 0;
         this.rocket.angularVel = 0;
         this.rocket.thrusting = false;
         return;
      }
      
      this.rocket.update(this.keys);
      
      // Orbital Laser Cannon
      for (const laser of this.orbitalLasers) {
        if (laser.state === 'idle') {
           if (Math.random() < 0.005) { // Start charging more frequently
              laser.state = 'charging';
              laser.timer = 0;
              this.onMilestone("Warning: Orbital Laser Cannon charging up!");
           }
        } else if (laser.state === 'charging') {
           laser.timer++;
           // Charging visual effect
           if (laser.timer % 10 === 0) {
              this.particles.push({
                pos: laser.pos,
                vel: new Vector((Math.random()-0.5)*10, (Math.random()-0.5)*10),
                life: 30,
                maxLife: 30,
                color: '#ff00ff'
              });
           }
           if (laser.timer >= 180) { // 3 seconds charging
              laser.state = 'firing';
              laser.timer = 0;
           }
        } else if (laser.state === 'firing') {
            if (this.rocket) {
              this.rocket.fuel /= 2; // Half the fuel
              this.onMilestone("Orbital Laser Cannon fired! Fuel halved!");
              // Massive visual effect
              for(let i=0; i<100; i++) {
                  this.particles.push({
                    pos: laser.pos,
                    vel: new Vector((Math.random()-0.5)*50, (Math.random()-0.5)*50),
                    life: 60,
                    maxLife: 60,
                    color: '#ff00ff'
                  });
              }
            }
            laser.state = 'idle';
        }
      }
      
      // Leaks
      for (let i = 0; i < this.rocket.parts.length; i++) {
        const part = this.rocket.parts[i];
        if (part.isWeak && this.rocket.fuel > 0) {
          if (!this.rocket.leakingParts.get(i) && Math.random() < 0.0005) {
            this.rocket.leakingParts.set(i, true);
            this.onMilestone(`A ${part.name} is leaking!`);
          }
          if (this.rocket.leakingParts.get(i)) {
            this.rocket.fuel -= 0.05;
            this.particles.push({
              pos: this.rocket.pos,
              vel: this.rocket.vel.add(new Vector((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5)),
              life: 30,
              maxLife: 30,
              color: '#8b4513'
            });
          }
        }
      }
      
      if (this.rocket.dead) {
        // Create explosion particles
        const hasTNT = this.rocket.parts.some(p => p.id === 'wpn_tnt');
        const particleCount = hasTNT ? 500 : 100;
        const speed = hasTNT ? 40 : 15;
        const lifeFactor = hasTNT ? 2 : 1;
        
        for (let i = 0; i < particleCount; i++) {
          const kind = Math.random();
          let color = '#ffaa00';
          let life = (60 + Math.random() * 40) * lifeFactor;
          let velScale = speed;

          if (kind < 0.15) { // Flash
            color = '#ffffff'; // White flash
            life = (10 + Math.random() * 10) * lifeFactor;
            velScale = speed * 1.5;
          } else if (kind < 0.6) { // Smoke/Debris
            color = hasTNT ? `#${Math.floor(Math.random()*50).toString(16).padStart(2,'0')}${Math.floor(Math.random()*50).toString(16).padStart(2,'0')}${Math.floor(Math.random()*50).toString(16).padStart(2,'0')}` : '#777777'; 
            life = (80 + Math.random() * 80) * lifeFactor;
            velScale = speed * 0.4;
          } else { // Fire
            color = Math.random() > 0.5 ? (hasTNT ? '#ff0000' : '#ff4400') : '#ffaa00';
            life = (60 + Math.random() * 40) * lifeFactor;
            velScale = speed * 0.8;
          }

          this.particles.push({
            pos: this.rocket.pos,
            vel: new Vector((Math.random() - 0.5) * velScale, (Math.random() - 0.5) * velScale),
            life: life,
            maxLife: life,
            color: color
          });
        }
        this.onMilestone(`${this.rocket.name} suffered a rapid unscheduled disassembly.${hasTNT ? " WITH TNT!" : ""}`);
        this.rocket = null; // Clear to prevent infinite explosion
        return;
      }

      // Milestones
      if (this.rocket && !this.inGorgUniverse) {
          const closest = getClosestPlanet(this.rocket.pos);
          if (closest.planet.name === 'Gargantua' && closest.altitude < 10) {
              this.inGorgUniverse = true;
              this.onMilestone("Teleported to the Gorg Universe!");
          }
      }
      const closest = getClosestPlanet(this.rocket.pos);
      if (closest.altitude > 4000 && !this.reachedSpaceMap.has(closest.planet.name)) {
        this.reachedSpaceMap.add(closest.planet.name);
        this.onMilestone(`${this.rocket.name} reached orbit around ${closest.planet.name}!`);
      }
      
      // Landed
      if (closest.altitude < 10 && this.rocket.vel.mag() < 1) {
          if (this.inGorgUniverse) {
              this.onMilestone("A bunch of Gorgs appeared and stole all your fuel!");
              this.rocket.fuel = 0;
          } else {
              this.onUnlockPlanet(closest.planet.name);
          }
      }
      
      if (closest.altitude > 1000000) {
        this.onMilestone(`${this.rocket.name} is hitting the edge of the universe! Engines critical!`);
        // Explode engines - remove some engines
        const engineIndices = this.rocket.parts.map((p, i) => p.type === 'Engine' ? i : -1).filter(i => i !== -1);
        if (engineIndices.length > 0) {
            const index = engineIndices[Math.floor(Math.random() * engineIndices.length)];
            this.rocket.parts.splice(index, 1);
            this.rocket.totalMass -= 20; // Mass of engine
        }
        // Lose fuel quicker - just drain extra fuel
        this.rocket.fuel = Math.max(0, this.rocket.fuel - 10);
      }

      // Add exhaust particles
      if (this.rocket.thrusting) {
        const offset = new Vector(-Math.sin(this.rocket.angle) * 20, Math.cos(this.rocket.angle) * 20);
        this.particles.push({
          pos: this.rocket.pos.add(offset),
          vel: this.rocket.vel.sub(new Vector(Math.sin(this.rocket.angle) * 2, -Math.cos(this.rocket.angle) * 2)).add(new Vector((Math.random()-0.5)*2, (Math.random()-0.5)*2)),
          life: 30,
          maxLife: 30,
          color: '#ffaa00'
        });
      }
      
      // Calculate power generation
      let powerGen = 0;
      for (const p of this.rocket.parts) {
        if (p.powerGeneration) powerGen += p.powerGeneration;
      }
      this.rocket.power += powerGen;
      // Add fuel based on powerGeneration
      this.rocket.fuel = Math.min(this.rocket.maxFuel, this.rocket.fuel + powerGen * 0.05); 
    }
    
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.pos = p.pos.add(p.vel);
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Update satellites
    for (const sat of this.satellites) {
      const acc = getGravityAt(sat.pos);
      sat.vel = sat.vel.add(acc);
      sat.pos = sat.pos.add(sat.vel);
      sat.trail.push(sat.pos);
      if (sat.trail.length > 50) sat.trail.shift();
      const p = getClosestPlanet(sat.pos);
      if (p.altitude < 0) sat.dead = true;
    }
    this.satellites = this.satellites.filter(s => !s.dead);
    
    // Update debris
    for (const d of this.debris) {
        const acc = getGravityAt(d.pos);
        d.vel = d.vel.add(acc);
        d.pos = d.pos.add(d.vel);
    }
    
    // Update rovers
    for (const rover of this.rovers) {
        if (rover.landed && rover.planet) {
             const dist = rover.planet.radius;
             const relativePos = rover.pos.sub(rover.planet.pos);
             rover.angle = (rover.angle || Math.atan2(relativePos.y, relativePos.x)) + 0.02;
             rover.pos = rover.planet.pos.add(new Vector(Math.cos(rover.angle), Math.sin(rover.angle)).mul(dist));
        } else {
             const acc = getGravityAt(rover.pos);
             rover.vel = rover.vel.add(acc);
             rover.pos = rover.pos.add(rover.vel);
             const p = getClosestPlanet(rover.pos);
             if (p.altitude <= 0) {
                 rover.landed = true;
                 rover.vel = new Vector(0,0);
                 if (rover.planet) this.onUnlockPlanet(rover.planet.name);
             }
        }
    }
  }
}

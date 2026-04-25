import { GameEngine } from './GameEngine';
import { PLANETS, getGravityAt, getClosestPlanet } from './Physics';
import { Vector } from './Vector';

export class Renderer {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  
  cameraPos: {x: number, y: number} = {x: 0, y: 0};
  zoom: number = 1;
  targetZoom: number = 1;
  gorgImage: HTMLImageElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.gorgImage = new Image();
    this.gorgImage.src = 'https://i.postimg.cc/DyTH152c/htrwrwyhtytretryeqgyretgryettrewy.png';
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.ctx.canvas.width = w;
    this.ctx.canvas.height = h;
  }
  
  screenToGame(screenX: number, screenY: number): Vector {
      const x = (screenX - this.width / 2) / this.zoom + this.cameraPos.x;
      const y = (screenY - this.height / 2) / this.zoom + this.cameraPos.y;
      return new Vector(x, y);
  }

  render(engine: GameEngine, stations: {id: string, x: number, y: number}[], gameState: 'FLYING' | 'BUILDING' | 'MAIN_MENU') {
    const rx = engine.rocket ? engine.rocket.pos.x : 0;
    const ry = engine.rocket ? engine.rocket.pos.y : 0;
    
    // Smooth camera follow
    if (gameState === 'BUILDING') {
      this.cameraPos.x += (-200 - this.cameraPos.x) * 0.1; // Shifted left so rocket appears on right
      this.cameraPos.y += (-100 - this.cameraPos.y) * 0.1;
      this.targetZoom = 1.5; // Zoom in for building
    } else {
      this.cameraPos.x += (rx - this.cameraPos.x) * 0.1;
      this.cameraPos.y += (ry - this.cameraPos.y) * 0.1;
    }

    this.zoom += (this.targetZoom - this.zoom) * 0.1;

    // Clear background (Deep space black)
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Stars
    this.ctx.fillStyle = `rgba(255,255,255,0.6)`;
    for(let i=0; i<300; i++) {
        const sx = ((Math.sin(i * 12.9898) * 43758.5453) * 10000 - this.cameraPos.x * (0.01 + i%3 * 0.05)) % this.width;
        const sy = ((Math.cos(i * 78.233) * 43758.5453) * 10000 - this.cameraPos.y * (0.01 + i%3 * 0.05)) % this.height;
        this.ctx.fillRect((sx + this.width)%this.width, (sy+this.height)%this.height, 1, 1);
    }

    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(-this.cameraPos.x, -this.cameraPos.y);

    // Draw Launch Pad
    this.ctx.fillStyle = '#555';
    this.ctx.fillRect(-50, -20, 100, 20);

    // Draw Planets
    for (const p of PLANETS) {
      if (p.hasAtmosphere) {
        // Draw Atmosphere Glow
        this.ctx.beginPath();
        this.ctx.arc(p.pos.x, p.pos.y, p.radius + 4000, 0, Math.PI * 2);
        const grad = this.ctx.createRadialGradient(p.pos.x, p.pos.y, p.radius, p.pos.x, p.pos.y, p.radius + 4000);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = grad;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
      
      // Draw Planet Core
      if (engine.inGorgUniverse && this.gorgImage && this.gorgImage.complete) {
          this.ctx.drawImage(this.gorgImage, p.pos.x - p.radius, p.pos.y - p.radius, p.radius * 2, p.radius * 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        
        // Draw surface texture or line just so it's not totally solid
        this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        this.ctx.lineWidth = 100;
        this.ctx.stroke();
      }

      // Label
      this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
      this.ctx.font = 'bold 400px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(p.name, p.pos.x, p.pos.y);
    }

    // Draw Bases
    for (const base of engine.bases) {
        this.ctx.save();
        this.ctx.translate(base.pos.x, base.pos.y);
        
        // Base main structure
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(-20, -10, 40, 20);
        
        // Base details (windows/antennas)
        this.ctx.fillStyle = '#888';
        this.ctx.fillRect(-15, -15, 10, 5); // dish part
        this.ctx.fillRect(-18, -5, 5, 15); // leg
        this.ctx.fillRect(13, -5, 5, 15); // leg
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(-5, -5, 10, 10); // window
        
        this.ctx.restore();
    }
    
    // Draw Debris
    for (const d of engine.debris) {
        this.ctx.save();
        this.ctx.translate(d.pos.x, d.pos.y);
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillRect(-5, -5, 10, 10);
        this.ctx.restore();
    }
    
    // Draw Stations
    for (const st of stations) {
      this.ctx.save();
      this.ctx.translate(st.x, st.y);
      // Ensure orientation is nice 
      const normal = new Vector(st.x, st.y).normalize(); 
      this.ctx.rotate(Math.atan2(normal.x, -normal.y));
      this.ctx.fillStyle = '#00aaff';
      this.ctx.fillRect(-40, -10, 80, 20); // solar panels
      this.ctx.fillStyle = '#ddd';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw Satellites
    for (const sat of engine.satellites) {
      // Draw Trail
      if (sat.trail.length > 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
        this.ctx.lineWidth = 2 / this.zoom;
        this.ctx.moveTo(sat.trail[0].x, sat.trail[0].y);
        for (let i = 1; i < sat.trail.length; i++) {
          this.ctx.lineTo(sat.trail[i].x, sat.trail[i].y);
        }
        this.ctx.stroke();
      }

      this.ctx.save();
      this.ctx.translate(sat.pos.x, sat.pos.y);
      this.ctx.rotate(Math.atan2(sat.vel.x, -sat.vel.y));
      
      this.ctx.fillStyle = '#aaaaaa';
      this.ctx.fillRect(-6, -10, 12, 20); // main body
      
      this.ctx.fillStyle = '#1e90ff';
      this.ctx.fillRect(-20, -5, 14, 10); // left panel
      this.ctx.fillRect(6, -5, 14, 10); // right panel
      
      this.ctx.strokeStyle = '#dddddd';
      this.ctx.beginPath();
      this.ctx.moveTo(0, -10);
      this.ctx.lineTo(0, -25);
      this.ctx.stroke();
      
      this.ctx.restore();
    }

    // Draw Rovers
    for (const rover of engine.rovers) {
      this.ctx.save();
      this.ctx.translate(rover.pos.x, rover.pos.y);
      
      // Face rover based on surface normal (if landed)
      if (rover.landed) {
          const p = getClosestPlanet(rover.pos);
          const normal = rover.pos.sub(p.planet.pos).normalize();
          this.ctx.rotate(Math.atan2(normal.x, -normal.y));
      }
      
      this.ctx.fillStyle = '#d2691e';
      this.ctx.fillRect(-10, -5, 20, 10); // body
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(-12, -7, 6, 4); // wheels
      this.ctx.fillRect(6, -7, 6, 4);
      this.ctx.fillRect(-12, 3, 6, 4);
      this.ctx.fillRect(6, 3, 6, 4);

      this.ctx.restore();
    }

    // Draw Orbital Trajectory
    if (engine.rocket && !engine.rocket.dead && gameState === 'FLYING') {
       this.ctx.beginPath();
       this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
       this.ctx.lineWidth = 3 / this.zoom;
       let simPos = new Vector(engine.rocket.pos.x, engine.rocket.pos.y);
       let simVel = new Vector(engine.rocket.vel.x, engine.rocket.vel.y);
       this.ctx.moveTo(simPos.x, simPos.y);
       
       for (let i = 0; i < 400; i++) { // Predict next N ticks
           // Add gravity
           simVel = simVel.add(getGravityAt(simPos));
           simPos = simPos.add(simVel);
           
           // Check planet hit
           let hit = false;
           for (const p of PLANETS) {
               if (simPos.sub(p.pos).mag() < p.radius) hit = true;
           }
           if (hit) break;
           
           // Draw line incrementally
           if (i % 6 === 0) this.ctx.lineTo(simPos.x, simPos.y);
       }
       this.ctx.stroke();
    }

    // Draw Orbital Lasers
    for (const las of engine.orbitalLasers) {
      if (las.dead) continue;
      this.ctx.save();
      this.ctx.translate(las.pos.x, las.pos.y);
      
      // Different visuals based on state
      if (las.state === 'idle') {
          this.ctx.fillStyle = '#666';
          this.ctx.fillRect(-10, -10, 20, 20); // Basic cargo box
      } else if (las.state === 'charging') {
          this.ctx.fillStyle = '#ff00ff';
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 10 + Math.sin(las.timer * 0.2) * 5, 0, Math.PI * 2);
          this.ctx.fill();
      } else if (las.state === 'firing') {
          // Draw a huge laser line from las.pos to engine.rocket.pos
          if (engine.rocket) {
              this.ctx.beginPath();
              this.ctx.moveTo(0, 0); 
              this.ctx.lineTo(engine.rocket.pos.x - las.pos.x, engine.rocket.pos.y - las.pos.y);
              this.ctx.strokeStyle = '#ff00ff';
              this.ctx.lineWidth = 10; // Huge laser
              this.ctx.stroke();
          }
      }
      
      this.ctx.restore();
    }
    
    // Draw Particles
    for (const p of engine.particles) {
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.pos.x, p.pos.y, 4, 0, Math.PI*2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

    // Draw Rocket
    if (engine.rocket) {
      this.ctx.save();
      this.ctx.translate(engine.rocket.pos.x, engine.rocket.pos.y);
      this.ctx.rotate(engine.rocket.angle);
      
      if (!engine.rocket.dead) {
        // Draw parts bottom to top
        let yOffset = 0;
        for (let i = engine.rocket.parts.length - 1; i >= 0; i--) {
          const part = engine.rocket.parts[i];
          
          let w = 20, h = 30;
          this.ctx.fillStyle = '#666';
          this.ctx.strokeStyle = '#222';
          this.ctx.lineWidth = 2;

          if (part.type === 'Command') {
             this.ctx.fillStyle = part.id.includes('ai') ? '#1e1e1e' : (part.id.includes('nex') ? '#f0f0f0' : (part.id.includes('gyro') ? '#555' : (part.id.includes('rcs') ? '#777' : (part.id.includes('auto') ? '#333' : (part.id.includes('leader') ? '#ffd700' : '#ddd')))));
             if (part.id.includes('lrg')) { w = 24; h = 35; }
             if (part.id.includes('nex')) { w = 40; h = 40; }
             if (part.id.includes('probe')) { w = 10; h = 14; }
             if (part.id.includes('ai')) { w = 14; h = 14; }
             if (part.id.includes('gyro')) { w = 24; h = 10; }
             if (part.id.includes('rcs')) { w = 24; h = 10; }
             if (part.id.includes('auto')) { w = 20; h = 15; }
             if (part.id.includes('leader')) { w = 26; h = 26; }

             this.ctx.beginPath();
             if (part.id === 'cmd_ai' || part.id === 'cmd_probe') {
               this.ctx.arc(0, yOffset - h/2, w/2, 0, Math.PI*2);
             } else if (part.id === 'cmd_gyro') {
                this.ctx.ellipse(0, yOffset - h/2, w/2, h/2, 0, 0, Math.PI*2);
                this.ctx.stroke();
                this.ctx.arc(0, yOffset - h/2, 4, 0, Math.PI*2); // inner spinning part
             } else if (part.id === 'cmd_rcs') {
                this.ctx.fillRect(-w/2, yOffset - h, w, h);
                this.ctx.fillRect(-w/2 - 5, yOffset - h + 2, 5, 5); // rcs port
                this.ctx.fillRect(w/2, yOffset - h + 2, 5, 5); // rcs port
             } else {
               this.ctx.moveTo(-w/2, yOffset);
               this.ctx.lineTo(w/2, yOffset);
               if (part.id.includes('nex')) {
                 this.ctx.lineTo(w/2, yOffset - h + 10);
                 this.ctx.lineTo(0, yOffset - h);
                 this.ctx.lineTo(-w/2, yOffset - h + 10);
               } else if (part.id.includes('auto')) {
                  this.ctx.lineTo(w/2, yOffset - h);
                  this.ctx.lineTo(-w/2, yOffset - h);
                  // screen representation
                  this.ctx.strokeRect(-w/2 + 2, yOffset - h + 2, w - 4, h - 4);
               } else if (part.id.includes('leader')) {
                   this.ctx.lineTo(w/2, yOffset - h);
                   this.ctx.lineTo(-w/2, yOffset - h);
                   // Leader core aura
                   this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                   this.ctx.arc(0, yOffset - h/2, w/2 + 5, 0, Math.PI*2);
                   this.ctx.fill();
                   this.ctx.fillStyle = '#ffd700';
               } else {
                 this.ctx.lineTo(0, yOffset - h);
               }
             }
             this.ctx.closePath();
             this.ctx.fill();
             this.ctx.stroke();

             // Add a glowing core for AI
             if (part.id === 'cmd_ai') {
               this.ctx.fillStyle = '#ff3333';
               this.ctx.beginPath();
               this.ctx.arc(0, yOffset - h/2, 3, 0, Math.PI*2);
               this.ctx.fill();
             }
             yOffset -= h;

          } else if (part.type === 'Structural') {
             if (part.id === 'struct_nose') {
               w = 20; h = 40;
               this.ctx.fillStyle = '#fefefe';
               this.ctx.beginPath();
               this.ctx.moveTo(-w/2, yOffset);
               this.ctx.lineTo(w/2, yOffset);
               this.ctx.quadraticCurveTo(0, yOffset - h/2, 0, yOffset - h);
               this.ctx.closePath();
               this.ctx.fill();
               this.ctx.stroke();
               yOffset -= h;
             } else if (part.id === 'struct_tape') {
               w = 22; h = 2;
               this.ctx.fillStyle = '#silver';
               this.ctx.fillRect(-w/2, yOffset - h, w, h);
               yOffset -= h;
             } else if (part.id === 'struct_hull') {
               w = 24; h = 30;
               this.ctx.fillStyle = '#444';
               this.ctx.fillRect(-w/2, yOffset - h, w, h);
               this.ctx.strokeRect(-w/2, yOffset - h, w, h);
               yOffset -= h;
             } else {
               // Truss
               w = 10; h = 20;
               this.ctx.fillStyle = '#555';
               this.ctx.fillRect(-w/2, yOffset - h, w, h);
               this.ctx.strokeRect(-w/2, yOffset - h, w, h);
               this.ctx.beginPath();
               this.ctx.moveTo(-w/2, yOffset);
               this.ctx.lineTo(w/2, yOffset - h);
               this.ctx.moveTo(w/2, yOffset);
               this.ctx.lineTo(-w/2, yOffset - h);
               this.ctx.stroke();
               yOffset -= h;
             }
          } else {
             // General blocks (Fuel, Engine, Cargo, Weapon)
             if (part.type === 'Engine') { 
               this.ctx.fillStyle = part.id.includes('warp') ? '#4b0082' : part.id.includes('nuke') ? '#2e8b57' : '#666';
               w = part.id.includes('boost') ? 22 : (part.id.includes('warp') ? 30 : 16); 
               h = part.id.includes('adv') ? 24 : (part.id.includes('warp') ? 15 : 20); 
             } else if (part.type === 'Fuel') {
               this.ctx.fillStyle = part.id.includes('anti') ? '#00ffff' : part.id.includes('sludge') ? '#556b2f' : '#aaa';
               w = part.id.includes('hug') ? 28 : (part.id.includes('anti') ? 16 : part.id.includes('lrg') ? 24 : part.id.includes('med') ? 22 : 20);
               h = part.id.includes('hug') ? 40 : (part.id.includes('anti') ? 20 : part.id.includes('med') ? 25 : 30);
             } else if (part.type === 'Cargo') {
               this.ctx.fillStyle = part.id.includes('hab') ? '#ffffff' : part.id.includes('sat') ? '#8888ff' : '#00aaff';
               w = part.id.includes('lrg') ? 28 : (part.id.includes('hab') ? 32 : part.id.includes('med') ? 24 : 20);
               h = part.id.includes('hab') ? 36 : part.id.includes('med') ? 25 : part.id.includes('sat') || part.id.includes('rover') ? 20 : 30;
             } else if (part.type === 'Weapon') {
               this.ctx.fillStyle = part.id === 'wpn_tnt' ? '#ff0000' : '#444';
               w = 20; h = 20;
             }

             if (part.id === 'eng_warp') {
               // Warp rings
               this.ctx.beginPath();
               this.ctx.ellipse(0, yOffset - h/2, w/2 + 5, h/2, 0, 0, Math.PI*2);
               this.ctx.stroke();
               this.ctx.fillRect(-w/2, yOffset - h, w, h);
             } else {
               this.ctx.fillRect(-w/2, yOffset - h, w, h);
               this.ctx.strokeRect(-w/2, yOffset - h, w, h);
             }

             // Detail lines for hab
             if (part.id === 'cargo_hab') {
               this.ctx.fillStyle = '#87ceeb'; // Windows
               this.ctx.beginPath();
               this.ctx.arc(-8, yOffset - h/2, 4, 0, Math.PI*2);
               this.ctx.arc(8, yOffset - h/2, 4, 0, Math.PI*2);
               this.ctx.fill();
             }

             // Core for antimatter
             if (part.id === 'fuel_anti') {
               this.ctx.fillStyle = '#ffffff';
               this.ctx.fillRect(-2, yOffset - h + 2, 4, h - 4);
             }
             
             yOffset -= h;
          }
        }
      }

      this.ctx.restore();
    }

    this.ctx.restore();

    // Draw UI Overlay 
    if (engine.rocket && gameState === 'FLYING') {
      this.ctx.save();
      this.ctx.fillStyle = 'white';
      this.ctx.font = '14px "JetBrains Mono", monospace';
      
      const closest = getClosestPlanet(engine.rocket.pos);
      const alt = Math.floor(closest.altitude);
      const speed = Math.floor(engine.rocket.vel.mag() * 10);
      const fuelPct = engine.rocket.maxFuel > 0 ? Math.max(0, engine.rocket.fuel / engine.rocket.maxFuel) : 0;
      
      this.ctx.fillText(`ALT: ${alt < 0 ? 0 : alt}m (${closest.planet.name})`, 20, 40);
      this.ctx.fillText(`SPD: ${speed}m/s`, 20, 60);
      
      this.ctx.fillText(`FUEL:`, 20, 90);
      this.ctx.fillStyle = '#444';
      this.ctx.fillRect(70, 80, 100, 10);
      this.ctx.fillStyle = fuelPct > 0.2 ? '#55aa55' : '#aa5555';
      this.ctx.fillRect(70, 80, 100 * fuelPct, 10);
      
      if (engine.rocket.dead) {
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = 'bold 32px sans-serif';
        this.ctx.fillText('CRASHED', this.width / 2 - 80, this.height / 2 - 50);
      }
      this.ctx.restore();
    }
  }
}

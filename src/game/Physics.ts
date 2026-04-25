import { Vector } from './Vector';

export interface Planet {
  pos: Vector;
  radius: number;
  mass: number;
  color: string;
  name: string;
  hasAtmosphere?: boolean;
  orbit?: {
    center: Vector;
    radius: number;
    angle: number;
    speed: number;
  };
  description: string;
}

export const PLANETS: Planet[] = [
  { pos: new Vector(0, 3000), radius: 3000, mass: 900000, color: '#2d5a27', name: 'Earth', hasAtmosphere: true, description: 'Home of humanity. Lush, green, and full of life.' },
  { pos: new Vector(10000, 3000), radius: 400, mass: 15000, color: '#cccccc', name: 'Luna', hasAtmosphere: false, orbit: { center: new Vector(0, 3000), radius: 10000, angle: 0, speed: 0.005 }, description: 'A quiet, cratered moon orbiting Earth.' },
  { pos: new Vector(0, -25000), radius: 1000, mass: 80000, color: '#aa5555', name: 'Marsia', hasAtmosphere: true, description: 'A rusty red world with high mountains and deep canyons.' },
  { pos: new Vector(35000, -10000), radius: 1500, mass: 150000, color: '#55aa55', name: 'Verdant', hasAtmosphere: true, description: 'A world covered in dense jungles and ancient forests.' },
  { pos: new Vector(-30000, -5000), radius: 1200, mass: 120000, color: '#5555aa', name: 'Aqua', hasAtmosphere: true, description: 'An ocean world with scattered archipelagoes.' },
  { pos: new Vector(-18000, 25000), radius: 1800, mass: 200000, color: '#add8e6', name: 'Glacia', hasAtmosphere: true, description: 'A frozen wasteland where ice crystals sparkle under the sun.' },
  { pos: new Vector(18000, -35000), radius: 1400, mass: 140000, color: '#d35400', name: 'Vulcan', hasAtmosphere: true, description: 'A volcanic world with active lava rivers.' },
  { pos: new Vector(-45000, -35000), radius: 2500, mass: 450000, color: '#1a1a2e', name: 'Umbra', hasAtmosphere: false, description: 'A planet shrouded in eternal twilight.' },
  { pos: new Vector(20000, 30000), radius: 5000, mass: 4000000, color: '#ddaaaa', name: 'Gargantua', hasAtmosphere: true, description: 'A massive super-earth with incredibly high gravity.' },
  { pos: new Vector(60000, -20000), radius: 2200, mass: 280000, color: '#c2b280', name: 'Desertia', hasAtmosphere: true, description: 'Endless dunes and secret buried cities.' },
  { pos: new Vector(80000, 10000), radius: 3500, mass: 800000, color: '#ffb347', name: 'Ignis', hasAtmosphere: true, description: 'A world of constant wildfires and hot winds.' },
  { pos: new Vector(-60000, 20000), radius: 800, mass: 40000, color: '#e0e0e0', name: 'Selene', hasAtmosphere: false, description: 'A small, silver moon that glows softly.' },
  { pos: new Vector(5000, -50000), radius: 1100, mass: 100000, color: '#9932cc', name: 'Nebula', hasAtmosphere: true, description: 'A purple planet surrounded by iridescent clouds.' },
  { pos: new Vector(25000, -45000), radius: 450, mass: 18000, color: '#696969', name: 'Asterix', hasAtmosphere: false, description: 'A tiny, metallic rock rich in rare minerals.' },
  { pos: new Vector(-15000, -55000), radius: 3200, mass: 950000, color: '#4169e1', name: 'Oceanus', hasAtmosphere: true, description: 'A world entirely covered by a single, deep ocean.' },
  { pos: new Vector(-70000, -50000), radius: 2000, mass: 250000, color: '#ff4500', name: 'Solara', hasAtmosphere: true, description: 'A planet bathed in intense, golden light. Famous for its solar energy harvesting potential.' },
  { pos: new Vector(90000, -50000), radius: 4000, mass: 1200000, color: '#8b008b', name: 'Aetheria', hasAtmosphere: true, description: 'Floating islands hover above this mysterious planet. A paradise for explorers.' },
  { pos: new Vector(-90000, 30000), radius: 1500, mass: 150000, color: '#00ced1', name: 'Cryon', hasAtmosphere: true, description: 'Everything on this planet is preserved in a state of suspended animation due to extreme cold.' },
  { pos: new Vector(-30000, -80000), radius: 2800, mass: 650000, color: '#6a5acd', name: 'Spectra', hasAtmosphere: true, description: 'A planet with rainbow auroras dancing across the sky constantly.' },
  { pos: new Vector(50000, 70000), radius: 600, mass: 50000, color: '#fffacd', name: 'Lemonia', hasAtmosphere: false, description: 'A tart-smelling, yellow desert world.' },
  { pos: new Vector(-100000, 0), radius: 5000, mass: 5000000, color: '#2f4f4f', name: 'Obscurus', hasAtmosphere: false, description: 'A dark, brooding gas giant that swallows all light.' },
  { pos: new Vector(100000, 100000), radius: 3000, mass: 900000, color: '#00ff7f', name: 'Veridiana', hasAtmosphere: true, description: 'A lush, emerald world with giant, bioluminescent mushrooms.' },
  { pos: new Vector(-50000, -50000), radius: 1000, mass: 70000, color: '#d3d3d3', name: 'Argentum', hasAtmosphere: false, description: 'A silver-surfaced world rich in rare reflective metals.' },
  { pos: new Vector(40000, -80000), radius: 2500, mass: 400000, color: '#ff6347', name: 'Pyros', hasAtmosphere: true, description: 'Hot, scorching sands and constant meteor showers.' },
  { pos: new Vector(-70000, 50000), radius: 2000, mass: 280000, color: '#87ceeb', name: 'Aero', hasAtmosphere: true, description: 'A wind-swept planet with giant, floating air-ships.' },
  { pos: new Vector(10000, -70000), radius: 1200, mass: 150000, color: '#bc8f8f', name: 'Rustica', hasAtmosphere: true, description: 'A scrapyard world full of ancient, metallic relics.' },
   { pos: new Vector(-120000, 30000), radius: 300, mass: 5000, color: '#f0e68c', name: 'Goldie', hasAtmosphere: false, description: 'A tiny moon made almost entirely of raw gold.' },
  { pos: new Vector(60000, 80000), radius: 2500, mass: 500000, color: '#483d8b', name: 'Indigo', hasAtmosphere: true, description: 'A deep blue world submerged in perpetual evening.' },
  { pos: new Vector(-30000, 90000), radius: 2000, mass: 300000, color: '#cd5c5c', name: 'Terra-Rossa', hasAtmosphere: true, description: 'A warm, reddish world ideal for building settlements.' },
  { pos: new Vector(90000, -20000), radius: 1500, mass: 200000, color: '#8fbc8f', name: 'Jade', hasAtmosphere: true, description: 'A tranquil forest world resembling rare jade stone.' },
  { pos: new Vector(-110000, -60000), radius: 2500, mass: 400000, color: '#20b2aa', name: 'Teal-Haven', hasAtmosphere: true, description: 'A serene planet with turquoise seas and calm skies.' },
  { pos: new Vector(0, -90000), radius: 1000, mass: 80000, color: '#778899', name: 'Ironia', hasAtmosphere: true, description: 'A high-gravity planet rich in magnetic iron deposits.' },
  { pos: new Vector(-100000, 100000), radius: 2000, mass: 300000, color: '#add8e6', name: 'Zephyr', hasAtmosphere: true, description: 'A gas giant with incredibly fast winds.' },
  { pos: new Vector(100000, 100000), radius: 1500, mass: 200000, color: '#00008b', name: 'Boreas', hasAtmosphere: false, description: 'A freezing, desolate world of blue ice.' },
  { pos: new Vector(-100000, -100000), radius: 2500, mass: 400000, color: '#8b0000', name: 'Crimson', hasAtmosphere: true, description: 'A deep red planet covered in volcanic activity.' },
  { pos: new Vector(100000, -100000), radius: 1800, mass: 250000, color: '#00bfff', name: 'Azure', hasAtmosphere: true, description: 'A beautiful blue marble with large continents.' },
  { pos: new Vector(0, 150000), radius: 2200, mass: 350000, color: '#006400', name: 'Emerald', hasAtmosphere: true, description: 'A lush, forest-covered world thriving with wildlife.' },
  { pos: new Vector(150000, 0), radius: 2500, mass: 400000, color: '#f4a460', name: 'Sahara', hasAtmosphere: true, description: 'An endless, sweltering hot desert planet.' },
  { pos: new Vector(0, -150000), radius: 3000, mass: 500000, color: '#000033', name: 'Abyss', hasAtmosphere: false, description: 'An ocean planet completely covered in dark, deep water.' },
  { pos: new Vector(-150000, 0), radius: 2800, mass: 450000, color: '#808080', name: 'Titan', hasAtmosphere: false, description: 'A massive, rocky world rich in heavy metals.' },
  { pos: new Vector(-130000, 130000), radius: 1900, mass: 280000, color: '#ffd700', name: 'Vesta', hasAtmosphere: true, description: 'A brightly lit, sunny planet with golden beaches.' },
  { pos: new Vector(130000, 130000), radius: 1600, mass: 220000, color: '#9932cc', name: 'Iris', hasAtmosphere: true, description: 'A colourful, vibrant planet with shifting landscapes.' },
  { pos: new Vector(-130000, -130000), radius: 1700, mass: 240000, color: '#4b0082', name: 'Chronos', hasAtmosphere: true, description: 'A mysterious planet where time seems to slow down.' },
  { pos: new Vector(130000, -130000), radius: 2100, mass: 320000, color: '#ff4500', name: 'Helios', hasAtmosphere: true, description: 'A blazing, sun-kissed world near a star.' },
  { pos: new Vector(-170000, 170000), radius: 1800, mass: 260000, color: '#556b2f', name: 'Tundra', hasAtmosphere: true, description: 'A cold, vast plains planet covered in moss.' },
  { pos: new Vector(170000, 170000), radius: 2000, mass: 290000, color: '#2e8b57', name: 'Gaius', hasAtmosphere: true, description: 'A thriving, green world similar to ancient Earth.' },
  { pos: new Vector(-170000, -170000), radius: 1200, mass: 180000, color: '#daa520', name: 'Midas', hasAtmosphere: false, description: 'A legendary planet rumored to be made of gold.' },
  { pos: new Vector(170000, -170000), radius: 2300, mass: 360000, color: '#d3d3d3', name: 'Orion', hasAtmosphere: false, description: 'A planet famous for its perfect, ringed system.' },
  { pos: new Vector(0, 200000), radius: 2200, mass: 330000, color: '#708090', name: 'Echo', hasAtmosphere: false, description: 'A mountainous planet known for its strange sound reflections.' },
  { pos: new Vector(200000, 0), radius: 1900, mass: 270000, color: '#ff8c00', name: 'Dusk', hasAtmosphere: true, description: 'A planet of perpetual, haunting sunset colors.' },
  { pos: new Vector(0, -200000), radius: 2400, mass: 370000, color: '#9370db', name: 'Aurora', hasAtmosphere: true, description: 'A beautiful world forever bathed in light displays.' },
  { pos: new Vector(-200000, 0), radius: 1700, mass: 230000, color: '#b22222', name: 'Phoenix', hasAtmosphere: true, description: 'A rebirth planet where new life arises from ancient ash.' },
  { pos: new Vector(300000, 300000), radius: 600, mass: 50000, color: '#ff0000', name: 'Crimson Prime', hasAtmosphere: false, description: 'A harsh red world.' },
  { pos: new Vector(400000, -300000), radius: 700, mass: 60000, color: '#00ff00', name: 'Verdant Haven', hasAtmosphere: true, description: 'Lush green forests.' },
  { pos: new Vector(-300000, 400000), radius: 800, mass: 70000, color: '#0000ff', name: 'Azure Reach', hasAtmosphere: false, description: 'A blue expanse of ice.' },
  { pos: new Vector(-500000, -500000), radius: 900, mass: 80000, color: '#ffff00', name: 'Glimmer Core', hasAtmosphere: true, description: 'Shimmering plains.' },
  { pos: new Vector(600000, 200000), radius: 1000, mass: 90000, color: '#ff00ff', name: 'Shadow Nexus', hasAtmosphere: false, description: 'A mysterious dark world.' },
  { pos: new Vector(-200000, 600000), radius: 1100, mass: 100000, color: '#00ffff', name: 'Silent Void', hasAtmosphere: true, description: 'A quiet, hollow world.' },
  { pos: new Vector(800000, -100000), radius: 1200, mass: 110000, color: '#ffffff', name: 'Echo Beacon', hasAtmosphere: false, description: 'Emits a strange rhythmic pulse.' },
  { pos: new Vector(-900000, -300000), radius: 1300, mass: 120000, color: '#888888', name: 'Vortex Cradle', hasAtmosphere: true, description: 'A cradle of storms.' },
  { pos: new Vector(100000, 900000), radius: 1400, mass: 130000, color: '#555555', name: 'Zenith Spire', hasAtmosphere: false, description: 'A towering peak planet.' },
  { pos: new Vector(-400000, -800000), radius: 1500, mass: 140000, color: '#444444', name: 'Mystic Drift', hasAtmosphere: true, description: 'A world of floating islands.' },
  { pos: new Vector(200000, -500000), radius: 1600, mass: 150000, color: '#333333', name: 'Starry Realm', hasAtmosphere: false, description: 'Brilliant starlight reflected off its surface.' },
  { pos: new Vector(-600000, 300000), radius: 1700, mass: 160000, color: '#222222', name: 'Radiant Gate', hasAtmosphere: true, description: 'A portal-like bright world.' },
  { pos: new Vector(700000, -700000), radius: 1800, mass: 170000, color: '#666666', name: 'Celestial Pulse', hasAtmosphere: false, description: 'A world that pulses with light.' },
  { pos: new Vector(-100000, 900000), radius: 1900, mass: 180000, color: '#999999', name: 'Ethereal Spark', hasAtmosphere: true, description: 'Flickering aura.' },
  { pos: new Vector(900000, 100000), radius: 2000, mass: 190000, color: '#aaaaaa', name: 'Lunar Veil', hasAtmosphere: false, description: 'Veiled in silver dust.' },
  { pos: new Vector(-800000, -200000), radius: 2100, mass: 200000, color: '#bbbbbb', name: 'Solar Throne', hasAtmosphere: true, description: 'A world commanding the star.' },
  { pos: new Vector(500000, 600000), radius: 2200, mass: 210000, color: '#cccccc', name: 'Crimson Prime II', hasAtmosphere: false, description: 'Brother to the first.' },
  { pos: new Vector(-200000, -900000), radius: 2300, mass: 220000, color: '#dddddd', name: 'Verdant Haven II', hasAtmosphere: true, description: 'More forests.' },
  { pos: new Vector(300000, 800000), radius: 2400, mass: 230000, color: '#eeeeee', name: 'Azure Reach II', hasAtmosphere: false, description: 'More ice.' },
  { pos: new Vector(-700000, 400000), radius: 2500, mass: 240000, color: '#111111', name: 'Glimmer Core II', hasAtmosphere: true, description: 'More shimmer.' },
  { pos: new Vector(400000, -900000), radius: 2600, mass: 250000, color: '#222222', name: 'Shadow Nexus II', hasAtmosphere: false, description: 'More darkness.' },
  { pos: new Vector(-900000, 500000), radius: 2700, mass: 260000, color: '#333333', name: 'Silent Void II', hasAtmosphere: true, description: 'More silence.' },
  { pos: new Vector(100000, -300000), radius: 2800, mass: 270000, color: '#444444', name: 'Echo Beacon II', hasAtmosphere: false, description: 'More pulses.' },
  { pos: new Vector(-300000, 200000), radius: 2900, mass: 280000, color: '#555555', name: 'Vortex Cradle II', hasAtmosphere: true, description: 'More storms.' },
  { pos: new Vector(600000, -100000), radius: 3000, mass: 290000, color: '#666666', name: 'Zenith Spire II', hasAtmosphere: false, description: 'More peaks.' },
  { pos: new Vector(-200000, 700000), radius: 3100, mass: 300000, color: '#777777', name: 'Mystic Drift II', hasAtmosphere: true, description: 'More islands.' },
  { pos: new Vector(800000, 300000), radius: 3200, mass: 310000, color: '#888888', name: 'Starry Realm II', hasAtmosphere: false, description: 'More stars.' },
  { pos: new Vector(-400000, -600000), radius: 3300, mass: 320000, color: '#999999', name: 'Radiant Gate II', hasAtmosphere: true, description: 'More brightness.' },
  { pos: new Vector(900000, -400000), radius: 3400, mass: 330000, color: '#aaaaaa', name: 'Celestial Pulse II', hasAtmosphere: false, description: 'More pulses.' },
  { pos: new Vector(-500000, 800000), radius: 3500, mass: 340000, color: '#bbbbbb', name: 'Ethereal Spark II', hasAtmosphere: true, description: 'More flickers.' },
  { pos: new Vector(950000, 950000), radius: 500, mass: 10000, color: '#ffaaaa', name: 'Lunar Veil II', hasAtmosphere: false, description: 'More silver dust.' },
  { pos: new Vector(-950000, -950000), radius: 600, mass: 20000, color: '#aaffaa', name: 'Solar Throne II', hasAtmosphere: true, description: 'More solar.' }
];



export function getGravityAt(pos: Vector): Vector {
  let g = new Vector(0, 0);

  // Planet radial gravity
  for (const p of PLANETS) {
    const diff = p.pos.sub(pos);
    const dist = diff.mag();
    if (dist > p.radius * 0.9) { 
      const force = p.mass / (dist * dist);
      g = g.add(diff.normalize().mul(force));
    }
  }

  return g;
}

export function getClosestPlanet(pos: Vector): { planet: Planet, dist: number, altitude: number } {
  let closest = PLANETS[0];
  let minDist = Infinity;
  for (const p of PLANETS) {
    const d = pos.sub(p.pos).mag();
    if (d < minDist) {
      minDist = d;
      closest = p;
    }
  }
  return { planet: closest, dist: minDist, altitude: minDist - closest.radius };
}

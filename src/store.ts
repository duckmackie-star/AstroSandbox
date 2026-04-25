import { create } from 'zustand';

export type PartType = 'Command' | 'Fuel' | 'Engine' | 'Cargo' | 'Structural' | 'Weapon';

export interface RocketPart {
  id: string;
  type: PartType;
  name: string;
  mass: number;
  capacity?: number; // Fuel capacity or cargo space
  thrust?: number;
  powerGeneration?: number;
  buffFactor?: number;
  cost: number;
  isWeak?: boolean;
}

export const CATALOG: Record<string, RocketPart> = {
  cmd_probe: { id: 'cmd_probe', type: 'Command', name: 'Tiny Probe', mass: 0.5, cost: 0 },
  cmd_ai: { id: 'cmd_ai', type: 'Command', name: 'AI Core', mass: 2, cost: 0 },
  cmd_basic: { id: 'cmd_basic', type: 'Command', name: 'Basic Pod', mass: 10, cost: 0 },
  cmd_adv: { id: 'cmd_adv', type: 'Command', name: 'Advanced Pod', mass: 15, cost: 0 },
  cmd_lrg: { id: 'cmd_lrg', type: 'Command', name: 'Heavy Pod', mass: 30, cost: 0 },
  cmd_nex: { id: 'cmd_nex', type: 'Command', name: 'Orbital Nexus', mass: 80, cost: 0 },
  cmd_gyro: { id: 'cmd_gyro', type: 'Command', name: 'Gyroscope', mass: 5, cost: 0 },
  cmd_rcs: { id: 'cmd_rcs', type: 'Command', name: 'RCS Thrusters', mass: 4, cost: 0 },
  cmd_auto: { id: 'cmd_auto', type: 'Command', name: 'Auto-pilot', mass: 2, cost: 0 },
  cmd_leader: { id: 'cmd_leader', type: 'Command', name: 'Leader Core', mass: 10, buffFactor: 1.2, cost: 0 },
  
  struct_tape: { id: 'struct_tape', type: 'Structural', name: 'Space Tape', mass: 0.1, cost: 0 },
  struct_truss: { id: 'struct_truss', type: 'Structural', name: 'Truss', mass: 2, cost: 0 },
  struct_nose: { id: 'struct_nose', type: 'Structural', name: 'Aero Nose', mass: 3, cost: 0 },
  struct_separator: { id: 'struct_separator', type: 'Structural', name: 'Stage Separator', mass: 1, cost: 0 },
  struct_hull: { id: 'struct_hull', type: 'Structural', name: 'Heavy Hull', mass: 10, cost: 0 },
  struct_solar: { id: 'struct_solar', type: 'Structural', name: 'Solar Panel', mass: 2, powerGeneration: 0.1, cost: 0 },
  struct_rubber: { id: 'struct_rubber', type: 'Structural', name: 'Rubber Bumper', mass: 3, cost: 0 },
  struct_fin: { id: 'struct_fin', type: 'Structural', name: 'Stabilizer Fins', mass: 3, cost: 0 },
  
  wpn_laser: { id: 'wpn_laser', type: 'Weapon', name: 'Laser Cannon', mass: 10, cost: 0 },
  // ...
  wpn_missile: { id: 'wpn_missile', type: 'Weapon', name: 'Missile Launcher', mass: 25, cost: 0 },
  wpn_railgun: { id: 'wpn_railgun', type: 'Weapon', name: 'Railgun', mass: 40, cost: 0 },

  fuel_anti: { id: 'fuel_anti', type: 'Fuel', name: 'Antimatter', mass: 5, capacity: 3000, cost: 0 },
  fuel_warp: { id: 'fuel_warp', type: 'Fuel', name: 'Warp Fuel', mass: 100, capacity: 50000, cost: 0 },
  fuel_sml: { id: 'fuel_sml', type: 'Fuel', name: 'Small Tank', mass: 5, capacity: 100, cost: 0 },
  fuel_med: { id: 'fuel_med', type: 'Fuel', name: 'Medium Tank', mass: 8, capacity: 250, cost: 0 },
  fuel_lrg: { id: 'fuel_lrg', type: 'Fuel', name: 'Large Tank', mass: 10, capacity: 500, cost: 0 },
  fuel_hug: { id: 'fuel_hug', type: 'Fuel', name: 'Huge Tank', mass: 25, capacity: 1500, cost: 0 },
  fuel_sludge: { id: 'fuel_sludge', type: 'Fuel', name: 'Sludge Tank', mass: 50, capacity: 300, cost: 0 },

  fuel_weak_sml: { id: 'fuel_weak_sml', type: 'Fuel', name: 'Weak Small Tank', mass: 4, capacity: 120, cost: 0, isWeak: true },
  fuel_weak_med: { id: 'fuel_weak_med', type: 'Fuel', name: 'Weak Medium Tank', mass: 7, capacity: 300, cost: 0, isWeak: true },
  fuel_weak_lrg: { id: 'fuel_weak_lrg', type: 'Fuel', name: 'Weak Large Tank', mass: 9, capacity: 600, cost: 0, isWeak: true },
  fuel_weak_hug: { id: 'fuel_weak_hug', type: 'Fuel', name: 'Weak Huge Tank', mass: 20, capacity: 1800, cost: 0, isWeak: true },

  eng_warp: { id: 'eng_warp', type: 'Engine', name: 'Warp Drive', mass: 50, thrust: 1000000, cost: 0 },
  eng_nuke: { id: 'eng_nuke', type: 'Engine', name: 'Nuclear Pulse', mass: 35, thrust: 2500, cost: 0 },
  eng_basic: { id: 'eng_basic', type: 'Engine', name: 'Solid Motor', mass: 10, thrust: 200, cost: 0 },
  eng_liquid: { id: 'eng_liquid', type: 'Engine', name: 'Liquid Engine', mass: 20, thrust: 600, cost: 0 },
  eng_adv: { id: 'eng_adv', type: 'Engine', name: 'Plasma Engine', mass: 15, thrust: 1200, cost: 0 },
  eng_ion: { id: 'eng_ion', type: 'Engine', name: 'Ion Thruster', mass: 5, thrust: 100, cost: 0 },
  eng_experimental: { id: 'eng_experimental', type: 'Engine', name: 'Experimental Engine 😈', mass: 10, thrust: 2500, cost: 0 },
  eng_banana: { id: 'eng_banana', type: 'Engine', name: 'Banana Peel Thruster 🍌', mass: 1, thrust: 50, cost: 0 },
  eng_boost: { id: 'eng_boost', type: 'Engine', name: 'Heavy Booster', mass: 25, thrust: 1800, cost: 0 },
  eng_steam: { id: 'eng_steam', type: 'Engine', name: 'Steam Thruster', mass: 15, thrust: 30, cost: 0 },

  cargo_sat: { id: 'cargo_sat', type: 'Cargo', name: 'Satellite', mass: 5, capacity: 1, cost: 0 },
  cargo_rover: { id: 'cargo_rover', type: 'Cargo', name: 'Rover Deployer', mass: 10, capacity: 1, cost: 0 },
  cargo_bay: { id: 'cargo_bay', type: 'Cargo', name: 'Cargo Bay', mass: 15, capacity: 1, cost: 0 },
  cargo_med: { id: 'cargo_med', type: 'Cargo', name: 'Medium Cargo Bay', mass: 20, capacity: 2, cost: 0 },
  cargo_lrg: { id: 'cargo_lrg', type: 'Cargo', name: 'Large Cargo Bay', mass: 30, capacity: 3, cost: 0 },
  cargo_hab: { id: 'cargo_hab', type: 'Cargo', name: 'Habitation Mod', mass: 45, capacity: 5, cost: 0 },
  crg_orbital_laser: { id: 'crg_orbital_laser', type: 'Cargo', name: 'Orbital Laser Cannon', mass: 50, cost: 0 },
  cargo_base: { id: 'cargo_base', type: 'Cargo', name: 'Base Module', mass: 60, cost: 0 },
  wpn_tnt: { id: 'wpn_tnt', type: 'Weapon', name: 'TNT', mass: 20, cost: 0 },
};

export interface NewsItem {
  id: string;
  message: string;
  timestamp: number;
}

interface GameState {
  funds: number;
  unlockedTech: string[];
  rocketBlueprint: string[]; // array of part IDs (top to bottom)
  rocketName: string;
  news: NewsItem[];
  stations: {id: string, x: number, y: number}[];
  unlockedPlanets: string[];
  gameState: 'BUILDING' | 'FLYING' | 'MAIN_MENU';
  
  // Actions
  setGameState: (state: 'BUILDING' | 'FLYING' | 'MAIN_MENU') => void;
  addPart: (partId: string) => void;
  removePart: (index: number) => void;
  setRocketName: (name: string) => void;
  addFunds: (amount: number) => void;
  unlockTech: (techId: string) => void;
  unlockPlanet: (planetName: string) => void;
  addNews: (message: string) => void;
  addStation: (x: number, y: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  funds: 1000,
  unlockedTech: Object.keys(CATALOG),
  rocketBlueprint: ['cmd_basic', 'fuel_sml', 'eng_basic'],
  rocketName: 'Apollo 0',
  news: [{ id: 'init', message: 'Welcome to AstroSandbox!', timestamp: Date.now() }],
  stations: [],
  unlockedPlanets: ['Earth'],
  gameState: 'MAIN_MENU',

  setGameState: (state) => set({ gameState: state }),
  
  addPart: (partId) => set((state) => ({ 
    rocketBlueprint: [...state.rocketBlueprint, partId],
    funds: state.funds - CATALOG[partId].cost 
  })),
  
  removePart: (index) => set((state) => {
    const newBlueprint = [...state.rocketBlueprint];
    const removedPart = newBlueprint.splice(index, 1)[0];
    return { 
      rocketBlueprint: newBlueprint,
      funds: state.funds + (CATALOG[removedPart]?.cost || 0)
    };
  }),
  
  setRocketName: (rocketName) => set({ rocketName }),
  
  addFunds: (amount) => set((state) => ({ funds: state.funds + amount })),
  
  unlockTech: (techId) => set((state) => ({ 
    unlockedTech: [...state.unlockedTech, techId] 
  })),
  
  unlockPlanet: (planetName) => set((state) => {
    if (state.unlockedPlanets.includes(planetName)) return state;
    return { unlockedPlanets: [...state.unlockedPlanets, planetName] };
  }),
  
  addNews: (message) => set((state) => ({
    news: [{ id: Math.random().toString(), message, timestamp: Date.now() }, ...state.news].slice(0, 5)
  })),

  addStation: (x, y) => set((state) => ({
    stations: [...state.stations, { id: Math.random().toString(), x, y }]
  }))
}));

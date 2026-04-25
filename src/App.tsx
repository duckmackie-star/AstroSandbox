/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameStore } from './store';
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/MainMenu';
import RocketBuilder from './components/RocketBuilder';
import NewsTicker from './components/NewsTicker';
import HUD from './components/HUD';
import PlanetBook from './components/PlanetBook';
import BaseCatalog from './components/BaseCatalog';

export default function App() {
  const { gameState, addPart } = useGameStore();
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [activeBase, setActiveBase] = useState<any | null>(null);
  const [engine, setEngine] = useState<any | null>(null);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white selection:bg-[#F27D26] selection:text-black font-sans relative">
      <GameCanvas onOpenBase={setActiveBase} onEngineCreated={setEngine} />
      
      {gameState === 'MAIN_MENU' && <MainMenu />}
      
      {gameState !== 'MAIN_MENU' && <NewsTicker />}
      {gameState === 'BUILDING' && <RocketBuilder />}
      {gameState === 'FLYING' && <HUD />}
      
      {activeBase && (
        <BaseCatalog 
            onClose={() => setActiveBase(null)} 
            onAcquire={(partId) => {
                engine?.addPartToRocket(partId, activeBase);
                setActiveBase(null);
            }}
            onRefuel={() => {
                engine?.refuelRocket();
                setActiveBase(null);
            }}
        />
      )}
      
      {gameState !== 'MAIN_MENU' && (
        <button 
           className="absolute bottom-4 right-4 bg-[#222] text-white px-4 py-2 rounded z-20 hover:bg-[#F27D26] transition-colors" 
           onClick={() => setIsBookOpen(true)}
         >
           Planet Book
         </button>
      )}
      
       {isBookOpen && <PlanetBook onClose={() => setIsBookOpen(false)} />}
    </div>
  );
}

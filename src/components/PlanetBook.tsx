import React from 'react';
import { useGameStore } from '../store';
import { PLANETS } from '../game/Physics';

export default function PlanetBook({ onClose }: { onClose: () => void }) {
  const { unlockedPlanets } = useGameStore();

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-10 font-sans">
      <div className="bg-[#1a1a1a] p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-[#333] rounded-lg relative">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-[#333] pb-2">Planetary Database</h2>
        <button className="absolute top-4 right-4 text-white hover:text-[#F27D26] font-bold" onClick={onClose}>[X] Close</button>
        
        <div className="grid gap-4">
          {PLANETS.map((planet) => {
            const isUnlocked = unlockedPlanets.includes(planet.name);
            return (
              <div key={planet.name} className={`p-4 rounded border ${isUnlocked ? 'border-[#444]' : 'border-[#222]'}`}>
                <h3 className={`font-bold ${isUnlocked ? 'text-[#F27D26]' : 'text-gray-600'}`}>{planet.name}</h3>
                <p className={`text-sm mt-1 ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>{isUnlocked ? planet.description : '?? Locked: Land on this planet to unlock data ??'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

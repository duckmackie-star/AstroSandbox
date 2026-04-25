import React, { useState } from 'react';
import { useGameStore, CATALOG } from '../store';
import { Trash2, Rocket as RocketIcon, Coins } from 'lucide-react';
import { PartType } from '../store';

export default function RocketBuilder() {
  const { 
    rocketBlueprint, 
    rocketName, 
    addPart, 
    removePart, 
    setRocketName, 
    setGameState,
  } = useGameStore();

  const [activeFilter, setActiveFilter] = useState<PartType | 'All'>('All');
  const filters: (PartType | 'All')[] = ['All', 'Command', 'Fuel', 'Engine', 'Structural', 'Cargo', 'Weapon'];

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#141414] text-white p-6 border-r border-[#333] shadow-2xl flex flex-col z-10 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1 font-mono uppercase text-[#F27D26]">AstroSandbox</h1>
        
        <label className="block text-xs uppercase tracking-widest opacity-50 mb-1 mt-4">Project Name</label>
        <input 
          type="text" 
          value={rocketName}
          onChange={(e) => setRocketName(e.target.value)}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 outline-none focus:border-[#F27D26] font-mono transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 pr-2 min-h-0">
        <label className="block text-xs uppercase tracking-widest opacity-50 mb-3 sticky top-0 bg-[#141414] pb-2 z-10">Blueprint</label>
        <div className="space-y-2 flex flex-col items-center">
          {rocketBlueprint.map((partId, idx) => {
            const part = CATALOG[partId];
            return (
              <div key={`${idx}-${partId}`} className="group relative bg-[#2a2a2a] w-32 border border-[#444] rounded flex flex-col items-center justify-center p-2 text-center h-16 transition-colors hover:border-red-500">
                <span className="text-xs font-bold">{part.name}</span>
                <span className="text-[10px] opacity-50">{part.mass}kg</span>
                <button 
                  onClick={() => removePart(idx)}
                  className="absolute -right-2 -top-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          {rocketBlueprint.length === 0 && (
            <div className="text-xs opacity-40 italic border border-dashed border-[#555] w-32 h-16 flex items-center justify-center rounded">
              Empty
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 pr-2 min-h-0 border-t border-[#333] pt-4 mt-2">
        <label className="block text-xs uppercase tracking-widest opacity-50 mb-2 sticky top-0 bg-[#141414] pb-2 z-10">Parts Catalog</label>

        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 no-scrollbar sticky top-6 bg-[#141414] z-10">
          {filters.map(f => (
             <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors whitespace-nowrap ${activeFilter === f ? 'bg-[#F27D26] text-white' : 'bg-[#222] text-gray-400 hover:bg-[#333]'}`}
             >
               {f}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.values(CATALOG).filter(part => activeFilter === 'All' || part.type === activeFilter).map(part => {
            return (
              <button 
                key={part.id}
                onClick={() => addPart(part.id)}
                className={`text-left p-2 rounded text-xs border transition-colors bg-[#222] border-[#444] hover:border-[#F27D26] hover:bg-[#333]`}
              >
                <div className="font-bold truncate">{part.name}</div>
                <div className="flex justify-between mt-1 text-[10px] items-center">
                  <span>{part.type}</span>
                  <span className="text-yellow-400">
                    FREE
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <button 
        onClick={() => setGameState('FLYING')}
        disabled={rocketBlueprint.length === 0}
        className="w-full bg-[#F27D26] hover:bg-[#e06b1b] text-black font-bold uppercase tracking-widest py-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RocketIcon className="w-5 h-5 mr-2" />
        Launch
      </button>
    </div>
  );
}

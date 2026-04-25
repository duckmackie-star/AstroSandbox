import React from 'react';
import { useGameStore } from '../store';

export default function MainMenu() {
  const setGameState = useGameStore((state) => state.setGameState);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
      <h1 className="text-6xl font-bold mb-8 text-[#F27D26]">AstroSandbox</h1>
      <button 
        className="px-8 py-4 bg-[#222] hover:bg-[#F27D26] text-2xl rounded-lg transition-colors mb-4"
        onClick={() => setGameState('BUILDING')}
      >
        Start Game
      </button>
    </div>
  );
}

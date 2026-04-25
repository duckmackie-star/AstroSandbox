import { useGameStore } from '../store';
import { ArrowLeft } from 'lucide-react';

export default function HUD() {
  const { setGameState, rocketBlueprint } = useGameStore();

  const hasCargo = rocketBlueprint.includes('cargo_bay');

  return (
    <div className="absolute bottom-4 left-4 z-20 font-mono text-white flex gap-4 pointer-events-none">
      <div className="bg-[#151619]/80 backdrop-blur border border-[#333] rounded p-4 shadow-xl pointer-events-auto">
        <h2 className="text-xs uppercase tracking-widest opacity-60 mb-2 text-[#F27D26]">Flight Telemetry</h2>
        <div className="text-sm space-y-1">
          <div><span className="opacity-50">Thrust:</span> [UP] ARROW</div>
          <div><span className="opacity-50">Rotate:</span> [L/R] ARROWS</div>
          <div><span className="opacity-50">Zoom:</span> [SCROLL WHEEL]</div>
          {hasCargo && <div className="text-[#00aaff] mt-2"><span className="opacity-80">Deploy Cargo:</span> [SPACEBAR]</div>}
        </div>
        <button 
          onClick={() => setGameState('BUILDING')}
          className="mt-4 flex items-center text-xs uppercase bg-[#333] hover:bg-[#444] px-3 py-2 rounded transition-colors"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Abort Flight
        </button>
      </div>
    </div>
  );
}

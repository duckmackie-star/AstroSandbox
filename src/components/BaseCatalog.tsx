import { CATALOG, useGameStore } from '../store';

export default function BaseCatalog({ onClose, onAcquire, onRefuel }: { onClose: () => void, onAcquire: (partId: string) => void, onRefuel: () => void }) {
  const parts = Object.values(CATALOG).filter(p => ['Cargo', 'Weapon', 'Fuel'].includes(p.type));

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className="bg-[#222] p-6 rounded-lg text-white w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl mb-4">Base Supply Terminal</h2>
        <button className="w-full bg-blue-600 p-2 mb-2 hover:bg-blue-700" onClick={onRefuel}>Refuel Rocket</button>
        <div className="grid grid-cols-1 gap-2">
          {parts.map(part => (
            <button 
                key={part.id}
                className="bg-[#333] p-2 hover:bg-[#F27D26] text-left"
                onClick={() => onAcquire(part.id)}
            >
                {part.name}
            </button>
          ))}
        </div>
        <button className="mt-4 w-full bg-red-600 p-2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

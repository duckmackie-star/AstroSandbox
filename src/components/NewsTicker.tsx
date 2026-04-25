import { useGameStore } from '../store';
import { Terminal } from 'lucide-react';

export default function NewsTicker() {
  const { news } = useGameStore();

  return (
    <div className="absolute top-4 right-4 w-80 z-20 pointer-events-none">
      <div className="bg-[#151619]/90 backdrop-blur border border-[#333] rounded p-3 shadow-xl">
        <div className="flex items-center text-xs uppercase tracking-widest opacity-60 mb-2 font-mono text-[#F27D26]">
          <Terminal className="w-3 h-3 mr-2" />
          Mission Log
        </div>
        <div className="space-y-1">
          {news.map((item) => (
            <div key={item.id} className="text-[11px] font-mono leading-tight">
              <span className="opacity-40 mr-2">
                {new Date(item.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              <span className="text-[#eee]">{item.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

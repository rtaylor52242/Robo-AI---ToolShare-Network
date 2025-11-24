import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Tool } from '../types';
import { useNavigate } from 'react-router-dom';

interface MapVisualProps {
  tools: Tool[];
}

const MapVisual: React.FC<MapVisualProps> = ({ tools }) => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Generate pseudo-random coordinates for demo purposes
  // In a real app, these would come from the backend lat/lng
  const getPosition = (id: string) => {
    const seed = id.charCodeAt(0) + (id.charCodeAt(1) || 0);
    const top = (seed * 13) % 80 + 10; // 10% to 90%
    const left = (seed * 27) % 80 + 10;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="w-full h-full bg-[#0B1120] relative overflow-hidden group">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Abstract Map Shapes (Futuristic Vibe) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
         <path d="M0,100 Q400,300 800,100 T1600,200" fill="none" stroke="#0ea5e9" strokeWidth="2" />
         <circle cx="50%" cy="50%" r="200" stroke="#0ea5e9" strokeWidth="1" fill="none" opacity="0.5" />
         <circle cx="50%" cy="50%" r="300" stroke="#0ea5e9" strokeWidth="1" fill="none" strokeDasharray="10 10" opacity="0.3" />
      </svg>
      
      {/* Radar Scan Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-robo-500/10 animate-[spin_10s_linear_infinite]"
             style={{ background: 'conic-gradient(from 0deg at 50% 50%, rgba(14, 165, 233, 0) 0deg, rgba(14, 165, 233, 0.1) 360deg)' }}>
        </div>
      </div>

      {/* Pins */}
      {tools.map((tool) => {
        const pos = getPosition(tool.id);
        const isSelected = selectedTool?.id === tool.id;

        return (
          <div 
            key={tool.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20 z-10"
            style={{ top: pos.top, left: pos.left }}
            onClick={() => setSelectedTool(tool)}
          >
            {/* Pulse Effect */}
            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isSelected ? 'bg-robo-400' : 'bg-robo-600'}`}></div>
            
            {/* Pin Head */}
            <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg shadow-robo-500/50 ${isSelected ? 'bg-robo-500 border-white scale-110' : 'bg-gray-900 border-robo-500'}`}>
               <MapPin size={16} className={isSelected ? 'text-white' : 'text-robo-500'} />
            </div>
            
            {/* Price Tag (visible on hover or select) */}
            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap transition-opacity duration-200 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              ${tool.pricePerDay}
            </div>
          </div>
        );
      })}

      {/* Tool Preview Modal (Floating) */}
      {selectedTool && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-2xl z-30 animate-in slide-in-from-bottom-5">
           <button 
             onClick={(e) => { e.stopPropagation(); setSelectedTool(null); }}
             className="absolute top-2 right-2 text-gray-400 hover:text-white"
           >
             <X size={18} />
           </button>
           
           <div className="flex gap-3 mb-3">
             <img src={selectedTool.image} alt={selectedTool.name} className="w-16 h-16 rounded-lg object-cover bg-gray-800" />
             <div>
               <h3 className="font-bold text-white text-sm line-clamp-1">{selectedTool.name}</h3>
               <p className="text-xs text-gray-400">{selectedTool.category}</p>
               <p className="text-robo-500 font-bold text-sm mt-1">${selectedTool.pricePerDay}/day</p>
             </div>
           </div>
           
           <button 
             onClick={() => navigate(`/tool/${selectedTool.id}`)}
             className="w-full bg-robo-500 hover:bg-robo-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
           >
             View Details
           </button>
        </div>
      )}
      
      {/* Map Controls Mockup */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
         <button className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 shadow-lg">+</button>
         <button className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 shadow-lg">-</button>
      </div>
    </div>
  );
};

export default MapVisual;
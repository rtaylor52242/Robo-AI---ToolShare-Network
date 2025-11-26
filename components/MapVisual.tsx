
import React, { useState } from 'react';
import { MapPin, X, Navigation, Crosshair } from 'lucide-react';
import { Tool } from '../types';
import { useNavigate } from 'react-router-dom';

interface MapVisualProps {
  tools: Tool[];
}

// Approximate Top/Left Percentages for major US states
// Reference map: 950x600 viewbox
const STATE_COORDINATES: Record<string, { top: string, left: string }> = {
  'WA': { top: '15%', left: '12%' },
  'OR': { top: '25%', left: '10%' },
  'CA': { top: '50%', left: '8%' },
  'ID': { top: '25%', left: '20%' },
  'NV': { top: '40%', left: '15%' },
  'UT': { top: '45%', left: '22%' },
  'AZ': { top: '65%', left: '20%' },
  'MT': { top: '15%', left: '28%' },
  'WY': { top: '30%', left: '30%' },
  'CO': { top: '50%', left: '32%' },
  'NM': { top: '65%', left: '30%' },
  'ND': { top: '15%', left: '45%' },
  'SD': { top: '28%', left: '45%' },
  'NE': { top: '40%', left: '46%' },
  'KS': { top: '52%', left: '48%' },
  'OK': { top: '65%', left: '50%' },
  'TX': { top: '75%', left: '45%' },
  'MN': { top: '20%', left: '55%' },
  'IA': { top: '35%', left: '58%' },
  'MO': { top: '50%', left: '60%' },
  'AR': { top: '65%', left: '60%' },
  'LA': { top: '80%', left: '62%' },
  'WI': { top: '25%', left: '62%' },
  'IL': { top: '40%', left: '65%' },
  'MS': { top: '75%', left: '66%' },
  'AL': { top: '75%', left: '72%' },
  'TN': { top: '60%', left: '70%' },
  'KY': { top: '52%', left: '72%' },
  'IN': { top: '42%', left: '70%' },
  'MI': { top: '30%', left: '72%' },
  'OH': { top: '42%', left: '76%' },
  'GA': { top: '72%', left: '78%' },
  'FL': { top: '88%', left: '85%' },
  'SC': { top: '68%', left: '82%' },
  'NC': { top: '60%', left: '84%' },
  'VA': { top: '52%', left: '84%' },
  'WV': { top: '48%', left: '80%' },
  'PA': { top: '38%', left: '84%' },
  'NY': { top: '30%', left: '88%' },
  'VT': { top: '22%', left: '90%' },
  'NH': { top: '25%', left: '92%' },
  'ME': { top: '15%', left: '95%' },
  'MA': { top: '30%', left: '93%' },
  'RI': { top: '33%', left: '94%' },
  'CT': { top: '33%', left: '92%' },
  'NJ': { top: '40%', left: '89%' },
  'DE': { top: '44%', left: '88%' },
  'MD': { top: '45%', left: '86%' },
};

const getLocationCoordinates = (location: string, id: string) => {
  // Extract State Code (2 Uppercase letters)
  const stateMatch = location.match(/\b([A-Z]{2})\b/);
  
  if (stateMatch && STATE_COORDINATES[stateMatch[1]]) {
    const baseCoords = STATE_COORDINATES[stateMatch[1]];
    // Add tiny random jitter so tools in same city don't perfectly overlap
    const jitter = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return (hash % 50) / 10; // +/- small percentage
    }
    return {
       top: `calc(${baseCoords.top} + ${jitter(id)}%)`,
       left: `calc(${baseCoords.left} + ${jitter(id + 'x')}%)`
    };
  }

  // Fallback if no state found
  const seed = id.charCodeAt(0) + (id.charCodeAt(1) || 0);
  const top = (seed * 13) % 60 + 20; 
  const left = (seed * 27) % 80 + 10;
  return { top: `${top}%`, left: `${left}%` };
};

const MapVisual: React.FC<MapVisualProps> = ({ tools }) => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="w-full h-full bg-[#050b14] relative overflow-hidden group">
      
      {/* Tech Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
           backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
           backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Radar Scan Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(14,165,233,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full opacity-30"></div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
        {/* USA Map SVG */}
        <svg 
          viewBox="0 0 950 600" 
          className="w-full h-full text-gray-800/80 fill-current drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          xmlns="http://www.w3.org/2000/svg"
        >
           <filter id="glow">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
           </filter>
          <path d="M939.8,129.8c-2.4,1.6-11.4,5.4-11.4,5.4l-5.6,30.3l1.8,4.1l-6.8,0.7l-0.7,3.1l-10.3,5.9l-2.4,10.6
	l-13.9,7.6l-5.5-0.7l-2.7,2.8l-12.7,2.8l-5.9,8l-10.7,5.5l-4.5,10.7l0.7,11l-4.1,4.9l-2.7,16l-3.8,1.4l-3.8-3.4l-9.3,5.2
	l-4.5,13.8l-7.9,3.5l-7.6,12.8l-2.7,0.3l-5.2,14.5l3.1,11l-2.1,8.3l2.8,4.1l-2.4,5.9l0.3,10.3l-4.8,2.8l-1.4,9.6l-10.3,7.6
	l-11,2.1l-20.3,17.2l-14.8,3.5l-5.5,5.5l1.4,4.5l-2.4,3.1l-10.3-1l-9,4.5l-5.9,8.6l-7.9,1l-9.3,6.2l-10,3.4l-11,10.7l-3.1-0.3
	l-8.6,8.6l-9.3,2.4l-5.2,4.8l-8.3-2.1l-12.4,1.4l-13.8,7.9l-6.2,1l-5.2-4.1l-7.9,0.3l-3.1,4.5l-2.4-2.8l-14.5,1.4l-20.7-3.4
	l-6.6,6.9l-4.1-1.7l-4.8,1l-3.1-3.8l-3.4,4.5l-11.7-5.9l-7.9,2.8l-7.9-1.4l-10-3.8l-0.7-2.1l1.7-5.9l-5.2-12.8l2.8-5.9l-2.8-5.5
	l-7.2-2.4l-10-0.3l-12.1-7.2l-7.2-2.1l-3.1,4.5l-10.3-4.1l-4.8,2.4l-3.4-3.1l-2.1,0.3l-1.4,5.2l-7.2,10.7l-5.5,3.8l-4.8-5.5
	l-6.6,5.5l1.4,5.2l-6.2,3.1l-1.7,5.2l-4.5,2.1l-1,3.4l-8.6,3.4l-5.2-1.7l-5.9,2.4l-5.5-4.8l-4.1,2.4l-7.6-5.5l-1.4,2.8l-3.8-3.4
	l-6.9,4.1l-13.4-6.2l-12.8,0.7l-3.4,5.2l-3.4-1.7l-2.1,2.8l-2.8-0.3l-1.7,3.1l-5.9-4.1l-3.4-5.5l-2.8-0.3l-3.8-7.9l1.4-9.3
	l-3.4-6.2l2.4-15.5l-2.8-3.1l-7.2,6.9l-4.5-0.7l-2.8-6.6l-3.4,0.3l-5.5-5.9l-4.1,0.3l-3.4-4.5l1-4.8l-2.4-2.4l-0.3-4.5l-4.1-2.4
	l-4.8,2.4l-4.8-1.7l-4.1-6.6l-1.4-8.6l-6.2-7.2l0.3-4.8l-5.9-4.5l-0.3-5.2l-4.1-3.4l0.3-6.2l-6.6-4.5l2.4-3.4l-1.7-2.1l3.1-4.1
	l-2.1-4.5l-4.8-3.4l1.7-4.1l-1.7-4.5l2.1-8.6l-4.5-4.5l-0.3-3.1l3.1-4.8l-1.4-2.8l2.4-3.1l-1-7.9l-4.1-3.4l-0.7-5.5l4.5-2.8
	l-0.7-3.8l-3.8-1l1.4-6.9l-2.1-4.1l4.1-4.1l-1.4-5.9l3.4-4.8l-1.7-10l5.2-5.5l-1-6.6l5.2-2.8l-0.3-2.8l-6.9-3.8l-2.8,0.3l-4.5-5.2
	l3.1-4.1l-1-4.5l-4.8-3.8l0.3-4.8l-3.4-5.2l3.4-2.4l-2.1-4.1l2.4-3.1l0.7-5.9l10.3-3.4l12.1-0.3l8.6,3.8l2.4-1.7l4.8,2.1l11.4,1.4
	l17.6,0.3l10-2.4l3.4,1.4l5.2-2.1l7.6,3.1l6.9,6.2l12.4,5.5l4.1-0.7l7.2,2.8l10.3-1.4l20.7,0.7l22.1,3.4l28.6,3.1l11.7,3.1
	l11.4-2.1l12.1,2.8l12.8,2.1l7.6-2.4l4.5,1.7l6.6-2.1l14.8,2.1l14.8,3.1l12.8,0.3l15.9,4.1l1.4,4.5l5.2,0.3l2.8-2.8l4.8,2.8
	l2.1,4.1l7.2-0.7l13.1,4.8l2.1-2.4l6.6-0.3l2.4-2.4l4.5,1.7l0.3,4.1l4.5,1l6.6-5.5l4.1,2.8l4.5-2.1l1.4-4.1l4.1-1.4l8.3,4.5
	l11.4,1.4l5.2-2.4l6.2,2.4l5.9-2.1l2.4,2.8l13.1-0.3l12.4,1.4l3.1-3.8l6.2,2.4l1.7-1.7l5.9,2.8l3.1-1.7l3.1,1l2.8-1.7l7.2,3.1
	l-1.4,3.1l3.4,2.1l-2.8,3.8l4.1,2.4l-2.1,3.4l6.6,2.4l-1.7,2.8l2.1,2.8l-1.7,1.7l3.4,2.1l-1.7,4.8l2.8,2.1l-0.3,5.9l-2.8,3.4
	l2.1,1l0.3,5.2l-3.8,4.5l1,4.5l-4.1,1.7L939.8,129.8z" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
        </svg>
      </div>

      {/* Pins */}
      {tools.map((tool) => {
        const coords = getLocationCoordinates(tool.location, tool.id);
        const isSelected = selectedTool?.id === tool.id;

        return (
          <div 
            key={tool.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:z-20 z-10"
            style={{ top: coords.top, left: coords.left }}
            onClick={() => setSelectedTool(tool)}
          >
            {/* Ping Animation */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-robo-500/50 animate-ping opacity-75 ${isSelected ? 'block' : 'hidden'}`}></div>
            
            {/* Pin Head */}
            <div className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
               <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)] ${isSelected ? 'bg-white' : 'bg-robo-500'}`}></div>
               <div className="w-0.5 h-3 bg-gradient-to-b from-robo-500 to-transparent opacity-50"></div>
            </div>
            
            {/* Mini Tooltip on Hover */}
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-robo-500/30 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap transition-all duration-200 pointer-events-none ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'} z-20 backdrop-blur-sm shadow-xl`}>
              <div className="flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                 ${tool.pricePerDay}
              </div>
            </div>
          </div>
        );
      })}

      {/* Tool Preview Modal (Floating) */}
      {selectedTool && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-2xl z-30 animate-in slide-in-from-bottom-5">
           {/* Crosshair decoration */}
           <div className="absolute top-0 left-0 p-1 opacity-20"><Crosshair size={12} className="text-robo-500" /></div>
           <div className="absolute top-0 right-0 p-1 opacity-20"><Crosshair size={12} className="text-robo-500" /></div>

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
               <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <Navigation size={10} /> {selectedTool.location}
               </div>
               <p className="text-robo-500 font-bold text-sm mt-1">${selectedTool.pricePerDay}/day</p>
             </div>
           </div>
           
           <div className="flex gap-2">
             <button 
                onClick={() => navigate(`/tool/${selectedTool.id}`)}
                className="flex-1 bg-robo-500 hover:bg-robo-600 text-white text-sm font-medium py-2 rounded-lg transition-colors shadow-lg shadow-robo-500/20"
             >
                View Details
             </button>
           </div>
        </div>
      )}
      
      {/* Map Controls Mockup */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
         <button className="w-10 h-10 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 hover:border-robo-500 transition-all shadow-lg">+</button>
         <button className="w-10 h-10 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 hover:border-robo-500 transition-all shadow-lg">-</button>
      </div>
    </div>
  );
};

export default MapVisual;

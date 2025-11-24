import React from 'react';
import { MapPin, Star, Battery } from 'lucide-react';
import { Tool } from '../types';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-robo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-robo-500/10 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tool.image} 
          alt={tool.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white border border-gray-700">
          ${tool.pricePerDay}/day
        </div>
        {!tool.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-md font-bold text-sm rotate-12">RENTED</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-1 font-display">{tool.name}</h3>
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-robo-500" />
            <span>{tool.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span>{tool.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery size={12} className="text-green-500" />
            <span>{tool.category}</span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => navigate(`/tool/${tool.id}`)}
          className="group-hover:bg-robo-500 group-hover:text-white group-hover:border-robo-500 transition-colors"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ToolCard;
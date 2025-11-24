import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Hammer, Leaf, Car, Ruler, Box, ChevronRight } from 'lucide-react';
import { ToolCategory } from '../types';

const CategoryBrowser: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    { id: ToolCategory.POWER_TOOLS, name: 'Power Tools', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: ToolCategory.HAND_TOOLS, name: 'Hand Tools', icon: Hammer, color: 'text-gray-300', bg: 'bg-gray-400/10' },
    { id: ToolCategory.GARDENING, name: 'Gardening', icon: Leaf, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: ToolCategory.AUTOMOTIVE, name: 'Automotive', icon: Car, color: 'text-red-400', bg: 'bg-red-400/10' },
    { id: ToolCategory.WOODWORKING, name: 'Woodworking', icon: Ruler, color: 'text-amber-600', bg: 'bg-amber-600/10' },
    { id: ToolCategory.OTHER, name: 'Other Equipment', icon: Box, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate('/explore')}
          className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-800 border border-gray-700 hover:border-robo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-robo-500/10"
        >
          <div className={`p-4 rounded-full mb-3 transition-colors ${cat.bg} group-hover:bg-opacity-20`}>
            <cat.icon size={32} className={`${cat.color}`} />
          </div>
          <h3 className="text-sm font-bold text-gray-200 group-hover:text-white text-center">{cat.name}</h3>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={14} className="text-gray-500" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryBrowser;
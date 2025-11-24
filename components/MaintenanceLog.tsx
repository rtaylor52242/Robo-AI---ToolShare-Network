import React from 'react';
import { Wrench, CheckCircle, Search, Sparkles } from 'lucide-react';
import { MaintenanceRecord } from '../types';

interface MaintenanceLogProps {
  logs: MaintenanceRecord[];
}

const MaintenanceLog: React.FC<MaintenanceLogProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-900 rounded-xl border border-gray-800 border-dashed">
        <Wrench size={32} className="mx-auto text-gray-600 mb-2" />
        <p className="text-gray-400 text-sm">No maintenance history recorded.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Repair': return <Wrench size={16} className="text-red-400" />;
      case 'Cleaning': return <Sparkles size={16} className="text-blue-400" />;
      case 'Inspection': return <Search size={16} className="text-yellow-400" />;
      default: return <CheckCircle size={16} className="text-green-400" />;
    }
  };

  return (
    <div className="relative border-l-2 border-gray-800 ml-4 space-y-8">
      {logs.map((log) => (
        <div key={log.id} className="relative pl-6 group">
          {/* Dot on timeline */}
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-700 group-hover:border-robo-500 transition-colors"></div>
          
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-gray-900/50">
                  {getIcon(log.type)}
                </div>
                <span className="font-bold text-white text-sm">{log.type}</span>
              </div>
              <span className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{log.description}</p>
            
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-700/50 pt-3">
              {log.technician && (
                <span>By: <span className="text-gray-400">{log.technician}</span></span>
              )}
              {log.cost && (
                <span>Cost: <span className="text-gray-400">${log.cost}</span></span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceLog;

import React from 'react';

interface ChartProps {
  data: { date: string; value: number }[];
  type: 'bar' | 'line';
  color?: string;
  height?: number;
}

const AnalyticsChart: React.FC<ChartProps> = ({ data, type, color = '#0ea5e9', height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // Add 10% buffer
  
  return (
    <div className="w-full flex items-end gap-2" style={{ height: `${height}px` }}>
      {data.map((point, i) => {
        const heightPct = (point.value / maxValue) * 100;
        
        return (
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 bg-gray-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-700 pointer-events-none">
              {point.date}: {point.value}
            </div>

            {type === 'bar' ? (
              <div 
                className="w-full rounded-t-sm hover:opacity-80 transition-all duration-500 ease-out"
                style={{ 
                  height: `${heightPct}%`, 
                  backgroundColor: color,
                  opacity: 0.7
                }}
              />
            ) : (
              <div className="relative w-full h-full flex items-end justify-center">
                 <div 
                    className="w-2 rounded-full"
                    style={{
                       height: `${heightPct}%`,
                       backgroundColor: color
                    }}
                 />
                 {/* Simplified line representation via dots for now, fully drawing SVG path requires more complex logic */}
                 {i < data.length - 1 && (
                    <div className="absolute top-0 right-0 h-full w-full pointer-events-none hidden">
                       {/* Line connecting logic would go here */}
                    </div>
                 )}
              </div>
            )}
            
            <span className="text-[10px] text-gray-500 mt-2">{point.date}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsChart;

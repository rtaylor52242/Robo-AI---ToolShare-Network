import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AvailabilityCalendarProps {
  unavailableDates?: string[];
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ unavailableDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${month}-${d}`;
  };

  const isUnavailable = (day: number) => {
    const dateStr = formatDate(day);
    return unavailableDates.includes(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const renderDays = () => {
    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const unavailable = isUnavailable(i);
      const today = isToday(i);
      
      days.push(
        <div 
          key={i} 
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${unavailable 
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed decoration-slice line-through decoration-red-500/50' 
              : 'hover:bg-robo-500 hover:text-white cursor-pointer text-gray-300'}
            ${today ? 'border border-robo-500 text-robo-500' : ''}
          `}
          title={unavailable ? 'Unavailable' : 'Available'}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
            <ChevronLeft size={18} />
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-xs font-bold text-gray-500 uppercase h-6 flex items-center justify-center">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {renderDays()}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-[10px] text-gray-500 justify-center border-t border-gray-700 pt-3">
        <div className="flex items-center gap-1">
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
           <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
           <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-600"></div>
           <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

import React from 'react';
import { Bell, Check, Clock, Info, MessageSquare } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Check size={16} className="text-green-500" />;
      case 'alert': return <Clock size={16} className="text-yellow-500" />;
      case 'message': return <MessageSquare size={16} className="text-robo-500" />;
      default: return <Info size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-white text-sm">Notifications</h3>
        <button className="text-xs text-robo-500 hover:text-white transition-colors">Mark all read</button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {MOCK_NOTIFICATIONS.length > 0 ? (
          MOCK_NOTIFICATIONS.map(notification => (
            <div 
              key={notification.id} 
              onClick={() => {
                if (notification.link) navigate(notification.link);
                onClose();
              }}
              className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors ${!notification.read ? 'bg-gray-800/20' : ''}`}
            >
              <div className="flex gap-3">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                  {getIcon(notification.type)}
                </div>
                <div>
                  <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-gray-600 mt-2">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-robo-500 flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-2 bg-gray-800/50 text-center">
        <button className="text-xs text-gray-400 hover:text-white p-2">View all history</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;

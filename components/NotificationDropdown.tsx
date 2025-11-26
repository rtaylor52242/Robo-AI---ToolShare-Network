
import React, { useState } from 'react';
import { Bell, Check, Clock, Info, MessageSquare, Circle, CheckCircle2 } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // Using local state to manage notifications for the session
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Check size={16} className="text-green-500" />;
      case 'alert': return <Clock size={16} className="text-yellow-500" />;
      case 'message': return <MessageSquare size={16} className="text-robo-500" />;
      default: return <Info size={16} className="text-gray-400" />;
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation when clicking the read toggle
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-white text-sm">Notifications</h3>
        <button 
          onClick={handleMarkAllRead}
          className="text-xs text-robo-500 hover:text-white transition-colors"
        >
          Mark all read
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              onClick={() => {
                if (notification.link) navigate(notification.link);
                onClose();
              }}
              className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors group relative ${!notification.read ? 'bg-gray-800/20' : ''}`}
            >
              <div className="flex gap-3 pr-6">
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
              </div>
              
              {/* Individual Read/Unread Toggle */}
              <button
                onClick={(e) => handleToggleRead(e, notification.id)}
                className="absolute right-4 top-4 text-gray-600 hover:text-robo-500 transition-colors"
                title={notification.read ? "Mark as unread" : "Mark as read"}
              >
                {notification.read ? (
                   <CheckCircle2 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                   <div className="w-3 h-3 bg-robo-500 rounded-full shadow-sm"></div>
                )}
              </button>
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

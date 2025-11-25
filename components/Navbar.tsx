import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, Menu, X, User, Bell, Mail, HelpCircle, Sun, Moon } from 'lucide-react';
import Button from './Button';
import NotificationDropdown from './NotificationDropdown';
import { MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS } from '../constants';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, theme, toggleTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const unreadMessages = MOCK_CONVERSATIONS.reduce((acc, curr) => acc + curr.unreadCount, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-robo-500/10 p-2 rounded-lg border border-robo-500/30 group-hover:border-robo-500 transition-colors">
              <Hammer className="h-6 w-6 text-robo-500" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              Tool<span className="text-robo-500">Share</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-robo-500 bg-robo-50 dark:bg-robo-500/10'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/community"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                Community
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
             {/* Theme Toggle */}
             <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {/* Messages */}
             <Link to="/messages" className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Mail size={20} />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-robo-500 rounded-full"></span>
                )}
             </Link>

             {/* Notifications */}
             <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none"
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
             </div>
             
             {/* Help */}
             <Link to="/support" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <HelpCircle size={20} />
             </Link>

             <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

             {/* Profile */}
             <Link to="/profile">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:border-gray-500 cursor-pointer overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
             </Link>
             
             <div id="list-tool-btn">
                <Link to="/list-tool">
                  <Button size="sm" variant="primary">List a Tool</Button>
                </Link>
             </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden items-center gap-2">
            <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-white transition-colors"
             >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/messages" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
               Messages {unreadMessages > 0 && <span className="ml-2 text-xs bg-robo-500 text-white px-1.5 py-0.5 rounded-full">{unreadMessages}</span>}
            </Link>
            <Link to="/support" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
               Help & Support
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
               Profile
            </Link>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
               <Link to="/list-tool" onClick={() => setIsOpen(false)}>
                  <Button fullWidth className="mt-2">List a Tool</Button>
               </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hammer, Menu, X, User, Bell, Mail, HelpCircle, Sun, Moon, LogOut, Palette, Check, Users } from 'lucide-react';
import Button from './Button';
import NotificationDropdown from './NotificationDropdown';
import { MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, COLOR_THEMES } from '../constants';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, theme, toggleTheme, colorTheme, setColorTheme, logout } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
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
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" title="Home">
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/community') ? 'text-robo-500 bg-robo-50 dark:bg-robo-500/10' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                Community
              </Link>
              {/* Admin Link for Demo */}
              <Link 
                to="/users"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${isActive('/users') ? 'text-robo-500 bg-robo-50 dark:bg-robo-500/10' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                title="User Management (Admin)"
              >
                <Users size={16} /> Users
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
             {/* Theme Picker */}
             <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Change Color Theme"
                >
                  <Palette size={20} />
                </button>
                {showThemePicker && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Select Theme</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setColorTheme(t.id)}
                          className={`w-full aspect-square rounded-full border-2 transition-all ${
                            colorTheme === t.id ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-110'
                          }`}
                          style={{ backgroundColor: `rgb(${t.colors[500]})` }}
                          title={t.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
             </div>

             {/* Theme Toggle (Light/Dark) */}
             <button
               onClick={toggleTheme}
               className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
               title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {/* Notification Bell */}
             <div className="relative" ref={notificationRef}>
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
                 title="Notifications"
               >
                 <Bell size={20} />
                 {unreadNotifications > 0 && (
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                 )}
               </button>
               <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
             </div>
             
             {/* Messages */}
             <Link to="/messages" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative" title="Messages">
                <Mail size={20} />
                {unreadMessages > 0 && (
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-robo-500 rounded-full"></span>
                 )}
             </Link>

             {/* Help */}
             <Link to="/support" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Support Center">
                <HelpCircle size={20} />
             </Link>

             {/* Logout */}
             <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Logout"
             >
                <LogOut size={20} />
             </button>

             {/* Profile Link */}
             <Link to="/profile" className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700" title="My Profile">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-robo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block">{user?.name}</span>
             </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-robo-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-robo-50 dark:bg-gray-800 text-robo-600 dark:text-robo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
               to="/community"
               onClick={() => setIsOpen(false)}
               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
               Community
            </Link>
            <Link
               to="/users"
               onClick={() => setIsOpen(false)}
               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
               Users (Admin)
            </Link>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center px-5 mb-4">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full bg-gray-300 object-cover" src={user?.avatar} alt="" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-gray-800 dark:text-white">{user?.name}</div>
                <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400 mt-1">{user?.email}</div>
              </div>
            </div>
            <div className="px-2 space-y-1">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Your Profile</Link>
              <Link to="/messages" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Messages</Link>
              <Link to="/support" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Support</Link>
              <button 
                onClick={() => {
                   handleLogout();
                   setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, Menu, X, User } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Community', path: '/community' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-robo-500/10 p-2 rounded-lg border border-robo-500/30 group-hover:border-robo-500 transition-colors">
              <Hammer className="h-6 w-6 text-robo-500" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Tool<span className="text-robo-500">Share</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-robo-500 bg-robo-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
             <Link to="/profile">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 hover:border-gray-500 cursor-pointer">
                  <User size={16} className="text-gray-400" />
                </div>
             </Link>
             <div id="list-tool-btn">
                <Link to="/list-tool">
                  <Button size="sm" variant="primary">List a Tool</Button>
                </Link>
             </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
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
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
               Profile
            </Link>
            <div className="pt-4 border-t border-gray-800 mt-2">
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
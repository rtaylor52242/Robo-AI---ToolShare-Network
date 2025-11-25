import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Zap, Users, Hammer } from 'lucide-react';
import Button from '../components/Button';
import ToolCard from '../components/ToolCard';
import CategoryBrowser from '../components/CategoryBrowser';
import { MOCK_TOOLS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredTools = MOCK_TOOLS.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 z-0 transition-colors duration-300">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-10 blur-sm"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Build Anything. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-robo-500 to-robo-accent">
              Rent the Tools.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Access high-quality tools from your local community. Or monetize your idle gear. 
            Powered by AI to help you find exactly what you need.
          </p>

          {/* Search Box */}
          <div id="search-container" className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-2 rounded-2xl border border-gray-200 dark:border-gray-700 flex gap-2 shadow-2xl transition-colors duration-300">
            <div className="flex-grow relative">
               <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
               <input 
                 type="text" 
                 placeholder="What tool do you need today?" 
                 className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 pl-10 py-3"
                 onKeyDown={(e) => e.key === 'Enter' && navigate('/explore')}
               />
            </div>
            <Button size="lg" onClick={() => navigate('/explore')}>
              Search
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center gap-8 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center gap-2">
               <Shield size={16} className="text-robo-500" />
               <span>Insured Rentals</span>
            </div>
            <div className="flex items-center gap-2">
               <Zap size={16} className="text-robo-accent" />
               <span>Instant Booking</span>
            </div>
            <div className="flex items-center gap-2">
               <Users size={16} className="text-green-500" />
               <span>Verified Lenders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Browser Section */}
      <section id="category-section" className="py-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Browse by Category</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Find the right equipment for your specific job</p>
            </div>
          </div>
          <CategoryBrowser />
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">Featured Tools</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Top rated gear in your area</p>
            </div>
            <Link to="/explore" className="text-robo-500 hover:text-robo-400 flex items-center gap-1 text-sm font-medium">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">How ToolShare Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:border-robo-500/50 transition-colors shadow-sm">
                <div className="w-16 h-16 bg-robo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-robo-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Find</h3>
                <p className="text-gray-600 dark:text-gray-400">Search for tools or describe your project to our AI assistant for recommendations.</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:border-robo-500/50 transition-colors shadow-sm">
                <div className="w-16 h-16 bg-robo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-robo-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Book</h3>
                <p className="text-gray-600 dark:text-gray-400">Select your dates, review the price, and send a booking request instantly.</p>
             </div>
             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:border-robo-500/50 transition-colors shadow-sm">
                <div className="w-16 h-16 bg-robo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hammer className="text-robo-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Build</h3>
                <p className="text-gray-600 dark:text-gray-400">Pick up the tool, complete your project, and return it. Rate your experience.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
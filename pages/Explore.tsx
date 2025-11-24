import React, { useState, useMemo } from 'react';
import { Filter, Search, X, Map as MapIcon, List, Calendar, Navigation } from 'lucide-react';
import { MOCK_TOOLS, SEARCH_SUGGESTIONS } from '../constants';
import ToolCard from '../components/ToolCard';
import Button from '../components/Button';
import { ToolCategory } from '../types';
import MapVisual from '../components/MapVisual';

const Explore: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'All'>('All');
  const [priceRange, setPriceRange] = useState<number>(100);
  const [radius, setRadius] = useState<number>(10); // miles
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = ['All', ...Object.values(ToolCategory)];

  // Filter Logic
  const filteredTools = useMemo(() => {
    return MOCK_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesPrice = tool.pricePerDay <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-950">
      {/* Top Bar - Search & View Toggle */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Advanced Search Bar */}
          <div className="relative w-full md:w-96 lg:w-[32rem]">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search tools (e.g., 'Drill', 'Saw')" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-robo-500 focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggles & Filter Mobile */}
          <div className="flex gap-2 w-full md:w-auto">
             <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-robo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <List size={16} /> List
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-robo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <MapIcon size={16} /> Map
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters - Desktop */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto hidden md:block z-20">
            <div className="flex items-center gap-2 mb-6 text-white">
              <Filter size={20} className="text-robo-500" />
              <h3 className="font-bold text-lg">Filters</h3>
            </div>

            {/* Availability Dates */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar size={14} /> Availability
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                   <label className="text-[10px] text-gray-500 mb-1 block">From</label>
                   <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-robo-500 outline-none" />
                </div>
                <div>
                   <label className="text-[10px] text-gray-500 mb-1 block">To</label>
                   <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-robo-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Location Radius */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                 <span className="flex items-center gap-2"><Navigation size={14} /> Distance</span>
                 <span className="text-white normal-case">{radius} miles</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                step="1"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-robo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                <span>1 mi</span>
                <span>50 mi</span>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-md hover:bg-gray-800 transition-colors">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'bg-robo-500 border-robo-500' : 'border-gray-600 group-hover:border-gray-400'}`}>
                       {selectedCategory === cat && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat as any)}
                      className="hidden"
                    />
                    <span className={`text-sm ${selectedCategory === cat ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                 <span>Max Price</span>
                 <span className="text-white normal-case">${priceRange}/day</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-robo-500"
              />
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-950 relative">
          
          {viewMode === 'map' ? (
             <div className="w-full h-full relative">
                {/* Overlay with results count for map */}
                <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 shadow-xl">
                   <p className="text-sm font-medium text-white">{filteredTools.length} tools found nearby</p>
                </div>
                <MapVisual tools={filteredTools} />
             </div>
          ) : (
             <div className="p-6">
                <div className="mb-4 text-gray-400 text-sm flex justify-between items-center">
                  <span>Showing {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''}</span>
                  <span className="md:hidden text-robo-500">Filters available on desktop</span>
                </div>

                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-gray-900 rounded-2xl border border-dashed border-gray-800">
                    <Search className="text-gray-700 mb-4" size={48} />
                    <p className="text-gray-400 text-lg mb-2">No tools found matching your criteria.</p>
                    <Button 
                       variant="outline"
                       onClick={() => {setSelectedCategory('All'); setSearchQuery(''); setPriceRange(100);}}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
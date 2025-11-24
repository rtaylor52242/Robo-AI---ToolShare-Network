import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Image as ImageIcon, Trash2, Copy, Zap, Info, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import { ToolCategory, ToolCondition } from '../types';
import { MOCK_SPEC_DATABASE } from '../constants';

interface ListingItem {
  id: number;
  name: string;
  category: ToolCategory | '';
  condition: ToolCondition | '';
  price: string;
  description: string;
  // New Fields
  instantBooking: boolean;
  specs: {
    brand: string;
    model: string;
    powerSource: string;
    voltage: string;
  };
  safetyGuidelines: string;
}

const ListTool: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [items, setItems] = useState<ListingItem[]>([
    { 
      id: 1, 
      name: '', 
      category: '', 
      condition: '', 
      price: '', 
      description: '',
      instantBooking: true,
      specs: { brand: '', model: '', powerSource: '', voltage: '' },
      safetyGuidelines: ''
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Object.values(ToolCategory);
  const conditions = Object.values(ToolCondition);

  // Autofill Function
  const handleAutofill = (id: number, presetIndex: number) => {
    if (presetIndex < 0) return;
    const preset = MOCK_SPEC_DATABASE[presetIndex];
    
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: preset.name,
          category: preset.category,
          description: preset.description,
          specs: {
            brand: preset.specs.brand,
            model: preset.specs.model,
            powerSource: preset.specs.powerSource,
            voltage: preset.specs.voltage
          }
        };
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    const newItem: ListingItem = {
      id: Date.now(),
      name: '',
      category: '',
      condition: '',
      price: '',
      description: '',
      instantBooking: true,
      specs: { brand: '', model: '', powerSource: '', voltage: '' },
      safetyGuidelines: ''
    };
    setItems([...items, newItem]);
  };

  const handleDuplicate = (item: ListingItem) => {
    const newItem = { ...item, id: Date.now(), name: `${item.name} (Copy)` };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleChange = (id: number, field: keyof ListingItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSpecChange = (id: number, field: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, specs: { ...item.specs, [field]: value } } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-2">List Your Tools</h1>
          <p className="text-gray-400">Share your equipment with the community and start earning.</p>
        </div>

        {/* Mode Toggles */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 p-1 rounded-xl border border-gray-800 inline-flex">
            <button
              onClick={() => { setMode('single'); setItems([items[0]]); }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'single' ? 'bg-robo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Single Item
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'bulk' ? 'bg-robo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative group hover:border-gray-700 transition-colors shadow-xl">
                {mode === 'bulk' && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      type="button"
                      onClick={() => handleDuplicate(item)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg tooltip"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    {items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400">
                        {index + 1}
                      </span>
                      Tool Details
                   </h3>
                   
                   {/* Quick Fill Feature */}
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-robo-500 font-bold uppercase hidden sm:block">Quick Fill:</span>
                     <select 
                        className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-2 py-1 focus:border-robo-500 outline-none"
                        onChange={(e) => handleAutofill(item.id, parseInt(e.target.value))}
                        defaultValue={-1}
                     >
                        <option value={-1} disabled>Select preset...</option>
                        {MOCK_SPEC_DATABASE.map((preset, idx) => (
                           <option key={idx} value={idx}>{preset.label}</option>
                        ))}
                     </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Media & Core Info */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="aspect-square bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-robo-500 hover:text-robo-500 cursor-pointer transition-colors group/upload relative overflow-hidden">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      <ImageIcon size={32} className="mb-2 group-hover/upload:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Upload Photo</span>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                       <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                          <Zap size={12} className="text-yellow-500" /> Booking Settings
                       </h4>
                       <label className="flex items-center justify-between cursor-pointer group">
                          <div>
                             <span className="block text-sm text-white font-medium">Instant Booking</span>
                             <span className="block text-xs text-gray-500">Auto-approve requests</span>
                          </div>
                          <div className="relative">
                             <input 
                               type="checkbox" 
                               className="sr-only"
                               checked={item.instantBooking}
                               onChange={(e) => handleChange(item.id, 'instantBooking', e.target.checked)}
                             />
                             <div className={`w-10 h-6 rounded-full transition-colors ${item.instantBooking ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                             <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${item.instantBooking ? 'translate-x-4' : 'translate-x-0'}`}></div>
                          </div>
                       </label>
                    </div>
                  </div>

                  {/* Right Column: Detailed Fields */}
                  <div className="lg:col-span-8 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tool Name</label>
                      <input
                        required
                        type="text"
                        value={item.name}
                        onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                        placeholder="e.g. DeWalt 20V Cordless Drill"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-robo-500 focus:ring-1 focus:ring-robo-500 transition-all placeholder-gray-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                        <select
                          required
                          value={item.category}
                          onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-robo-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select...</option>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Condition</label>
                        <select
                          required
                          value={item.condition}
                          onChange={(e) => handleChange(item.id, 'condition', e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-robo-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select...</option>
                          {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Specifications Subsection */}
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                       <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                          <Info size={12} className="text-robo-500" /> Technical Specifications
                       </h4>
                       <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                             <label className="block text-[10px] text-gray-500 uppercase mb-1">Brand</label>
                             <input
                                type="text"
                                value={item.specs.brand}
                                onChange={(e) => handleSpecChange(item.id, 'brand', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-robo-500 outline-none"
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] text-gray-500 uppercase mb-1">Model No.</label>
                             <input
                                type="text"
                                value={item.specs.model}
                                onChange={(e) => handleSpecChange(item.id, 'model', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-robo-500 outline-none"
                             />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] text-gray-500 uppercase mb-1">Power Source</label>
                             <select
                                value={item.specs.powerSource}
                                onChange={(e) => handleSpecChange(item.id, 'powerSource', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-robo-500 outline-none"
                             >
                                <option value="">Select...</option>
                                <option value="Battery">Battery</option>
                                <option value="Electric (Corded)">Electric (Corded)</option>
                                <option value="Gas">Gas</option>
                                <option value="Manual">Manual</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-[10px] text-gray-500 uppercase mb-1">Voltage / Rating</label>
                             <input
                                type="text"
                                value={item.specs.voltage}
                                onChange={(e) => handleSpecChange(item.id, 'voltage', e.target.value)}
                                placeholder="e.g. 20V, 15 Amp"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-robo-500 outline-none"
                             />
                          </div>
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Daily Price ($)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleChange(item.id, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-robo-500 transition-all"
                      />
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                       <textarea
                         required
                         value={item.description}
                         onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                         placeholder="Describe features, specs, and included accessories..."
                         className="w-full h-24 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-robo-500 resize-none"
                       />
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-green-500" /> Safety Guidelines
                       </label>
                       <textarea
                         value={item.safetyGuidelines}
                         onChange={(e) => handleChange(item.id, 'safetyGuidelines', e.target.value)}
                         placeholder="Important safety warnings for the renter..."
                         className="w-full h-20 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-robo-500 resize-none"
                       />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {mode === 'bulk' ? (
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 text-robo-500 hover:text-white transition-colors font-medium"
              >
                <Plus size={20} /> Add Another Item
              </button>
            ) : <div></div>}

            <div className="flex gap-4 w-full md:w-auto">
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : `Publish ${items.length} Listing${items.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListTool;
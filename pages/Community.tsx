
import React, { useState } from 'react';
import { MessageSquare, Heart, Hash, Search, Plus, User, Clock, Eye, MessageCircle, ChevronRight, X } from 'lucide-react';
import { MOCK_FORUM_THREADS } from '../constants';
import { ForumThread } from '../types';
import Button from '../components/Button';

const Community: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Recommendations' | 'Projects' | 'Meetups' | 'General'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState<ForumThread[]>(MOCK_FORUM_THREADS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('General');

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = activeCategory === 'All' || thread.category === activeCategory;
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Recommendations', 'Projects', 'Meetups', 'General'];

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    const newThread: ForumThread = {
      id: Date.now().toString(),
      title: newThreadTitle,
      author: 'You', // In real app, current user
      category: newThreadCategory as any,
      replies: 0,
      views: 0,
      lastActive: 'Just now'
    };
    setThreads([newThread, ...threads]);
    setIsModalOpen(false);
    setNewThreadTitle('');
    setNewThreadCategory('General');
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Community Forum</h1>
            <p className="text-gray-400">Connect with local makers, share projects, and get advice.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-robo-500 outline-none"
                />
             </div>
             <Button onClick={() => setIsModalOpen(true)} className="gap-2 whitespace-nowrap">
                <Plus size={18} /> New Thread
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* Sidebar Navigation */}
           <div className="space-y-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                 <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 px-2">Categories</h3>
                 <div className="space-y-1">
                    {categories.map(cat => (
                       <button
                         key={cat}
                         onClick={() => setActiveCategory(cat as any)}
                         className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${activeCategory === cat ? 'bg-robo-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                       >
                          {cat}
                          {activeCategory === cat && <ChevronRight size={14} />}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                 <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 px-2">Trending Tags</h3>
                 <div className="flex flex-wrap gap-2">
                    {['#woodworking', '#DIY', '#PowerTools', '#Safety', '#DeckBuild', '#Gardening'].map(tag => (
                       <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md border border-gray-700 hover:border-robo-500 cursor-pointer transition-colors">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>
           </div>

           {/* Thread List */}
           <div className="lg:col-span-3 space-y-4">
              {filteredThreads.length > 0 ? (
                 filteredThreads.map(thread => (
                    <div key={thread.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-robo-500/50 transition-all cursor-pointer group">
                       <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                   thread.category === 'Recommendations' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                   thread.category === 'Projects' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                   thread.category === 'Meetups' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                   'bg-gray-700 text-gray-300 border-gray-600'
                                }`}>
                                   {thread.category}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                   <Clock size={12} /> Last active {thread.lastActive}
                                </span>
                             </div>
                             <h3 className="text-lg font-bold text-white mb-2 group-hover:text-robo-400 transition-colors">{thread.title}</h3>
                             <div className="flex items-center gap-2 text-sm text-gray-400">
                                <User size={14} /> Posted by <span className="text-white">{thread.author}</span>
                             </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row gap-4 text-gray-500">
                             <div className="text-center min-w-[60px]">
                                <span className="block text-xl font-bold text-white">{thread.replies}</span>
                                <span className="text-xs">replies</span>
                             </div>
                             <div className="text-center min-w-[60px]">
                                <span className="block text-xl font-bold text-white">{thread.views}</span>
                                <span className="text-xs">views</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))
              ) : (
                 <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                    <MessageCircle size={48} className="mx-auto text-gray-700 mb-4" />
                    <h3 className="text-white font-bold mb-2">No discussions found</h3>
                    <p className="text-gray-500 mb-6">Be the first to start a conversation in this category.</p>
                    <Button onClick={() => setIsModalOpen(true)}>Start a Discussion</Button>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
               <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                  <h3 className="font-bold text-white">Start New Discussion</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                     <X size={20} />
                  </button>
               </div>
               <form onSubmit={handleCreateThread} className="p-6 space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic Title</label>
                     <input 
                        required
                        type="text" 
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                     <div className="grid grid-cols-2 gap-2">
                        {categories.filter(c => c !== 'All').map(cat => (
                           <div 
                              key={cat}
                              onClick={() => setNewThreadCategory(cat)}
                              className={`p-3 rounded-lg border cursor-pointer text-sm text-center transition-all ${newThreadCategory === cat ? 'bg-robo-500/20 border-robo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                           >
                              {cat}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                     <textarea 
                        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500 resize-none"
                        placeholder="Elaborate on your question or project..."
                     />
                  </div>
                  <div className="flex gap-4">
                     <Button type="button" variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>Cancel</Button>
                     <Button type="submit" fullWidth disabled={!newThreadTitle}>Post Thread</Button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Community;

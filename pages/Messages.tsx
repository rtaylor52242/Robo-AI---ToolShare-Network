
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Info, Send, Image as ImageIcon, Mic, Smile, X, MicOff, VideoOff, MonitorUp, MessageSquare, Download, Trash2, Share2, Paperclip, Mail, MailOpen } from 'lucide-react';
import { Message } from '../types';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const Messages: React.FC = () => {
  const { conversations, user, sendMessage } = useApp();
  const [activeConversationId, setActiveConversationId] = useState<string>(conversations[0]?.id);
  const [inputText, setInputText] = useState('');
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (activeConversationId === undefined && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showActionsDropdown && !target.closest('#chat-actions-menu') && !target.closest('#chat-actions-toggle')) {
        setShowActionsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionsDropdown]);

  const handleConversationClick = (id: string) => {
    setActiveConversationId(id);
    // In a real app, we'd mark as read here via an API
    setShowActionsDropdown(false);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now(),
      type: 'text'
    };

    sendMessage(activeConversationId, newMessage);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversationId) return;

    // Create a fake object URL for preview purposes
    const imageUrl = URL.createObjectURL(file);

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: 'Sent an image',
      imageUrl: imageUrl,
      timestamp: Date.now(),
      type: 'image'
    };

    sendMessage(activeConversationId, newMessage);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleDownloadChat = () => {
    if (!activeConversation) return;
    
    const chatText = activeConversation.messages.map(m => {
      const time = new Date(m.timestamp).toLocaleString();
      const sender = m.senderId === 'me' ? 'You' : activeConversation.participantName;
      const content = m.type === 'image' ? '[Image Attachment]' : m.text;
      return `[${time}] ${sender}: ${content}`;
    }).join('\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_history_${activeConversation.participantName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowActionsDropdown(false);
  };

  const handleClearChat = () => {
    if (!activeConversation) return;
    if (window.confirm("Are you sure you want to clear this conversation history? This action cannot be undone.")) {
      // In real app, call API to clear
      alert('Chat cleared (simulated)');
    }
    setShowActionsDropdown(false);
  };

  const handleShareChat = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link to chat copied to clipboard!");
    setShowActionsDropdown(false);
  };

  const VideoModal = () => (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-4 bg-gray-900/50 absolute top-0 w-full z-10 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
             <span className="text-white font-medium text-sm">00:45</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-white font-bold">{activeConversation?.participantName}</span>
             <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">HD</span>
          </div>
          <button onClick={() => setIsVideoCallOpen(false)} className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60">
             <X size={20} />
          </button>
        </div>

        {/* Main Video Area (Remote) */}
        <div className="flex-1 bg-gray-800 relative">
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Placeholder for remote video stream */}
             <div className="text-center">
                <img 
                  src={activeConversation?.participantAvatar} 
                  alt="" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 opacity-50"
                />
                <p className="text-gray-500 animate-pulse">Connecting video stream...</p>
             </div>
          </div>
          
          {/* Self View (PIP) */}
          <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-950 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
             <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-xs text-gray-500">You</span>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-6 flex justify-center items-center gap-6">
           <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors border border-gray-700">
              <MicOff size={24} />
           </button>
           <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors border border-gray-700">
              <VideoOff size={24} />
           </button>
           <button 
             onClick={() => setIsVideoCallOpen(false)}
             className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 scale-110"
           >
              <Phone size={28} className="rotate-[135deg]" />
           </button>
           <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors border border-gray-700">
              <MonitorUp size={24} />
           </button>
           <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors border border-gray-700">
              <MessageSquare size={24} />
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-950 overflow-hidden">
      {isVideoCallOpen && <VideoModal />}

      {/* Sidebar: Conversation List */}
      <div className="w-80 md:w-96 border-r border-gray-800 flex flex-col bg-gray-900/50">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-display font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-robo-500 placeholder-gray-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => handleConversationClick(conv.id)}
              className={`p-4 flex gap-3 hover:bg-gray-800/80 cursor-pointer transition-colors border-b border-gray-800/50 ${activeConversationId === conv.id ? 'bg-gray-800 border-l-2 border-l-robo-500' : ''}`}
            >
              <div className="relative">
                <img src={conv.participantAvatar} alt={conv.participantName} className="w-12 h-12 rounded-full object-cover bg-gray-800" />
                {conv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-medium truncate ${activeConversationId === conv.id ? 'text-white' : conv.unreadCount > 0 ? 'text-white font-bold' : 'text-gray-300'}`}>
                    {conv.participantName}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                     {conv.lastMessage}
                   </p>
                   {conv.unreadCount > 0 && (
                     <span className="ml-2 w-5 h-5 bg-robo-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                       {conv.unreadCount}
                     </span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="h-16 px-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <img src={activeConversation.participantAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                   {activeConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                   )}
                </div>
                <div>
                  <h3 className="text-white font-bold">{activeConversation.participantName}</h3>
                  <p className="text-xs text-gray-400">{activeConversation.isOnline ? 'Online now' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative">
                <button 
                  onClick={() => setIsVideoCallOpen(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                  title="Video Call"
                >
                  <Video size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <div className="h-6 w-px bg-gray-800 mx-1"></div>
                <button 
                  id="chat-actions-toggle"
                  onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                  className={`p-2 hover:text-white hover:bg-gray-800 rounded-full transition-colors ${showActionsDropdown ? 'text-white bg-gray-800' : 'text-gray-400'}`}
                >
                  <MoreVertical size={20} />
                </button>

                {/* Dropdown Menu */}
                {showActionsDropdown && (
                  <div id="chat-actions-menu" className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                    >
                      <Mail size={16} /> Mark as Unread
                    </button>
                    <button 
                      onClick={handleDownloadChat}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                    >
                      <Download size={16} /> Download Chat
                    </button>
                    <button 
                      onClick={handleShareChat}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                    >
                      <Share2 size={16} /> Share Chat
                    </button>
                    <div className="border-t border-gray-800"></div>
                    <button 
                      onClick={handleClearChat}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/10 hover:text-red-300 flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Clear Chat History
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeConversation.messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500 italic">
                  No messages in this conversation.
                </div>
              ) : (
                <>
                  <div className="text-center text-xs text-gray-500 my-4">
                    <span>Today</span>
                  </div>
                  {activeConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                      {msg.senderId !== 'me' && (
                        <img src={activeConversation.participantAvatar} className="w-8 h-8 rounded-full mr-2 self-end mb-1" alt="" />
                      )}
                      <div className={`max-w-[70%] group relative ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`rounded-2xl overflow-hidden ${
                            msg.senderId === 'me' 
                              ? 'bg-robo-600 text-white rounded-br-none' 
                              : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                          }`}
                        >
                          {msg.type === 'image' && msg.imageUrl ? (
                            <div className="relative">
                                <img src={msg.imageUrl} alt="Attachment" className="max-w-full sm:max-w-sm rounded-lg" />
                            </div>
                          ) : (
                            <div className="px-4 py-2.5 text-sm">
                              {msg.text}
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] text-gray-500 mt-1 block ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 relative">
               {/* Emoji Picker */}
               {showEmojiPicker && (
                 <div className="absolute bottom-full left-4 mb-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-3 z-20">
                    <div className="grid grid-cols-6 gap-2">
                       {['😀', '😂', '👍', '❤️', '🔥', '🎉', '🛠️', '🔨', '✅', '⚠️', '👀', '👋'].map(emoji => (
                          <button 
                             key={emoji}
                             onClick={() => handleAddEmoji(emoji)}
                             className="text-xl hover:bg-gray-800 p-2 rounded-lg transition-colors"
                          >
                             {emoji}
                          </button>
                       ))}
                    </div>
                 </div>
               )}

               <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                 {/* Image Upload Input */}
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                 />
                 <button 
                   type="button" 
                   onClick={() => fileInputRef.current?.click()}
                   className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                 >
                   <ImageIcon size={20} />
                 </button>
                 
                 <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 focus-within:border-robo-500 focus-within:ring-1 focus-within:ring-robo-500 flex items-center relative">
                   <input 
                     type="text" 
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     placeholder="Type a message..."
                     className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-gray-500"
                   />
                   <button 
                     type="button" 
                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                     className={`p-2 mr-1 transition-colors rounded-lg ${showEmojiPicker ? 'text-robo-500' : 'text-gray-400 hover:text-white'}`}
                   >
                     <Smile size={20} />
                   </button>
                 </div>
                 {inputText.trim() ? (
                   <button 
                     type="submit"
                     className="p-3 bg-robo-500 text-white rounded-xl hover:bg-robo-600 transition-colors shadow-lg shadow-robo-500/20"
                   >
                     <Send size={20} />
                   </button>
                 ) : (
                   <button type="button" className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:text-white border border-gray-700 hover:border-gray-600">
                     <Mic size={20} />
                   </button>
                 )}
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
             <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="opacity-50" />
             </div>
             <p className="text-lg font-medium">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

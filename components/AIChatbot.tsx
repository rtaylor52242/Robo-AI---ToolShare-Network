import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, ChevronDown } from 'lucide-react';
import { ChatMessage } from '../types';
import { getToolRecommendations } from '../services/geminiService';
import { MOCK_TOOLS } from '../constants';
import ToolCard from './ToolCard';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hi! I'm Robo AI. Tell me about your project (e.g., 'I want to build a bookshelf'), and I'll recommend the perfect tools for the job.",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call Gemini Service
      const recommendations = await getToolRecommendations(userMsg.text, MOCK_TOOLS);
      
      const toolIds = recommendations.map(r => r.toolId);
      const responseText = recommendations.length > 0 
        ? `Based on your project, I recommend these tools:\n\n${recommendations.map(r => `• **${MOCK_TOOLS.find(t => t.id === r.toolId)?.name}**: ${r.reason}`).join('\n')}`
        : "I couldn't find any specific tools for that project in our current inventory. Could you describe it differently?";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        recommendedToolIds: toolIds,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, my circuits are jammed. I couldn't process that request right now.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render a subset of recommended tools inside the chat
  const renderRecommendedTools = (toolIds?: string[]) => {
    if (!toolIds || toolIds.length === 0) return null;
    
    const toolsToShow = MOCK_TOOLS.filter(t => toolIds.includes(t.id));
    
    return (
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 snap-x">
        {toolsToShow.map(tool => (
          <div key={tool.id} className="min-w-[200px] max-w-[200px] snap-center">
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[600px] animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-robo-600 to-robo-500 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-full">
                <Sparkles size={16} className="text-robo-600" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Robo Assistant</h3>
                <p className="text-blue-100 text-xs">AI-Powered Tool Matching</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-900 space-y-4 min-h-[300px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-robo-600 text-white rounded-br-sm' 
                      : 'bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'ai' && renderRecommendedTools(msg.recommendedToolIds)}
                <span className="text-[10px] text-gray-500 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs ml-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="relative flex items-center gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your project..."
                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-robo-500 focus:ring-1 focus:ring-robo-500 resize-none h-[50px] overflow-hidden"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="bg-robo-500 text-white p-3 rounded-xl hover:bg-robo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        id="ai-chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-robo-500 text-white shadow-lg shadow-robo-500/40 hover:bg-robo-600 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-robo-500/30"
      >
        {isOpen ? (
          <ChevronDown size={28} />
        ) : (
          <>
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
};

export default AIChatbot;

import React, { useState } from 'react';
import { X, Link as LinkIcon, Facebook, Twitter, Linkedin, Mail, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
          <h3 className="font-bold text-white">Share Listing</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-400">Share <span className="text-white font-bold">{title}</span> with your friends and network.</p>
          
          <div className="grid grid-cols-4 gap-4">
             <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                   <Facebook size={24} />
                </div>
                <span className="text-xs text-gray-400">Facebook</span>
             </button>
             <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                   <Twitter size={24} />
                </div>
                <span className="text-xs text-gray-400">Twitter</span>
             </button>
             <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                   <Linkedin size={24} />
                </div>
                <span className="text-xs text-gray-400">LinkedIn</span>
             </button>
             <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white group-hover:bg-gray-600 transition-colors">
                   <Mail size={24} />
                </div>
                <span className="text-xs text-gray-400">Email</span>
             </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-2 border border-gray-700">
             <div className="flex-1 truncate text-xs text-gray-400 px-2 font-mono">
                {url}
             </div>
             <button 
               onClick={handleCopy}
               className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
             >
                {copied ? <Check size={14} className="text-green-500" /> : <LinkIcon size={14} />}
                {copied ? 'Copied' : 'Copy'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

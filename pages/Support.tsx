
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Book, ShieldQuestion, LifeBuoy, X, Send } from 'lucide-react';
import { MOCK_FAQS } from '../constants';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  
  // Contact Form Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filteredFaqs = MOCK_FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSending(false);
      setIsContactModalOpen(false);
      setContactSubject('');
      setContactMessage('');
      alert("Message sent successfully! Our team will reply shortly.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-robo-500/10 text-robo-500 mb-4 border border-robo-500/20">
             <LifeBuoy size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">How can we help?</h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Search our knowledge base or get in touch with our support team. We're here to help you get the job done.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-robo-500 focus:ring-1 focus:ring-robo-500 outline-none shadow-xl"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-robo-500/50 transition-all group cursor-pointer" onClick={() => navigate('/dispute')}>
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                 <ShieldQuestion size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Resolution Center</h3>
              <p className="text-sm text-gray-400">Report an issue with a tool, user, or booking to open a dispute.</p>
           </div>
           
           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-robo-500/50 transition-all group cursor-pointer" onClick={() => document.getElementById('ai-chatbot-toggle')?.click()}>
              <div className="w-12 h-12 bg-robo-500/10 rounded-xl flex items-center justify-center text-robo-500 mb-4 group-hover:scale-110 transition-transform">
                 <MessageCircle size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-400">Chat with our 24/7 automated assistant or request a human agent.</p>
           </div>

           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-robo-500/50 transition-all group cursor-pointer">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                 <Book size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">User Guides</h3>
              <p className="text-sm text-gray-400">Step-by-step tutorials on listing tools, renting, and safety.</p>
           </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
           
           <div className="space-y-4">
             {filteredFaqs.length > 0 ? (
               filteredFaqs.map((faq) => (
                 <div 
                   key={faq.id} 
                   className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                 >
                   <button 
                     onClick={() => toggleFaq(faq.id)}
                     className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-800/50 transition-colors"
                   >
                     <span className="font-medium text-gray-200">{faq.question}</span>
                     {openFaqId === faq.id ? <ChevronUp size={20} className="text-robo-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                   </button>
                   
                   {openFaqId === faq.id && (
                     <div className="px-6 pb-6 pt-2 text-gray-400 text-sm leading-relaxed border-t border-gray-800 bg-gray-800/20">
                       <span className="text-xs font-bold text-robo-500 uppercase mb-2 block">{faq.category}</span>
                       {faq.answer}
                     </div>
                   )}
                 </div>
               ))
             ) : (
               <div className="text-center py-10 text-gray-500">
                 No results found for "{searchQuery}"
               </div>
             )}
           </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-robo-500 to-purple-600"></div>
           <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
           <p className="text-gray-400 mb-6">Our support team is just an email away.</p>
           <Button variant="secondary" className="gap-2" onClick={() => setIsContactModalOpen(true)}>
             <Mail size={18} /> Contact Support
           </Button>
        </div>

      </div>

      {/* Contact Form Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)}></div>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <div className="flex items-center gap-2">
                 <Mail className="text-robo-500" size={20} />
                 <h3 className="font-bold text-white">Contact Support</h3>
              </div>
              <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendContact} className="p-6 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                  <select 
                     required
                     value={contactSubject}
                     onChange={(e) => setContactSubject(e.target.value)}
                     className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500 appearance-none"
                  >
                     <option value="" disabled>Select a topic...</option>
                     <option value="Billing Issue">Billing Issue</option>
                     <option value="Technical Support">Technical Support</option>
                     <option value="Account Access">Account Access</option>
                     <option value="Feedback">Feedback</option>
                     <option value="Other">Other</option>
                  </select>
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                  <textarea 
                     required
                     value={contactMessage}
                     onChange={(e) => setContactMessage(e.target.value)}
                     placeholder="Describe your issue in detail..."
                     className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500 resize-none"
                  />
               </div>
               
               <div className="pt-2">
                  <Button type="submit" fullWidth disabled={isSending}>
                     {isSending ? (
                       <span className="flex items-center gap-2">Sending...</span>
                     ) : (
                       <span className="flex items-center gap-2"><Send size={16} /> Send Message</span>
                     )}
                  </Button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Support;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, ArrowLeft, CheckCircle, Flag, MoreVertical, Ban, Info, AlertTriangle, Zap, Activity, DollarSign, Share2 } from 'lucide-react';
import { MOCK_TOOLS } from '../constants';
import Button from '../components/Button';
import ReportModal from '../components/ReportModal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import MaintenanceLog from '../components/MaintenanceLog';
import ReviewCard from '../components/ReviewCard';
import ShareModal from '../components/ShareModal';

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tool = MOCK_TOOLS.find(t => t.id === id);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<'tool' | 'user'>('tool');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4">Tool not found</p>
        <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
      </div>
    );
  }

  const handleBookClick = () => {
    navigate(`/checkout/${tool.id}`);
  };

  const handleMessageLender = () => {
    // In a real app, this would create a conversation ID and pass it
    navigate('/messages');
  };

  const handleReport = (type: 'tool' | 'user') => {
    setReportTarget(type);
    setReportModalOpen(true);
    setShowUserMenu(false);
  };

  const handleBlockUser = () => {
    alert(`Blocked user: ${tool.lenderName}`);
    setShowUserMenu(false);
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
             {/* Header Card */}
             <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative h-96">
                   <img 
                      src={tool.image} 
                      alt={tool.name} 
                      className="w-full h-full object-cover"
                   />
                   <div className="absolute top-4 right-4 flex gap-2">
                       {tool.instantBooking && (
                         <div className="bg-robo-500/90 backdrop-blur text-white font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-xs uppercase tracking-wide border border-robo-400">
                           <Zap size={14} className="fill-white" /> Instant Book
                         </div>
                       )}
                   </div>
                   <button 
                      onClick={() => setShareModalOpen(true)}
                      className="absolute top-4 left-4 bg-gray-900/50 backdrop-blur text-white p-2 rounded-full hover:bg-gray-900 transition-colors border border-gray-700"
                   >
                      <Share2 size={18} />
                   </button>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide border border-gray-700">
                            {tool.category}
                          </span>
                          {!tool.available && (
                            <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide border border-red-900/50">
                              Unavailable
                            </span>
                          )}
                          {tool.condition && (
                            <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide border border-blue-900/50">
                              Condition: {tool.condition}
                            </span>
                          )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-2">{tool.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                           <div className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-white font-bold">{tool.rating}</span> (24)
                           </div>
                           <div className="flex items-center gap-1">
                              <MapPin size={16} className="text-robo-500" />
                              {tool.location}
                           </div>
                           <div className="flex items-center gap-1 text-blue-400">
                              <ShieldCheck size={16} />
                              <span className="text-xs font-medium">Insured</span>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => handleReport('tool')} className="text-gray-500 hover:text-red-400 p-2">
                        <Flag size={20} />
                     </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-800 mb-6 flex gap-6">
                     <button 
                       onClick={() => setActiveTab('details')}
                       className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                     >
                       Overview
                     </button>
                     <button 
                       onClick={() => setActiveTab('history')}
                       className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                     >
                       Condition & Maintenance
                     </button>
                  </div>

                  {activeTab === 'details' ? (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                           <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Description</h3>
                           <p className="text-gray-300 leading-relaxed text-base">
                             {tool.description}
                           </p>
                        </div>
                        
                        {tool.specs && (
                           <div>
                              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <Info size={14} /> Technical Specifications
                              </h3>
                              <div className="grid grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                 {tool.specs.brand && (
                                    <div><span className="text-gray-500 text-xs block">Brand</span><span className="text-white font-medium">{tool.specs.brand}</span></div>
                                 )}
                                 {tool.specs.model && (
                                    <div><span className="text-gray-500 text-xs block">Model</span><span className="text-white font-medium">{tool.specs.model}</span></div>
                                 )}
                                 {tool.specs.powerSource && (
                                    <div><span className="text-gray-500 text-xs block">Power Source</span><span className="text-white font-medium">{tool.specs.powerSource}</span></div>
                                 )}
                                 {tool.specs.voltage && (
                                    <div><span className="text-gray-500 text-xs block">Voltage/Rating</span><span className="text-white font-medium">{tool.specs.voltage}</span></div>
                                 )}
                                 {tool.specs.weight && (
                                    <div><span className="text-gray-500 text-xs block">Weight</span><span className="text-white font-medium">{tool.specs.weight}</span></div>
                                 )}
                              </div>
                           </div>
                        )}

                        {tool.safetyGuidelines && (
                           <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                              <h3 className="text-sm font-bold text-red-400 uppercase mb-2 flex items-center gap-2">
                                <AlertTriangle size={14} /> Safety Guidelines
                              </h3>
                              <p className="text-red-200/80 text-sm">
                                {tool.safetyGuidelines}
                              </p>
                           </div>
                        )}
                        
                        {/* Reviews Section */}
                        <div>
                           <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Reviews</h3>
                           <div className="space-y-4">
                              <ReviewCard review={{
                                 id: 'r1', authorName: 'John Doe', authorAvatar: '', rating: 5, text: 'Great tool!', date: '2023-10-10', verified: true, helpfulCount: 2
                              }} />
                           </div>
                           <Button variant="ghost" fullWidth className="mt-2 text-sm text-robo-500">View All Reviews</Button>
                        </div>
                     </div>
                  ) : (
                     <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-sm font-bold text-gray-500 uppercase">Maintenance History</h3>
                           <span className="text-xs text-gray-400">Last updated by owner</span>
                        </div>
                        <MaintenanceLog logs={tool.maintenanceHistory || []} />
                     </div>
                  )}

                </div>
             </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
             {/* Booking Card */}
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl sticky top-24">
                <div className="flex justify-between items-end mb-6">
                   <div>
                      <span className="text-3xl font-bold text-white font-display">${tool.pricePerDay}</span>
                      <span className="text-gray-400"> / day</span>
                   </div>
                   {tool.pricing && (
                     <div className="text-right text-xs text-gray-500">
                        <div>${tool.pricing.weekly} / week</div>
                        <div className="text-green-500 font-medium">Save on long term</div>
                     </div>
                   )}
                </div>

                <div className="mb-6">
                   <AvailabilityCalendar unavailableDates={tool.unavailableDates} />
                </div>
                
                {tool.securityDeposit && (
                  <div className="mb-6 p-3 bg-gray-800/50 rounded-lg flex items-center gap-3 border border-gray-700">
                    <ShieldCheck className="text-green-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">Security Deposit</p>
                      <p className="text-white font-medium text-sm">${tool.securityDeposit} (Refundable)</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                   <Button 
                      variant="primary" 
                      fullWidth 
                      size="lg" 
                      onClick={handleBookClick}
                      disabled={!tool.available}
                      className={tool.instantBooking ? 'bg-gradient-to-r from-robo-500 to-robo-400' : ''}
                   >
                      {tool.available 
                         ? (tool.instantBooking ? <><Zap size={18} className="mr-2 fill-white" /> Book Instantly</> : 'Request to Book') 
                         : 'Join Waitlist'
                      }
                   </Button>
                   <p className="text-center text-xs text-gray-500">
                     {tool.instantBooking ? 'No approval required. Instant confirmation.' : "You won't be charged until the lender accepts."}
                   </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-gray-400 uppercase">Lender</h4>
                      <div className="relative">
                         <button onClick={() => setShowUserMenu(!showUserMenu)} className="text-gray-500 hover:text-white">
                            <MoreVertical size={16} />
                         </button>
                         {showUserMenu && (
                            <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 w-40 overflow-hidden">
                               <button onClick={() => handleReport('user')} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2">
                                  <Flag size={14} /> Report User
                               </button>
                               <button onClick={handleBlockUser} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center gap-2">
                                  <Ban size={14} /> Block User
                               </button>
                            </div>
                         )}
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-robo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                       {tool.lenderName.charAt(0)}
                     </div>
                     <div>
                       <p className="text-white font-medium hover:underline cursor-pointer">{tool.lenderName}</p>
                       <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                         <ShieldCheck size={12} className="text-green-500" />
                         <span>Verified Owner</span>
                       </div>
                       <div className="flex gap-3 text-xs text-gray-500 mt-2">
                          <div>
                             <span className="text-white font-bold block">98%</span>
                             Response
                          </div>
                          <div>
                             <span className="text-white font-bold block">100%</span>
                             Completion
                          </div>
                       </div>
                     </div>
                   </div>
                   
                   <Button 
                      variant="secondary" 
                      fullWidth 
                      size="sm" 
                      className="mt-4"
                      onClick={handleMessageLender}
                   >
                      Message Lender
                   </Button>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      <ReportModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)}
        targetName={reportTarget === 'tool' ? tool.name : tool.lenderName}
        targetType={reportTarget}
      />
      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={tool.name}
        url={window.location.href}
      />
    </div>
  );
};

export default ToolDetail;

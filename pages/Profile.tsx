
import React, { useState, useEffect, useRef } from 'react';
import { User, MapPin, Calendar, Shield, Settings, History, Lock, Edit2, LogOut, CheckCircle, Ban, Unlock, X, Download, Upload, CreditCard, Camera } from 'lucide-react';
import { MOCK_ACTIVITY_LOG } from '../constants';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, activityLog, logout, updateUser, verifyUser } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'history'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for profile details, initialized from context user
  const [profileUser, setProfileUser] = useState(user);
  
  const [blockedUsers, setBlockedUsers] = useState([
     { id: 'b1', name: 'Spammy McSpamface', date: '2023-11-10' },
     { id: 'b2', name: 'Rude Guy', date: '2024-01-05' }
  ]);

  // Modals State
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'upload' | 'processing' | 'success'>('upload');
  
  const [editForm, setEditForm] = useState({
     email: user?.email || '',
     phone: user?.phone || '',
     location: user?.location || ''
  });

  // Sync state when context user changes (e.g. login or update)
  useEffect(() => {
    if (user) {
      setProfileUser(user);
      setEditForm({
        email: user.email,
        phone: user.phone,
        location: user.location
      });
    }
  }, [user]);

  if (!profileUser) return <div>Loading...</div>;

  const togglePrivacy = (key: keyof typeof profileUser.privacy) => {
    const newPrivacy = { ...profileUser.privacy, [key]: !profileUser.privacy[key] };
    updateUser({ privacy: newPrivacy });
  };

  const handleUnblock = (id: string) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== id));
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location
    });
    setIsEditContactOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateUser({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationSubmit = () => {
    setVerificationStep('processing');
    setTimeout(() => {
      setVerificationStep('success');
      verifyUser();
    }, 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Title', 'Description', 'Amount'];
    const rows = activityLog.map(log => [
      new Date(log.timestamp).toLocaleDateString(),
      log.type,
      `"${log.title}"`,
      `"${log.description}"`,
      log.amount ? log.amount.toString() : '0'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-robo-900 to-gray-900 opacity-50"></div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 pt-12">
            <div className="relative group">
               <img 
                 src={profileUser.avatar} 
                 alt={profileUser.name} 
                 className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-xl object-cover bg-gray-800"
               />
               <button 
                 onClick={handleAvatarClick}
                 className="absolute bottom-1 right-1 bg-robo-500 text-white p-2 rounded-full hover:bg-robo-600 border border-gray-900 transition-colors cursor-pointer shadow-lg"
                 title="Change Profile Picture"
               >
                 <Edit2 size={14} />
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleAvatarChange} 
                 className="hidden" 
                 accept="image/*"
               />
            </div>
            
            <div className="flex-1 mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl font-display font-bold text-white">{profileUser.name}</h1>
                {profileUser.verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wide">
                    <Shield size={12} /> Verified
                  </span>
                ) : (
                  <button 
                    onClick={() => { setIsVerificationModalOpen(true); setVerificationStep('upload'); }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500 text-xs font-bold uppercase tracking-wide transition-colors"
                  >
                    Unverified (Click to Verify)
                  </button>
                )}
              </div>
              <p className="text-gray-400 max-w-xl">{profileUser.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-robo-500" />
                  {profileUser.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {new Date(profileUser.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
               <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                 <LogOut size={16} /> Logout
               </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <User size={18} /> Profile Overview
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Settings size={18} /> Settings & Privacy
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'history' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <History size={18} /> Activity History
          </button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-500">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Stats & Badges */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Reputation</h3>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                    <span className="text-gray-400">Average Rating</span>
                    <span className="text-2xl font-bold text-yellow-500">★ {profileUser.stats.avgRating}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-2xl font-bold text-white">{profileUser.stats.rentalsCount}</p>
                      <p className="text-xs text-gray-500 uppercase">Rentals</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-2xl font-bold text-white">{profileUser.stats.listingsCount}</p>
                      <p className="text-xs text-gray-500 uppercase">Listings</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.badges.length > 0 ? profileUser.badges.map((badge, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700 flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" /> {badge}
                      </span>
                    )) : (
                      <p className="text-gray-500 text-xs">No badges earned yet.</p>
                    )}
                  </div>
                </div>
                
                {!profileUser.verified && (
                   <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
                      <Shield size={32} className="text-blue-400 mx-auto mb-3" />
                      <h3 className="text-white font-bold mb-1">Verify Identity</h3>
                      <p className="text-gray-400 text-xs mb-4">Gain trust and unlock more features by verifying your ID.</p>
                      <Button size="sm" fullWidth onClick={() => { setIsVerificationModalOpen(true); setVerificationStep('upload'); }}>Start Verification</Button>
                   </div>
                )}
              </div>

              {/* Right Column: Contact Info (Protected) */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-white font-bold">Contact Information</h3>
                     <Button variant="ghost" size="sm" className="text-robo-500" onClick={() => setIsEditContactOpen(true)}>Edit</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                       <span className="text-gray-500 text-sm">Email Address</span>
                       <span className="text-white font-medium col-span-2">{profileUser.email}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                       <span className="text-gray-500 text-sm">Phone Number</span>
                       <span className="text-white font-medium col-span-2">{profileUser.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Tool Ownership History</h3>
                  <p className="text-gray-400 text-sm mb-4">Tools currently owned and listed by {profileUser.name}.</p>
                  {/* Reuse ToolCard logic or simpler list here */}
                  <div className="space-y-3">
                     <div className="flex gap-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden">
                          <img src="https://picsum.photos/id/1/200/200" alt="Drill" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">DeWalt 20V Max Cordless Drill</p>
                          <p className="text-gray-500 text-xs">Listed on Aug 20, 2023</p>
                        </div>
                     </div>
                     <div className="flex gap-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden">
                          <img src="https://picsum.photos/id/3/200/200" alt="Sander" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Heavy Duty Palm Sander</p>
                          <p className="text-gray-500 text-xs">Listed on Sep 05, 2023</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS & PRIVACY TAB */}
          {activeTab === 'settings' && (
             <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                   <div className="p-6 border-b border-gray-800">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Lock size={20} className="text-robo-500" /> Privacy Controls
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Manage who can see your profile and contact you.</p>
                   </div>
                   <div className="divide-y divide-gray-800">
                      <div className="p-6 flex items-center justify-between">
                         <div>
                            <p className="text-white font-medium">Public Profile</p>
                            <p className="text-gray-500 text-xs mt-1">Allow others to find your profile in search.</p>
                         </div>
                         <button 
                           onClick={() => togglePrivacy('publicProfile')}
                           className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${profileUser.privacy.publicProfile ? 'bg-robo-500' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${profileUser.privacy.publicProfile ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                      </div>

                      <div className="p-6 flex items-center justify-between">
                         <div>
                            <p className="text-white font-medium">Exact Location Sharing</p>
                            <p className="text-gray-500 text-xs mt-1">Show your precise map location on tool listings (vs. approximate).</p>
                         </div>
                         <button 
                           onClick={() => togglePrivacy('showExactLocation')}
                           className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${profileUser.privacy.showExactLocation ? 'bg-robo-500' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${profileUser.privacy.showExactLocation ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                      </div>

                      <div className="p-6 flex items-center justify-between">
                         <div>
                            <p className="text-white font-medium">Allow Direct Messages</p>
                            <p className="text-gray-500 text-xs mt-1">Let other users message you before booking.</p>
                         </div>
                         <button 
                           onClick={() => togglePrivacy('allowMessages')}
                           className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${profileUser.privacy.allowMessages ? 'bg-robo-500' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${profileUser.privacy.allowMessages ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                   <div className="p-6 border-b border-gray-800">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Ban size={20} className="text-red-500" /> Blocked Users
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Manage accounts you have blocked.</p>
                   </div>
                   <div className="divide-y divide-gray-800">
                      {blockedUsers.length > 0 ? (
                        blockedUsers.map(bUser => (
                           <div key={bUser.id} className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                                    {bUser.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white">{bUser.name}</p>
                                    <p className="text-xs text-gray-500">Blocked on {bUser.date}</p>
                                 </div>
                              </div>
                              <button 
                                onClick={() => handleUnblock(bUser.id)}
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 border border-gray-700 px-2 py-1 rounded"
                              >
                                <Unlock size={12} /> Unblock
                              </button>
                           </div>
                        ))
                      ) : (
                         <div className="p-8 text-center text-gray-500 text-sm">
                            You haven't blocked anyone yet.
                         </div>
                      )}
                   </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                   <div className="p-6 border-b border-gray-800">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Shield size={20} className="text-green-500" /> Security
                      </h3>
                   </div>
                   <div className="p-6 flex items-center justify-between">
                      <div>
                         <p className="text-white font-medium">Two-Factor Authentication (2FA)</p>
                         <p className="text-gray-500 text-xs mt-1">Secure your account with a code sent to your phone.</p>
                      </div>
                      <button 
                        onClick={() => togglePrivacy('twoFactorEnabled')}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${profileUser.privacy.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${profileUser.privacy.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
             <div className="max-w-4xl mx-auto">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                   <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                      <h3 className="text-white font-bold text-lg">Activity Log</h3>
                      <Button variant="ghost" size="sm" onClick={handleExportCSV} className="gap-2">
                        <Download size={16} /> Export CSV
                      </Button>
                   </div>
                   <div className="divide-y divide-gray-800">
                      {activityLog.map((log) => (
                         <div key={log.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                            <div className="flex justify-between items-start">
                               <div className="flex gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                     log.type === 'payment' ? 'bg-green-500/10 text-green-500' :
                                     log.type === 'security' ? 'bg-red-500/10 text-red-500' :
                                     log.type === 'review' ? 'bg-yellow-500/10 text-yellow-500' :
                                     'bg-robo-500/10 text-robo-500'
                                  }`}>
                                     {log.type === 'payment' && <span className="font-bold">$</span>}
                                     {log.type === 'security' && <Lock size={18} />}
                                     {log.type === 'review' && <span className="font-bold">★</span>}
                                     {(log.type === 'rental' || log.type === 'listing') && <History size={18} />}
                                  </div>
                                  <div>
                                     <h4 className="text-white font-medium">{log.title}</h4>
                                     <p className="text-gray-400 text-sm mt-1">{log.description}</p>
                                     <span className="text-gray-600 text-xs mt-2 block">
                                       {new Date(log.timestamp).toLocaleString()}
                                     </span>
                                  </div>
                               </div>
                               {log.amount && (
                                  <span className="font-mono font-bold text-green-500">
                                    +${log.amount.toFixed(2)}
                                  </span>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

        </div>
      </div>
      
      {/* Edit Contact Modal */}
      {isEditContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditContactOpen(false)}></div>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
               <h3 className="font-bold text-white">Edit Contact Information</h3>
               <button onClick={() => setIsEditContactOpen(false)} className="text-gray-400 hover:text-white">
                 <X size={20} />
               </button>
             </div>
             
             <form onSubmit={handleSaveContactInfo} className="p-6 space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                   <input 
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                   <input 
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                   <input 
                      type="text"
                      required
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500"
                   />
                </div>
                
                <div className="pt-2 flex gap-3">
                   <Button type="button" variant="secondary" fullWidth onClick={() => setIsEditContactOpen(false)}>Cancel</Button>
                   <Button type="submit" fullWidth>Save Changes</Button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsVerificationModalOpen(false)}></div>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
               <h3 className="font-bold text-white flex items-center gap-2"><Shield size={18} className="text-blue-500"/> Identity Verification</h3>
               <button onClick={() => setIsVerificationModalOpen(false)} className="text-gray-400 hover:text-white">
                 <X size={20} />
               </button>
             </div>
             
             <div className="p-6">
               {verificationStep === 'upload' && (
                 <div className="space-y-6">
                   <p className="text-gray-300 text-sm text-center">Please upload a government-issued ID to verify your account.</p>
                   <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-800/30 hover:border-robo-500 transition-colors cursor-pointer">
                      <CreditCard size={48} className="text-gray-600 mb-2" />
                      <p className="text-sm font-bold text-white">Upload Front of ID</p>
                      <p className="text-xs text-gray-500">JPG, PNG or PDF</p>
                   </div>
                   <Button fullWidth onClick={handleVerificationSubmit}>Submit for Review</Button>
                 </div>
               )}

               {verificationStep === 'processing' && (
                 <div className="py-10 text-center">
                    <div className="w-16 h-16 border-4 border-robo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h4 className="text-white font-bold mb-1">Verifying...</h4>
                    <p className="text-gray-400 text-sm">Please wait while we process your documents.</p>
                 </div>
               )}

               {verificationStep === 'success' && (
                 <div className="py-10 text-center">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                       <CheckCircle size={32} />
                    </div>
                    <h4 className="text-white font-bold mb-1">Verification Complete!</h4>
                    <p className="text-gray-400 text-sm mb-6">Your identity has been successfully verified.</p>
                    <Button fullWidth onClick={() => setIsVerificationModalOpen(false)}>Close</Button>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

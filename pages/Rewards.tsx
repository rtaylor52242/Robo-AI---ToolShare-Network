
import React from 'react';
import { Gift, Award, Share2, Copy, Trophy, Check, Zap } from 'lucide-react';
import { MOCK_USER, MOCK_LOYALTY_TIERS } from '../constants';
import Button from '../components/Button';

const Rewards: React.FC = () => {
  const currentPoints = MOCK_USER.loyaltyPoints;
  const currentTier = MOCK_LOYALTY_TIERS.find(t => t.name === MOCK_USER.tier) || MOCK_LOYALTY_TIERS[0];
  const nextTier = MOCK_LOYALTY_TIERS[MOCK_LOYALTY_TIERS.indexOf(currentTier) + 1];
  
  const pointsToNext = nextTier ? nextTier.minPoints - currentPoints : 0;
  const progress = nextTier ? (currentPoints / nextTier.minPoints) * 100 : 100;

  const handleInvite = () => {
    const subject = encodeURIComponent("Join me on ToolShare - The Peer-to-Peer Tool Rental Network");
    const body = encodeURIComponent(`Hey! 

I've been using ToolShare to rent tools for my DIY projects and earn money from my own gear. It's awesome!

Sign up using my referral code below and we both get $10 in rental credits.

Referral Code: ${MOCK_USER.referralCode}

Check it out here: https://toolshare-demo.app

Cheers!`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MOCK_USER.referralCode);
    alert("Referral code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
             <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-4 shadow-lg shadow-orange-500/20">
                <Trophy size={32} />
             </div>
             <h1 className="text-4xl font-display font-bold text-white mb-2">Rewards & Growth</h1>
             <p className="text-gray-400">Earn points, climb tiers, and unlock exclusive benefits.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Loyalty Card */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-robo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Current Tier</p>
                         <h2 className={`text-3xl font-display font-bold ${currentTier.color} flex items-center gap-2`}>
                            {currentTier.name} Member
                         </h2>
                      </div>
                      <div className="text-right">
                         <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Available Points</p>
                         <p className="text-3xl font-mono font-bold text-white">{currentPoints.toLocaleString()}</p>
                      </div>
                   </div>

                   {/* Progress Bar */}
                   <div className="mb-2">
                      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-gradient-to-r from-robo-500 to-purple-600 transition-all duration-1000" 
                           style={{ width: `${progress}%` }}
                         ></div>
                      </div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500 mb-8">
                      <span>0 pts</span>
                      {nextTier ? (
                         <span className="text-white">{pointsToNext} pts to {nextTier.name}</span>
                      ) : (
                         <span className="text-purple-400 font-bold">Max Tier Reached!</span>
                      )}
                      <span>{nextTier ? nextTier.minPoints : '∞'} pts</span>
                   </div>

                   <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Award size={18} className="text-robo-500" /> Your Benefits
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentTier.benefits.map((benefit, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <Check size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{benefit}</span>
                         </div>
                      ))}
                      {nextTier && (
                         <div className="flex items-center gap-3 p-3 border border-dashed border-gray-700 rounded-lg opacity-60">
                            <Zap size={16} className="text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-500">Next: {nextTier.benefits[0]}</span>
                         </div>
                      )}
                   </div>
                </div>

                {/* Redeem Section */}
                <div>
                   <h3 className="text-xl font-bold text-white mb-6">Redeem Points</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                         { cost: 500, title: '$5 Rental Credit', icon: Gift },
                         { cost: 1000, title: '$15 Rental Credit', icon: Gift },
                         { cost: 2000, title: 'Free Week Rental', icon: Zap },
                      ].map((reward, i) => (
                         <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-robo-500 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-robo-500 group-hover:text-white transition-colors text-gray-400">
                               <reward.icon size={24} />
                            </div>
                            <h4 className="font-bold text-white mb-1">{reward.title}</h4>
                            <p className="text-robo-500 text-sm font-bold mb-4">{reward.cost} pts</p>
                            <Button size="sm" variant="secondary" fullWidth disabled={currentPoints < reward.cost}>
                               {currentPoints >= reward.cost ? 'Redeem' : 'Not enough pts'}
                            </Button>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Referral Sidebar */}
             <div className="space-y-6">
                <div className="bg-gradient-to-b from-robo-900 to-gray-900 border border-robo-500/30 rounded-2xl p-6">
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Share2 size={20} /> Refer a Friend
                   </h3>
                   <p className="text-gray-400 text-sm mb-6">
                      Give $10, Get $10. Earn credit for every friend who completes their first rental.
                   </p>
                   
                   <div className="bg-gray-950 rounded-lg p-3 border border-gray-700 flex justify-between items-center mb-4">
                      <code className="text-robo-500 font-bold font-mono text-lg">{MOCK_USER.referralCode}</code>
                      <button 
                        onClick={handleCopyCode} 
                        className="text-gray-400 hover:text-white p-2"
                        title="Copy Code"
                      >
                         <Copy size={16} />
                      </button>
                   </div>
                   
                   <Button fullWidth className="mb-4" onClick={handleInvite}>Invite Friends</Button>
                   <p className="text-xs text-center text-gray-500">Terms and conditions apply.</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                   <h3 className="text-white font-bold mb-4">Referral History</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 font-bold text-xs">J</div>
                            <div>
                               <p className="text-white font-medium">John Doe</p>
                               <p className="text-gray-500 text-xs">Completed first rental</p>
                            </div>
                         </div>
                         <span className="text-green-500 font-bold">+500 pts</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">M</div>
                            <div>
                               <p className="text-gray-400 font-medium">Mary Smith</p>
                               <p className="text-gray-500 text-xs">Signed up</p>
                            </div>
                         </div>
                         <span className="text-gray-500 text-xs">Pending</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Rewards;

import React, { useState } from 'react';
import { Package, DollarSign, Calendar, Clock, ArrowUpRight, ArrowDownLeft, Plus, Settings, Hammer, CheckCircle, AlertCircle, Wallet as WalletIcon, Lock, BarChart2, Gift, Star, ThumbsUp } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_WALLET } from '../constants';
import Button from '../components/Button';
import { Tool, Booking } from '../types';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RatingModal from '../components/RatingModal';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden group hover:border-robo-500/30 transition-all shadow-sm">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-900 ${colorClass}`}>
          <Icon size={20} />
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white font-display tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        {subtext}
      </p>
    </div>
  </div>
);

interface BookingCardProps {
  booking: Booking & { tool?: Tool };
  onRateTool?: () => void;
  onRateUser?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onRateTool, onRateUser }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors shadow-sm">
    <img src={booking.tool?.image} alt={booking.tool?.name} className="w-20 h-20 rounded-lg object-cover bg-gray-200 dark:bg-gray-900" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-900 dark:text-white">{booking.tool?.name}</h4>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
            booking.status === 'confirmed' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30' :
            booking.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30' :
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {booking.status}
          </span>
          {booking.paymentStatus === 'held_in_escrow' && (
             <span className="flex items-center gap-1 text-[10px] text-robo-500 dark:text-robo-400">
               <Lock size={10} /> Escrow
             </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {booking.startDate} — {booking.endDate}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-gray-900 dark:text-white font-medium text-sm">${booking.totalPrice} total</span>
        
        <div className="flex gap-2">
           {booking.status === 'confirmed' && (
             <button className="text-xs bg-robo-50 dark:bg-robo-500/10 text-robo-600 dark:text-robo-500 px-3 py-1.5 rounded-md hover:bg-robo-500 hover:text-white transition-colors">
               Return Tool
             </button>
           )}
           {booking.status === 'completed' && (
              <>
                 <button onClick={onRateTool} className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1.5 rounded-md hover:bg-yellow-500 hover:text-white transition-colors">
                    <Star size={12} /> Rate Tool
                 </button>
                 <button onClick={onRateUser} className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1.5 rounded-md hover:bg-blue-500 hover:text-white transition-colors">
                    <ThumbsUp size={12} /> Rate Lender
                 </button>
              </>
           )}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tools, user, rateTool, rateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'renting' | 'lending' | 'wallet'>('overview');
  
  // Rating Modal State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingType, setRatingType] = useState<'tool' | 'user' | null>(null);
  const [ratingTargetId, setRatingTargetId] = useState<string>('');
  const [ratingTargetName, setRatingTargetName] = useState<string>('');

  // Filter for tools owned by the current user
  const myTools = tools.filter(t => t.lenderName === user?.name || t.lenderName === 'Alex R.' || t.lenderName === 'You');
  
  const myRentals = MOCK_BOOKINGS.map(b => ({
    ...b,
    tool: tools.find(t => t.id === b.toolId)
  })).filter((b): b is Booking & { tool: Tool } => !!b.tool);

  const activeRentals = myRentals.filter(r => r.status === 'confirmed');
  const pastRentals = myRentals.filter(r => r.status === 'completed');
  const pendingRequests = myRentals.filter(r => r.status === 'pending');
  const wallet = MOCK_WALLET;

  const openRateModal = (type: 'tool' | 'user', id: string, name: string) => {
    setRatingType(type);
    setRatingTargetId(id);
    setRatingTargetName(name);
    setRatingModalOpen(true);
  };

  const handleRateSubmit = (rating: number, comment: string) => {
    if (ratingType === 'tool') {
      rateTool(ratingTargetId, rating, comment);
    } else {
      rateUser(ratingTargetId, rating, comment);
    }
    setRatingModalOpen(false);
    alert(`Thank you for rating ${ratingTargetName}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name.split(' ')[0] || 'Builder'}.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/analytics')}>
              <BarChart2 size={16} /> Analytics
            </Button>
            <Button size="sm" className="gap-2" onClick={() => navigate('/list-tool')}>
              <Plus size={16} /> List Item
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-robo-500 text-robo-600 dark:text-robo-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('renting')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'renting' ? 'border-robo-500 text-robo-600 dark:text-robo-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Renting ({activeRentals.length})
          </button>
          <button 
            onClick={() => setActiveTab('lending')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'lending' ? 'border-robo-500 text-robo-600 dark:text-robo-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Lending ({myTools.length})
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'wallet' ? 'border-robo-500 text-robo-600 dark:text-robo-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Wallet
          </button>
        </div>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Active Rentals" 
                value={activeRentals.length.toString()} 
                subtext="Tools currently in use" 
                icon={Hammer} 
                colorClass="text-robo-500" 
              />
              <StatCard 
                title="Pending Requests" 
                value={pendingRequests.length.toString()} 
                subtext="Awaiting approval" 
                icon={Clock} 
                colorClass="text-yellow-500" 
              />
              <StatCard 
                title="Total Earnings" 
                value={`$${wallet.availableBalance.toFixed(0)}`} 
                subtext="+12% this month" 
                icon={DollarSign} 
                colorClass="text-green-500" 
              />
              <div onClick={() => navigate('/rewards')} className="cursor-pointer">
                 <StatCard 
                   title="Loyalty Points" 
                   value={user?.loyaltyPoints.toString() || "0"} 
                   subtext={`${user?.tier} Tier`} 
                   icon={Gift} 
                   colorClass="text-purple-500" 
                 />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button onClick={() => navigate('/explore')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all text-left group shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-robo-500/10 flex items-center justify-center text-robo-500 mb-3 group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={20} />
                    </div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Rent a Tool</span>
                    <span className="text-xs text-gray-500">Browse local inventory</span>
                 </button>
                 <button onClick={() => navigate('/list-tool')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all text-left group shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform">
                      <Plus size={20} />
                    </div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">List Item</span>
                    <span className="text-xs text-gray-500">Earn money from gear</span>
                 </button>
                 <button className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all text-left group shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-3 group-hover:scale-110 transition-transform">
                      <ArrowDownLeft size={20} />
                    </div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Return Tool</span>
                    <span className="text-xs text-gray-500">View active rentals</span>
                 </button>
                 <button onClick={() => navigate('/profile')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all text-left group shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-3 group-hover:scale-110 transition-transform">
                      <Settings size={20} />
                    </div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Edit Profile</span>
                    <span className="text-xs text-gray-500">Update preferences</span>
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Rentals Column */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Rentals</h2>
                  <button onClick={() => setActiveTab('renting')} className="text-xs text-robo-600 dark:text-robo-500 hover:text-robo-700 dark:hover:text-white transition-colors">View All</button>
                </div>
                <div className="space-y-4">
                  {activeRentals.length > 0 ? (
                    activeRentals.map(booking => <BookingCard key={booking.id} booking={booking} />)
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active rentals.</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-robo-500" onClick={() => navigate('/explore')}>Start browsing</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity / Notifications */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="mt-1 w-8 h-8 rounded-full bg-green-500/10 flex flex-shrink-0 items-center justify-center border border-green-500/20">
                          <DollarSign size={14} className="text-green-500" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-bold text-gray-900 dark:text-white">You earned $45.00</span> from DeWalt Drill rental.</p>
                          <p className="text-xs text-gray-500 mt-1">Today, 2:30 PM</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex flex-shrink-0 items-center justify-center border border-blue-500/20">
                          <CheckCircle size={14} className="text-blue-500" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-bold text-gray-900 dark:text-white">Booking Confirmed</span> for Makita Circular Saw.</p>
                          <p className="text-xs text-gray-500 mt-1">Yesterday, 9:15 AM</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="mt-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/50 flex flex-shrink-0 items-center justify-center border border-gray-200 dark:border-gray-600">
                          <Clock size={14} className="text-gray-500 dark:text-gray-400" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Rental period ended for <span className="text-gray-900 dark:text-white">Heavy Duty Palm Sander</span>.</p>
                          <p className="text-xs text-gray-500 mt-1">May 16, 2024</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* RENTING TAB */}
        {activeTab === 'renting' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Active & Upcoming</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {activeRentals.concat(pendingRequests).map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                   ))}
                   {activeRentals.length === 0 && pendingRequests.length === 0 && (
                      <div className="col-span-full text-center py-10 text-gray-500">No active rentals</div>
                   )}
                </div>
             </div>
             
             <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 opacity-80 dark:opacity-60 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Past Rentals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {pastRentals.map(booking => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        onRateTool={() => openRateModal('tool', booking.toolId, booking.tool?.name || 'Tool')}
                        onRateUser={() => openRateModal('user', 'u_lender', booking.tool?.lenderName || 'Lender')}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* LENDING TAB */}
        {activeTab === 'lending' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-end">
              <Button onClick={() => navigate('/list-tool')}>+ List New Tool</Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">Tool</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Price/Day</th>
                      <th className="px-6 py-4">Earnings</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {myTools.map(tool => (
                      <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={tool.image} className="w-10 h-10 rounded object-cover bg-gray-200 dark:bg-gray-900" alt="" />
                          <span className="font-medium text-gray-900 dark:text-white">{tool.name}</span>
                        </td>
                        <td className="px-6 py-4">{tool.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${tool.available ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'}`}>
                            {tool.available ? 'Available' : 'Rented'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white">${tool.pricePerDay}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white">$120.00</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-3">Pause</button>
                          <button className="text-robo-600 dark:text-robo-500 hover:text-robo-700 dark:hover:text-robo-400 font-medium">Edit</button>
                        </td>
                      </tr>
                    ))}
                    {myTools.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          You haven't listed any tools yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500/10 to-gray-50 dark:to-gray-900 border border-green-500/30 rounded-2xl p-6 shadow-sm">
                   <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400">
                      <WalletIcon size={20} />
                      <span className="font-bold text-sm uppercase">Available Balance</span>
                   </div>
                   <p className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">${wallet.availableBalance.toFixed(2)}</p>
                   <div className="flex gap-2">
                     <Button size="sm" variant="primary">Withdraw</Button>
                     <Button size="sm" variant="secondary">Add Funds</Button>
                   </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Lock size={100} />
                   </div>
                   <div className="flex items-center gap-2 mb-2 text-robo-600 dark:text-robo-500">
                      <Lock size={20} />
                      <span className="font-bold text-sm uppercase">Funds in Escrow</span>
                   </div>
                   <p className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">${wallet.escrowBalance.toFixed(2)}</p>
                   <p className="text-xs text-gray-500">Held safely until rental completion.</p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <AlertCircle size={100} />
                   </div>
                   <div className="flex items-center gap-2 mb-2 text-yellow-600 dark:text-yellow-500">
                      <AlertCircle size={20} />
                      <span className="font-bold text-sm uppercase">Pending Deposits</span>
                   </div>
                   <p className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">${wallet.pendingDeposits.toFixed(2)}</p>
                   <p className="text-xs text-gray-500">Refundable security deposits.</p>
                </div>
             </div>

             <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                   <h3 className="font-bold text-gray-900 dark:text-white">Transaction History</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                   {wallet.transactions.map((t) => (
                      <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                               <DollarSign size={18} />
                            </div>
                            <div>
                               <p className="text-gray-900 dark:text-white font-medium">{t.title}</p>
                               <p className="text-xs text-gray-500">{new Date(t.timestamp).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <span className="text-green-600 dark:text-green-500 font-bold font-mono">+${t.amount?.toFixed(2)}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

      </div>
      
      {/* Rating Modal */}
      <RatingModal 
         isOpen={ratingModalOpen}
         onClose={() => setRatingModalOpen(false)}
         onSubmit={handleRateSubmit}
         title={ratingType === 'tool' ? `Rate ${ratingTargetName}` : `Rate ${ratingTargetName}`}
         subtitle={ratingType === 'tool' ? 'How was the condition and performance of the tool?' : 'How was your interaction with this lender?'}
      />
    </div>
  );
};

export default Dashboard;
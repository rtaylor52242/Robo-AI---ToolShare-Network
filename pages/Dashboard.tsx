import React, { useState } from 'react';
import { Package, DollarSign, Calendar, Clock, ArrowUpRight, ArrowDownLeft, Plus, Settings, Hammer, CheckCircle, AlertCircle } from 'lucide-react';
import { MOCK_TOOLS, MOCK_BOOKINGS } from '../constants';
import Button from '../components/Button';
import { Tool, Booking } from '../types';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 relative overflow-hidden group hover:border-robo-500/30 transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-gray-900 ${colorClass}`}>
          <Icon size={20} />
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white font-display tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        {subtext}
      </p>
    </div>
  </div>
);

interface BookingCardProps {
  booking: Booking & { tool?: Tool };
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => (
  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex gap-4 items-center hover:bg-gray-800/80 transition-colors">
    <img src={booking.tool?.image} alt={booking.tool?.name} className="w-20 h-20 rounded-lg object-cover bg-gray-900" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white">{booking.tool?.name}</h4>
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
          'bg-gray-700 text-gray-400'
        }`}>
          {booking.status}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {booking.startDate} — {booking.endDate}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-white font-medium text-sm">${booking.totalPrice} total</span>
        {booking.status === 'confirmed' && (
          <button className="text-xs bg-robo-500/10 text-robo-500 px-3 py-1.5 rounded-md hover:bg-robo-500 hover:text-white transition-colors">
            Return Tool
          </button>
        )}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'renting' | 'lending'>('overview');
  
  // Derived data
  const myTools = MOCK_TOOLS.slice(0, 3);
  const myRentals = MOCK_BOOKINGS.map(b => ({
    ...b,
    tool: MOCK_TOOLS.find(t => t.id === b.toolId)
  })).filter((b): b is Booking & { tool: Tool } => !!b.tool); // Filter out any bookings with missing tools

  const activeRentals = myRentals.filter(r => r.status === 'confirmed');
  const pastRentals = myRentals.filter(r => r.status === 'completed');
  const pendingRequests = myRentals.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-950 py-8 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, Builder.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings size={16} /> Settings
            </Button>
            <Button size="sm" className="gap-2">
              <Plus size={16} /> List Item
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('renting')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'renting' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Renting ({activeRentals.length})
          </button>
          <button 
            onClick={() => setActiveTab('lending')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'lending' ? 'border-robo-500 text-robo-500' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            Lending ({myTools.length})
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
                value="$1,240" 
                subtext="+12% this month" 
                icon={DollarSign} 
                colorClass="text-green-500" 
              />
              <StatCard 
                title="Tools Listed" 
                value={myTools.length.toString()} 
                subtext="2 currently available" 
                icon={Package} 
                colorClass="text-purple-500" 
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-800/80 transition-all text-left group">
                    <div className="w-10 h-10 rounded-full bg-robo-500/10 flex items-center justify-center text-robo-500 mb-3 group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={20} />
                    </div>
                    <span className="block font-bold text-white text-sm">Rent a Tool</span>
                    <span className="text-xs text-gray-500">Browse local inventory</span>
                 </button>
                 <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-800/80 transition-all text-left group">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform">
                      <Plus size={20} />
                    </div>
                    <span className="block font-bold text-white text-sm">List Item</span>
                    <span className="text-xs text-gray-500">Earn money from gear</span>
                 </button>
                 <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-800/80 transition-all text-left group">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-3 group-hover:scale-110 transition-transform">
                      <ArrowDownLeft size={20} />
                    </div>
                    <span className="block font-bold text-white text-sm">Return Tool</span>
                    <span className="text-xs text-gray-500">View active rentals</span>
                 </button>
                 <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-robo-500 hover:bg-gray-800/80 transition-all text-left group">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-3 group-hover:scale-110 transition-transform">
                      <Settings size={20} />
                    </div>
                    <span className="block font-bold text-white text-sm">Edit Profile</span>
                    <span className="text-xs text-gray-500">Update preferences</span>
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Rentals Column */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white">Current Rentals</h2>
                  <button onClick={() => setActiveTab('renting')} className="text-xs text-robo-500 hover:text-white transition-colors">View All</button>
                </div>
                <div className="space-y-4">
                  {activeRentals.length > 0 ? (
                    activeRentals.map(booking => <BookingCard key={booking.id} booking={booking} />)
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active rentals.</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-robo-500">Start browsing</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity / Notifications */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                 <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="mt-1 w-8 h-8 rounded-full bg-green-500/10 flex flex-shrink-0 items-center justify-center border border-green-500/20">
                          <DollarSign size={14} className="text-green-500" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-300"><span className="font-bold text-white">You earned $45.00</span> from DeWalt Drill rental.</p>
                          <p className="text-xs text-gray-500 mt-1">Today, 2:30 PM</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex flex-shrink-0 items-center justify-center border border-blue-500/20">
                          <CheckCircle size={14} className="text-blue-500" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-300"><span className="font-bold text-white">Booking Confirmed</span> for Makita Circular Saw.</p>
                          <p className="text-xs text-gray-500 mt-1">Yesterday, 9:15 AM</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="mt-1 w-8 h-8 rounded-full bg-gray-700/50 flex flex-shrink-0 items-center justify-center border border-gray-600">
                          <Clock size={14} className="text-gray-400" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-300">Rental period ended for <span className="text-white">Heavy Duty Palm Sander</span>.</p>
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
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Active & Upcoming</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {activeRentals.concat(pendingRequests).map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                   ))}
                   {activeRentals.length === 0 && pendingRequests.length === 0 && (
                      <div className="col-span-full text-center py-10 text-gray-500">No active rentals</div>
                   )}
                </div>
             </div>
             
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 opacity-60">
                <h3 className="text-lg font-bold text-white mb-6">Past Rentals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {pastRentals.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* LENDING TAB */}
        {activeTab === 'lending' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-end">
              <Button>+ List New Tool</Button>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-gray-900/50 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">Tool</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Price/Day</th>
                      <th className="px-6 py-4">Earnings</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {myTools.map(tool => (
                      <tr key={tool.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={tool.image} className="w-10 h-10 rounded object-cover bg-gray-900" alt="" />
                          <span className="font-medium text-white">{tool.name}</span>
                        </td>
                        <td className="px-6 py-4">{tool.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${tool.available ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'}`}>
                            {tool.available ? 'Available' : 'Rented'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">${tool.pricePerDay}</td>
                        <td className="px-6 py-4 text-white">$120.00</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-white transition-colors mr-3">Pause</button>
                          <button className="text-robo-500 hover:text-robo-400 font-medium">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
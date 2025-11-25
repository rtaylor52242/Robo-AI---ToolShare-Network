
import React, { useState } from 'react';
import { BarChart, TrendingUp, Users, Eye, DollarSign, Download, Calendar } from 'lucide-react';
import { MOCK_ANALYTICS } from '../constants';
import AnalyticsChart from '../components/AnalyticsCharts';
import Button from '../components/Button';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Track your performance and platform growth.</p>
          </div>
          <div className="flex gap-2">
             <div className="bg-gray-900 p-1 rounded-lg border border-gray-700 flex">
                {['7d', '30d', '90d'].map((range) => (
                   <button
                     key={range}
                     onClick={() => setTimeRange(range as any)}
                     className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === range ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                   >
                     {range.toUpperCase()}
                   </button>
                ))}
             </div>
             <Button variant="secondary" size="sm" className="gap-2">
                <Download size={14} /> Export
             </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <DollarSign size={20} />
                 </div>
                 <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp size={12} /> +12.5%
                 </span>
              </div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">$1,245.00</h3>
           </div>
           
           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <BarChart size={20} />
                 </div>
                 <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                    <TrendingUp size={12} /> +5.2%
                 </span>
              </div>
              <p className="text-gray-400 text-sm">Total Rentals</p>
              <h3 className="text-2xl font-bold text-white">32</h3>
           </div>

           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Eye size={20} />
                 </div>
                 <span className="text-xs font-bold text-purple-500 flex items-center gap-1">
                    <TrendingUp size={12} /> +18.2%
                 </span>
              </div>
              <p className="text-gray-400 text-sm">Listing Views</p>
              <h3 className="text-2xl font-bold text-white">1,540</h3>
           </div>

           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                    <Users size={20} />
                 </div>
                 <span className="text-xs font-bold text-gray-500">
                    -
                 </span>
              </div>
              <p className="text-gray-400 text-sm">Repeat Customers</p>
              <h3 className="text-2xl font-bold text-white">45%</h3>
           </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white">Revenue Trend</h3>
                 <Calendar size={16} className="text-gray-500" />
              </div>
              <AnalyticsChart data={MOCK_ANALYTICS.revenue} type="line" color="#22c55e" height={250} />
           </div>
           
           <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white">Daily Rentals</h3>
                 <Calendar size={16} className="text-gray-500" />
              </div>
              <AnalyticsChart data={MOCK_ANALYTICS.rentals} type="bar" color="#0ea5e9" height={250} />
           </div>
        </div>

        {/* Top Performing Tools */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
           <div className="p-6 border-b border-gray-800">
              <h3 className="font-bold text-white">Top Performing Tools</h3>
           </div>
           <div className="p-6">
              <div className="space-y-4">
                 {MOCK_ANALYTICS.topTools.map((tool, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <span className="w-6 text-sm font-bold text-gray-500">#{idx + 1}</span>
                          <span className="text-white font-medium">{tool.name}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                             <div className="h-full bg-robo-500" style={{ width: `${(tool.rentals / 15) * 100}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-400 w-16 text-right">{tool.rentals} rentals</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;

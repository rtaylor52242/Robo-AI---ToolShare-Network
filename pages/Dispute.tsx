
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Upload, CheckCircle, ChevronRight, FileText, Gavel } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_TOOLS } from '../constants';
import Button from '../components/Button';

const Dispute: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // Filter for completed/confirmed bookings for the demo
  const eligibleBookings = MOCK_BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'completed').map(b => ({
    ...b,
    tool: MOCK_TOOLS.find(t => t.id === b.toolId)
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success state
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <Gavel size={24} />
            <span className="font-bold uppercase tracking-wider text-sm">Resolution Center</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Open a Dispute</h1>
          <p className="text-gray-400 mt-2">
            We encourage users to resolve issues directly first. If you cannot reach an agreement, our support team will step in to mediate.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center mb-10 text-sm">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-robo-500 border-robo-500 text-white' : 'border-gray-600'}`}>1</span>
            Select Booking
          </div>
          <div className="w-10 h-px bg-gray-700 mx-4"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-robo-500 border-robo-500 text-white' : 'border-gray-600'}`}>2</span>
            Details & Evidence
          </div>
          <div className="w-10 h-px bg-gray-700 mx-4"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-robo-500 border-robo-500 text-white' : 'border-gray-600'}`}>3</span>
            Review
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-white mb-4">Which booking is this regarding?</h2>
              
              <div className="space-y-3">
                {eligibleBookings.length > 0 ? (
                  eligibleBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      onClick={() => setSelectedBookingId(booking.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center group ${
                        selectedBookingId === booking.id 
                          ? 'border-robo-500 bg-robo-500/10 ring-1 ring-robo-500' 
                          : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={booking.tool?.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-700" />
                        <div>
                          <h3 className="font-bold text-white">{booking.tool?.name}</h3>
                          <p className="text-sm text-gray-400">{booking.startDate} - {booking.endDate}</p>
                          <p className="text-xs text-gray-500 mt-1">Order #{booking.id.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBookingId === booking.id ? 'border-robo-500' : 'border-gray-600'}`}>
                         {selectedBookingId === booking.id && <div className="w-2.5 h-2.5 bg-robo-500 rounded-full"></div>}
                      </div>
                    </div>
                  ))
                ) : (
                   <p className="text-gray-500">No eligible bookings found.</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                 <Button 
                   onClick={() => setStep(2)} 
                   disabled={!selectedBookingId} 
                   className="gap-2"
                 >
                   Next Step <ChevronRight size={16} />
                 </Button>
              </div>
            </div>
          )}

          {step === 2 && (
             <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-bold text-white mb-4">Describe the issue</h2>
                
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Reason for Dispute</label>
                   <select 
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                     className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500"
                     required
                   >
                     <option value="">Select a reason...</option>
                     <option value="item_damaged">Item Damaged</option>
                     <option value="item_not_as_described">Item Not As Described</option>
                     <option value="late_return">Late Return</option>
                     <option value="missing_parts">Missing Parts/Accessories</option>
                     <option value="unauthorized_charge">Unauthorized Charge</option>
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                   <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-robo-500 resize-none"
                     placeholder="Provide detailed information about what happened..."
                     required
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Evidence (Photos/Documents)</label>
                   <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-robo-500 hover:bg-gray-800/50 transition-colors cursor-pointer group">
                      <Upload className="mx-auto text-gray-500 group-hover:text-robo-500 mb-2" size={32} />
                      <p className="text-sm text-gray-400 font-medium">Click to upload files</p>
                      <p className="text-xs text-gray-600 mt-1">JPG, PNG, PDF up to 10MB</p>
                   </div>
                </div>

                <div className="pt-4 flex justify-between">
                   <Button variant="secondary" onClick={() => setStep(1)} type="button">Back</Button>
                   <Button type="submit" disabled={!reason || !description}>Submit Dispute</Button>
                </div>
             </form>
          )}

          {step === 3 && (
             <div className="text-center py-8 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                   <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Dispute Submitted</h2>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                   Case #88291 has been opened. Our mediation team will review your evidence and contact both parties within 24 hours.
                </p>
                <div className="bg-gray-800/50 rounded-xl p-4 max-w-md mx-auto mb-8 text-left border border-gray-700">
                   <div className="flex items-start gap-3">
                      <FileText size={20} className="text-robo-500 mt-0.5" />
                      <div>
                         <p className="text-white font-bold text-sm">What happens next?</p>
                         <ul className="text-xs text-gray-400 list-disc ml-4 mt-2 space-y-1">
                            <li>The other party will be notified and asked to respond.</li>
                            <li>Funds in escrow will remain frozen until resolution.</li>
                            <li>You can track the status in your Dashboard.</li>
                         </ul>
                      </div>
                   </div>
                </div>
                <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dispute;

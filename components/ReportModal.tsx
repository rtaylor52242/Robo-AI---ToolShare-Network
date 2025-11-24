import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import Button from './Button';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetType: 'user' | 'tool';
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetName, targetType }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons = targetType === 'user' 
    ? ['Inappropriate Behavior', 'Harassment', 'Spam/Scam', 'Fake Profile', 'Other']
    : ['Misleading Description', 'Counterfeit Item', 'Prohibited Item', 'Wrong Category', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send data to API
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setReason('');
      setDetails('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
          <div className="flex items-center gap-2 text-red-500 font-bold">
            <ShieldAlert size={20} />
            <h3>Report {targetType === 'user' ? 'User' : 'Listing'}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <AlertTriangle className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Report Received</h3>
              <p className="text-gray-400 text-sm">Thank you for helping keep our community safe. We will review this shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-300">
                You are reporting <span className="font-bold text-white">{targetName}</span>. 
                This report is anonymous.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason</label>
                <div className="space-y-2">
                  {reasons.map((r) => (
                    <label key={r} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-600">
                      <input 
                        type="radio" 
                        name="reason" 
                        value={r}
                        checked={reason === r}
                        onChange={(e) => setReason(e.target.value)}
                        className="text-robo-500 focus:ring-robo-500 bg-gray-900 border-gray-600"
                      />
                      <span className="text-sm text-gray-200">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Additional Details</label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide specific details..."
                  className="w-full h-24 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-robo-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={!reason}
                  className={!reason ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Submit Report
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
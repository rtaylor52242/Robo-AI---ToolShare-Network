
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Calendar, Clock, Lock, FileText, AlertCircle, CheckCircle, Tag } from 'lucide-react';
import { MOCK_TOOLS, MOCK_INSURANCE, MOCK_PROMOS } from '../constants';
import Button from '../components/Button';

const Checkout: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const tool = MOCK_TOOLS.find(t => t.id === toolId);

  // Form State
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('basic');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof MOCK_PROMOS[0] | null>(null);
  const [promoError, setPromoError] = useState('');

  // Derived State for Calculation
  const [rentalCost, setRentalCost] = useState(0);
  const [rentalDuration, setRentalDuration] = useState('');
  const [rateApplied, setRateApplied] = useState('');
  const [securityDeposit] = useState(tool?.securityDeposit || 0);
  const platformFeeRate = 0.10; // 10%

  useEffect(() => {
    if (startDate && endDate && tool && tool.pricing) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = Math.ceil(diffHours / 24);

      if (diffHours <= 0) {
        setRentalCost(0);
        return;
      }

      let cost = 0;
      let rateType = '';

      if (diffHours < 24) {
        // Hourly logic (capped at daily price)
        const hourlyCost = diffHours * (tool.pricing.hourly || 0);
        const dailyCap = tool.pricing.daily || 0;
        if (hourlyCost < dailyCap) {
          cost = hourlyCost;
          rateType = `Hourly ($${tool.pricing.hourly}/hr)`;
          setRentalDuration(`${diffHours.toFixed(1)} hours`);
        } else {
          cost = dailyCap;
          rateType = `Daily Cap ($${tool.pricing.daily}/day)`;
          setRentalDuration('1 Day');
        }
      } else if (diffDays < 7) {
        // Daily logic
        cost = diffDays * (tool.pricing.daily || 0);
        rateType = `Daily ($${tool.pricing.daily}/day)`;
        setRentalDuration(`${diffDays} Days`);
      } else if (diffDays < 30) {
        // Weekly logic
        const weeks = Math.floor(diffDays / 7);
        const remainderDays = diffDays % 7;
        cost = (weeks * (tool.pricing.weekly || 0)) + (remainderDays * (tool.pricing.daily || 0));
        rateType = `Weekly ($${tool.pricing.weekly}/wk)`;
        setRentalDuration(`${weeks} Weeks, ${remainderDays} Days`);
      } else {
        // Monthly logic
        const months = Math.floor(diffDays / 30);
        cost = months * (tool.pricing.monthly || 0); // Simplified logic
        rateType = `Monthly ($${tool.pricing.monthly}/mo)`;
        setRentalDuration(`${months} Month(s)`);
      }

      setRentalCost(cost);
      setRateApplied(rateType);
    }
  }, [startDate, startTime, endDate, endTime, tool]);

  const handleApplyPromo = () => {
    const promo = MOCK_PROMOS.find(p => p.code === promoCodeInput.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      setPromoError('');
    } else {
      setPromoError('Invalid code');
      setAppliedPromo(null);
    }
  };

  if (!tool) return <div>Tool not found</div>;

  const selectedInsurance = MOCK_INSURANCE.find(i => i.id === selectedInsuranceId);
  const insuranceCost = selectedInsurance ? selectedInsurance.price : 0;
  
  let subtotal = rentalCost + insuranceCost;
  let discountAmount = 0;

  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = rentalCost * appliedPromo.value;
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const platformFee = (subtotal - discountAmount) * platformFeeRate;
  const grandTotal = subtotal - discountAmount + platformFee + securityDeposit;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Configuration & Payment */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Secure Checkout</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Lock size={14} className="text-green-500" /> 
              Your payment is held in escrow until rental completion.
            </p>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Calendar size={18} className="text-robo-500" /> Rental Period
             </h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start</label>
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-robo-500 outline-none mb-2"
                 />
                 <input 
                   type="time" 
                   value={startTime}
                   onChange={(e) => setStartTime(e.target.value)}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-robo-500 outline-none"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End</label>
                 <input 
                   type="date" 
                   value={endDate}
                   onChange={(e) => setEndDate(e.target.value)}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-robo-500 outline-none mb-2"
                 />
                 <input 
                   type="time" 
                   value={endTime}
                   onChange={(e) => setEndTime(e.target.value)}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-robo-500 outline-none"
                 />
               </div>
             </div>
          </div>

          {/* Insurance Options */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <ShieldCheck size={18} className="text-blue-500" /> Insurance Protection
             </h3>
             <div className="space-y-3">
                {MOCK_INSURANCE.map(plan => (
                   <div 
                      key={plan.id}
                      onClick={() => setSelectedInsuranceId(plan.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                         selectedInsuranceId === plan.id 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                   >
                      <div className="flex justify-between items-center mb-1">
                         <span className={`font-bold ${selectedInsuranceId === plan.id ? 'text-white' : 'text-gray-300'}`}>
                            {plan.name}
                         </span>
                         <span className="text-white font-bold">
                            {plan.price === 0 ? 'Free' : `+$${plan.price}`}
                         </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{plan.description}</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                         {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-1">
                               <CheckCircle size={10} className="text-blue-500" /> {feat}
                            </li>
                         ))}
                      </ul>
                   </div>
                ))}
             </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <CreditCard size={18} className="text-robo-500" /> Payment Method
             </h3>
             <div className="grid grid-cols-3 gap-3 mb-6">
               <button 
                 onClick={() => setPaymentMethod('card')}
                 className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-robo-500/10 border-robo-500 text-robo-500' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
               >
                 <CreditCard size={24} />
                 <span className="text-xs font-bold">Card</span>
               </button>
               <button 
                 onClick={() => setPaymentMethod('paypal')}
                 className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
               >
                 <span className="font-bold italic text-xl">P</span>
                 <span className="text-xs font-bold">PayPal</span>
               </button>
               <button 
                 onClick={() => setPaymentMethod('apple')}
                 className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'apple' ? 'bg-white/10 border-white text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
               >
                 <span className="font-bold text-xl"></span>
                 <span className="text-xs font-bold">Pay</span>
               </button>
             </div>

             {paymentMethod === 'card' && (
               <div className="space-y-4 animate-in fade-in">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                   <div className="relative">
                     <CreditCard className="absolute left-3 top-2.5 text-gray-500" size={16} />
                     <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:border-robo-500 outline-none" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                     <input type="text" placeholder="MM/YY" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-robo-500 outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                     <input type="text" placeholder="123" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-robo-500 outline-none" />
                   </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-gray-500">
                   <ShieldCheck size={12} className="text-green-500" /> 
                   <span>Encrypted & PCI Compliant</span>
                 </div>
               </div>
             )}
          </div>

          {/* Digital Agreement */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <FileText size={18} className="text-robo-500" /> Digital Rental Agreement
             </h3>
             <div className="h-32 bg-gray-800 rounded-lg p-3 overflow-y-auto text-xs text-gray-400 mb-4 border border-gray-700">
               <p className="mb-2"><strong>1. Rental Period:</strong> The equipment must be returned by the date and time specified above. Late returns will incur a penalty fee of 150% of the daily rate.</p>
               <p className="mb-2"><strong>2. Condition:</strong> The renter acknowledges receiving the tool in good working condition. Any damage beyond normal wear and tear will be deducted from the security deposit.</p>
               <p className="mb-2"><strong>3. Liability:</strong> The platform is not liable for injuries sustained while using the tool.</p>
               <p><strong>4. Security Deposit:</strong> A refundable deposit of ${securityDeposit} will be held and released within 48 hours of successful return.</p>
               <p><strong>5. Insurance:</strong> You have selected {selectedInsurance?.name}. Coverage details apply as stated.</p>
             </div>
             <label className="flex items-center gap-3 cursor-pointer group">
               <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={agreedToTerms}
                   onChange={(e) => setAgreedToTerms(e.target.checked)}
                   className="sr-only"
                 />
                 <div className={`w-5 h-5 border-2 rounded transition-colors ${agreedToTerms ? 'bg-robo-500 border-robo-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                   {agreedToTerms && <CheckCircle size={16} className="text-white -ml-[2px] -mt-[2px]" />}
                 </div>
               </div>
               <span className="text-sm text-gray-300">I agree to the Terms of Service and Rental Agreement.</span>
             </label>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
             <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
             
             <div className="flex gap-4 mb-6 pb-6 border-b border-gray-800">
               <img src={tool.image} alt={tool.name} className="w-20 h-20 rounded-lg object-cover bg-gray-800" />
               <div>
                 <h4 className="font-bold text-white text-sm">{tool.name}</h4>
                 <p className="text-xs text-gray-400 mt-1">{tool.location}</p>
                 <div className="flex items-center gap-1 text-xs text-robo-500 mt-2 font-medium">
                   <Clock size={12} /> {rentalDuration || '--'}
                 </div>
               </div>
             </div>

             <div className="space-y-3 text-sm">
               <div className="flex justify-between text-gray-300">
                 <span>Rate Applied ({rateApplied || '--'})</span>
                 <span>${rentalCost.toFixed(2)}</span>
               </div>
               
               {selectedInsurance && (
                 <div className="flex justify-between text-blue-400">
                    <span>{selectedInsurance.name}</span>
                    <span>{selectedInsurance.price === 0 ? 'Free' : `$${selectedInsurance.price.toFixed(2)}`}</span>
                 </div>
               )}

               {appliedPromo && (
                  <div className="flex justify-between text-green-500 font-medium">
                     <span>Promo ({appliedPromo.code})</span>
                     <span>-${discountAmount.toFixed(2)}</span>
                  </div>
               )}

               <div className="flex justify-between text-gray-300">
                 <span>Platform Fee (10%)</span>
                 <span>${platformFee.toFixed(2)}</span>
               </div>

               <div className="flex justify-between text-white font-medium pt-2">
                 <span className="flex items-center gap-1">
                   Security Deposit 
                   <span className="group relative">
                     <AlertCircle size={12} className="text-gray-500 cursor-help" />
                     <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black text-xs p-2 rounded hidden group-hover:block border border-gray-700">
                       Refundable upon safe return of the tool.
                     </span>
                   </span>
                 </span>
                 <span>${securityDeposit.toFixed(2)}</span>
               </div>
               
               <div className="border-t border-gray-800 pt-4 mt-4">
                 <div className="flex justify-between text-lg font-bold text-white">
                   <span>Total due today</span>
                   <span>${grandTotal.toFixed(2)}</span>
                 </div>
                 <p className="text-right text-xs text-gray-500 mt-1">Includes refundable deposit</p>
               </div>
             </div>

             {/* Promo Code Input */}
             <div className="mt-6 pt-6 border-t border-gray-800">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                   <Tag size={12} /> Promo Code
                </label>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Enter code"
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-robo-500 outline-none flex-1 uppercase"
                   />
                   <Button size="sm" variant="secondary" onClick={handleApplyPromo}>Apply</Button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                {appliedPromo && <p className="text-xs text-green-500 mt-1">Code applied: {appliedPromo.description}</p>}
             </div>

             <div className="mt-8">
               <Button 
                 fullWidth 
                 size="lg" 
                 onClick={handleCheckout}
                 disabled={!startDate || !endDate || !agreedToTerms || isProcessing}
                 className={!startDate || !endDate || !agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}
               >
                 {isProcessing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
               </Button>
               <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                 <Lock size={10} /> Secure SSL Payment
               </p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

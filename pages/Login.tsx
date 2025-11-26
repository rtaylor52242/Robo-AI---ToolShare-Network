
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Smartphone, ShieldCheck, ArrowRight, Github, Facebook, Chrome, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [show2FA, setShow2FA] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 2FA State and Refs
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input when 2FA is shown
  useEffect(() => {
    if (show2FA) {
      inputRefs.current[0]?.focus();
    }
  }, [show2FA]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin && !show2FA) {
      // Simulate 2FA Requirement
      setShow2FA(true);
    } else {
      // Complete Login/Register
      // Use entered email or default to verified demo user if empty
      login(email || 'alex.rivera@example.com');
      navigate('/');
    }
  };

  const handleTwoFactorChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Allow numbers only
    if (!/^\d*$/.test(value)) return;

    const newCode = [...twoFactorCode];
    // Take the last character if user somehow pastes or types multiple
    newCode[index] = value.substring(value.length - 1);
    setTwoFactorCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-robo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-robo-500/20 rounded-xl flex items-center justify-center border border-robo-500/30 mb-4">
             <ShieldCheck className="h-6 w-6 text-robo-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">
            {show2FA ? 'Two-Factor Auth' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {show2FA 
              ? 'Enter the code sent to your device' 
              : (isLogin ? 'Sign in to manage your tools' : 'Join the peer-to-peer revolution')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {!show2FA && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required={isLogin} // Only require if logging in or standardize
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-robo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Email address (e.g., admin1@toolshare.com)"
                />
              </div>

              {!isLogin && (
                 <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-robo-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="Phone number"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-robo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {show2FA && (
            <div className="space-y-4">
               <div className="flex gap-2 justify-center">
                  {twoFactorCode.map((digit, i) => (
                    <input 
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text" 
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleTwoFactorChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-10 h-12 text-center text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg focus:border-robo-500 focus:ring-1 focus:ring-robo-500 outline-none text-white transition-all"
                    />
                  ))}
               </div>
               <p className="text-center text-xs text-robo-500 cursor-pointer hover:underline">Resend Code</p>
            </div>
          )}

          <Button type="submit" fullWidth size="lg">
            {show2FA ? 'Verify & Login' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
          
          {show2FA && (
            <div className="text-center">
               <button 
                 type="button" 
                 onClick={() => {
                   setShow2FA(false);
                   setTwoFactorCode(['', '', '', '', '', '']); // Reset code when going back
                 }} 
                 className="text-sm text-gray-400 hover:text-white"
               >
                 Back to Login
               </button>
            </div>
          )}
        </form>

        {!show2FA && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/80 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <a href="https://google.com" title="https://google.com" className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                <Chrome size={20} className="text-white" />
              </a>
              <a href="https://facebook.com" title="https://facebook.com" className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                <Facebook size={20} className="text-blue-500" />
              </a>
               <a href="https://github.com" title="https://github.com" className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                <Github size={20} className="text-white" />
              </a>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="font-medium text-robo-500 hover:text-robo-400 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

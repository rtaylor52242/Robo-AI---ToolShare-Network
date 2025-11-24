import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Smartphone, ShieldCheck, ArrowRight, Github, Facebook, Chrome } from 'lucide-react';
import Button from '../components/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [show2FA, setShow2FA] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFacCode, setTwoFacCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin && !show2FA) {
      // Simulate 2FA Requirement
      setShow2FA(true);
    } else {
      // Complete Login/Register
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-robo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Email address"
                />
              </div>

              {!isLogin && (
                 <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    required={!isLogin}
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-robo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          )}

          {show2FA && (
            <div className="space-y-4">
               <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
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
                 onClick={() => setShow2FA(false)} 
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
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                <Chrome size={20} className="text-white" />
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                <Facebook size={20} className="text-blue-500" />
              </button>
               <button className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                <Github size={20} className="text-white" />
              </button>
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
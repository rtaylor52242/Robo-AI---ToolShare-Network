import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';
import OnboardingTour from './components/OnboardingTour';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ToolDetail from './pages/ToolDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ListTool from './pages/ListTool';
import Checkout from './pages/Checkout';
import Messages from './pages/Messages';
import Support from './pages/Support';
import Dispute from './pages/Dispute';
import Rewards from './pages/Rewards';
import Analytics from './pages/Analytics';
import Community from './pages/Community';

// Wrapper component to handle auth routing logic
const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-robo-500/30 selection:text-robo-100 transition-colors duration-300">
      {isAuthenticated && <Navbar />}
      <main>
        <Routes>
          {/* Force Login if not authenticated */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/checkout/:toolId" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/list-tool" element={<ListTool />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/support" element={<Support />} />
              <Route path="/dispute" element={<Dispute />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/community" element={<Community />} />
            </>
          ) : (
            // Redirect any other route to login if not authenticated
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </main>
      
      {isAuthenticated && (
        <>
          <AIChatbot />
          <OnboardingTour />
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-500 text-sm">© 2024 Robo AI - ToolShare Network. Built with React & Gemini.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
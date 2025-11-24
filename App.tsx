import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased selection:bg-robo-500/30 selection:text-robo-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/list-tool" element={<ListTool />} />
            <Route path="/community" element={<div className="p-20 text-center text-gray-500">Community features coming soon</div>} />
          </Routes>
        </main>
        <AIChatbot />
        <OnboardingTour />
        
        <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">© 2024 Robo AI - ToolShare Network. Built with React & Gemini.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
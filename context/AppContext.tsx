import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tool, ActivityLog } from '../types';
import { MOCK_USER, MOCK_TOOLS, MOCK_ACTIVITY_LOG } from '../constants';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  tools: Tool[];
  activityLog: ActivityLog[];
  theme: 'light' | 'dark';
  login: (email: string) => void;
  logout: () => void;
  addTool: (tool: Tool) => void;
  addActivity: (activity: ActivityLog) => void;
  toggleTheme: () => void;
  rateTool: (toolId: string, rating: number, comment: string) => void;
  rateUser: (userId: string, rating: number, comment: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOG);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const login = (email: string) => {
    setUser({ ...MOCK_USER, email });
  };

  const logout = () => {
    setUser(null);
  };

  const addTool = (tool: Tool) => {
    setTools(prevTools => [...prevTools, tool]);
    
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: 'listing',
      title: 'New Tool Listed',
      description: `You listed "${tool.name}" for rent.`,
      timestamp: Date.now(),
      amount: 0
    };
    addActivity(newActivity);
  };

  const addActivity = (activity: ActivityLog) => {
    setActivityLog(prevLog => [activity, ...prevLog]);
  };

  const rateTool = (toolId: string, rating: number, comment: string) => {
    // Update local state for tools
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        // Simple mock calculation for new average
        const newRating = ((t.rating * 10) + rating) / 11; // weighting it slightly
        return { ...t, rating: parseFloat(newRating.toFixed(1)) };
      }
      return t;
    }));

    addActivity({
      id: Date.now().toString(),
      type: 'review',
      title: 'Tool Reviewed',
      description: `You rated a tool ${rating} stars.`,
      timestamp: Date.now()
    });
  };

  const rateUser = (userId: string, rating: number, comment: string) => {
    // In a real app, this would update the target user's profile via API
    console.log(`Rated user ${userId} with ${rating} stars: ${comment}`);
    
    addActivity({
      id: Date.now().toString(),
      type: 'review',
      title: 'User Reviewed',
      description: `You rated a user ${rating} stars.`,
      timestamp: Date.now()
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      tools,
      activityLog,
      theme,
      login,
      logout,
      addTool,
      addActivity,
      toggleTheme,
      rateTool,
      rateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
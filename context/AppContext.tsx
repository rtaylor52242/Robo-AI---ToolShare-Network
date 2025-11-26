
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tool, ActivityLog, Conversation, Message } from '../types';
import { MOCK_USER, MOCK_TOOLS, MOCK_ACTIVITY_LOG, COLOR_THEMES, MOCK_ALL_USERS, MOCK_CONVERSATIONS } from '../constants';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  tools: Tool[];
  activityLog: ActivityLog[];
  conversations: Conversation[];
  theme: 'light' | 'dark';
  colorTheme: string;
  allUsers: User[];
  login: (email: string) => void;
  logout: () => void;
  addTool: (tool: Tool) => void;
  addActivity: (activity: ActivityLog) => void;
  toggleTheme: () => void;
  setColorTheme: (themeId: string) => void;
  rateTool: (toolId: string, rating: number, comment: string) => void;
  rateUser: (userId: string, rating: number, comment: string) => void;
  sendMessage: (conversationId: string, message: Message) => void;
  updateUser: (updates: Partial<User>) => void;
  verifyUser: () => void;
  manageUser: (action: 'add' | 'update' | 'delete', userData: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOG);
  
  // Global Users State
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_ALL_USERS);

  // Chat State - Initialized from localStorage if available to simulate persistence across tabs
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('chat_db');
    return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
  });

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  // Color Theme State
  const [colorTheme, setColorThemeId] = useState<string>(() => {
    return localStorage.getItem('colorTheme') || 'sky';
  });

  // Cross-tab chat sync listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chat_db' && e.newValue) {
        setConversations(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Apply Light/Dark Mode
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply Color Theme
  useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
    const selectedTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];
    
    // Set CSS variables for the color palette
    const root = document.documentElement;
    root.style.setProperty('--color-robo-50', selectedTheme.colors[50]);
    root.style.setProperty('--color-robo-100', selectedTheme.colors[100]);
    root.style.setProperty('--color-robo-500', selectedTheme.colors[500]);
    root.style.setProperty('--color-robo-600', selectedTheme.colors[600]);
    root.style.setProperty('--color-robo-900', selectedTheme.colors[900]);
    
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setColorTheme = (themeId: string) => {
    setColorThemeId(themeId);
  };

  const login = (email: string) => {
    // Try to find the specific user from the global user list
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      if (foundUser.status === 'Suspended') {
        alert('Account Suspended. Please contact support.');
        return;
      }
      setUser(foundUser);
    } else {
      // Fallback for unknown emails to the default demo user template
      // In a real app, this would fail.
      setUser({ ...MOCK_USER, email });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Also update the user in the global list
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const verifyUser = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        verified: true, 
        badges: [...user.badges, 'Identity Verified'] 
      };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  }

  const manageUser = (action: 'add' | 'update' | 'delete', userData: Partial<User>) => {
    if (action === 'add') {
        setAllUsers(prev => [userData as User, ...prev]);
    } else if (action === 'update') {
        setAllUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
        // If updating current user, update that too
        if (user && user.id === userData.id) {
            setUser(prev => prev ? { ...prev, ...userData } : null);
        }
    } else if (action === 'delete') {
        setAllUsers(prev => prev.filter(u => u.id !== userData.id));
        if (user && user.id === userData.id) {
            logout(); // Logout if self-deleted
        }
    }
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
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        const newRating = ((t.rating * 10) + rating) / 11; 
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
    console.log(`Rated user ${userId} with ${rating} stars: ${comment}`);
    addActivity({
      id: Date.now().toString(),
      type: 'review',
      title: 'User Reviewed',
      description: `You rated a user ${rating} stars.`,
      timestamp: Date.now()
    });
  };

  const sendMessage = (conversationId: string, message: Message) => {
    const updatedConversations = conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, message],
          lastMessage: message.type === 'image' ? 'Sent an image' : message.text,
          lastMessageTimestamp: Date.now()
        };
      }
      return c;
    });
    
    setConversations(updatedConversations);
    // Persist to localStorage to sync across tabs
    localStorage.setItem('chat_db', JSON.stringify(updatedConversations));
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      tools,
      activityLog,
      conversations,
      theme,
      colorTheme,
      allUsers,
      login,
      logout,
      addTool,
      addActivity,
      toggleTheme,
      setColorTheme,
      rateTool,
      rateUser,
      sendMessage,
      updateUser,
      verifyUser,
      manageUser
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

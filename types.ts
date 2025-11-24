export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  pricePerDay: number;
  image: string;
  available: boolean;
  lenderName: string;
  rating: number;
  location: string;
  condition?: ToolCondition;
  pricing?: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  unavailableDates?: string[];
  
  // New Fields
  instantBooking: boolean;
  specs?: ToolSpecs;
  safetyGuidelines?: string;
  maintenanceHistory?: MaintenanceRecord[];
}

export interface ToolSpecs {
  brand: string;
  model: string;
  powerSource?: 'Electric (Corded)' | 'Battery' | 'Gas' | 'Manual' | 'Pneumatic';
  voltage?: string;
  weight?: string;
  dimensions?: string;
  year?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'Maintenance' | 'Repair' | 'Inspection' | 'Cleaning';
  description: string;
  cost?: number;
  technician?: string;
  images?: string[];
}

export enum ToolCategory {
  POWER_TOOLS = 'Power Tools',
  HAND_TOOLS = 'Hand Tools',
  GARDENING = 'Gardening',
  AUTOMOTIVE = 'Automotive',
  WOODWORKING = 'Woodworking',
  OTHER = 'Other',
}

export enum ToolCondition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedToolIds?: string[];
  timestamp: number;
}

export interface Booking {
  id: string;
  toolId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: string;
  verified: boolean;
  badges: string[];
  blockedUserIds?: string[];
  privacy: {
    publicProfile: boolean;
    showExactLocation: boolean;
    allowMessages: boolean;
    twoFactorEnabled: boolean;
  };
  joinDate: string;
  stats: {
    rentalsCount: number;
    listingsCount: number;
    avgRating: number;
  };
}

export interface ActivityLog {
  id: string;
  type: 'rental' | 'listing' | 'review' | 'security' | 'payment';
  title: string;
  description: string;
  timestamp: number;
  amount?: number;
}

export interface Report {
  id: string;
  targetId: string;
  targetType: 'tool' | 'user';
  reason: string;
  details: string;
  timestamp: number;
}
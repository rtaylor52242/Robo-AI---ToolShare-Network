
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
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  unavailableDates?: string[];
  
  // New Fields
  instantBooking?: boolean;
  specs?: ToolSpecs;
  safetyGuidelines?: string;
  maintenanceHistory?: MaintenanceRecord[];
  securityDeposit?: number;
}

export interface ToolSpecs {
  brand?: string;
  model?: string;
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
  paymentStatus?: 'held_in_escrow' | 'released' | 'refunded';
  depositStatus?: 'held' | 'returned' | 'deducted';
  insurancePlanId?: string;
  promoCode?: string;
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
  // Loyalty
  loyaltyPoints: number;
  referralCode: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
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

export interface Wallet {
  availableBalance: number;
  escrowBalance: number;
  pendingDeposits: number;
  transactions: ActivityLog[];
}

// New Interfaces for Messaging & Support

export interface Notification {
  id: string;
  type: 'booking' | 'system' | 'message' | 'alert';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

export interface Message {
  id: string;
  senderId: string; // 'me' or 'other'
  text: string;
  imageUrl?: string;
  timestamp: number;
  type: 'text' | 'image' | 'system';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTimestamp: number;
  unreadCount: number;
  messages: Message[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  reason: string;
  description: string;
  status: 'submitted' | 'under_review' | 'mediation' | 'resolved';
  dateSubmitted: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: 'Recommendations' | 'Projects' | 'Meetups' | 'General';
  replies: number;
  views: number;
  lastActive: string;
}

// Insurance & Marketing
export interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  coverageLimit: number;
  deductible: number;
  description: string;
  features: string[];
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

export interface AnalyticsData {
  revenue: { date: string; value: number }[];
  rentals: { date: string; value: number }[];
  views: { date: string; value: number }[];
  topTools: { name: string; rentals: number }[];
}

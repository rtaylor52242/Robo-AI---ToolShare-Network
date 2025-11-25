
import { Tool, ToolCategory, Booking, User, ActivityLog, ToolCondition, Wallet, Notification, Conversation, FAQItem, Review, ForumThread, InsurancePlan, PromoCode, AnalyticsData, LoyaltyTier } from './types';

export const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'DeWalt 20V Max Cordless Drill',
    description: 'Powerful cordless drill suitable for most home projects. Comes with two batteries and charger.',
    category: ToolCategory.POWER_TOOLS,
    pricePerDay: 25,
    pricing: { hourly: 5, daily: 25, weekly: 120, monthly: 400 },
    securityDeposit: 50,
    image: 'https://picsum.photos/id/1/400/300',
    available: true,
    lenderName: 'Alex R.',
    rating: 4.8,
    location: 'Downtown',
    condition: ToolCondition.GOOD,
    instantBooking: true,
    specs: {
      brand: 'DeWalt',
      model: 'DCD771C2',
      powerSource: 'Battery',
      voltage: '20V',
      weight: '3.6 lbs'
    },
    safetyGuidelines: 'Always wear safety glasses. Secure loose clothing and hair. Disconnect battery when changing bits.',
    maintenanceHistory: [
      { id: 'm1', date: '2024-04-15', type: 'Inspection', description: 'Routine check of motor brushes and battery health.', technician: 'Self' },
      { id: 'm2', date: '2023-11-20', type: 'Cleaning', description: 'Deep clean after drywall project.', technician: 'Self' }
    ]
  },
  {
    id: '2',
    name: 'Makita Circular Saw',
    description: '7-1/4 inch circular saw. Perfect for cutting lumber and plywood. Safety guard included.',
    category: ToolCategory.WOODWORKING,
    pricePerDay: 35,
    pricing: { hourly: 8, daily: 35, weekly: 150, monthly: 500 },
    securityDeposit: 100,
    image: 'https://picsum.photos/id/2/400/300',
    available: true,
    lenderName: 'Sarah J.',
    rating: 4.9,
    location: 'Westside',
    condition: ToolCondition.LIKE_NEW,
    instantBooking: false,
    specs: {
      brand: 'Makita',
      model: '5007MG',
      powerSource: 'Electric (Corded)',
      voltage: '120V',
      weight: '10.6 lbs'
    },
    safetyGuidelines: 'Use hearing protection. Ensure guard is functioning. Never force the saw through material.',
    maintenanceHistory: [
      { id: 'm3', date: '2024-05-01', type: 'Maintenance', description: 'Blade replacement (Carbide 24T).', cost: 25 }
    ]
  },
  {
    id: '3',
    name: 'Heavy Duty Palm Sander',
    description: 'Electric orbital sander for smooth finishing on wood surfaces. Dust bag included.',
    category: ToolCategory.WOODWORKING,
    pricePerDay: 15,
    pricing: { hourly: 3, daily: 15, weekly: 70, monthly: 200 },
    securityDeposit: 25,
    image: 'https://picsum.photos/id/3/400/300',
    available: true,
    lenderName: 'Mike T.',
    rating: 4.5,
    location: 'North Hills',
    condition: ToolCondition.FAIR,
    instantBooking: true,
    specs: {
      brand: 'Bosch',
      model: 'ROS20VSC',
      powerSource: 'Electric (Corded)',
    },
    safetyGuidelines: 'Wear a dust mask. Empty dust bag frequently.',
    maintenanceHistory: []
  },
  {
    id: '4',
    name: 'Torque Wrench Set',
    description: 'Precision torque wrench set for automotive repairs. 1/2 inch drive.',
    category: ToolCategory.AUTOMOTIVE,
    pricePerDay: 20,
    pricing: { hourly: 4, daily: 20, weekly: 80, monthly: 250 },
    securityDeposit: 40,
    image: 'https://picsum.photos/id/4/400/300',
    available: true,
    lenderName: 'AutoFix Garage',
    rating: 5.0,
    location: 'Industrial Park',
    condition: ToolCondition.NEW,
    instantBooking: false,
    maintenanceHistory: [
      { id: 'm4', date: '2024-01-10', type: 'Inspection', description: 'Calibration verification.', technician: 'Certified Tech' }
    ]
  },
  {
    id: '5',
    name: 'Electric Lawn Mower',
    description: 'Cordless electric lawn mower. Quiet and eco-friendly. Ideal for small to medium yards.',
    category: ToolCategory.GARDENING,
    pricePerDay: 40,
    pricing: { hourly: 10, daily: 40, weekly: 180, monthly: 600 },
    securityDeposit: 150,
    image: 'https://picsum.photos/id/5/400/300',
    available: false,
    lenderName: 'Green Thumb Co.',
    rating: 4.7,
    location: 'Suburbs',
    condition: ToolCondition.GOOD,
    instantBooking: true,
    unavailableDates: ['2024-05-10', '2024-05-11', '2024-05-12']
  },
  {
    id: '6',
    name: 'Jigsaw',
    description: 'Variable speed jigsaw for cutting curves and intricate shapes in wood or metal.',
    category: ToolCategory.POWER_TOOLS,
    pricePerDay: 18,
    pricing: { hourly: 4, daily: 18, weekly: 90, monthly: 300 },
    securityDeposit: 30,
    image: 'https://picsum.photos/id/6/400/300',
    available: true,
    lenderName: 'Creative Carpenters',
    rating: 4.6,
    location: 'Downtown',
    condition: ToolCondition.GOOD,
    instantBooking: true
  },
  {
    id: '7',
    name: 'Post Hole Digger',
    description: 'Manual post hole digger for fencing projects. Heavy steel construction.',
    category: ToolCategory.GARDENING,
    pricePerDay: 12,
    pricing: { hourly: 2, daily: 12, weekly: 50 },
    securityDeposit: 20,
    image: 'https://picsum.photos/id/7/400/300',
    available: true,
    lenderName: 'Garden Pro',
    rating: 4.3,
    location: 'Eastside',
    condition: ToolCondition.FAIR,
    instantBooking: true
  },
  {
    id: '8',
    name: 'Impact Driver',
    description: 'High torque impact driver for driving long screws and lag bolts.',
    category: ToolCategory.POWER_TOOLS,
    pricePerDay: 28,
    pricing: { hourly: 6, daily: 28, weekly: 130, monthly: 450 },
    securityDeposit: 60,
    image: 'https://picsum.photos/id/8/400/300',
    available: true,
    lenderName: 'Alex R.',
    rating: 4.8,
    location: 'Downtown',
    condition: ToolCondition.LIKE_NEW,
    instantBooking: false
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    toolId: '5',
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    totalPrice: 80,
    status: 'confirmed',
    paymentStatus: 'held_in_escrow',
    depositStatus: 'held'
  },
  {
    id: 'b2',
    toolId: '1',
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    totalPrice: 100,
    status: 'completed',
    paymentStatus: 'released',
    depositStatus: 'returned'
  },
  {
    id: 'b3',
    toolId: '3',
    startDate: '2024-05-15',
    endDate: '2024-05-16',
    totalPrice: 15,
    status: 'pending'
  }
];

export const SEARCH_SUGGESTIONS = [
  'Cordless Drill', 'Circular Saw', 'Lawn Mower', 'Hammer Drill', 'Sander', 
  'Wrench', 'Ladder', 'Pressure Washer', 'Generator', 'Table Saw'
];

export const MOCK_USER: User = {
  id: 'u123',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
  bio: 'DIY enthusiast and weekend woodworker. I love restoring old furniture and building small cabinets. Always happy to share tips!',
  location: 'San Francisco, CA',
  verified: true,
  badges: ['Identity Verified', 'Top Lender', 'Early Adopter'],
  privacy: {
    publicProfile: true,
    showExactLocation: false,
    allowMessages: true,
    twoFactorEnabled: true,
  },
  joinDate: '2023-08-15',
  stats: {
    rentalsCount: 12,
    listingsCount: 5,
    avgRating: 4.9,
  },
  loyaltyPoints: 1250,
  referralCode: 'ALEXR2024',
  tier: 'Silver'
};

export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  {
    id: 'a1',
    type: 'payment',
    title: 'Payout Received',
    description: 'Payout of $45.00 for DeWalt Drill rental processed.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    amount: 45
  },
  {
    id: 'a2',
    type: 'rental',
    title: 'Booking Confirmed',
    description: 'You approved the rental request for Makita Circular Saw.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: 'a3',
    type: 'review',
    title: 'Review Received',
    description: 'Sarah J. left a 5-star review: "Great tool, perfectly maintained!"',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
  },
  {
    id: 'a4',
    type: 'security',
    title: 'Login from New Device',
    description: 'Successful login from Chrome on macOS.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
  {
    id: 'a5',
    type: 'listing',
    title: 'New Tool Listed',
    description: 'You listed "Heavy Duty Palm Sander" for rent.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
  }
];

export const MOCK_WALLET: Wallet = {
  availableBalance: 324.50,
  escrowBalance: 150.00,
  pendingDeposits: 50.00,
  transactions: MOCK_ACTIVITY_LOG.filter(l => l.type === 'payment')
};

export const MOCK_SPEC_DATABASE = [
  {
    label: 'DeWalt 20V Drill',
    name: 'DeWalt 20V Max Cordless Drill',
    specs: {
      brand: 'DeWalt',
      model: 'DCD771C2',
      powerSource: 'Battery',
      voltage: '20V',
      weight: '3.6 lbs'
    },
    category: ToolCategory.POWER_TOOLS,
    description: 'Compact, lightweight design fits into tight areas. High performance motor delivers 300 unit watts out (UWO) of power ability completing a wide range of applications.'
  },
  {
    label: 'Makita Circ Saw',
    name: 'Makita 7-1/4" Circular Saw',
    specs: {
      brand: 'Makita',
      model: '5007MGA',
      powerSource: 'Electric (Corded)',
      voltage: '120V',
      weight: '10.6 lbs'
    },
    category: ToolCategory.WOODWORKING,
    description: 'Magnesium components create a lightweight saw that is well balanced and job site tough.'
  },
  {
    label: 'Milwaukee Impact',
    name: 'Milwaukee M18 Fuel Impact Driver',
    specs: {
      brand: 'Milwaukee',
      model: '2853-20',
      powerSource: 'Battery',
      voltage: '18V',
      weight: '2.2 lbs'
    },
    category: ToolCategory.POWER_TOOLS,
    description: 'The M18 FUEL ¼” Hex Impact Driver is the Fastest, Most Compact, and Most Powerful tool in its class.'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking Request Approved',
    message: 'Your request for the DeWalt Drill has been approved by Alex.',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    read: false,
    link: '/dashboard'
  },
  {
    id: 'n2',
    type: 'alert',
    title: 'Return Reminder',
    message: 'The Makita Circular Saw is due back tomorrow by 5 PM.',
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    read: true,
    link: '/dashboard'
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Security Deposit Released',
    message: '$50.00 has been returned to your wallet.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    link: '/dashboard'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participantId: 'u2',
    participantName: 'Sarah J.',
    participantAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isOnline: true,
    lastMessage: 'Great, I will be there at 10 AM to pick it up.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 15,
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Sarah, is the sander still available for this weekend?', timestamp: Date.now() - 1000 * 60 * 60, type: 'text' },
      { id: 'm2', senderId: 'u2', text: 'Yes it is! When would you like to grab it?', timestamp: Date.now() - 1000 * 60 * 55, type: 'text' },
      { id: 'm3', senderId: 'me', text: 'Saturday morning would be perfect.', timestamp: Date.now() - 1000 * 60 * 20, type: 'text' },
      { id: 'm4', senderId: 'u2', text: 'Great, I will be there at 10 AM to pick it up.', timestamp: Date.now() - 1000 * 60 * 15, type: 'text' }
    ]
  },
  {
    id: 'c2',
    participantId: 'u3',
    participantName: 'Mike T.',
    participantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isOnline: false,
    lastMessage: 'Can you send a photo of the condition?',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    unreadCount: 0,
    messages: [
       { id: 'm5', senderId: 'u3', text: 'Hey, interested in the ladder.', timestamp: Date.now() - 1000 * 60 * 60 * 25, type: 'text' },
       { id: 'm6', senderId: 'u3', text: 'Can you send a photo of the condition?', timestamp: Date.now() - 1000 * 60 * 60 * 24, type: 'text' }
    ]
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'f1',
    category: 'Getting Started',
    question: 'How do I verify my identity?',
    answer: 'To verify your identity, go to your Profile > Settings & Privacy. Upload a government-issued ID and a selfie. Verification typically takes 24 hours.'
  },
  {
    id: 'f2',
    category: 'Rentals & Booking',
    question: 'What happens if I damage a tool?',
    answer: 'Accidents happen. If a tool is damaged, report it immediately via the booking page. Costs for repairs may be deducted from your security deposit, or covered by insurance if applicable.'
  },
  {
    id: 'f3',
    category: 'Payments',
    question: 'When is the security deposit released?',
    answer: 'Security deposits are held in escrow and released 48 hours after the tool is returned and confirmed by the owner to be in good condition.'
  },
  {
    id: 'f4',
    category: 'Trust & Safety',
    question: 'Is there insurance for my tools?',
    answer: 'Yes! ToolShare provides coverage up to $1,000 for tools rented through the platform. This covers damage and theft during the active rental period.'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'Sarah J.',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Great tool, perfectly maintained! Alex was very helpful showing me how to use it.',
    date: '2024-05-15',
    verified: true,
    helpfulCount: 2
  },
  {
    id: 'r2',
    authorName: 'Mike T.',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    text: 'Good value for the price. Tool showed some wear but worked fine.',
    date: '2024-04-20',
    verified: true,
    helpfulCount: 0
  }
];

export const MOCK_FORUM_THREADS: ForumThread[] = [
  {
    id: 't1',
    title: 'Best sander for refinishing hardwood floors?',
    author: 'WoodWorker88',
    category: 'Recommendations',
    replies: 12,
    views: 145,
    lastActive: '2 hours ago'
  },
  {
    id: 't2',
    title: 'Community Workshop Meetup - June 15th',
    author: 'ToolShareAdmin',
    category: 'Meetups',
    replies: 45,
    views: 890,
    lastActive: '10 mins ago'
  },
  {
    id: 't3',
    title: 'DIY Deck Building Project - Progress Pics',
    author: 'BuilderBob',
    category: 'Projects',
    replies: 8,
    views: 200,
    lastActive: '1 day ago'
  }
];

export const MOCK_INSURANCE: InsurancePlan[] = [
  {
    id: 'basic',
    name: 'Basic Coverage',
    price: 0,
    coverageLimit: 200,
    deductible: 50,
    description: 'Standard protection for minor issues.',
    features: ['Damage protection up to $200', 'Standard support']
  },
  {
    id: 'premium',
    name: 'Premium Protection',
    price: 9.99,
    coverageLimit: 1000,
    deductible: 0,
    description: 'Complete peace of mind for high-value items.',
    features: ['Damage & Theft up to $1,000', '$0 Deductible', 'Priority 24/7 Support']
  }
];

export const MOCK_PROMOS: PromoCode[] = [
  { code: 'WELCOME10', discountType: 'percentage', value: 0.10, description: '10% off your first rental' },
  { code: 'SAVE5', discountType: 'fixed', value: 5, description: '$5 off' }
];

export const MOCK_ANALYTICS: AnalyticsData = {
  revenue: [
    { date: 'Mon', value: 120 },
    { date: 'Tue', value: 150 },
    { date: 'Wed', value: 180 },
    { date: 'Thu', value: 140 },
    { date: 'Fri', value: 250 },
    { date: 'Sat', value: 320 },
    { date: 'Sun', value: 290 },
  ],
  rentals: [
    { date: 'Mon', value: 2 },
    { date: 'Tue', value: 3 },
    { date: 'Wed', value: 4 },
    { date: 'Thu', value: 2 },
    { date: 'Fri', value: 6 },
    { date: 'Sat', value: 8 },
    { date: 'Sun', value: 7 },
  ],
  views: [
    { date: 'Mon', value: 45 },
    { date: 'Tue', value: 52 },
    { date: 'Wed', value: 68 },
    { date: 'Thu', value: 55 },
    { date: 'Fri', value: 90 },
    { date: 'Sat', value: 120 },
    { date: 'Sun', value: 110 },
  ],
  topTools: [
    { name: 'DeWalt Drill', rentals: 12 },
    { name: 'Makita Saw', rentals: 8 },
    { name: 'Pressure Washer', rentals: 6 },
    { name: 'Ladder', rentals: 5 }
  ]
};

export const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [
  { name: 'Bronze', minPoints: 0, benefits: ['Standard support', 'Access to rentals'], color: 'text-orange-700' },
  { name: 'Silver', minPoints: 500, benefits: ['5% discount on rentals', 'Early access to new tools'], color: 'text-gray-400' },
  { name: 'Gold', minPoints: 1000, benefits: ['10% discount', 'Priority support', '$0 security deposits'], color: 'text-yellow-500' },
  { name: 'Platinum', minPoints: 2500, benefits: ['15% discount', 'Concierge service', 'Exclusive events'], color: 'text-purple-400' }
];

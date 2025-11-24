import { Tool, ToolCategory, Booking, User, ActivityLog, ToolCondition } from './types';

export const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'DeWalt 20V Max Cordless Drill',
    description: 'Powerful cordless drill suitable for most home projects. Comes with two batteries and charger.',
    category: ToolCategory.POWER_TOOLS,
    pricePerDay: 25,
    pricing: { hourly: 5, daily: 25, weekly: 120 },
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
    pricing: { hourly: 8, daily: 35, weekly: 150 },
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
    pricing: { hourly: 3, daily: 15, weekly: 70 },
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
    pricing: { hourly: 4, daily: 20, weekly: 80 },
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
    pricing: { hourly: 10, daily: 40, weekly: 180 },
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
    pricing: { hourly: 4, daily: 18, weekly: 90 },
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
    pricing: { hourly: 6, daily: 28, weekly: 130 },
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
    status: 'confirmed'
  },
  {
    id: 'b2',
    toolId: '1',
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    totalPrice: 100,
    status: 'completed'
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
  }
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
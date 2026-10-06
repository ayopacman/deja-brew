export type CoffeeCategory = 
  | 'espresso' 
  | 'milk-based'
  | 'brewed' 
  | 'iced'
  | 'hybrids'
  | 'snacks' 
  | 'desserts'
  | 'pairings';

export type MilkOption = 'whole' | 'oat' | 'almond' | 'coconut' | 'condensed' | 'none';
export type ShotOption = 'single' | 'double' | 'triple' | 'decaf';
export type SyrupOption = 'vanilla' | 'caramel' | 'hazelnut' | 'lavender' | 'none';
export type TempOption = 'hot' | 'iced' | 'extra-hot';
export type SweetnessOption = '0%' | '25%' | '50%' | '100%';

export interface CustomizationOptions {
  milk: MilkOption;
  shots: ShotOption;
  syrup: SyrupOption;
  syrupPumps: number;
  temp: TempOption;
  sweetness: SweetnessOption;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  category: CoffeeCategory;
  subcategory?: string;
  price: number; // in INR (₹)
  image: string;
  description: string;
  flavorNotes?: string[];
  calories?: number;
  isPopular?: boolean;
  isHouseSpecial?: boolean;
  intensity?: number; // 1 to 5 bean rating
  roastType?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  dietary?: ('Vegan' | 'Vegetarian' | 'Gluten-Free' | 'Nut-Free' | 'Dairy-Free')[];
  originEstate?: string;
  altitude?: string;
  isCustomizable: boolean;
  defaultCustomization?: CustomizationOptions;
}

export interface PairingRecommendation {
  id: string;
  drinkName: string;
  snackName: string;
  drinkId: string;
  snackId: string;
  comboPrice: number;
  savings: number;
  reason: string;
  image: string;
}

export type OrderStatus = 'received' | 'brewing' | 'ready' | 'collected' | 'cancelled';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customization: CustomizationOptions;
  itemTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  orderType?: OrderType;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  discountCode?: string;
  discountAmount?: number;
  total: number;
  pickupTime: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  paymentMethod: 'upi' | 'card' | 'apple-pay' | 'google-pay' | 'counter';
  paymentStatus: 'paid' | 'pending';
  estimatedReadyTime: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  pricePerDelivery: number;
  bagsCount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  roastPreference: string;
  grindType: string;
  description: string;
  benefits: string[];
  recommendedOrigin: string;
}

export interface BrewGuide {
  id: string;
  name: string;
  method: string;
  tagline: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  ratio: string;
  recommendedGrind: string;
  waterTemp: string;
  targetTime: string;
  defaultCoffeeGrams: number;
  defaultRatioNumber: number;
  steps: {
    time: string;
    title: string;
    description: string;
    targetWaterGrams: (coffee: number) => number;
  }[];
}

export type OrderType = 'takeaway' | 'dine-in';

export interface GiftVoucher {
  id: string;
  code: string;
  theme: 'ribbon-pink' | 'wavy-pastel' | 'gold-seal' | 'sakura-elegance';
  recipientName: string;
  senderName: string;
  amount: number;
  discountType: 'fixed' | 'percent';
  message: string;
  expiryDate: string;
  createdAt: number;
  isRedeemed?: boolean;
}

export interface OriginRegion {
  id: string;
  name: string;
  country: string;
  estateName: string;
  altitude: string;
  process: string;
  roastProfile: string;
  flavorNotes: string[];
  description: string;
  image: string;
  coordinates: { x: number; y: number }; // Percentage for custom map pin
  matchedMenuItems: string[];
}

export interface CustomerReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  favoriteItem: string;
  photoUrl?: string;
  verifiedVisit: boolean;
}

export interface AmbientTrack {
  id: string;
  title: string;
  subtitle: string;
  type: 'lofi' | 'rain' | 'cafe_ambient';
  audioSrc?: string;
  icon: string;
}


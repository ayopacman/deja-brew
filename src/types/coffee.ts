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
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
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

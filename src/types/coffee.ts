export type CoffeeCategory = 
  | 'espresso' 
  | 'cold-brew' 
  | 'signature-lattes' 
  | 'pour-over' 
  | 'pastries' 
  | 'beans';

export type MilkOption = 'whole' | 'oat' | 'almond' | 'coconut' | 'skim' | 'none';
export type ShotOption = 'single' | 'double' | 'triple' | 'decaf';
export type SyrupOption = 'vanilla' | 'caramel' | 'hazelnut' | 'lavender' | 'cardamom-cinnamon' | 'sugar-free-vanilla' | 'none';
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
  price: number;
  image: string;
  description: string;
  roastLevel?: 'Light' | 'Medium' | 'Dark';
  origin?: string;
  flavorNotes: string[];
  calories?: number;
  isPopular?: boolean;
  isSeasonal?: boolean;
  isCustomizable: boolean;
  defaultCustomization?: CustomizationOptions;
}

export type OrderStatus = 'received' | 'brewing' | 'ready' | 'collected' | 'cancelled';

export interface CartItem {
  id: string; // unique item uuid in cart
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
  pickupTime: string; // "ASAP (~10 min)" or timestamp
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  paymentMethod: 'card' | 'apple-pay' | 'google-pay' | 'counter';
  paymentStatus: 'paid' | 'pending';
  estimatedReadyTime: number; // unix timestamp in ms
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'Curator' | 'Single-Origin Explorer' | 'Espresso Master' | 'Rare Reserve';
  pricePerDelivery: number;
  bagsCount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  roastPreference: 'Light (Fruity & Floral)' | 'Medium (Balanced & Caramel)' | 'Dark (Rich & Bold)' | 'Barista Choice';
  grindType: 'Whole Bean' | 'Coarse (French Press/Cold Brew)' | 'Medium (V60/Drip)' | 'Fine (Espresso)' | 'Aeropress';
  description: string;
  benefits: string[];
  recommendedOrigin: string;
}

export interface BrewGuide {
  id: string;
  name: string;
  method: 'V60' | 'Aeropress' | 'French Press' | 'Chemex' | 'Espresso' | 'Cold Brew';
  tagline: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  ratio: string; // e.g. "1:16"
  recommendedGrind: string;
  waterTemp: string; // e.g. "93°C / 200°F"
  targetTime: string; // e.g. "3:00 - 3:30"
  defaultCoffeeGrams: number;
  defaultRatioNumber: number;
  steps: {
    time: string; // e.g. "0:00 - 0:45"
    title: string;
    description: string;
    targetWaterGrams: (coffee: number) => number;
  }[];
}

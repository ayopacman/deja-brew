'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomizationOptions, MenuItem, Order, OrderStatus } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, customization: CustomizationOptions, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  orders: Order[];
  createOrder: (data: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    pickupTime: string;
    paymentMethod: 'card' | 'apple-pay' | 'google-pay' | 'counter';
    tip?: number;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  getOrderById: (orderId: string) => Order | undefined;
  resetToSampleOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-8012',
    orderNumber: '#8012',
    customerName: 'Marcus Vance',
    customerPhone: '+1 (555) 342-9901',
    customerEmail: 'marcus.v@example.com',
    items: [
      {
        id: 'ci-1',
        menuItem: MENU_ITEMS[0], // Artisan Flat White
        quantity: 1,
        customization: {
          milk: 'oat',
          shots: 'double',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%',
          notes: 'Extra silky micro-foam please'
        },
        itemTotal: 5.50
      },
      {
        id: 'ci-2',
        menuItem: MENU_ITEMS[8], // Cardamom Morning Bun
        quantity: 1,
        customization: {
          milk: 'none',
          shots: 'single',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%'
        },
        itemTotal: 4.95
      }
    ],
    subtotal: 10.45,
    tax: 0.84,
    tip: 2.00,
    total: 13.29,
    pickupTime: 'ASAP (~8 mins)',
    status: 'brewing',
    createdAt: Date.now() - 4 * 60 * 1000, // 4 mins ago
    updatedAt: Date.now() - 2 * 60 * 1000,
    paymentMethod: 'apple-pay',
    paymentStatus: 'paid',
    estimatedReadyTime: Date.now() + 4 * 60 * 1000
  },
  {
    id: 'ord-8013',
    orderNumber: '#8013',
    customerName: 'Elena Rostova',
    customerPhone: '+1 (555) 789-2311',
    items: [
      {
        id: 'ci-3',
        menuItem: MENU_ITEMS[3], // Wild Lavender Honey Oat Latte
        quantity: 2,
        customization: {
          milk: 'oat',
          shots: 'double',
          syrup: 'lavender',
          syrupPumps: 2,
          temp: 'iced',
          sweetness: '50%',
          notes: 'Light ice'
        },
        itemTotal: 13.50
      }
    ],
    subtotal: 13.50,
    tax: 1.08,
    tip: 3.00,
    total: 17.58,
    pickupTime: '10:45 AM (Ahead)',
    status: 'received',
    createdAt: Date.now() - 1 * 60 * 1000, // 1 min ago
    updatedAt: Date.now() - 1 * 60 * 1000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    estimatedReadyTime: Date.now() + 9 * 60 * 1000
  },
  {
    id: 'ord-8014',
    orderNumber: '#8014',
    customerName: 'Devon Takahashi',
    customerPhone: '+1 (555) 441-8890',
    items: [
      {
        id: 'ci-4',
        menuItem: MENU_ITEMS[6], // 24-Hour Kyoto Nitro Cold Brew
        quantity: 1,
        customization: {
          milk: 'none',
          shots: 'single',
          syrup: 'vanilla',
          syrupPumps: 1,
          temp: 'iced',
          sweetness: '25%'
        },
        itemTotal: 6.00
      }
    ],
    subtotal: 6.00,
    tax: 0.48,
    tip: 1.50,
    total: 7.98,
    pickupTime: 'ASAP',
    status: 'ready',
    createdAt: Date.now() - 9 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 1000,
    paymentMethod: 'google-pay',
    paymentStatus: 'paid',
    estimatedReadyTime: Date.now() - 1 * 60 * 1000
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage and setup cross-tab BroadcastChannel
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('coffee_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('coffee_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed.length > 0 ? parsed : SAMPLE_ORDERS);
      } else {
        setOrders(SAMPLE_ORDERS);
      }

      const savedActive = localStorage.getItem('coffee_active_order');
      if (savedActive) {
        setActiveOrder(JSON.parse(savedActive));
      }
    } catch (e) {
      console.warn('Storage read error', e);
      setOrders(SAMPLE_ORDERS);
    }
    setIsInitialized(true);
  }, []);

  // Broadcast channel for real-time KDS & Tracker sync across browser tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('coffee_kds_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'ORDERS_UPDATED') {
          setOrders(event.data.orders);
          if (event.data.activeOrder) {
            setActiveOrder(event.data.activeOrder);
          }
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    return () => {
      channel?.close();
    };
  }, []);

  // Sync to LocalStorage & broadcast
  const saveAndBroadcastOrders = (updatedOrders: Order[], updatedActive?: Order | null) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem('coffee_orders', JSON.stringify(updatedOrders));
      if (updatedActive !== undefined) {
        setActiveOrder(updatedActive);
        if (updatedActive) {
          localStorage.setItem('coffee_active_order', JSON.stringify(updatedActive));
        } else {
          localStorage.removeItem('coffee_active_order');
        }
      }

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('coffee_kds_sync');
        channel.postMessage({
          type: 'ORDERS_UPDATED',
          orders: updatedOrders,
          activeOrder: updatedActive
        });
        channel.close();
      }
    } catch (e) {
      console.warn('Sync error', e);
    }
  };

  // Sync cart changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('coffee_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart save error', e);
    }
  }, [cart, isInitialized]);

  const addToCart = (menuItem: MenuItem, customization: CustomizationOptions, quantity = 1) => {
    let additionalPrice = 0;
    if (customization.milk === 'oat' || customization.milk === 'almond' || customization.milk === 'coconut') {
      additionalPrice += 0.75;
    }
    if (customization.shots === 'triple') additionalPrice += 1.00;
    if (customization.syrup !== 'none' && customization.syrupPumps > 0) {
      additionalPrice += 0.50;
    }

    const singleItemPrice = menuItem.price + additionalPrice;
    const itemTotal = singleItemPrice * quantity;

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem,
      quantity,
      customization,
      itemTotal
    };

    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const unitPrice = item.itemTotal / item.quantity;
          return {
            ...item,
            quantity,
            itemTotal: unitPrice * quantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartTax = Number((cartSubtotal * 0.08).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartTax).toFixed(2));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = async (data: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    pickupTime: string;
    paymentMethod: 'card' | 'apple-pay' | 'google-pay' | 'counter';
    tip?: number;
  }): Promise<Order> => {
    const nextNum = 8010 + orders.length + 1;
    const tip = data.tip || 0;
    const totalWithTip = Number((cartTotal + tip).toFixed(2));

    const newOrder: Order = {
      id: `ord-${nextNum}`,
      orderNumber: `#${nextNum}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      tip,
      total: totalWithTip,
      pickupTime: data.pickupTime,
      status: 'received',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      paymentMethod: data.paymentMethod,
      paymentStatus: 'paid',
      estimatedReadyTime: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    const updated = [newOrder, ...orders];
    saveAndBroadcastOrders(updated, newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          updatedAt: Date.now()
        };
      }
      return ord;
    });

    const currentActive = activeOrder && activeOrder.id === orderId 
      ? { ...activeOrder, status: newStatus, updatedAt: Date.now() }
      : activeOrder;

    saveAndBroadcastOrders(updated, currentActive);
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const resetToSampleOrders = () => {
    saveAndBroadcastOrders(SAMPLE_ORDERS, SAMPLE_ORDERS[0]);
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        activeOrder,
        setActiveOrder,
        getOrderById,
        resetToSampleOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

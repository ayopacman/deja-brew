'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomizationOptions, MenuItem, Order, OrderStatus } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, customization: CustomizationOptions, quantity?: number) => void;
  addPairingToCart: (drinkItem: MenuItem, snackItem: MenuItem) => void;
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
    paymentMethod: 'upi' | 'card' | 'apple-pay' | 'google-pay' | 'counter';
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
    id: 'ord-101',
    orderNumber: '#101',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'aarav@example.com',
    items: [
      {
        id: 'ci-1',
        menuItem: MENU_ITEMS[7], // The Flat White
        quantity: 1,
        customization: {
          milk: 'oat',
          shots: 'double',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%',
          notes: 'Extra silky microfoam'
        },
        itemTotal: 330
      },
      {
        id: 'ci-2',
        menuItem: MENU_ITEMS[20], // Toasted Banana Walnut Bread
        quantity: 1,
        customization: {
          milk: 'none',
          shots: 'single',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%'
        },
        itemTotal: 190
      }
    ],
    subtotal: 520,
    tax: 26,
    tip: 40,
    total: 586,
    pickupTime: 'ASAP (~8 mins)',
    status: 'brewing',
    createdAt: Date.now() - 3 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 1000,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    estimatedReadyTime: Date.now() + 5 * 60 * 1000
  },
  {
    id: 'ord-102',
    orderNumber: '#102',
    customerName: 'Pooja Iyer',
    customerPhone: '+91 98234 56789',
    items: [
      {
        id: 'ci-3',
        menuItem: MENU_ITEMS[9], // Spanish Latte
        quantity: 1,
        customization: {
          milk: 'condensed',
          shots: 'double',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'iced',
          sweetness: '100%',
          notes: 'Light ice'
        },
        itemTotal: 340
      },
      {
        id: 'ci-4',
        menuItem: MENU_ITEMS[24], // Brown Butter Sea Salt Brownie
        quantity: 1,
        customization: {
          milk: 'none',
          shots: 'single',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%'
        },
        itemTotal: 240
      }
    ],
    subtotal: 580,
    tax: 29,
    tip: 50,
    total: 659,
    pickupTime: 'In 15 mins',
    status: 'received',
    createdAt: Date.now() - 1 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 1000,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    estimatedReadyTime: Date.now() + 12 * 60 * 1000
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('dejabrew_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('dejabrew_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed.length > 0 ? parsed : SAMPLE_ORDERS);
      } else {
        setOrders(SAMPLE_ORDERS);
      }

      const savedActive = localStorage.getItem('dejabrew_active_order');
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
      channel = new BroadcastChannel('dejabrew_kds_sync');
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

  const saveAndBroadcastOrders = (updatedOrders: Order[], updatedActive?: Order | null) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem('dejabrew_orders', JSON.stringify(updatedOrders));
      if (updatedActive !== undefined) {
        setActiveOrder(updatedActive);
        if (updatedActive) {
          localStorage.setItem('dejabrew_active_order', JSON.stringify(updatedActive));
        } else {
          localStorage.removeItem('dejabrew_active_order');
        }
      }

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('dejabrew_kds_sync');
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

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('dejabrew_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart save error', e);
    }
  }, [cart, isInitialized]);

  const addToCart = (menuItem: MenuItem, customization: CustomizationOptions, quantity = 1) => {
    let additionalPrice = 0;
    if (customization.milk === 'oat' || customization.milk === 'almond' || customization.milk === 'coconut') {
      additionalPrice += 50;
    }
    if (customization.shots === 'triple') additionalPrice += 60;
    if (customization.syrup !== 'none' && customization.syrupPumps > 0) {
      additionalPrice += 40;
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

  const addPairingToCart = (drinkItem: MenuItem, snackItem: MenuItem) => {
    addToCart(drinkItem, drinkItem.defaultCustomization || {
      milk: 'whole',
      shots: 'double',
      syrup: 'none',
      syrupPumps: 0,
      temp: 'hot',
      sweetness: '0%',
    }, 1);

    addToCart(snackItem, {
      milk: 'none',
      shots: 'single',
      syrup: 'none',
      syrupPumps: 0,
      temp: 'hot',
      sweetness: '0%',
    }, 1);
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
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartTotal = cartSubtotal + cartTax;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = async (data: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    pickupTime: string;
    paymentMethod: 'upi' | 'card' | 'apple-pay' | 'google-pay' | 'counter';
    tip?: number;
  }): Promise<Order> => {
    const nextNum = 100 + orders.length + 1;
    const tip = data.tip || 0;
    const totalWithTip = cartTotal + tip;

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
      estimatedReadyTime: Date.now() + 10 * 60 * 1000
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
        addPairingToCart,
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

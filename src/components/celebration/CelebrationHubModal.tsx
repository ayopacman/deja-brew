'use client';

import React, { useState } from 'react';
import { Cake, Sparkles, X, Calendar, Clock, Heart, Check, Gift, ShoppingCart, MessageSquare, Coffee } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';

interface CelebrationHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CelebrationItem {
  id: string;
  name: string;
  category: 'cake' | 'box' | 'carafe';
  weight: string;
  serves: string;
  price: number;
  image: string;
  description: string;
  tags: string[];
}

const CELEBRATION_ITEMS: CelebrationItem[] = [
  {
    id: 'sakura-chiffon',
    name: 'Artisan Sakura Strawberry Chiffon Cake',
    category: 'cake',
    weight: '1.0 kg',
    serves: '6 - 8 people',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Cloud-soft Japanese sponge infused with cherry blossom essence, fresh strawberries, and Hokkaido whipped cream.',
    tags: ['🌸 Best Seller', 'Hokkaido Cream', 'Japanese Recipe']
  },
  {
    id: 'matcha-basque',
    name: 'Kyoto Uji Matcha Basque Burnt Cheesecake',
    category: 'cake',
    weight: '1.2 kg',
    serves: '8 - 10 people',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Creamy caramelized Basque cheesecake made with ceremonial grade Uji matcha with an earthy molten center.',
    tags: ['🍵 Ceremonial Matcha', 'Gluten Free Available']
  },
  {
    id: 'hazelnut-ganache',
    name: 'Belgian Dark Chocolate Ganache Torte',
    category: 'cake',
    weight: '1.2 kg',
    serves: '8 - 10 people',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: '70% Valrhona dark chocolate silk layers, roasted hazelnut crunch praline, and gold leaf finish.',
    tags: ['🍫 70% Valrhona', 'Decadent']
  },
  {
    id: 'bakery-party-box',
    name: 'Artisan Pastry Box of 12 Assorted Treats',
    category: 'box',
    weight: '12 Pieces',
    serves: '6 - 12 people',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description: '4 Butter Croissants, 4 Pain au Chocolat, 2 Raspberry Cruffins, and 2 Pistachio Cardamom Escargots.',
    tags: ['🥐 Freshly Baked', 'Pure French Butter']
  },
  {
    id: 'coffee-carafe-station',
    name: 'Deja Brew Traveler Coffee Carafe (Serves 10-12)',
    category: 'carafe',
    weight: '2.5 Liters',
    serves: '10 - 12 cups',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Thermal insulated travel carafe filled with hot single-origin pour-over. Comes with 12 cups, lids, sugar & milk.',
    tags: ['☕ Office & Events', 'Stays Hot 3h']
  }
];

export const CelebrationHubModal: React.FC<CelebrationHubModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useOrder();
  const [selectedItem, setSelectedItem] = useState<CelebrationItem>(CELEBRATION_ITEMS[0]);
  const [pipingMessage, setPipingMessage] = useState('');
  const [pickupDate, setPickupDate] = useState('Tomorrow');
  const [candles, setCandles] = useState('5 Candles');
  const [isEggless, setIsEggless] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    // Customization notes
    const customNotes = [
      `Celebration Pre-order (${pickupDate})`,
      pipingMessage ? `Piping: "${pipingMessage}"` : null,
      candles ? candles : null,
      isEggless ? '100% Eggless' : null,
    ].filter(Boolean).join(' | ');

    addToCart(
      {
        id: `celebration-${selectedItem.id}`,
        name: selectedItem.name,
        tagline: 'Artisan Pre-Order Special',
        category: 'desserts',
        price: selectedItem.price,
        description: `${selectedItem.description} | ${customNotes}`,
        image: selectedItem.image,
        isCustomizable: false,
      },
      {
        milk: 'whole',
        shots: 'single',
        syrup: 'none',
        syrupPumps: 0,
        temp: 'hot',
        sweetness: '100%',
        notes: customNotes,
      },
      1
    );

    playSoundEffect('success');
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FFF9FA] border-2 border-[#F8BBD0] rounded-3xl shadow-2xl p-6 sm:p-8 text-[#2D2020]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white border border-[#F8D7DF] text-[#8C7575] hover:text-[#E84A74] hover:bg-[#FFF0F3] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] border border-[#F8D7DF] rounded-full text-xs font-bold text-[#E84A74]">
            <Cake className="w-3.5 h-3.5" />
            <span>Pre-Order Celebrations & Gatherings</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
            Whole Cakes & Party Catering Hub 🎂
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6767] max-w-lg mx-auto">
            Order fresh 1kg artisan cakes, morning party bakery boxes, and traveler coffee stations for birthdays and office events.
          </p>
        </div>

        {/* Item Selection Carousel / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {CELEBRATION_ITEMS.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  playSoundEffect('click');
                }}
                className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E84A74] bg-[#FFF0F3] shadow-md scale-102'
                    : 'border-[#F8D7DF] bg-white hover:bg-[#FFF8FA]'
                }`}
              >
                <div className="aspect-4/3 rounded-xl overflow-hidden mb-2 border border-[#F8D7DF]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#E84A74] uppercase">{item.weight}</span>
                    <span className="font-mono font-bold text-xs text-[#2D2020]">₹{item.price}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#2D2020] mt-1 line-clamp-2">
                    {item.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Item Detailed Customizer */}
        <div className="bg-white border border-[#F8D7DF] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F8D7DF] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2D2020]">
                {selectedItem.name}
              </h3>
              <p className="text-xs text-[#7A6767]">{selectedItem.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8C7575] block">Pre-Order Price</span>
              <span className="font-mono font-bold text-xl text-[#E84A74]">₹{selectedItem.price}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Custom Plaque Message */}
            {selectedItem.category === 'cake' && (
              <div className="space-y-1.5">
                <label className="font-bold text-[#2D2020] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E84A74]" />
                  <span>Custom Cake Inscription / Piping Note:</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Happy Birthday Alice! 🌸"
                  value={pipingMessage}
                  onChange={(e) => setPipingMessage(e.target.value)}
                  maxLength={35}
                  className="w-full px-3 py-2 bg-[#FFF0F3] border border-[#F8D7DF] rounded-xl text-xs text-[#2D2020] focus:outline-none focus:ring-1 focus:ring-[#E84A74]"
                />
                <span className="text-[10px] text-[#A88C8C]">{pipingMessage.length}/35 characters</span>
              </div>
            )}

            {/* Pickup/Delivery Date */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#2D2020] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E84A74]" />
                <span>Pickup / Delivery Date:</span>
              </label>
              <select
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF0F3] border border-[#F8D7DF] rounded-xl text-xs text-[#2D2020] focus:outline-none"
              >
                <option value="Today (In 2 Hours)">⚡ Today (Ready in 2 Hours)</option>
                <option value="Tomorrow Morning (9:00 AM)">Tomorrow Morning (9:00 AM)</option>
                <option value="Tomorrow Evening (5:00 PM)">Tomorrow Evening (5:00 PM)</option>
                <option value="This Weekend (Saturday)">This Weekend (Saturday)</option>
                <option value="This Weekend (Sunday)">This Weekend (Sunday)</option>
              </select>
            </div>

            {/* Candles or Extras */}
            {selectedItem.category === 'cake' && (
              <div className="space-y-1.5">
                <label className="font-bold text-[#2D2020] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E84A74]" />
                  <span>Candles & Matches:</span>
                </label>
                <select
                  value={candles}
                  onChange={(e) => setCandles(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF0F3] border border-[#F8D7DF] rounded-xl text-xs text-[#2D2020] focus:outline-none"
                >
                  <option value="No Candles">No Candles Needed</option>
                  <option value="5 Pastel Pink Candles">5 Pastel Pink Candles (Free)</option>
                  <option value="10 Pastel Pink Candles">10 Pastel Pink Candles (Free)</option>
                  <option value="Sparkler Birthday Candle">✨ Sparkler Birthday Candle (+₹50)</option>
                </select>
              </div>
            )}

            {/* Dietary Choice */}
            {selectedItem.category === 'cake' && (
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="eggless"
                  checked={isEggless}
                  onChange={(e) => setIsEggless(e.target.checked)}
                  className="w-4 h-4 text-[#E84A74] rounded focus:ring-[#E84A74]"
                />
                <label htmlFor="eggless" className="text-xs font-semibold text-[#5D4A4A] cursor-pointer">
                  Request 100% Eggless Version 🍃
                </label>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOrdered}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#E84A74] to-[#FF8EA8] hover:from-[#D43862] hover:to-[#E84A74] text-white font-bold text-xs shadow-md shadow-[#E84A74]/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              {isOrdered ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart & Pre-Order Staged!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Celebration Item to Order (₹{selectedItem.price})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { CoffeeCategory } from '../../types/coffee';
import { MENU_ITEMS } from '../../data/coffeeData';
import { MenuCard } from '../../components/menu/MenuCard';
import { useOrder } from '../../context/OrderContext';
import { Search, SlidersHorizontal, Sparkles, Coffee } from 'lucide-react';

export default function OrderPage() {
  const { addToCart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: CoffeeCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: MENU_ITEMS.length },
    { id: 'espresso', label: 'Espresso & Classics', count: MENU_ITEMS.filter((i) => i.category === 'espresso').length },
    { id: 'signature-lattes', label: 'Signature Lattes', count: MENU_ITEMS.filter((i) => i.category === 'signature-lattes').length },
    { id: 'cold-brew', label: 'Cold Brew & Nitro', count: MENU_ITEMS.filter((i) => i.category === 'cold-brew').length },
    { id: 'pour-over', label: 'Pour Over & Filter', count: MENU_ITEMS.filter((i) => i.category === 'pour-over').length },
    { id: 'pastries', label: 'Artisan Bakery', count: MENU_ITEMS.filter((i) => i.category === 'pastries').length },
    { id: 'beans', label: 'Whole Bean Bags', count: MENU_ITEMS.filter((i) => i.category === 'beans').length },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.flavorNotes && item.flavorNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#FDFBF7]">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C2623] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C88A58]">
            Click & Sip Ahead
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#FDFBF7] mt-1">
            Artisan Cafe Menu
          </h1>
          <p className="text-xs text-[#A89F91] mt-1">
            Select your favorite roast, customize your milk and syrup pumps, and pick up fresh on the bar.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drinks, notes, beans..."
            className="w-full bg-[#1C1917] border border-[#2E2824] focus:border-[#C88A58] text-[#FDFBF7] text-xs rounded-2xl pl-10 pr-4 py-3 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#965B32] text-white shadow-md shadow-[#965B32]/30'
                : 'bg-[#1C1917] border border-[#2E2824] text-[#A89F91] hover:border-[#3E352F] hover:text-[#FDFBF7]'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === cat.id ? 'bg-[#14110F] text-[#C88A58]' : 'bg-[#2A2421] text-[#A89F91]'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#1C1917] mx-auto flex items-center justify-center text-[#6E645C]">
            <Coffee className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#FDFBF7]">No matching coffee found</h3>
          <p className="text-xs text-[#A89F91]">Try searching for a different flavor note like "vanilla", "lavender", or clear the filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#C88A58] font-bold underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

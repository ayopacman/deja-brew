'use client';

import React, { useState } from 'react';
import { CoffeeCategory } from '../../types/coffee';
import { MENU_ITEMS } from '../../data/coffeeData';
import { MenuCard } from '../../components/menu/MenuCard';
import { useOrder } from '../../context/OrderContext';
import { Search, Cake, Sparkles } from 'lucide-react';

export default function OrderPage() {
  const { addToCart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: CoffeeCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Treats & Coffee', count: MENU_ITEMS.length },
    { id: 'pastries', label: 'Cakes & Cupcakes', count: MENU_ITEMS.filter((i) => i.category === 'pastries').length },
    { id: 'signature-lattes', label: 'Signature Lattes', count: MENU_ITEMS.filter((i) => i.category === 'signature-lattes').length },
    { id: 'espresso', label: 'Artisan Espresso', count: MENU_ITEMS.filter((i) => i.category === 'espresso').length },
    { id: 'cold-brew', label: 'Cold Brew & Nitro', count: MENU_ITEMS.filter((i) => i.category === 'cold-brew').length },
    { id: 'pour-over', label: 'Pour Over Filter', count: MENU_ITEMS.filter((i) => i.category === 'pour-over').length },
    { id: 'beans', label: 'Specialty Beans', count: MENU_ITEMS.filter((i) => i.category === 'beans').length },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.flavorNotes && item.flavorNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2D2020]">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74]">
            SweetCrumbs Order Ahead
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#2D2020] mt-1">
            Artisan Cakes, Treats & Coffee
          </h1>
          <p className="text-xs text-[#7A6767] mt-1">
            Order your favorite birthday cakes, fruit slices, and hand-pulled espresso drinks ahead for pickup.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C7575] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cakes, lattes, flavors..."
            className="w-full bg-white border border-[#F8D7DF] focus:border-[#E84A74] text-[#2D2020] text-xs rounded-2xl pl-10 pr-4 py-3 focus:outline-none transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#E84A74] text-white shadow-sm'
                : 'bg-white border border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF0F3]'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === cat.id ? 'bg-white text-[#E84A74]' : 'bg-[#FDE8ED] text-[#8C7575]'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] mx-auto flex items-center justify-center text-[#E84A74]">
            <Cake className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#2D2020]">No matching items found</h3>
          <p className="text-xs text-[#8C7575]">Try clearing search or checking another category.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#E84A74] font-bold underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

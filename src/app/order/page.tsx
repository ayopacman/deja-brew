'use client';

import React, { useState } from 'react';
import { CoffeeCategory } from '../../types/coffee';
import { MENU_ITEMS, RECOMMENDED_PAIRINGS } from '../../data/coffeeData';
import { MenuCard } from '../../components/menu/MenuCard';
import { BookletMenuView } from '../../components/menu/BookletMenuView';
import { CustomizationModal } from '../../components/menu/CustomizationModal';
import { useOrder } from '../../context/OrderContext';
import { Search, BookOpen, Layers, Sparkles, Filter, X } from 'lucide-react';
import { MenuItem } from '../../types/coffee';

type DietaryFilter = 'all' | 'special' | 'vegan' | 'gluten-free' | 'low-cal';

export default function OrderPage() {
  const { addToCart, addPairingToCart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory | 'all'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'booklet' | 'grid'>('booklet');
  const [selectedCustomItem, setSelectedCustomItem] = useState<MenuItem | null>(null);

  const categories: { id: CoffeeCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: MENU_ITEMS.length },
    { id: 'espresso', label: 'Espresso Classics', count: MENU_ITEMS.filter((i) => i.category === 'espresso').length },
    { id: 'milk-based', label: 'Milk-Based & Lattes', count: MENU_ITEMS.filter((i) => i.category === 'milk-based').length },
    { id: 'brewed', label: 'Brewed & Filter', count: MENU_ITEMS.filter((i) => i.category === 'brewed').length },
    { id: 'iced', label: 'Iced & Cold Brew', count: MENU_ITEMS.filter((i) => i.category === 'iced').length },
    { id: 'hybrids', label: 'Affogato Hybrids', count: MENU_ITEMS.filter((i) => i.category === 'hybrids').length },
    { id: 'snacks', label: 'Artisanal Snacks', count: MENU_ITEMS.filter((i) => i.category === 'snacks').length },
    { id: 'desserts', label: 'Desserts', count: MENU_ITEMS.filter((i) => i.category === 'desserts').length },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.flavorNotes && item.flavorNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));
    
    let matchesDietary = true;
    if (dietaryFilter === 'special') {
      matchesDietary = !!item.isHouseSpecial || !!item.isPopular;
    } else if (dietaryFilter === 'vegan') {
      matchesDietary = !!item.dietary?.includes('Vegan');
    } else if (dietaryFilter === 'gluten-free') {
      matchesDietary = !!item.dietary?.includes('Gluten-Free');
    } else if (dietaryFilter === 'low-cal') {
      matchesDietary = (item.calories || 0) <= 150 && (item.calories || 0) > 0;
    }

    return matchesCategory && matchesSearch && matchesDietary;
  });

  const handleSelectItem = (item: MenuItem) => {
    setSelectedCustomItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2D2020]">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            DEJA BREW ARTISAN COFFEE & PATISSERIE
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#2D2020] mt-1">
            Deja Brew Menu
          </h1>
          <p className="text-xs text-[#7A6767] mt-1">
            Customize milk selections, calibrate espresso shots, flavor syrups, and order for express counter pickup.
          </p>
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#8C7575] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drinks, snacks, notes..."
              className="w-full bg-white border border-[#F8D7DF] focus:border-[#E84A74] text-[#2D2020] text-xs rounded-2xl pl-10 pr-8 py-3 focus:outline-none transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#FFF0F3] p-1 rounded-2xl border border-[#F8D7DF]">
            <button
              onClick={() => setViewMode('booklet')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'booklet' ? 'bg-[#E84A74] text-white shadow-xs' : 'text-[#5D4A4A] hover:bg-[#FFE3EB]'
              }`}
              title="Storybook Booklet View"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Booklet</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-[#E84A74] text-white shadow-xs' : 'text-[#5D4A4A] hover:bg-[#FFE3EB]'
              }`}
              title="Card Grid View"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Dietary Quick Filters */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (viewMode === 'booklet' && cat.id !== 'all') {
                  setViewMode('grid');
                }
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
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

        {/* Dietary / Preference Sub-filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-[#8C6D6D] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-[#E84A74]" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Diets' },
            { id: 'special', label: '⭐ House Specials' },
            { id: 'vegan', label: '🌱 100% Vegan' },
            { id: 'gluten-free', label: '🌾 Gluten-Free' },
            { id: 'low-cal', label: '🔥 Under 150 kcal' },
          ].map((df) => (
            <button
              key={df.id}
              onClick={() => {
                setDietaryFilter(df.id as DietaryFilter);
                if (viewMode === 'booklet' && df.id !== 'all') {
                  setViewMode('grid');
                }
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                dietaryFilter === df.id
                  ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] font-bold'
                  : 'bg-white border border-[#F8D7DF] text-[#7A6767] hover:bg-[#FFF9F9]'
              }`}
            >
              {df.label}
            </button>
          ))}

          {(dietaryFilter !== 'all' || selectedCategory !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setDietaryFilter('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-[10px] text-[#E84A74] font-bold underline px-2 shrink-0 hover:text-[#C72E56]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count when filtered */}
      {(selectedCategory !== 'all' || dietaryFilter !== 'all' || searchQuery !== '') && (
        <div className="text-xs text-[#8C6D6D] font-medium">
          Showing <span className="font-bold text-[#E84A74]">{filteredItems.length}</span> items
        </div>
      )}

      {/* Content View */}
      {viewMode === 'booklet' && selectedCategory === 'all' && dietaryFilter === 'all' && searchQuery === '' ? (
        <BookletMenuView
          onSelectItem={handleSelectItem}
          onSelectPairing={(drink, snack) => addPairingToCart(drink, snack)}
        />
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

      {/* Customization Modal */}
      {selectedCustomItem && (
        <CustomizationModal
          item={selectedCustomItem}
          isOpen={!!selectedCustomItem}
          onClose={() => setSelectedCustomItem(null)}
          onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
        />
      )}

    </div>
  );
}

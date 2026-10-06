'use client';

import React, { useState } from 'react';
import { CoffeeCategory } from '../../types/coffee';
import { MENU_ITEMS, RECOMMENDED_PAIRINGS } from '../../data/coffeeData';
import { MenuCard } from '../../components/menu/MenuCard';
import { BookletMenuView } from '../../components/menu/BookletMenuView';
import { CustomizationModal } from '../../components/menu/CustomizationModal';
import { useOrder } from '../../context/OrderContext';
import { Search, Coffee, BookOpen, Layers } from 'lucide-react';
import { MenuItem } from '../../types/coffee';

export default function OrderPage() {
  const { addToCart, addPairingToCart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory | 'all'>('all');
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
    return matchesCategory && matchesSearch;
  });

  const handleSelectItem = (item: MenuItem) => {
    if (item.isCustomizable) {
      setSelectedCustomItem(item);
    } else {
      addToCart(
        item,
        item.defaultCustomization || {
          milk: 'none',
          shots: 'single',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%',
        },
        1
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2D2020]">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74]">
            deja brew • Order Ahead
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#2D2020] mt-1">
            The Daily Grind Menu
          </h1>
          <p className="text-xs text-[#7A6767] mt-1">
            Customize your milk, shot calibrations, syrup pumps, and pick up fresh at the bar.
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
              placeholder="Search drinks, snacks..."
              className="w-full bg-white border border-[#F8D7DF] focus:border-[#E84A74] text-[#2D2020] text-xs rounded-2xl pl-10 pr-4 py-3 focus:outline-none transition-colors shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#FFF0F3] p-1 rounded-xl border border-[#F8D7DF]">
            <button
              onClick={() => setViewMode('booklet')}
              className={`p-2 rounded-lg text-xs font-bold ${
                viewMode === 'booklet' ? 'bg-[#E84A74] text-white shadow-xs' : 'text-[#5D4A4A]'
              }`}
              title="Storybook Booklet View"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold ${
                viewMode === 'grid' ? 'bg-[#E84A74] text-white shadow-xs' : 'text-[#5D4A4A]'
              }`}
              title="Card Grid View"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              if (viewMode === 'booklet' && cat.id !== 'all') {
                setViewMode('grid');
              }
            }}
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

      {/* Content View */}
      {viewMode === 'booklet' && selectedCategory === 'all' && searchQuery === '' ? (
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

'use client';

import React from 'react';
import { MENU_ITEMS, RECOMMENDED_PAIRINGS } from '../../data/coffeeData';
import { MenuItem } from '../../types/coffee';
import { Plus, Sparkles, MapPin } from 'lucide-react';

interface BookletMenuViewProps {
  onSelectItem: (item: MenuItem) => void;
  onSelectPairing: (drinkItem: MenuItem, snackItem: MenuItem) => void;
}

export const BookletMenuView: React.FC<BookletMenuViewProps> = ({
  onSelectItem,
  onSelectPairing,
}) => {
  const espressoItems = MENU_ITEMS.filter((i) => i.subcategory === 'Espresso & Concentrated Classics');
  const milkItems = MENU_ITEMS.filter((i) => i.subcategory === 'Milk-Based & Velvety');
  const brewedItems = MENU_ITEMS.filter((i) => i.subcategory === 'Brewed & Filter Coffees');
  const icedItems = MENU_ITEMS.filter((i) => i.subcategory === 'Iced & Cold Refreshments');
  const hybridItems = MENU_ITEMS.filter((i) => i.subcategory === 'Coffee-Dessert Hybrids');
  const snackItems = MENU_ITEMS.filter((i) => i.subcategory === 'Artisanal Snacks');
  const dessertItems = MENU_ITEMS.filter((i) => i.subcategory === 'Desserts Menu');

  const renderSection = (title: string, items: MenuItem[], emoji: string = '🌸') => (
    <div className="space-y-3.5">
      {/* Ribbon Header (as in uploaded reference image) */}
      <div className="flex items-center justify-center my-3">
        <div className="relative bg-[#FFD3DD] border border-[#F4A7B9] text-[#9E334D] px-5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-xs">
          <span>{emoji}</span>
          <span>{title}</span>
          <span>{emoji}</span>
        </div>
      </div>

      {/* Items list with dotted leader line */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="group flex items-start sm:items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#FFF0F3] transition-all cursor-pointer border border-transparent hover:border-[#F8D7DF]"
          >
            {/* Left circular item avatar */}
            <div className="w-12 h-12 rounded-full p-0.5 bg-[#FDE8ED] border-2 border-[#F4A7B9] shrink-0 overflow-hidden group-hover:scale-105 transition-transform shadow-xs">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Middle Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <h4 className="font-bold text-xs sm:text-sm text-[#4A2828] group-hover:text-[#E84A74] transition-colors truncate">
                    {item.name}
                  </h4>
                  {item.isHouseSpecial && (
                    <Sparkles className="w-3 h-3 text-[#E84A74] shrink-0 fill-[#E84A74]/30" />
                  )}
                </div>
                
                {/* Dotted line connector */}
                <div className="flex-1 mx-2 border-b-2 border-dotted border-[#F4A7B9]/60 hidden sm:block" />

                {/* Price */}
                <span className="font-mono font-bold text-xs sm:text-sm text-[#D8315B] shrink-0">
                  ₹{item.price}
                </span>
              </div>

              {/* Tagline / Notes */}
              <p className="text-[11px] text-[#8C6D6D] line-clamp-1 mt-0.5">
                {item.tagline || item.description}
              </p>

              {/* Extra badges */}
              <div className="flex items-center gap-2 mt-1">
                {item.intensity && (
                  <div className="flex gap-0.5 items-center">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-1.5 h-1.5 rounded-full ${
                          lvl <= (item.intensity || 0) ? 'bg-[#E84A74]' : 'bg-[#F8D7DF]'
                        }`}
                      />
                    ))}
                  </div>
                )}
                {item.dietary && item.dietary.length > 0 && (
                  <div className="flex gap-1">
                    {item.dietary.map((d) => (
                      <span key={d} className="text-[8px] bg-[#FFF0F3] text-[#9E334D] px-1 py-0.2 rounded border border-[#F8D7DF]">
                        {d === 'Vegan' ? '🌱 Vegan' : d === 'Gluten-Free' ? '🌾 GF' : d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item);
              }}
              className="w-7 h-7 rounded-full bg-[#E84A74] hover:bg-[#D43862] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-110 active:scale-95"
              title="Customize & Add"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Booklet Container with Kawaii Frame */}
      <div className="bg-white border-4 border-[#F8D7DF] rounded-[32px] p-4 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Soft Gingham top and bottom border accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#FFD3DD] via-[#FFF0F3] to-[#FFD3DD]" />
        
        {/* Booklet Header Title */}
        <div className="text-center pb-6 border-b-2 border-dashed border-[#F8D7DF] space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E84A74] tracking-widest uppercase">
            <span>☕</span>
            <span>DEJA BREW SPECIALTY COFFEE & BAKERY</span>
            <span>☕</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#3D2020] tracking-tight">
            Deja Brew — Menu & Pairings
          </h2>
          <p className="text-xs text-[#8C6D6D] max-w-lg mx-auto">
            Welcome to our specialty craft menu. Freshly pulled double shots, handcrafted desserts, and curated barista pairings.
          </p>
        </div>

        {/* 2-Column Menu Layout (matching booklet reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-6">
          
          {/* Left Column: Coffee Specialties */}
          <div className="space-y-7">
            {renderSection('Espresso & Concentrated Classics', espressoItems, '☕')}
            {renderSection('Milk-Based & Velvety', milkItems, '🥛')}
            {renderSection('Brewed & Filter Coffees', brewedItems, '🫖')}
            {renderSection('Iced & Cold Refreshments', icedItems, '🧊')}
            {renderSection('Coffee-Dessert Hybrids', hybridItems, '🍨')}
          </div>

          {/* Right Column: Bakery, Desserts & Pairings */}
          <div className="space-y-7">
            {renderSection('Artisanal Snacks', snackItems, '🥐')}
            {renderSection('Decadent Desserts', dessertItems, '🍰')}

            {/* Recommended Pairings Section */}
            <div className="space-y-4 pt-4 border-t-2 border-dashed border-[#F8D7DF]">
              <div className="flex items-center justify-center my-3">
                <div className="bg-[#E84A74] text-white px-6 py-1.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-md">
                  <span>💡</span>
                  <span>RECOMMENDED PAIRINGS</span>
                  <span>💡</span>
                </div>
              </div>

              <div className="space-y-3">
                {RECOMMENDED_PAIRINGS.map((pair) => {
                  const drink = MENU_ITEMS.find((m) => m.id === pair.drinkId) || MENU_ITEMS[0];
                  const snack = MENU_ITEMS.find((m) => m.id === pair.snackId) || MENU_ITEMS[20];

                  return (
                    <div
                      key={pair.id}
                      className="p-3.5 bg-[#FFF9F9] border border-[#F8D7DF] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#E84A74] transition-all shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#3D2020]">
                          <span className="text-[#E84A74]">{pair.drinkName}</span>
                          <span className="text-[#8C6D6D]">+</span>
                          <span className="text-[#3D2020]">{pair.snackName}</span>
                        </div>
                        <p className="text-[10px] text-[#8C6D6D] leading-relaxed">
                          {pair.reason}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="font-bold text-xs text-[#D8315B]">
                            ₹{pair.comboPrice}
                          </span>
                          <span className="text-[9px] text-emerald-600 block font-bold">
                            Save ₹{pair.savings}
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectPairing(drink, snack)}
                          className="bg-[#E84A74] hover:bg-[#D43862] text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xs transition-transform hover:scale-105"
                        >
                          Add Pairing
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-[#F8D7DF] text-center text-xs text-[#8C6D6D] space-y-1">
          <p className="font-semibold text-[#6E4E4E]">
            Ask your barista about our rotating single-origin bean selections and house-made alternative milk options (Oat, Almond, Coconut).
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-[#A67580] pt-1">
            <span>🌱 100% Plant Milk Alternatives Available</span>
            <span>•</span>
            <span>⭐ Freshly Roasted Weekly</span>
            <span>•</span>
            <span>🌾 Gluten-Free Kitchen Options</span>
          </div>
        </div>

      </div>

    </div>
  );
};


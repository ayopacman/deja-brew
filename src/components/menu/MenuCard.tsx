'use client';

import React, { useState } from 'react';
import { MenuItem, CustomizationOptions } from '../../types/coffee';
import { Plus, Flame, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CustomizationModal } from './CustomizationModal';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, customization: CustomizationOptions, quantity: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickAdd = () => {
    if (item.isCustomizable) {
      setIsModalOpen(true);
    } else {
      onAddToCart(
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
    <>
      <div className="group flex flex-col bg-[#1C1917] border border-[#2C2623] hover:border-[#C88A58]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#965B32]/10 hover:-translate-y-1 text-[#FDFBF7]">
        {/* Card Image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#14110F]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.isPopular && (
              <span className="bg-[#965B32] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                Popular
              </span>
            )}
            {item.isSeasonal && (
              <span className="bg-[#C88A58] text-[#14110F] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Seasonal
              </span>
            )}
          </div>

          {item.roastLevel && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-[#C9C1B5] text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
              {item.roastLevel} Roast
            </div>
          )}

          <div className="absolute bottom-2 right-3 font-serif font-bold text-lg text-[#C88A58] bg-[#14110F]/80 px-2 py-0.5 rounded-lg backdrop-blur-sm">
            ${item.price.toFixed(2)}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#FDFBF7] group-hover:text-[#C88A58] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-[#A89F91] mt-1 line-clamp-2">
              {item.tagline || item.description}
            </p>

            {/* Flavor Badges */}
            {item.flavorNotes && item.flavorNotes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {item.flavorNotes.slice(0, 3).map((note, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#2A2421] text-[#C9C1B5] px-2 py-0.5 rounded-md border border-[#3E352F]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-2 border-t border-[#2C2623] flex items-center justify-between gap-2">
            {item.isCustomizable ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#2A2421] hover:bg-[#965B32] text-[#C88A58] hover:text-white text-xs font-semibold py-2 px-3 rounded-xl border border-[#3E352F] hover:border-[#965B32] transition-all flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize & Add</span>
              </button>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="w-full bg-[#965B32] hover:bg-[#C88A58] text-white hover:text-[#14110F] text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {isModalOpen && (
        <CustomizationModal
          item={item}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

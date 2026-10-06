'use client';

import React, { useState } from 'react';
import { MenuItem, CustomizationOptions } from '../../types/coffee';
import { ShoppingCart, Star, SlidersHorizontal, Sparkles } from 'lucide-react';
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
      <div className="group flex flex-col bg-white border border-[#F8D7DF] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#E84A74]/10 hover:-translate-y-1 text-[#2D2020]">
        
        {/* Card Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#FFF0F3] p-2 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />

          {item.subcategory && (
            <span className="absolute top-3 left-3 bg-[#E84A74] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {item.subcategory.split('&')[0]}
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#2D2020] group-hover:text-[#E84A74] transition-colors line-clamp-1">
              {item.name}
            </h3>

            <p className="text-[11px] text-[#8C7575] mt-1 line-clamp-2">
              {item.tagline || item.description}
            </p>

            {/* Price */}
            <div className="font-mono font-bold text-sm text-[#D8315B] mt-2">
              ₹{item.price}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {item.isCustomizable ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize & Order</span>
              </button>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02]"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>

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

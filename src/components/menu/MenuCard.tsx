'use client';

import React, { useState } from 'react';
import { MenuItem, CustomizationOptions } from '../../types/coffee';
import { ShoppingCart, SlidersHorizontal, Sparkles, Flame, MapPin, Ban } from 'lucide-react';
import { CustomizationModal } from './CustomizationModal';
import { useOrder } from '../../context/OrderContext';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, customization: CustomizationOptions, quantity: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { soldOutItemIds } = useOrder();
  const isSoldOut = soldOutItemIds?.includes(item.id);

  return (
    <>
      <div 
        onClick={() => !isSoldOut && setIsModalOpen(true)}
        className={`group flex flex-col bg-white border border-[#F8D7DF] rounded-3xl overflow-hidden transition-all duration-300 text-[#2D2020] relative ${
          isSoldOut
            ? 'opacity-70 grayscale-[30%] cursor-not-allowed'
            : 'hover:shadow-xl hover:shadow-[#E84A74]/15 hover:-translate-y-1.5 cursor-pointer'
        }`}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
          {isSoldOut ? (
            <span className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Ban className="w-2.5 h-2.5" />
              Sold Out for Today
            </span>
          ) : (
            <>
              {item.isHouseSpecial && (
                <span className="bg-[#E84A74] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Special
                </span>
              )}
              {item.isPopular && !item.isHouseSpecial && (
                <span className="bg-[#D8315B] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                  Popular
                </span>
              )}
              {item.roastType && (
                <span className="bg-[#FFF0F3] border border-[#F8D7DF] text-[#7A404F] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {item.roastType}
                </span>
              )}
            </>
          )}
        </div>

        {/* Card Image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#FFF0F3] p-2 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          />
          {item.calories && (
            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              {item.calories} kcal
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            
            {/* Intensity & Dietary Row */}
            <div className="flex items-center justify-between gap-2 text-[10px]">
              {item.intensity ? (
                <div className="flex items-center gap-1 text-[#8C6D6D]" title={`Intensity: ${item.intensity}/5`}>
                  <span className="font-semibold text-[9px] text-[#A67580] uppercase tracking-wider">Strength:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full ${
                          level <= (item.intensity || 0) ? 'bg-[#E84A74]' : 'bg-[#F4D2DA]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : <div />}

              {item.dietary && item.dietary.length > 0 && (
                <div className="flex items-center gap-1 overflow-hidden">
                  {item.dietary.slice(0, 2).map((diet) => (
                    <span
                      key={diet}
                      className="text-[9px] font-semibold bg-[#FFF0F3] text-[#A43854] border border-[#F8D7DF] px-1.5 py-0.2 rounded-md whitespace-nowrap"
                    >
                      {diet === 'Vegan' ? '🌱 Vegan' : diet === 'Gluten-Free' ? '🌾 GF' : diet}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Origin */}
            <div>
              <h3 className="font-serif font-bold text-sm text-[#2D2020] group-hover:text-[#E84A74] transition-colors line-clamp-1">
                {item.name}
              </h3>
              {item.originEstate && (
                <p className="text-[10px] text-[#A47C85] flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-[#E84A74]" />
                  <span className="truncate">{item.originEstate}</span>
                </p>
              )}
            </div>

            {/* Tagline / Description */}
            <p className="text-[11px] text-[#7A6767] line-clamp-2 leading-relaxed">
              {item.tagline || item.description}
            </p>

            {/* Flavor Notes Micro-tags */}
            {item.flavorNotes && item.flavorNotes.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {item.flavorNotes.slice(0, 3).map((note) => (
                  <span
                    key={note}
                    className="text-[9px] font-medium bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A5A62] px-1.5 py-0.5 rounded-md"
                  >
                    • {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price & Action Button */}
          <div className="pt-3 border-t border-[#F8D7DF] flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#A67580] uppercase tracking-wider">Price</span>
              <span className="font-mono font-bold text-base text-[#D8315B]">
                ₹{item.price}
              </span>
            </div>

            <button
              disabled={isSoldOut}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSoldOut) setIsModalOpen(true);
              }}
              className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                isSoldOut
                  ? 'bg-rose-100 text-rose-700 cursor-not-allowed border border-rose-300'
                  : 'bg-[#E84A74] hover:bg-[#D43862] text-white hover:scale-[1.03] active:scale-[0.98]'
              }`}
            >
              {isSoldOut ? (
                <>
                  <Ban className="w-3.5 h-3.5" />
                  <span>Sold Out</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Details & Order</span>
                </>
              )}
            </button>
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


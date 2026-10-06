'use client';

import React, { useState } from 'react';
import { MenuItem, CustomizationOptions, MilkOption, ShotOption, SyrupOption, TempOption, SweetnessOption } from '../../types/coffee';
import { X, Flame, Snowflake, Plus, Minus, Coffee, Sparkles } from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';

interface CustomizationModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customization: CustomizationOptions, quantity: number) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [milk, setMilk] = useState<MilkOption>(item.defaultCustomization?.milk || 'whole');
  const [shots, setShots] = useState<ShotOption>(item.defaultCustomization?.shots || 'double');
  const [syrup, setSyrup] = useState<SyrupOption>(item.defaultCustomization?.syrup || 'none');
  const [syrupPumps, setSyrupPumps] = useState<number>(item.defaultCustomization?.syrupPumps || 0);
  const [temp, setTemp] = useState<TempOption>(item.defaultCustomization?.temp || 'hot');
  const [sweetness, setSweetness] = useState<SweetnessOption>(item.defaultCustomization?.sweetness || '0%');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  let extraCost = 0;
  if (milk === 'oat' || milk === 'almond' || milk === 'coconut') extraCost += 50;
  if (shots === 'triple') extraCost += 60;
  if (syrup !== 'none' && syrupPumps > 0) extraCost += 40;

  const unitPrice = item.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    playSoundEffect('success');
    onAddToCart(
      item,
      {
        milk,
        shots,
        syrup,
        syrupPumps: syrup === 'none' ? 0 : syrupPumps,
        temp,
        sweetness,
        notes: notes.trim() ? notes.trim() : undefined,
      },
      quantity
    );
    onClose();
  };

  const isCoffee = item.category === 'espresso' || item.category === 'milk-based' || item.category === 'brewed' || item.category === 'iced';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-[#F8D7DF] rounded-3xl overflow-hidden shadow-2xl text-[#2D2020]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-40 bg-[#FFF0F3] shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#5D4A4A] flex items-center justify-center shadow-xs transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-5 right-5">
            <h2 className="text-lg font-serif font-bold text-[#2D2020]">{item.name}</h2>
            <p className="text-xs text-[#E84A74] font-bold">₹{item.price} base</p>
          </div>
        </div>

        {/* Customization Details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          {isCoffee && (
            <>
              {/* Temperature */}
              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Temperature
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTemp('hot')}
                    className={`py-2 px-3 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${
                      temp === 'hot'
                        ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-[#E84A74]" />
                    <span>Hot & Steamed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemp('iced')}
                    className={`py-2 px-3 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${
                      temp === 'iced'
                        ? 'bg-[#EBF7FF] border-[#38BDF8] text-[#0284C7] font-bold'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
                    }`}
                  >
                    <Snowflake className="w-4 h-4 text-[#0284C7]" />
                    <span>Over Crystal Ice</span>
                  </button>
                </div>
              </div>

              {/* Milk Option */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider">
                    Milk Option
                  </label>
                  <span className="text-[10px] text-[#E84A74] font-bold">Plant-based +₹50</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whole', label: 'Whole Milk' },
                    { id: 'oat', label: 'Oat Milk', extra: '+₹50' },
                    { id: 'almond', label: 'Almond Milk', extra: '+₹50' },
                    { id: 'coconut', label: 'Coconut Milk', extra: '+₹50' },
                    { id: 'none', label: 'Black (No Milk)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMilk(m.id as MilkOption)}
                      className={`p-2 rounded-xl text-center border text-xs font-medium transition-all ${
                        milk === m.id
                          ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                          : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
                      }`}
                    >
                      <div>{m.label}</div>
                      {m.extra && <div className="text-[9px] text-[#E84A74]">{m.extra}</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Espresso Shots */}
              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Espresso Shot Calibration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'single', label: 'Single Shot' },
                    { id: 'double', label: 'Double Shot' },
                    { id: 'triple', label: 'Triple Shot (+₹60)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShots(s.id as ShotOption)}
                      className={`p-2 rounded-xl text-center border text-xs font-medium transition-all ${
                        shots === s.id
                          ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                          : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sweetness */}
          <div>
            <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
              Sweetness Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['0%', '25%', '50%', '100%'] as SweetnessOption[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSweetness(level)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    sweetness === level
                      ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                      : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Barista Notes */}
          <div>
            <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-1.5">
              Special Instructions for Barista
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., extra hot, light foam, less ice..."
              className="w-full bg-[#FFF8F8] border border-[#F8D7DF] text-[#2D2020] text-xs rounded-xl p-3 focus:outline-none focus:border-[#E84A74]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF0F3] border-t border-[#F8D7DF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#F8D7DF]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] flex items-center justify-center font-bold"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold w-5 text-center text-[#2D2020]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] flex items-center justify-center font-bold"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between shadow-md shadow-[#E84A74]/20 transition-all hover:scale-[1.01]"
          >
            <span>Add to Order</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

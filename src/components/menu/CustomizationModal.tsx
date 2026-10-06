'use client';

import React, { useState } from 'react';
import { MenuItem, CustomizationOptions, MilkOption, ShotOption, SyrupOption, TempOption, SweetnessOption } from '../../types/coffee';
import { X, Flame, Snowflake, Plus, Minus, Check, Sparkles } from 'lucide-react';
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

  // Pricing calculation
  let extraCost = 0;
  if (milk === 'oat' || milk === 'almond' || milk === 'coconut') extraCost += 0.75;
  if (shots === 'triple') extraCost += 1.00;
  if (syrup !== 'none' && syrupPumps > 0) extraCost += 0.50;

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

  const milkOptions: { value: MilkOption; label: string; extra?: string }[] = [
    { value: 'whole', label: 'Whole Milk' },
    { value: 'oat', label: 'Oat Milk (Minor Figures)', extra: '+$0.75' },
    { value: 'almond', label: 'Almond Milk', extra: '+$0.75' },
    { value: 'coconut', label: 'Organic Coconut', extra: '+$0.75' },
    { value: 'skim', label: 'Skim Milk' },
    { value: 'none', label: 'No Milk (Black)' },
  ];

  const shotOptions: { value: ShotOption; label: string; extra?: string }[] = [
    { value: 'single', label: 'Single Shot (18g)' },
    { value: 'double', label: 'Double Shot (Standard)' },
    { value: 'triple', label: 'Triple Shot', extra: '+$1.00' },
    { value: 'decaf', label: 'Swiss Water Decaf' },
  ];

  const syrupOptions: { value: SyrupOption; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'vanilla', label: 'Madagascar Vanilla Bean' },
    { value: 'caramel', label: 'House Salted Caramel' },
    { value: 'hazelnut', label: 'Toasted Hazelnut' },
    { value: 'lavender', label: 'Wild French Lavender' },
    { value: 'cardamom-cinnamon', label: 'Cardamom & Cinnamon' },
    { value: 'sugar-free-vanilla', label: 'Zero-Sugar Vanilla' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#1A1715] border border-[#3E352F] rounded-3xl overflow-hidden shadow-2xl text-[#FDFBF7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image preview banner */}
        <div className="relative h-44 bg-[#14110F] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715] via-transparent to-black/40" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-5 right-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C88A58] bg-[#965B32]/30 px-2.5 py-0.5 rounded-full border border-[#C88A58]/30">
                {item.category.replace('-', ' ')}
              </span>
              {item.roastLevel && (
                <span className="text-[11px] text-[#A89F91] bg-black/40 px-2 py-0.5 rounded-full">
                  {item.roastLevel} Roast
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold font-serif text-[#FDFBF7] mt-1">{item.name}</h2>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          
          {/* Temperature Choice (Hot / Iced) */}
          <div>
            <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block mb-2">
              Temperature
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTemp('hot')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium border transition-all ${
                  temp === 'hot'
                    ? 'bg-[#965B32] text-white border-[#C88A58]'
                    : 'bg-[#24201D] text-[#C9C1B5] border-[#3E352F] hover:border-[#6B5E55]'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Hot</span>
              </button>
              <button
                type="button"
                onClick={() => setTemp('iced')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium border transition-all ${
                  temp === 'iced'
                    ? 'bg-[#2A4858] text-white border-[#58A5C8]'
                    : 'bg-[#24201D] text-[#C9C1B5] border-[#3E352F] hover:border-[#6B5E55]'
                }`}
              >
                <Snowflake className="w-4 h-4 text-sky-400" />
                <span>Over Clear Ice</span>
              </button>
            </div>
          </div>

          {/* Milk Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
                Milk Choice
              </label>
              <span className="text-xs text-[#C88A58]">Plant-based +$0.75</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {milkOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMilk(opt.value)}
                  className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                    milk === opt.value
                      ? 'bg-[#965B32]/30 border-[#C88A58] text-white'
                      : 'bg-[#24201D] border-[#3E352F] text-[#C9C1B5] hover:border-[#554942]'
                  }`}
                >
                  <span className="text-xs font-medium">{opt.label}</span>
                  {opt.extra && (
                    <span className="text-[10px] text-[#C88A58] font-bold">{opt.extra}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Espresso Shots */}
          <div>
            <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block mb-2">
              Espresso Shots
            </label>
            <div className="grid grid-cols-2 gap-2">
              {shotOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setShots(opt.value)}
                  className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                    shots === opt.value
                      ? 'bg-[#965B32]/30 border-[#C88A58] text-white'
                      : 'bg-[#24201D] border-[#3E352F] text-[#C9C1B5] hover:border-[#554942]'
                  }`}
                >
                  <span className="text-xs font-medium">{opt.label}</span>
                  {opt.extra && (
                    <span className="text-[10px] text-[#C88A58] font-bold">{opt.extra}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Artisan Syrups */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
                Artisan Syrups
              </label>
              {syrup !== 'none' && (
                <span className="text-xs text-[#C88A58]">+$0.50</span>
              )}
            </div>
            <select
              value={syrup}
              onChange={(e) => {
                const val = e.target.value as SyrupOption;
                setSyrup(val);
                if (val !== 'none' && syrupPumps === 0) setSyrupPumps(2);
              }}
              className="w-full bg-[#24201D] border border-[#3E352F] text-[#FDFBF7] text-xs rounded-xl p-3 focus:outline-none focus:border-[#C88A58]"
            >
              {syrupOptions.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#1C1917]">
                  {s.label}
                </option>
              ))}
            </select>

            {syrup !== 'none' && (
              <div className="mt-3 flex items-center justify-between bg-[#24201D] p-3 rounded-xl border border-[#3E352F]">
                <span className="text-xs text-[#C9C1B5]">Syrup Pumps: <b className="text-[#C88A58]">{syrupPumps}</b></span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSyrupPumps(Math.max(1, syrupPumps - 1))}
                    className="w-7 h-7 rounded-lg bg-[#3E352F] hover:bg-[#554942] flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{syrupPumps}</span>
                  <button
                    type="button"
                    onClick={() => setSyrupPumps(Math.min(6, syrupPumps + 1))}
                    className="w-7 h-7 rounded-lg bg-[#3E352F] hover:bg-[#554942] flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sweetness Level */}
          <div>
            <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block mb-2">
              Sweetness Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['0%', '25%', '50%', '100%'] as SweetnessOption[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSweetness(level)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                    sweetness === level
                      ? 'bg-[#965B32] text-white border-[#C88A58]'
                      : 'bg-[#24201D] border-[#3E352F] text-[#C9C1B5] hover:border-[#554942]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Barista Special Notes */}
          <div>
            <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block mb-2">
              Special Instructions for Barista
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., extra hot, light ice, pour in travel mug..."
              maxLength={100}
              className="w-full bg-[#24201D] border border-[#3E352F] text-[#FDFBF7] text-xs rounded-xl p-3 focus:outline-none focus:border-[#C88A58] placeholder-[#6E645C]"
            />
          </div>

        </div>

        {/* Footer with Quantity & Add to Cart button */}
        <div className="p-4 bg-[#14110F] border-t border-[#3E352F] flex items-center justify-between gap-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-[#24201D] p-1.5 rounded-xl border border-[#3E352F]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-[#3E352F] hover:bg-[#554942] flex items-center justify-center text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold w-6 text-center text-[#FDFBF7]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#3E352F] hover:bg-[#554942] flex items-center justify-center text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-gradient-to-r from-[#C88A58] to-[#965B32] hover:from-[#DB9C69] hover:to-[#A8693A] text-[#14110F] font-bold text-sm py-3 px-5 rounded-xl flex items-center justify-between shadow-lg shadow-[#965B32]/30 transition-all hover:scale-[1.02]"
          >
            <span>Add to Order</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>

        </div>
      </div>
    </div>
  );
};

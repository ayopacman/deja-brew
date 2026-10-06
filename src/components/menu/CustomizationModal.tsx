'use client';

import React, { useState } from 'react';
import { MenuItem, CustomizationOptions, MilkOption, ShotOption, SyrupOption, TempOption, SweetnessOption } from '../../types/coffee';
import { X, Flame, Snowflake, Plus, Minus, Sparkles, MapPin, Coffee, Utensils, Heart, CheckCircle2, Paintbrush } from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';
import { RECOMMENDED_PAIRINGS, MENU_ITEMS } from '../../data/coffeeData';
import { LatteArtStudioModal } from '../latteart/LatteArtStudioModal';

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
  const [milk, setMilk] = useState<MilkOption>(item.defaultCustomization?.milk || (item.category === 'milk-based' ? 'whole' : 'none'));
  const [shots, setShots] = useState<ShotOption>(item.defaultCustomization?.shots || 'double');
  const [syrup, setSyrup] = useState<SyrupOption>(item.defaultCustomization?.syrup || 'none');
  const [syrupPumps, setSyrupPumps] = useState<number>(item.defaultCustomization?.syrupPumps || 1);
  const [temp, setTemp] = useState<TempOption>(item.defaultCustomization?.temp || (item.category === 'iced' ? 'iced' : 'hot'));
  const [sweetness, setSweetness] = useState<SweetnessOption>(item.defaultCustomization?.sweetness || '0%');
  const [selectedArtName, setSelectedArtName] = useState<string | null>(null);
  const [isArtStudioOpen, setIsArtStudioOpen] = useState<boolean>(false);
  const [warmServing, setWarmServing] = useState<boolean>(true);
  const [includeCutlery, setIncludeCutlery] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  if (!isOpen) return null;

  const isCoffee = item.category === 'espresso' || item.category === 'milk-based' || item.category === 'brewed' || item.category === 'iced' || item.category === 'hybrids';
  const isFood = item.category === 'snacks' || item.category === 'desserts';

  let extraCost = 0;
  if (isCoffee) {
    if (milk === 'oat' || milk === 'almond' || milk === 'coconut') extraCost += 50;
    if (shots === 'triple') extraCost += 60;
    if (syrup !== 'none' && syrupPumps > 0) extraCost += 40;
  }

  const unitPrice = item.price + extraCost;
  const totalPrice = unitPrice * quantity;

  // Find recommended pairing for this item
  const matchingPairing = RECOMMENDED_PAIRINGS.find(
    (p) => p.drinkId === item.id || p.snackId === item.id
  );
  const pairedItem = matchingPairing
    ? MENU_ITEMS.find((m) => (matchingPairing.drinkId === item.id ? m.id === matchingPairing.snackId : m.id === matchingPairing.drinkId))
    : null;

  const handleAdd = () => {
    playSoundEffect('success');
    setAddedAnimation(true);
    
    let specialNotes = notes.trim();
    if (selectedArtName) {
      specialNotes = specialNotes ? `Latte Art: ${selectedArtName} | ${specialNotes}` : `Latte Art: ${selectedArtName}`;
    }
    if (isFood) {
      const foodPrefs = `${warmServing ? 'Warm & Toasted' : 'Room Temp / Chilled'}, ${includeCutlery ? 'Include Cutlery' : 'No Cutlery'}`;
      specialNotes = specialNotes ? `${foodPrefs} | Note: ${specialNotes}` : foodPrefs;
    }

    onAddToCart(
      item,
      {
        milk,
        shots,
        syrup,
        syrupPumps: syrup === 'none' ? 0 : syrupPumps,
        temp,
        sweetness,
        notes: specialNotes ? specialNotes : undefined,
      },
      quantity
    );

    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white border-2 border-[#F8D7DF] rounded-[32px] overflow-hidden shadow-2xl text-[#2D2020] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 bg-[#FFF0F3] shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#5D4A4A] flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges in Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
            {item.isHouseSpecial && (
              <span className="bg-[#E84A74] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                House Special
              </span>
            )}
            {item.isPopular && !item.isHouseSpecial && (
              <span className="bg-[#D8315B] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                ⭐ Barista Favorite
              </span>
            )}
            {item.subcategory && (
              <span className="bg-white/95 backdrop-blur-xs text-[#5D4A4A] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                {item.subcategory}
              </span>
            )}
          </div>

          {/* Bottom Overlay Title & Base Price */}
          <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black drop-shadow-md">{item.name}</h2>
              <p className="text-xs text-rose-200 drop-shadow-xs line-clamp-1">{item.tagline || item.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-white/80 block uppercase tracking-wider font-bold">Base Price</span>
              <span className="font-mono font-black text-2xl text-white drop-shadow-md">₹{item.price}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs divide-y divide-[#F8D7DF]">
          
          {/* 1. Item Story, Estate Origin & Flavor Profile */}
          <div className="space-y-3 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              {item.calories && (
                <span className="bg-[#FFF0F3] border border-[#F8D7DF] text-[#A43854] text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  🔥 {item.calories} kcal
                </span>
              )}
              {item.roastType && (
                <span className="bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A404F] text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  ☕ {item.roastType} Roast
                </span>
              )}
              {item.intensity && (
                <div className="bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A404F] text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                  <span>Intensity:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-2 h-2 rounded-full ${
                          lvl <= (item.intensity || 0) ? 'bg-[#E84A74]' : 'bg-[#F4D2DA]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {item.dietary?.map((diet) => (
                <span key={diet} className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  {diet === 'Vegan' ? '🌱 Vegan' : diet === 'Gluten-Free' ? '🌾 Gluten-Free' : diet}
                </span>
              ))}
            </div>

            {item.originEstate && (
              <div className="p-2.5 bg-[#FFF9F9] border border-[#F8D7DF] rounded-2xl flex items-center gap-2 text-[#7A404F]">
                <MapPin className="w-4 h-4 text-[#E84A74] shrink-0" />
                <div>
                  <span className="font-bold text-[11px] block text-[#4A2828]">Single Origin Estate</span>
                  <span className="text-[10px] text-[#8C6D6D]">{item.originEstate}</span>
                </div>
              </div>
            )}

            <p className="text-xs text-[#5D4A4A] leading-relaxed">
              {item.description}
            </p>

            {item.flavorNotes && item.flavorNotes.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#8C6D6D] uppercase tracking-wider block mb-1.5">
                  Tasting & Flavor Notes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="bg-[#FFF0F3] border border-[#F8D7DF] text-[#9E334D] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-2xs"
                    >
                      ✨ {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Interactive Drink Customization */}
          {isCoffee && (
            <div className="pt-4 space-y-4">
              
              {/* Temperature */}
              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Serving Temperature
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTemp('hot')}
                    className={`py-2.5 px-3 rounded-2xl font-bold border flex items-center justify-center gap-2 transition-all ${
                      temp === 'hot'
                        ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-[#E84A74]" />
                    <span>Hot & Steamed (65°C)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemp('iced')}
                    className={`py-2.5 px-3 rounded-2xl font-bold border flex items-center justify-center gap-2 transition-all ${
                      temp === 'iced'
                        ? 'bg-[#EBF7FF] border-2 border-[#0284C7] text-[#0284C7] shadow-xs'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
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
                    Milk Selection
                  </label>
                  <span className="text-[10px] text-[#E84A74] font-bold">Plant milks +₹50</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whole', label: 'Whole Milk', sub: 'Standard' },
                    { id: 'oat', label: 'Oat Milk', sub: '+₹50' },
                    { id: 'almond', label: 'Almond Milk', sub: '+₹50' },
                    { id: 'coconut', label: 'Coconut Milk', sub: '+₹50' },
                    { id: 'condensed', label: 'Condensed', sub: 'Sweet' },
                    { id: 'none', label: 'Black / None', sub: 'Pure' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMilk(m.id as MilkOption)}
                      className={`p-2.5 rounded-2xl text-center border text-xs font-semibold transition-all ${
                        milk === m.id
                          ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                          : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                      }`}
                    >
                      <div>{m.label}</div>
                      <div className={`text-[9px] ${milk === m.id ? 'text-[#E84A74]' : 'text-[#8C7575]'}`}>{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Espresso Shot Calibration */}
              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Espresso Shot Calibration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'single', label: 'Single Shot', sub: '30ml' },
                    { id: 'double', label: 'Double Shot', sub: 'Standard' },
                    { id: 'triple', label: 'Triple Shot', sub: '+₹60' },
                    { id: 'decaf', label: 'Swiss Decaf', sub: 'No Buzz' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShots(s.id as ShotOption)}
                      className={`p-2 rounded-2xl text-center border text-xs font-semibold transition-all ${
                        shots === s.id
                          ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                          : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                      }`}
                    >
                      <div>{s.label}</div>
                      <div className={`text-[9px] ${shots === s.id ? 'text-[#E84A74]' : 'text-[#8C7575]'}`}>{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Artisanal Syrups */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider">
                    Artisanal Syrup Infusion (+₹40)
                  </label>
                  {syrup !== 'none' && (
                    <div className="flex items-center gap-1.5 bg-[#FFF0F3] px-2 py-0.5 rounded-lg border border-[#F8D7DF]">
                      <span className="text-[10px] font-bold text-[#E84A74]">Pumps:</span>
                      <button
                        type="button"
                        onClick={() => setSyrupPumps(Math.max(1, syrupPumps - 1))}
                        className="w-4 h-4 rounded bg-white text-[#E84A74] font-bold text-[10px] flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-[10px] w-3 text-center">{syrupPumps}</span>
                      <button
                        type="button"
                        onClick={() => setSyrupPumps(Math.min(5, syrupPumps + 1))}
                        className="w-4 h-4 rounded bg-white text-[#E84A74] font-bold text-[10px] flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'none', label: 'No Syrup' },
                    { id: 'vanilla', label: 'Vanilla Bean' },
                    { id: 'caramel', label: 'Salted Caramel' },
                    { id: 'hazelnut', label: 'Roasted Hazelnut' },
                    { id: 'lavender', label: 'Wild Lavender' },
                  ].map((syr) => (
                    <button
                      key={syr.id}
                      type="button"
                      onClick={() => setSyrup(syr.id as SyrupOption)}
                      className={`p-2 rounded-2xl text-center border text-[11px] font-semibold transition-all ${
                        syrup === syr.id
                          ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                          : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                      }`}
                    >
                      {syr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Sweetness Calibration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '0%', label: '0% Unsweetened' },
                    { id: '25%', label: '25% Light' },
                    { id: '50%', label: '50% Balanced' },
                    { id: '100%', label: '100% Sweet' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSweetness(lvl.id as SweetnessOption)}
                      className={`py-2 rounded-2xl text-xs font-semibold border transition-all ${
                        sweetness === lvl.id
                          ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                          : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Latte Art Foam Design */}
              {temp === 'hot' && (item.category === 'milk-based' || item.category === 'hybrids') && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsArtStudioOpen(true)}
                    className={`w-full py-2.5 px-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      selectedArtName
                        ? 'bg-[#FFF0F3] border-[#E84A74] text-[#E84A74] shadow-xs'
                        : 'bg-[#FFF9F9] border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF0F3]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center">
                        <Paintbrush className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-xs block text-[#2D2020]">
                          {selectedArtName ? `Latte Art: ${selectedArtName}` : 'Design Custom Foam Latte Art 🎨'}
                        </span>
                        <span className="text-[10px] text-[#8C7575]">
                          {selectedArtName ? 'Click to re-edit foam sketch' : 'Draw or pick signature stencil'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-[#E84A74] bg-white px-2 py-0.5 rounded-full border border-[#F8D7DF]">
                      {selectedArtName ? '✓ Attached' : 'Free Foam Art'}
                    </span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* 3. Food / Bakery Preferences */}
          {isFood && (
            <div className="pt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Preparation & Serving Style
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setWarmServing(true)}
                    className={`py-3 px-3 rounded-2xl font-bold border flex items-center justify-center gap-2 transition-all ${
                      warmServing
                        ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-[#E84A74]" />
                    <span>Warm & Freshly Toasted</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWarmServing(false)}
                    className={`py-3 px-3 rounded-2xl font-bold border flex items-center justify-center gap-2 transition-all ${
                      !warmServing
                        ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                    }`}
                  >
                    <Snowflake className="w-4 h-4 text-[#0284C7]" />
                    <span>Room Temp / Chilled</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                  Cutlery & Eco Options
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIncludeCutlery(true)}
                    className={`py-2.5 px-3 rounded-2xl font-semibold border flex items-center justify-center gap-2 transition-all ${
                      includeCutlery
                        ? 'bg-[#FFF0F3] border-2 border-[#E84A74] text-[#E84A74] shadow-xs'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-[#E84A74]" />
                    <span>Include Wooden Fork & Napkin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeCutlery(false)}
                    className={`py-2.5 px-3 rounded-2xl font-semibold border flex items-center justify-center gap-2 transition-all ${
                      !includeCutlery
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-xs'
                        : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF9F9]'
                    }`}
                  >
                    <span>🌿 Eco-Friendly (No Cutlery)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Recommended Barista Pairing Callout */}
          {matchingPairing && pairedItem && (
            <div className="pt-4">
              <div className="p-3.5 bg-gradient-to-r from-[#FFF0F3] to-[#FFF9F9] border border-[#F8D7DF] rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={pairedItem.image}
                    alt={pairedItem.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#F8D7DF] shadow-xs shrink-0"
                  />
                  <div>
                    <div className="text-[10px] font-bold text-[#E84A74] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Curated Pairing Suggestion
                    </div>
                    <div className="font-serif font-bold text-xs text-[#2D2020]">
                      Pairs with {pairedItem.name}
                    </div>
                    <p className="text-[10px] text-[#8C6D6D] line-clamp-1">{matchingPairing.reason}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-emerald-600 block font-bold">Save ₹{matchingPairing.savings}</span>
                  <span className="font-mono font-bold text-xs text-[#E84A74]">₹{matchingPairing.comboPrice} combo</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Special Notes */}
          <div className="pt-4">
            <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block mb-1.5">
              Special Instructions for Barista / Kitchen
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., extra foam, light drizzle, allergy notes..."
              className="w-full bg-[#FFF9F9] border border-[#F8D7DF] text-[#2D2020] text-xs rounded-2xl p-3 focus:outline-none focus:border-[#E84A74] transition-colors"
            />
          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-[#FFF0F3] border-t border-[#F8D7DF] flex items-center justify-between gap-4">
          
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#F8D7DF] shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] flex items-center justify-center font-bold transition-transform active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black w-6 text-center text-[#2D2020]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] flex items-center justify-center font-bold transition-transform active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs sm:text-sm py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-lg shadow-[#E84A74]/25 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              addedAnimation ? 'bg-emerald-600' : ''
            }`}
          >
            <span className="flex items-center gap-1.5">
              {addedAnimation ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{addedAnimation ? 'Added to Order!' : 'Add to Order'}</span>
            </span>
            <span className="font-mono font-black text-sm">₹{totalPrice}</span>
          </button>
        </div>

      </div>

      {/* Embedded Latte Art Foam Studio */}
      <LatteArtStudioModal
        isOpen={isArtStudioOpen}
        onClose={() => setIsArtStudioOpen(false)}
        onApplyArt={(designName) => setSelectedArtName(designName)}
      />
    </div>
  );
};


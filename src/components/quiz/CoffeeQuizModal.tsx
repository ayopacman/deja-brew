'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Coffee,
  Check,
  Flame,
  Droplets,
  Heart,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Award
} from 'lucide-react';
import { MENU_ITEMS, RECOMMENDED_PAIRINGS } from '../../data/coffeeData';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';

interface CoffeeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoffeeQuizModal: React.FC<CoffeeQuizModalProps> = ({ isOpen, onClose }) => {
  const { addPairingToCart } = useOrder();
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{
    mood: string;
    flavor: string;
    milk: string;
  }>({
    mood: 'energized',
    flavor: 'chocolate',
    milk: 'velvety'
  });
  const [matchedPairing, setMatchedPairing] = useState<typeof RECOMMENDED_PAIRINGS[0] | null>(null);

  if (!isOpen) return null;

  const handleSelectMood = (mood: string) => {
    setAnswers((prev) => ({ ...prev, mood }));
    playSoundEffect('click');
    setStep(2);
  };

  const handleSelectFlavor = (flavor: string) => {
    setAnswers((prev) => ({ ...prev, flavor }));
    playSoundEffect('click');
    setStep(3);
  };

  const handleSelectMilk = (milk: string) => {
    const updated = { ...answers, milk };
    setAnswers(updated);
    playSoundEffect('success');

    // Match best pairing based on choices
    let match = RECOMMENDED_PAIRINGS[0]; // Doppio + Truffle default
    if (updated.milk === 'black' && updated.flavor === 'floral') {
      match = RECOMMENDED_PAIRINGS[6]; // V60 + Lemon Drizzle
    } else if (updated.milk === 'condensed' || updated.flavor === 'caramel') {
      match = RECOMMENDED_PAIRINGS[4]; // Spanish Latte + Brownie
    } else if (updated.milk === 'velvety' && updated.flavor === 'chocolate') {
      match = RECOMMENDED_PAIRINGS[5]; // Mocha + Tiramisu
    } else if (updated.milk === 'velvety') {
      match = RECOMMENDED_PAIRINGS[2]; // Flat white + Banana bread
    } else if (updated.mood === 'refreshing') {
      match = RECOMMENDED_PAIRINGS[7]; // Nitro Cold brew + Truffle
    } else if (updated.flavor === 'citrus') {
      match = RECOMMENDED_PAIRINGS[1]; // Cortado + Biscotti
    } else {
      match = RECOMMENDED_PAIRINGS[3]; // Cappuccino + Almond Croissant
    }

    setMatchedPairing(match);
    setStep(4);
  };

  const handleAddMatchToCart = () => {
    if (!matchedPairing) return;
    const drink = MENU_ITEMS.find((i) => i.id === matchedPairing.drinkId) || MENU_ITEMS[0];
    const snack = MENU_ITEMS.find((i) => i.id === matchedPairing.snackId) || MENU_ITEMS[20];
    addPairingToCart(drink, snack);
    playSoundEffect('success');
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setMatchedPairing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Flavor Sommelier Quiz</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#2D2020]">
            Find Your Signature Brew & Pairing
          </h2>
          <p className="text-xs text-[#7A6767]">
            Answer 3 quick questions to reveal your customized Deja Brew match.
          </p>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s
                    ? 'w-8 bg-[#E84A74]'
                    : step > s
                    ? 'w-4 bg-[#FF8EA8]'
                    : 'w-4 bg-[#F8D7DF]'
                }`}
              />
            ))}
          </div>
        )}

        {/* STEP 1: MORNING MOOD */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-center text-[#8C7575]">
              Question 1/3: What is your morning energy vibe?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'energized', label: '⚡ Bold High-Octane', desc: 'Punchy espresso kick to conquer the day' },
                { id: 'cozy', label: '🌸 Cozy & Relaxing', desc: 'Smooth, comforting steamed microfoam' },
                { id: 'refreshing', label: '🧊 Chilled & Crisp', desc: '18-hour cold brew over hand-cut ice' },
                { id: 'mindful', label: '🌿 Mindful & Delicate', desc: 'Gentle hand-dripped V60 pour-over' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectMood(opt.id)}
                  className="p-4 rounded-2xl bg-[#FFF9F9] hover:bg-[#FFF0F3] border border-[#F8D7DF] hover:border-[#E84A74] text-left transition-all hover:scale-102 flex flex-col justify-between"
                >
                  <div className="font-bold text-xs text-[#2D2020]">{opt.label}</div>
                  <div className="text-[10px] text-[#7A6767] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FLAVOR PROFILE */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-center text-[#8C7575]">
              Question 2/3: Which flavour note tantalizes you?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'chocolate', label: '🍫 Rich Dark Chocolate', desc: 'Nutty brownie, roasted cacao & fudge' },
                { id: 'caramel', label: '🍯 Sweet Dulce Caramel', desc: 'Condensed milk, toffee & hazelnut syrup' },
                { id: 'floral', label: '🌸 Jasmine & White Peach', desc: 'Bright Ethiopian citrus & honeysuckle' },
                { id: 'citrus', label: '🍊 Tangy Orange Zest', desc: 'Crisp bergamot & twice-baked biscotti' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectFlavor(opt.id)}
                  className="p-4 rounded-2xl bg-[#FFF9F9] hover:bg-[#FFF0F3] border border-[#F8D7DF] hover:border-[#E84A74] text-left transition-all hover:scale-102 flex flex-col justify-between"
                >
                  <div className="font-bold text-xs text-[#2D2020]">{opt.label}</div>
                  <div className="text-[10px] text-[#7A6767] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: MILK PREFERENCE */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-center text-[#8C7575]">
              Question 3/3: How do you like your milk?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'velvety', label: '🥛 Silky Whole / Oat Milk', desc: 'Velvety microfoam latte art' },
                { id: 'condensed', label: '✨ Sweet Condensed Milk', desc: 'Decadent Spanish style latte' },
                { id: 'black', label: '☕ Pure Black (No Milk)', desc: 'Highlighting pure terroir notes' },
                { id: 'gelato', label: '🍨 Gelato Hybrid', desc: 'Hot espresso drowned over cold ice cream' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectMilk(opt.id)}
                  className="p-4 rounded-2xl bg-[#FFF9F9] hover:bg-[#FFF0F3] border border-[#F8D7DF] hover:border-[#E84A74] text-left transition-all hover:scale-102 flex flex-col justify-between"
                >
                  <div className="font-bold text-xs text-[#2D2020]">{opt.label}</div>
                  <div className="text-[10px] text-[#7A6767] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: MATCH RESULT */}
        {step === 4 && matchedPairing && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-[#FFF0F3] to-[#FCE4EC] border-2 border-[#F8BBD0] rounded-2xl p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white text-[#E84A74] flex items-center justify-center mx-auto shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E84A74]">
                  YOUR PERFECT PAIRING MATCH
                </span>
                <h3 className="font-serif font-black text-xl text-[#2D2020] pt-0.5">
                  {matchedPairing.drinkName} + {matchedPairing.snackName}
                </h3>
              </div>

              <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-xs border border-white">
                <img
                  src={matchedPairing.image}
                  alt={matchedPairing.drinkName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Combo: ₹{matchedPairing.comboPrice} <span className="text-emerald-400 font-normal">(Save ₹{matchedPairing.savings})</span>
                </div>
              </div>

              <p className="text-xs italic text-[#5D4A4A] leading-relaxed">
                "{matchedPairing.reason}"
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="bg-white hover:bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleAddMatchToCart}
                className="flex-1 bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-102"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Match to Cart (₹{matchedPairing.comboPrice})</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

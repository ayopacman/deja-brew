'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Award,
  CheckCircle2,
  Copy,
  ShoppingBag,
  Flame,
  Coffee
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIZES = [
  { id: 1, label: '₹50 Off Snack', code: 'LUCKYBEAN50', color: '#FFF0F3', textColor: '#E84A74' },
  { id: 2, label: 'Free Extra Shot', code: 'FREESHOT', color: '#FCE4EC', textColor: '#9E334D' },
  { id: 3, label: '10% Off Order', code: 'DEJALOVE', color: '#FFF5F6', textColor: '#E84A74' },
  { id: 4, label: '₹100 Off Duo', code: 'SWEETTREAT', color: '#F8BBD0', textColor: '#781D34' },
  { id: 5, label: '20% VIP Pass', code: 'BLOSSOM20', color: '#FFF0F5', textColor: '#C2185B' },
  { id: 6, label: 'Secret Barista Gift', code: 'DEJALOVE', color: '#FCE4EC', textColor: '#E84A74' },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({ isOpen, onClose }) => {
  const { applyCoupon, setIsCartOpen } = useOrder();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<typeof PRIZES[0] | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    playSoundEffect('click');

    // Pick random prize index 0-5
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length;
    // Calculate final rotation (multiple full spins + align with pointer at top)
    const extraSpins = 360 * 5; // 5 full turns
    const targetAngle = extraSpins + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(PRIZES[prizeIndex]);
      playSoundEffect('success');
    }, 4000);
  };

  const handleClaimPrize = () => {
    if (!wonPrize) return;
    applyCoupon(wonPrize.code);
    playSoundEffect('success');
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020] text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Lucky Bean Rewards</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#2D2020]">
            Spin Deja Brew Lucky Wheel
          </h2>
          <p className="text-xs text-[#7A6767]">
            Spin once daily to win free extra espresso shots, bakery snack discounts, and VIP promo codes!
          </p>
        </div>

        {/* The Wheel Container */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          
          {/* Top Indicator Pointer */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#E84A74] filter drop-shadow-md" />

          {/* Rotating Wheel Disk */}
          <div
            className="w-full h-full rounded-full border-4 border-[#F8BBD0] shadow-xl overflow-hidden relative transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: 'conic-gradient(#FFF0F3 0deg 60deg, #FCE4EC 60deg 120deg, #FFF5F6 120deg 180deg, #F8BBD0 180deg 240deg, #FFF0F5 240deg 300deg, #FCE4EC 300deg 360deg)'
            }}
          >
            {/* Slice Labels */}
            {PRIZES.map((prize, idx) => {
              const angle = idx * 60 + 30;
              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full flex items-start justify-center pt-3 font-serif font-bold text-[10px]"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    color: prize.textColor
                  }}
                >
                  <span className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                    {prize.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute z-10 w-16 h-16 rounded-full bg-white border-4 border-[#F8BBD0] shadow-md flex items-center justify-center text-[#E84A74]">
            <Coffee className="w-6 h-6" />
          </div>

        </div>

        {/* Won Prize Banner or Spin Button */}
        {wonPrize ? (
          <div className="bg-[#EAFBF0] border border-emerald-300 rounded-2xl p-4 space-y-2 animate-in zoom-in-95 duration-200 text-emerald-900">
            <div className="flex items-center justify-center gap-1.5 font-black text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>You Won: {wonPrize.label}! 🎉</span>
            </div>
            <p className="text-xs text-emerald-700">
              Promo code <b>{wonPrize.code}</b> is ready to apply to your cart.
            </p>
            <button
              onClick={handleClaimPrize}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Claim & Apply to Cart</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full text-white font-black text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E84A74]/25 transition-all ${
              isSpinning
                ? 'bg-[#A88C8C] cursor-not-allowed opacity-80'
                : 'bg-[#E84A74] hover:bg-[#D43862] hover:scale-[1.02]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel!'}</span>
          </button>
        )}

      </div>
    </div>
  );
};

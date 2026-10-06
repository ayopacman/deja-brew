'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Coffee,
  Check,
  CheckCircle2,
  Gift,
  Award,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface LoyaltyStampCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyStampCardModal: React.FC<LoyaltyStampCardModalProps> = ({ isOpen, onClose }) => {
  const { applyCoupon, setIsCartOpen } = useOrder();
  const [stamps, setStamps] = useState<number>(3);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dejabrew_loyalty_stamps');
      if (saved) {
        const val = parseInt(saved, 10);
        setStamps(isNaN(val) ? 3 : val);
        if (val >= 6) setRewardUnlocked(true);
      }
    } catch (e) {
      console.warn('Loyalty read error', e);
    }
  }, []);

  if (!isOpen) return null;

  const handleAddStamp = () => {
    const next = stamps + 1;
    setStamps(next);
    localStorage.setItem('dejabrew_loyalty_stamps', next.toString());
    playSoundEffect('click');

    if (next >= 6) {
      setRewardUnlocked(true);
      playSoundEffect('ready_bell');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E84A74', '#FF8EA8', '#FDE8ED', '#FBBF24']
      });
    }
  };

  const handleClaimReward = () => {
    applyCoupon('FREESHOT');
    playSoundEffect('success');
    onClose();
    setIsCartOpen(true);
  };

  const handleResetCard = () => {
    setStamps(0);
    setRewardUnlocked(false);
    localStorage.setItem('dejabrew_loyalty_stamps', '0');
    playSoundEffect('click');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-2 border-[#F8D7DF] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020] text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deja Brew Rewards Pass</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#2D2020]">
            Blossom Loyalty Stamp Card
          </h2>
          <p className="text-xs text-[#7A6767]">
            Collect 5 cherry blossom stamps on your orders to unlock your 6th cup free!
          </p>
        </div>

        {/* ========================================================= */}
        {/* VINTAGE BLOSSOM STAMP CARD */}
        {/* ========================================================= */}
        <div className="relative bg-gradient-to-br from-[#FFF0F3] via-[#FFF8F9] to-[#FCE4EC] border-2 border-[#F8BBD0] rounded-3xl p-5 shadow-inner space-y-4">
          
          <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#E84A74] text-white flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif font-black text-xs text-[#E84A74]">
                Deja Brew Club Pass
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#8C7575] bg-white px-2.5 py-0.5 rounded-full border border-[#F8D7DF]">
              {stamps >= 6 ? 'COMPLETED! 🎉' : `${stamps}/6 Stamps`}
            </span>
          </div>

          {/* 6 Stamp Circles Grid */}
          <div className="grid grid-cols-3 gap-3 py-2">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isStamped = stamps >= num;
              const isRewardSlot = num === 6;

              return (
                <div
                  key={num}
                  className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all ${
                    isStamped
                      ? 'bg-white border-[#E84A74] shadow-md scale-105'
                      : isRewardSlot
                      ? 'bg-[#FFF0F5] border-dashed border-[#E84A74]/60'
                      : 'bg-white/60 border-dashed border-[#F8D7DF]'
                  }`}
                >
                  {isStamped ? (
                    <div className="flex flex-col items-center animate-in zoom-in-50">
                      <span className="text-2xl drop-shadow-xs">🌸</span>
                      <span className="text-[8px] font-mono font-bold text-[#E84A74] mt-0.5">
                        STAMP #{num}
                      </span>
                    </div>
                  ) : isRewardSlot ? (
                    <div className="flex flex-col items-center opacity-80">
                      <Gift className="w-6 h-6 text-[#E84A74] animate-bounce" />
                      <span className="text-[8px] font-black uppercase text-[#E84A74] mt-0.5">
                        FREE CUP!
                      </span>
                    </div>
                  ) : (
                    <div className="text-[#A88C8C] font-mono text-xs font-bold">
                      #{num}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-[#7A6767] italic">
            Each specialty coffee or tea automatically adds 1 blossom stamp.
          </p>
        </div>

        {/* Actions */}
        {rewardUnlocked ? (
          <div className="space-y-2 animate-in zoom-in-95">
            <div className="bg-[#EAFBF0] border border-emerald-300 text-emerald-800 rounded-2xl p-3.5 text-xs font-bold">
              🎉 Congratulations! Your 6th Coffee Reward (Code: FREESHOT) is Unlocked!
            </div>
            <button
              onClick={handleClaimReward}
              className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-102"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Claim Free Coffee Reward in Cart</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleAddStamp}
              className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>Stamp My Card (Simulate Coffee Order)</span>
            </button>

            <button
              onClick={handleResetCard}
              className="text-[10px] text-[#8C7575] hover:text-[#2D2020] hover:underline flex items-center justify-center gap-1 mx-auto pt-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Stamp Card</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

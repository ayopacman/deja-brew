'use client';

import React, { useState } from 'react';
import { FlavorQuiz } from '../../components/subscription/FlavorQuiz';
import { SubscriptionConfigurator } from '../../components/subscription/SubscriptionConfigurator';
import { Layers, Sparkles, Award, Gift, Truck } from 'lucide-react';

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'plans'>('quiz');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-[#FDFBF7]">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#2A2421] border border-[#C88A58]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#C88A58]">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Specialty Coffee Tasting Club</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#FDFBF7] tracking-tight">
          Rare Micro-Lots Delivered Fresh to Your Door
        </h1>
        <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed">
          Discover exclusive single origins from Ethiopia, Panama, Guatemala, and Kenya, freshly roasted in small batches with collectible tasting cards and barista guides.
        </p>

        {/* Tab Toggle */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-[#965B32] text-white shadow-lg shadow-[#965B32]/30'
                : 'bg-[#1C1917] border border-[#2E2824] text-[#A89F91] hover:text-[#FDFBF7]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Palate Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'plans'
                ? 'bg-[#965B32] text-white shadow-lg shadow-[#965B32]/30'
                : 'bg-[#1C1917] border border-[#2E2824] text-[#A89F91] hover:text-[#FDFBF7]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Browse All Subscription Tiers</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'quiz' ? (
        <FlavorQuiz onPlanSelected={() => setActiveTab('plans')} />
      ) : (
        <SubscriptionConfigurator />
      )}

      {/* Perks Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#2C2623]">
        <div className="p-4 rounded-2xl bg-[#181513] border border-[#2E2824] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#FDFBF7]">Free Priority Courier</div>
            <div className="text-[11px] text-[#A89F91]">Shipped within 48h of roast date</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181513] border border-[#2E2824] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#FDFBF7]">88+ SCA Cup Score Lots</div>
            <div className="text-[11px] text-[#A89F91]">Direct trade with single origin farmers</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181513] border border-[#2E2824] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#FDFBF7]">Member Cafe Discounts</div>
            <div className="text-[11px] text-[#A89F91]">15% off all online pickup orders</div>
          </div>
        </div>
      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../../data/coffeeData';
import { SubscriptionPlan } from '../../types/coffee';
import { Check, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/sound';

export const SubscriptionConfigurator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[0]);
  const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly'>('bi-weekly');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [memberEmail, setMemberEmail] = useState('emily.johnson@example.com');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    playSoundEffect('ready_bell');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E84A74', '#FF8EA8', '#FDE8ED']
    });
  };

  return (
    <div className="space-y-10 text-[#2D2020]">
      
      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-[#FFF9F9] border-[#E84A74] shadow-lg shadow-[#E84A74]/10 scale-[1.02]'
                  : 'bg-white border-[#F8D7DF] hover:border-[#E84A74]/50'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-6 bg-[#E84A74] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  Active Selection
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E84A74]">
                  {plan.tier}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#2D2020] mt-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#7A6767] mt-2 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#F8D7DF] flex items-baseline gap-1">
                  <span className="font-serif font-bold text-3xl text-[#E84A74]">
                    ${plan.pricePerDelivery.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#8C7575]">/ shipment</span>
                </div>

                <div className="mt-4 space-y-2">
                  {plan.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#5D4A4A]">
                      <Check className="w-3.5 h-3.5 text-[#E84A74] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F8D7DF]">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#E84A74] text-white'
                      : 'bg-[#FFF0F3] text-[#E84A74] hover:bg-[#FDE8ED]'
                  }`}
                >
                  {isSelected ? 'Selected Box' : 'Choose Box'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Customization */}
      <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="font-serif font-bold text-2xl text-[#2D2020] mb-2">
          Join SweetCrumbs Club: <span className="text-[#E84A74]">{selectedPlan.name}</span>
        </h2>
        <p className="text-xs text-[#7A6767] mb-6">
          Fresh deliveries with artisanal packaging. Pause or cancel anytime.
        </p>

        {isSubscribed ? (
          <div className="p-6 bg-[#FFF9F9] border border-emerald-400 rounded-2xl text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EAFBF0] border border-emerald-400 flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2D2020]">
              Welcome to SweetCrumbs Tasting Club!
            </h3>
            <p className="text-xs text-[#7A6767] max-w-md mx-auto">
              Your box will be packed fresh and dispatched to <b>{memberEmail}</b>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-[#8C7575] uppercase tracking-wider block mb-2">
                Delivery Schedule
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'weekly', label: 'Every Week', desc: 'Weekly fresh treat box' },
                  { id: 'bi-weekly', label: 'Every 2 Weeks', desc: 'Most popular option' },
                  { id: 'monthly', label: 'Monthly Box', desc: 'Monthly celebration' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      frequency === f.id
                        ? 'bg-[#FFF0F3] border-[#E84A74] text-[#E84A74]'
                        : 'bg-[#FFF9F9] border-[#F8D7DF] text-[#8C7575]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#2D2020]">{f.label}</div>
                    <div className="text-[10px] text-[#8C7575] mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FFF9F9] border border-[#F8D7DF] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C7575] block mb-1">
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full bg-white border border-[#F8D7DF] text-[#2D2020] text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#E84A74]"
                />
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-xs text-[#8C7575]">Price:</div>
                <div className="font-serif font-bold text-2xl text-[#E84A74]">
                  ${selectedPlan.pricePerDelivery.toFixed(2)}
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all hover:scale-105 shrink-0"
              >
                Join Tasting Club
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

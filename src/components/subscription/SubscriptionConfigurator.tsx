'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../../data/coffeeData';
import { SubscriptionPlan } from '../../types/coffee';
import { Check, Sparkles, Package, Calendar, Settings, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/sound';

export const SubscriptionConfigurator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[0]);
  const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly'>('bi-weekly');
  const [grind, setGrind] = useState<string>('Whole Bean');
  const [bags, setBags] = useState<number>(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [memberEmail, setMemberEmail] = useState('tasting.club@example.com');

  const unitPrice = selectedPlan.pricePerDelivery;
  const totalPrice = unitPrice * bags;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    playSoundEffect('ready_bell');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C88A58', '#965B32', '#FDFBF7']
    });
  };

  return (
    <div className="space-y-12 text-[#FDFBF7]">
      
      {/* Tier Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-[#211C19] border-[#C88A58] shadow-2xl shadow-[#965B32]/20 scale-105'
                  : 'bg-[#181513] border-[#2E2824] hover:border-[#3E352F]'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C88A58] text-[#14110F] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Active Selection
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A89F91]">
                  {plan.tier}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#FDFBF7] mt-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#A89F91] mt-2 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#2E2824] flex items-baseline gap-1">
                  <span className="font-serif font-bold text-3xl text-[#C88A58]">
                    ${plan.pricePerDelivery.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#A89F91]">/ shipment</span>
                </div>

                <div className="mt-4 space-y-2">
                  {plan.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#C9C1B5]">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E2824]">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#C88A58] text-[#14110F]'
                      : 'bg-[#24201D] text-[#C9C1B5] hover:bg-[#2E2824]'
                  }`}
                >
                  {isSelected ? 'Selected Tier' : 'Choose Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Customization Box */}
      <div className="bg-[#181513] border border-[#2E2824] rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="font-serif font-bold text-2xl text-[#FDFBF7] mb-2">
          Customize Your Box: <span className="text-[#C88A58]">{selectedPlan.name}</span>
        </h2>
        <p className="text-xs text-[#A89F91] mb-6">
          Change your frequency, bag grind, or pause anytime with 1-click in your member dashboard.
        </p>

        {isSubscribed ? (
          <div className="p-6 bg-[#211C19] border border-emerald-500/40 rounded-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#FDFBF7]">
              Welcome to the Tasting Club!
            </h3>
            <p className="text-xs text-[#A89F91] max-w-md mx-auto">
              Your first curation of <b>{selectedPlan.name}</b> ({grind}, {frequency}) will be roasted fresh in 48 hours and shipped to <b>{memberEmail}</b>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsSubscribed(false)}
                className="text-xs text-[#C88A58] hover:underline"
              >
                Modify Membership Settings
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-6">
            
            {/* Frequency Selector */}
            <div>
              <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block mb-2">
                Delivery Frequency
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'weekly', label: 'Every Week', desc: 'For heavy daily drinkers' },
                  { id: 'bi-weekly', label: 'Every 2 Weeks', desc: 'Most popular choice' },
                  { id: 'monthly', label: 'Monthly Box', desc: 'Casual weekend sipper' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      frequency === f.id
                        ? 'bg-[#965B32]/30 border-[#C88A58] text-white'
                        : 'bg-[#211C19] border-[#2E2824] text-[#A89F91] hover:border-[#3E352F]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#FDFBF7]">{f.label}</div>
                    <div className="text-[10px] text-[#A89F91] mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grind Size Option */}
            <div>
              <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block mb-2">
                Grind Calibration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Whole Bean (Recommended)',
                  'Coarse (French Press/Cold Brew)',
                  'Medium (V60/Drip/Chemex)',
                  'Fine (Espresso Machine)',
                ].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrind(g)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      grind === g
                        ? 'bg-[#965B32] text-white border-[#C88A58]'
                        : 'bg-[#211C19] border-[#2E2824] text-[#C9C1B5] hover:border-[#3E352F]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Email input & CTA */}
            <div className="p-4 bg-[#14110F] border border-[#2E2824] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A89F91] block mb-1">
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter email for tracking & member perks"
                  className="w-full bg-[#211C19] border border-[#2E2824] text-[#FDFBF7] text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#C88A58]"
                />
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-xs text-[#A89F91]">Total:</div>
                <div className="font-serif font-bold text-2xl text-[#C88A58]">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-[#C88A58] to-[#965B32] hover:from-[#DB9C69] hover:to-[#A8693A] text-[#14110F] font-bold text-xs py-3 px-6 rounded-xl shadow-lg shadow-[#965B32]/30 transition-all hover:scale-105 shrink-0"
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

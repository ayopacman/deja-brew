'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../../data/coffeeData';
import { Sparkles, Check, ArrowRight, RotateCcw, Coffee, Compass, Heart, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlavorQuizProps {
  onPlanSelected?: (planId: string) => void;
}

export const FlavorQuiz: React.FC<FlavorQuizProps> = ({ onPlanSelected }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    experience: '',
    flavorStyle: '',
    brewMethod: '',
    frequency: 'bi-weekly',
  });

  const [matchedPlanId, setMatchedPlanId] = useState<string | null>(null);

  const questions = [
    {
      title: 'How do you usually take your coffee?',
      desc: 'This helps us dial in the optimal roast profile and solubility.',
      key: 'experience',
      options: [
        { label: 'Black & Pure (Filter / Pour Over)', icon: Coffee, desc: 'Looking for brightness, crisp floral & fruity nuance' },
        { label: 'Espresso & Ristretto Shots', icon: Flame, desc: 'Rich, thick crema with dark chocolate & toasted hazelnut' },
        { label: 'With Milk / Oat / Lattes', icon: Heart, desc: 'Need deep body that cuts beautifully through steamed milk' },
        { label: 'Adventurous Explorer', icon: Compass, desc: 'Give me rare anaerobics, funky natural yeasts & competition lots' },
      ],
    },
    {
      title: 'Which flavor notes excite your palate the most?',
      desc: 'Select the primary tasting notes you enjoy waking up to.',
      key: 'flavorStyle',
      options: [
        { label: 'Wild Jasmine, Peach & Bergamot (Light)', icon: Sparkles, desc: 'Clean, tea-like body typical of high-altitude Ethiopian micro-lots' },
        { label: 'Salted Caramel, Dark Cacao & Brown Sugar (Medium)', icon: Coffee, desc: 'Comforting, smooth, sweet with zero harsh acidity' },
        { label: 'Smoky Oak, Roasted Walnut & Molasses (Dark)', icon: Flame, desc: 'Bold, punchy, traditional French & Italian roast profile' },
        { label: 'Tropical Mango, Strawberry Wine & Funk (Fermented)', icon: Compass, desc: 'High-tech carbonic maceration & anaerobic processing' },
      ],
    },
    {
      title: 'What equipment do you brew with at home?',
      desc: 'We can ship whole beans or grind precisely calibrated to your exact gear.',
      key: 'brewMethod',
      options: [
        { label: 'Hario V60 / Chemex / Kalita Wave', icon: Coffee, desc: 'Medium-fine grind or whole bean' },
        { label: 'Home Espresso Machine / Moka Pot', icon: Flame, desc: 'Ultra-fine dialed-in grind' },
        { label: 'French Press / Cold Brew Pitcher', icon: Coffee, desc: 'Coarse grind to eliminate silty sediment' },
        { label: 'AeroPress / Standard Drip Coffee Maker', icon: Compass, desc: 'Versatile medium grind' },
      ],
    },
  ];

  const handleSelectOption = (key: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [key]: label }));

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate match
      let selected = 'sub-01'; // Default Single-Origin Explorer
      if (label.includes('Espresso') || answers.experience.includes('Espresso')) {
        selected = 'sub-02'; // Espresso Master
      } else if (label.includes('Tropical') || answers.experience.includes('Adventurous')) {
        selected = 'sub-03'; // Rare Reserve
      } else {
        selected = 'sub-01';
      }

      setMatchedPlanId(selected);
      setStep(questions.length);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C88A58', '#965B32', '#FDFBF7']
      });
    }
  };

  const handleReset = () => {
    setStep(0);
    setMatchedPlanId(null);
    setAnswers({
      experience: '',
      flavorStyle: '',
      brewMethod: '',
      frequency: 'bi-weekly',
    });
  };

  const matchedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === matchedPlanId) || SUBSCRIPTION_PLANS[0];

  return (
    <div className="bg-[#181513] border border-[#2E2824] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-[#FDFBF7]">
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#C88A58]/10 via-transparent to-transparent pointer-events-none" />

      {step < questions.length ? (
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C88A58] bg-[#965B32]/20 px-3 py-1 rounded-full border border-[#C88A58]/30">
              Interactive Palate Quiz • Step {step + 1} of {questions.length}
            </span>
            <span className="text-xs text-[#A89F91]">
              Takes ~30 seconds
            </span>
          </div>

          <div>
            <h2 className="font-serif font-bold text-2xl text-[#FDFBF7]">
              {questions[step].title}
            </h2>
            <p className="text-xs text-[#A89F91] mt-1">
              {questions[step].desc}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {questions[step].options.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(questions[step].key, opt.label)}
                  className="p-4 rounded-2xl bg-[#211C19] border border-[#2E2824] hover:border-[#C88A58] hover:bg-[#2A2421] text-left transition-all duration-200 group flex items-start gap-3 hover:scale-[1.01]"
                >
                  <div className="p-2.5 rounded-xl bg-[#2A2421] group-hover:bg-[#965B32] text-[#C88A58] group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#FDFBF7] group-hover:text-[#C88A58] transition-colors">
                      {opt.label}
                    </h4>
                    <p className="text-[11px] text-[#A89F91] mt-1">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setStep(step - 1)}
                className="text-xs text-[#A89F91] hover:text-white"
              >
                &larr; Back to previous question
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Result & Matched Plan */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              100% Palate Match Found
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-[#A89F91] hover:text-[#FDFBF7] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake Quiz</span>
            </button>
          </div>

          <div>
            <h2 className="font-serif font-bold text-2xl text-[#FDFBF7]">
              We recommend: <span className="text-[#C88A58]">{matchedPlan.name}</span>
            </h2>
            <p className="text-xs text-[#A89F91] mt-1">
              Based on your preference for <b>{answers.flavorStyle.split('(')[0]}</b> brewed with <b>{answers.brewMethod.split('/')[0]}</b>.
            </p>
          </div>

          {/* Plan Card */}
          <div className="bg-[#211C19] border border-[#C88A58]/50 rounded-2xl p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2824] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A58]">
                  Tier: {matchedPlan.tier}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#FDFBF7] mt-0.5">
                  {matchedPlan.name}
                </h3>
                <p className="text-xs text-[#A89F91] mt-1">
                  Origins: <span className="text-[#FDFBF7]">{matchedPlan.recommendedOrigin}</span>
                </p>
              </div>

              <div className="sm:text-right">
                <div className="font-serif font-bold text-3xl text-[#C88A58]">
                  ${matchedPlan.pricePerDelivery.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#A89F91]">per delivery • Free Shipping</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="py-4 space-y-2">
              {matchedPlan.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#C9C1B5]">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={() => onPlanSelected && onPlanSelected(matchedPlan.id)}
                className="w-full bg-gradient-to-r from-[#C88A58] to-[#965B32] hover:from-[#DB9C69] hover:to-[#A8693A] text-[#14110F] font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#965B32]/30 transition-all hover:scale-[1.01]"
              >
                <span>Subscribe with this Match (${matchedPlan.pricePerDelivery.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

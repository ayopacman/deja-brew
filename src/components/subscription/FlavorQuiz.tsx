'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../../data/coffeeData';
import { Sparkles, Check, ArrowRight, RotateCcw, Cake, Heart, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlavorQuizProps {
  onPlanSelected?: (planId: string) => void;
}

export const FlavorQuiz: React.FC<FlavorQuizProps> = ({ onPlanSelected }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    occasion: '',
    flavorStyle: '',
    pairing: '',
  });

  const [matchedPlanId, setMatchedPlanId] = useState<string | null>(null);

  const questions = [
    {
      title: 'What flavors make your sweet tooth happiest?',
      desc: 'This helps us select your monthly cake & coffee box curation.',
      key: 'flavorStyle',
      options: [
        { label: 'Belgian Dark Chocolate & Hazelnut Ganache', icon: Cake, desc: 'Rich, dense, cocoa bliss' },
        { label: 'Fresh Strawberries, Chantilly Cream & Rose', icon: Heart, desc: 'Fruity, light, airy and floral' },
        { label: 'Salted Butter Caramel & Honeycomb Crunch', icon: Sparkles, desc: 'Sweet, savory toffee crunch' },
        { label: 'Southern Red Velvet & Madagascar Vanilla Bean', icon: Flame, desc: 'Classic cream cheese tang' },
      ],
    },
    {
      title: 'How do you like your coffee pairing?',
      desc: 'We roast matching micro-lot beans for your dessert box.',
      key: 'pairing',
      options: [
        { label: 'Velvety Flat White / Rose Petal Oat Latte', icon: Heart, desc: 'Creamy milk that balances dark cakes' },
        { label: 'Crisp Pour-Over / Filter Coffee', icon: Sparkles, desc: 'Jasmine & bergamot cup clarity' },
        { label: 'Cold Brew / Iced Cloud Coffee', icon: Flame, desc: 'Sweet strawberry foam on draft' },
      ],
    },
  ];

  const handleSelectOption = (key: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [key]: label }));

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setMatchedPlanId('sub-01');
      setStep(questions.length);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E84A74', '#FF8EA8', '#FDE8ED', '#F59E0B']
      });
    }
  };

  const handleReset = () => {
    setStep(0);
    setMatchedPlanId(null);
  };

  const matchedPlan = SUBSCRIPTION_PLANS[0];

  return (
    <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden text-[#2D2020]">
      {step < questions.length ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F8D7DF]">
              Sweet Palate Quiz • Step {step + 1} of {questions.length}
            </span>
          </div>

          <div>
            <h2 className="font-serif font-bold text-2xl text-[#2D2020]">
              {questions[step].title}
            </h2>
            <p className="text-xs text-[#7A6767] mt-1">
              {questions[step].desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {questions[step].options.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(questions[step].key, opt.label)}
                  className="p-4 rounded-2xl bg-[#FFF9F9] border border-[#F8D7DF] hover:border-[#E84A74] hover:bg-[#FFF0F3] text-left transition-all duration-200 group flex items-start gap-3 hover:scale-[1.01]"
                >
                  <div className="p-2 rounded-xl bg-white text-[#E84A74] shadow-xs shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2D2020] group-hover:text-[#E84A74] transition-colors">
                      {opt.label}
                    </h4>
                    <p className="text-[11px] text-[#7A6767] mt-1">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs text-[#8C7575] hover:text-[#2D2020]"
            >
              &larr; Previous question
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F8D7DF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              100% Sweet Palate Match Found
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-[#8C7575] hover:text-[#2D2020] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake Quiz</span>
            </button>
          </div>

          <div>
            <h2 className="font-serif font-bold text-2xl text-[#2D2020]">
              Recommended for you: <span className="text-[#E84A74]">{matchedPlan.name}</span>
            </h2>
          </div>

          <div className="bg-[#FFF9F9] border border-[#E84A74]/40 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2D2020]">
                  {matchedPlan.name}
                </h3>
                <p className="text-xs text-[#7A6767] mt-1">{matchedPlan.description}</p>
              </div>

              <div className="sm:text-right">
                <div className="font-serif font-bold text-3xl text-[#E84A74]">
                  ${matchedPlan.pricePerDelivery.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#8C7575]">per delivery • Free Shipping</div>
              </div>
            </div>

            <div className="py-4 space-y-2">
              {matchedPlan.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#5D4A4A]">
                  <Check className="w-4 h-4 text-[#E84A74] shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onPlanSelected && onPlanSelected(matchedPlan.id)}
              className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
            >
              <span>Subscribe to Tasting Box (${matchedPlan.pricePerDelivery.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

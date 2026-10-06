'use client';

import React, { useState, useEffect } from 'react';
import { BREW_GUIDES } from '../../data/coffeeData';
import { BrewGuide } from '../../types/coffee';
import { Play, Pause, RotateCcw, Droplets, Scale, Sparkles } from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';

export const BrewTimerCalculator: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<BrewGuide>(BREW_GUIDES[0]);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(selectedGuide.defaultCoffeeGrams);
  const [ratio, setRatio] = useState<number>(selectedGuide.defaultRatioNumber);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setCoffeeGrams(selectedGuide.defaultCoffeeGrams);
    setRatio(selectedGuide.defaultRatioNumber);
    setSeconds(0);
    setIsActive(false);
  }, [selectedGuide]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (next === 45 || next === 90 || next === 135) {
            playSoundEffect('click');
          }
          return next;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const totalWaterGrams = Math.round(coffeeGrams * ratio);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 text-[#2D2020]">
      
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {BREW_GUIDES.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all ${
              selectedGuide.id === guide.id
                ? 'bg-[#E84A74] text-white border-[#E84A74] shadow-sm'
                : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF0F3]'
            }`}
          >
            <span>{guide.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Stopwatch & Ratio */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 shadow-xs text-center space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C7575]">
              Live Brew Stopwatch
            </div>

            <div className="font-mono font-black text-6xl text-[#E84A74] tracking-wider py-2">
              {formatTime(seconds)}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsActive(!isActive);
                  playSoundEffect('click');
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all hover:scale-105 ${
                  isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#E84A74] hover:bg-[#D43862]'
                }`}
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              <button
                onClick={() => {
                  setIsActive(false);
                  setSeconds(0);
                  playSoundEffect('click');
                }}
                className="w-14 h-14 rounded-2xl bg-[#FFF0F3] hover:bg-[#FDE8ED] border border-[#F8D7DF] flex items-center justify-center text-[#E84A74]"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[11px] text-[#8C7575]">
              Target extraction: <b className="text-[#2D2020]">{selectedGuide.targetTime}</b>
            </div>
          </div>

          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#2D2020] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#E84A74]" />
                <span>Brew Ratio & Dose</span>
              </h3>
              <span className="text-xs font-bold text-[#E84A74] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full">
                1:{ratio.toFixed(1)}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#8C7575] mb-1.5">
                <span>Coffee Dose</span>
                <span className="font-bold text-[#2D2020]">{coffeeGrams}g</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="w-full accent-[#E84A74] h-2 bg-[#F8D7DF] rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-4 bg-[#FFF9F9] rounded-2xl border border-[#F8D7DF] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#8C7575]">Water Required</div>
                <div className="font-serif font-bold text-2xl text-[#E84A74]">{totalWaterGrams}g</div>
              </div>
              <Droplets className="w-8 h-8 text-[#E84A74]/40" />
            </div>
          </div>
        </div>

        {/* Right: Step-by-step */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-4 mb-6">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D2020]">{selectedGuide.name}</h2>
                <p className="text-xs text-[#7A6767] mt-1">{selectedGuide.tagline}</p>
              </div>
              <span className="text-xs font-bold text-[#E84A74] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F8D7DF]">
                {selectedGuide.difficulty}
              </span>
            </div>

            <div className="space-y-4">
              {selectedGuide.steps.map((step, idx) => {
                const targetWater = Math.round(step.targetWaterGrams(coffeeGrams));
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF9F9] border border-[#F8D7DF] flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] border border-[#F8D7DF] flex items-center justify-center font-mono font-bold text-sm text-[#E84A74] shrink-0">
                      0{idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#2D2020]">{step.title}</h4>
                        <span className="font-mono text-xs text-[#8C7575] bg-white px-2 py-0.5 rounded-md border border-[#F8D7DF]">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6767] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="mt-2 text-[11px] font-bold text-[#E84A74]">
                        Target Scale Weight: ~{targetWater}g
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

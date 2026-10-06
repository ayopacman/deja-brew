'use client';

import React, { useState, useEffect } from 'react';
import { BREW_GUIDES } from '../../data/coffeeData';
import { BrewGuide } from '../../types/coffee';
import { Play, Pause, RotateCcw, Droplets, Thermometer, Clock, Scale, Sparkles, CheckCircle2 } from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';

export const BrewTimerCalculator: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<BrewGuide>(BREW_GUIDES[0]);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(selectedGuide.defaultCoffeeGrams);
  const [ratio, setRatio] = useState<number>(selectedGuide.defaultRatioNumber);

  // Timer states
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
          // Audio ping at 45s (bloom end)
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

  const handleToggleTimer = () => {
    setIsActive(!isActive);
    playSoundEffect('click');
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    playSoundEffect('click');
  };

  return (
    <div className="space-y-8 text-[#FDFBF7]">
      
      {/* Brew Method Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {BREW_GUIDES.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-2 ${
              selectedGuide.id === guide.id
                ? 'bg-[#965B32] text-white border-[#C88A58] shadow-lg shadow-[#965B32]/30'
                : 'bg-[#181513] border-[#2E2824] text-[#A89F91] hover:border-[#3E352F]'
            }`}
          >
            <span>{guide.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Calculator & Live Stopwatch */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Live Stopwatch Card */}
          <div className="bg-[#181513] border border-[#2E2824] rounded-3xl p-6 shadow-xl text-center space-y-4 relative overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89F91]">
              Live Brew Stopwatch
            </div>

            {/* Big Timer Display */}
            <div className="font-mono font-black text-6xl text-[#C88A58] tracking-wider py-2">
              {formatTime(seconds)}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleToggleTimer}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 ${
                  isActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              <button
                onClick={handleResetTimer}
                className="w-14 h-14 rounded-2xl bg-[#24201D] hover:bg-[#3E352F] border border-[#2E2824] flex items-center justify-center text-[#A89F91] hover:text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[11px] text-[#A89F91]">
              Target extraction time: <b className="text-[#FDFBF7]">{selectedGuide.targetTime}</b>
            </div>
          </div>

          {/* Golden Ratio Slider Card */}
          <div className="bg-[#181513] border border-[#2E2824] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#FDFBF7] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#C88A58]" />
                <span>Brew Ratio & Dose</span>
              </h3>
              <span className="text-xs font-bold text-[#C88A58] bg-[#965B32]/20 px-2.5 py-0.5 rounded-full">
                1:{ratio.toFixed(1)}
              </span>
            </div>

            {/* Coffee Dose Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#A89F91] mb-1.5">
                <span>Coffee Ground Dose</span>
                <span className="font-bold text-[#FDFBF7]">{coffeeGrams}g</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="w-full accent-[#C88A58] h-2 bg-[#2E2824] rounded-lg cursor-pointer"
              />
            </div>

            {/* Total Calculated Water Result */}
            <div className="p-4 bg-[#211C19] rounded-2xl border border-[#2E2824] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#A89F91]">Total Water Needed</div>
                <div className="font-serif font-bold text-2xl text-[#C88A58]">{totalWaterGrams}g / ml</div>
              </div>
              <Droplets className="w-8 h-8 text-[#C88A58]/50" />
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#211C19] rounded-xl border border-[#2E2824]">
                <div className="text-[#A89F91] text-[10px]">Water Temp</div>
                <div className="font-bold text-[#FDFBF7] mt-0.5">{selectedGuide.waterTemp}</div>
              </div>
              <div className="p-2.5 bg-[#211C19] rounded-xl border border-[#2E2824]">
                <div className="text-[#A89F91] text-[10px]">Grind Size</div>
                <div className="font-bold text-[#FDFBF7] mt-0.5 truncate">{selectedGuide.recommendedGrind.split('(')[0]}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Step-by-Step Pour Walkthrough */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#181513] border border-[#2E2824] rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2E2824] pb-4 mb-6">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#FDFBF7]">{selectedGuide.name}</h2>
                <p className="text-xs text-[#A89F91] mt-1">{selectedGuide.tagline}</p>
              </div>
              <span className="text-xs font-bold text-[#C88A58] bg-[#965B32]/30 px-3 py-1 rounded-full border border-[#C88A58]/30">
                {selectedGuide.difficulty}
              </span>
            </div>

            {/* Pour Stages List */}
            <div className="space-y-4">
              {selectedGuide.steps.map((step, idx) => {
                const targetWater = Math.round(step.targetWaterGrams(coffeeGrams));
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#211C19] border border-[#2E2824] flex items-start gap-4 hover:border-[#3E352F] transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2A2421] border border-[#3E352F] flex items-center justify-center font-mono font-bold text-sm text-[#C88A58] shrink-0">
                      0{idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#FDFBF7]">{step.title}</h4>
                        <span className="font-mono text-xs text-[#A89F91] bg-[#181513] px-2 py-0.5 rounded-md border border-[#2E2824]">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#A89F91] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="mt-2 text-[11px] font-bold text-[#C88A58]">
                        Target Scale Weight: ~{targetWater}g total
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

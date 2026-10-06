'use client';

import React from 'react';
import { BrewTimerCalculator } from '../../components/brew/BrewTimerCalculator';
import { BookOpen, Sparkles, Scale, Droplets, Thermometer } from 'lucide-react';

export default function BrewGuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#FDFBF7]">
      
      {/* Header */}
      <div className="border-b border-[#2C2623] pb-6">
        <div className="inline-flex items-center gap-2 bg-[#2A2421] border border-[#C88A58]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#C88A58] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Barista Extraction Manual & Calculator</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#FDFBF7]">
          Artisan Brew Guides & Live Stopwatch
        </h1>
        <p className="text-xs text-[#A89F91] mt-1 max-w-2xl">
          Master the golden ratios of pour-over, immersion, and espresso. Adjust your coffee grounds dose dynamically to see live target water weights and follow our timed pour stages.
        </p>
      </div>

      {/* Main Interactive Guide & Calculator */}
      <BrewTimerCalculator />

    </div>
  );
}

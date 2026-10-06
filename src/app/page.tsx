'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coffee,
  Radio,
  Layers,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { MENU_ITEMS, SUBSCRIPTION_PLANS } from '../data/coffeeData';
import { MenuCard } from '../components/menu/MenuCard';
import { useOrder } from '../context/OrderContext';

export default function HomePage() {
  const { addToCart } = useOrder();
  const popularItems = MENU_ITEMS.filter((item) => item.isPopular).slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1917] via-[#14110F] to-[#14110F] border-b border-[#2C2623] pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-[#C88A58]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#965B32]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-[#2A2421] border border-[#C88A58]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#C88A58] shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Full-Stack Coffee Experience Suite</span>
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#FDFBF7] leading-[1.1]">
            Artisan Sips, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E58C3A] via-[#C88A58] to-[#F5EBE1]">
              Zero Wait Time.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#A89F91] max-w-2xl mx-auto leading-relaxed">
            Order single-origin micro-lots ahead on our mobile PWA, watch live barista extraction in real-time, or explore our curated Tasting Club with AI Sommelier guidance.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/order"
              className="bg-gradient-to-r from-[#C88A58] to-[#965B32] hover:from-[#DB9C69] hover:to-[#A8693A] text-[#14110F] font-bold text-sm py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-[#965B32]/30 transition-all hover:scale-105"
            >
              <Coffee className="w-4 h-4" />
              <span>Order Ahead (Menu)</span>
            </Link>

            <Link
              href="/kds"
              className="bg-[#24201D] hover:bg-[#332D29] border border-[#443B36] hover:border-[#E58C3A] text-[#FDFBF7] font-semibold text-sm py-3.5 px-6 rounded-2xl flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Barista KDS Display</span>
            </Link>
          </div>

          {/* Feature Highlights Pill Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-[#1C1917]/80 border border-[#2C2623] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#FDFBF7]">Click & Sip PWA</div>
                <div className="text-[10px] text-[#A89F91]">Offline & fast ordering</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1C1917]/80 border border-[#2C2623] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#FDFBF7]">Live Barista KDS</div>
                <div className="text-[10px] text-[#A89F91]">Sub-second ticket sync</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1C1917]/80 border border-[#2C2623] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#FDFBF7]">Tasting Club</div>
                <div className="text-[10px] text-[#A89F91]">Palate quiz & beans</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1C1917]/80 border border-[#2C2623] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#965B32]/20 text-[#C88A58]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#FDFBF7]">AI Sommelier</div>
                <div className="text-[10px] text-[#A89F91]">Dial-in & extraction AI</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Module Overview Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C88A58]">Explore the 3 Core Modules</span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#FDFBF7]">
            Built for Customers, Baristas & Coffee Connoisseurs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Click & Sip PWA */}
          <div className="bg-[#181513] border border-[#2E2824] hover:border-[#C88A58]/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#965B32]/10 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#965B32]/30 border border-[#C88A58]/40 flex items-center justify-center text-[#C88A58] group-hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C88A58]">Module 01</span>
                <h3 className="font-serif font-bold text-2xl text-[#FDFBF7] mt-1">"Click & Sip" Customer PWA</h3>
              </div>
              <p className="text-xs text-[#A89F91] leading-relaxed">
                Browse drink categories, configure milk, syrup pumps, and shots, pick ahead-of-time pickup windows, and track status live ("Brewing" &rarr; "Ready").
              </p>
              <div className="space-y-1.5 text-xs text-[#C9C1B5] pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Stripe & Apple Pay checkout simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>QR Pass & countdown timer</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#2E2824]">
              <Link
                href="/order"
                className="w-full bg-[#24201D] group-hover:bg-[#C88A58] text-[#C88A58] group-hover:text-[#14110F] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Launch Order Ahead</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Barista KDS */}
          <div className="bg-[#181513] border border-[#2E2824] hover:border-amber-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Module 02</span>
                <h3 className="font-serif font-bold text-2xl text-[#FDFBF7] mt-1">Barista Order Queue (KDS)</h3>
              </div>
              <p className="text-xs text-[#A89F91] leading-relaxed">
                Internal companion kitchen display system for baristas. Displays live tickets by station with queue time color coding and audio chimes.
              </p>
              <div className="space-y-1.5 text-xs text-[#C9C1B5] pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Cross-tab BroadcastChannel real-time sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>One-tap stage progression & Web Audio chime</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#2E2824]">
              <Link
                href="/kds"
                className="w-full bg-[#24201D] group-hover:bg-amber-500 text-amber-400 group-hover:text-[#14110F] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Launch Barista KDS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Subscription & Sommelier */}
          <div className="bg-[#181513] border border-[#2E2824] hover:border-[#C88A58]/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#965B32]/10 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#965B32]/30 border border-[#C88A58]/40 flex items-center justify-center text-[#C88A58] group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C88A58]">Module 03</span>
                <h3 className="font-serif font-bold text-2xl text-[#FDFBF7] mt-1">Tasting Club & AI Sommelier</h3>
              </div>
              <p className="text-xs text-[#A89F91] leading-relaxed">
                Interactive palate quiz to match roast profiles, customizable monthly deliveries, interactive brew stopwatch guides, and AI Sommelier assistant.
              </p>
              <div className="space-y-1.5 text-xs text-[#C9C1B5] pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Interactive 4-step flavor profile quiz</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Extraction troubleshooting & ratio calculators</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#2E2824]">
              <Link
                href="/subscription"
                className="w-full bg-[#24201D] group-hover:bg-[#C88A58] text-[#C88A58] group-hover:text-[#14110F] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Take Palate Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C88A58]">House Favorites</span>
            <h2 className="font-serif font-bold text-3xl text-[#FDFBF7] mt-1">Freshly Roasted & Pulled</h2>
          </div>
          <Link
            href="/order"
            className="text-xs font-bold text-[#C88A58] hover:text-[#DB9C69] flex items-center gap-1"
          >
            <span>View Full Menu & All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

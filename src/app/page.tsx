'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Coffee,
  Sparkles,
  ArrowRight,
  Heart,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Award,
  Radio,
  BookOpen,
  Layers,
  Flame,
  Zap,
  PackageCheck,
  Gift,
  Compass,
  Smile,
  QrCode,
  Ticket,
  ChevronRight,
  Palette,
  Stamp,
  MapPin,
  Cake,
  GraduationCap
} from 'lucide-react';
import { MENU_ITEMS, RECOMMENDED_PAIRINGS } from '../data/coffeeData';
import { MenuCard } from '../components/menu/MenuCard';
import { BookletMenuView } from '../components/menu/BookletMenuView';
import { CustomizationModal } from '../components/menu/CustomizationModal';
import { CoffeeQuizModal } from '../components/quiz/CoffeeQuizModal';
import { LuckyWheelModal } from '../components/rewards/LuckyWheelModal';
import { OriginMapModal } from '../components/origins/OriginMapModal';
import { LatteArtStudioModal } from '../components/latteart/LatteArtStudioModal';
import { LoyaltyStampCardModal } from '../components/loyalty/LoyaltyStampCardModal';
import { SeatingRadarModal } from '../components/seating/SeatingRadarModal';
import { CelebrationHubModal } from '../components/celebration/CelebrationHubModal';
import { WorkshopsModal } from '../components/workshops/WorkshopsModal';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { useOrder } from '../context/OrderContext';
import { MenuItem } from '../types/coffee';
import { playSoundEffect } from '../utils/sound';

export default function HomePage() {
  const { addToCart, addPairingToCart } = useOrder();
  const [viewMode, setViewMode] = useState<'booklet' | 'grid'>('booklet');
  const [selectedCustomItem, setSelectedCustomItem] = useState<MenuItem | null>(null);

  // Feature Modals State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLatteArtOpen, setIsLatteArtOpen] = useState(false);
  const [isStampCardOpen, setIsStampCardOpen] = useState(false);
  const [isSeatingRadarOpen, setIsSeatingRadarOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isWorkshopsOpen, setIsWorkshopsOpen] = useState(false);


  const featuredDrinks = MENU_ITEMS.filter((i) => i.isPopular).slice(0, 8);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedCustomItem(item);
  };

  return (
    <div className="space-y-16 text-[#2D2020]">
      
      {/* 1. HERO SECTION (Kawaii Chiikawa Cafe Aesthetic) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FCE4EC] via-[#FFF0F3] to-[#FFF5F6] py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#F8D7DF]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#F8D7DF] px-3.5 py-1 rounded-full text-xs font-bold text-[#E84A74] shadow-xs">
              <span>☕</span>
              <span>Specialty Coffee & Artisan Pairings</span>
            </div>
            
            <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-[#2D2020] leading-[1.15]">
              Welcome to <br />
              <span className="text-[#E84A74]">Deja Brew</span>
            </h1>

            {/* Ribbon flourish */}
            <div className="flex items-center gap-2 text-[#E84A74]">
              <span className="text-sm font-bold bg-[#FFD3DD] text-[#9E334D] px-3 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                KAWAII CRAFT COFFEE, HAPPY MOMENTS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#7A6767] max-w-lg leading-relaxed">
              Explore our expanded selection of craft coffees, single-origin pour-overs, artisanal snacks, decadent desserts, and curated barista pairings.
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/order"
                className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-105"
              >
                <Coffee className="w-4 h-4" />
                <span>Order Ahead (Menu)</span>
              </Link>
              
              <Link
                href="/track"
                className="bg-white hover:bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] font-bold text-xs py-3.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-xs hover:scale-105"
              >
                <PackageCheck className="w-4 h-4 text-[#E84A74]" />
                <span>Live Order Tracker</span>
              </Link>
            </div>

            {/* Interactive Feature Pills */}
            <div className="pt-3 border-t border-[#F8D7DF]/80 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setIsLatteArtOpen(true);
                  playSoundEffect('click');
                }}
                className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#F8D7DF] text-left transition-all hover:scale-102 flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#2D2020]">Latte Art Studio</div>
                  <div className="text-[9px] text-[#8C7575]">Draw on foam</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsStampCardOpen(true);
                  playSoundEffect('click');
                }}
                className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#F8D7DF] text-left transition-all hover:scale-102 flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Stamp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#2D2020]">Blossom Stamps</div>
                  <div className="text-[9px] text-[#8C7575]">6th cup free</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsSeatingRadarOpen(true);
                  playSoundEffect('click');
                }}
                className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#F8D7DF] text-left transition-all hover:scale-102 flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#2D2020]">Live Floor Map</div>
                  <div className="text-[9px] text-[#8C7575]">Radar seating</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsCelebrationOpen(true);
                  playSoundEffect('click');
                }}
                className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#F8D7DF] text-left transition-all hover:scale-102 flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cake className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#2D2020]">Celebration Hub</div>
                  <div className="text-[9px] text-[#8C7575]">Whole cakes</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsWorkshopsOpen(true);
                  playSoundEffect('click');
                }}
                className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#F8D7DF] text-left transition-all hover:scale-102 flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#2D2020]">Barista Guild</div>
                  <div className="text-[9px] text-[#8C7575]">Masterclasses</div>
                </div>
              </button>

              <Link
                href="/gift-cards"
                className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#F8D7DF] text-left transition-all hover:scale-102 flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#2D2020]">Gift Vouchers</div>
                  <div className="text-[9px] text-[#8C7575]">Send coffee</div>
                </div>
              </Link>
            </div>

          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FFF0F3]">
              <img
                src="/images/deja_brew_cafe.jpg"
                alt="Deja Brew artisan cafe"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-[#F8D7DF] flex items-center justify-between shadow-md">
                <div>
                  <div className="font-serif font-black text-xs text-[#2D2020]">Deja Brew Blossom Cafe</div>
                  <div className="text-[10px] text-[#8C7575]">Artisan specialty coffee & pairings</div>
                </div>
                <span className="bg-[#FFF0F3] text-[#E84A74] text-[10px] font-bold px-2 py-1 rounded-full border border-[#F8D7DF]">
                  Open Daily
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MENU BOOKLET SECTION (Interactive Chiikawa-style Menu Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* View Switcher Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#F8D7DF] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74]">
              Specialty Selection
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2020]">
              Deja Brew Specialty Menu
            </h2>
          </div>

          {/* Switcher */}
          <div className="flex items-center gap-1.5 bg-[#FFF0F3] p-1.5 rounded-2xl border border-[#F8D7DF]">
            <button
              onClick={() => setViewMode('booklet')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'booklet'
                  ? 'bg-[#E84A74] text-white shadow-xs'
                  : 'text-[#5D4A4A] hover:bg-[#FDE8ED]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Storybook Menu View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[#E84A74] text-white shadow-xs'
                  : 'text-[#5D4A4A] hover:bg-[#FDE8ED]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Card Grid View</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'booklet' ? (
          <BookletMenuView
            onSelectItem={handleSelectItem}
            onSelectPairing={(drink, snack) => addPairingToCart(drink, snack)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MENU_ITEMS.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={(it, cust, qty) => addToCart(it, cust, qty)}
              />
            ))}
          </div>
        )}

      </section>

      {/* 3. GIFT CARDS & VOUCHERS PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#FCE4EC] via-[#FFF0F3] to-[#F8D7DF] border-2 border-[#F8BBD0] rounded-3xl p-6 sm:p-10 shadow-lg">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/90 border border-[#F8D7DF] px-3.5 py-1 rounded-full text-xs font-bold text-[#E84A74]">
                <Gift className="w-3.5 h-3.5" />
                <span>Specialty Coffee Gifting</span>
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#2D2020]">
                Send a Pink Ribbon <br />
                <span className="text-[#E84A74]">Deja Brew Coffee Voucher</span>
              </h3>

              <p className="text-xs sm:text-sm text-[#6B5151] max-w-lg leading-relaxed">
                Gift fresh roast experiences, silky microfoam lattes, and artisan baked pastries to your friends & family. Customizable values with instant redeemable codes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/gift-cards"
                  className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-105"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Design & Send Gift Pass</span>
                </Link>

                <button
                  onClick={() => {
                    setIsWheelOpen(true);
                    playSoundEffect('click');
                  }}
                  className="bg-white hover:bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] font-bold text-xs py-3.5 px-5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-[#E84A74]" />
                  <span>Win Daily Discount (Wheel)</span>
                </button>
              </div>
            </div>

            {/* Voucher Mini Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-[#FFF0F5] border-2 border-white rounded-2xl p-4 shadow-xl text-[#4A2828] space-y-3 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-2">
                  <div className="font-serif font-black text-sm text-[#E84A74]">Deja Brew Gift Voucher</div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">₹500</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#F8D7DF] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#8C7575]">PROMO CODE</div>
                    <div className="font-mono font-black text-xs text-[#2D2020]">DEJA-RIBBON-500</div>
                  </div>
                  <QrCode className="w-8 h-8 text-[#E84A74]" />
                </div>
                <div className="text-[10px] text-center italic text-[#8C7575]">
                  "Enjoy specialty coffee & pastries on me! 🌸"
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CURATED PAIRINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74]">
            Artisan Synergy
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2020]">
            Recommended Barista Pairings
          </h2>
          <p className="text-xs text-[#8C7575] max-w-md mx-auto">
            Science-backed flavor combinations crafted by our head barista and pastry chef.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOMMENDED_PAIRINGS.slice(0, 6).map((pair) => {
            const drink = MENU_ITEMS.find((i) => i.id === pair.drinkId) || MENU_ITEMS[0];
            const snack = MENU_ITEMS.find((i) => i.id === pair.snackId) || MENU_ITEMS[20];

            return (
              <div
                key={pair.id}
                className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden mb-3 border border-[#F8D7DF]">
                    <img
                      src={pair.image}
                      alt={`${pair.drinkName} pairing`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[#E84A74] text-[10px] font-bold px-2 py-1 rounded-full shadow-xs">
                      Save ₹{pair.savings}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-base text-[#2D2020]">
                    {pair.drinkName} + {pair.snackName}
                  </h3>

                  <p className="text-xs text-[#7A6767] mt-1 line-clamp-2">
                    {pair.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F8D7DF]">
                  <div>
                    <span className="text-[10px] text-[#8C7575] block">Combo Price</span>
                    <span className="font-mono font-bold text-base text-[#E84A74]">
                      ₹{pair.comboPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => addPairingToCart(drink, snack)}
                    className="bg-[#FFF0F3] hover:bg-[#E84A74] text-[#E84A74] hover:text-white font-bold text-xs py-2 px-4 rounded-xl border border-[#F8D7DF] transition-all flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add Duo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE CAFE DISCOVERY LOUNGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74]">
            Interactive Cafe Lounge
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2020]">
            Experience Deja Brew Beyond the Cup 🌸
          </h2>
          <p className="text-xs text-[#8C7575] max-w-md mx-auto">
            From digital latte foam painting to interactive cafe seating radars and weekend masterclasses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Latte Art Studio */}
          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:scale-102">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2020]">Latte Art Studio</h3>
              <p className="text-xs text-[#7A6767]">
                Freeform foam drawing canvas & barista etching stencils. Save your latte masterwork!
              </p>
            </div>
            <button
              onClick={() => {
                setIsLatteArtOpen(true);
                playSoundEffect('click');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#FFF0F3] text-[#E84A74] font-bold text-xs hover:bg-[#E84A74] hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Blossom Stamp Card */}
          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:scale-102">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center">
                <Stamp className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2020]">Blossom Loyalty Stamps</h3>
              <p className="text-xs text-[#7A6767]">
                Collect digital cherry blossom stamps with every sip. 6th cup is completely on us!
              </p>
            </div>
            <button
              onClick={() => {
                setIsStampCardOpen(true);
                playSoundEffect('click');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#FFF0F3] text-[#E84A74] font-bold text-xs hover:bg-[#E84A74] hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Stamp Card</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Seating Radar */}
          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:scale-102">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2020]">Live Floor Radar</h3>
              <p className="text-xs text-[#7A6767]">
                Real-time cafe table occupancy, socket availability, garden terrace and window booth status.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSeatingRadarOpen(true);
                playSoundEffect('click');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#FFF0F3] text-[#E84A74] font-bold text-xs hover:bg-[#E84A74] hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Floor Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Weekend Masterclasses */}
          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:scale-102">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#E84A74] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D2020]">Barista Workshops</h3>
              <p className="text-xs text-[#7A6767]">
                Sensory cupping, latte art bootcamp, and manual pour-over precision dialing with certified Q-graders.
              </p>
            </div>
            <button
              onClick={() => {
                setIsWorkshopsOpen(true);
                playSoundEffect('click');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#FFF0F3] text-[#E84A74] font-bold text-xs hover:bg-[#E84A74] hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Book Masterclass</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS & COMMUNITY PHOTO WALL */}
      <ReviewsSection />

      {/* FOOTER */}
      <footer className="bg-[#4A2828] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 text-xs">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5 shadow-xs">
                <img src="/icon.png" alt="Deja Brew" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-serif font-black text-lg text-white">Deja Brew</span>
            </div>
            <p className="text-white/90 leading-relaxed text-[11px]">
              Deja Brew • Artisan Specialty Coffee, Single-Origins & Curated Bakery Pairings.
            </p>
          </div>

          <div className="space-y-2 text-white/90">
            <h4 className="font-bold text-white text-xs mb-1">Explore</h4>
            <div><Link href="/" className="hover:underline">Home Menu</Link></div>
            <div><Link href="/order" className="hover:underline">Order Ahead (PWA)</Link></div>
            <div><Link href="/track" className="hover:underline">Live Order Tracker</Link></div>
            <div><Link href="/gift-cards" className="hover:underline">Gift Cards & Vouchers</Link></div>
            <div><Link href="/subscription" className="hover:underline">Coffee Tasting Club</Link></div>
          </div>

          <div className="space-y-2 text-white/90">
            <h4 className="font-bold text-white text-xs mb-1">Interactive & Crafts</h4>
            <div><button onClick={() => setIsLatteArtOpen(true)} className="hover:underline text-left">Latte Art Foam Canvas</button></div>
            <div><button onClick={() => setIsStampCardOpen(true)} className="hover:underline text-left">Blossom Loyalty Stamps</button></div>
            <div><button onClick={() => setIsSeatingRadarOpen(true)} className="hover:underline text-left">Live Seating Floor Map</button></div>
            <div><button onClick={() => setIsCelebrationOpen(true)} className="hover:underline text-left">Celebration Cakes Hub</button></div>
            <div><button onClick={() => setIsWorkshopsOpen(true)} className="hover:underline text-left">Barista Masterclasses</button></div>
            <div><button onClick={() => setIsWheelOpen(true)} className="hover:underline text-left">Daily Lucky Wheel</button></div>
            <div><Link href="/brew-guides" className="hover:underline">Brew Stopwatch & Ratios</Link></div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs mb-1">Newsletter</h4>
            <p className="text-white/90 text-[11px]">
              Subscribe for micro-lot roast drops & pairing specials!
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white text-[#2D2020] text-xs px-3 py-2 rounded-lg focus:outline-none placeholder-[#A88C8C]"
              />
              <button
                type="button"
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-xs"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-4 border-t border-white/20 text-center text-[10px] text-white/80 flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Deja Brew Coffee. All Rights Reserved.</span>
          <Link
            href="/kds"
            className="opacity-20 hover:opacity-90 transition-opacity text-white hover:text-white cursor-default"
            aria-label="Staff Terminal"
            title=""
          >
            •
          </Link>
        </div>
      </footer>

      {/* Modals */}
      {selectedCustomItem && (
        <CustomizationModal
          item={selectedCustomItem}
          isOpen={!!selectedCustomItem}
          onClose={() => setSelectedCustomItem(null)}
          onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
        />
      )}

      {/* Flavour Matcher Quiz Modal */}
      <CoffeeQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
      />

      {/* Bean to Cup Origin Map Modal */}
      <OriginMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      {/* Latte Art Foam Canvas Studio */}
      <LatteArtStudioModal
        isOpen={isLatteArtOpen}
        onClose={() => setIsLatteArtOpen(false)}
      />

      {/* Blossom Loyalty Stamp Punch Card */}
      <LoyaltyStampCardModal
        isOpen={isStampCardOpen}
        onClose={() => setIsStampCardOpen(false)}
      />

      {/* Live Seating Radar Floor Map */}
      <SeatingRadarModal
        isOpen={isSeatingRadarOpen}
        onClose={() => setIsSeatingRadarOpen(false)}
      />

      {/* Celebration Whole Cakes & Party Box Hub */}
      <CelebrationHubModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
      />

      {/* Barista Masterclasses & Cupping Workshops */}
      <WorkshopsModal
        isOpen={isWorkshopsOpen}
        onClose={() => setIsWorkshopsOpen(false)}
      />

    </div>
  );
}


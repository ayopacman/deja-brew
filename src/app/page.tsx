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
  Zap
} from 'lucide-react';
import { MENU_ITEMS, RECOMMENDED_PAIRINGS } from '../data/coffeeData';
import { MenuCard } from '../components/menu/MenuCard';
import { BookletMenuView } from '../components/menu/BookletMenuView';
import { CustomizationModal } from '../components/menu/CustomizationModal';
import { useOrder } from '../context/OrderContext';
import { MenuItem, CustomizationOptions } from '../types/coffee';

export default function HomePage() {
  const { addToCart, addPairingToCart } = useOrder();
  const [viewMode, setViewMode] = useState<'booklet' | 'grid'>('booklet');
  const [selectedCustomItem, setSelectedCustomItem] = useState<MenuItem | null>(null);

  const featuredDrinks = MENU_ITEMS.filter((i) => i.isPopular).slice(0, 8);

  const handleSelectItem = (item: MenuItem) => {
    if (item.isCustomizable) {
      setSelectedCustomItem(item);
    } else {
      addToCart(
        item,
        item.defaultCustomization || {
          milk: 'none',
          shots: 'single',
          syrup: 'none',
          syrupPumps: 0,
          temp: 'hot',
          sweetness: '0%',
        },
        1
      );
    }
  };

  return (
    <div className="space-y-16 text-[#2D2020]">
      
      {/* 1. HERO SECTION (Kawaii Chiikawa Cafe Aesthetic) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FCE4EC] via-[#FFF0F3] to-[#FFF5F6] py-12 md:py-18 px-4 sm:px-6 lg:px-8 border-b border-[#F8D7DF]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#F8D7DF] px-3.5 py-1 rounded-full text-xs font-bold text-[#E84A74] shadow-xs">
              <span>☕</span>
              <span>Specialty Coffee & Artisan Pairings</span>
            </div>
            
            <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-[#2D2020] leading-[1.15]">
              Welcome to <br />
              <span className="text-[#E84A74]">deja brew</span>
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

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/order"
                className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-105"
              >
                <Coffee className="w-4 h-4" />
                <span>Order Ahead (Menu)</span>
              </Link>
              
              <Link
                href="/kds"
                className="bg-white hover:bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] font-bold text-xs py-3.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-xs"
              >
                <Radio className="w-4 h-4 text-[#E84A74]" />
                <span>Barista KDS Display</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FFF0F3]">
              <img
                src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80"
                alt="deja brew craft coffee"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-[#F8D7DF] flex items-center justify-between">
                <div>
                  <div className="font-serif font-black text-xs text-[#2D2020]">Honey Lavender Latte</div>
                  <div className="text-[10px] text-[#8C7575]">Infused with organic lavender buds</div>
                </div>
                <span className="font-mono font-bold text-sm text-[#E84A74]">₹350</span>
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
              The Daily Grind Menu
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

        {/* Display selected view */}
        {viewMode === 'booklet' ? (
          <BookletMenuView
            onSelectItem={handleSelectItem}
            onSelectPairing={(drink, snack) => addPairingToCart(drink, snack)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredDrinks.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
              />
            ))}
          </div>
        )}

      </section>

      {/* 3. RECOMMENDED PAIRINGS HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF0F3] border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E84A74] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Barista Curations</span>
            </div>
            <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
              Signature Coffee & Dessert Pairings
            </h3>
            <p className="text-xs text-[#7A6767]">
              Every coffee on our menu is paired scientifically with an artisanal snack to enhance sweetness and balance body.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDED_PAIRINGS.slice(0, 3).map((pair) => {
              const drink = MENU_ITEMS.find((m) => m.id === pair.drinkId) || MENU_ITEMS[0];
              const snack = MENU_ITEMS.find((m) => m.id === pair.snackId) || MENU_ITEMS[20];

              return (
                <div
                  key={pair.id}
                  className="bg-white border border-[#F8D7DF] rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#E84A74] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#E84A74]">{pair.drinkName}</span>
                      <span className="text-[10px] text-[#8C7575] font-bold">+</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#2D2020]">{pair.snackName}</h4>
                    <p className="text-[11px] text-[#7A6767] leading-relaxed line-clamp-2">
                      {pair.reason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F8D7DF] flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#E84A74]">₹{pair.comboPrice}</span>
                      <span className="text-[9px] text-emerald-600 block font-bold">Save ₹{pair.savings}</span>
                    </div>

                    <button
                      onClick={() => addPairingToCart(drink, snack)}
                      className="bg-[#E84A74] hover:bg-[#D43862] text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xs transition-transform hover:scale-105"
                    >
                      Add Pairing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE DEJA BREW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#2D2020]">Micro-Lot Origins</h4>
              <p className="text-[11px] text-[#7A6767] mt-0.5">Direct trade beans roasted in small weekly batches.</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#2D2020]">Artisanal Bakery</h4>
              <p className="text-[11px] text-[#7A6767] mt-0.5">Truffles, biscotti, croissants, and cheesecakes baked fresh.</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#2D2020]">Zero-Wait Pickup</h4>
              <p className="text-[11px] text-[#7A6767] mt-0.5">Order ahead on PWA and grab hot drinks on the counter.</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#F8D7DF] flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-[#FDE8ED] text-[#E84A74] shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#2D2020]">Live Kitchen Display</h4>
              <p className="text-[11px] text-[#7A6767] mt-0.5">Sub-second barista ticket queue synchronization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative bg-[#FF8EA8] text-[#3D2727] pt-8 pb-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E84A74]">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif font-black text-lg text-white">deja brew</span>
            </div>
            <p className="text-white/90 leading-relaxed text-[11px]">
              The Daily Grind • Artisan Coffee, Specialty Single-Origins & Curated Bakery Pairings.
            </p>
          </div>

          <div className="space-y-2 text-white/90">
            <h4 className="font-bold text-white text-xs mb-1">Quick Links</h4>
            <div><Link href="/" className="hover:underline">Home Menu</Link></div>
            <div><Link href="/order" className="hover:underline">Order Ahead (PWA)</Link></div>
            <div><Link href="/track" className="hover:underline">Live Order Tracker</Link></div>
            <div><Link href="/subscription" className="hover:underline">Coffee Tasting Club</Link></div>
          </div>

          <div className="space-y-2 text-white/90">
            <h4 className="font-bold text-white text-xs mb-1">Barista Tools</h4>
            <div><Link href="/kds" className="hover:underline">Barista KDS Screen</Link></div>
            <div><Link href="/brew-guides" className="hover:underline">Brew Stopwatch & Ratios</Link></div>
            <div><Link href="/subscription" className="hover:underline">Palate Flavor Quiz</Link></div>
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

        <div className="max-w-7xl mx-auto pt-4 border-t border-white/20 text-center text-[10px] text-white/80">
          © {new Date().getFullYear()} Deja Brew Coffee. All Rights Reserved.
        </div>
      </footer>

      {/* Customization Modal */}
      {selectedCustomItem && (
        <CustomizationModal
          item={selectedCustomItem}
          isOpen={!!selectedCustomItem}
          onClose={() => setSelectedCustomItem(null)}
          onAddToCart={(item, cust, qty) => addToCart(item, cust, qty)}
        />
      )}

    </div>
  );
}

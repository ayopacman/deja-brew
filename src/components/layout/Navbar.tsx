'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, ShoppingBag, Sparkles, Radio, Layers, BookOpen, Heart } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

interface NavbarProps {
  onOpenSommelier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSommelier }) => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, orders } = useOrder();
  const activeKdsCount = orders.filter((o) => o.status === 'received' || o.status === 'brewing').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F8D7DF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Deja Brew */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E84A74] to-[#FF8EA8] p-2 flex items-center justify-center shadow-md shadow-[#E84A74]/20 group-hover:scale-105 transition-transform text-white">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-black text-xl tracking-tight text-[#E84A74] flex items-center gap-1.5">
              <span>deja brew</span>
              <span className="text-[9px] bg-[#FFF0F3] text-[#E84A74] border border-[#F8D7DF] font-sans font-bold px-1.5 py-0.2 rounded-full">
                COFFEE
              </span>
            </div>
            <p className="text-[10px] text-[#A88C8C] tracking-wide font-sans -mt-0.5">Specialty Coffee & Pairings</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#5D4A4A]">
          <Link
            href="/"
            className={`transition-colors hover:text-[#E84A74] relative py-1 ${
              pathname === '/' ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/order"
            className={`transition-colors hover:text-[#E84A74] relative py-1 ${
              pathname.startsWith('/order') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
            }`}
          >
            Daily Grind Menu
          </Link>
          <Link
            href="/track"
            className={`transition-colors hover:text-[#E84A74] relative py-1 ${
              pathname.startsWith('/track') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
            }`}
          >
            Live Pickup Tracker
          </Link>
          <Link
            href="/subscription"
            className={`transition-colors hover:text-[#E84A74] relative py-1 ${
              pathname.startsWith('/subscription') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
            }`}
          >
            Coffee & Snack Club
          </Link>
          <Link
            href="/brew-guides"
            className={`transition-colors hover:text-[#E84A74] relative py-1 ${
              pathname.startsWith('/brew-guides') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
            }`}
          >
            Brew Stopwatch
          </Link>
          <Link
            href="/kds"
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
              pathname === '/kds'
                ? 'bg-[#E84A74] text-white border-[#E84A74]'
                : 'bg-[#FFF0F3] text-[#E84A74] border-[#F8D7DF] hover:bg-[#FDE8ED]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#E84A74]" />
            <span>Barista KDS</span>
            {activeKdsCount > 0 && (
              <span className="bg-[#E84A74] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                {activeKdsCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right Header Icons */}
        <div className="flex items-center gap-3">
          {/* AI Advisor button */}
          <button
            onClick={onOpenSommelier}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] text-xs font-semibold hover:bg-[#FDE8ED] transition-all"
            title="Ask Deja Brew AI Coffee Sommelier"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Sommelier</span>
          </button>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-[#FFF0F3] text-[#E84A74] hover:bg-[#FDE8ED] transition-colors border border-[#F8D7DF]"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E84A74] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

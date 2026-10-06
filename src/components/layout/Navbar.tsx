'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, ShoppingBag, Radio, Sparkles, BookOpen, PackageCheck, Layers } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

interface NavbarProps {
  onOpenSommelier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSommelier }) => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, activeOrder, orders } = useOrder();

  const activeOrdersCount = orders.filter((o) => o.status === 'received' || o.status === 'brewing').length;
  const isOrderActive = activeOrder && (activeOrder.status === 'received' || activeOrder.status === 'brewing' || activeOrder.status === 'ready');

  return (
    <header className="sticky top-0 z-40 bg-[#14110F]/95 backdrop-blur-md border-b border-[#2C2623] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C88A58] to-[#965B32] p-0.5 flex items-center justify-center shadow-lg shadow-[#965B32]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#14110F] rounded-[10px] flex items-center justify-center">
              <Coffee className="w-5 h-5 text-[#C88A58]" />
            </div>
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight flex items-center gap-1.5 font-serif text-[#FDFBF7]">
              <span>CLICK & SIP</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#965B32]/30 text-[#C88A58] font-sans font-medium">PWA</span>
            </div>
            <p className="text-[10px] text-[#A89F91] tracking-wider uppercase font-sans">Artisan Roastery & Order Queue</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1C1917]/80 p-1.5 rounded-full border border-[#2C2623]">
          <Link
            href="/order"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              pathname === '/order' || pathname === '/'
                ? 'bg-[#965B32] text-white shadow-sm'
                : 'text-[#C9C1B5] hover:text-white hover:bg-[#2C2623]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Order Menu</span>
          </Link>

          <Link
            href="/track"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 relative ${
              pathname.startsWith('/track')
                ? 'bg-[#965B32] text-white shadow-sm'
                : 'text-[#C9C1B5] hover:text-white hover:bg-[#2C2623]'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Live Tracker</span>
            {isOrderActive && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E58C3A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E58C3A]"></span>
              </span>
            )}
          </Link>

          <Link
            href="/subscription"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              pathname.startsWith('/subscription')
                ? 'bg-[#965B32] text-white shadow-sm'
                : 'text-[#C9C1B5] hover:text-white hover:bg-[#2C2623]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tasting Club</span>
          </Link>

          <Link
            href="/brew-guides"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              pathname.startsWith('/brew-guides')
                ? 'bg-[#965B32] text-white shadow-sm'
                : 'text-[#C9C1B5] hover:text-white hover:bg-[#2C2623]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Brew Guides</span>
          </Link>

          <Link
            href="/kds"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-1.5 border ${
              pathname === '/kds'
                ? 'bg-[#E58C3A] text-[#14110F] border-[#E58C3A]'
                : 'bg-[#2A2421] text-[#E58C3A] border-[#E58C3A]/30 hover:border-[#E58C3A]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Barista KDS</span>
            {activeOrdersCount > 0 && (
              <span className="bg-[#14110F] text-[#E58C3A] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeOrdersCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* AI Sommelier Button */}
          <button
            onClick={onOpenSommelier}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#965B32]/30 to-[#C88A58]/20 border border-[#C88A58]/40 hover:border-[#C88A58] text-[#FDFBF7] text-xs font-medium transition-all hover:scale-105"
            title="Ask AI Coffee Sommelier"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E58C3A]" />
            <span>AI Sommelier</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-[#2C2623] hover:bg-[#3D3531] text-[#FDFBF7] px-4 py-2 rounded-xl border border-[#443B36] transition-all"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#C88A58]" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="bg-[#C88A58] text-[#14110F] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

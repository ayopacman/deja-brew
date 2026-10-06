'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, ShoppingBag, Sparkles, Layers, BookOpen, Heart, Palette, Paintbrush } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useTheme } from '../../context/ThemeContext';
import { playSoundEffect } from '../../utils/sound';
import { StaffLoginModal } from '../kds/StaffLoginModal';
import { LatteArtStudioModal } from '../latteart/LatteArtStudioModal';

interface NavbarProps {
  onOpenSommelier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSommelier }) => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useOrder();
  const { theme, toggleTheme } = useTheme();

  // Modals state
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isLatteArtOpen, setIsLatteArtOpen] = useState(false);
  
  // Triple-click tracking on brand logo
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      e.preventDefault();
      clickCountRef.current = 0;
      playSoundEffect('click');
      setIsStaffModalOpen(true);
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  };

  // Global keyboard shortcut (Ctrl + Shift + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsStaffModalOpen((prev) => !prev);
        playSoundEffect('click');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F8D7DF] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo - Deja Brew (Triple click triggers secret staff login) */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="Deja Brew Coffee"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-[#E84A74]/20 border border-[#F8D7DF] bg-[#FFF0F3] group-hover:scale-105 transition-transform flex items-center justify-center p-0.5">
              <img
                src="/icon.png"
                alt="Deja Brew Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="font-serif font-black text-xl tracking-tight text-[#E84A74] flex items-center gap-1.5">
                <span>Deja Brew</span>
                <span className="text-[9px] bg-[#FFF0F3] text-[#E84A74] border border-[#F8D7DF] font-sans font-bold px-1.5 py-0.2 rounded-full">
                  COFFEE
                </span>
              </div>
              <p className="text-[10px] text-[#A88C8C] tracking-wide font-sans -mt-0.5">Specialty Coffee & Pairings</p>
            </div>
          </Link>

          {/* Customer Navigation Links (Clean & Airy) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#5D4A4A]">
            <Link
              href="/order"
              className={`transition-colors hover:text-[#E84A74] relative py-1 ${
                pathname.startsWith('/order') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
              }`}
            >
              Menu
            </Link>
            <Link
              href="/track"
              className={`transition-colors hover:text-[#E84A74] relative py-1 ${
                pathname.startsWith('/track') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
              }`}
            >
              Live Tracker
            </Link>
            <button
              onClick={() => {
                setIsLatteArtOpen(true);
                playSoundEffect('click');
              }}
              className="transition-colors hover:text-[#E84A74] relative py-1 flex items-center gap-1 text-[#5D4A4A] cursor-pointer"
            >
              <span>🎨 Latte Art Studio</span>
            </button>
            <Link
              href="/subscription"
              className={`transition-colors hover:text-[#E84A74] relative py-1 ${
                pathname.startsWith('/subscription') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
              }`}
            >
              Tasting Club
            </Link>
            <Link
              href="/gift-cards"
              className={`transition-colors hover:text-[#E84A74] relative py-1 ${
                pathname.startsWith('/gift-cards') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
              }`}
            >
              Gift Cards
            </Link>
            <Link
              href="/brew-guides"
              className={`transition-colors hover:text-[#E84A74] relative py-1 ${
                pathname.startsWith('/brew-guides') ? 'text-[#E84A74] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E84A74]' : ''
              }`}
            >
              Brew Stopwatch
            </Link>
          </nav>

          {/* Right Header Icons (Decluttered & Balanced) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Draw Latte Art Foam Button */}
            <button
              onClick={() => {
                setIsLatteArtOpen(true);
                playSoundEffect('click');
              }}
              className="w-9 h-9 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] border border-[#F8D7DF] text-[#E84A74] flex items-center justify-center transition-all shadow-2xs hover:scale-105"
              title="Draw Latte Art Foam"
              aria-label="Draw Latte Art"
            >
              <Paintbrush className="w-4 h-4" />
            </button>

            {/* Compact Theme Switcher Pill */}
            <button
              onClick={() => {
                toggleTheme();
                playSoundEffect('click');
              }}
              className="w-9 h-9 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] border border-[#F8D7DF] text-sm flex items-center justify-center transition-all shadow-2xs hover:scale-105"
              title="Switch Cafe Theme"
            >
              <span>{theme === 'blossom' ? '🌸' : theme === 'matcha' ? '🍵' : '☕'}</span>
            </button>

            {/* AI Advisor button */}
            <button
              onClick={onOpenSommelier}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] text-xs font-semibold hover:bg-[#FDE8ED] transition-all shadow-2xs hover:scale-105"
              title="Ask Deja Brew AI Coffee Sommelier"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Sommelier</span>
            </button>

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#FFF0F3] text-[#E84A74] hover:bg-[#FDE8ED] transition-colors border border-[#F8D7DF] shadow-2xs hover:scale-105"
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

      {/* Latte Art Foam Drawing Modal */}
      <LatteArtStudioModal
        isOpen={isLatteArtOpen}
        onClose={() => setIsLatteArtOpen(false)}
      />

      {/* Secret Staff Passkey Login Modal */}
      <StaffLoginModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />
    </>
  );
};



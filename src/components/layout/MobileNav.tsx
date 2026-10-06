'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, PackageCheck, Layers, Radio, Sparkles } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

interface MobileNavProps {
  onOpenSommelier: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSommelier }) => {
  const pathname = usePathname();
  const { activeOrder, orders } = useOrder();

  const isOrderActive = activeOrder && (activeOrder.status === 'received' || activeOrder.status === 'brewing' || activeOrder.status === 'ready');
  const activeKdsCount = orders.filter((o) => o.status === 'received' || o.status === 'brewing').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14110F]/95 backdrop-blur-lg border-t border-[#2C2623] px-2 py-1.5 flex items-center justify-around text-[#A89F91]">
      <Link
        href="/order"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          pathname === '/order' || pathname === '/' ? 'text-[#E58C3A]' : 'hover:text-[#FDFBF7]'
        }`}
      >
        <Coffee className="w-5 h-5 mb-0.5" />
        <span>Menu</span>
      </Link>

      <Link
        href="/track"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors relative ${
          pathname.startsWith('/track') ? 'text-[#E58C3A]' : 'hover:text-[#FDFBF7]'
        }`}
      >
        <div className="relative">
          <PackageCheck className="w-5 h-5 mb-0.5" />
          {isOrderActive && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E58C3A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E58C3A]"></span>
            </span>
          )}
        </div>
        <span>Track</span>
      </Link>

      <button
        onClick={onOpenSommelier}
        className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium text-[#E58C3A] hover:text-[#FDFBF7] transition-colors"
      >
        <div className="p-1 rounded-full bg-[#965B32]/30 border border-[#C88A58]/50">
          <Sparkles className="w-4 h-4 text-[#E58C3A]" />
        </div>
        <span>AI Ask</span>
      </button>

      <Link
        href="/subscription"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          pathname.startsWith('/subscription') ? 'text-[#E58C3A]' : 'hover:text-[#FDFBF7]'
        }`}
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span>Club</span>
      </Link>

      <Link
        href="/kds"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors relative ${
          pathname === '/kds' ? 'text-[#E58C3A] font-bold' : 'hover:text-[#FDFBF7]'
        }`}
      >
        <div className="relative">
          <Radio className="w-5 h-5 mb-0.5 text-amber-500 animate-pulse" />
          {activeKdsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#E58C3A] text-[#14110F] text-[9px] font-black px-1 rounded-full">
              {activeKdsCount}
            </span>
          )}
        </div>
        <span>KDS</span>
      </Link>
    </nav>
  );
};

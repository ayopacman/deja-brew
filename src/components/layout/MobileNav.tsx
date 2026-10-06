import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, PackageCheck, Sparkles, Heart } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

interface MobileNavProps {
  onOpenSommelier: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSommelier }) => {
  const pathname = usePathname();
  const { activeOrder } = useOrder();

  const isOrderActive = activeOrder && (activeOrder.status === 'received' || activeOrder.status === 'brewing' || activeOrder.status === 'ready');

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#F8D7DF] px-2 py-2 flex items-center justify-around text-[#8C7575] shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          pathname === '/' ? 'text-[#E84A74] font-bold' : 'hover:text-[#E84A74]'
        }`}
      >
        <Coffee className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </Link>

      <Link
        href="/order"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          pathname === '/order' ? 'text-[#E84A74] font-bold' : 'hover:text-[#E84A74]'
        }`}
      >
        <Coffee className="w-5 h-5 mb-0.5" />
        <span>Menu</span>
      </Link>

      <button
        onClick={onOpenSommelier}
        className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium text-[#E84A74]"
      >
        <div className="p-1.5 rounded-full bg-[#FDE8ED] text-[#E84A74]">
          <Sparkles className="w-4 h-4" />
        </div>
        <span>AI Sommelier</span>
      </button>

      <Link
        href="/track"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors relative ${
          pathname.startsWith('/track') ? 'text-[#E84A74] font-bold' : 'hover:text-[#E84A74]'
        }`}
      >
        <div className="relative">
          <PackageCheck className="w-5 h-5 mb-0.5" />
          {isOrderActive && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E84A74] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E84A74]"></span>
            </span>
          )}
        </div>
        <span>Track</span>
      </Link>

      <Link
        href="/subscription"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors relative ${
          pathname === '/subscription' ? 'text-[#E84A74] font-bold' : 'hover:text-[#E84A74]'
        }`}
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span>Club</span>
      </Link>
    </nav>
  );
};

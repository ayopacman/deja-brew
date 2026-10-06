'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrder } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types/coffee';
import {
  Clock,
  CheckCircle2,
  Coffee,
  Sparkles,
  QrCode,
  ArrowRight,
  Flame,
  Volume2,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { playSoundEffect } from '../../utils/sound';

export const OrderTracker: React.FC = () => {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');

  const { orders, getOrderById, updateOrderStatus, activeOrder } = useOrder();

  // Find order by searchParam id or latest active order
  const order: Order | undefined = requestedId
    ? getOrderById(requestedId)
    : activeOrder || orders[0];

  const [timeLeftSec, setTimeLeftSec] = useState<number>(360);

  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      const remainingMs = order.estimatedReadyTime - Date.now();
      const secs = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeftSec(secs);
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center text-[#FDFBF7]">
        <div className="w-16 h-16 rounded-2xl bg-[#24201D] mx-auto flex items-center justify-center text-[#6E645C] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl mb-2">No Active Order Found</h2>
        <p className="text-xs text-[#A89F91] mb-6">
          You haven't placed an order yet or your session was cleared. Browse our artisan menu and order ahead!
        </p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 bg-[#965B32] hover:bg-[#C88A58] text-white text-xs font-bold py-3 px-6 rounded-xl transition-all"
        >
          <span>Explore Order Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const stages: {
    key: OrderStatus;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: 'received',
      title: 'Ticket Queued',
      description: 'Order sent to Barista KDS display',
      icon: Clock,
    },
    {
      key: 'brewing',
      title: 'Grinding & Brewing',
      description: 'Barista pulling espresso & steaming milk',
      icon: Flame,
    },
    {
      key: 'ready',
      title: 'Ready at Pickup Bar',
      description: 'Hot and ready on the handoff counter',
      icon: Coffee,
    },
    {
      key: 'collected',
      title: 'Collected',
      description: 'Picked up by customer',
      icon: CheckCircle2,
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'brewing':
        return 1;
      case 'ready':
        return 2;
      case 'collected':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(order.status);
  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 text-[#FDFBF7]">
      
      {/* Top Header Card */}
      <div className="bg-[#1C1917] border border-[#2E2824] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#C88A58]/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2824] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-[#C88A58] bg-[#965B32]/20 px-2.5 py-0.5 rounded-full border border-[#C88A58]/30">
                Order {order.orderNumber}
              </span>
              <span className="text-xs text-[#A89F91]">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#FDFBF7] mt-1">
              {order.customerName}'s Order
            </h1>
          </div>

          {/* Live Status Badge */}
          <div className="flex items-center gap-3">
            {order.status === 'ready' ? (
              <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-2xl flex items-center gap-2 animate-pulse shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Ready on Counter!</div>
                  <div className="text-[10px] text-emerald-400">Head to handoff station</div>
                </div>
              </div>
            ) : order.status === 'brewing' ? (
              <div className="bg-amber-950/80 border border-amber-500 text-amber-300 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/10">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Brewing Now</div>
                  <div className="text-[10px] text-amber-400">~{minutes}m {seconds}s remaining</div>
                </div>
              </div>
            ) : (
              <div className="bg-[#24201D] border border-[#3E352F] text-[#C9C1B5] px-4 py-2 rounded-2xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C88A58]" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Ticket In Queue</div>
                  <div className="text-[10px] text-[#A89F91]">Scheduled for {order.pickupTime}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="py-6">
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Connecting Bar */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-[#2E2824] -z-0">
              <div
                className="h-full bg-gradient-to-r from-[#C88A58] to-emerald-400 transition-all duration-700"
                style={{
                  width: `${(currentIndex / (stages.length - 1)) * 100}%`,
                }}
              />
            </div>

            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent
                        ? 'bg-[#C88A58] border-white text-[#14110F] ring-4 ring-[#C88A58]/20 scale-110'
                        : isPast
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-[#1C1917] border-[#3E352F] text-[#6E645C]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-2.5">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-[#C88A58]' : isPast ? 'text-emerald-400' : 'text-[#6E645C]'
                      }`}
                    >
                      {stage.title}
                    </p>
                    <p className="text-[10px] text-[#A89F91] hidden sm:block mt-0.5 max-w-[120px]">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barcode / QR Pickup Proof */}
        <div className="mt-4 p-4 bg-[#14110F] border border-[#2E2824] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <QrCode className="w-12 h-12 text-black" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#FDFBF7]">Digital Pickup Pass</p>
              <p className="text-[11px] text-[#A89F91]">
                Show QR code or mention <b className="text-[#C88A58]">{order.orderNumber}</b> at the barista counter.
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-[#A89F91]">Payment Status</p>
            <p className="text-xs font-bold text-emerald-400 capitalize">
              ✓ {order.paymentMethod.replace('-', ' ')} • Paid
            </p>
          </div>
        </div>

      </div>

      {/* Ordered Items Summary */}
      <div className="bg-[#1C1917] border border-[#2E2824] rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">Order Items ({order.items.length})</h3>

        <div className="divide-y divide-[#2E2824]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#FDFBF7]">{item.quantity}x {item.menuItem.name}</span>
                  </div>
                  <div className="text-[10px] text-[#A89F91] flex flex-wrap gap-1.5 mt-0.5">
                    <span className="capitalize">{item.customization.temp}</span>
                    {item.customization.milk !== 'none' && <span>• {item.customization.milk} milk</span>}
                    {item.customization.shots && <span>• {item.customization.shots}</span>}
                    {item.customization.syrup !== 'none' && <span>• {item.customization.syrup}</span>}
                    {item.customization.notes && <span className="text-[#C88A58]">• Note: {item.customization.notes}</span>}
                  </div>
                </div>
              </div>
              <span className="font-serif font-bold text-xs text-[#C88A58]">
                ${item.itemTotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#2E2824] flex justify-between items-center text-xs">
          <span className="text-[#A89F91]">Total Amount Paid:</span>
          <span className="font-serif font-bold text-base text-[#C88A58]">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Interactive Simulation Sandbox (Demonstrating Cross-Device KDS Sync) */}
      <div className="p-4 bg-[#24201D] border border-[#3E352F] rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#C88A58] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Simulation Controls (Test Real-time Sync)
          </span>
          <Link
            href="/kds"
            target="_blank"
            className="text-[11px] text-[#C88A58] hover:underline flex items-center gap-1"
          >
            <span>Open Barista KDS Screen &rarr;</span>
          </Link>
        </div>
        <p className="text-[11px] text-[#A89F91]">
          Advance the status below to simulate the barista working behind the bar. Notice how this screen updates instantly via BroadcastChannel!
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => updateOrderStatus(order.id, 'received')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'received'
                ? 'bg-[#965B32] text-white border-[#C88A58]'
                : 'bg-[#1C1917] border-[#3E352F] text-[#A89F91]'
            }`}
          >
            1. Queue Received
          </button>
          <button
            onClick={() => updateOrderStatus(order.id, 'brewing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'brewing'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-[#1C1917] border-[#3E352F] text-[#A89F91]'
            }`}
          >
            2. Start Brewing
          </button>
          <button
            onClick={() => {
              playSoundEffect('ready_bell');
              updateOrderStatus(order.id, 'ready');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'ready'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-[#1C1917] border-[#3E352F] text-[#A89F91]'
            }`}
          >
            3. Mark Ready for Handoff
          </button>
          <button
            onClick={() => updateOrderStatus(order.id, 'collected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'collected'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-[#1C1917] border-[#3E352F] text-[#A89F91]'
            }`}
          >
            4. Customer Collected
          </button>
        </div>
      </div>

    </div>
  );
};

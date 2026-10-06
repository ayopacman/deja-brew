'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrder } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types/coffee';
import {
  Clock,
  CheckCircle2,
  Cake,
  Sparkles,
  QrCode,
  ArrowRight,
  Flame,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { playSoundEffect } from '../../utils/sound';

export const OrderTracker: React.FC = () => {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');

  const { orders, getOrderById, updateOrderStatus, activeOrder } = useOrder();

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
      <div className="max-w-xl mx-auto py-16 px-4 text-center text-[#2D2020]">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] mx-auto flex items-center justify-center text-[#E84A74] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl mb-2">No Active Order Found</h2>
        <p className="text-xs text-[#8C7575] mb-6">
          You haven't placed an order yet. Browse our bakery and cafe menu to order ahead!
        </p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition-all"
        >
          <span>Explore Menu</span>
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
      description: 'Order sent to Bakery & Cafe KDS',
      icon: Clock,
    },
    {
      key: 'brewing',
      title: 'Baking & Brewing',
      description: 'Chefs preparing cake & pulling espresso',
      icon: Flame,
    },
    {
      key: 'ready',
      title: 'Ready at Counter',
      description: 'Boxed and ready on handoff bar',
      icon: Cake,
    },
    {
      key: 'collected',
      title: 'Collected',
      description: 'Picked up with love!',
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
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 text-[#2D2020]">
      
      {/* Top Header Card */}
      <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-[#E84A74] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-[#F8D7DF]">
                Order {order.orderNumber}
              </span>
              <span className="text-xs text-[#8C7575]">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#2D2020] mt-1">
              {order.customerName}'s Order
            </h1>
          </div>

          {/* Live Badge */}
          <div className="flex items-center gap-3">
            {order.status === 'ready' ? (
              <div className="bg-[#EAFBF0] border border-emerald-400 text-emerald-800 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Ready on Counter!</div>
                  <div className="text-[10px] text-emerald-700">Collect at SweetCrumbs handoff</div>
                </div>
              </div>
            ) : order.status === 'brewing' ? (
              <div className="bg-[#FFF0F3] border border-[#E84A74] text-[#E84A74] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
                <Flame className="w-5 h-5 text-[#E84A74] animate-bounce" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Baking & Brewing</div>
                  <div className="text-[10px] text-[#E84A74]">~{minutes}m {seconds}s remaining</div>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF9F9] border border-[#F8D7DF] text-[#5D4A4A] px-4 py-2 rounded-2xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E84A74]" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">In Kitchen Queue</div>
                  <div className="text-[10px] text-[#8C7575]">Scheduled for {order.pickupTime}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="py-8">
          <div className="grid grid-cols-4 gap-2 relative">
            <div className="absolute top-5 left-8 right-8 h-1 bg-[#F8D7DF] -z-0">
              <div
                className="h-full bg-[#E84A74] transition-all duration-700"
                style={{
                  width: `${(currentIndex / (stages.length - 1)) * 100}%`,
                }}
              />
            </div>

            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent
                        ? 'bg-[#E84A74] border-white text-white ring-4 ring-[#E84A74]/20 scale-110 shadow-md'
                        : isPast
                        ? 'bg-[#E84A74] border-[#E84A74] text-white'
                        : 'bg-white border-[#F8D7DF] text-[#A88C8C]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-2.5">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent || isPast ? 'text-[#E84A74]' : 'text-[#8C7575]'
                      }`}
                    >
                      {stage.title}
                    </p>
                    <p className="text-[10px] text-[#8C7575] hidden sm:block mt-0.5 max-w-[120px]">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pickup Pass QR */}
        <div className="mt-2 p-4 bg-[#FFF9F9] border border-[#F8D7DF] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border border-[#F8D7DF]">
              <QrCode className="w-12 h-12 text-[#2D2020]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D2020]">Sweet Pass QR</p>
              <p className="text-[11px] text-[#7A6767]">
                Show QR or mention <b className="text-[#E84A74]">{order.orderNumber}</b> at the counter.
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-[#8C7575]">Payment</p>
            <p className="text-xs font-bold text-emerald-600 capitalize">
              ✓ {order.paymentMethod.replace('-', ' ')} • Paid
            </p>
          </div>
        </div>

      </div>

      {/* Items Summary */}
      <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D2020]">Ordered Items ({order.items.length})</h3>

        <div className="divide-y divide-[#F8D7DF]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#F8D7DF]"
                />
                <div>
                  <span className="font-bold text-xs text-[#2D2020]">{item.quantity}x {item.menuItem.name}</span>
                  <div className="text-[10px] text-[#8C7575] flex flex-wrap gap-1.5 mt-0.5">
                    {item.customization.notes && <span className="text-[#E84A74]">• Note: {item.customization.notes}</span>}
                  </div>
                </div>
              </div>
              <span className="font-bold text-xs text-[#E84A74]">
                ${item.itemTotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#F8D7DF] flex justify-between items-center text-xs">
          <span className="text-[#8C7575]">Total Paid:</span>
          <span className="font-serif font-bold text-base text-[#E84A74]">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Simulator */}
      <div className="p-4 bg-[#FFF0F3] border border-[#F8D7DF] rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#E84A74] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Kitchen Simulation Controls (Test Real-Time Sync)
          </span>
          <Link
            href="/kds"
            target="_blank"
            className="text-[11px] text-[#E84A74] font-bold hover:underline"
          >
            Open Kitchen KDS &rarr;
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => updateOrderStatus(order.id, 'received')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'received'
                ? 'bg-[#E84A74] text-white border-[#E84A74]'
                : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
            }`}
          >
            1. Queue Received
          </button>
          <button
            onClick={() => updateOrderStatus(order.id, 'brewing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'brewing'
                ? 'bg-[#E84A74] text-white border-[#E84A74]'
                : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
            }`}
          >
            2. Start Baking & Brewing
          </button>
          <button
            onClick={() => {
              playSoundEffect('ready_bell');
              updateOrderStatus(order.id, 'ready');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'ready'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
            }`}
          >
            3. Mark Ready at Counter
          </button>
          <button
            onClick={() => updateOrderStatus(order.id, 'collected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              order.status === 'collected'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-[#F8D7DF] text-[#5D4A4A]'
            }`}
          >
            4. Customer Collected
          </button>
        </div>
      </div>

    </div>
  );
};

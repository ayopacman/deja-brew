'use client';

import React, { useState, useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types/coffee';
import {
  Radio,
  Clock,
  Flame,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  RefreshCw,
  Coffee,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';
import { MENU_ITEMS } from '../../data/coffeeData';

export const KdsView: React.FC = () => {
  const { orders, updateOrderStatus, createOrder, resetToSampleOrders } = useOrder();

  const [stationFilter, setStationFilter] = useState<'all' | 'espresso' | 'cold-brew' | 'pour-over' | 'pastries'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Update live clock every 5 seconds to calculate elapsed queue time
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter active tickets (exclude already collected/cancelled)
  const activeTickets = orders.filter((o) => o.status !== 'collected' && o.status !== 'cancelled');

  const filteredTickets = activeTickets.filter((order) => {
    if (stationFilter === 'all') return true;
    return order.items.some((item) => item.menuItem.category === stationFilter);
  });

  const receivedCount = activeTickets.filter((o) => o.status === 'received').length;
  const brewingCount = activeTickets.filter((o) => o.status === 'brewing').length;
  const readyCount = activeTickets.filter((o) => o.status === 'ready').length;

  const handleAdvanceStatus = (order: Order) => {
    if (order.status === 'received') {
      updateOrderStatus(order.id, 'brewing');
      if (soundEnabled) playSoundEffect('click');
    } else if (order.status === 'brewing') {
      updateOrderStatus(order.id, 'ready');
      if (soundEnabled) playSoundEffect('ready_bell');
    } else if (order.status === 'ready') {
      updateOrderStatus(order.id, 'collected');
      if (soundEnabled) playSoundEffect('success');
    }
  };

  const handleAddRushOrder = async () => {
    const randomDrink = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    const names = ['Sophia Chang', 'Liam O\'Connor', 'Zoe Kravitz', 'Aarav Patel', 'Mia Rossi'];
    const chosenName = names[Math.floor(Math.random() * names.length)];

    await createOrder({
      customerName: chosenName,
      customerPhone: '+1 (555) 998-1122',
      pickupTime: 'ASAP',
      paymentMethod: 'apple-pay',
      tip: 2.00,
    });

    if (soundEnabled) {
      playSoundEffect('new_order');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0D0C] text-[#FDFBF7] p-4 sm:p-6 flex flex-col space-y-6">
      
      {/* Top KDS Header Bar */}
      <div className="bg-[#181513] border border-[#2E2824] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <Radio className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-xl tracking-wide text-[#FDFBF7]">
                BARISTA KITCHEN DISPLAY (KDS)
              </h1>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-[#A89F91]">
              Real-time ticket dispatcher & production queue
            </p>
          </div>
        </div>

        {/* Action Controls & Sound Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              soundEnabled
                ? 'bg-[#2A2421] border-[#C88A58] text-[#C88A58]'
                : 'bg-[#181513] border-[#2E2824] text-[#6E645C]'
            }`}
            title="Toggle Bell Chimes"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C88A58]" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          <button
            onClick={handleAddRushOrder}
            className="bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Rush Order</span>
          </button>

          <button
            onClick={resetToSampleOrders}
            className="p-2.5 rounded-xl bg-[#2A2421] border border-[#2E2824] hover:border-[#3E352F] text-xs text-[#A89F91] hover:text-[#FDFBF7] flex items-center gap-1"
            title="Reset to Sample Orders"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Metrics & Station Filter Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Real-time Counts */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="bg-[#181513] border border-[#2E2824] rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A2421] flex items-center justify-center text-[#C9C1B5]">
              <Clock className="w-5 h-5 text-[#C88A58]" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#FDFBF7]">{receivedCount}</div>
              <div className="text-[11px] text-[#A89F91] uppercase tracking-wider font-semibold">In Queue</div>
            </div>
          </div>

          <div className="bg-[#181513] border border-amber-500/30 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-amber-400">{brewingCount}</div>
              <div className="text-[11px] text-[#A89F91] uppercase tracking-wider font-semibold">Brewing</div>
            </div>
          </div>

          <div className="bg-[#181513] border border-emerald-500/30 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-emerald-400">{readyCount}</div>
              <div className="text-[11px] text-[#A89F91] uppercase tracking-wider font-semibold">Ready for Pickup</div>
            </div>
          </div>
        </div>

        {/* Station Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-[#181513] p-1.5 rounded-2xl border border-[#2E2824]">
          {[
            { id: 'all', label: 'All Stations' },
            { id: 'espresso', label: 'Espresso Bar' },
            { id: 'cold-brew', label: 'Cold Bar' },
            { id: 'pour-over', label: 'Pour Over' },
            { id: 'pastries', label: 'Pastry / Warm' },
          ].map((station) => (
            <button
              key={station.id}
              onClick={() => setStationFilter(station.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                stationFilter === station.id
                  ? 'bg-[#965B32] text-white shadow-sm'
                  : 'text-[#A89F91] hover:text-[#FDFBF7] hover:bg-[#24201D]'
              }`}
            >
              {station.label}
            </button>
          ))}
        </div>

      </div>

      {/* Ticket Grid (Tablet & Screen Optimized) */}
      <div className="flex-1">
        {filteredTickets.length === 0 ? (
          <div className="h-96 bg-[#181513] border border-[#2E2824] rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#24201D] flex items-center justify-center text-[#6E645C]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#FDFBF7]">All Caught Up, Barista!</h3>
            <p className="text-xs text-[#A89F91] max-w-sm">
              Zero pending tickets for this station. Click "Simulate Rush Order" to test incoming orders.
            </p>
            <button
              onClick={handleAddRushOrder}
              className="bg-[#965B32] hover:bg-[#C88A58] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all"
            >
              + Create Simulated Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredTickets.map((order) => {
              const elapsedMinutes = Math.floor((now - order.createdAt) / 60000);
              const isUrgent = elapsedMinutes >= 7;
              const isWarning = elapsedMinutes >= 4 && elapsedMinutes < 7;

              let cardBorder = 'border-[#2E2824]';
              let timeBadge = 'bg-[#2A2421] text-[#A89F91]';

              if (order.status === 'ready') {
                cardBorder = 'border-emerald-500/40 bg-[#121E17]';
                timeBadge = 'bg-emerald-950 text-emerald-300 border border-emerald-500/40';
              } else if (isUrgent) {
                cardBorder = 'border-red-500/50 bg-[#211414] animate-pulse';
                timeBadge = 'bg-red-950 text-red-300 border border-red-500';
              } else if (isWarning) {
                cardBorder = 'border-amber-500/40 bg-[#1E1914]';
                timeBadge = 'bg-amber-950 text-amber-300 border border-amber-500/40';
              } else {
                cardBorder = 'border-[#2E2824] bg-[#181513]';
              }

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border ${cardBorder} p-4 flex flex-col justify-between shadow-lg transition-all duration-200`}
                >
                  {/* Ticket Header */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#2E2824]/60">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-[#C88A58]">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${timeBadge}`}>
                          <Clock className="w-3 h-3" />
                          {elapsedMinutes}m ago
                        </span>
                      </div>

                      {order.status === 'ready' ? (
                        <span className="bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                          READY
                        </span>
                      ) : order.status === 'brewing' ? (
                        <span className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame className="w-3 h-3 animate-bounce" />
                          BREWING
                        </span>
                      ) : (
                        <span className="bg-[#2A2421] text-[#A89F91] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          QUEUED
                        </span>
                      )}
                    </div>

                    {/* Customer Name & Pickup Time */}
                    <div className="pt-2 pb-3">
                      <h4 className="font-bold text-sm text-[#FDFBF7] truncate">
                        {order.customerName}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-[#A89F91] mt-0.5">
                        <span>Target: <b className="text-[#C88A58]">{order.pickupTime}</b></span>
                        <span className="capitalize text-emerald-400 font-medium">✓ {order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Drink & Food Item Lines */}
                    <div className="space-y-2.5 py-2 border-t border-[#2E2824]/60">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-[#211C19] p-2.5 rounded-xl border border-[#2E2824]">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-[#FDFBF7]">
                              {item.quantity}x {item.menuItem.name}
                            </span>
                          </div>

                          {/* Customization Details */}
                          <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                            <span className="bg-[#2E2824] px-1.5 py-0.5 rounded text-amber-300 font-semibold capitalize">
                              {item.customization.temp}
                            </span>
                            {item.customization.milk !== 'none' && (
                              <span className="bg-[#2E2824] px-1.5 py-0.5 rounded text-[#FDFBF7] font-semibold capitalize">
                                {item.customization.milk} milk
                              </span>
                            )}
                            {item.customization.shots && (
                              <span className="bg-[#2E2824] px-1.5 py-0.5 rounded text-[#C9C1B5]">
                                {item.customization.shots}
                              </span>
                            )}
                            {item.customization.syrup !== 'none' && (
                              <span className="bg-[#2E2824] px-1.5 py-0.5 rounded text-[#C88A58] font-bold">
                                {item.customization.syrup} ({item.customization.syrupPumps} pumps)
                              </span>
                            )}
                            {item.customization.notes && (
                              <div className="w-full mt-1 bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[10px] p-1.5 rounded font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>Note: {item.customization.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advance Status Button */}
                  <div className="pt-3 border-t border-[#2E2824]/60 mt-2">
                    {order.status === 'received' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Brewing Ticket</span>
                      </button>
                    )}

                    {order.status === 'brewing' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Ready on Bar Counter</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="w-full bg-[#2A2421] hover:bg-[#3E352F] text-[#C9C1B5] hover:text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Customer Collected (Archive)</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

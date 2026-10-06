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
  Cake,
  AlertTriangle
} from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';
import { MENU_ITEMS } from '../../data/coffeeData';

export const KdsView: React.FC = () => {
  const { orders, updateOrderStatus, createOrder, resetToSampleOrders } = useOrder();

  const [stationFilter, setStationFilter] = useState<'all' | 'pastries' | 'signature-lattes' | 'espresso' | 'cold-brew'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

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
    const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    const names = ['Emily Johnson', 'Michael Smith', 'Sophia Brown', 'Lucas Vance', 'Olivia Taylor'];
    const chosenName = names[Math.floor(Math.random() * names.length)];

    await createOrder({
      customerName: chosenName,
      customerPhone: '+1 (555) 998-1122',
      pickupTime: 'ASAP',
      paymentMethod: 'apple-pay',
      tip: 3.00,
    });

    if (soundEnabled) {
      playSoundEffect('new_order');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] text-[#2D2020] p-4 sm:p-6 flex flex-col space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-[#F8D7DF] rounded-3xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] border border-[#F8D7DF] flex items-center justify-center text-[#E84A74]">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-xl tracking-wide text-[#2D2020]">
                SWEETCRUMBS KITCHEN DISPLAY (KDS)
              </h1>
              <span className="bg-[#EAFBF0] text-emerald-700 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs text-[#8C7575]">
              Real-time cake preparation & barista espresso order queue
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              soundEnabled
                ? 'bg-[#FFF0F3] border-[#E84A74] text-[#E84A74]'
                : 'bg-white border-[#F8D7DF] text-[#8C7575]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E84A74]" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          <button
            onClick={handleAddRushOrder}
            className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Rush Ticket</span>
          </button>

          <button
            onClick={resetToSampleOrders}
            className="p-2.5 rounded-xl bg-white border border-[#F8D7DF] text-xs text-[#8C7575] hover:text-[#2D2020]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics & Station Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="bg-white border border-[#F8D7DF] rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] flex items-center justify-center text-[#E84A74]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#2D2020]">{receivedCount}</div>
              <div className="text-[10px] text-[#8C7575] uppercase tracking-wider font-bold">In Queue</div>
            </div>
          </div>

          <div className="bg-white border border-[#F8D7DF] rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] flex items-center justify-center text-[#E84A74]">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#E84A74]">{brewingCount}</div>
              <div className="text-[10px] text-[#8C7575] uppercase tracking-wider font-bold">Baking & Brewing</div>
            </div>
          </div>

          <div className="bg-white border border-[#F8D7DF] rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EAFBF0] flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-emerald-700">{readyCount}</div>
              <div className="text-[10px] text-[#8C7575] uppercase tracking-wider font-bold">Ready on Bar</div>
            </div>
          </div>
        </div>

        {/* Stations */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border border-[#F8D7DF] shadow-xs">
          {[
            { id: 'all', label: 'All Stations' },
            { id: 'pastries', label: 'Cake Bakery' },
            { id: 'signature-lattes', label: 'Latte Station' },
            { id: 'espresso', label: 'Espresso Bar' },
          ].map((station) => (
            <button
              key={station.id}
              onClick={() => setStationFilter(station.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                stationFilter === station.id
                  ? 'bg-[#E84A74] text-white shadow-xs'
                  : 'text-[#8C7575] hover:text-[#2D2020] hover:bg-[#FFF0F3]'
              }`}
            >
              {station.label}
            </button>
          ))}
        </div>

      </div>

      {/* Ticket Grid */}
      <div className="flex-1">
        {filteredTickets.length === 0 ? (
          <div className="h-96 bg-white border border-[#F8D7DF] rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#E84A74]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2D2020]">All Caught Up!</h3>
            <p className="text-xs text-[#8C7575] max-w-sm">
              No pending orders for this station. Click "Simulate Rush Ticket" to generate orders.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredTickets.map((order) => {
              const elapsedMinutes = Math.floor((now - order.createdAt) / 60000);
              const isUrgent = elapsedMinutes >= 7;

              let cardBorder = 'border-[#F8D7DF] bg-white';
              let badgeStyle = 'bg-[#FFF0F3] text-[#E84A74]';

              if (order.status === 'ready') {
                cardBorder = 'border-emerald-400 bg-[#FAFFFB]';
                badgeStyle = 'bg-emerald-100 text-emerald-800';
              } else if (isUrgent) {
                cardBorder = 'border-red-400 bg-[#FFF5F5]';
                badgeStyle = 'bg-red-100 text-red-700';
              }

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border ${cardBorder} p-4 flex flex-col justify-between shadow-xs transition-all`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#F8D7DF]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-[#E84A74]">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${badgeStyle}`}>
                          <Clock className="w-3 h-3" />
                          {elapsedMinutes}m ago
                        </span>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#E84A74]">
                        {order.status}
                      </span>
                    </div>

                    <div className="pt-2 pb-3">
                      <h4 className="font-bold text-sm text-[#2D2020] truncate">
                        {order.customerName}
                      </h4>
                      <div className="text-[11px] text-[#8C7575] mt-0.5">
                        Target: <b className="text-[#E84A74]">{order.pickupTime}</b>
                      </div>
                    </div>

                    <div className="space-y-2 py-2 border-t border-[#F8D7DF]">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-[#FFF9F9] p-2.5 rounded-xl border border-[#F8D7DF]">
                          <span className="font-bold text-xs text-[#2D2020]">
                            {item.quantity}x {item.menuItem.name}
                          </span>
                          {item.customization.notes && (
                            <div className="mt-1 text-[10px] text-[#E84A74] font-medium">
                              Note: {item.customization.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F8D7DF] mt-2">
                    {order.status === 'received' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Preparing</span>
                      </button>
                    )}

                    {order.status === 'brewing' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Ready on Bar</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="w-full bg-white hover:bg-[#FFF0F3] border border-[#F8D7DF] text-[#5D4A4A] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <span>Customer Collected</span>
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

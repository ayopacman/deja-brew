'use client';

import React, { useState, useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types/coffee';
import { MENU_ITEMS } from '../../data/coffeeData';
import {
  Radio,
  Clock,
  Flame,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  RefreshCw,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  Coffee,
  Ticket,
  Ban,
  Sliders,
  Printer,
  FileText,
  MapPin,
  Sparkles,
  Search,
  Check,
  RotateCcw,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Utensils,
  StickyNote,
  Trash2
} from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type StaffTab = 'kds' | 'inventory' | 'dialin' | 'tables' | 'analytics' | 'handover';

interface DialInEntry {
  id: string;
  time: string;
  bean: string;
  dose: string;
  yieldGrams: string;
  extractionTime: string;
  grinderSetting: string;
  notes: string;
  baristaName: string;
}

interface CafeTableStatus {
  id: string;
  name: string;
  type: 'booth' | 'table' | 'bar' | 'terrace';
  status: 'available' | 'occupied' | 'bussing' | 'reserved';
  seats: number;
}

interface HandoverNote {
  id: string;
  time: string;
  author: string;
  text: string;
  priority: 'normal' | 'urgent';
}

const INITIAL_TABLES: CafeTableStatus[] = [
  { id: 't1', name: 'Table 1 (Window)', type: 'booth', status: 'occupied', seats: 4 },
  { id: 't2', name: 'Table 2 (Window)', type: 'booth', status: 'available', seats: 4 },
  { id: 't3', name: 'Table 3 (Quiet Corner)', type: 'table', status: 'bussing', seats: 2 },
  { id: 't4', name: 'Table 4 (Center)', type: 'table', status: 'available', seats: 2 },
  { id: 't5', name: 'Table 5 (Community)', type: 'table', status: 'occupied', seats: 6 },
  { id: 't6', name: 'Garden Terrace A', type: 'terrace', status: 'available', seats: 4 },
  { id: 't7', name: 'Garden Terrace B', type: 'terrace', status: 'reserved', seats: 4 },
  { id: 'b1', name: 'Barista Counter Stool 1', type: 'bar', status: 'occupied', seats: 1 },
  { id: 'b2', name: 'Barista Counter Stool 2', type: 'bar', status: 'available', seats: 1 },
];

const INITIAL_DIAL_IN: DialInEntry[] = [
  {
    id: 'd1',
    time: '08:30 AM',
    bean: 'Ethiopia Yirgacheffe Washed',
    dose: '18.5g',
    yieldGrams: '38.0g',
    extractionTime: '27s',
    grinderSetting: 'Mahlkönig EK43 #2.3',
    notes: 'Vibrant bergamot, jasmine florals, clean peach finish. Dialed in for flat whites.',
    baristaName: 'Kai (Head Barista)'
  },
  {
    id: 'd2',
    time: '11:15 AM',
    bean: 'Chikmagalur Arabica Honey Process',
    dose: '19.0g',
    yieldGrams: '39.5g',
    extractionTime: '28s',
    grinderSetting: 'Mazzer Kony #3.1',
    notes: 'Brown sugar sweetness, hazelnut, gentle orange acidity.',
    baristaName: 'Maya'
  }
];

const INITIAL_HANDOVER: HandoverNote[] = [
  {
    id: 'h1',
    time: '09:00 AM',
    author: 'Kai',
    text: 'Opened new 1kg bag of Colombia Geisha. Steamer wand #2 soaked in Rinza.',
    priority: 'normal'
  },
  {
    id: 'h2',
    time: '12:30 PM',
    author: 'Maya',
    text: 'Almond milk shipment arrived (12 cartons in walk-in chiller).',
    priority: 'normal'
  },
  {
    id: 'h3',
    time: '02:00 PM',
    author: 'Arjun',
    text: 'Table 3 power socket repaired and tested.',
    priority: 'normal'
  }
];

export const KdsView: React.FC = () => {
  const router = useRouter();
  const { orders, updateOrderStatus, createOrder, resetToSampleOrders, soldOutItemIds, toggleSoldOut } = useOrder();

  // Authentication State (Secret PIN: 1237)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<StaffTab>('kds');

  // KDS State
  const [stationFilter, setStationFilter] = useState<'all' | 'pastries' | 'signature-lattes' | 'espresso'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [itemSearch, setItemSearch] = useState('');

  // Dial-in State
  const [dialInLogs, setDialInLogs] = useState<DialInEntry[]>(INITIAL_DIAL_IN);
  const [newDose, setNewDose] = useState('18.5g');
  const [newYield, setNewYield] = useState('38.0g');
  const [newTime, setNewTime] = useState('27s');
  const [newGrind, setNewGrind] = useState('EK43 #2.4');
  const [newBean, setNewBean] = useState('Ethiopia Guji Natural');
  const [newTastingNotes, setNewTastingNotes] = useState('Blueberry jam, milk chocolate sweetness');
  const [baristaAuthor, setBaristaAuthor] = useState('Kai');

  // Tables State
  const [tables, setTables] = useState<CafeTableStatus[]>(INITIAL_TABLES);

  // Handover State
  const [handoverNotes, setHandoverNotes] = useState<HandoverNote[]>(INITIAL_HANDOVER);
  const [newNoteText, setNewNoteText] = useState('');

  // Z-Report Print Modal
  const [isZReportOpen, setIsZReportOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinInput.trim().toUpperCase();
    if (cleanPin === '1237' || cleanPin === 'DEJABARISTA') {
      setIsStaffAuthenticated(true);
      sessionStorage.setItem('dejabrew_staff_auth', 'true');
      setPinError(false);
      playSoundEffect('success');
    } else {
      setPinError(true);
      playSoundEffect('click');
      setPinInput('');
    }
  };

  const handleLockTerminal = () => {
    setIsStaffAuthenticated(false);
    sessionStorage.removeItem('dejabrew_staff_auth');
    setPinInput('');
    playSoundEffect('click');
    router.push('/');
  };

  // KDS Operations
  const activeTickets = orders.filter((o: Order) => o.status !== 'collected' && o.status !== 'cancelled');
  const completedTickets = orders.filter((o: Order) => o.status === 'collected');

  const filteredTickets = activeTickets.filter((order: Order) => {
    if (stationFilter === 'all') return true;
    if (stationFilter === 'pastries') return order.items.some((i) => i.menuItem.category === 'snacks' || i.menuItem.category === 'desserts');
    if (stationFilter === 'signature-lattes') return order.items.some((i) => i.menuItem.category === 'milk-based' || i.menuItem.category === 'hybrids');
    if (stationFilter === 'espresso') return order.items.some((i) => i.menuItem.category === 'espresso' || i.menuItem.category === 'brewed');
    return true;
  });

  const receivedCount = activeTickets.filter((o: Order) => o.status === 'received').length;
  const brewingCount = activeTickets.filter((o: Order) => o.status === 'brewing').length;
  const readyCount = activeTickets.filter((o: Order) => o.status === 'ready').length;

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

  const handleRecallOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
    if (soundEnabled) playSoundEffect('click');
  };

  const handleAddRushOrder = async () => {
    const names = ['Ananya Sharma', 'Rohan Mehta', 'Priya Kapoor', 'Aditya Verma', 'Zoya Khan', 'Kabir Sen'];
    const chosenName = names[Math.floor(Math.random() * names.length)];

    await createOrder({
      customerName: chosenName,
      customerPhone: '+91 98765 43210',
      pickupTime: 'ASAP',
      paymentMethod: 'upi',
      tip: 30,
    });

    if (soundEnabled) {
      playSoundEffect('new_order');
    }
  };

  // Dial In Log
  const handleSaveDialIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DialInEntry = {
      id: `dial-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bean: newBean,
      dose: newDose,
      yieldGrams: newYield,
      extractionTime: newTime,
      grinderSetting: newGrind,
      notes: newTastingNotes,
      baristaName: baristaAuthor
    };
    setDialInLogs([newEntry, ...dialInLogs]);
    playSoundEffect('success');
  };

  // Tables
  const cycleTableStatus = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          const nextStatus: Record<CafeTableStatus['status'], CafeTableStatus['status']> = {
            available: 'occupied',
            occupied: 'bussing',
            bussing: 'reserved',
            reserved: 'available',
          };
          return { ...t, status: nextStatus[t.status] };
        }
        return t;
      })
    );
    playSoundEffect('click');
  };

  // Handover Notes
  const handleAddHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const note: HandoverNote = {
      id: `h-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: baristaAuthor,
      text: newNoteText.trim(),
      priority: 'normal'
    };
    setHandoverNotes([note, ...handoverNotes]);
    setNewNoteText('');
    playSoundEffect('success');
  };

  // Analytics Math
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalTips = orders.reduce((sum, o) => sum + o.tip, 0);
  const averageTicketTimeMinutes = 4.2;

  // 🔒 1. PASSKEY AUTHENTICATION SCREEN (Secret PIN: 1237 - NO HINTS)
  if (!isStaffAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF9F9] to-[#FCE4EC] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-[#F8D7DF] rounded-[32px] p-8 shadow-2xl space-y-6 text-center text-[#2D2020]">
          
          <div className="w-16 h-16 rounded-3xl bg-[#FFF0F3] border-2 border-[#F8D7DF] text-[#E84A74] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E84A74] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F8D7DF]">
              Staff Passkey Required
            </span>
            <h1 className="font-serif font-black text-2xl text-[#2D2020] pt-2">
              Barista Operations Hub
            </h1>
            <p className="text-xs text-[#7A6767] max-w-xs mx-auto">
              Please enter your 4-digit staff passkey PIN to unlock the live kitchen terminal and management suite.
            </p>
          </div>

          {/* PIN Form */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                Enter Staff Passkey PIN
              </label>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength={1}
                    value={pinInput[idx] || ''}
                    readOnly
                    className="w-12 h-14 bg-[#FFF9F9] border-2 border-[#F8D7DF] rounded-2xl text-center text-xl font-mono font-black text-[#E84A74] shadow-xs focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Incorrect Passkey PIN. Access Denied.
              </p>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === 'C') {
                      setPinInput('');
                      setPinError(false);
                    } else if (key === '✓') {
                      handlePinSubmit();
                    } else if (pinInput.length < 4) {
                      const newPin = pinInput + key;
                      setPinInput(newPin);
                      if (newPin.length === 4) {
                        if (newPin === '1237' || newPin === 'DEJABARISTA') {
                          setIsStaffAuthenticated(true);
                          sessionStorage.setItem('dejabrew_staff_auth', 'true');
                          playSoundEffect('success');
                        } else {
                          setPinError(true);
                          playSoundEffect('click');
                          setPinInput('');
                        }
                      }
                    }
                  }}
                  className="h-12 rounded-2xl bg-[#FFF9F9] hover:bg-[#FFF0F3] border border-[#F8D7DF] text-sm font-black text-[#4A2828] transition-transform active:scale-90 shadow-xs flex items-center justify-center"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="pt-3 space-y-2">
              <button
                type="submit"
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-[1.02]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verify Passkey PIN</span>
              </button>

              <Link
                href="/"
                className="w-full bg-white hover:bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Customer View</span>
              </Link>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F9] text-[#2D2020] p-4 sm:p-6 flex flex-col space-y-6">
      
      {/* 2. TOP MANAGEMENT HEADER */}
      <div className="bg-white border border-[#F8D7DF] rounded-3xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] border border-[#F8D7DF] flex items-center justify-center text-[#E84A74]">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-xl tracking-wide text-[#2D2020]">
                DEJA BREW STAFF OPERATIONS
              </h1>
              <span className="bg-[#EAFBF0] text-emerald-700 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                STAFF LIVE
              </span>
            </div>
            <p className="text-xs text-[#8C7575]">
              Kitchen Queue • 86'd Inventory • Espresso Calibration • Table Floor Plan • Sales Z-Report
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              soundEnabled
                ? 'bg-[#FFF0F3] border-[#E84A74] text-[#E84A74]'
                : 'bg-white border-[#F8D7DF] text-[#8C7575]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E84A74]" /> : <VolumeX className="w-4 h-4 text-[#8C7575]" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          <button
            onClick={handleAddRushOrder}
            className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Rush Ticket</span>
          </button>

          <Link
            href="/gift-cards"
            className="p-2.5 rounded-xl bg-white hover:bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Create & Issue Gift Cards"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Issue Vouchers</span>
          </Link>

          <button
            onClick={handleLockTerminal}
            className="p-2.5 rounded-xl bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] hover:bg-[#FDE8ED] text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Lock Staff Terminal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock & Exit</span>
          </button>
        </div>
      </div>

      {/* 3. MULTI-TAB NAVIGATION PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-[#F8D7DF] shadow-xs">
        {[
          { id: 'kds', label: '📋 Live KDS Queue', count: activeTickets.length },
          { id: 'inventory', label: '🚫 86\'d Stock Manager', count: soldOutItemIds.length },
          { id: 'dialin', label: '☕ Espresso Dial-In Log' },
          { id: 'tables', label: '🪑 Floor Bussing Radar' },
          { id: 'analytics', label: '📊 Shift Z-Report' },
          { id: 'handover', label: '📝 Shift Handover Notes', count: handoverNotes.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as StaffTab);
              playSoundEffect('click');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#E84A74] text-white shadow-md scale-102'
                : 'text-[#6B5151] hover:bg-[#FFF0F3] hover:text-[#E84A74]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-white text-[#E84A74]' : 'bg-[#FFF0F3] text-[#E84A74]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENT SWITCHER */}
      
      {/* TAB 1: LIVE KDS QUEUE */}
      {activeTab === 'kds' && (
        <div className="space-y-6">
          {/* Metrics & Station Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
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

            {/* Station Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border border-[#F8D7DF] shadow-xs">
              {[
                { id: 'all', label: 'All Stations' },
                { id: 'pastries', label: 'Cake & Pastry Bakery' },
                { id: 'signature-lattes', label: 'Latte Bar' },
                { id: 'espresso', label: 'Espresso & Pour-Over' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStationFilter(st.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    stationFilter === st.id
                      ? 'bg-[#E84A74] text-white shadow-xs'
                      : 'text-[#8C7575] hover:text-[#2D2020] hover:bg-[#FFF0F3]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tickets Grid */}
          {filteredTickets.length === 0 ? (
            <div className="h-96 bg-white border border-[#F8D7DF] rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#E84A74]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#2D2020]">All Caught Up!</h3>
              <p className="text-xs text-[#8C7575] max-w-sm">
                No active orders for this station. Click "Simulate Rush Ticket" to generate orders.
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
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#2D2020] truncate">
                            {order.customerName}
                          </h4>
                          {order.orderType === 'dine-in' ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                              🪑 {order.tableNumber || 'Dine-In'}
                            </span>
                          ) : (
                            <span className="bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                              🥡 Takeaway
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8C7575] mt-0.5 flex items-center justify-between">
                          <span>Target: <b className="text-[#E84A74]">{order.pickupTime}</b></span>
                          {order.discountAmount && (
                            <span className="text-[10px] text-emerald-700 font-bold">Disc: -₹{order.discountAmount}</span>
                          )}
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

          {/* Recent Completed Tickets (Recallable) */}
          {completedTickets.length > 0 && (
            <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-2">
                <span className="text-xs font-bold text-[#8C7575] uppercase tracking-wider">
                  Recently Collected Tickets ({completedTickets.length})
                </span>
                <span className="text-[10px] text-[#A88C8C]">Click recall if customer needs changes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {completedTickets.slice(0, 8).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleRecallOrder(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF9F9] hover:bg-[#FFF0F3] border border-[#F8D7DF] text-xs font-medium text-[#2D2020] flex items-center gap-1.5 group transition-colors"
                  >
                    <span className="font-mono font-bold text-[#E84A74]">{t.orderNumber}</span>
                    <span>{t.customerName}</span>
                    <RotateCcw className="w-3 h-3 text-[#8C7575] group-hover:text-[#E84A74]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 86'd STOCK & INVENTORY TOGGLES */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-4">
            <div>
              <h2 className="font-serif font-black text-xl text-[#2D2020]">
                Live 86'd / Sold-Out Item Stock Manager 🚫
              </h2>
              <p className="text-xs text-[#7A6767]">
                Toggle items sold-out in real-time. Sold-out items will be automatically locked from customer carts.
              </p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A88C8C]" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl text-xs text-[#2D2020] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MENU_ITEMS.filter((i) => i.name.toLowerCase().includes(itemSearch.toLowerCase())).map((item) => {
              const isSoldOut = soldOutItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                    isSoldOut
                      ? 'border-rose-400 bg-rose-50/50 opacity-80'
                      : 'border-[#F8D7DF] bg-white hover:border-[#E84A74]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[#F8D7DF]" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-xs text-[#2D2020] truncate">
                        {item.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#E84A74]">₹{item.price}</span>
                      <span className="block text-[10px] text-[#8C7575] capitalize">{item.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      toggleSoldOut(item.id);
                      playSoundEffect('click');
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSoldOut
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-[#FFF0F3] hover:bg-[#E84A74] text-[#E84A74] hover:text-white'
                    }`}
                  >
                    {isSoldOut ? (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>86'd (Sold Out)</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock (Available)</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY ESPRESSO DIAL-IN & CALIBRATION */}
      {activeTab === 'dialin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-white border border-[#F8D7DF] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="border-b border-[#F8D7DF] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E84A74]">
                Quality Assurance
              </span>
              <h3 className="font-serif font-black text-xl text-[#2D2020]">
                Morning Espresso Dial-In ☕
              </h3>
            </div>

            <form onSubmit={handleSaveDialIn} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2D2020] block mb-1">Origin / Micro-Lot Bean</label>
                <input
                  type="text"
                  value={newBean}
                  onChange={(e) => setNewBean(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2D2020] block mb-1">Dose In (Grams)</label>
                  <input
                    type="text"
                    value={newDose}
                    onChange={(e) => setNewDose(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2D2020] block mb-1">Liquid Yield (Grams)</label>
                  <input
                    type="text"
                    value={newYield}
                    onChange={(e) => setNewYield(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2D2020] block mb-1">Extraction Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2D2020] block mb-1">Grinder Dial Setting</label>
                  <input
                    type="text"
                    value={newGrind}
                    onChange={(e) => setNewGrind(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D2020] block mb-1">Sensory Cupping Notes</label>
                <textarea
                  value={newTastingNotes}
                  onChange={(e) => setNewTastingNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#2D2020] block mb-1">Calibrated By</label>
                <input
                  type="text"
                  value={baristaAuthor}
                  onChange={(e) => setBaristaAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-4 h-4" />
                <span>Save Calibration Log</span>
              </button>
            </form>
          </div>

          {/* Historical Log Cards */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-serif font-black text-lg text-[#2D2020] px-1">
              Today's Calibration History
            </h3>
            {dialInLogs.map((log) => (
              <div key={log.id} className="bg-white border border-[#F8D7DF] rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2D2020]">{log.bean}</h4>
                    <span className="text-[10px] text-[#8C7575]">{log.time} • Calibrated by {log.baristaName}</span>
                  </div>
                  <span className="font-mono text-xs font-black bg-[#FFF0F3] text-[#E84A74] px-2.5 py-1 rounded-lg border border-[#F8D7DF]">
                    {log.grinderSetting}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1 bg-[#FFF9F9] rounded-xl border border-[#F8D7DF]">
                  <div>
                    <span className="text-[9px] text-[#8C7575] block">DOSE</span>
                    <span className="font-mono font-bold text-xs text-[#2D2020]">{log.dose}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#8C7575] block">YIELD</span>
                    <span className="font-mono font-bold text-xs text-[#2D2020]">{log.yieldGrams}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#8C7575] block">TIME</span>
                    <span className="font-mono font-bold text-xs text-[#E84A74]">{log.extractionTime}</span>
                  </div>
                </div>

                <p className="text-xs text-[#5D4A4A] italic">"{log.notes}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FLOOR BUSSING & TABLE MANAGEMENT RADAR */}
      {activeTab === 'tables' && (
        <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F8D7DF] pb-4">
            <div>
              <h2 className="font-serif font-black text-xl text-[#2D2020]">
                Cafe Floor Radar & Table Bussing Status 🪑
              </h2>
              <p className="text-xs text-[#7A6767]">
                Click any table to cycle status: Available ⚪ ➔ Occupied 🟢 ➔ Needs Bussing 🧹 ➔ Reserved 🟡
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Needs Bussing 🧹
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((t) => {
              let bg = 'bg-emerald-50 border-emerald-300 text-emerald-900';
              let badge = 'bg-emerald-100 text-emerald-800';
              if (t.status === 'occupied') {
                bg = 'bg-rose-50 border-rose-300 text-rose-900';
                badge = 'bg-rose-100 text-rose-800';
              } else if (t.status === 'bussing') {
                bg = 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse';
                badge = 'bg-amber-100 text-amber-800';
              } else if (t.status === 'reserved') {
                bg = 'bg-purple-50 border-purple-300 text-purple-900';
                badge = 'bg-purple-100 text-purple-800';
              }

              return (
                <button
                  key={t.id}
                  onClick={() => cycleTableStatus(t.id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-102 flex flex-col justify-between h-32 ${bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-sm">{t.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${badge}`}>
                      {t.status === 'bussing' ? 'Needs Bussing 🧹' : t.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-black/10">
                    <span className="text-[11px] opacity-80">{t.seats} Guests Max</span>
                    <span className="text-[10px] font-bold underline">Tap to Switch</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SHIFT ANALYTICS & Z-REPORT CASH-UP */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-[#8C7575] uppercase font-bold tracking-wider">Gross Sales (Shift)</span>
              <div className="text-3xl font-serif font-black text-[#E84A74] mt-1">₹{totalRevenue}</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">▲ +18% vs Yesterday</span>
            </div>

            <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-[#8C7575] uppercase font-bold tracking-wider">Total Tickets</span>
              <div className="text-3xl font-serif font-black text-[#2D2020] mt-1">{orders.length}</div>
              <span className="text-[10px] text-[#8C7575] mt-1 block">{receivedCount + brewingCount} Active in kitchen</span>
            </div>

            <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-[#8C7575] uppercase font-bold tracking-wider">Staff Tips Collected</span>
              <div className="text-3xl font-serif font-black text-amber-600 mt-1">₹{totalTips}</div>
              <span className="text-[10px] text-[#8C7575] mt-1 block">Even split among 3 baristas</span>
            </div>

            <div className="bg-white border border-[#F8D7DF] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-[#8C7575] uppercase font-bold tracking-wider">Avg Prep Speed</span>
              <div className="text-3xl font-serif font-black text-emerald-700 mt-1">{averageTicketTimeMinutes}m</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">⚡ Target is under 6.0m</span>
            </div>
          </div>

          <div className="bg-white border border-[#F8D7DF] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-3">
              <div>
                <h3 className="font-serif font-black text-lg text-[#2D2020]">
                  End of Shift Register Cash-Up (Z-Report)
                </h3>
                <p className="text-xs text-[#7A6767]">
                  Print the official register reconciliation summary for cash drawer balancing.
                </p>
              </div>

              <button
                onClick={() => {
                  window.print();
                  playSoundEffect('click');
                }}
                className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md transition-transform hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Z-Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#FFF9F9] p-4 rounded-2xl border border-[#F8D7DF] space-y-2">
                <span className="font-bold text-[#E84A74] uppercase text-[10px]">Payment Channels</span>
                <div className="flex justify-between"><span>UPI (GPay/PhonePe):</span> <b className="font-mono">₹{Math.round(totalRevenue * 0.72)}</b></div>
                <div className="flex justify-between"><span>Credit / Debit Cards:</span> <b className="font-mono">₹{Math.round(totalRevenue * 0.20)}</b></div>
                <div className="flex justify-between"><span>Gift Card Redeems:</span> <b className="font-mono">₹{Math.round(totalRevenue * 0.08)}</b></div>
              </div>

              <div className="bg-[#FFF9F9] p-4 rounded-2xl border border-[#F8D7DF] space-y-2">
                <span className="font-bold text-[#E84A74] uppercase text-[10px]">Top Category Sales</span>
                <div className="flex justify-between"><span>Espresso & Milk:</span> <b className="font-mono">48 Cups</b></div>
                <div className="flex justify-between"><span>Artisan Bakery:</span> <b className="font-mono">24 Pastries</b></div>
                <div className="flex justify-between"><span>Single Origin V60:</span> <b className="font-mono">14 Brews</b></div>
              </div>

              <div className="bg-[#FFF9F9] p-4 rounded-2xl border border-[#F8D7DF] space-y-2">
                <span className="font-bold text-[#E84A74] uppercase text-[10px]">Shift Handover Status</span>
                <div className="flex justify-between"><span>Station Cleaning:</span> <b className="text-emerald-700">✓ Complete</b></div>
                <div className="flex justify-between"><span>Hopper Bean Level:</span> <b className="text-emerald-700">80% Full</b></div>
                <div className="flex justify-between"><span>Milk Stock:</span> <b className="text-emerald-700">18 Liters</b></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SHIFT HANDOVER WHITEBOARD */}
      {activeTab === 'handover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Note Form */}
          <div className="lg:col-span-5 bg-white border border-[#F8D7DF] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="border-b border-[#F8D7DF] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E84A74]">
                Team Communication
              </span>
              <h3 className="font-serif font-black text-xl text-[#2D2020]">
                Leave Shift Handover Note 📝
              </h3>
            </div>

            <form onSubmit={handleAddHandover} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2D2020] block mb-1">Your Name</label>
                <input
                  type="text"
                  value={baristaAuthor}
                  onChange={(e) => setBaristaAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#2D2020] block mb-1">Shift Handover Message</label>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Backflushed group heads, restocked whole milk in chiller..."
                  rows={4}
                  className="w-full px-3 py-2 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
              >
                <StickyNote className="w-4 h-4" />
                <span>Post Sticky Note</span>
              </button>
            </form>
          </div>

          {/* Sticky Notes Grid */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-serif font-black text-lg text-[#2D2020] px-1">
              Active Shift Notes ({handoverNotes.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {handoverNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-[#FFF9E6] border-2 border-[#FFE082] shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <p className="text-xs text-[#5D4037] leading-relaxed">
                    "{note.text}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-[10px] text-[#8D6E63] font-bold">
                    <span>— {note.author}</span>
                    <span>{note.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

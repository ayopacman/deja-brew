'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Wifi,
  Zap,
  Volume2,
  Heart,
  CheckCircle2,
  Coffee,
  Users
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';

interface SeatingRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TableZone {
  id: string;
  name: string;
  zone: string;
  capacity: string;
  status: 'available' | 'occupied';
  amenities: string[];
  noiseLevel: string;
  vibe: string;
}

const TABLES: TableZone[] = [
  {
    id: 'Table 1',
    name: 'Window Workspace (Table 1)',
    zone: 'Sunlit Window',
    capacity: '2-4 Guests',
    status: 'available',
    amenities: ['High-speed Wi-Fi', '2x Power Plugs', 'Natural Sunlight'],
    noiseLevel: 'Quiet (Ideal for remote work & study)',
    vibe: 'Bright, airy, street view'
  },
  {
    id: 'Table 2',
    name: 'Cozy Velvet Nook (Table 2)',
    zone: 'Interior Lounge',
    capacity: '2 Guests',
    status: 'available',
    amenities: ['Plush Velvet Seating', 'Warm Ambient Lamps', 'Bookshelf Access'],
    noiseLevel: 'Whisper-quiet',
    vibe: 'Intimate, warm, relaxing'
  },
  {
    id: 'Table 3',
    name: 'Blossom Garden Patio (Table 3)',
    zone: 'Outdoor Terrace',
    capacity: '4-6 Guests',
    status: 'available',
    amenities: ['Pet-Friendly', 'Cherry Blossom Canopy', 'Fresh Air'],
    noiseLevel: 'Lively cafe chatter',
    vibe: 'Botanical, floral, breezy'
  },
  {
    id: 'Table 4',
    name: 'Barista Counter (Table 4)',
    zone: 'Espresso Bar',
    capacity: '1-2 Guests',
    status: 'available',
    amenities: ['Watch Latte Art', 'Single-Origin Cupping Talk', 'Aroma Front Row'],
    noiseLevel: 'Coffee grinder & steam buzz',
    vibe: 'Interactive barista connection'
  },
  {
    id: 'Table 5',
    name: 'Terrace Loft (Table 5)',
    zone: 'Rooftop Balcony',
    capacity: '2-4 Guests',
    status: 'occupied',
    amenities: ['Open Sky View', 'Sunset Horizon', 'Cool Breeze'],
    noiseLevel: 'Gentle outdoor breeze',
    vibe: 'Sunset coffee golden hour'
  },
  {
    id: 'Table 6',
    name: 'Reading Loft (Table 6)',
    zone: 'Upper Mezzanine',
    capacity: '2-3 Guests',
    status: 'available',
    amenities: ['Artisan Magazine Rack', 'Acoustic Panels', 'Potted Bonsai'],
    noiseLevel: 'Library hush',
    vibe: 'Peaceful reading sanctuary'
  }
];

export const SeatingRadarModal: React.FC<SeatingRadarModalProps> = ({ isOpen, onClose }) => {
  const { setOrderType, setTableNumber, setIsCartOpen } = useOrder();
  const [selectedTableId, setSelectedTableId] = useState<string>('Table 1');
  const [reservedSuccess, setReservedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTable = TABLES.find((t) => t.id === selectedTableId) || TABLES[0];

  const handleSelectTable = (tableId: string) => {
    setSelectedTableId(tableId);
    playSoundEffect('click');
  };

  const handleConfirmReservation = () => {
    setOrderType('dine-in');
    setTableNumber(currentTable.name);
    setReservedSuccess(true);
    playSoundEffect('success');
    setTimeout(() => {
      setReservedSuccess(false);
      onClose();
      setIsCartOpen(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border-2 border-[#F8D7DF] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Live Floor Radar</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
            Deja Brew Seating Radar
          </h2>
          <p className="text-xs text-[#7A6767]">
            Check live table availability across our Blossom Garden, Sunlit Window, and Reading Loft.
          </p>
        </div>

        {/* Interactive Virtual Floor Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Table Pills Grid */}
          <div className="md:col-span-6 space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block">
              Select Table / Zone
            </label>

            <div className="space-y-2">
              {TABLES.map((table) => {
                const isSelected = selectedTableId === table.id;
                const isAvailable = table.status === 'available';

                return (
                  <button
                    key={table.id}
                    onClick={() => handleSelectTable(table.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FFF0F3] border-[#E84A74] ring-2 ring-[#E84A74]/20 shadow-xs'
                        : 'bg-[#FFF9F9] border-[#F8D7DF] hover:bg-[#FFF0F3]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-[#2D2020] flex items-center gap-1.5">
                        <span>{table.name}</span>
                      </div>
                      <div className="text-[10px] text-[#7A6767]">
                        {table.zone} • {table.capacity}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        isAvailable
                          ? 'bg-[#EAFBF0] text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Selected Table Detail Card */}
          <div className="md:col-span-6 bg-[#FFF8FA] border-2 border-[#F8BBD0] rounded-3xl p-5 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#E84A74]">
                  {currentTable.zone}
                </span>
                <h3 className="font-serif font-black text-lg text-[#2D2020]">
                  {currentTable.name}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-[#EAFBF0] border border-emerald-300 px-2.5 py-1 rounded-full">
                ● Live Ready
              </span>
            </div>

            {/* Amenities Tag Cloud */}
            <div>
              <span className="text-[10px] font-bold text-[#8C7575] uppercase tracking-wider block mb-1.5">
                Included Table Amenities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTable.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-[#F8D7DF] text-[#4A2828] text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#E84A74]" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Noise & Vibe info */}
            <div className="space-y-1 text-xs text-[#6B5151] bg-white p-3 rounded-2xl border border-[#F8D7DF]">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#E84A74]" />
                <span><b>Sound Profile:</b> {currentTable.noiseLevel}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E84A74]" />
                <span><b>Atmosphere:</b> {currentTable.vibe}</span>
              </div>
            </div>

            {/* Confirmation CTA */}
            <button
              onClick={handleConfirmReservation}
              disabled={currentTable.status === 'occupied'}
              className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-102 disabled:opacity-50"
            >
              {reservedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Table Selected for Dine-In! 🪑</span>
                </>
              ) : (
                <>
                  <Coffee className="w-4 h-4" />
                  <span>Dine-In Here: Select {currentTable.id}</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

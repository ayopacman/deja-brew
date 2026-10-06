'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Mountain,
  Compass,
  Sparkles,
  ArrowRight,
  Coffee,
  CheckCircle2,
  Layers,
  Award
} from 'lucide-react';
import { ORIGIN_REGIONS, MENU_ITEMS } from '../../data/coffeeData';
import { playSoundEffect } from '../../utils/sound';

interface OriginMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenuItem?: (itemId: string) => void;
}

export const OriginMapModal: React.FC<OriginMapModalProps> = ({ isOpen, onClose, onSelectMenuItem }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(ORIGIN_REGIONS[0].id);

  if (!isOpen) return null;

  const currentRegion = ORIGIN_REGIONS.find((r) => r.id === selectedRegionId) || ORIGIN_REGIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
            <Compass className="w-3.5 h-3.5" />
            <span>Terroir & Traceability</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
            Bean to Cup Origin Map
          </h2>
          <p className="text-xs text-[#7A6767]">
            Explore the single-origin micro-lots, high-altitude rainforest estates, and handpicked harvests behind Deja Brew.
          </p>
        </div>

        {/* Region Selector Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {ORIGIN_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => {
                setSelectedRegionId(region.id);
                playSoundEffect('click');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedRegionId === region.id
                  ? 'bg-[#E84A74] text-white shadow-md shadow-[#E84A74]/20 scale-105'
                  : 'bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] hover:text-[#2D2020]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{region.name}</span>
            </button>
          ))}
        </div>

        {/* Detailed Region Display Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FFF9F9] border border-[#F8D7DF] rounded-3xl p-5 sm:p-6 items-center">
          
          {/* Left Region Imagery */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-4/3 border-2 border-white shadow-md">
            <img
              src={currentRegion.image}
              alt={currentRegion.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF8EA8]">
                {currentRegion.country}
              </div>
              <div className="font-serif font-bold text-lg leading-tight">
                {currentRegion.estateName}
              </div>
            </div>
          </div>

          {/* Right Terroir Details */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Elevation & Process Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FFF0F3] text-[#E84A74] border border-[#F8D7DF] text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <Mountain className="w-3 h-3" />
                {currentRegion.altitude}
              </span>
              <span className="bg-white text-[#7A6767] border border-[#F8D7DF] text-[10px] font-bold px-2.5 py-1 rounded-full">
                {currentRegion.process}
              </span>
              <span className="bg-[#FFF0F3] text-[#9E334D] text-[10px] font-bold px-2.5 py-1 rounded-full">
                {currentRegion.roastProfile}
              </span>
            </div>

            <p className="text-xs text-[#5D4A4A] leading-relaxed">
              {currentRegion.description}
            </p>

            {/* Flavor Notes Tag Cloud */}
            <div>
              <span className="text-[10px] font-bold text-[#8C7575] uppercase tracking-wider block mb-1.5">
                Cupping Flavor Notes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentRegion.flavorNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-[#F8D7DF] text-[#E84A74] text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    🌸 {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Matched Drinks */}
            <div className="border-t border-[#F8D7DF] pt-3">
              <span className="text-[10px] font-bold text-[#8C7575] uppercase tracking-wider block mb-2">
                Featured in These Deja Brew Drinks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentRegion.matchedMenuItems.map((drink, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FFF0F3] border border-[#F8D7DF] text-[#2D2020] text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5"
                  >
                    <Coffee className="w-3 h-3 text-[#E84A74]" />
                    <span>{drink}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Award, Calendar, Clock, Sparkles, X, Users, Check, BookOpen, Coffee, Flame, Heart } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';

interface WorkshopsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Workshop {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  schedule: string;
  price: number;
  image: string;
  description: string;
  perks: string[];
  spotsLeft: number;
}

const WORKSHOPS: Workshop[] = [
  {
    id: 'latte-art-bootcamp',
    title: 'Latte Art Pitcher Bootcamp (Hands-On)',
    instructor: 'Head Barista Kai (National Latte Art Finalist)',
    duration: '2 Hours (120 Mins)',
    schedule: 'Every Saturday • 3:00 PM - 5:00 PM',
    price: 999,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    description: 'Master silky microfoam steaming, pitcher ergonomics, free-pour rosettas, tulips, and swans on commercial La Marzocco machines.',
    perks: ['Unlimited Milk & Espresso Practice', 'Custom Barista Apron to keep', 'Course Completion Certificate'],
    spotsLeft: 4
  },
  {
    id: 'cupping-masterclass',
    title: 'Sensory Cupping & Aroma Wheel Tasting',
    instructor: 'SCA Certified Q-Grader Maya',
    duration: '1.5 Hours (90 Mins)',
    schedule: 'Every Saturday • 11:00 AM - 12:30 PM',
    price: 799,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    description: 'Experience 8 distinct global micro-lots (Ethiopia, Panama Geisha, Colombia, Chikmagalur) following official SCA cupping protocols.',
    perks: ['Tasting Flavor Wheel Guidebook', '250g Fresh Roast Bag Included', 'Sensory Palate Calibration'],
    spotsLeft: 3
  },
  {
    id: 'pourover-dialing',
    title: 'Precision Pour-Over Dialing (V60 & AeroPress)',
    instructor: 'Master Brewer Arjun',
    duration: '1.5 Hours (90 Mins)',
    schedule: 'Every Sunday • 10:30 AM - 12:00 PM',
    price: 699,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Master grind particle science, water temperature profiling, pulse pouring ratios, and TDS extraction yields.',
    perks: ['Take-home Deja Brew Brew Guide', 'Batch Brew Tasting flight', 'Troubleshooting Chart'],
    spotsLeft: 6
  }
];

export const WorkshopsModal: React.FC<WorkshopsModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useOrder();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop>(WORKSHOPS[0]);
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const handleBookSession = () => {
    const notes = `${selectedWorkshop.schedule} • Instructor: ${selectedWorkshop.instructor}. Attendee: ${attendeeName || 'Coffee Enthusiast'}`;
    addToCart(
      {
        id: `workshop-${selectedWorkshop.id}`,
        name: `Masterclass: ${selectedWorkshop.title} (${attendeesCount} Person)`,
        tagline: 'Barista Guild Workshop Ticket',
        category: 'brewed',
        price: selectedWorkshop.price * attendeesCount,
        description: notes,
        image: selectedWorkshop.image,
        isCustomizable: false,
      },
      {
        milk: 'none',
        shots: 'single',
        syrup: 'none',
        syrupPumps: 0,
        temp: 'hot',
        sweetness: '100%',
        notes: notes,
      },
      1
    );

    playSoundEffect('success');
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FFF9FA] border-2 border-[#F8BBD0] rounded-3xl shadow-2xl p-6 sm:p-8 text-[#2D2020]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white border border-[#F8D7DF] text-[#8C7575] hover:text-[#E84A74] hover:bg-[#FFF0F3] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] border border-[#F8D7DF] rounded-full text-xs font-bold text-[#E84A74]">
            <Award className="w-3.5 h-3.5" />
            <span>Barista Guild & Academy</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
            Weekend Barista Masterclasses 🎓
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6767] max-w-lg mx-auto">
            Hands-on coffee brewing, sensory cupping, and latte art pouring sessions hosted right here in our Deja Brew laboratory.
          </p>
        </div>

        {/* Workshop Cards Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {WORKSHOPS.map((ws) => {
            const isSelected = selectedWorkshop.id === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => {
                  setSelectedWorkshop(ws);
                  playSoundEffect('click');
                }}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E84A74] bg-[#FFF0F3] shadow-md scale-102'
                    : 'border-[#F8D7DF] bg-white hover:bg-[#FFF8FA]'
                }`}
              >
                <div>
                  <div className="aspect-16/10 rounded-xl overflow-hidden mb-2.5 border border-[#F8D7DF]">
                    <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      🔥 Only {ws.spotsLeft} spots left
                    </span>
                    <span className="font-mono text-xs text-[#2D2020]">₹{ws.price}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#2D2020] mt-1.5 line-clamp-2">
                    {ws.title}
                  </h4>
                </div>

                <div className="text-[10px] text-[#8C7575] mt-2 pt-2 border-t border-[#F8D7DF]/60">
                  <span>{ws.duration}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Workshop Details & Registration Form */}
        <div className="bg-white border border-[#F8D7DF] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F8D7DF] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2D2020]">
                {selectedWorkshop.title}
              </h3>
              <p className="text-xs text-[#7A6767] mt-0.5">{selectedWorkshop.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8C7575] block">Per Participant</span>
              <span className="font-mono font-bold text-xl text-[#E84A74]">₹{selectedWorkshop.price}</span>
            </div>
          </div>

          {/* Perks */}
          <div className="bg-[#FFF9FA] border border-[#F8D7DF] rounded-xl p-3">
            <span className="text-[10px] font-bold text-[#8C7575] uppercase tracking-wider block mb-1.5">
              Included with your ticket:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#5D4A4A]">
              {selectedWorkshop.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#2D2020] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E84A74]" />
                <span>Session Schedule:</span>
              </label>
              <div className="px-3 py-2 bg-[#FFF0F3] border border-[#F8D7DF] rounded-xl font-medium text-[#2D2020]">
                {selectedWorkshop.schedule}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2D2020] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#E84A74]" />
                <span>Seats to Reserve:</span>
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAttendeesCount(num)}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                      attendeesCount === num
                        ? 'bg-[#E84A74] text-white border-[#E84A74] shadow-xs'
                        : 'bg-[#FFF0F3] text-[#5D4A4A] border-[#F8D7DF] hover:bg-[#FDE8ED]'
                    }`}
                  >
                    {num} {num === 1 ? 'Seat' : 'Seats'}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-[#2D2020]">
                Attendee Name(s) for Certificate:
              </label>
              <input
                type="text"
                placeholder="e.g. Maya Lin & Chris Lee"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF0F3] border border-[#F8D7DF] rounded-xl text-xs text-[#2D2020] focus:outline-none focus:ring-1 focus:ring-[#E84A74]"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-[#8C7575]">Total: </span>
              <span className="font-mono font-bold text-base text-[#2D2020]">₹{selectedWorkshop.price * attendeesCount}</span>
            </div>

            <button
              onClick={handleBookSession}
              disabled={isBooked}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E84A74] to-[#FF8EA8] hover:from-[#D43862] hover:to-[#E84A74] text-white font-bold text-xs shadow-md shadow-[#E84A74]/20 flex items-center gap-2 transition-transform hover:scale-105"
            >
              {isBooked ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Seats Booked & Added to Cart!</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Reserve Masterclass Ticket</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

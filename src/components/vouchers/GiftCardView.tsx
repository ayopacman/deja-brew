'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gift,
  Sparkles,
  QrCode,
  Share2,
  Copy,
  Check,
  Heart,
  Coffee,
  Ticket,
  Percent,
  CheckCircle2,
  ArrowRight,
  Lock,
  Unlock,
  Plus,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { playSoundEffect } from '../../utils/sound';

export interface PublishedVoucher {
  id: string;
  code: string;
  theme: 'ribbon-pink' | 'wavy-pastel';
  title: string;
  amount: number;
  discountType: 'fixed' | 'percent';
  recipientName: string;
  senderName: string;
  message: string;
  expiry: string;
  createdAt: number;
}

const DEFAULT_VOUCHERS: PublishedVoucher[] = [
  {
    id: 'vouch-01',
    code: 'DEJA-RIBBON-500',
    theme: 'ribbon-pink',
    title: 'Cherry Ribbon Gift Pass',
    amount: 500,
    discountType: 'fixed',
    recipientName: 'Valued Coffee Lover',
    senderName: 'Deja Brew Team',
    message: 'Enjoy a cozy cup of specialty single-origin coffee and freshly baked pastries on us! 🌸☕',
    expiry: 'No Expiry',
    createdAt: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    id: 'vouch-02',
    code: 'DEJA-WAVY-1000',
    theme: 'wavy-pastel',
    title: 'Modern Wavy Deluxe Pass',
    amount: 1000,
    discountType: 'fixed',
    recipientName: 'Special Guest',
    senderName: 'Deja Brew Patisserie',
    message: 'Valid for all craft pour-overs, cold brews, artisan brownies, and cheesecake pairings.',
    expiry: 'Valid 1 Year',
    createdAt: Date.now() - 12 * 60 * 60 * 1000
  },
  {
    id: 'vouch-03',
    code: 'LUCKYBEAN50',
    theme: 'ribbon-pink',
    title: 'Bakery Snack Sweet Perk',
    amount: 50,
    discountType: 'fixed',
    recipientName: 'Snack Lover',
    senderName: 'Deja Brew Bakery',
    message: 'Flat ₹50 off on any croissant, banana walnut bread, or lemon drizzle pound cake.',
    expiry: 'Active Today',
    createdAt: Date.now() - 6 * 60 * 60 * 1000
  }
];

export const GiftCardView: React.FC = () => {
  const { applyCoupon, setIsCartOpen } = useOrder();
  
  // Published Vouchers State
  const [vouchers, setVouchers] = useState<PublishedVoucher[]>(DEFAULT_VOUCHERS);
  
  // Customer Redeem State
  const [redeemCodeInput, setRedeemCodeInput] = useState<string>('');
  const [redeemStatus, setRedeemStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Staff Creator State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [staffPin, setStaffPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // New Voucher Form
  const [newTheme, setNewTheme] = useState<'ribbon-pink' | 'wavy-pastel'>('ribbon-pink');
  const [newTitle, setNewTitle] = useState('Holiday Blossom Voucher');
  const [newAmount, setNewAmount] = useState<number>(500);
  const [newCustomAmount, setNewCustomAmount] = useState<string>('');
  const [newCode, setNewCode] = useState('DEJA-CHERRY-500');
  const [newRecipient, setNewRecipient] = useState('Priya');
  const [newSender, setNewSender] = useState('Deja Brew Staff');
  const [newMessage, setNewMessage] = useState('Enjoy fresh artisan single-origins and pastries on us! 🌸☕');
  const [newExpiry, setNewExpiry] = useState('Valid for 6 Months');
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dejabrew_published_vouchers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVouchers(parsed);
        }
      }
    } catch (e) {
      console.warn('Voucher storage error', e);
    }
  }, []);

  const saveVouchers = (updated: PublishedVoucher[]) => {
    setVouchers(updated);
    try {
      localStorage.setItem('dejabrew_published_vouchers', JSON.stringify(updated));
    } catch (e) {
      console.warn('Save vouchers error', e);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    playSoundEffect('click');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCustomerRedeem = (codeToRedeem: string) => {
    const code = codeToRedeem.trim().toUpperCase();
    if (!code) return;
    
    // Check if it's one of the published vouchers or promo coupons
    const res = applyCoupon(code);
    if (res.success) {
      setRedeemStatus(res);
      playSoundEffect('success');
      setTimeout(() => setIsCartOpen(true), 1200);
    } else {
      // Fallback check if it's an active published voucher with custom fixed amount
      const foundVoucher = vouchers.find((v) => v.code.toUpperCase() === code);
      if (foundVoucher) {
        applyCoupon('DEJALOVE'); // Apply discount
        setRedeemStatus({
          success: true,
          message: `Voucher ${foundVoucher.code} redeemed! ₹${foundVoucher.amount} applied to your cart.`
        });
        playSoundEffect('success');
        setTimeout(() => setIsCartOpen(true), 1200);
      } else {
        setRedeemStatus(res);
        playSoundEffect('click');
      }
    }
  };

  const handleStaffPinVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = staffPin.trim().toUpperCase();
    if (clean === '1237' || clean === 'DEJABARISTA') {
      setIsStaffAuthenticated(true);
      sessionStorage.setItem('dejabrew_staff_auth', 'true');
      setPinError(false);
      playSoundEffect('success');
    } else {
      setPinError(true);
      playSoundEffect('click');
      setStaffPin('');
    }
  };

  const handlePublishVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmt = newCustomAmount ? parseInt(newCustomAmount, 10) || 500 : newAmount;
    const finalCode = (newCode.trim() || `DEJA-VOUCHER-${finalAmt}`).toUpperCase();

    const created: PublishedVoucher = {
      id: `vouch-${Date.now()}`,
      code: finalCode,
      theme: newTheme,
      title: newTitle.trim() || 'Deja Brew Gift Card',
      amount: finalAmt,
      discountType: 'fixed',
      recipientName: newRecipient.trim() || 'Coffee Lover',
      senderName: newSender.trim() || 'Deja Brew Staff',
      message: newMessage.trim() || 'Enjoy artisan coffee on us!',
      expiry: newExpiry.trim() || 'No Expiry',
      createdAt: Date.now()
    };

    const updated = [created, ...vouchers];
    saveVouchers(updated);
    setPublishSuccess(true);
    playSoundEffect('success');

    setTimeout(() => {
      setPublishSuccess(false);
      setIsStaffModalOpen(false);
    }, 1500);
  };

  const handleDeleteVoucher = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = vouchers.filter((v) => v.id !== id);
    saveVouchers(updated);
    playSoundEffect('click');
  };

  const currentPreviewAmount = newCustomAmount ? parseInt(newCustomAmount, 10) || 500 : newAmount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F6] via-[#FFF9F9] to-white py-10 px-4 sm:px-6 lg:px-8 text-[#2D2020]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FFF0F3] border border-[#F8D7DF] px-4 py-1.5 rounded-full text-xs font-bold text-[#E84A74] shadow-xs">
            <Gift className="w-3.5 h-3.5" />
            <span>Artisan Gifting & Customer Redemption</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-[#2D2020]">
            Deja Brew <span className="text-[#E84A74]">Gift Cards & Vouchers</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6767] leading-relaxed">
            Redeem your coffee vouchers for specialty single-origins and bakery treats, or explore official gift cards issued by our baristas.
          </p>

          {/* Barista Staff Link */}
          <div className="pt-2">
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7575] hover:text-[#E84A74] bg-white hover:bg-[#FFF0F3] px-4 py-2 rounded-full border border-[#F8D7DF] transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Staff Portal: Create & Issue New Voucher</span>
            </button>
          </div>
        </div>

        {/* 1. CUSTOMER REDEEM SECTION (Dedicated for Customers) */}
        <div className="max-w-2xl mx-auto bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] border border-[#F8D7DF] flex items-center justify-center text-[#E84A74] mx-auto shadow-xs">
            <Ticket className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif font-black text-2xl text-[#2D2020]">
              Redeem Your Gift Card or Voucher Code
            </h2>
            <p className="text-xs text-[#7A6767]">
              Enter your voucher code below to instantly apply savings directly to your cart.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCustomerRedeem(redeemCodeInput);
            }}
            className="space-y-3"
          >
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter Voucher Code (e.g. DEJA-RIBBON-500)"
                value={redeemCodeInput}
                onChange={(e) => setRedeemCodeInput(e.target.value)}
                className="flex-1 bg-[#FFF9F9] border border-[#F8D7DF] rounded-2xl px-4 py-3 text-xs font-mono font-bold text-[#2D2020] uppercase focus:outline-none focus:border-[#E84A74]"
              />
              <button
                type="submit"
                className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all shadow-md shadow-[#E84A74]/20"
              >
                Redeem to Cart
              </button>
            </div>

            {redeemStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto ${
                  redeemStatus.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {redeemStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{redeemStatus.message}</span>
              </div>
            )}
          </form>

          {/* Quick Active Code Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-bold text-[#8C7575] uppercase">Popular Codes:</span>
            {['DEJALOVE', 'LUCKYBEAN50', 'FREESHOT', 'BLOSSOM20'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setRedeemCodeInput(c);
                  handleCustomerRedeem(c);
                }}
                className="text-[10px] font-mono font-bold bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] border border-[#F8D7DF] px-2.5 py-1 rounded-lg transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 2. ACTIVE GIFT CARDS & VOUCHERS GALLERY (Customer Showcase) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#F8D7DF] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E84A74]">
                Available Gift Passes
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
                Official Deja Brew Vouchers
              </h2>
            </div>
            <span className="text-xs font-bold text-[#8C7575] bg-white border border-[#F8D7DF] px-3.5 py-1.5 rounded-full">
              {vouchers.length} Active Vouchers Published
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="space-y-3"
              >
                {/* VOUCHER THEME 1: RIBBON CANDY STRIPED TICKET (Matching User Inspo 1) */}
                {voucher.theme === 'ribbon-pink' && (
                  <div className="relative overflow-hidden bg-[#FCE4EC] border-4 border-[#F8BBD0] rounded-3xl p-3 sm:p-4 shadow-xl transition-all hover:scale-[1.01]">
                    
                    {/* Outer Striped Pattern Border */}
                    <div
                      className="rounded-2xl p-2.5 shadow-inner"
                      style={{
                        background: 'repeating-linear-gradient(45deg, #E84A74, #E84A74 12px, #FFFFFF 12px, #FFFFFF 24px, #FF8EA8 24px, #FF8EA8 36px, #FFFFFF 36px, #FFFFFF 48px)'
                      }}
                    >
                      <div className="bg-[#FFF0F5] border-2 border-white rounded-xl p-5 relative overflow-hidden text-[#4A2828] shadow-md space-y-4">
                        
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-[#F8BBD0] pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E84A74] to-[#FF8EA8] flex items-center justify-center text-white shadow-md">
                              <Coffee className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-serif font-black text-xl tracking-tight text-[#E84A74]">
                                Deja Brew
                              </div>
                              <div className="text-[8px] font-bold uppercase tracking-widest text-[#9E334D]">
                                SPECIALTY COFFEE & PAIRINGS
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center text-center bg-white border border-[#F8BBD0] rounded-xl p-1.5 shadow-2xs max-w-[120px]">
                            <div className="w-10 h-10 bg-[#FFF0F3] rounded-lg flex items-center justify-center">
                              <QrCode className="w-8 h-8 text-[#E84A74]" />
                            </div>
                            <span className="text-[7px] font-black uppercase text-[#E84A74] mt-0.5">
                              SCAN & REDEEM
                            </span>
                          </div>
                        </div>

                        {/* Satin Ribbon & Gold Wax Seal Medallion */}
                        <div className="relative my-4 flex items-center justify-center">
                          <div className="w-full h-7 bg-gradient-to-r from-[#FF7597] via-[#E84A74] to-[#FF7597] shadow-xs flex items-center justify-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">
                              🌸 DEJA BREW GIFT VOUCHER PASS 🌸
                            </span>
                          </div>

                          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-[#F59E0B] via-[#FBBF24] to-[#FDE68A] border-2 border-white shadow-md flex flex-col items-center justify-center text-[#78350F]">
                            <span className="font-serif italic font-black text-[10px] leading-none">Art by</span>
                            <span className="font-serif font-black text-[8px] uppercase tracking-tighter">Deja Brew</span>
                          </div>
                        </div>

                        {/* Value & Details */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-white/95 border border-[#F8D7DF] rounded-xl p-3">
                            <div>
                              <span className="text-[9px] font-bold text-[#8C7575] uppercase tracking-wider block">
                                GIFT CARD VALUED AT
                              </span>
                              <div className="font-serif font-black text-3xl text-[#E84A74]">
                                ₹{voucher.amount}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] font-bold text-[#8C7575] uppercase tracking-wider block">
                                VOUCHER CODE
                              </span>
                              <div className="font-mono font-black text-xs text-[#4A2828] bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#F8D7DF] inline-block mt-0.5">
                                {voucher.code}
                              </div>
                            </div>
                          </div>

                          <div className="text-xs bg-[#FFF8FA] p-2.5 rounded-xl border border-[#F8D7DF] text-[#6B5151]">
                            <div className="flex justify-between text-[10px] text-[#8C7575] font-semibold mb-1">
                              <span>To: <b className="text-[#2D2020]">{voucher.recipientName}</b></span>
                              <span>From: <b className="text-[#2D2020]">{voucher.senderName}</b></span>
                            </div>
                            <p className="italic text-[11px]">"{voucher.message}"</p>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* VOUCHER THEME 2: MODERN WAVY PASTEL CARD (Matching User Inspo 2) */}
                {voucher.theme === 'wavy-pastel' && (
                  <div className="relative overflow-hidden bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-7 shadow-xl transition-all hover:scale-[1.01]">
                    
                    {/* Wavy Background Graphic */}
                    <div className="absolute inset-0 opacity-25 pointer-events-none">
                      <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,80 C150,160 350,20 500,100 L500,0 L0,0 Z" fill="#F8BBD0" />
                        <path d="M0,140 C200,80 300,180 500,120 L500,200 L0,200 Z" fill="#FFE4E6" />
                      </svg>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      <div className="sm:col-span-7 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#FFF0F3] border border-[#F8D7DF] flex items-center justify-center text-[#E84A74]">
                            <Coffee className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-serif font-black text-xs text-[#E84A74] tracking-wider uppercase">
                            Deja Brew
                          </span>
                        </div>

                        <h3
                          className="font-serif italic text-4xl sm:text-5xl text-[#9E334D] leading-none"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          gift <br /> card
                        </h3>

                        <p className="text-[11px] text-[#7A6767]">
                          From <b className="text-[#2D2020]">{voucher.senderName}</b>
                        </p>
                        <p className="text-[11px] italic text-[#8C7575]">
                          "{voucher.message}"
                        </p>
                      </div>

                      <div className="sm:col-span-5 bg-white/95 backdrop-blur-xs border-2 border-[#F8D7DF] rounded-2xl p-4 text-center space-y-2.5 shadow-md">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#8C7575]">
                            GIFT PASS VALUE
                          </span>
                          <div className="font-serif font-black text-3xl text-[#E84A74]">
                            ₹{voucher.amount}
                          </div>
                        </div>

                        <div className="bg-[#2D2020] text-white font-mono font-black text-xs py-1.5 px-2.5 rounded-lg tracking-widest">
                          {voucher.code}
                        </div>

                        <div className="text-[9px] text-[#A88C8C]">
                          {voucher.expiry}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Voucher Customer Action Bar */}
                <div className="bg-white border border-[#F8D7DF] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(voucher.code)}
                      className="bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] font-bold text-xs py-1.5 px-3 rounded-xl border border-[#F8D7DF] flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode === voucher.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === voucher.code ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const shareText = `☕ Here is a ₹${voucher.amount} Deja Brew Gift Voucher: ${voucher.code}! Redeem at https://dejabrew.cafe`;
                        if (navigator.share) {
                          navigator.share({ title: 'Deja Brew Gift Card', text: shareText });
                        } else {
                          handleCopyCode(shareText);
                        }
                      }}
                      className="bg-white hover:bg-[#FFF9F9] text-[#7A6767] font-bold text-xs py-1.5 px-3 rounded-xl border border-[#F8D7DF] flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setRedeemCodeInput(voucher.code);
                      handleCustomerRedeem(voucher.code);
                    }}
                    className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Redeem to My Cart</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🔒 STAFF MODAL: CREATE & PUBLISH NEW VOUCHER */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020] max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setIsStaffModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74]"
            >
              ✕
            </button>

            {/* If Not Authenticated, Show Staff PIN Keypad */}
            {!isStaffAuthenticated ? (
              <div className="text-center space-y-5 max-w-sm mx-auto py-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] flex items-center justify-center mx-auto shadow-xs">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#2D2020]">
                    Staff Authentication Required
                  </h3>
                  <p className="text-xs text-[#7A6767] mt-1">
                    Creating and issuing official gift cards is restricted to cafe staff & managers.
                  </p>
                </div>

                <form onSubmit={handleStaffPinVerify} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#8C7575] uppercase block mb-1">
                      Enter Staff Passkey PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={staffPin}
                      onChange={(e) => setStaffPin(e.target.value)}
                      placeholder="• • • •"
                      className="w-32 mx-auto text-center tracking-widest text-xl font-mono font-bold bg-[#FFF9F9] border-2 border-[#F8D7DF] rounded-xl p-2.5 focus:outline-none focus:border-[#E84A74]"
                    />
                  </div>

                  {pinError && (
                    <p className="text-xs font-bold text-rose-600">Incorrect Passkey PIN. Access Denied.</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                  >
                    Unlock Voucher Creator
                  </button>
                </form>
              </div>
            ) : (
              /* STAFF VOUCHER CREATOR FORM */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#F8D7DF] pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#E84A74] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-[#F8D7DF]">
                      <Unlock className="w-3 h-3" />
                      <span>Staff Creator Portal</span>
                    </div>
                    <h3 className="font-serif font-black text-2xl text-[#2D2020] pt-1">
                      Design & Issue New Gift Voucher
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsStaffAuthenticated(false);
                      sessionStorage.removeItem('dejabrew_staff_auth');
                    }}
                    className="text-[10px] font-bold text-[#8C7575] hover:text-[#E84A74]"
                  >
                    Lock Portal
                  </button>
                </div>

                {publishSuccess ? (
                  <div className="bg-[#EAFBF0] border border-emerald-300 text-emerald-900 rounded-2xl p-6 text-center space-y-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-lg">Voucher Published Successfully! 🎉</h4>
                    <p className="text-xs text-emerald-700">
                      The new voucher is now live on the customer Gift Cards & Vouchers page and ready for immediate redemption!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePublishVoucher} className="space-y-5">
                    
                    {/* Theme Selector */}
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-2">
                        1. Voucher Visual Theme
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNewTheme('ribbon-pink')}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                            newTheme === 'ribbon-pink'
                              ? 'border-[#E84A74] bg-[#FFF0F3] ring-2 ring-[#E84A74]/20'
                              : 'border-[#F8D7DF] bg-[#FFF9F9]'
                          }`}
                        >
                          <span className="text-xs font-bold text-[#E84A74]">🎀 Cherry Ribbon Ticket</span>
                          <span className="text-[10px] text-[#7A6767]">Candy stripes, satin ribbon & gold seal</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewTheme('wavy-pastel')}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                            newTheme === 'wavy-pastel'
                              ? 'border-[#E84A74] bg-[#FFF0F3] ring-2 ring-[#E84A74]/20'
                              : 'border-[#F8D7DF] bg-[#FFF9F9]'
                          }`}
                        >
                          <span className="text-xs font-bold text-[#E84A74]">🌸 Modern Wavy Pastel</span>
                          <span className="text-[10px] text-[#7A6767]">Luxury script calligraphy with coupon box</span>
                        </button>
                      </div>
                    </div>

                    {/* Voucher Amount & Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-1">
                          2. Value in INR (₹)
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 mb-2">
                          {[250, 500, 1000, 2000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setNewAmount(amt);
                                setNewCustomAmount('');
                                setNewCode(`DEJA-CHERRY-${amt}`);
                              }}
                              className={`py-2 rounded-xl text-xs font-black transition-all ${
                                newAmount === amt && !newCustomAmount
                                  ? 'bg-[#E84A74] text-white shadow-xs'
                                  : 'bg-[#FFF9F9] border border-[#F8D7DF] text-[#4A2828]'
                              }`}
                            >
                              ₹{amt}
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          placeholder="Or custom ₹ (e.g. 750)"
                          value={newCustomAmount}
                          onChange={(e) => {
                            setNewCustomAmount(e.target.value);
                            if (e.target.value) {
                              setNewCode(`DEJA-VOUCHER-${e.target.value}`);
                            }
                          }}
                          className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-1">
                          3. Redeem Promo Code
                        </label>
                        <input
                          type="text"
                          required
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                          placeholder="e.g. DEJA-SUMMER-500"
                          className="w-full text-xs font-mono font-bold uppercase bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E84A74]"
                        />
                        <div className="text-[10px] text-[#8C7575] mt-1">
                          Customers will enter this code to redeem.
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-1">
                          Voucher Title
                        </label>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Festive Blossom Gift Pass"
                          className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-1">
                          Validity / Expiry
                        </label>
                        <input
                          type="text"
                          value={newExpiry}
                          onChange={(e) => setNewExpiry(e.target.value)}
                          placeholder="e.g. Valid 6 Months / No Expiry"
                          className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-1">
                        Gift Message Note
                      </label>
                      <textarea
                        rows={2}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Note displayed on the voucher ticket..."
                        className="w-full text-xs bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl p-2.5 resize-none"
                      />
                    </div>

                    {/* Submit Button to Add to Page */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white text-sm font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E84A74]/25 transition-all hover:scale-[1.01]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publish & Add to Gift Cards and Vouchers Page (₹{currentPreviewAmount})</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

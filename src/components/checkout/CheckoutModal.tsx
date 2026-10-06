'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '../../context/OrderContext';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, Smartphone, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/sound';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupTime: string;
  tipAmount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  pickupTime,
  tipAmount,
}) => {
  const router = useRouter();
  const { createOrder, cartTotal, setIsCartOpen } = useOrder();

  const [name, setName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('aarav@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'apple-pay' | 'google-pay' | 'counter'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const total = cartTotal + tipAmount;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name for the pickup ticket');
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const order = await createOrder({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          pickupTime,
          paymentMethod,
          tip: tipAmount,
        });

        setIsProcessing(false);
        setIsSuccess(true);
        playSoundEffect('ready_bell');

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E84A74', '#FF8EA8', '#FDE8ED', '#F59E0B']
        });

        setTimeout(() => {
          setIsCartOpen(false);
          onClose();
          router.push(`/track?id=${order.id}`);
        }, 1800);
      } catch (err) {
        console.error('Order placement error', err);
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white border border-[#F8D7DF] rounded-3xl overflow-hidden shadow-2xl text-[#2D2020]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#FFF0F3] border-b border-[#F8D7DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E84A74] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-[#2D2020]">deja brew Checkout</h3>
              <p className="text-[10px] text-[#8C7575]">Instant Order Ahead & Barista Handoff</p>
            </div>
          </div>
          {!isProcessing && !isSuccess && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#FDE8ED] flex items-center justify-center text-[#5D4A4A] shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Success */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FDE8ED] border-2 border-[#E84A74] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-[#E84A74]" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#2D2020]">Order Placed!</h3>
            <p className="text-xs text-[#8C7575] max-w-xs">
              Your drink ticket is now live on the barista kitchen display!
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E84A74] bg-[#FFF0F3] px-4 py-2 rounded-xl border border-[#F8D7DF]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Opening live tracker...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-5 space-y-4 text-xs">
            
            {/* Customer Details */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block">
                Pickup Customer Details
              </label>

              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (called at counter)"
                  className="w-full bg-[#FFF8F8] border border-[#F8D7DF] text-[#2D2020] rounded-xl p-3 focus:outline-none focus:border-[#E84A74]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile for SMS"
                  className="w-full bg-[#FFF8F8] border border-[#F8D7DF] text-[#2D2020] rounded-xl p-3 focus:outline-none focus:border-[#E84A74]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Receipt Email"
                  className="w-full bg-[#FFF8F8] border border-[#F8D7DF] text-[#2D2020] rounded-xl p-3 focus:outline-none focus:border-[#E84A74]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block">
                Payment Option
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                      : 'bg-[#FFF8F8] border-[#F8D7DF] text-[#8C7575]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[10px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google-pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'google-pay'
                      ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                      : 'bg-[#FFF8F8] border-[#F8D7DF] text-[#8C7575]'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px]">GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#FDE8ED] border-[#E84A74] text-[#E84A74] font-bold'
                      : 'bg-[#FFF8F8] border-[#F8D7DF] text-[#8C7575]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px]">Card / Counter</span>
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-[#FFF0F3] rounded-xl border border-[#F8D7DF] flex justify-between items-center text-xs">
              <span className="text-[#8C7575] font-medium">Total Payable:</span>
              <span className="font-mono font-bold text-base text-[#E84A74]">₹{total}</span>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay ₹{total} & Send to Barista</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '../../context/OrderContext';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, Smartphone } from 'lucide-react';
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
  const { createOrder, cartTotal, cartSubtotal, setIsCartOpen } = useOrder();

  const [name, setName] = useState('Devon Takahashi');
  const [phone, setPhone] = useState('(555) 342-9901');
  const [email, setEmail] = useState('devon.coffee@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'google-pay' | 'counter'>('apple-pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const total = Number((cartTotal + tipAmount).toFixed(2));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name for the pickup ticket');
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway roundtrip
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

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C88A58', '#965B32', '#FDFBF7', '#E58C3A']
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#1A1715] border border-[#3E352F] rounded-3xl overflow-hidden shadow-2xl text-[#FDFBF7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#14110F] border-b border-[#3E352F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C88A58]/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#C88A58]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FDFBF7]">Click & Sip Checkout</h3>
              <p className="text-[10px] text-[#A89F91]">Encrypted Stripe & Apple Pay</p>
            </div>
          </div>
          {!isProcessing && !isSuccess && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#24201D] hover:bg-[#3E352F] flex items-center justify-center text-[#A89F91] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#FDFBF7]">Order Confirmed!</h3>
            <p className="text-xs text-[#A89F91] max-w-xs">
              Your ticket has been beamed directly to the Barista Kitchen Display System.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C88A58] bg-[#24201D] px-4 py-2 rounded-xl border border-[#3E352F]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to live tracker...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-5 space-y-4 text-xs">
            
            {/* Customer Details */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-semibold text-[#A89F91] uppercase tracking-wider block">
                Pickup Customer Details
              </label>

              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (called at counter)"
                  className="w-full bg-[#24201D] border border-[#3E352F] text-[#FDFBF7] rounded-xl p-3 focus:outline-none focus:border-[#C88A58]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile (for SMS update)"
                  className="w-full bg-[#24201D] border border-[#3E352F] text-[#FDFBF7] rounded-xl p-3 focus:outline-none focus:border-[#C88A58]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Receipt Email"
                  className="w-full bg-[#24201D] border border-[#3E352F] text-[#FDFBF7] rounded-xl p-3 focus:outline-none focus:border-[#C88A58]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#A89F91] uppercase tracking-wider block">
                Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'apple-pay'
                      ? 'bg-black text-white border-white'
                      : 'bg-[#24201D] border-[#3E352F] text-[#A89F91]'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="font-semibold text-[10px]">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google-pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'google-pay'
                      ? 'bg-[#1E293B] text-white border-sky-400'
                      : 'bg-[#24201D] border-[#3E352F] text-[#A89F91]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-[10px]">Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#965B32]/30 text-white border-[#C88A58]'
                      : 'bg-[#24201D] border-[#3E352F] text-[#A89F91]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C88A58]" />
                  <span className="font-semibold text-[10px]">Card (Stripe)</span>
                </button>
              </div>
            </div>

            {/* Simulated Card form if selected */}
            {paymentMethod === 'card' && (
              <div className="p-3 bg-[#24201D] border border-[#3E352F] rounded-xl space-y-2">
                <input
                  type="text"
                  defaultValue="4242 •••• •••• 4242"
                  className="w-full bg-[#1A1715] border border-[#3E352F] text-[#FDFBF7] rounded-lg p-2 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full bg-[#1A1715] border border-[#3E352F] text-[#FDFBF7] rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="CVC 889"
                    className="w-full bg-[#1A1715] border border-[#3E352F] text-[#FDFBF7] rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Total breakdown */}
            <div className="p-3 bg-[#14110F] rounded-xl border border-[#2E2824] flex justify-between items-center text-xs">
              <span className="text-[#A89F91]">Total with Tip & Tax:</span>
              <span className="font-serif font-bold text-base text-[#C88A58]">${total.toFixed(2)}</span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#C88A58] to-[#965B32] hover:from-[#DB9C69] hover:to-[#A8693A] text-[#14110F] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#965B32]/30 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing & Transmitting Ticket...</span>
                </>
              ) : (
                <span>Authorize & Pay ${total.toFixed(2)}</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

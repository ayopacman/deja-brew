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
  const { createOrder, cartTotal, cartSubtotal, cartTax, cartDiscount, appliedCoupon, orderType, setOrderType, tableNumber, setTableNumber, setIsCartOpen } = useOrder();

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
      alert('Please enter a name for the order ticket');
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const order = await createOrder({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          orderType,
          tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
          pickupTime: orderType === 'dine-in' ? `Dine-In (${tableNumber})` : pickupTime,
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
        className="relative w-full max-w-md bg-white border border-[#F8D7DF] rounded-3xl overflow-hidden shadow-2xl text-[#2D2020] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#FFF0F3] border-b border-[#F8D7DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#F8D7DF] bg-white flex items-center justify-center p-0.5 shadow-xs">
              <img src="/icon.png" alt="Deja Brew" className="w-full h-full object-contain rounded-md" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-[#2D2020]">Deja Brew Checkout</h3>
              <p className="text-[10px] text-[#8C7575]">Instant Order & Barista Handoff</p>
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
              {orderType === 'dine-in'
                ? `Your order will be served directly to ${tableNumber}!`
                : 'Your pickup ticket is live on the barista kitchen display!'}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E84A74] bg-[#FFF0F3] px-4 py-2 rounded-xl border border-[#F8D7DF]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Opening live tracker...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-5 space-y-4 text-xs">
            
            {/* Dining Mode (Takeaway vs Dine-in Table) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block">
                Order Type & Service
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-[#E84A74] text-white border-[#E84A74] shadow-xs'
                      : 'bg-[#FFF9F9] border-[#F8D7DF] text-[#7A6767]'
                  }`}
                >
                  🥡 Takeaway Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    orderType === 'dine-in'
                      ? 'bg-[#E84A74] text-white border-[#E84A74] shadow-xs'
                      : 'bg-[#FFF9F9] border-[#F8D7DF] text-[#7A6767]'
                  }`}
                >
                  🪑 Dine-In (Table)
                </button>
              </div>

              {orderType === 'dine-in' && (
                <div className="pt-1 animate-in fade-in duration-150">
                  <label className="text-[10px] font-bold text-[#8C7575] block mb-1">
                    Select Your Table
                  </label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#FFF0F3] border border-[#F8D7DF] text-[#2D2020] font-bold rounded-xl p-2.5 focus:outline-none focus:border-[#E84A74]"
                  >
                    {['Table 1 (Window)', 'Table 2 (Cozy Nook)', 'Table 3 (Blossom Garden)', 'Table 4 (Bar Counter)', 'Table 5 (Terrace)', 'Table 6 (Reading Loft)'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#8C7575] uppercase tracking-wider block">
                Customer Details
              </label>

              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (for order ticket)"
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

            {/* Price Summary Breakdown */}
            <div className="p-3 bg-[#FFF0F3] rounded-xl border border-[#F8D7DF] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8C7575]">
                <span>Items Subtotal:</span>
                <span className="font-mono text-[#2D2020]">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span className="font-mono">-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8C7575]">
                <span>GST (5%):</span>
                <span className="font-mono text-[#2D2020]">₹{cartTax}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-[#8C7575]">
                  <span>Barista Tip:</span>
                  <span className="font-mono text-[#E84A74]">+₹{tipAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#F8D7DF] text-sm font-bold">
                <span className="text-[#2D2020]">Total Payable:</span>
                <span className="font-mono font-bold text-base text-[#E84A74]">₹{total}</span>
              </div>
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
                <span>Pay ₹{total} & Place Order</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

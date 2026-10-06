'use client';

import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { X, Trash2, Plus, Minus, Clock, ShoppingBag, ArrowRight, Coffee } from 'lucide-react';
import { CheckoutModal } from '../checkout/CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
  } = useOrder();

  const [pickupTime, setPickupTime] = useState<string>('ASAP (~10 mins)');
  const [tipAmount, setTipAmount] = useState<number>(30);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success?: boolean; text?: string } | null>(null);

  if (!isCartOpen) return null;

  const finalTotal = cartTotal + tipAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponMsg({ success: true, text: res.message });
      setCouponInput('');
    } else {
      setCouponMsg({ success: false, text: res.message });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-md h-full bg-white border-l border-[#F8D7DF] flex flex-col justify-between shadow-2xl text-[#2D2020]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#F8D7DF] flex items-center justify-between bg-[#FFF0F3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#F8D7DF] bg-white flex items-center justify-center p-0.5 shadow-xs">
                <img src="/icon.png" alt="Deja Brew" className="w-full h-full object-contain rounded-md" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base text-[#2D2020]">Deja Brew Order</h3>
                <p className="text-[11px] text-[#8C7575]">Counter Pickup & Brew Queue</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#8C7575] hover:text-[#E84A74] px-2 py-1 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#FDE8ED] flex items-center justify-center text-[#5D4A4A] shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFF9F9]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FFF0F3] flex items-center justify-center text-[#E84A74]">
                  <Coffee className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#2D2020]">Your bag is empty</h4>
                <p className="text-xs text-[#8C7575] max-w-xs">
                  Discover our freshly pulled double ristrettos, Spanish lattes, and almond croissants!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-[#F8D7DF] rounded-2xl flex gap-3 shadow-xs"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-[#2D2020] truncate pr-2">
                          {item.menuItem.name}
                        </h4>
                        <span className="font-bold text-xs text-[#E84A74]">
                          ₹{item.itemTotal}
                        </span>
                      </div>

                      {/* Customization Details */}
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-[#8C7575]">
                        {item.customization.temp && (
                          <span className="bg-[#FFF0F3] px-1.5 py-0.5 rounded capitalize">
                            {item.customization.temp}
                          </span>
                        )}
                        {item.customization.milk !== 'none' && (
                          <span className="bg-[#FFF0F3] px-1.5 py-0.5 rounded capitalize">
                            {item.customization.milk} milk
                          </span>
                        )}
                        {item.customization.notes && (
                          <span className="bg-[#FDE8ED] text-[#E84A74] px-1.5 py-0.5 rounded">
                            Note: {item.customization.notes}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-[#FFF0F3] rounded-lg p-1 border border-[#F8D7DF]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-white hover:bg-[#FDE8ED] flex items-center justify-center text-[#E84A74] text-xs font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-[#2D2020]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-white hover:bg-[#FDE8ED] flex items-center justify-center text-[#E84A74] text-xs font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C7575] hover:text-[#E84A74] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code / Voucher Box */}
                <div className="p-3 bg-white border border-[#F8D7DF] rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#8C7575]">
                    <span>Promo Code / Voucher</span>
                    {appliedCoupon && (
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="bg-[#EAFBF0] border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800">
                      <div>
                        <span className="font-mono font-bold">{appliedCoupon.code}</span>
                        <span className="text-[10px] block text-emerald-600">{appliedCoupon.description}</span>
                      </div>
                      <span className="font-bold text-emerald-700">-₹{cartDiscount}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. DEJALOVE, LUCKYBEAN50"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-[#FFF9F9] border border-[#F8D7DF] rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#E84A74]"
                      />
                      <button
                        type="submit"
                        className="bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMsg && !appliedCoupon && (
                    <p className={`text-[10px] ${couponMsg.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Pickup Window */}
                <div className="p-3 bg-white border border-[#F8D7DF] rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7575]">
                    <Clock className="w-3.5 h-3.5 text-[#E84A74]" />
                    <span>Pickup Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['ASAP (~10 mins)', 'In 20 mins', 'In 35 mins', 'Schedule later'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setPickupTime(time)}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          pickupTime === time
                            ? 'bg-[#E84A74] text-white border-[#E84A74]'
                            : 'bg-white border-[#F8D7DF] text-[#5D4A4A] hover:bg-[#FFF0F3]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Barista Tip */}
                <div className="p-3 bg-white border border-[#F8D7DF] rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#8C7575]">Barista Tip</span>
                    <span className="text-[#E84A74] font-bold">₹{tipAmount}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 20, 30, 50].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTipAmount(t)}
                        className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          tipAmount === t
                            ? 'bg-[#E84A74] text-white border-[#E84A74]'
                            : 'bg-[#FFF0F3] border-[#F8D7DF] text-[#5D4A4A]'
                        }`}
                      >
                        {t === 0 ? 'No Tip' : `₹${t}`}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-[#F8D7DF] space-y-3">
              <div className="space-y-1 text-xs text-[#8C7575]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#2D2020]">₹{cartSubtotal}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="text-[#2D2020]">₹{cartTax}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Barista Tip</span>
                    <span className="text-[#E84A74]">+₹{tipAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#2D2020] pt-2 border-t border-[#F8D7DF]">
                  <span>Total Payable</span>
                  <span className="font-mono font-bold text-base text-[#E84A74]">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-md shadow-[#E84A74]/20 transition-all hover:scale-[1.01]"
              >
                <span>Checkout & Brew Ticket</span>
                <div className="flex items-center gap-1 font-mono text-sm">
                  <span>₹{finalTotal}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          pickupTime={pickupTime}
          tipAmount={tipAmount}
        />
      )}
    </>
  );
};

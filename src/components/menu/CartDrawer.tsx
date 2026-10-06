'use client';

import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { X, Trash2, Plus, Minus, Clock, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CheckoutModal } from '../checkout/CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useOrder();

  const [pickupTime, setPickupTime] = useState<string>('ASAP (~10 mins)');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const tipAmount = customTip !== '' 
    ? parseFloat(customTip) || 0 
    : Number(((cartSubtotal * tipPercentage) / 100).toFixed(2));

  const finalTotal = Number((cartTotal + tipAmount).toFixed(2));

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-md h-full bg-[#171412] border-l border-[#2E2824] flex flex-col justify-between shadow-2xl text-[#FDFBF7]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#2E2824] flex items-center justify-between bg-[#14110F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#965B32]/30 flex items-center justify-center border border-[#C88A58]/30">
                <ShoppingBag className="w-4 h-4 text-[#C88A58]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#FDFBF7]">Your Coffee Bag</h3>
                <p className="text-[11px] text-[#A89F91]">Click & Sip Pickup Order</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#A89F91] hover:text-red-400 px-2 py-1 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#24201D] hover:bg-[#332D29] flex items-center justify-center text-[#A89F91] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#24201D] flex items-center justify-center text-[#6E645C]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#FDFBF7]">Your bag is empty</h4>
                <p className="text-xs text-[#A89F91] max-w-xs">
                  Discover our freshly pulled single-origin espressos, nitro cold brews, and artisan pastries.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#965B32] hover:bg-[#C88A58] text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#1F1B18] border border-[#2E2824] rounded-2xl flex gap-3 group relative"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-[#FDFBF7] truncate pr-2">
                          {item.menuItem.name}
                        </h4>
                        <span className="font-serif font-bold text-xs text-[#C88A58]">
                          ${item.itemTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Customization Badges */}
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-[#A89F91]">
                        {item.customization.temp && (
                          <span className="bg-[#2A2421] px-1.5 py-0.5 rounded capitalize">
                            {item.customization.temp}
                          </span>
                        )}
                        {item.customization.milk !== 'none' && (
                          <span className="bg-[#2A2421] px-1.5 py-0.5 rounded capitalize">
                            {item.customization.milk} milk
                          </span>
                        )}
                        {item.customization.shots && (
                          <span className="bg-[#2A2421] px-1.5 py-0.5 rounded capitalize">
                            {item.customization.shots}
                          </span>
                        )}
                        {item.customization.syrup !== 'none' && (
                          <span className="bg-[#2A2421] px-1.5 py-0.5 rounded capitalize">
                            {item.customization.syrup} ({item.customization.syrupPumps}p)
                          </span>
                        )}
                        {item.customization.notes && (
                          <span className="bg-[#965B32]/30 text-[#C88A58] px-1.5 py-0.5 rounded">
                            Note: {item.customization.notes}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-[#2A2421] rounded-lg p-1 border border-[#3E352F]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-[#1F1B18] hover:bg-[#3E352F] flex items-center justify-center text-white text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-[#1F1B18] hover:bg-[#3E352F] flex items-center justify-center text-white text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#A89F91] hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pickup Time Selector */}
                <div className="p-3 bg-[#1F1B18] border border-[#2E2824] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A89F91]">
                    <Clock className="w-3.5 h-3.5 text-[#C88A58]" />
                    <span>Pickup Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['ASAP (~10 mins)', 'In 20 mins', 'In 35 mins', 'Schedule for later'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setPickupTime(time)}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          pickupTime === time
                            ? 'bg-[#965B32] text-white border-[#C88A58]'
                            : 'bg-[#2A2421] border-[#3E352F] text-[#C9C1B5] hover:border-[#554942]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Barista Tip Selector */}
                <div className="p-3 bg-[#1F1B18] border border-[#2E2824] rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#A89F91]">Add Barista Tip</span>
                    <span className="text-[#C88A58] font-bold">${tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => {
                          setTipPercentage(pct);
                          setCustomTip('');
                        }}
                        className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          tipPercentage === pct && customTip === ''
                            ? 'bg-[#965B32] text-white border-[#C88A58]'
                            : 'bg-[#2A2421] border-[#3E352F] text-[#C9C1B5]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#14110F] border-t border-[#2E2824] space-y-3">
              <div className="space-y-1.5 text-xs text-[#A89F91]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FDFBF7]">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-[#FDFBF7]">${cartTax.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Barista Tip</span>
                    <span className="text-[#C88A58]">+${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#FDFBF7] pt-2 border-t border-[#2E2824]">
                  <span>Total Amount</span>
                  <span className="font-serif text-base text-[#C88A58]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-gradient-to-r from-[#C88A58] to-[#965B32] hover:from-[#DB9C69] hover:to-[#A8693A] text-[#14110F] font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-lg shadow-[#965B32]/30 transition-all hover:scale-[1.01]"
              >
                <span>Checkout & Place Order</span>
                <div className="flex items-center gap-1 font-serif text-sm">
                  <span>${finalTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
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

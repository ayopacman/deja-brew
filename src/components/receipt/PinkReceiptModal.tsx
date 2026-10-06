'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Copy,
  Check,
  Heart,
  QrCode,
  Sparkles,
  Coffee
} from 'lucide-react';
import { Order } from '../../types/coffee';
import { playSoundEffect } from '../../utils/sound';

interface PinkReceiptModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const PinkReceiptModal: React.FC<PinkReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    playSoundEffect('click');
    window.print();
  };

  const handleCopyText = () => {
    const itemsList = order.items
      .map((i) => `• ${i.quantity}x ${i.menuItem.name} - ₹${i.itemTotal}`)
      .join('\n');

    const text = `🌸 DEJA BREW CAFE RECEIPT 🌸\n` +
      `Order: ${order.orderNumber}\n` +
      `Date: ${orderDate} ${orderTime}\n` +
      `Customer: ${order.customerName}\n` +
      `Service: ${order.orderType === 'dine-in' ? `Dine-In (${order.tableNumber})` : 'Takeaway'}\n` +
      `---------------------------\n` +
      `${itemsList}\n` +
      `---------------------------\n` +
      `Subtotal: ₹${order.subtotal}\n` +
      (order.discountAmount ? `Discount: -₹${order.discountAmount}\n` : '') +
      `GST (5%): ₹${order.tax}\n` +
      (order.tip ? `Barista Tip: +₹${order.tip}\n` : '') +
      `TOTAL PAID: ₹${order.total}\n` +
      `Payment: ${order.paymentMethod.toUpperCase()} (Paid)\n\n` +
      `Thank you for visiting Deja Brew! ☕✨`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    playSoundEffect('click');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#FFF9FB] border-2 border-[#F8BBD0] rounded-[32px] p-4 sm:p-6 shadow-2xl space-y-4 text-[#4A2828] max-h-[95vh] overflow-y-auto print:max-h-none print:border-none print:shadow-none print:p-0">
        
        {/* Modal Close & Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between print:hidden border-b border-[#F8D7DF] pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E84A74]">
            <Sparkles className="w-4 h-4" />
            <span>Deja Brew Digital Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-[#FFF0F3] border border-[#F8D7DF] text-[#7A6767] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PINK VINTAGE AESTHETIC RECEIPT CARD (Matching User Inspiration Photo) */}
        {/* ========================================================================= */}
        <div
          ref={receiptRef}
          className="relative bg-white border-2 border-[#F4A7B9] rounded-3xl p-5 sm:p-6 shadow-md text-center space-y-4 print:border-2 print:border-pink-300"
          style={{
            backgroundImage: 'radial-gradient(#FFF0F5 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        >
          {/* Top Left & Right Ribbon Flourishes with Sparkle Stars */}
          <div className="absolute top-2.5 left-3 text-[#E84A74] flex items-center gap-0.5 select-none pointer-events-none">
            <span className="text-base">🎀</span>
            <span className="text-[10px] text-[#FF8EA8]">✦</span>
          </div>
          <div className="absolute top-2.5 right-3 text-[#E84A74] flex items-center gap-0.5 select-none pointer-events-none">
            <span className="text-[10px] text-[#FF8EA8]">✦</span>
            <span className="text-base">🎀</span>
          </div>

          {/* Header Title: "Receipt" Cursive Calligraphy */}
          <div className="pt-2">
            <h1
              className="font-serif italic text-4xl sm:text-5xl text-[#E84A74] tracking-wide drop-shadow-xs"
              style={{
                fontFamily: 'Georgia, cursive, serif',
                textShadow: '0 2px 8px rgba(232, 74, 116, 0.2)'
              }}
            >
              Receipt
            </h1>
            <p className="font-serif uppercase tracking-widest text-[9px] font-black text-[#9E334D] mt-1">
              THANK YOU FOR YOUR PURCHASE!
            </p>
          </div>

          {/* Divider Line */}
          <div className="border-t-2 border-[#F8BBD0]" />

          {/* Order No & Date Sub-header */}
          <div className="flex items-center justify-between text-[11px] font-serif text-[#783547] px-1">
            <div>
              ORDER NO.: <b className="font-mono font-bold text-[#E84A74]">{order.orderNumber}</b>
            </div>
            <div>
              DATE: <b className="font-mono">{orderDate}</b>
            </div>
          </div>

          {/* Dotted Sub-divider */}
          <div className="border-t border-dotted border-[#F8BBD0]" />

          {/* Service & Customer Meta */}
          <div className="flex items-center justify-between text-[10px] bg-[#FFF5F7] px-3 py-1.5 rounded-xl border border-[#F8D7DF] text-[#7A6767]">
            <span>Guest: <b className="text-[#2D2020]">{order.customerName}</b></span>
            <span>
              {order.orderType === 'dine-in' ? (
                <b className="text-[#E84A74]">🪑 {order.tableNumber || 'Dine-In Table'}</b>
              ) : (
                <b className="text-sky-700">🥡 Counter Takeaway</b>
              )}
            </span>
          </div>

          {/* Table Header: ITEM | QTY | PRICE */}
          <div className="border-b border-[#F8BBD0] pb-1.5 pt-1">
            <div className="grid grid-cols-12 text-[10px] font-serif font-black uppercase text-[#9E334D] tracking-wider text-left">
              <div className="col-span-7">ITEM</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-3 text-right">PRICE</div>
            </div>
          </div>

          {/* Itemized Rows */}
          <div className="space-y-2 py-1 text-left">
            {order.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-xs items-start text-[#4A2828]">
                <div className="col-span-7 pr-1">
                  <div className="font-bold text-[11px] text-[#2D2020] leading-tight">
                    {item.menuItem.name}
                  </div>
                  <div className="text-[9px] text-[#8C7575] leading-tight">
                    {item.customization.temp}, {item.customization.milk} milk
                    {item.customization.notes && ` • ${item.customization.notes}`}
                  </div>
                </div>
                <div className="col-span-2 text-center font-mono font-bold text-[11px]">
                  {item.quantity}
                </div>
                <div className="col-span-3 text-right font-mono font-bold text-[11px] text-[#E84A74]">
                  ₹{item.itemTotal}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Taxes Breakdown */}
          <div className="border-t border-[#F8D7DF] pt-2 space-y-1 text-[10px] text-[#7A6767] text-left">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-[#2D2020]">₹{order.subtotal}</span>
            </div>
            {order.discountAmount && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({order.discountCode || 'PROMO'}):</span>
                <span className="font-mono">-₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (5%):</span>
              <span className="font-mono text-[#2D2020]">₹{order.tax}</span>
            </div>
            {order.tip ? (
              <div className="flex justify-between">
                <span>Barista Tip:</span>
                <span className="font-mono text-[#E84A74]">+₹{order.tip}</span>
              </div>
            ) : null}
          </div>

          {/* Total Line with Double Border (Inspo Feature) */}
          <div className="border-t-2 border-b-2 border-[#F4A7B9] py-2 flex items-center justify-between">
            <span
              className="font-serif italic text-2xl sm:text-3xl text-[#E84A74]"
              style={{ fontFamily: 'Georgia, cursive, serif' }}
            >
              Total:
            </span>
            <span className="font-mono font-black text-xl sm:text-2xl text-[#E84A74]">
              ₹{order.total}
            </span>
          </div>

          {/* Payment Method Selector Checkboxes with Hearts (Inspo Feature) */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-serif text-[#783547] pt-1">
            <span className={`flex items-center gap-1 ${order.paymentMethod === 'counter' ? 'font-bold text-[#E84A74]' : 'opacity-70'}`}>
              <span>{order.paymentMethod === 'counter' ? '♥' : '♡'}</span> CASH
            </span>
            <span className={`flex items-center gap-1 ${order.paymentMethod === 'card' ? 'font-bold text-[#E84A74]' : 'opacity-70'}`}>
              <span>{order.paymentMethod === 'card' ? '♥' : '♡'}</span> CARD
            </span>
            <span className={`flex items-center gap-1 ${order.paymentMethod === 'upi' || order.paymentMethod === 'google-pay' || order.paymentMethod === 'apple-pay' ? 'font-bold text-[#E84A74]' : 'opacity-70'}`}>
              <span>{order.paymentMethod !== 'counter' && order.paymentMethod !== 'card' ? '♥' : '♡'}</span> E-WALLET / UPI
            </span>
          </div>

          {/* Notification / Order Arrival Footer */}
          <div className="text-[8px] uppercase tracking-widest text-[#9E334D] font-black pt-1">
            FOR ORDER ARRIVAL, NOTIFY ME THROUGH: QR / LIVE TRACKER
          </div>

          {/* Barcode & QR Code Section (Inspo Feature) */}
          <div className="pt-2 flex items-center justify-between gap-3 bg-[#FFF9FB] p-2.5 rounded-2xl border border-[#F8D7DF]">
            <div className="p-1 bg-white rounded-lg border border-[#F8D7DF]">
              <QrCode className="w-12 h-12 text-[#2D2020]" />
            </div>

            {/* Pink Graphic Barcode */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-8 flex items-center justify-center gap-0.5 overflow-hidden">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 1, 5, 2, 4].map((h, idx) => (
                  <div
                    key={idx}
                    className="bg-[#E84A74] rounded-xs"
                    style={{
                      width: `${h > 3 ? 3 : 1.5}px`,
                      height: '100%'
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-[8px] tracking-widest text-[#7A6767] mt-0.5">
                DEJABREW-{order.orderNumber.replace('#', '')}-{order.createdAt.toString().slice(-4)}
              </span>
            </div>
          </div>

          {/* Bottom Right Ribbon Flourish (Inspo Feature) */}
          <div className="absolute bottom-2.5 right-3 text-[#E84A74] flex items-center gap-0.5 select-none pointer-events-none">
            <span className="text-base">🎀</span>
            <span className="text-[10px] text-[#FF8EA8]">✦</span>
          </div>

        </div>

        {/* Action Buttons Toolbar (Print, Download, Share) */}
        <div className="grid grid-cols-3 gap-2 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-102"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={handleCopyText}
            className="bg-white hover:bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] font-bold text-xs py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={() => {
              const text = `☕ Deja Brew Receipt for Order ${order.orderNumber}: Total ₹${order.total} (${order.items.length} items). View live at https://dejabrew.cafe/track?id=${order.id}`;
              if (navigator.share) {
                navigator.share({ title: 'Deja Brew Receipt', text });
              } else {
                handleCopyText();
              }
            }}
            className="bg-white hover:bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] font-bold text-xs py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

      </div>

    </div>
  );
};

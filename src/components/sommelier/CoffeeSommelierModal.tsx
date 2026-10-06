'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, Cake, Heart } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendation?: {
    title: string;
    actionHref?: string;
  };
}

interface CoffeeSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoffeeSommelierModal: React.FC<CoffeeSommelierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am your SweetCrumbs AI Cake & Coffee Sommelier. Ask me for cake pairing recommendations, flavor notes, allergy-safe options, or brewing tips!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What coffee pairs best with Chocolate Bliss Cake?',
    'Recommend a light fruit cake for a birthday',
    'How do I steam oat milk for rose lattes?',
    'Suggest a pairing for Fresh Strawberry Cake',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let recommendation: { title: string; actionHref?: string } | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('chocolate') || lower.includes('bliss')) {
        reply = "For our rich **Chocolate Bliss Cake**, we recommend pairing with our **Artisan Flat White** or a medium-dark Colombian espresso. The creamy micro-foam and toffee undertones cut through the 70% dark Belgian ganache beautifully!";
        recommendation = { title: 'Order Chocolate Bliss Cake', actionHref: '/order' };
      } else if (lower.includes('strawberry') || lower.includes('fruit') || lower.includes('birthday')) {
        reply = "Our **Fresh Strawberry Fruit Cake** pairs like a dream with our **Rose Petal & Vanilla Latte** or a floral **Panama Geisha Pour Over**! It has light chiffon sponge and Chantilly cream that won't overwhelm your palate.";
        recommendation = { title: 'View Fresh Strawberry Cake', actionHref: '/order' };
      } else if (lower.includes('oat') || lower.includes('rose') || lower.includes('latte')) {
        reply = "For our signature **Rose Petal Latte**, steam oat milk gently to 60°C maximum to preserve natural sweetness and silky micro-foam. Add 2 pumps of organic rose vanilla syrup for the perfect floral aroma!";
        recommendation = { title: 'Order Rose Petal Latte', actionHref: '/order' };
      } else {
        reply = "At SweetCrumbs, every cake and pastry is baked fresh daily with natural ingredients, paired with freshly roasted micro-lot coffees. Check out our tasting box or order ahead for zero-wait counter pickup!";
        recommendation = { title: 'Browse SweetCrumbs Menu', actionHref: '/order' };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        recommendation,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg h-[600px] bg-white border border-[#F8D7DF] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-[#2D2020]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#FFF0F3] border-b border-[#F8D7DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E84A74] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#2D2020] flex items-center gap-1.5">
                <span>SweetCrumbs AI Advisor</span>
              </h3>
              <p className="text-[10px] text-[#8C7575]">Cake pairings, recipes & brew advice</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FDE8ED] flex items-center justify-center text-[#5D4A4A] shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#FFF9F9]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-[#FFF0F3] border border-[#F8D7DF] flex items-center justify-center text-[#E84A74] shrink-0 mt-0.5">
                  <Cake className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#E84A74] text-white rounded-tr-none'
                    : 'bg-white border border-[#F8D7DF] text-[#2D2020] rounded-tl-none'
                }`}
              >
                {m.text}

                {m.recommendation && (
                  <div className="mt-3 pt-2.5 border-t border-[#F8D7DF]">
                    <a
                      href={m.recommendation.actionHref}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] font-bold text-[11px] px-3 py-1.5 rounded-lg border border-[#F8D7DF] transition-all"
                    >
                      <span>{m.recommendation.title}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#5D4A4A] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#8C7575] pl-9">
              <Sparkles className="w-3.5 h-3.5 text-[#E84A74] animate-spin" />
              <span>SweetCrumbs AI is crafting an answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompts */}
        <div className="px-4 py-2 bg-[#FFF0F3] border-t border-[#F8D7DF] flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-[#FDE8ED] border border-[#F8D7DF] text-[#5D4A4A] text-[10px] rounded-lg whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-[#F8D7DF] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cake pairings, flavors, or orders..."
            className="flex-1 bg-[#FFF9F9] border border-[#F8D7DF] text-[#2D2020] text-xs rounded-xl p-3 focus:outline-none focus:border-[#E84A74]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-[#E84A74] hover:bg-[#D43862] text-white flex items-center justify-center transition-colors disabled:opacity-40 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

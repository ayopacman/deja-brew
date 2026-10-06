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
      text: "Hello! I am your Deja Brew AI Coffee & Pairing Sommelier. Ask me for craft coffee recommendations, snack pairings, flavor notes, allergy-safe options, or brewing ratios!",
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
    'What snack pairs best with The Doppio?',
    'Recommend a floral pour-over coffee',
    'How do I steam oat milk for flat whites?',
    'Suggest a pairing for Salted Caramel Apple Galette',
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

      if (lower.includes('doppio') || lower.includes('espresso') || lower.includes('truffle')) {
        reply = "For our intense **Doppio Espresso**, we recommend pairing it with our handcrafted **Dark Chocolate Sea Salt Truffle**! The golden tiger-striped crema dissolves into 70% dark cocoa and crunchy sea salt for an exquisite contrast.";
        recommendation = { title: 'Order Doppio + Truffle Pairing', actionHref: '/order' };
      } else if (lower.includes('galette') || lower.includes('apple') || lower.includes('caramel')) {
        reply = "Our warm **Salted Caramel Apple Galette** pairs sublimely with our **Classic Affogato** or a rich **Cortado**! The hot espresso and cool vanilla bean gelato highlight the caramelized Honeycrisp apples.";
        recommendation = { title: 'Order Affogato & Galette', actionHref: '/order' };
      } else if (lower.includes('v60') || lower.includes('pour') || lower.includes('floral')) {
        reply = "Try our **Single-Origin V60 Pour-Over** paired with a slice of **Lemon Drizzle Pound Cake**! The delicate jasmine florals and peach sweetness of the Ethiopian Guji beans elevate the tart citrus glaze.";
        recommendation = { title: 'Order V60 Pour-Over', actionHref: '/order' };
      } else {
        reply = "At Deja Brew, every single-origin coffee is calibrated to perfection, paired with handcrafted artisanal bakery snacks. Check out our curated pairings or order ahead for zero-wait counter pickup!";
        recommendation = { title: 'Browse Deja Brew Menu', actionHref: '/order' };
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
                <span>Deja Brew AI Sommelier</span>
              </h3>
              <p className="text-[10px] text-[#8C7575]">Craft coffee pairings, tasting notes & recipes</p>
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
              <span>Deja Brew AI is crafting an answer...</span>
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

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, RefreshCw, Coffee, Flame } from 'lucide-react';
import { COFFEE_KNOWLEDGE_BASE, MENU_ITEMS } from '../../data/coffeeData';

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
      text: "Hello! I am your AI Coffee Sommelier. Whether you're troubleshooting a sour espresso shot, searching for a rare single-origin roast, or dialing in your V60 water ratio, ask me anything!",
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
    'Why does my espresso taste sour / salty?',
    'Recommend a floral, tea-like single origin',
    'Best water temperature and ratio for V60?',
    'How do I steam oat milk for silky latte art?',
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

    // AI answer synthesis based on query
    setTimeout(() => {
      let reply = '';
      let recommendation: { title: string; actionHref?: string } | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('sour') || lower.includes('bitter') || lower.includes('under-extracted') || lower.includes('extraction')) {
        reply = "Sourness indicates **under-extraction** (too much acid extracted before sweet lipids and sugars have time to dissolve).\n\n**To fix it:**\n1. **Grind Finer**: Slows flow rate and increases surface area.\n2. **Increase Brew Temp**: Boost water to 93°C–96°C to extract deeper caramelized notes.\n3. **Lengthen Yield Ratio**: If pulling 18g in, try extracting 38g–40g out instead of 32g.";
        recommendation = { title: 'Dial in with V60 Calculator', actionHref: '/brew-guides' };
      } else if (lower.includes('floral') || lower.includes('fruity') || lower.includes('ethiopia') || lower.includes('light')) {
        reply = "For an explosive floral & tea-like profile, I highly recommend our **Ethiopia Guji Highland Heirloom** or our **Panama Boquete Geisha**.\n\nExpect high sweetness with notes of jasmine flowers, ripe peach blossom, and sparkling Meyer lemon acidity.";
        recommendation = { title: 'View Ethiopia Guji Micro-lot', actionHref: '/order' };
      } else if (lower.includes('oat') || lower.includes('milk') || lower.includes('steam') || lower.includes('latte art')) {
        reply = "Oat milk has less natural fat than dairy, making it sensitive to heat denaturation.\n\n**Barista Pro-Tips:**\n1. Use barista-formulated oat milk (like *Minor Figures* or *Oatly Barista*).\n2. Aerate with gentle paper-tearing sounds only until lukewarm (35°C).\n3. Stop steaming at **60°C maximum**; going beyond 65°C causes proteins to break down and foam to separate.";
        recommendation = { title: 'Order Wild Lavender Oat Latte', actionHref: '/order' };
      } else if (lower.includes('ratio') || lower.includes('water') || lower.includes('v60') || lower.includes('recipe')) {
        reply = "For Hario V60 pour-overs, the golden balance is **1:16.6** (15g coffee to 250g water).\n\n• **Bloom**: 50g water, 45 seconds.\n• **Main Pours**: Concentric circles up to 150g, then 250g.\n• **Total Target Drawdown**: 3 minutes flat.";
        recommendation = { title: 'Open Interactive Brew Stopwatch', actionHref: '/brew-guides' };
      } else {
        reply = `Great question! At Click & Sip, we source directly from micro-lot farms and roast weekly to maintain peak aromatics. To find your ideal cup, check our Single-Origin Explorer tier or customize your morning brew with your choice of roast and plant-based milks.`;
        recommendation = { title: 'Explore Palate Quiz', actionHref: '/subscription' };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        recommendation,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg h-[620px] bg-[#181513] border border-[#3E352F] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-[#FDFBF7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#14110F] border-b border-[#2E2824] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C88A58] to-[#965B32] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#181513] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C88A58]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FDFBF7] flex items-center gap-1.5">
                <span>AI Coffee Sommelier</span>
                <span className="text-[9px] bg-[#C88A58] text-[#14110F] font-bold px-1.5 rounded">GEMINI</span>
              </h3>
              <p className="text-[10px] text-[#A89F91]">Origin notes, ratios & extraction expert</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#24201D] hover:bg-[#3E352F] flex items-center justify-center text-[#A89F91] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-[#2A2421] border border-[#3E352F] flex items-center justify-center text-[#C88A58] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#965B32] text-white rounded-tr-none'
                    : 'bg-[#211C19] border border-[#2E2824] text-[#E8E2D9] rounded-tl-none'
                }`}
              >
                {m.text}

                {m.recommendation && (
                  <div className="mt-3 pt-2.5 border-t border-[#3E352F]/60">
                    <a
                      href={m.recommendation.actionHref}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 bg-[#2A2421] hover:bg-[#C88A58] text-[#C88A58] hover:text-[#14110F] font-bold text-[11px] px-3 py-1.5 rounded-lg border border-[#3E352F] transition-all"
                    >
                      <span>{m.recommendation.title}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#3E352F] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#A89F91] pl-9">
              <Sparkles className="w-3.5 h-3.5 text-[#C88A58] animate-spin" />
              <span>Sommelier analyzing extraction notes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#14110F]/80 border-t border-[#2E2824] flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-[#211C19] hover:bg-[#2E2824] border border-[#2E2824] text-[#A89F91] hover:text-[#FDFBF7] text-[10px] rounded-lg whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#14110F] border-t border-[#2E2824] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about roast notes, sour extraction, grind sizes..."
            className="flex-1 bg-[#211C19] border border-[#2E2824] text-[#FDFBF7] text-xs rounded-xl p-3 focus:outline-none focus:border-[#C88A58]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-[#C88A58] hover:bg-[#B07342] text-[#14110F] flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

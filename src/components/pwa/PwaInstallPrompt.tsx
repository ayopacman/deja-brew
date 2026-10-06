'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Register Service Worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.debug('SW registration error:', err);
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after brief delay
      setTimeout(() => setShowPrompt(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install Click & Sip PWA on iOS/Safari: tap Share button and select "Add to Home Screen".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <div className="fixed bottom-18 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 bg-[#1C1917] border border-[#C88A58]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C88A58] to-[#965B32] p-2 flex items-center justify-center shrink-0">
          <Smartphone className="w-6 h-6 text-[#14110F]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#FDFBF7]">Install "Click & Sip" PWA</h4>
            <button
              onClick={() => {
                setShowPrompt(false);
                setIsDismissed(true);
              }}
              className="text-[#A89F91] hover:text-[#FDFBF7] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#A89F91] mt-1">
            Install on your home screen for instant ordering, live vibration pickup alerts, and offline access.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-[#C88A58] hover:bg-[#B07342] text-[#14110F] text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Home Screen</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-xs text-[#A89F91] hover:text-[#FDFBF7] px-2 py-2"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import './globals.css';
import { OrderProvider } from '../context/OrderContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { CartDrawer } from '../components/menu/CartDrawer';
import { CoffeeSommelierModal } from '../components/sommelier/CoffeeSommelierModal';
import { PwaInstallPrompt } from '../components/pwa/PwaInstallPrompt';
import { CafeRadioWidget } from '../components/audio/CafeRadioWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFF0F3" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>Deja Brew • Artisan Specialty Coffee & Bakery PWA</title>
      </head>
      <body className="bg-[#FFF9F9] text-[#2D2020] antialiased min-h-screen flex flex-col font-sans selection:bg-[#E84A74] selection:text-white">
        <ThemeProvider>
          <OrderProvider>
            <Navbar onOpenSommelier={() => setIsSommelierOpen(true)} />
            
            <main className="flex-1 pb-20 lg:pb-0">
              {children}
            </main>

            <MobileNav onOpenSommelier={() => setIsSommelierOpen(true)} />
            <CartDrawer />
            <CafeRadioWidget />
            <CoffeeSommelierModal
              isOpen={isSommelierOpen}
              onClose={() => setIsSommelierOpen(false)}
            />
            <PwaInstallPrompt />
          </OrderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

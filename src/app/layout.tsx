'use client';

import React, { useState } from 'react';
import './globals.css';
import { OrderProvider } from '../context/OrderContext';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { CartDrawer } from '../components/menu/CartDrawer';
import { CoffeeSommelierModal } from '../components/sommelier/CoffeeSommelierModal';
import { PwaInstallPrompt } from '../components/pwa/PwaInstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#14110F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>Click & Sip • Artisan Specialty Coffee PWA & Barista KDS</title>
      </head>
      <body className="bg-[#14110F] text-[#FDFBF7] antialiased min-h-screen flex flex-col font-sans selection:bg-[#C88A58] selection:text-[#14110F]">
        <OrderProvider>
          <Navbar onOpenSommelier={() => setIsSommelierOpen(true)} />
          
          <main className="flex-1 pb-20 md:pb-10">
            {children}
          </main>

          <MobileNav onOpenSommelier={() => setIsSommelierOpen(true)} />
          <CartDrawer />
          <CoffeeSommelierModal
            isOpen={isSommelierOpen}
            onClose={() => setIsSommelierOpen(false)}
          />
          <PwaInstallPrompt />
        </OrderProvider>
      </body>
    </html>
  );
}

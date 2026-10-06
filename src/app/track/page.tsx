'use client';

import React, { Suspense } from 'react';
import { OrderTracker } from '../../components/tracking/OrderTracker';
import { Loader2 } from 'lucide-react';

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-[#C88A58]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs text-[#A89F91] mt-3">Connecting to Barista Live Tracker...</p>
        </div>
      }
    >
      <OrderTracker />
    </Suspense>
  );
}

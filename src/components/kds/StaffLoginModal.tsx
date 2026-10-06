'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (pinToTest = pinInput) => {
    const cleanPin = pinToTest.trim().toUpperCase();
    if (cleanPin === '1237' || cleanPin === 'DEJABARISTA') {
      sessionStorage.setItem('dejabrew_staff_auth', 'true');
      playSoundEffect('success');
      onClose();
      router.push('/kds');
    } else {
      setPinError(true);
      playSoundEffect('click');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border-2 border-[#F8D7DF] rounded-3xl p-6 shadow-2xl space-y-5 text-center text-[#2D2020]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] border border-[#F8D7DF] text-[#8C7575] hover:text-[#E84A74] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] border border-[#F8D7DF] text-[#E84A74] flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E84A74] bg-[#FFF0F3] px-3 py-0.5 rounded-full border border-[#F8D7DF]">
            Secret Staff Gateway
          </span>
          <h3 className="font-serif font-black text-xl text-[#2D2020] pt-1">
            Barista & Staff Access
          </h3>
          <p className="text-xs text-[#7A6767]">
            Enter your 4-digit staff passkey PIN to enter the terminal.
          </p>
        </div>

        {/* PIN Inputs */}
        <div className="space-y-3">
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                type="password"
                maxLength={1}
                value={pinInput[idx] || ''}
                readOnly
                className="w-11 h-12 bg-[#FFF9F9] border-2 border-[#F8D7DF] rounded-xl text-center text-lg font-mono font-black text-[#E84A74] shadow-2xs focus:outline-none"
              />
            ))}
          </div>

          {pinError && (
            <p className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Incorrect Passkey PIN. Access Denied.
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-1.5 max-w-[220px] mx-auto pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === 'C') {
                    setPinInput('');
                    setPinError(false);
                  } else if (key === '✓') {
                    handleVerify();
                  } else if (pinInput.length < 4) {
                    const newPin = pinInput + key;
                    setPinInput(newPin);
                    if (newPin.length === 4) {
                      handleVerify(newPin);
                    }
                  }
                }}
                className="h-10 rounded-xl bg-[#FFF9F9] hover:bg-[#FFF0F3] border border-[#F8D7DF] text-xs font-black text-[#4A2828] transition-transform active:scale-90 shadow-2xs flex items-center justify-center"
              >
                {key}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            className="w-full mt-2 bg-[#E84A74] hover:bg-[#D43862] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Staff Terminal</span>
          </button>
        </div>

      </div>
    </div>
  );
};

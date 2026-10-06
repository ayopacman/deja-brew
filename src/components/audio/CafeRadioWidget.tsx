'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Coffee,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';

interface SoundscapeMode {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
}

const SOUNDSCAPES: SoundscapeMode[] = [
  { id: 'lofi', name: '🌸 Cherry Lo-Fi Beats', subtitle: 'Warm chillhop cafe chords', icon: 'Sparkles', color: '#E84A74' },
  { id: 'rain', name: '🌧️ Rain at Deja Brew', subtitle: 'Gentle raindrops & soft breeze', icon: 'CloudRain', color: '#4A90E2' },
  { id: 'cafe', name: '☕ Espresso Bar Ambience', subtitle: 'Espresso steam & counter murmur', icon: 'Coffee', color: '#8C5A3E' },
];

export const CafeRadioWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('lofi');
  const [volume, setVolume] = useState<number>(0.5);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);

  const startAmbientSynth = (trackId: string) => {
    stopAmbientSynth();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (trackId === 'rain') {
        // Rain White/Pink Noise Buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
      } else {
        // Cozy Lo-Fi Chords Synth Sequence
        const chords = [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [220.00, 261.63, 329.63, 392.00], // Am7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [196.00, 246.94, 293.66, 349.23], // G7
        ];

        let chordIndex = 0;

        const playChord = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const currentChord = chords[chordIndex % chords.length];
          chordIndex++;

          currentChord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();

            osc.type = trackId === 'lofi' ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            noteGain.gain.setValueAtTime(0.01, ctx.currentTime);
            noteGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.8);
            noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

            osc.connect(noteGain);
            noteGain.connect(masterGain);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 4.0);
          });
        };

        playChord();
        intervalRef.current = setInterval(playChord, 4000);
      }
    } catch (e) {
      console.warn('Web Audio error', e);
    }
  };

  const stopAmbientSynth = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      startAmbientSynth(selectedTrack);
      setIsPlaying(true);
      playSoundEffect('click');
    }
  };

  const handleChangeTrack = (trackId: string) => {
    setSelectedTrack(trackId);
    playSoundEffect('click');
    if (isPlaying) {
      startAmbientSynth(trackId);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol * 0.15, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40">
      
      {/* Floating Widget Container */}
      <div className="bg-white/95 backdrop-blur-md border border-[#F8D7DF] rounded-2xl shadow-xl p-3 text-[#2D2020] space-y-3 transition-all">
        
        {/* Minimized Pill Bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTogglePlay}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-[#E84A74] text-white shadow-md shadow-[#E84A74]/30 scale-105'
                : 'bg-[#FFF0F3] text-[#E84A74] hover:bg-[#FDE8ED]'
            }`}
            title={isPlaying ? 'Pause Ambient Cafe Radio' : 'Play Ambient Cafe Radio'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="text-left cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-xs text-[#2D2020]">
                Deja Brew Radio
              </span>
              {isPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <div className="text-[10px] text-[#8C7575] truncate max-w-[130px]">
              {isPlaying ? 'Playing Cozy Soundscape' : 'Tap to play ambient cafe'}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-[#8C7575] hover:text-[#2D2020] hover:bg-[#FFF0F3] transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Controls Drawer */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t border-[#F8D7DF] animate-in fade-in duration-150">
            
            {/* Track Selector Buttons */}
            <div className="space-y-1.5">
              {SOUNDSCAPES.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleChangeTrack(sc.id)}
                  className={`w-full p-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                    selectedTrack === sc.id
                      ? 'bg-[#FFF0F3] text-[#E84A74] border border-[#F8D7DF]'
                      : 'hover:bg-[#FFF9F9] text-[#7A6767]'
                  }`}
                >
                  <div className="truncate">
                    <div>{sc.name}</div>
                    <div className="text-[9px] font-normal text-[#8C7575]">{sc.subtitle}</div>
                  </div>
                  {selectedTrack === sc.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E84A74]" />
                  )}
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-1 px-1">
              <button
                onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.5)}
                className="text-[#8C7575] hover:text-[#2D2020]"
              >
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#E84A74] h-1 bg-[#F8D7DF] rounded-lg cursor-pointer"
              />
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

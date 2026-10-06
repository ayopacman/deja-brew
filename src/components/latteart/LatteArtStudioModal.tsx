'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Coffee,
  Paintbrush,
  RotateCcw,
  Check,
  CheckCircle2,
  Heart,
  Smile,
  Type,
  Palette
} from 'lucide-react';
import { playSoundEffect } from '../../utils/sound';

interface LatteArtStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyArt?: (designName: string) => void;
}

const PRESET_STENCILS = [
  { id: 'blossom', name: '🌸 Cherry Blossom', icon: '🌸', desc: 'Japanese sakura petals on silky microfoam' },
  { id: 'swan', name: '🦢 Barista Swan', icon: '🦢', desc: 'Double rosetta with curved swan neck' },
  { id: 'bear', name: '🐻 Kawaii Bear', icon: '🐻', desc: 'Cute foam bear with cocoa powder dusting' },
  { id: 'tulip', name: '🌷 6-Tier Tulip', icon: '🌷', desc: 'Competition-grade stacked tulip layers' },
  { id: 'heart', name: '💖 Triple Ripple Heart', icon: '💖', desc: 'Classic velvety ripple heart' },
  { id: 'custom-text', name: '✍️ Custom Initials / Name', icon: '✍️', desc: 'Barista chocolate calligraphy on foam' }
];

export const LatteArtStudioModal: React.FC<LatteArtStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyArt
}) => {
  const [selectedStencil, setSelectedStencil] = useState('blossom');
  const [customText, setCustomText] = useState('DEJA');
  const [activeColor, setActiveColor] = useState('#4A2828'); // Cocoa brown
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw latte cup background (golden espresso crema + white microfoam circle)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Outer Crema Halo
    const grad = ctx.createRadialGradient(140, 140, 30, 140, 140, 130);
    grad.addColorStop(0, '#FFF5F0'); // Silky white foam
    grad.addColorStop(0.7, '#EBD2BC'); // Creamy latte
    grad.addColorStop(1, '#965A38'); // Golden brown espresso crema
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(140, 140, 130, 0, Math.PI * 2);
    ctx.fill();

    // Subtle porcelain cup rim
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Render Preset if not free-draw
    if (selectedStencil === 'blossom') {
      ctx.fillStyle = '#E84A74';
      // Draw 5 petals
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const x = 140 + Math.cos(angle) * 45;
        const y = 140 + Math.sin(angle) * 45;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFD3DD';
      ctx.beginPath();
      ctx.arc(140, 140, 15, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedStencil === 'heart') {
      ctx.fillStyle = '#6E3A20';
      ctx.beginPath();
      ctx.moveTo(140, 170);
      ctx.bezierCurveTo(90, 120, 90, 80, 140, 105);
      ctx.bezierCurveTo(190, 80, 190, 120, 140, 170);
      ctx.fill();
    } else if (selectedStencil === 'custom-text') {
      ctx.font = 'bold 28px Georgia, cursive';
      ctx.fillStyle = '#4A2828';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(customText || 'DEJA', 140, 140);
    }
  }, [isOpen, selectedStencil, customText]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = activeColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    setSelectedStencil('none');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset back to plain microfoam
    const grad = ctx.createRadialGradient(140, 140, 30, 140, 140, 130);
    grad.addColorStop(0, '#FFF5F0');
    grad.addColorStop(0.7, '#EBD2BC');
    grad.addColorStop(1, '#965A38');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(140, 140, 130, 0, Math.PI * 2);
    ctx.fill();
    playSoundEffect('click');
  };

  const handleSaveDesign = () => {
    const activeName = PRESET_STENCILS.find((s) => s.id === selectedStencil)?.name || `Custom Latte Art (${customText})`;
    if (onApplyArt) {
      onApplyArt(activeName);
    }
    setAppliedSuccess(true);
    playSoundEffect('success');
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border-2 border-[#F8D7DF] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-[#2D2020] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FDE8ED] text-[#E84A74] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#F8D7DF] px-3.5 py-1 rounded-full text-[10px] font-bold text-[#E84A74]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Foam Studio</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D2020]">
            Custom Latte Art Designer
          </h2>
          <p className="text-xs text-[#7A6767]">
            Pick a signature stencil or draw your own foam art! Our baristas will craft it on top of your latte.
          </p>
        </div>

        {/* Interactive Main Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Canvas Preview */}
          <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3">
            <div className="relative p-3 bg-gradient-to-tr from-[#FFF0F3] to-[#FCE4EC] rounded-3xl border-2 border-[#F8BBD0] shadow-inner">
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="rounded-full shadow-lg cursor-crosshair bg-white touch-none"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-bold text-[#8C7575] border border-[#F8D7DF] shadow-xs">
                Touch / Click to sketch
              </div>
            </div>

            {/* Canvas Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="bg-white hover:bg-[#FFF9F9] border border-[#F8D7DF] text-[#7A6767] text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Foam</span>
              </button>

              <div className="flex items-center gap-1.5 bg-[#FFF0F3] p-1 rounded-xl border border-[#F8D7DF]">
                {['#4A2828', '#E84A74', '#9E334D', '#D97706'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      activeColor === color ? 'scale-110 border-white ring-2 ring-[#E84A74]' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Stencils & Text Options */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-[#2D2020] block mb-2">
                1. Select Signature Stencil
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_STENCILS.map((stencil) => (
                  <button
                    key={stencil.id}
                    onClick={() => {
                      setSelectedStencil(stencil.id);
                      playSoundEffect('click');
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2 ${
                      selectedStencil === stencil.id
                        ? 'bg-[#FFF0F3] border-[#E84A74] ring-2 ring-[#E84A74]/20 shadow-xs'
                        : 'bg-[#FFF9F9] border-[#F8D7DF] hover:bg-[#FFF0F3]'
                    }`}
                  >
                    <span className="text-lg">{stencil.icon}</span>
                    <div className="truncate">
                      <div className="font-bold text-[11px] text-[#2D2020] truncate">{stencil.name}</div>
                      <div className="text-[9px] text-[#8C7575] line-clamp-1">{stencil.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Inscription */}
            {selectedStencil === 'custom-text' && (
              <div className="bg-[#FFF0F3] p-3 rounded-2xl border border-[#F8D7DF] space-y-1.5 animate-in fade-in">
                <label className="text-[10px] font-bold text-[#E84A74] uppercase tracking-wider block">
                  Enter Initials or Short Name (Max 8 chars)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  placeholder="e.g. PRIYA / DEJA"
                  className="w-full bg-white border border-[#F8D7DF] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#2D2020] uppercase focus:outline-none focus:border-[#E84A74]"
                />
              </div>
            )}

            {/* Save Action */}
            <button
              onClick={handleSaveDesign}
              className="w-full bg-[#E84A74] hover:bg-[#D43862] text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#E84A74]/20 transition-all hover:scale-102"
            >
              {appliedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Latte Art Attached to Order! 🌸</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Attach Foam Art to My Cup</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

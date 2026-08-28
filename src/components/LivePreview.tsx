import React, { useState } from 'react';
import { ClampCalculation } from '../types';
import { getFontSizeAtWidth } from '../utils/clampCalculator';
import {
  Eye,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface LivePreviewProps {
  calculation: ClampCalculation;
  simulatedWidth: number;
  onSimulatedWidthChange: (width: number) => void;
}

type FontFamily = 'Plus Jakarta Sans' | 'Inter' | 'Instrument Serif' | 'Syne' | 'Fira Code';
type PreviewLayout = 'headline' | 'article' | 'card' | 'compare';

export const LivePreview: React.FC<LivePreviewProps> = ({
  calculation,
  simulatedWidth,
  onSimulatedWidthChange,
}) => {
  const [sampleText, setSampleText] = useState('Fluid Typography in Action');
  const [fontFamily, setFontFamily] = useState<FontFamily>('Plus Jakarta Sans');
  const [fontWeight, setFontWeight] = useState<number>(700);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [previewLayout, setPreviewLayout] = useState<PreviewLayout>('headline');

  const activeSize = getFontSizeAtWidth(simulatedWidth, calculation);

  const mobileSize = getFontSizeAtWidth(calculation.minViewport, calculation);
  const desktopSize = getFontSizeAtWidth(calculation.maxViewport, calculation);

  return (
    <div
      id="live-preview-card"
      className="bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-5"
    >
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#23262D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB] flex items-center gap-2">
              Viewport Simulator
              <span className="text-[10px] font-mono text-[#4FACFE] bg-[#1A1D24] px-2 py-0.5 rounded border border-[#23262D]">
                {simulatedWidth}px
              </span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              Real-time typographic rendering sandbox
            </p>
          </div>
        </div>

        {/* Live Font Size Badge */}
        <div
          id="preview-font-badge"
          className="flex items-center gap-2 bg-[#161920] border border-[#4FACFE]/40 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(79,172,254,0.15)] font-mono"
        >
          <Type className="w-3.5 h-3.5 text-[#4FACFE]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">Active:</span>
          <span className="text-sm font-bold text-[#00F2FE]">{activeSize.px}px</span>
          <span className="text-xs text-[#8E929D]">({activeSize.rem}rem)</span>
        </div>
      </div>

      {/* Viewport Scrubber Slider */}
      <div className="space-y-2.5 p-4 bg-[#161920] border border-[#23262D] rounded-xl">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8E929D] text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[#4FACFE]" />
            Simulate Viewport Width:
          </span>
          <span className="font-bold text-[#00F2FE] text-sm">
            {simulatedWidth}px
          </span>
        </div>

        <div className="relative py-1">
          <input
            id="viewport-slider"
            type="range"
            min="320"
            max="1920"
            step="5"
            value={simulatedWidth}
            onChange={(e) => onSimulatedWidthChange(Number(e.target.value))}
            className="w-full h-2 bg-[#23262D] rounded-lg appearance-none cursor-ew-resize accent-[#4FACFE]"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#50545E]">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-[#4FACFE]" /> 320px
          </span>
          <span className="flex items-center gap-1">
            <Tablet className="w-3 h-3 text-[#4FACFE]" /> 768px
          </span>
          <span className="flex items-center gap-1">
            <Laptop className="w-3 h-3 text-[#4FACFE]" /> 1024px
          </span>
          <span className="flex items-center gap-1">
            <Monitor className="w-3 h-3 text-[#4FACFE]" /> 1920px
          </span>
        </div>
      </div>

      {/* Typography Styling Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#161920] p-3 rounded-xl border border-[#23262D]">
        {/* Font Family Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[#8E929D] text-[10px] uppercase tracking-[0.2em] font-mono">Font:</span>
          <select
            id="font-family-select"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as FontFamily)}
            className="bg-[#0F1116] border border-[#23262D] rounded-lg px-3 py-1.5 text-xs text-[#E4E6EB] font-medium focus:outline-none focus:border-[#4FACFE]"
          >
            <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
            <option value="Inter">Inter (Sans)</option>
            <option value="Instrument Serif">Instrument Serif</option>
            <option value="Syne">Syne (Display)</option>
            <option value="Fira Code">Fira Code (Mono)</option>
          </select>
        </div>

        {/* Font Weight Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[#8E929D] text-[10px] uppercase tracking-[0.2em] font-mono mr-1">Weight:</span>
          {[400, 500, 600, 700, 800].map((w) => (
            <button
              key={`weight-${w}`}
              id={`weight-btn-${w}`}
              type="button"
              onClick={() => setFontWeight(w)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                fontWeight === w
                  ? 'bg-[#4FACFE] text-[#0A0B0E] font-bold shadow-[0_0_8px_rgba(79,172,254,0.3)]'
                  : 'bg-[#0F1116] text-[#8E929D] hover:text-[#E4E6EB] border border-[#23262D]'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Alignment Buttons */}
        <div className="flex items-center gap-1 bg-[#0F1116] p-1 rounded-lg border border-[#23262D]">
          <button
            id="align-left-btn"
            type="button"
            onClick={() => setTextAlign('left')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'left' ? 'bg-[#1A1D24] text-[#00F2FE]' : 'text-[#50545E] hover:text-[#E4E6EB]'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            id="align-center-btn"
            type="button"
            onClick={() => setTextAlign('center')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'center' ? 'bg-[#1A1D24] text-[#00F2FE]' : 'text-[#50545E] hover:text-[#E4E6EB]'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            id="align-right-btn"
            type="button"
            onClick={() => setTextAlign('right')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'right' ? 'bg-[#1A1D24] text-[#00F2FE]' : 'text-[#50545E] hover:text-[#E4E6EB]'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Layout Modes */}
        <div className="flex items-center gap-1 bg-[#0F1116] p-1 rounded-lg border border-[#23262D]">
          <button
            id="layout-headline-btn"
            type="button"
            onClick={() => setPreviewLayout('headline')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              previewLayout === 'headline'
                ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40'
                : 'text-[#8E929D] hover:text-[#E4E6EB]'
            }`}
          >
            Headline
          </button>
          <button
            id="layout-article-btn"
            type="button"
            onClick={() => setPreviewLayout('article')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              previewLayout === 'article'
                ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40'
                : 'text-[#8E929D] hover:text-[#E4E6EB]'
            }`}
          >
            Article
          </button>
          <button
            id="layout-card-btn"
            type="button"
            onClick={() => setPreviewLayout('card')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              previewLayout === 'card'
                ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40'
                : 'text-[#8E929D] hover:text-[#E4E6EB]'
            }`}
          >
            Card
          </button>
          <button
            id="layout-compare-btn"
            type="button"
            onClick={() => setPreviewLayout('compare')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              previewLayout === 'compare'
                ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40'
                : 'text-[#8E929D] hover:text-[#E4E6EB]'
            }`}
          >
            Min vs Max
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div
        id="preview-canvas-container"
        className="rounded-xl bg-[#161920] border border-[#23262D] p-6 min-h-[220px] flex flex-col justify-center relative overflow-hidden transition-all duration-150 shadow-inner"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#4FACFE 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {previewLayout === 'headline' && (
          <div className="relative z-10 space-y-3">
            <input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="w-full bg-transparent border-b border-dashed border-[#23262D] focus:border-[#4FACFE] focus:outline-none text-[#E4E6EB] placeholder-[#50545E] leading-tight transition-all"
              style={{
                fontSize: `${activeSize.px}px`,
                fontFamily: `"${fontFamily}", sans-serif`,
                fontWeight: fontWeight,
                textAlign: textAlign,
              }}
              placeholder="Type your headline here..."
            />
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#50545E] font-mono text-right">
              Click text above to edit sample in-place
            </p>
          </div>
        )}

        {previewLayout === 'article' && (
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h1
              className="text-[#E4E6EB] leading-tight tracking-tight transition-all"
              style={{
                fontSize: `${activeSize.px}px`,
                fontFamily: `"${fontFamily}", sans-serif`,
                fontWeight: fontWeight,
                textAlign: textAlign,
              }}
            >
              {sampleText}
            </h1>
            <p className="text-sm sm:text-base text-[#8E929D] leading-relaxed">
              Fluid typography continuously scales proportional to viewport dimensions. This eliminates disruptive breakpoint shifts while preserving optimal typographic hierarchy and optical balance.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[10px] uppercase tracking-[0.2em] text-[#50545E] font-mono">
              <span>Author: Clamp.Engine</span>
              <span>•</span>
              <span>Spec W3C Fluid</span>
            </div>
          </div>
        )}

        {previewLayout === 'card' && (
          <div className="relative z-10 max-w-md mx-auto rounded-xl bg-[#0F1116] border border-[#23262D] p-6 shadow-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1D24] text-[#4FACFE] text-[10px] uppercase tracking-widest font-mono border border-[#23262D]">
              <Sparkles className="w-3 h-3" />
              <span>Feature Node</span>
            </div>
            <h3
              className="text-[#E4E6EB] leading-snug tracking-tight transition-all"
              style={{
                fontSize: `${activeSize.px}px`,
                fontFamily: `"${fontFamily}", sans-serif`,
                fontWeight: fontWeight,
                textAlign: textAlign,
              }}
            >
              {sampleText}
            </h3>
            <p className="text-xs text-[#8E929D] leading-relaxed">
              Real-time fluid clamp scaling preview rendered within isolated container.
            </p>
            <button
              type="button"
              className="w-full mt-2 py-2.5 rounded-lg bg-[#4FACFE] hover:bg-[#00F2FE] text-[#0A0B0E] text-xs font-mono font-bold shadow-[0_0_15px_rgba(79,172,254,0.3)] transition-colors cursor-pointer"
            >
              TRIGGER ACTION
            </button>
          </div>
        )}

        {previewLayout === 'compare' && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Min Viewport Snapshot */}
            <div className="p-5 rounded-xl bg-[#0F1116] border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-medium">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Mobile ({calculation.minViewport}px)
                </span>
                <span className="font-bold bg-[#161920] px-2.5 py-1 rounded border border-amber-500/20">
                  {mobileSize.px}px ({mobileSize.rem}rem)
                </span>
              </div>
              <p
                className="text-[#E4E6EB] leading-snug line-clamp-2"
                style={{
                  fontSize: `${mobileSize.px}px`,
                  fontFamily: `"${fontFamily}", sans-serif`,
                  fontWeight: fontWeight,
                }}
              >
                {sampleText}
              </p>
            </div>

            {/* Max Viewport Snapshot */}
            <div className="p-5 rounded-xl bg-[#0F1116] border border-[#4FACFE]/40 space-y-2 shadow-[0_0_15px_rgba(79,172,254,0.1)]">
              <div className="flex items-center justify-between text-xs text-[#4FACFE] font-mono font-medium">
                <span className="flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" /> Desktop ({calculation.maxViewport}px)
                </span>
                <span className="font-bold bg-[#161920] px-2.5 py-1 rounded border border-[#4FACFE]/20 text-[#00F2FE]">
                  {desktopSize.px}px ({desktopSize.rem}rem)
                </span>
              </div>
              <p
                className="text-[#E4E6EB] leading-snug line-clamp-2"
                style={{
                  fontSize: `${desktopSize.px}px`,
                  fontFamily: `"${fontFamily}", sans-serif`,
                  fontWeight: fontWeight,
                }}
              >
                {sampleText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

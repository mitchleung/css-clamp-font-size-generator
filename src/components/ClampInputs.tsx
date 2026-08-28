import React from 'react';
import { ClampConfig, UnitType } from '../types';
import { Sliders, Sparkles, Smartphone, Monitor, Info, RotateCcw } from 'lucide-react';

interface ClampInputsProps {
  config: ClampConfig;
  onChange: (config: ClampConfig) => void;
  onReset: () => void;
}

export const ClampInputs: React.FC<ClampInputsProps> = ({ config, onChange, onReset }) => {
  const updateField = <K extends keyof ClampConfig>(field: K, value: ClampConfig[K]) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleUnitToggle = (newUnit: UnitType) => {
    updateField('unit', newUnit);
  };

  return (
    <div
      id="clamp-inputs-container"
      className="bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-6"
    >
      {/* Header with Mode switcher & Units */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#23262D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB]">
              Configuration Matrix
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              Boundary Parameters
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Unit Switcher */}
          <div className="flex items-center bg-[#161920] p-1 rounded-lg border border-[#23262D] text-xs font-mono">
            <button
              id="unit-rem-btn"
              type="button"
              onClick={() => handleUnitToggle('rem')}
              className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                config.unit === 'rem'
                  ? 'bg-[#4FACFE] text-[#0A0B0E] shadow-[0_0_10px_rgba(79,172,254,0.3)]'
                  : 'text-[#8E929D] hover:text-[#E4E6EB]'
              }`}
            >
              REM
            </button>
            <button
              id="unit-px-btn"
              type="button"
              onClick={() => handleUnitToggle('px')}
              className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                config.unit === 'px'
                  ? 'bg-[#4FACFE] text-[#0A0B0E] shadow-[0_0_10px_rgba(79,172,254,0.3)]'
                  : 'text-[#8E929D] hover:text-[#E4E6EB]'
              }`}
            >
              PX
            </button>
          </div>

          {/* Reset button */}
          <button
            id="reset-params-btn"
            type="button"
            onClick={onReset}
            title="Reset parameters"
            className="p-2 rounded-lg bg-[#161920] hover:bg-[#1A1D24] text-[#8E929D] hover:text-[#00F2FE] border border-[#23262D] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#161920] rounded-xl border border-[#23262D] text-xs">
        <button
          id="mode-fluid-tab"
          type="button"
          onClick={() => updateField('mode', 'fluid')}
          className={`flex-1 py-2 rounded-lg font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            config.mode === 'fluid'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4FACFE]" />
          <span>Fluid Engine Mode</span>
        </button>
        <button
          id="mode-direct-tab"
          type="button"
          onClick={() => updateField('mode', 'direct')}
          className={`flex-1 py-2 rounded-lg font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            config.mode === 'direct'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <span>Direct Expression</span>
        </button>
      </div>

      {config.mode === 'fluid' ? (
        <div className="space-y-5">
          {/* Font Sizes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Min Font Size */}
            <div className="p-4 rounded-xl bg-[#161920] border border-[#23262D] space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="min-font-size-input" className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono block">
                  Minimum Value
                </label>
                <div className="text-[11px] font-mono text-[#4FACFE]">
                  {config.unit === 'rem'
                    ? `${(config.minFontSize / config.rootFontSize).toFixed(3)}rem`
                    : `${config.minFontSize}px`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="min-font-size-input"
                    type="number"
                    min="1"
                    max="200"
                    step="1"
                    value={config.minFontSize}
                    onChange={(e) => updateField('minFontSize', Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-4 py-2.5 font-mono text-base font-bold text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                  />
                  <span className="absolute right-4 top-2.5 text-xs text-[#50545E] font-mono">px</span>
                </div>
                <div className="flex gap-1">
                  <button
                    id="min-font-dec"
                    type="button"
                    onClick={() => updateField('minFontSize', Math.max(1, config.minFontSize - 1))}
                    className="w-8 h-10 rounded-lg bg-[#0F1116] hover:bg-[#1A1D24] text-[#E4E6EB] font-mono font-bold border border-[#23262D] cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    id="min-font-inc"
                    type="button"
                    onClick={() => updateField('minFontSize', config.minFontSize + 1)}
                    className="w-8 h-10 rounded-lg bg-[#0F1116] hover:bg-[#1A1D24] text-[#E4E6EB] font-mono font-bold border border-[#23262D] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                id="min-font-slider"
                type="range"
                min="8"
                max="120"
                value={config.minFontSize}
                onChange={(e) => updateField('minFontSize', Number(e.target.value))}
                className="w-full h-1.5 bg-[#23262D] rounded-lg appearance-none cursor-pointer accent-[#4FACFE]"
              />
            </div>

            {/* Max Font Size */}
            <div className="p-4 rounded-xl bg-[#161920] border border-[#23262D] space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="max-font-size-input" className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono block">
                  Maximum Value
                </label>
                <div className="text-[11px] font-mono text-[#4FACFE]">
                  {config.unit === 'rem'
                    ? `${(config.maxFontSize / config.rootFontSize).toFixed(3)}rem`
                    : `${config.maxFontSize}px`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="max-font-size-input"
                    type="number"
                    min={config.minFontSize}
                    max="300"
                    step="1"
                    value={config.maxFontSize}
                    onChange={(e) => updateField('maxFontSize', Math.max(config.minFontSize, parseFloat(e.target.value) || config.minFontSize))}
                    className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-4 py-2.5 font-mono text-base font-bold text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                  />
                  <span className="absolute right-4 top-2.5 text-xs text-[#50545E] font-mono">px</span>
                </div>
                <div className="flex gap-1">
                  <button
                    id="max-font-dec"
                    type="button"
                    onClick={() => updateField('maxFontSize', Math.max(config.minFontSize, config.maxFontSize - 1))}
                    className="w-8 h-10 rounded-lg bg-[#0F1116] hover:bg-[#1A1D24] text-[#E4E6EB] font-mono font-bold border border-[#23262D] cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    id="max-font-inc"
                    type="button"
                    onClick={() => updateField('maxFontSize', config.maxFontSize + 1)}
                    className="w-8 h-10 rounded-lg bg-[#0F1116] hover:bg-[#1A1D24] text-[#E4E6EB] font-mono font-bold border border-[#23262D] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                id="max-font-slider"
                type="range"
                min="12"
                max="180"
                value={config.maxFontSize}
                onChange={(e) => updateField('maxFontSize', Number(e.target.value))}
                className="w-full h-1.5 bg-[#23262D] rounded-lg appearance-none cursor-pointer accent-[#4FACFE]"
              />
            </div>
          </div>

          {/* Viewport Range Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Min Viewport Width */}
            <div className="p-4 rounded-xl bg-[#161920] border border-[#23262D] space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="min-viewport-input" className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#4FACFE]" />
                  Min Viewport
                </label>
                <span className="text-[10px] font-mono text-[#50545E]">Mobile</span>
              </div>

              <div className="relative">
                <input
                  id="min-viewport-input"
                  type="number"
                  min="200"
                  max="1200"
                  step="5"
                  value={config.minViewport}
                  onChange={(e) => updateField('minViewport', Math.max(100, parseFloat(e.target.value) || 320))}
                  className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-4 py-2.5 font-mono text-base font-bold text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                />
                <span className="absolute right-4 top-2.5 text-xs text-[#50545E] font-mono">px</span>
              </div>

              {/* Quick Preset Buttons for Min Viewport */}
              <div className="flex items-center gap-1.5 pt-1">
                {[320, 375, 480, 640].map((vw) => (
                  <button
                    key={`min-vw-${vw}`}
                    id={`min-vw-preset-${vw}`}
                    type="button"
                    onClick={() => updateField('minViewport', vw)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      config.minViewport === vw
                        ? 'bg-[#1A1D24] text-[#00F2FE] border border-[#4FACFE] font-bold shadow-[0_0_8px_rgba(79,172,254,0.2)]'
                        : 'bg-[#0F1116] text-[#8E929D] hover:text-[#E4E6EB] border border-[#23262D]'
                    }`}
                  >
                    {vw}px
                  </button>
                ))}
              </div>
            </div>

            {/* Max Viewport Width */}
            <div className="p-4 rounded-xl bg-[#161920] border border-[#23262D] space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="max-viewport-input" className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-[#4FACFE]" />
                  Max Viewport
                </label>
                <span className="text-[10px] font-mono text-[#50545E]">Desktop</span>
              </div>

              <div className="relative">
                <input
                  id="max-viewport-input"
                  type="number"
                  min={config.minViewport + 10}
                  max="3840"
                  step="10"
                  value={config.maxViewport}
                  onChange={(e) => updateField('maxViewport', Math.max(config.minViewport + 10, parseFloat(e.target.value) || 1280))}
                  className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-4 py-2.5 font-mono text-base font-bold text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                />
                <span className="absolute right-4 top-2.5 text-xs text-[#50545E] font-mono">px</span>
              </div>

              {/* Quick Preset Buttons for Max Viewport */}
              <div className="flex items-center gap-1.5 pt-1">
                {[1024, 1280, 1440, 1920].map((vw) => (
                  <button
                    key={`max-vw-${vw}`}
                    id={`max-vw-preset-${vw}`}
                    type="button"
                    onClick={() => updateField('maxViewport', vw)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      config.maxViewport === vw
                        ? 'bg-[#1A1D24] text-[#00F2FE] border border-[#4FACFE] font-bold shadow-[0_0_8px_rgba(79,172,254,0.2)]'
                        : 'bg-[#0F1116] text-[#8E929D] hover:text-[#E4E6EB] border border-[#23262D]'
                    }`}
                  >
                    {vw}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Root Font Size & Precision options */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-[#161920] border border-[#23262D] text-xs font-mono">
            <div className="flex items-center gap-2">
              <label htmlFor="root-font-size-input" className="text-[#8E929D] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#4FACFE]" />
                <span className="text-[10px] uppercase tracking-[0.2em]">Base REM:</span>
              </label>
              <div className="relative w-20">
                <input
                  id="root-font-size-input"
                  type="number"
                  min="8"
                  max="32"
                  value={config.rootFontSize}
                  onChange={(e) => updateField('rootFontSize', Math.max(4, parseFloat(e.target.value) || 16))}
                  className="w-full bg-[#0F1116] border border-[#23262D] rounded px-2 py-1 text-xs font-mono font-bold text-[#00F2FE] text-center focus:outline-none focus:border-[#4FACFE]"
                />
                <span className="absolute right-2 top-1 text-[10px] text-[#50545E]">px</span>
              </div>
              <span className="text-[10px] text-[#50545E]">(1rem = {config.rootFontSize}px)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">Precision:</span>
              <div className="flex items-center gap-1">
                {[2, 3, 4, 5].map((dec) => (
                  <button
                    key={`dec-${dec}`}
                    id={`precision-btn-${dec}`}
                    type="button"
                    onClick={() => updateField('precision', dec)}
                    className={`w-7 h-7 rounded text-[11px] font-mono flex items-center justify-center transition-all cursor-pointer ${
                      config.precision === dec
                        ? 'bg-[#4FACFE] text-[#0A0B0E] font-bold shadow-[0_0_8px_rgba(79,172,254,0.3)]'
                        : 'bg-[#0F1116] text-[#8E929D] hover:text-[#E4E6EB] border border-[#23262D]'
                    }`}
                  >
                    {dec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Expression Mode */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#161920] border border-[#23262D] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label htmlFor="direct-min-input" className="block text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono mb-1.5">
                  Min Value
                </label>
                <input
                  id="direct-min-input"
                  type="text"
                  value={config.directMin}
                  onChange={(e) => updateField('directMin', e.target.value)}
                  placeholder="1rem or 16px"
                  className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-3 py-2 text-sm font-mono text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                />
              </div>

              <div>
                <label htmlFor="direct-pref-input" className="block text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono mb-1.5">
                  Preferred Formula
                </label>
                <input
                  id="direct-pref-input"
                  type="text"
                  value={config.directPreferred}
                  onChange={(e) => updateField('directPreferred', e.target.value)}
                  placeholder="0.8rem + 2vw"
                  className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-3 py-2 text-sm font-mono text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                />
              </div>

              <div>
                <label htmlFor="direct-max-input" className="block text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono mb-1.5">
                  Max Value
                </label>
                <input
                  id="direct-max-input"
                  type="text"
                  value={config.directMax}
                  onChange={(e) => updateField('directMax', e.target.value)}
                  placeholder="2.5rem or 40px"
                  className="w-full bg-[#0F1116] border border-[#23262D] rounded-lg px-3 py-2 text-sm font-mono text-[#00F2FE] focus:outline-none focus:border-[#4FACFE]"
                />
              </div>
            </div>
            <p className="text-[10px] text-[#50545E] font-mono">
              Direct syntax specification: <code className="text-[#00F2FE]">clamp(min, preferred, max)</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

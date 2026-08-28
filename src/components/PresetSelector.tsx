import React from 'react';
import { TypePreset, ClampConfig } from '../types';
import { PRESET_LIST } from '../utils/clampCalculator';
import { Bookmark, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  currentConfig: ClampConfig;
  onApplyPreset: (preset: TypePreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentConfig,
  onApplyPreset,
}) => {
  return (
    <div
      id="preset-selector-card"
      className="bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB] flex items-center gap-2">
              Typographic Archetypes
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              Select preset to load bounding thresholds
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#50545E] hidden sm:inline">
          {PRESET_LIST.length} Presets Configured
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
        {PRESET_LIST.map((preset) => {
          const isSelected =
            currentConfig.minFontSize === preset.minFontSizePx &&
            currentConfig.maxFontSize === preset.maxFontSizePx &&
            currentConfig.minViewport === preset.minViewportPx &&
            currentConfig.maxViewport === preset.maxViewportPx;

          return (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all relative group flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1D24] border-[#4FACFE] text-white shadow-[0_0_15px_rgba(79,172,254,0.25)]'
                  : 'bg-[#161920] border-[#23262D] text-[#8E929D] hover:bg-[#1A1D24] hover:border-[#4FACFE]/50 hover:text-[#E4E6EB]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#4FACFE]">
                    {preset.tag}
                  </span>
                  {isSelected && <Sparkles className="w-3 h-3 text-[#00F2FE]" />}
                </div>
                <div className="text-xs font-semibold text-[#E4E6EB] line-clamp-1">
                  {preset.name}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#23262D] flex items-baseline justify-between font-mono text-[10px] text-[#50545E]">
                <span>{preset.minFontSizePx}px</span>
                <span className="text-[#4FACFE]">→</span>
                <span className="text-[#00F2FE] font-bold">{preset.maxFontSizePx}px</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

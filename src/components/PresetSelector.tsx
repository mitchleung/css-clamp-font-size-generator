import React, { useState } from 'react';
import { TypePreset, ClampConfig } from '../types';
import { PRESET_LIST, generateAllTypographyCss } from '../utils/clampCalculator';
import { copyToClipboard } from '../utils/clipboard';
import { Bookmark, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

interface PresetSelectorProps {
  currentConfig: ClampConfig;
  presets: TypePreset[];
  selectedPresetId: string | null;
  onApplyPreset: (preset: TypePreset) => void;
  onResetPresets?: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentConfig,
  presets,
  selectedPresetId,
  onApplyPreset,
  onResetPresets,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [scaleFormat, setScaleFormat] = useState<'css-rules' | 'css-variables' | 'tailwind-config'>('css-rules');

  const handleCopyAll = async (format: 'css-rules' | 'css-variables' | 'tailwind-config' = scaleFormat) => {
    const fullCss = generateAllTypographyCss(currentConfig, format, presets);
    const success = await copyToClipboard(fullCss);
    if (success || true) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2400);
    }
  };

  const hasAnyCustomizations = presets.some((preset) => {
    const defaultPreset = PRESET_LIST.find((p) => p.id === preset.id);
    return (
      defaultPreset &&
      (preset.minFontSizePx !== defaultPreset.minFontSizePx ||
        preset.maxFontSizePx !== defaultPreset.maxFontSizePx)
    );
  });

  return (
    <div
      id="preset-selector-card"
      className="bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB]">
                Typographic Archetypes
              </h2>
              {hasAnyCustomizations && onResetPresets && (
                <button
                  id="reset-presets-btn"
                  type="button"
                  onClick={onResetPresets}
                  className="flex items-center gap-1 text-[10px] font-mono text-[#8E929D] hover:text-[#4FACFE] bg-[#161920] px-2 py-0.5 rounded border border-[#23262D] hover:border-[#4FACFE]/50 transition-all cursor-pointer"
                  title="Reset all archetype font sizes to default scale"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Archetypes</span>
                </button>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              Adjusting min/max values sticks to the selected archetype
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Format Selector for Full Typography Scale */}
          <div className="flex items-center bg-[#161920] p-1 rounded-lg border border-[#23262D] text-[10px] font-mono">
            <button
              id="scale-fmt-css"
              type="button"
              onClick={() => {
                setScaleFormat('css-rules');
                handleCopyAll('css-rules');
              }}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                scaleFormat === 'css-rules'
                  ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/30'
                  : 'text-[#8E929D] hover:text-[#E4E6EB]'
              }`}
              title="Copy CSS rules for h1-h6, body, lead, meta"
            >
              CSS
            </button>
            <button
              id="scale-fmt-vars"
              type="button"
              onClick={() => {
                setScaleFormat('css-variables');
                handleCopyAll('css-variables');
              }}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                scaleFormat === 'css-variables'
                  ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/30'
                  : 'text-[#8E929D] hover:text-[#E4E6EB]'
              }`}
              title="Copy CSS variables for :root"
            >
              :root Vars
            </button>
            <button
              id="scale-fmt-tw"
              type="button"
              onClick={() => {
                setScaleFormat('tailwind-config');
                handleCopyAll('tailwind-config');
              }}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                scaleFormat === 'tailwind-config'
                  ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/30'
                  : 'text-[#8E929D] hover:text-[#E4E6EB]'
              }`}
              title="Copy Tailwind theme config"
            >
              Tailwind
            </button>
          </div>

          {/* Primary "Copy ALL Typo CSS" Button */}
          <button
            id="copy-all-typo-btn"
            type="button"
            onClick={() => handleCopyAll()}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer ${
              copiedAll
                ? 'bg-[#00F2FE] text-[#0A0B0E] shadow-[0_0_20px_rgba(0,242,254,0.6)]'
                : 'bg-[#161920] hover:bg-[#1A1D24] text-[#4FACFE] hover:text-[#00F2FE] border border-[#4FACFE]/40 hover:border-[#00F2FE]'
            }`}
            title="Copies complete fluid typography scale CSS for all 10 archetypes including your customized min/max values"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] text-[#0A0B0E]" />
                <span className="text-[#0A0B0E]">COPIED ALL TYPO CSS!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY ALL TYPO CSS</span>
              </>
            )}
          </button>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4FACFE] bg-[#161920] border border-[#23262D] px-2.5 py-1 rounded-lg hidden xl:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
            Global: {currentConfig.minViewport}px → {currentConfig.maxViewport}px
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
        {presets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const defaultPreset = PRESET_LIST.find((p) => p.id === preset.id);
          const isCustomized =
            defaultPreset &&
            (preset.minFontSizePx !== defaultPreset.minFontSizePx ||
              preset.maxFontSizePx !== defaultPreset.maxFontSizePx);

          return (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all relative group flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1D24] border-[#4FACFE] text-white shadow-[0_0_15px_rgba(79,172,254,0.25)] ring-1 ring-[#4FACFE]/60'
                  : 'bg-[#161920] border-[#23262D] text-[#8E929D] hover:bg-[#1A1D24] hover:border-[#4FACFE]/50 hover:text-[#E4E6EB]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#4FACFE] flex items-center gap-1">
                    {preset.tag}
                    {isCustomized && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_6px_#00F2FE]"
                        title="Customized value"
                      />
                    )}
                  </span>
                  {isSelected && <Sparkles className="w-3 h-3 text-[#00F2FE]" />}
                </div>
                <div className="text-xs font-semibold text-[#E4E6EB] line-clamp-1 flex items-center justify-between">
                  <span>{preset.name}</span>
                  {isCustomized && (
                    <span className="text-[9px] font-mono text-[#00F2FE] uppercase tracking-wider bg-[#0F1116] px-1 rounded border border-[#23262D]">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#23262D] flex items-baseline justify-between font-mono text-[10px]">
                <span className={isSelected ? 'text-[#E4E6EB]' : 'text-[#8E929D]'}>
                  {preset.minFontSizePx}px
                </span>
                <span className="text-[#4FACFE]">→</span>
                <span className={isSelected ? 'text-[#00F2FE] font-bold' : 'text-[#E4E6EB] font-bold'}>
                  {preset.maxFontSizePx}px
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

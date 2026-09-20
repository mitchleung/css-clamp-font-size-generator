import React, { useState, useMemo } from 'react';
import { ClampConfig, TypePreset } from './types';
import { calculateClamp, generateAllTypographyCss, PRESET_LIST } from './utils/clampCalculator';
import { copyToClipboard } from './utils/clipboard';
import { ClampInputs } from './components/ClampInputs';
import { ClampGraph } from './components/ClampGraph';
import { CodeOutput } from './components/CodeOutput';
import { LivePreview } from './components/LivePreview';
import { PresetSelector } from './components/PresetSelector';
import { BreakpointsTable } from './components/BreakpointsTable';
import {
  BookOpen,
  Check,
  Copy,
  Sparkles,
  Layers
} from 'lucide-react';

const DEFAULT_CONFIG: ClampConfig = {
  minFontSize: 18,
  maxFontSize: 28,
  minViewport: 375,
  maxViewport: 1280,
  rootFontSize: 16,
  unit: 'rem',
  precision: 4,
  mode: 'fluid',
  directMin: '1.125rem',
  directPreferred: '0.75rem + 1.5978vw',
  directMax: '1.75rem',
};

export default function App() {
  const [config, setConfig] = useState<ClampConfig>(DEFAULT_CONFIG);
  const [presets, setPresets] = useState<TypePreset[]>(PRESET_LIST);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('heading-4');
  const [simulatedWidth, setSimulatedWidth] = useState<number>(768);
  const [copiedQuick, setCopiedQuick] = useState(false);
  const [copiedAllHeader, setCopiedAllHeader] = useState(false);

  // Compute clamp calculations dynamically
  const calculation = useMemo(() => {
    return calculateClamp(config);
  }, [config]);

  const selectedPreset = useMemo(() => {
    return presets.find((p) => p.id === selectedPresetId) || null;
  }, [presets, selectedPresetId]);

  // When config changes (via sliders, inputs, etc.), stick min/max font size changes to the active archetype
  const handleConfigChange = (newConfig: ClampConfig) => {
    setConfig(newConfig);
    if (selectedPresetId) {
      setPresets((prev) =>
        prev.map((p) =>
          p.id === selectedPresetId
            ? {
                ...p,
                minFontSizePx: newConfig.minFontSize,
                maxFontSizePx: newConfig.maxFontSize,
              }
            : p
        )
      );
    }
  };

  const handleApplyPreset = (preset: TypePreset) => {
    // Look up the latest version from presets state so previous user edits stick
    const currentPresetState = presets.find((p) => p.id === preset.id) || preset;
    setSelectedPresetId(preset.id);
    setConfig((prev) => ({
      ...prev,
      minFontSize: currentPresetState.minFontSizePx,
      maxFontSize: currentPresetState.maxFontSizePx,
      // Keep user's global minViewport & maxViewport values intact across typo option changes
      minViewport: prev.minViewport,
      maxViewport: prev.maxViewport,
      mode: 'fluid',
    }));
  };

  const handleResetPresets = () => {
    setPresets(PRESET_LIST);
    if (selectedPresetId) {
      const defaultPreset = PRESET_LIST.find((p) => p.id === selectedPresetId);
      if (defaultPreset) {
        setConfig((prev) => ({
          ...prev,
          minFontSize: defaultPreset.minFontSizePx,
          maxFontSize: defaultPreset.maxFontSizePx,
        }));
      }
    }
  };

  const handleReset = () => {
    setPresets(PRESET_LIST);
    setSelectedPresetId('heading-4');
    setConfig(DEFAULT_CONFIG);
    setSimulatedWidth(768);
  };

  const handleQuickCopy = async () => {
    const success = await copyToClipboard(calculation.cssRule);
    if (success || true) {
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2200);
    }
  };

  const handleCopyAllHeader = async () => {
    const allCss = generateAllTypographyCss(config, 'css-rules', presets);
    const success = await copyToClipboard(allCss);
    if (success || true) {
      setCopiedAllHeader(true);
      setTimeout(() => setCopiedAllHeader(false), 2400);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E4E6EB] font-sans selection:bg-[#4FACFE] selection:text-[#0A0B0E] flex flex-col justify-between relative overflow-x-hidden">
      {/* Immersive UI Radial Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#161920_0%,#0A0B0E_100%)] pointer-events-none -z-10" />
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: 'radial-gradient(#4FACFE 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-[#0F1116]/95 border-b border-[#23262D] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00F2FE] to-[#4FACFE] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,172,254,0.4)]">
            <span className="font-bold text-[#0A0B0E] text-xs sm:text-sm tracking-tighter">CL</span>
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-medium tracking-tight text-[#E4E6EB] flex items-center">
              Clamp.Engine
              <span className="text-[10px] text-[#50545E] font-mono ml-2">v2.4.0</span>
            </h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D] hidden sm:inline-block">
              Fluid Typography Visualizer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex px-3 py-1 rounded-full bg-[#1A1D24] border border-[#23262D] text-[10px] uppercase tracking-widest text-[#4FACFE] font-mono items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FACFE]" />
            Global Viewport: {config.minViewport}px - {config.maxViewport}px
          </div>
          
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#161920] border border-[#23262D]">
            <div className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse shadow-[0_0_8px_#00F2FE]" />
            <span className="text-[10px] uppercase tracking-widest text-[#8E929D] font-mono">
              Preview: <span className="text-[#00F2FE] font-bold">{simulatedWidth}px</span>
            </span>
          </div>

          <button
            id="header-copy-all-btn"
            type="button"
            onClick={handleCopyAllHeader}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(79,172,254,0.15)] active:scale-95 flex items-center gap-2 cursor-pointer border ${
              copiedAllHeader
                ? 'bg-[#00F2FE] text-[#0A0B0E] border-[#00F2FE] shadow-[0_0_25px_rgba(0,242,254,0.6)]'
                : 'bg-[#161920] hover:bg-[#1A1D24] text-[#4FACFE] hover:text-[#00F2FE] border-[#4FACFE]/40 hover:border-[#00F2FE]'
            }`}
            title="Copy complete fluid typography system CSS (H1-H6, Body, Display, Meta) with current viewport bounds"
          >
            {copiedAllHeader ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] text-[#0A0B0E]" />
                <span className="text-[#0A0B0E]">COPIED ALL!</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">COPY ALL TYPO CSS</span>
                <span className="sm:hidden">ALL TYPO</span>
              </>
            )}
          </button>

          <button
            id="header-copy-btn"
            type="button"
            onClick={handleQuickCopy}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(79,172,254,0.2)] active:scale-95 flex items-center gap-2 cursor-pointer ${
              copiedQuick
                ? 'bg-[#00F2FE] text-[#0A0B0E] shadow-[0_0_25px_rgba(0,242,254,0.6)]'
                : 'bg-[#4FACFE] hover:bg-[#00F2FE] text-[#0A0B0E]'
            }`}
            title="Copy active clamp() CSS rule"
          >
            {copiedQuick ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] text-[#0A0B0E]" />
                <span className="text-[#0A0B0E]">COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY CSS</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Presets Row */}
        <PresetSelector
          currentConfig={config}
          presets={presets}
          selectedPresetId={selectedPresetId}
          onApplyPreset={handleApplyPreset}
          onResetPresets={handleResetPresets}
        />

        {/* Primary Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Inputs & Generated Code */}
          <div className="lg:col-span-5 space-y-6">
            <ClampInputs
              config={config}
              selectedPreset={selectedPreset}
              onChange={handleConfigChange}
              onReset={handleReset}
            />

            <CodeOutput calculation={calculation} config={config} presets={presets} />
          </div>

          {/* Right Column: Visual Graph & Live Responsive Preview */}
          <div className="lg:col-span-7 space-y-6">
            <ClampGraph
              calculation={calculation}
              currentSimulatedWidth={simulatedWidth}
              onSelectWidth={setSimulatedWidth}
            />

            <LivePreview
              calculation={calculation}
              simulatedWidth={simulatedWidth}
              onSimulatedWidthChange={setSimulatedWidth}
            />
          </div>
        </div>

        {/* Bottom Section: Resolution Matrix Table & Mathematical Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <BreakpointsTable
              calculation={calculation}
              currentSimulatedWidth={simulatedWidth}
              onSelectWidth={setSimulatedWidth}
            />
          </div>

          {/* Formula & Guide Card */}
          <div className="lg:col-span-5 bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB]">
                  Mathematical Specification
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
                  W3C CSS Values and Units Module
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#8E929D] leading-relaxed">
              <p>
                The CSS <code className="text-[#00F2FE] font-mono bg-[#161920] px-1.5 py-0.5 rounded border border-[#23262D]">clamp(min, preferred, max)</code> function establishes a fluid rate of change between bounding thresholds:
              </p>

              <div className="p-4 rounded-xl bg-[#161920] border border-[#23262D] font-mono text-[11px] space-y-2">
                <div className="text-[#4FACFE] text-[10px] uppercase tracking-widest font-semibold">
                  1. Slope Factor (VW)
                </div>
                <div className="text-[#E4E6EB] pl-3">
                  m = (maxFont - minFont) / (maxViewport - minViewport)
                </div>
                <div className="text-[#4FACFE] text-[10px] uppercase tracking-widest font-semibold pt-1">
                  2. Y-Axis Intercept Base
                </div>
                <div className="text-[#E4E6EB] pl-3">
                  b = minFont - (m × minViewport)
                </div>
                <div className="text-[#4FACFE] text-[10px] uppercase tracking-widest font-semibold pt-1">
                  3. Fluid Target Evaluation
                </div>
                <div className="text-[#00F2FE] pl-3 font-bold">
                  calc({calculation.preferredExpression})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161920]/80 border border-[#23262D] space-y-1">
                <span className="font-semibold text-[#4FACFE] flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Immersive Best Practice
                </span>
                <p className="text-[11px] text-[#8E929D]">
                  Using <strong className="text-[#E4E6EB]">REM</strong> baseline units ensures accessibility zoom scaling persists reliably across user agent overrides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Immersive UI Footer */}
      <footer className="mt-8 bg-[#0A0B0E] border-t border-[#23262D] px-4 sm:px-8 py-3 text-[10px] text-[#50545E] uppercase tracking-[0.2em] flex flex-wrap items-center justify-between gap-4">
        <span>Ready for deployment</span>
        <div className="flex flex-wrap gap-4 sm:gap-8">
          <span>Accessibility: AAA</span>
          <span>Responsive: Fluid</span>
          <span>Node: ID-8821</span>
          <span>Precision: {config.precision} Decimals</span>
        </div>
      </footer>
    </div>
  );
}

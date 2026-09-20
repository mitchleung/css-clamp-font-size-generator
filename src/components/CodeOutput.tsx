import React, { useState } from 'react';
import { ClampCalculation, ClampConfig, TypePreset } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { generateAllTypographyCss } from '../utils/clampCalculator';
import { Copy, Check, Code2, Terminal, Layers, FileCode, Sparkles, BookOpen } from 'lucide-react';

interface CodeOutputProps {
  calculation: ClampCalculation;
  config?: ClampConfig;
  presets?: TypePreset[];
}

type CodeTab = 'css' | 'value' | 'all-typo' | 'tailwind' | 'css-var' | 'scss';

export const CodeOutput: React.FC<CodeOutputProps> = ({ calculation, config, presets }) => {
  const [activeTab, setActiveTab] = useState<CodeTab>('css');
  const [copied, setCopied] = useState(false);

  const getCodeSnippet = (tab: CodeTab): string => {
    switch (tab) {
      case 'css':
        return calculation.cssRule;
      case 'value':
        return calculation.clampCssValue;
      case 'all-typo':
        return config
          ? generateAllTypographyCss(config, 'css-rules', presets)
          : calculation.cssRule;
      case 'tailwind':
        return calculation.tailwindClass;
      case 'css-var':
        return calculation.cssVariable;
      case 'scss':
        return calculation.scssMixin;
      default:
        return calculation.cssRule;
    }
  };

  const currentSnippet = getCodeSnippet(activeTab);

  const handleCopy = async (customText?: string) => {
    const textToCopy = customText || currentSnippet;
    const success = await copyToClipboard(textToCopy);
    if (success || true) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      id="code-output-card"
      className="bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-5"
    >
      {/* Header & Primary 1-Click Copy */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB] flex items-center gap-2">
              Generated CSS Output
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1D24] text-[#4FACFE] border border-[#23262D]">
                Synthesized
              </span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              1-Click Copy to Clipboard
            </p>
          </div>
        </div>

        {/* Primary Copy Action Button */}
        <button
          id="copy-css-main-btn"
          type="button"
          onClick={() => handleCopy()}
          className={`font-bold px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 text-xs font-mono tracking-wider ${
            copied
              ? 'bg-[#00F2FE] text-[#0A0B0E] shadow-[0_0_25px_rgba(0,242,254,0.6)] scale-[1.02]'
              : 'bg-[#4FACFE] hover:bg-[#00F2FE] text-[#0A0B0E] shadow-[0_0_20px_rgba(79,172,254,0.3)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3] text-[#0A0B0E]" />
              <span className="text-[#0A0B0E]">COPIED TO CLIPBOARD!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>COPY OUTPUT</span>
            </>
          )}
        </button>
      </div>

      {/* Code Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#161920] rounded-xl border border-[#23262D] text-xs overflow-x-auto">
        <button
          id="tab-css"
          type="button"
          onClick={() => setActiveTab('css')}
          className={`px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'css'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>CSS Rule</span>
        </button>

        <button
          id="tab-value"
          type="button"
          onClick={() => setActiveTab('value')}
          className={`px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'value'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <span>clamp() Value</span>
        </button>

        <button
          id="tab-all-typo"
          type="button"
          onClick={() => setActiveTab('all-typo')}
          className={`px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'all-typo'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
          title="Full typography scale CSS for H1-H6, Lead, Body, etc."
        >
          <BookOpen className="w-3.5 h-3.5 text-[#4FACFE]" />
          <span>All Typo Scale</span>
        </button>

        <button
          id="tab-tailwind"
          type="button"
          onClick={() => setActiveTab('tailwind')}
          className={`px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tailwind'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#4FACFE]" />
          <span>Tailwind Arbitrary</span>
        </button>

        <button
          id="tab-css-var"
          type="button"
          onClick={() => setActiveTab('css-var')}
          className={`px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'css-var'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <span>CSS Variable</span>
        </button>

        <button
          id="tab-scss"
          type="button"
          onClick={() => setActiveTab('scss')}
          className={`px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'scss'
              ? 'bg-[#1A1D24] text-[#00F2FE] font-bold border border-[#4FACFE]/40 shadow-sm'
              : 'text-[#8E929D] hover:text-[#E4E6EB]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>SCSS Mixin</span>
        </button>
      </div>

      {/* Code Display Area */}
      <div
        onClick={() => handleCopy()}
        className="relative group rounded-xl bg-[#161920] border border-[#23262D] hover:border-[#4FACFE]/50 transition-all overflow-hidden cursor-pointer"
        title="Click to copy this snippet"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F1116] border-b border-[#23262D] text-[10px] text-[#50545E] font-mono uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${copied ? 'bg-[#00F2FE] animate-ping' : 'bg-[#4FACFE]'}`} />
            <span className="text-[#8E929D]">Click block to copy</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#50545E]">{calculation.unit.toUpperCase()} Target</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="px-2 py-0.5 rounded bg-[#1A1D24] hover:bg-[#23262D] text-[#4FACFE] hover:text-[#00F2FE] border border-[#23262D] flex items-center gap-1 text-[9px] font-mono transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#00F2FE]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="p-5 overflow-x-auto">
          <pre
            id="code-snippet-pre"
            className="font-mono text-sm leading-relaxed select-all"
          >
            {activeTab === 'css' && (
              <code>
                <span className="text-[#8E929D]">font-size</span>
                <span className="text-[#50545E]">: </span>
                <span className="text-[#4FACFE] font-bold">clamp</span>
                <span className="text-[#50545E]">(</span>
                <span className="text-[#00F2FE]">{calculation.unit === 'rem' ? `${calculation.minRem}rem` : `${calculation.minPx}px`}</span>
                <span className="text-[#50545E]">, </span>
                <span className="text-[#E4E6EB]">{calculation.preferredExpression}</span>
                <span className="text-[#50545E]">, </span>
                <span className="text-[#00F2FE]">{calculation.unit === 'rem' ? `${calculation.maxRem}rem` : `${calculation.maxPx}px`}</span>
                <span className="text-[#50545E]">);</span>
              </code>
            )}

            {activeTab === 'value' && (
              <code>
                <span className="text-[#4FACFE] font-bold">clamp</span>
                <span className="text-[#50545E]">(</span>
                <span className="text-[#00F2FE]">{calculation.unit === 'rem' ? `${calculation.minRem}rem` : `${calculation.minPx}px`}</span>
                <span className="text-[#50545E]">, </span>
                <span className="text-[#E4E6EB]">{calculation.preferredExpression}</span>
                <span className="text-[#50545E]">, </span>
                <span className="text-[#00F2FE]">{calculation.unit === 'rem' ? `${calculation.maxRem}rem` : `${calculation.maxPx}px`}</span>
                <span className="text-[#50545E]">)</span>
              </code>
            )}

            {activeTab === 'all-typo' && (
              <code>
                <span className="text-[#00F2FE]">{currentSnippet}</span>
              </code>
            )}

            {activeTab === 'tailwind' && (
              <code>
                <span className="text-[#8E929D]">className</span>
                <span className="text-[#50545E]">=</span>
                <span className="text-[#00F2FE]">"{calculation.tailwindClass}"</span>
              </code>
            )}

            {activeTab === 'css-var' && (
              <code>
                <span className="text-[#8E929D]">--font-fluid-size</span>
                <span className="text-[#50545E]">: </span>
                <span className="text-[#4FACFE] font-bold">{calculation.clampCssValue}</span>
                <span className="text-[#50545E]">;</span>
              </code>
            )}

            {activeTab === 'scss' && (
              <code>
                <span className="text-[#4FACFE]">@mixin</span>{' '}
                <span className="text-[#00F2FE]">fluid-type</span>
                <span className="text-[#50545E]">() {'{'}</span>
                {'\n'}
                {'  '}
                <span className="text-[#8E929D]">font-size</span>
                <span className="text-[#50545E]">: </span>
                <span className="text-[#4FACFE] font-bold">{calculation.clampCssValue}</span>
                <span className="text-[#50545E]">;</span>
                {'\n'}
                <span className="text-[#50545E]">{'}'}</span>
              </code>
            )}
          </pre>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="px-2 py-1 rounded bg-[#0A0B0E]/90 border border-[#23262D] text-[10px] font-mono text-[#4FACFE] flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" /> Click to copy
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#161920] border border-[#23262D]">
          <div className="text-[9px] text-[#50545E] uppercase tracking-[0.2em] font-semibold">
            Min Bound
          </div>
          <div className="text-[#00F2FE] font-bold mt-1 text-sm">
            {calculation.unit === 'rem' ? `${calculation.minRem}rem` : `${calculation.minPx}px`}
          </div>
          <div className="text-[10px] text-[#8E929D]">≤ {calculation.minViewport}px</div>
        </div>

        <div className="p-3 rounded-xl bg-[#161920] border border-[#23262D]">
          <div className="text-[9px] text-[#50545E] uppercase tracking-[0.2em] font-semibold">
            Slope (VW)
          </div>
          <div className="text-[#4FACFE] font-bold mt-1 text-sm">
            {calculation.slopeVw.toFixed(4)}vw
          </div>
          <div className="text-[10px] text-[#8E929D]">{(calculation.slope * 100).toFixed(2)}px / 100vw</div>
        </div>

        <div className="p-3 rounded-xl bg-[#161920] border border-[#23262D]">
          <div className="text-[9px] text-[#50545E] uppercase tracking-[0.2em] font-semibold">
            Intercept
          </div>
          <div className="text-[#E4E6EB] font-bold mt-1 text-sm">
            {calculation.unit === 'rem'
              ? `${calculation.interceptRem.toFixed(4)}rem`
              : `${calculation.interceptPx.toFixed(2)}px`}
          </div>
          <div className="text-[10px] text-[#8E929D]">offset base</div>
        </div>

        <div className="p-3 rounded-xl bg-[#161920] border border-[#23262D]">
          <div className="text-[9px] text-[#50545E] uppercase tracking-[0.2em] font-semibold">
            Max Bound
          </div>
          <div className="text-[#00F2FE] font-bold mt-1 text-sm">
            {calculation.unit === 'rem' ? `${calculation.maxRem}rem` : `${calculation.maxPx}px`}
          </div>
          <div className="text-[10px] text-[#8E929D]">≥ {calculation.maxViewport}px</div>
        </div>
      </div>
    </div>
  );
};

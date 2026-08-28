export type UnitType = 'rem' | 'px';

export interface ClampConfig {
  minFontSize: number; // in unit (px or rem converted to px internally)
  maxFontSize: number; // in px
  minViewport: number; // in px
  maxViewport: number; // in px
  rootFontSize: number; // in px, default 16
  unit: UnitType;
  precision: number;
  mode: 'fluid' | 'direct';
  directMin: string;
  directPreferred: string;
  directMax: string;
}

export interface ClampCalculation {
  slope: number;
  slopeVw: number;
  interceptPx: number;
  interceptRem: number;
  minPx: number;
  maxPx: number;
  minRem: number;
  maxRem: number;
  minViewport: number;
  maxViewport: number;
  rootFontSize: number;
  unit: UnitType;
  preferredExpression: string;
  clampCssValue: string;
  cssRule: string;
  tailwindClass: string;
  cssVariable: string;
  scssMixin: string;
}

export interface BreakpointSample {
  name: string;
  width: number;
  fontSizePx: number;
  fontSizeRem: number;
  status: 'clamped-min' | 'scaling' | 'clamped-max';
}

export interface TypePreset {
  id: string;
  name: string;
  category: 'headings' | 'body' | 'display' | 'scale';
  minFontSizePx: number;
  maxFontSizePx: number;
  minViewportPx: number;
  maxViewportPx: number;
  sampleText: string;
  tag: string;
}

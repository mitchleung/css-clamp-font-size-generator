import { describe, it, expect } from 'vitest';
import {
  calculateClamp,
  getFontSizeAtWidth,
  getBreakpointSamples,
  generateAllTypographyCss,
  PRESET_LIST,
} from './clampCalculator';
import type { ClampConfig } from '../types';

const baseConfig: ClampConfig = {
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

describe('calculateClamp (fluid mode)', () => {
  it('calculates the standard fluid clamp formula for rem output', () => {
    const result = calculateClamp(baseConfig);

    expect(result.clampCssValue).toBe('clamp(1.125rem, 0.866rem + 1.105vw, 1.75rem)');
    expect(result.cssRule).toBe('font-size: clamp(1.125rem, 0.866rem + 1.105vw, 1.75rem);');
    expect(result.preferredExpression).toBe('0.866rem + 1.105vw');
    expect(result.minPx).toBe(18);
    expect(result.maxPx).toBe(28);
    expect(result.minRem).toBe(1.125);
    expect(result.maxRem).toBe(1.75);
  });

  it('calculates the same case in px output', () => {
    const result = calculateClamp({ ...baseConfig, unit: 'px' });

    expect(result.clampCssValue).toBe('clamp(18px, 13.8564px + 1.105vw, 28px)');
    expect(result.preferredExpression).toBe('13.8564px + 1.105vw');
  });

  it('handles a negative intercept by subtracting rem', () => {
    // 16px@320 -> 24px@1280 gives negative intercept (-0.6667rem ish? compute)
    const result = calculateClamp({
      ...baseConfig,
      minFontSize: 16,
      maxFontSize: 24,
      minViewport: 320,
      maxViewport: 1280,
    });

    expect(result.clampCssValue).toBe('clamp(1rem, 0.8333rem + 0.8333vw, 1.5rem)');
  });

  it('returns a zero-vw preferred value when min and max font sizes are equal', () => {
    const result = calculateClamp({ ...baseConfig, minFontSize: 16, maxFontSize: 16 });

    expect(result.clampCssValue).toBe('clamp(1rem, 1rem + 0vw, 1rem)');
    expect(result.slopeVw).toBe(0);
  });

  it('normalizes inverted font sizes so max is not below min', () => {
    const result = calculateClamp({ ...baseConfig, minFontSize: 28, maxFontSize: 18 });

    expect(result.minPx).toBe(28);
    expect(result.maxPx).toBe(28);
    expect(result.clampCssValue).toBe('clamp(1.75rem, 1.75rem + 0vw, 1.75rem)');
  });

  it('normalizes invalid viewport range so max viewport is greater than min', () => {
    const result = calculateClamp({ ...baseConfig, minViewport: 800, maxViewport: 800 });

    expect(result.minViewport).toBe(800);
    expect(result.maxViewport).toBe(801);
  });
});

describe('calculateClamp (direct mode)', () => {
  it('builds a clamp value from direct inputs', () => {
    const result = calculateClamp({
      ...baseConfig,
      mode: 'direct',
      directMin: '1rem',
      directPreferred: '2vw + 0.5rem',
      directMax: '2rem',
    });

    expect(result.clampCssValue).toBe('clamp(1rem, 2vw + 0.5rem, 2rem)');
    expect(result.cssRule).toBe('font-size: clamp(1rem, 2vw + 0.5rem, 2rem);');
    expect(result.preferredExpression).toBe('2vw + 0.5rem');
    expect(result.minPx).toBe(16);
    expect(result.maxPx).toBe(32);
  });

  it('parses px direct min/max values', () => {
    const result = calculateClamp({
      ...baseConfig,
      mode: 'direct',
      directMin: '18px',
      directPreferred: '1rem + 1vw',
      directMax: '32px',
    });

    expect(result.minPx).toBe(18);
    expect(result.maxPx).toBe(32);
    expect(result.minRem).toBe(1.125);
    expect(result.maxRem).toBe(2);
  });
});

describe('getFontSizeAtWidth', () => {
  it('returns clamped min at or below min viewport', () => {
    const calc = calculateClamp(baseConfig);
    expect(getFontSizeAtWidth(375, calc)).toEqual({ px: 18, rem: 1.125, status: 'clamped-min' });
    expect(getFontSizeAtWidth(320, calc)).toEqual({ px: 18, rem: 1.125, status: 'clamped-min' });
  });

  it('returns clamped max at or above max viewport', () => {
    const calc = calculateClamp(baseConfig);
    expect(getFontSizeAtWidth(1280, calc)).toEqual({ px: 28, rem: 1.75, status: 'clamped-max' });
    expect(getFontSizeAtWidth(1600, calc)).toEqual({ px: 28, rem: 1.75, status: 'clamped-max' });
  });

  it('interpolates linearly in the scaling range', () => {
    const calc = calculateClamp(baseConfig);
    const mid = getFontSizeAtWidth(827.5, calc);

    expect(mid.status).toBe('scaling');
    expect(mid.px).toBeCloseTo(23, 1);
    expect(mid.rem).toBeCloseTo(1.437, 3);
  });

  it('evaluates direct-mode preferred expressions in the scaling range', () => {
    const calc = calculateClamp({
      ...baseConfig,
      mode: 'direct',
      directMin: '1rem',
      directPreferred: '2vw + 0.5rem',
      directMax: '2rem',
      minViewport: 375,
      maxViewport: 1280,
    });

    // 2vw at 800px = 16px, + 0.5rem (8px) = 24px
    const mid = getFontSizeAtWidth(800, calc);
    expect(mid.status).toBe('scaling');
    expect(mid.px).toBeCloseTo(24, 2);
    expect(mid.rem).toBeCloseTo(1.5, 3);
  });

  it('evaluates direct-mode expressions with negative intercepts', () => {
    const calc = calculateClamp({
      ...baseConfig,
      mode: 'direct',
      directMin: '1rem',  // 16px
      directPreferred: '3vw - 0.5rem',
      directMax: '3rem',  // 48px
      minViewport: 375,
      maxViewport: 1280,
    });

    // 3vw at 800px = 24px, - 0.5rem (8px) = 16px
    const mid = getFontSizeAtWidth(800, calc);
    expect(mid.status).toBe('scaling');
    expect(mid.px).toBeCloseTo(16, 2);
  });

  it('clamps direct-mode evaluated values to min/max bounds', () => {
    const calc = calculateClamp({
      ...baseConfig,
      mode: 'direct',
      directMin: '1rem', // 16px
      directPreferred: '2vw + 0.5rem',
      directMax: '2rem', // 32px
      minViewport: 375,
      maxViewport: 1280,
    });

    // 2vw at 500px = 10px, + 0.5rem (8px) = 18px
    expect(getFontSizeAtWidth(500, calc).px).toBeCloseTo(18, 2);

    // 2vw at 100px equivalent within scaling range: use 400px -> 8px+8px=16px (at min bound)
    // 2vw at 1200px -> 24px+8px=32px (at max bound)
    expect(getFontSizeAtWidth(400, calc).px).toBeCloseTo(16, 2);
    expect(getFontSizeAtWidth(1200, calc).px).toBeCloseTo(32, 2);
  });
});

describe('getBreakpointSamples', () => {
  it('returns samples for common breakpoints with status', () => {
    const calc = calculateClamp(baseConfig);
    const samples = getBreakpointSamples(calc);

    expect(samples.length).toBeGreaterThan(0);
    expect(samples[0]).toHaveProperty('name');
    expect(samples[0]).toHaveProperty('width');
    expect(samples[0]).toHaveProperty('fontSizePx');
    expect(samples[0]).toHaveProperty('status');
    expect(samples.some((s) => s.status === 'scaling')).toBe(true);
  });
});

describe('generateAllTypographyCss', () => {
  it('generates css rules containing clamp values for presets', () => {
    const css = generateAllTypographyCss(baseConfig, 'css-rules', PRESET_LIST.slice(0, 2));

    expect(css).toContain('clamp(');
    expect(css).toContain('font-size:');
    expect(css).toContain(PRESET_LIST[0].name);
  });

  it('generates css variables format', () => {
    const css = generateAllTypographyCss(baseConfig, 'css-variables', PRESET_LIST.slice(0, 1));

    expect(css).toContain(':root {');
    expect(css).toContain(`--text-${PRESET_LIST[0].id}:`);
  });

  it('generates tailwind config format', () => {
    const css = generateAllTypographyCss(baseConfig, 'tailwind-config', PRESET_LIST.slice(0, 1));

    expect(css).toContain('fontSize:');
    expect(css).toContain(`'${PRESET_LIST[0].id}':`);
  });
});

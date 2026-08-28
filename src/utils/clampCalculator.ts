import { ClampCalculation, ClampConfig, BreakpointSample, TypePreset } from '../types';

export function round(value: number, precision = 4): number {
  const factor = Math.pow(10, precision);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number, precision = 4): string {
  const rounded = round(value, precision);
  // Avoid trailing zeros if whole or clean
  return rounded.toString();
}

/**
 * Calculates CSS fluid clamp formula and associated metadata
 */
export function calculateClamp(config: ClampConfig): ClampCalculation {
  const {
    minFontSize: rawMinFont,
    maxFontSize: rawMaxFont,
    minViewport: rawMinView,
    maxViewport: rawMaxView,
    rootFontSize: rawRoot = 16,
    unit = 'rem',
    precision = 4,
    mode = 'fluid',
    directMin = '1rem',
    directPreferred = '2.5vw',
    directMax = '2rem',
  } = config;

  const rootFontSize = Math.max(1, rawRoot);
  const minViewport = Math.max(10, rawMinView);
  const maxViewport = Math.max(minViewport + 1, rawMaxView);

  // If in direct mode, construct direct strings
  if (mode === 'direct') {
    const clampVal = `clamp(${directMin}, ${directPreferred}, ${directMax})`;
    return {
      slope: 0,
      slopeVw: 0,
      interceptPx: 0,
      interceptRem: 0,
      minPx: parseFloat(directMin) * (directMin.includes('rem') ? rootFontSize : 1) || 16,
      maxPx: parseFloat(directMax) * (directMax.includes('rem') ? rootFontSize : 1) || 32,
      minRem: (parseFloat(directMin) * (directMin.includes('rem') ? rootFontSize : 1) || 16) / rootFontSize,
      maxRem: (parseFloat(directMax) * (directMax.includes('rem') ? rootFontSize : 1) || 32) / rootFontSize,
      minViewport,
      maxViewport,
      rootFontSize,
      unit,
      preferredExpression: directPreferred,
      clampCssValue: clampVal,
      cssRule: `font-size: ${clampVal};`,
      tailwindClass: `text-[${clampVal.replace(/\s+/g, '')}]`,
      cssVariable: `--font-fluid: ${clampVal};`,
      scssMixin: `@mixin fluid-type {\n  font-size: ${clampVal};\n}`,
    };
  }

  const minPx = Math.max(0.1, rawMinFont);
  const maxPx = Math.max(minPx, rawMaxFont);

  const minRem = minPx / rootFontSize;
  const maxRem = maxPx / rootFontSize;

  // Formula:
  // slope = (maxFont - minFont) / (maxViewport - minViewport)
  // intersection = -minViewport * slope + minFont
  const viewportDelta = maxViewport - minViewport;
  const fontDelta = maxPx - minPx;

  const slope = viewportDelta === 0 ? 0 : fontDelta / viewportDelta;
  const slopeVw = slope * 100;
  const interceptPx = minPx - slope * minViewport;
  const interceptRem = interceptPx / rootFontSize;

  // Build preferred string:
  // e.g. "0.75rem + 1.5vw" or "1.5vw - 0.25rem" or "1.5vw" if intercept is 0
  const slopeVwStr = `${formatNumber(slopeVw, precision)}vw`;
  let preferredExpression = '';

  if (unit === 'rem') {
    const interceptRemStr = formatNumber(Math.abs(interceptRem), precision);
    if (round(interceptRem, precision) === 0) {
      preferredExpression = slopeVwStr;
    } else if (interceptRem > 0) {
      preferredExpression = `${interceptRemStr}rem + ${slopeVwStr}`;
    } else {
      preferredExpression = `${slopeVwStr} - ${interceptRemStr}rem`;
    }
  } else {
    const interceptPxStr = formatNumber(Math.abs(interceptPx), precision);
    if (round(interceptPx, precision) === 0) {
      preferredExpression = slopeVwStr;
    } else if (interceptPx > 0) {
      preferredExpression = `${interceptPxStr}px + ${slopeVwStr}`;
    } else {
      preferredExpression = `${slopeVwStr} - ${interceptPxStr}px`;
    }
  }

  const minStr = unit === 'rem' ? `${formatNumber(minRem, precision)}rem` : `${formatNumber(minPx, precision)}px`;
  const maxStr = unit === 'rem' ? `${formatNumber(maxRem, precision)}rem` : `${formatNumber(maxPx, precision)}px`;

  const clampCssValue = `clamp(${minStr}, ${preferredExpression}, ${maxStr})`;
  const cssRule = `font-size: ${clampCssValue};`;
  const tailwindClass = `text-[${clampCssValue.replace(/\s+/g, '')}]`;
  const cssVariable = `--font-fluid: ${clampCssValue};`;
  const scssMixin = `@mixin fluid-type {\n  font-size: ${clampCssValue};\n}`;

  return {
    slope,
    slopeVw,
    interceptPx,
    interceptRem,
    minPx,
    maxPx,
    minRem,
    maxRem,
    minViewport,
    maxViewport,
    rootFontSize,
    unit,
    preferredExpression,
    clampCssValue,
    cssRule,
    tailwindClass,
    cssVariable,
    scssMixin,
  };
}

/**
 * Calculates exact font size in PX and REM at any viewport width
 */
export function getFontSizeAtWidth(
  viewportWidth: number,
  calculation: ClampCalculation
): { px: number; rem: number; status: 'clamped-min' | 'scaling' | 'clamped-max' } {
  const { minPx, maxPx, minViewport, maxViewport, slope, interceptPx, rootFontSize } = calculation;

  if (viewportWidth <= minViewport) {
    return {
      px: minPx,
      rem: minPx / rootFontSize,
      status: 'clamped-min',
    };
  }

  if (viewportWidth >= maxViewport) {
    return {
      px: maxPx,
      rem: maxPx / rootFontSize,
      status: 'clamped-max',
    };
  }

  const px = slope * viewportWidth + interceptPx;
  const clampedPx = Math.min(maxPx, Math.max(minPx, px));

  return {
    px: round(clampedPx, 2),
    rem: round(clampedPx / rootFontSize, 3),
    status: 'scaling',
  };
}

export const COMMON_BREAKPOINTS = [
  { name: 'Mobile Mini', width: 320 },
  { name: 'Mobile S', width: 375 },
  { name: 'Mobile L', width: 425 },
  { name: 'Tablet Port', width: 640 },
  { name: 'Tablet Land', width: 768 },
  { name: 'Laptop', width: 1024 },
  { name: 'Desktop', width: 1280 },
  { name: 'Wide Screen', width: 1440 },
  { name: 'FHD Monitor', width: 1920 },
];

export function getBreakpointSamples(calculation: ClampCalculation): BreakpointSample[] {
  return COMMON_BREAKPOINTS.map((bp) => {
    const size = getFontSizeAtWidth(bp.width, calculation);
    return {
      name: bp.name,
      width: bp.width,
      fontSizePx: size.px,
      fontSizeRem: size.rem,
      status: size.status,
    };
  });
}

export const PRESET_LIST: TypePreset[] = [
  {
    id: 'hero-display',
    name: 'Hero Display',
    category: 'display',
    minFontSizePx: 36,
    maxFontSizePx: 80,
    minViewportPx: 375,
    maxViewportPx: 1440,
    sampleText: 'Craft Fluid Digital Experiences',
    tag: 'Hero / Banner',
  },
  {
    id: 'heading-1',
    name: 'Heading 1 (H1)',
    category: 'headings',
    minFontSizePx: 28,
    maxFontSizePx: 52,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Modern Fluid Typography Engine',
    tag: 'H1 Title',
  },
  {
    id: 'heading-2',
    name: 'Heading 2 (H2)',
    category: 'headings',
    minFontSizePx: 22,
    maxFontSizePx: 36,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Seamless scaling across every display',
    tag: 'H2 Section',
  },
  {
    id: 'heading-3',
    name: 'Heading 3 (H3)',
    category: 'headings',
    minFontSizePx: 18,
    maxFontSizePx: 26,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Calculated with mathematical precision',
    tag: 'H3 Subheading',
  },
  {
    id: 'heading-4',
    name: 'Heading 4 (H4)',
    category: 'headings',
    minFontSizePx: 16,
    maxFontSizePx: 22,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Sub-section title with balanced fluid weight',
    tag: 'H4 Subtitle',
  },
  {
    id: 'heading-5',
    name: 'Heading 5 (H5)',
    category: 'headings',
    minFontSizePx: 15,
    maxFontSizePx: 19,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Minor header and component grouping title',
    tag: 'H5 Header',
  },
  {
    id: 'heading-6',
    name: 'Heading 6 (H6)',
    category: 'headings',
    minFontSizePx: 14,
    maxFontSizePx: 16,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Uppercase label and micro-section header',
    tag: 'H6 Eyebrow',
  },
  {
    id: 'body-lead',
    name: 'Body Lead',
    category: 'body',
    minFontSizePx: 17,
    maxFontSizePx: 21,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Fluid typography adapts proportionally to viewport width without awkward media query breakpoint jumps.',
    tag: 'Lead Text',
  },
  {
    id: 'body-regular',
    name: 'Body Regular',
    category: 'body',
    minFontSizePx: 15,
    maxFontSizePx: 18,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'A balanced typographic foundation ensures effortless readability across handheld phones, tablets, laptops, and ultra-wide desktop monitors.',
    tag: 'Paragraph',
  },
  {
    id: 'caption-small',
    name: 'Caption / Meta',
    category: 'body',
    minFontSizePx: 12,
    maxFontSizePx: 14,
    minViewportPx: 375,
    maxViewportPx: 1280,
    sampleText: 'Updated 2026 • CSS Clamp Standard Specification',
    tag: 'Meta / Tag',
  },
];

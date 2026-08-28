import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ClampCalculation } from '../types';
import { getFontSizeAtWidth, COMMON_BREAKPOINTS } from '../utils/clampCalculator';
import { Monitor, Smartphone, Tablet, Laptop, Crosshair } from 'lucide-react';

interface ClampGraphProps {
  calculation: ClampCalculation;
  currentSimulatedWidth: number;
  onSelectWidth: (width: number) => void;
}

export const ClampGraph: React.FC<ClampGraphProps> = ({
  calculation,
  currentSimulatedWidth,
  onSelectWidth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Resize observer to adapt SVG to real card width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { minPx, maxPx, minViewport, maxViewport } = calculation;

  // Graph Domain & Range with padding
  const graphMinX = Math.max(100, Math.min(200, minViewport - 100));
  const graphMaxX = Math.max(1600, Math.max(2000, maxViewport + 250));

  // Y padding
  const yPadding = Math.max(4, (maxPx - minPx) * 0.2);
  const graphMinY = Math.max(0, minPx - yPadding);
  const graphMaxY = maxPx + yPadding;

  const height = 340;
  const paddingLeft = 56;
  const paddingRight = 28;
  const paddingTop = 32;
  const paddingBottom = 54;

  const plotWidth = Math.max(100, containerWidth - paddingLeft - paddingRight);
  const plotHeight = Math.max(50, height - paddingTop - paddingBottom);

  // Coordinate transforms
  const getSvgX = useMemo(() => {
    return (viewportW: number) => {
      const clampedW = Math.max(graphMinX, Math.min(graphMaxX, viewportW));
      const ratio = (clampedW - graphMinX) / (graphMaxX - graphMinX);
      return paddingLeft + ratio * plotWidth;
    };
  }, [graphMinX, graphMaxX, paddingLeft, plotWidth]);

  const getSvgY = useMemo(() => {
    return (fontPx: number) => {
      const ratio = (fontPx - graphMinY) / (graphMaxY - graphMinY);
      return paddingTop + plotHeight - ratio * plotHeight;
    };
  }, [graphMinY, graphMaxY, paddingTop, plotHeight]);

  const getViewportFromSvgX = (svgX: number) => {
    const clampedSvgX = Math.max(paddingLeft, Math.min(paddingLeft + plotWidth, svgX));
    const ratio = (clampedSvgX - paddingLeft) / plotWidth;
    return Math.round(graphMinX + ratio * (graphMaxX - graphMinX));
  };

  // Key coordinate points
  const p1X = getSvgX(graphMinX);
  const p1Y = getSvgY(minPx);

  const pMinViewX = getSvgX(minViewport);
  const pMinViewY = getSvgY(minPx);

  const pMaxViewX = getSvgX(maxViewport);
  const pMaxViewY = getSvgY(maxPx);

  const pEndX = getSvgX(graphMaxX);
  const pEndY = getSvgY(maxPx);

  // Main Path
  const linePath = `M ${p1X} ${p1Y} L ${pMinViewX} ${pMinViewY} L ${pMaxViewX} ${pMaxViewY} L ${pEndX} ${pEndY}`;
  const areaPath = `${linePath} L ${pEndX} ${paddingTop + plotHeight} L ${p1X} ${paddingTop + plotHeight} Z`;

  // Active hover/scrub width
  const activeWidth = hoverX !== null ? getViewportFromSvgX(hoverX) : currentSimulatedWidth;
  const activeData = getFontSizeAtWidth(activeWidth, calculation);
  const activeSvgX = getSvgX(activeWidth);
  const activeSvgY = getSvgY(activeData.px);

  // Handle Mouse Events
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverX(x);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setHoverX(null);
    setIsHovering(false);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedWidth = getViewportFromSvgX(x);
    onSelectWidth(clickedWidth);
  };

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = Math.max(2, Math.round((maxPx - minPx) / 4));
    const start = Math.floor(graphMinY / step) * step;
    for (let val = start; val <= graphMaxY; val += step) {
      if (val >= graphMinY && val <= graphMaxY) {
        ticks.push(val);
      }
    }
    return Array.from(new Set([...ticks, minPx, maxPx])).sort((a, b) => a - b);
  }, [graphMinY, graphMaxY, minPx, maxPx]);

  // X-axis major viewport ticks
  const xTicks = useMemo(() => {
    const list = [375, 768, 1024, 1440, 1920].filter(
      (w) => w >= graphMinX && w <= graphMaxX
    );
    return list;
  }, [graphMinX, graphMaxX]);

  return (
    <div
      id="clamp-graph-card"
      ref={containerRef}
      className="relative w-full rounded-2xl bg-[#0F1116] border border-[#23262D] p-6 shadow-2xl overflow-hidden"
    >
      {/* Subtle Immersive Matrix Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4FACFE 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header with Title and Live Inspection summary */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE] shadow-[0_0_10px_rgba(79,172,254,0.2)]">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium tracking-tight text-[#E4E6EB]">
                Scale Visualizer Graph
              </h3>
              <span className="text-[10px] uppercase tracking-widest text-[#4FACFE] font-mono bg-[#1A1D24] px-2 py-0.5 rounded border border-[#23262D]">
                Interactive
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              Hover curve to inspect exact PX calculation
            </p>
          </div>
        </div>

        {/* Live Hover Info Pill */}
        <div
          id="graph-active-readout"
          className="flex items-center gap-3 bg-[#161920] border border-[#23262D] px-4 py-2 rounded-xl shadow-xl"
        >
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#8E929D] font-mono">
              Screen Viewport
            </div>
            <div className="text-xs font-mono font-bold text-[#E4E6EB]">
              {activeWidth}
              <span className="text-[10px] text-[#50545E] ml-0.5">px</span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-[#23262D]" />
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#4FACFE] font-mono">
              Calculated Font
            </div>
            <div className="text-sm font-mono font-bold text-[#00F2FE] flex items-baseline gap-1">
              {activeData.px}
              <span className="text-[10px] text-[#4FACFE] font-normal">px</span>
              <span className="text-[11px] font-mono text-[#8E929D] ml-1">
                ({activeData.rem}rem)
              </span>
            </div>
          </div>
          <span
            className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md border ${
              activeData.status === 'clamped-min'
                ? 'bg-[#1A1D24] text-amber-400 border-amber-500/30'
                : activeData.status === 'clamped-max'
                ? 'bg-[#1A1D24] text-emerald-400 border-emerald-500/30'
                : 'bg-[#1A1D24] text-[#4FACFE] border-[#4FACFE]/40 shadow-[0_0_8px_rgba(79,172,254,0.2)]'
            }`}
          >
            {activeData.status === 'clamped-min'
              ? 'Min Clamped'
              : activeData.status === 'clamped-max'
              ? 'Max Clamped'
              : 'Fluid Rate'}
          </span>
        </div>
      </div>

      {/* Threshold Badges on Canvas */}
      <div className="relative z-10 flex gap-4 pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#50545E] font-mono">Min Threshold</span>
          <span className="text-base font-mono text-[#4FACFE] font-bold">{minPx}px</span>
        </div>
        <div className="w-[1px] h-8 bg-[#23262D]" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#50545E] font-mono">Max Threshold</span>
          <span className="text-base font-mono text-[#4FACFE] font-bold">{maxPx}px</span>
        </div>
        <div className="w-[1px] h-8 bg-[#23262D]" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#50545E] font-mono">Scaling Range</span>
          <span className="text-base font-mono text-[#E4E6EB]">{minViewport}px - {maxViewport}px</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full select-none cursor-crosshair">
        <svg
          id="clamp-curve-svg"
          width={containerWidth}
          height={height}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <defs>
            {/* Linear Gradient for Curve Area */}
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FACFE" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#00F2FE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#4FACFE" stopOpacity="0.00" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Clamped Hatch Pattern */}
            <pattern id="clampedHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#23262D" strokeWidth="1.2" strokeOpacity="0.8" />
            </pattern>
          </defs>

          {/* Background Grid Lines */}
          {yTicks.map((yVal) => {
            const y = getSvgY(yVal);
            const isMinOrMax = yVal === minPx || yVal === maxPx;
            return (
              <g key={`ytick-${yVal}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + plotWidth}
                  y2={y}
                  stroke={isMinOrMax ? '#23262D' : '#161920'}
                  strokeDasharray={isMinOrMax ? '3 3' : undefined}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className={`text-[10px] font-mono select-none ${
                    isMinOrMax ? 'fill-[#4FACFE] font-semibold' : 'fill-[#50545E]'
                  }`}
                >
                  {yVal}px
                </text>
              </g>
            );
          })}

          {/* X Axis Grid Lines & Breakpoint markers */}
          {xTicks.map((xVal) => {
            const x = getSvgX(xVal);
            return (
              <g key={`xtick-${xVal}`}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + plotHeight}
                  stroke="#161920"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingTop + plotHeight + 18}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-[#50545E] select-none"
                >
                  {xVal}px
                </text>
              </g>
            );
          })}

          {/* Breakpoint Region Highlights */}
          {/* Min Viewport Threshold Zone */}
          <rect
            x={paddingLeft}
            y={paddingTop}
            width={Math.max(0, pMinViewX - paddingLeft)}
            height={plotHeight}
            fill="url(#clampedHatch)"
          />
          {/* Max Viewport Threshold Zone */}
          <rect
            x={pMaxViewX}
            y={paddingTop}
            width={Math.max(0, paddingLeft + plotWidth - pMaxViewX)}
            height={plotHeight}
            fill="url(#clampedHatch)"
          />

          {/* Vertical Guides for Min Viewport & Max Viewport */}
          <line
            x1={pMinViewX}
            y1={paddingTop}
            x2={pMinViewX}
            y2={paddingTop + plotHeight}
            stroke="#4FACFE"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <line
            x1={pMaxViewX}
            y1={paddingTop}
            x2={pMaxViewX}
            y2={paddingTop + plotHeight}
            stroke="#4FACFE"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Fluid Area Fill */}
          <path d={areaPath} fill="url(#areaGlow)" />

          {/* Curve Stroke (Piecewise Line with Immersive Neon Cyan) */}
          <path
            d={linePath}
            fill="none"
            stroke="#4FACFE"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(79,172,254,0.8)]"
          />

          {/* Min & Max Knee Points */}
          <g>
            <circle
              cx={pMinViewX}
              cy={pMinViewY}
              r="5"
              fill="#0F1116"
              stroke="#00F2FE"
              strokeWidth="2.5"
            />
            <text
              x={pMinViewX}
              y={paddingTop + plotHeight + 36}
              textAnchor="middle"
              className="text-[10px] font-mono fill-[#00F2FE] font-bold select-none"
            >
              Min {minViewport}px
            </text>
          </g>

          <g>
            <circle
              cx={pMaxViewX}
              cy={pMaxViewY}
              r="5"
              fill="#0F1116"
              stroke="#00F2FE"
              strokeWidth="2.5"
            />
            <text
              x={pMaxViewX}
              y={paddingTop + plotHeight + 36}
              textAnchor="middle"
              className="text-[10px] font-mono fill-[#00F2FE] font-bold select-none"
            >
              Max {maxViewport}px
            </text>
          </g>

          {/* Active Cursor Hover Line & Point */}
          <g>
            {/* Vertical crosshair tracker */}
            <line
              x1={activeSvgX}
              y1={paddingTop}
              x2={activeSvgX}
              y2={paddingTop + plotHeight}
              stroke="#4FACFE"
              strokeWidth={isHovering ? '2' : '1.5'}
              strokeDasharray={isHovering ? undefined : '2 2'}
              opacity="0.9"
            />

            {/* Horizontal pointer to Y-axis */}
            <line
              x1={paddingLeft}
              y1={activeSvgY}
              x2={activeSvgX}
              y2={activeSvgY}
              stroke="#4FACFE"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />

            {/* Glowing active point */}
            <circle
              cx={activeSvgX}
              cy={activeSvgY}
              r="7"
              fill="rgba(79, 172, 254, 0.4)"
              stroke="#00F2FE"
              strokeWidth="2"
              className="animate-pulse"
            />
            <circle
              cx={activeSvgX}
              cy={activeSvgY}
              r="3.5"
              fill="#FFFFFF"
            />
          </g>
        </svg>

        {/* Floating Tooltip Follower (when hovering) */}
        {isHovering && hoverX !== null && (
          <div
            className="pointer-events-none absolute top-3 bg-[#1A1D24] border border-[#4FACFE] rounded-lg p-3 shadow-[0_0_20px_rgba(79,172,254,0.3)] z-20 backdrop-blur-md transition-all duration-75"
            style={{
              left: `${Math.min(
                containerWidth - 150,
                Math.max(10, activeSvgX - 65)
              )}px`,
            }}
          >
            <div className="text-[9px] uppercase tracking-widest text-[#4FACFE] mb-1 font-mono">
              At Viewport: {activeWidth}px
            </div>
            <div className="text-xl font-mono text-white font-bold flex items-baseline gap-1">
              {activeData.px}px
              <span className="text-[10px] text-[#8E929D] font-normal">({activeData.rem}rem)</span>
            </div>
          </div>
        )}
      </div>

      {/* Axis Identifiers */}
      <div className="flex items-center justify-between text-[10px] text-[#50545E] font-mono pt-1">
        <span>X: Viewport Width ({graphMinX}px - {graphMaxX}px)</span>
        <span className="text-right">Y: Calculated Font Size ({graphMinY.toFixed(0)}px - {graphMaxY.toFixed(0)}px)</span>
      </div>

      {/* Breakpoint Quick Select Bar below Graph */}
      <div className="mt-4 pt-4 border-t border-[#23262D] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D] font-mono">
          Screen Presets:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {COMMON_BREAKPOINTS.slice(1, 8).map((bp) => {
            const isCurrent = currentSimulatedWidth === bp.width;
            return (
              <button
                key={bp.name}
                id={`bp-btn-${bp.width}`}
                onClick={() => onSelectWidth(bp.width)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1A1D24] text-[#00F2FE] border border-[#4FACFE] font-bold shadow-[0_0_10px_rgba(79,172,254,0.2)]'
                    : 'bg-[#161920] text-[#8E929D] hover:text-[#E4E6EB] hover:bg-[#1A1D24] border border-[#23262D]'
                }`}
              >
                {bp.width < 640 ? (
                  <Smartphone className="w-3 h-3 text-[#4FACFE]" />
                ) : bp.width < 1024 ? (
                  <Tablet className="w-3 h-3 text-[#4FACFE]" />
                ) : bp.width < 1440 ? (
                  <Laptop className="w-3 h-3 text-[#4FACFE]" />
                ) : (
                  <Monitor className="w-3 h-3 text-[#4FACFE]" />
                )}
                <span>{bp.width}px</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

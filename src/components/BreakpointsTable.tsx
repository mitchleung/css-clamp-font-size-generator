import React from 'react';
import { ClampCalculation } from '../types';
import { getBreakpointSamples } from '../utils/clampCalculator';
import { Table, Smartphone, Tablet, Laptop, Monitor, CheckCircle2 } from 'lucide-react';

interface BreakpointsTableProps {
  calculation: ClampCalculation;
  currentSimulatedWidth: number;
  onSelectWidth: (width: number) => void;
}

export const BreakpointsTable: React.FC<BreakpointsTableProps> = ({
  calculation,
  currentSimulatedWidth,
  onSelectWidth,
}) => {
  const samples = getBreakpointSamples(calculation);

  const getDeviceIcon = (width: number) => {
    if (width < 640) return <Smartphone className="w-3.5 h-3.5 text-[#4FACFE]" />;
    if (width < 1024) return <Tablet className="w-3.5 h-3.5 text-[#4FACFE]" />;
    if (width < 1440) return <Laptop className="w-3.5 h-3.5 text-[#4FACFE]" />;
    return <Monitor className="w-3.5 h-3.5 text-[#4FACFE]" />;
  };

  return (
    <div
      id="breakpoints-table-card"
      className="bg-[#0F1116] border border-[#23262D] rounded-2xl p-6 shadow-2xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#23262D] flex items-center justify-center text-[#4FACFE]">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-tight text-[#E4E6EB] flex items-center gap-2">
              Resolution Matrix
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8E929D]">
              Exact computed values across common screen dimensions
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] text-[#50545E] font-mono">
          Click row to simulate viewport
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#23262D] bg-[#161920]">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#23262D] bg-[#0F1116] text-[10px] text-[#8E929D] uppercase tracking-[0.2em]">
              <th className="py-3 px-4">Device Tier</th>
              <th className="py-3 px-4">Screen Width</th>
              <th className="py-3 px-4 text-[#4FACFE]">Computed PX</th>
              <th className="py-3 px-4 text-[#8E929D]">Computed REM</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23262D]">
            {samples.map((sample) => {
              const isSelected = currentSimulatedWidth === sample.width;
              return (
                <tr
                  key={sample.name}
                  id={`sample-row-${sample.width}`}
                  onClick={() => onSelectWidth(sample.width)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#1A1D24] text-white font-medium shadow-inner'
                      : 'hover:bg-[#1A1D24]/60 text-[#8E929D]'
                  }`}
                >
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    {getDeviceIcon(sample.width)}
                    <span className="font-sans font-medium text-[#E4E6EB]">{sample.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#E4E6EB]">
                    {sample.width}px
                  </td>
                  <td className="py-3 px-4 font-bold text-[#00F2FE]">
                    {sample.fontSizePx}px
                  </td>
                  <td className="py-3 px-4 text-[#8E929D]">
                    {sample.fontSizeRem}rem
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border ${
                        sample.status === 'clamped-min'
                          ? 'bg-[#161920] text-amber-400 border-amber-500/30'
                          : sample.status === 'clamped-max'
                          ? 'bg-[#161920] text-emerald-400 border-emerald-500/30'
                          : 'bg-[#161920] text-[#4FACFE] border-[#4FACFE]/30'
                      }`}
                    >
                      {sample.status === 'clamped-min'
                        ? 'Min Bound'
                        : sample.status === 'clamped-max'
                        ? 'Max Bound'
                        : 'Fluid Rate'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest font-bold text-[#00F2FE]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4FACFE]" /> Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="text-[10px] font-mono uppercase tracking-widest text-[#50545E] hover:text-[#00F2FE] px-2 py-1 rounded bg-[#0F1116] border border-[#23262D] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from 'react';

export default function DualRangeSlider({
  label,
  min = 0,
  max = 100,
  value = [20, 80],
  onChange,
  isCurrency = false
}) {
  const [minVal, maxVal] = value;

  const minPos = ((minVal - min) / (max - min)) * 100;
  const maxPos = ((maxVal - min) / (max - min)) * 100;

  const formatValue = (val) => {
    if (isCurrency) {
      return `£${Math.round(val).toLocaleString('en-GB')}`;
    }
    return `${Math.round(val)}%`;
  };

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    onChange([minVal, val]);
  };

  return (
    <div className="flex items-center gap-4 py-1.5">
      {/* Left Column: Label + Range Subtitle (matching reference screenshot) */}
      <div className="w-36 shrink-0">
        <div className="text-xs font-bold text-slate-900 tracking-wider truncate">
          {label}
        </div>
        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
          {formatValue(minVal)} to {formatValue(maxVal)}
        </div>
      </div>

      {/* Right Column: Dual Handle Track */}
      <div className="relative flex-1 h-5 flex items-center">
        {/* Inactive Track */}
        <div className="absolute w-full h-[4px] bg-slate-300 rounded-full" />

        {/* Active Dark Range Track */}
        <div
          className="absolute h-[4px] bg-[#04091e] rounded-full"
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`
          }}
        />

        {/* Min Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-[4px] appearance-none bg-transparent pointer-events-none z-20 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-800 [&::-webkit-slider-thumb]:shadow-xs [&::-webkit-slider-thumb]:cursor-pointer"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-[4px] appearance-none bg-transparent pointer-events-none z-30 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-800 [&::-webkit-slider-thumb]:shadow-xs [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}

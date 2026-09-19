import { twMerge } from 'tailwind-merge';

export default function RangeSlider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', icon: Icon, className }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-cyan-600" />}
          <span>{label}</span>
        </label>
        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
          {value}{unit && <span className="text-cyan-600/80 ml-0.5 font-normal">{unit}</span>}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-grab"
          style={{ background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)` }}
        />
      </div>
    </div>
  );
}

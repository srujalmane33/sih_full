import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Select({ options = [], value, onChange, placeholder = 'Select...', className, label }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={twMerge(
            'w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 pr-9 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors shadow-2xs',
            className
          )}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

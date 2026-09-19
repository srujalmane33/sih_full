import { Search, Filter } from 'lucide-react';
import { useZoneContext } from '@/context';
import { RISK_LEVELS } from '@/config/riskLevels.config';

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Zones' },
  ...Object.values(RISK_LEVELS).map((r) => ({ value: r.id, label: r.label })),
];

export default function ZoneFilterBar() {
  const { riskFilter, setRiskFilter, searchQuery, setSearchQuery, riskCounts } = useZoneContext();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search mines by name, code, or district..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-colors shadow-2xs"
        />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRiskFilter(opt.value)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
              riskFilter === opt.value
                ? 'bg-sky-500 border-sky-500 text-white font-semibold shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {opt.label}
            <span className="ml-1.5 text-[10px] opacity-75">({riskCounts[opt.value] ?? 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

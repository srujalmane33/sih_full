import { RISK_LEVELS } from '@/config/riskLevels.config';

export default function MapLegend({ className = 'bottom-4 right-4' }) {
  return (
    <div className={`absolute z-[1000] bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-xl p-3 min-w-[120px] ${className}`}>
      <div className="space-y-1.5">
        {Object.values(RISK_LEVELS).map((level) => (
          <div key={level.id} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: level.color }} />
            <span className="text-xs font-medium text-slate-700">
              {level.id === 'LOW' ? 'Normal' : level.id === 'MEDIUM' ? 'Medium' : level.id === 'HIGH' ? 'High' : 'Critical'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

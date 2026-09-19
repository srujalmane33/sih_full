import { useSimulationContext } from '@/context';

export default function FeatureContributionBar() {
  const { results } = useSimulationContext();
  const total = results.contributions.reduce((s, c) => s + c.value, 0) || 1;

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Factor Attribution</p>
      <div className="flex h-3.5 rounded-full overflow-hidden bg-slate-200">
        {results.contributions.map((c) => (
          <div
            key={c.name}
            className="h-full transition-all duration-500"
            style={{
              width: `${(c.value / total) * 100}%`,
              backgroundColor: c.color,
              minWidth: c.value > 0 ? '4px' : '0px',
            }}
            title={`${c.name}: ${c.percentage}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 pt-1">
        {results.contributions.map((c) => (
          <div key={c.name} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            {c.name} ({c.percentage}%)
          </div>
        ))}
      </div>
    </div>
  );
}

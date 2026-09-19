import Card from '@/components/common/Card/Card';

export default function TelemetryIndicatorCard({ title, value, unit, trend, icon: Icon, color = '#06b6d4' }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-100">{value}<span className="text-sm text-slate-500 ml-1">{unit}</span></p>
          {trend && <p className={`text-[10px] mt-1 ${trend > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        )}
      </div>
    </Card>
  );
}

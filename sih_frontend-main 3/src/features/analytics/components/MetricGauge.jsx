export default function MetricGauge({ value, label, icon: Icon, color = '#06b6d4', unit = '' }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
      {Icon && (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      )}
      <div>
        <p className="text-lg font-bold text-slate-100">{value}<span className="text-xs text-slate-500 ml-1">{unit}</span></p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'all', label: 'All Actions' },
  { id: 'critical', label: 'Critical' },
  { id: 'operational', label: 'Operational' },
  { id: 'maintenance', label: 'Maintenance' },
];

export default function ActionFilterTabs({ activeTab = 'all', onTabChange }) {
  return (
    <div className="flex gap-1.5">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            activeTab === tab.id
              ? 'bg-cyan-50 border-cyan-200 text-cyan-700 font-semibold shadow-2xs'
              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

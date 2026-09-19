import { useMemo } from 'react';
import { Layers, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/common/Card/Card';
import CardHeader from '@/components/common/Card/CardHeader';
import CardContent from '@/components/common/Card/CardContent';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import { useZoneContext } from '@/context';
import { formatNumber } from '@/utils/formatters';

const FILTER_PILLS = [
  { value: 'ALL', label: 'All' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Normal' },
];

export default function ZoneSummaryTable() {
  const {
    zones,
    filteredZones,
    riskFilter,
    setRiskFilter,
    searchQuery,
    setSearchQuery,
    selectZone,
    selectedZoneId,
    selectedMine,
  } = useZoneContext();

  const mineName = selectedMine?.name || 'MOIL';

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title={
            <span className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Layers className="w-5 h-5 text-sky-500" />
              {mineName} Zones ({zones.length})
            </span>
          }
          subtitle={`Filter and explore ${mineName} zone & stope details`}
          action={
            <Link to="/map" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              View All <span className="text-sm">→</span>
            </Link>
          }
        />

        <CardContent className="pt-1 space-y-4">
          {/* Filter pills and Search input row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {FILTER_PILLS.map((pill) => {
                const isActive = riskFilter === pill.value;
                return (
                  <button
                    key={pill.value}
                    onClick={() => setRiskFilter(pill.value)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            <div className="relative sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-2.5">Zone ID</th>
                  <th className="py-2 px-2.5">Name</th>
                  <th className="py-2 px-2.5">Risk Level</th>
                  <th className="py-2 px-2.5">Reserves (MT)</th>
                  <th className="py-2 px-2.5">Mn Grade (%)</th>
                  <th className="py-2 px-2.5">Status</th>
                  <th className="py-2 px-1 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredZones.slice(0, 5).map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const displayReserves = zone.reservesMT 
                    ? formatNumber(Math.round(zone.reservesMT * 1000000))
                    : formatNumber(zone.monthlyTargetMT * 12);

                  return (
                    <tr
                      key={zone.id}
                      onClick={() => selectZone(zone.id)}
                      className={`group cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/80 font-medium' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 px-2.5 font-bold text-slate-900">
                        {zone.code || zone.id.replace('moil-', '').toUpperCase()}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-700 font-medium truncate max-w-[140px]">
                        {zone.name}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <AlertBadge level={zone.riskLevel} className="scale-90 origin-left" />
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-700 font-mono">
                        {displayReserves}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-700 font-mono">
                        {zone.oreGrade || 42.0}%
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                      <td className="py-2.5 px-1 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all inline" />
                      </td>
                    </tr>
                  );
                })}
                {filteredZones.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No mine zones match the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

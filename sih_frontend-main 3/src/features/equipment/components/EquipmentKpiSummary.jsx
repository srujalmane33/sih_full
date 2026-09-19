import { Wrench, ShieldAlert, Clock, Gauge, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '@/components/common/Card/Card';

export default function EquipmentKpiSummary({ metrics }) {
  const {
    totalCount,
    operationalCount,
    maintenanceCount,
    breakdownCount,
    avgDowntime,
    avgAvailability,
    avgMtbf,
    avgMttr,
  } = metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Fleet Operational Status */}
      <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fleet Status</span>
          <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg">
            <Wrench className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{totalCount} Equipment</div>
        <div className="flex items-center gap-2 mt-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {operationalCount} Active
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {maintenanceCount} Service
          </span>
        </div>
      </Card>

      {/* Fleet Availability */}
      <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fleet Availability</span>
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{avgAvailability}%</span>
          <span className="text-xs text-slate-400 font-normal">Target: 90%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              Number(avgAvailability) >= 88 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, Number(avgAvailability))}%` }}
          />
        </div>
      </Card>

      {/* Average Downtime */}
      <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Monthly Downtime</span>
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{avgDowntime} <span className="text-xs font-normal text-slate-500">hrs/unit</span></div>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-blue-500 inline" />
          <span>MTTR: {avgMttr}h • MTBF: {avgMtbf}h</span>
        </p>
      </Card>

      {/* Breakdown / Unplanned Downtime */}
      <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Critical Breakdown</span>
          <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-red-600">{breakdownCount} Critical</div>
        <p className="text-xs text-slate-500 mt-1">
          {breakdownCount > 0 ? 'Action required immediately' : 'No active critical breakdowns'}
        </p>
      </Card>
    </div>
  );
}

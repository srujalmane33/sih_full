import { Wrench, Calendar, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Activity, ChevronRight, MapPin } from 'lucide-react';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';

export default function EquipmentCard({ equipment, onSelectEquipment }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Operational
          </span>
        );
      case 'Maintenance Required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Service Required
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
            <Activity className="w-3 h-3 text-amber-700" />
            Degraded Performance
          </span>
        );
      case 'Breakdown':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            Critical Breakdown
          </span>
        );
      default:
        return null;
    }
  };

  const getHealthColor = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-5 bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Card Header: Tag & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {equipment.tag}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mt-0.5">
              {equipment.name}
            </h3>
          </div>
          {getStatusBadge(equipment.status)}
        </div>

        {/* Category & Location */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3">
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            {equipment.category}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3 h-3 text-slate-400" />
            {equipment.mineName}
          </span>
        </div>

        {/* Health Score & Availability */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs mb-3">
          <div>
            <div className="flex items-center justify-between text-slate-600 font-medium mb-1">
              <span>Equipment Health Index</span>
              <span className="font-bold text-slate-900">{equipment.healthScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getHealthColor(
                  equipment.healthScore
                )}`}
                style={{ width: `${equipment.healthScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Avg Downtime</span>
              <p className="text-sm font-bold text-red-600 mt-0.5">{equipment.avgDowntimeHours} <span className="text-xs font-normal text-slate-500">h/mo</span></p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Availability</span>
              <p className="text-sm font-bold text-cyan-700 mt-0.5">{equipment.availabilityPct}%</p>
            </div>
          </div>
        </div>

        {/* Primary Issue / Action Snippet */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Primary Issue / Diagnostic:</span>
          <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50/80 p-2 rounded border border-slate-100">
            "{equipment.primaryIssue}"
          </p>
        </div>
      </div>

      {/* Card Footer: Dates & Details Action */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Next Service: <strong className="text-slate-700">{equipment.nextServiceDate}</strong></span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">MTBF: {equipment.mtbfHours}h</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelectEquipment(equipment)}
          className="w-full justify-center text-xs font-semibold flex items-center gap-1 text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50 border-cyan-200"
        >
          <span>View Telemetry & Maintenance Log</span>
          <ChevronRight className="w-4 h-4 text-cyan-600" />
        </Button>
      </div>
    </Card>
  );
}

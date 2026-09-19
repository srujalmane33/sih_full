import { Wrench, CheckCircle2, AlertTriangle, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';

export default function EquipmentTable({ equipmentList, onSelectEquipment }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Operational
          </span>
        );
      case 'Maintenance Required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Service Needed
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            <Activity className="w-3 h-3 text-amber-700" />
            Degraded
          </span>
        );
      case 'Breakdown':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            Breakdown
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden bg-white border border-slate-200 shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Tag / ID</th>
              <th className="py-3 px-4">Equipment Name</th>
              <th className="py-3 px-4">Mine Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Health Score</th>
              <th className="py-3 px-4">Avg Downtime</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4">Next Service</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {equipmentList.map((eq) => (
              <tr
                key={eq.id}
                className="hover:bg-cyan-50/30 transition-colors group cursor-pointer"
                onClick={() => onSelectEquipment(eq)}
              >
                <td className="py-3 px-4 font-mono font-bold text-slate-800">{eq.tag}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{eq.name}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{eq.model}</div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-700">{eq.mineName}</td>
                <td className="py-3 px-4 text-slate-600">{eq.category}</td>
                <td className="py-3 px-4 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          eq.healthScore >= 85
                            ? 'bg-emerald-500'
                            : eq.healthScore >= 65
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${eq.healthScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800">{eq.healthScore}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-red-600">{eq.avgDowntimeHours} h/mo</td>
                <td className="py-3 px-4 font-bold text-cyan-700">{eq.availabilityPct}%</td>
                <td className="py-3 px-4 text-slate-600">{eq.nextServiceDate}</td>
                <td className="py-3 px-4">{getStatusBadge(eq.status)}</td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEquipment(eq);
                    }}
                    className="text-xs text-cyan-700 hover:bg-cyan-50"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

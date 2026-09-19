import { useSimulationContext } from '@/context';
import Card from '@/components/common/Card/Card';

export default function PenaltyFormulaSummary() {
  const { params, results } = useSimulationContext();

  return (
    <Card className="p-4">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Shortfall Formula</h4>
      <div className="font-mono text-xs text-slate-800 space-y-1.5 bg-slate-50 rounded-xl p-3 border border-slate-200">
        <p className="font-semibold text-slate-900">S<sub>total</sub> = S<sub>downtime</sub> + S<sub>moisture</sub> + S<sub>hardness</sub> + S<sub>blast</sub></p>
        <p className="text-slate-500 mt-2">S<sub>downtime</sub> = {params.targetProductionMT} × ({params.downtimeHours}/720) × 1.15 = <span className="text-red-600 font-bold">{results.penalties.downtimePenaltyMT} MT</span></p>
        <p className="text-slate-500">S<sub>moisture</sub> = {params.targetProductionMT} × max(0, {params.rainfallMm}-25) × 0.0032 = <span className="text-cyan-600 font-bold">{results.penalties.moisturePenaltyMT} MT</span></p>
        <p className="text-slate-500">S<sub>hardness</sub> = {params.targetProductionMT} × ({params.rockHardnessMohs}-5.0)^1.25 × 0.095 = <span className="text-amber-600 font-bold">{results.penalties.rockHardnessPenaltyMT} MT</span></p>
        <p className="text-slate-500">S<sub>blast</sub> = {params.targetProductionMT} × ({params.blastingDelayDays}/30) × 0.85 = <span className="text-purple-600 font-bold">{results.penalties.blastingPenaltyMT} MT</span></p>
        <div className="border-t border-slate-200 pt-2 mt-2">
          <p className="text-slate-800 font-semibold">Net Shortfall = <span className="text-red-600 font-bold">{results.netShortfallMT} MT</span> ({results.shortfallPct}%)</p>
        </div>
      </div>
    </Card>
  );
}

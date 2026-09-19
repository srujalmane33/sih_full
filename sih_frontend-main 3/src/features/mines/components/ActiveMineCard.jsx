import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Pickaxe,
  Mountain,
  MapPin,
  Activity,
  AlertTriangle,
  Gauge,
  Clock,
  Truck,
  Droplets,
  Radio,
  Layers,
  ArrowRight,
  Wrench,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { useZoneContext } from '@/context';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import MineSelectorDropdown from '@/layouts/Header/MineSelectorDropdown';
import { formatNumber, formatPercentage } from '@/utils/formatters';

export default function ActiveMineCard() {
  const navigate = useNavigate();
  const { selectedMine } = useZoneContext();

  if (!selectedMine) return null;

  const telemetry = selectedMine.telemetry || {};
  const satellite = selectedMine.satellite || {};
  const isShortfallHigh = (selectedMine.shortfallPct || 0) > 15;

  return (
    <motion.div
      key={selectedMine.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card className="p-5 sm:p-6 bg-gradient-to-b from-white to-slate-50/60 border border-slate-200/90 shadow-sm relative">
        {/* Subtle decorative background glow container - restricted to bounds without clipping dropdowns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div
            className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 ${
              selectedMine.riskLevel === 'CRITICAL'
                ? 'bg-red-500'
                : selectedMine.riskLevel === 'HIGH'
                ? 'bg-amber-500'
                : 'bg-cyan-500'
            }`}
          />
        </div>

        {/* Card Header: Mine Title, Code, Type, Risk Badge & Dropdown Switcher (Highest Z-Index: z-30) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 relative z-30">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="p-2 bg-cyan-50 border border-cyan-200/80 rounded-xl text-cyan-700">
                <Pickaxe className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedMine.name}
              </h2>
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                {selectedMine.code}
              </span>
              <AlertBadge level={selectedMine.riskLevel} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedMine.district}, {selectedMine.state}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Mountain className="w-3.5 h-3.5 text-slate-400" />
                {selectedMine.mineType} ({selectedMine.depthMeters}m Depth)
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                {selectedMine.zones?.length || 0} Production Zones
              </span>
            </div>
          </div>

          {/* Quick Mine Switcher Button in Card Header */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
              Selected Mine:
            </span>
            <MineSelectorDropdown align="right" />
          </div>
        </div>

        {/* Key Operational Metrics Grid (z-0 to stay beneath dropdown overlay) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-4 relative z-0">
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proved Reserves</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedMine.reservesMT} <span className="text-xs font-normal text-slate-500">M MT</span></p>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Target</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{formatNumber(selectedMine.monthlyTargetMT)} <span className="text-xs font-normal text-slate-500">MT</span></p>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actual Production</span>
            <p className="text-lg font-bold text-cyan-700 mt-0.5">{formatNumber(selectedMine.actualProductionMT)} <span className="text-xs font-normal text-slate-500">MT</span></p>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shortfall Rate</span>
            <p className={`text-lg font-bold mt-0.5 flex items-center gap-1 ${isShortfallHigh ? 'text-red-600' : 'text-emerald-600'}`}>
              {isShortfallHigh ? <TrendingDown className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {formatPercentage(selectedMine.shortfallPct)}
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Mn Grade</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedMine.avgManganeseGrade}% <span className="text-xs font-normal text-slate-500">Mn</span></p>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fleet Availability</span>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">{selectedMine.fleetAvailabilityPct}%</p>
          </div>
        </div>

        {/* Telemetry & Satellite Micro-Pills (z-0 to stay beneath dropdown overlay) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-3 relative z-0 text-xs">
          <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 border border-slate-200/70 rounded-lg">
            <Clock className="w-4 h-4 text-red-500 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Equip. Downtime</span>
              <strong className="text-slate-800">{telemetry.equipmentDowntime || 0} hrs/mo</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 border border-slate-200/70 rounded-lg">
            <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Active Fleet</span>
              <strong className="text-slate-800">{telemetry.activeFleetCount || 0} Units</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 border border-slate-200/70 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Groundwater Inflow</span>
              <strong className="text-slate-800">{telemetry.groundwaterInflow || 0} m³/h</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 border border-slate-200/70 rounded-lg">
            <Radio className="w-4 h-4 text-cyan-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">SAR Subsidence</span>
              <strong className="text-slate-800">{satellite.sarSubsidenceMm || 0} mm</strong>
            </div>
          </div>
        </div>

        {/* Primary Bottleneck & Prescriptive Recommendation (z-0 to stay beneath dropdown overlay) */}
        <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 relative z-0 text-xs">
          <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl">
            <span className="font-bold text-red-900 flex items-center gap-1.5 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Primary Bottleneck
            </span>
            <p className="text-slate-700 leading-snug">{selectedMine.primaryBottleneck}</p>
          </div>

          <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-xl flex flex-col justify-between">
            <div>
              <span className="font-bold text-cyan-900 flex items-center gap-1.5 mb-0.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
                Recommended Action
              </span>
              <p className="text-slate-700 leading-snug">{selectedMine.recommendedAction}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-cyan-200/50 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/equipment')}
                className="text-xs text-cyan-700 hover:bg-cyan-100/60 font-semibold flex items-center gap-1 py-1 px-2"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Equipment & Downtime</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/mines')}
                className="text-xs font-semibold flex items-center gap-1 py-1 px-2.5"
              >
                <span>View All 9 Mines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

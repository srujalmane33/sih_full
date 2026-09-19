import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Layers, Droplets, Wrench, Mountain, Activity } from 'lucide-react';
import { useZoneContext } from '@/context';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import { formatNumber, formatPercentage } from '@/utils/formatters';

export default function ZoneDetailsDrawer() {
  const { selectedZone, selectZone } = useZoneContext();

  return (
    <AnimatePresence>
      {selectedZone && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-2xl text-slate-800"
        >
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
            <h3 className="text-base font-semibold text-slate-900 truncate pr-4">{selectedZone.name}</h3>
            <button onClick={() => selectZone(null)} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Risk & Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                {selectedZone.district}, {selectedZone.state}
              </div>
              <AlertBadge level={selectedZone.riskLevel} />
            </div>

            {/* Production */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-cyan-600" /> Production</h4>
              <div className="grid grid-cols-2 gap-3">
                <InfoCell label="Monthly Target" value={`${formatNumber(selectedZone.monthlyTargetMT)} MT`} />
                <InfoCell label="Actual Output" value={`${formatNumber(selectedZone.actualProductionMT)} MT`} />
                <InfoCell label="Shortfall" value={`${formatNumber(selectedZone.shortfallMT)} MT`} valueClass="text-red-600" />
                <InfoCell label="Shortfall %" value={formatPercentage(selectedZone.shortfallPct)} valueClass="text-red-600" />
              </div>
            </div>

            {/* Telemetry */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-cyan-600" /> Live Telemetry</h4>
              <div className="grid grid-cols-2 gap-3">
                <InfoCell icon={Droplets} label="Rainfall 24h" value={`${selectedZone.telemetry.rainfall24h} mm`} />
                <InfoCell icon={Wrench} label="Downtime" value={`${selectedZone.telemetry.equipmentDowntime} hrs`} />
                <InfoCell icon={Mountain} label="Rock Hardness" value={`${selectedZone.telemetry.rockHardnessMohs} Mohs`} />
                <InfoCell label="Moisture Idx" value={formatPercentage(selectedZone.telemetry.soilMoistureIndex)} />
              </div>
            </div>

            {/* Bottleneck */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Primary Bottleneck</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedZone.primaryBottleneck}</p>
            </div>

            {/* Recommended Action */}
            <div className="space-y-2 bg-cyan-50/80 border border-cyan-200 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">Recommended Action</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedZone.recommendedAction}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoCell({ icon: Icon, label, value, valueClass = 'text-slate-800' }) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
      <div className="flex items-center gap-1 mb-1">
        {Icon && <Icon className="w-3 h-3 text-slate-400" />}
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      </div>
      <p className={`text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

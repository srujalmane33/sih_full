import { motion } from 'framer-motion';
import { MapPin, TrendingDown, Gauge, Pickaxe } from 'lucide-react';
import Card from '@/components/common/Card/Card';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { useZoneContext } from '@/context';

export default function ZoneCard({ zone }) {
  const { selectZone, selectedZoneId } = useZoneContext();
  const isSelected = selectedZoneId === zone.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        hoverable
        onClick={() => selectZone(zone.id)}
        className={isSelected ? 'ring-2 ring-cyan-500/50 border-cyan-500/40' : ''}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">{zone.name}</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] text-slate-500">{zone.district}, {zone.state}</span>
              </div>
            </div>
            <AlertBadge level={zone.riskLevel} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
            <div className="text-center">
              <TrendingDown className="w-3.5 h-3.5 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500 font-medium">Shortfall</p>
              <p className="text-sm font-bold text-red-600">{formatPercentage(zone.shortfallPct)}</p>
            </div>
            <div className="text-center">
              <Gauge className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500 font-medium">Mn Grade</p>
              <p className="text-sm font-bold text-amber-600">{zone.oreGrade}%</p>
            </div>
            <div className="text-center">
              <Pickaxe className="w-3.5 h-3.5 text-cyan-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500 font-medium">Target</p>
              <p className="text-sm font-bold text-cyan-700">{formatNumber(zone.monthlyTargetMT)}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

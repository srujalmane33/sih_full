import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';

export default function ActionItemCard({ action, index = 0 }) {
  const priorityIcons = {
    CRITICAL: <AlertTriangle className="w-4 h-4 text-red-400" />,
    HIGH: <Shield className="w-4 h-4 text-orange-400" />,
    MEDIUM: <Shield className="w-4 h-4 text-amber-400" />,
    LOW: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="flex items-start gap-3 p-4 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all group"
    >
      <div className="flex-shrink-0 mt-0.5">{priorityIcons[action.severity] || priorityIcons.MEDIUM}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h5 className="text-sm font-semibold text-slate-900 truncate">{action.title}</h5>
          <AlertBadge level={action.severity} className="scale-75 origin-left" />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-2">{action.description}</p>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span>Zone: <span className="text-slate-700 font-medium">{action.targetZone}</span></span>
          <span>•</span>
          <span>Impact: <span className="text-cyan-600 font-medium">{action.impact}</span></span>
        </div>
      </div>
      <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
        <ArrowRight className="w-4 h-4 text-cyan-600" />
      </button>
    </motion.div>
  );
}

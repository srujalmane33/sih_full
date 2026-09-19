import { useState, useMemo } from 'react';
import { ListChecks, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/common/Card/Card';
import CardHeader from '@/components/common/Card/CardHeader';
import CardContent from '@/components/common/Card/CardContent';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import ActionItemCard from './ActionItemCard';
import ActionFilterTabs from './ActionFilterTabs';
import { useZoneContext, useSimulationContext } from '@/context';
import { generateRecommendations } from '../utils/ruleTriggers';

export default function PrescriptiveActionList({ variant = 'default' }) {
  const { zones, selectZone } = useZoneContext();
  const { results: simResults } = useSimulationContext();
  const [activeTab, setActiveTab] = useState('all');

  const actions = useMemo(() => generateRecommendations(zones, simResults), [zones, simResults]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return actions;
    if (activeTab === 'critical') return actions.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH');
    if (activeTab === 'operational') return actions.filter((a) => a.category === 'operational');
    if (activeTab === 'maintenance') return actions.filter((a) => a.category === 'maintenance');
    return actions;
  }, [actions, activeTab]);

  if (variant === 'compact') {
    const topActions = actions.slice(0, 3);
    return (
      <Card className="h-full flex flex-col justify-between">
        <CardHeader
          title={
            <span className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Shield className="w-5 h-5 text-sky-500" />
              Prescriptive Actions
            </span>
          }
          subtitle="AI recommended actions to mitigate risks and optimize production"
          action={
            <Link to="/reports" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              View All <span className="text-sm">→</span>
            </Link>
          }
        />
        <CardContent className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topActions.map((action) => (
              <div
                key={action.id}
                onClick={() => {
                  const target = zones.find((z) => z.id === action.targetZone || z.code === action.targetZone);
                  if (target) selectZone(target.id);
                }}
                className="p-3 bg-white border border-slate-200/90 rounded-xl hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <AlertBadge level={action.severity} />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight mb-1 group-hover:text-sky-700 transition-colors">
                    {action.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
            {topActions.length === 0 && (
              <div className="col-span-3 py-6 text-center text-xs text-slate-500">
                All systems nominal. No urgent actions required.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Shield className="w-5 h-5 text-sky-500" />
            Prescriptive Actions
          </span>
        }
        subtitle={`${actions.length} rule-triggered mitigation directives`}
        action={<ActionFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />}
      />
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((action, i) => (
            <ActionItemCard key={action.id} action={action} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <ListChecks className="w-10 h-10 text-emerald-500/40 mb-3" />
              <p className="text-sm text-slate-500">All systems nominal. No prescriptive actions triggered.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

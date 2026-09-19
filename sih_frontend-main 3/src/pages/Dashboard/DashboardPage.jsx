import { motion } from 'framer-motion';
import {
  Mountain,
  TrendingDown,
  Gauge,
  Truck,
  AlertTriangle,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';
import { useZoneContext, useSimulationContext } from '@/context';
import { formatNumber, formatPercentage, formatMetricTonnes } from '@/utils/formatters';

// Components
import Card from '@/components/common/Card/Card';
import CardHeader from '@/components/common/Card/CardHeader';
import CardContent from '@/components/common/Card/CardContent';
import LoadingOverlay from '@/components/feedback/LoadingOverlay';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';

// Features
import ZoneFilterBar from '@/features/zones/components/ZoneFilterBar';
import ZoneSummaryGrid from '@/features/zones/components/ZoneSummaryGrid';
import ZoneDetailsDrawer from '@/features/zones/components/ZoneDetailsDrawer';
import MapContainerWrapper from '@/features/map/components/MapContainerWrapper';
import WhatIfForm from '@/features/simulator/components/WhatIfForm';
import FeatureContributionBar from '@/features/simulator/components/FeatureContributionBar';
import PrescriptiveActionList from '@/features/recommendations/components/PrescriptiveActionList';
import ProductionVarianceChart from '@/features/analytics/components/ProductionVarianceChart';
import RadialReserveScore from '@/features/analytics/components/RadialReserveScore';
import ActiveMineCard from '@/features/mines/components/ActiveMineCard';
import MLProductionPredictor from '../../features/predictor/components/MLProductionPredictor';

// KPI card helper
function KPICard({ icon: Icon, label, value, unit, color, trend }) {
  return (<></>
    // <motion.div
    //   initial={{ opacity: 0, y: 12 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.4 }}
    // >
    //   <Card className="p-4 bg-white border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
    //     <div className="flex items-start justify-between">
    //       <div className="flex-1">
    //         <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-medium">{label}</p>
    //         <p className="text-2xl font-bold text-slate-800">
    //           {value}
    //           {unit && <span className="text-sm text-slate-500 font-normal ml-1">{unit}</span>}
    //         </p>
    //         {trend !== undefined && (
    //           <p className={`text-[10px] mt-1.5 font-semibold ${trend > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
    //             {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last period
    //           </p>
    //         )}
    //       </div>
    //       <div
    //         className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
    //         style={{ backgroundColor: `${color}18` }}
    //       >
    //         <Icon className="w-5 h-5" style={{ color }} />
    //       </div>
    //     </div>
    //   </Card>
    // </motion.div>
  );
}

export default function DashboardPage() {
  const { summaryMetrics, isLoading, zones, riskCounts } = useZoneContext();
  const { results: simResults } = useSimulationContext();

  if (isLoading) {
    return (
      <div className="dashboard-light relative min-h-full min-h-[400px] bg-slate-50 p-4 lg:p-6">
        <LoadingOverlay message="Loading MOIL mine telemetry data..." />
      </div>
    );
  }

  const metrics = summaryMetrics || {};

  return (
    <div className="dashboard-light min-h-full bg-slate-50 text-slate-800 p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            Command Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time manganese reserve intelligence & production shortfall mitigation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-semibold text-red-700">{riskCounts.CRITICAL || 0} Critical</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full shadow-xs">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-700">{riskCounts.HIGH || 0} High Risk</span>
          </div>
        </div>
      </div>

      {/* Active Selected Mine Overview Card */}
      <ErrorBoundary>
        <ActiveMineCard />
      </ErrorBoundary>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Mountain}
          label="Total Reserves"
          value={metrics.totalReservesMT || '—'}
          unit="M MT"
          color="#f59e0b"
          trend={-2.1}
        />
        <KPICard
          icon={TrendingDown}
          label="Projected Shortfall"
          value={formatNumber(metrics.projectedShortfallMT || 0)}
          unit="MT"
          color="#ef4444"
          trend={8.3}
        />
        <KPICard
          icon={Gauge}
          label="Avg Mn Grade"
          value={metrics.avgManganeseGrade || '—'}
          unit="%"
          color="#06b6d4"
        />
        <KPICard
          icon={Truck}
          label="Fleet Availability"
          value={metrics.fleetAvailabilityPct || '—'}
          unit="%"
          color="#10b981"
          trend={-1.4}
        />
      </div>

      {/* <MLProductionPredictor/> */}
      {/* Main Grid: Map + Simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Satellite Radar Map */}
        <div className="xl:col-span-1">
          <ErrorBoundary>
            <Card>
              <CardHeader
                title="Satellite Radar Map — MOIL Manganese Belt"
                subtitle="Live risk-graded mine beacons with pulsating radar overlay"
              />
              <CardContent>
                <MapContainerWrapper height="440px" />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>

        {/* What-If Simulator */}
        <div className="xl:col-span-2">
          <ErrorBoundary>
              <PrescriptiveActionList />
            {/* <WhatIfForm /> */}
          </ErrorBoundary>
        </div>
      </div>

      {/* Analytics Row: Chart + Radial + Contribution Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ErrorBoundary>
            <ProductionVarianceChart />
          </ErrorBoundary>
        </div>
        <div className="xl:col-span-1 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-around">
              <RadialReserveScore
                score={metrics.overallReserveConfidencePct || 92.4}
                label="Reserve Confidence"
              />
              <RadialReserveScore
                score={100 - (simResults?.shortfallPct || 0)}
                label="Sim. Output %"
              />
            </div>
          </Card>
          <Card className="p-5">
            <FeatureContributionBar />
          </Card>
        </div>
      </div>

      {/* Prescriptive Actions */}
      <ErrorBoundary>
        {/* <PrescriptiveActionList /> */}
      </ErrorBoundary>

      {/* Zone Grid */}
      {/* <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600" />
            MOIL Mine Zones ({zones.length})
          </h2>
        </div>
        <ZoneFilterBar />
        <ZoneSummaryGrid />
      </div> */}

      {/* Details Drawer */}
      {/* <ZoneDetailsDrawer /> */}
    </div>
  );
}

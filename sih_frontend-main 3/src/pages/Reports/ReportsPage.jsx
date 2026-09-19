import { FileText } from 'lucide-react';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import ProductionVarianceChart from '@/features/analytics/components/ProductionVarianceChart';
import PrescriptiveActionList from '@/features/recommendations/components/PrescriptiveActionList';

export default function ReportsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-500" />
          Reports & Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Production analytics, prescriptive recommendations, and historical trends
        </p>
      </div>

      <ErrorBoundary>
        <ProductionVarianceChart />
      </ErrorBoundary>

      <ErrorBoundary>
        <PrescriptiveActionList />
      </ErrorBoundary>
    </div>
  );
}

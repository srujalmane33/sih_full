import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import WhatIfForm from '@/features/simulator/components/WhatIfForm';
import MLProductionPredictor from '../../features/predictor/components/MLProductionPredictor';

export default function SimulatorPage() {
  return (
    <div className="p-4 lg:p-6 min-h-full bg-[#f8f9fb]">
      <ErrorBoundary>
<MLProductionPredictor/>
      </ErrorBoundary>
    </div>
  );
}

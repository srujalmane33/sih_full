import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import MapContainerWrapper from '@/features/map/components/MapContainerWrapper';
import ZoneDetailsDrawer from '@/features/zones/components/ZoneDetailsDrawer';
import ZoneFilterBar from '@/features/zones/components/ZoneFilterBar';
import { Map, Layers } from 'lucide-react';

export default function MapExplorerPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Map className="w-5 h-5 text-sky-500" />
            GIS Map Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Full-screen satellite radar inspection console</p>
        </div>
        <div className="w-80">
          <ZoneFilterBar />
        </div>
      </div>

      {/* Full height map */}
      <div className="flex-1 relative">
        <ErrorBoundary>
          <MapContainerWrapper height="100%" className="rounded-none border-0" />
        </ErrorBoundary>
      </div>

      <ZoneDetailsDrawer />
    </div>
  );
}

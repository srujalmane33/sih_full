import { AnimatePresence } from 'framer-motion';
import { useZoneContext } from '@/context';
import ZoneCard from './ZoneCard';
import EmptyState from '@/components/feedback/EmptyState';
import SkeletonCard from '@/components/feedback/SkeletonCard';
import { MapPin } from 'lucide-react';

export default function ZoneSummaryGrid() {
  const { filteredZones, isLoading } = useZoneContext();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!filteredZones.length) {
    return <EmptyState icon={MapPin} title="No mines match" description="Adjust your risk filter or search criteria." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {filteredZones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </AnimatePresence>
    </div>
  );
}

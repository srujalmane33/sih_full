import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight, Pickaxe, ShieldAlert, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useZoneContext } from '@/context/ZoneContext';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import { INITIAL_EQUIPMENT_DATA, getEquipmentSummaryMetrics } from '@/data/equipmentData';
import EquipmentKpiSummary from '@/features/equipment/components/EquipmentKpiSummary';
import EquipmentAnalyticsCharts from '@/features/equipment/components/EquipmentAnalyticsCharts';
import EquipmentFilters from '@/features/equipment/components/EquipmentFilters';
import EquipmentCard from '@/features/equipment/components/EquipmentCard';
import EquipmentTable from '@/features/equipment/components/EquipmentTable';
import EquipmentDetailModal from '@/features/equipment/components/EquipmentDetailModal';
import ActiveMineCard from '@/features/mines/components/ActiveMineCard';
const EQUIPMENT_STORAGE_KEY = 'moil_equipment_registry_v1';

export default function EquipmentPage() {
  const navigate = useNavigate();
  const { minesList } = useZoneContext();

  const [equipmentList, setEquipmentList] = useState(() => {
    try {
      const saved = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('[EquipmentPage] Error loading equipment from localStorage:', e);
    }
    return INITIAL_EQUIPMENT_DATA;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMineFilter, setSelectedMineFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEquipmentModal, setSelectedEquipmentModal] = useState(null);

  // Compute summary KPI metrics
  const metrics = useMemo(() => {
    return getEquipmentSummaryMetrics(equipmentList);
  }, [equipmentList]);

  // Filter equipment list
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      // Search query
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mineName.toLowerCase().includes(searchQuery.toLowerCase());

      // Mine filter
      const matchesMine =
        selectedMineFilter === 'ALL' ||
        item.mineId === selectedMineFilter;

      // Category filter
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        item.category === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === 'ALL' ||
        item.status === selectedStatus;

      return matchesSearch && matchesMine && matchesCategory && matchesStatus;
    });
  }, [equipmentList, searchQuery, selectedMineFilter, selectedCategory, selectedStatus]);

  // Handle schedule maintenance update
  const handleScheduleSuccess = (equipmentId, newDate, notes) => {
    setEquipmentList((prev) => {
      const updated = prev.map((eq) =>
        eq.id === equipmentId
          ? {
              ...eq,
              nextServiceDate: newDate,
              status: eq.status === 'Breakdown' ? 'Maintenance Required' : eq.status,
              maintenanceHistory: [
                {
                  date: newDate,
                  type: 'Scheduled Maintenance',
                  notes: notes || 'Service scheduled via Operations Control Portal.',
                  technician: 'Maintenance Lead',
                },
                ...eq.maintenanceHistory,
              ],
            }
          : eq
      );
      try {
        localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleExportReport = () => {
    toast.success('Equipment Downtime & Maintenance Report Exported!', {
      description: 'Comprehensive PDF audit logs generated for all active mine site machinery.',
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-700">
              <Wrench className="w-5 h-5 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Mine Equipment Downtime & Maintenance
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Real-time fleet availability, component telemetry diagnostics, average downtime, and predictive maintenance tracking across MOIL mine sites.
          </p>
        </div>


             

   
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportReport}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Fleet Report</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/mines')}
            className="flex items-center gap-1.5"
          >
            <span>View Mine Assets</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
 <ActiveMineCard />
      {/* Aggregate KPI Summary Cards */}
      <ErrorBoundary>
        <EquipmentKpiSummary metrics={metrics} />
      </ErrorBoundary>

      {/* Recharts Visualizations */}
      <ErrorBoundary>
        <EquipmentAnalyticsCharts equipmentList={equipmentList} />
      </ErrorBoundary>

      {/* Filter & Controls Bar */}
      <ErrorBoundary>
        <EquipmentFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedMineFilter={selectedMineFilter}
          setSelectedMineFilter={setSelectedMineFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
          minesList={minesList || []}
        />
      </ErrorBoundary>

      {/* Main Content: Grid vs Table View */}
      <ErrorBoundary>
        {filteredEquipment.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-slate-200">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No equipment matches your search criteria</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your query, mine site selection, or category filters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedMineFilter('ALL');
                setSelectedCategory('All Categories');
                setSelectedStatus('ALL');
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEquipment.map((eq) => (
              <EquipmentCard
                key={eq.id}
                equipment={eq}
                onSelectEquipment={(item) => setSelectedEquipmentModal(item)}
              />
            ))}
          </div>
        ) : (
          <EquipmentTable
            equipmentList={filteredEquipment}
            onSelectEquipment={(item) => setSelectedEquipmentModal(item)}
          />
        )}
      </ErrorBoundary>

      {/* Equipment Detail Modal */}
      {selectedEquipmentModal && (
        <EquipmentDetailModal
          isOpen={Boolean(selectedEquipmentModal)}
          onClose={() => setSelectedEquipmentModal(null)}
          equipment={selectedEquipmentModal}
          onScheduleSuccess={handleScheduleSuccess}
        />
      )}
    </div>
  );
}

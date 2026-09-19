import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pickaxe,
  MapPin,
  Mountain,
  Gauge,
  Activity,
  Layers,
  FileText,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Radio,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useZoneContext } from '@/context/ZoneContext';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import MineReportModal from '@/features/reports/components/MineReportModal';
import MineSelectorDropdown from '@/layouts/Header/MineSelectorDropdown';
import GenerateReportCard from '@/features/reports/components/GenerateReportCard';
import { formatNumber, formatPercentage } from '@/utils/formatters';

export default function MinesPage() {
  const navigate = useNavigate();
  const { minesList, selectedMineId, selectedMine, selectMine } = useZoneContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [reportModalMine, setReportModalMine] = useState(null);

  // Compute aggregate numbers
  const aggregates = useMemo(() => {
    const list = minesList || [];
    const totalReserves = list.reduce(
      (acc, m) => acc + (m.metrics?.provedReservesMT ?? m.reservesMT ?? 0),
      0
    );
    const totalDailyTarget = list.reduce(
      (acc, m) =>
        acc +
        (m.metrics?.expectedOutputMTPerDay ??
          Math.round((m.monthlyTargetMT || 0) / 30) ??
          0),
      0
    );
    const highRiskCount = list.filter((m) => {
      const r = (m.overallRisk || m.riskLevel || '').toUpperCase();
      return r === 'CRITICAL' || r === 'HIGH';
    }).length;
    const ugCount = list.filter((m) =>
      (m.mineType || '').toLowerCase().includes('underground')
    ).length;
    const ocCount = list.length - ugCount;

    return {
      totalMines: list.length,
      ugCount,
      ocCount,
      totalReserves: totalReserves.toFixed(1),
      totalDailyTarget,
      highRiskCount,
    };
  }, [minesList]);

  // Filtered mines
  const filteredMines = useMemo(() => {
    return (minesList || []).filter((mine) => {
      const district = mine.location?.district || mine.district || '';
      const state = mine.location?.state || mine.state || '';
      const risk = (mine.overallRisk || mine.riskLevel || 'LOW').toUpperCase();
      const forms = Array.isArray(mine.mineralForms)
        ? mine.mineralForms
        : [mine.mineralForm || ''];

      // Search
      const matchesSearch =
        !searchQuery ||
        mine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mine.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forms.some((mf) => mf?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type
      const matchesType =
        typeFilter === 'ALL' ||
        (typeFilter === 'UG' && (mine.mineType || '').toLowerCase().includes('underground')) ||
        (typeFilter === 'OC' && (mine.mineType || '').toLowerCase().includes('opencast'));

      // Risk
      const matchesRisk =
        riskFilter === 'ALL' ||
        (riskFilter === 'HIGH' && (risk === 'CRITICAL' || risk === 'HIGH')) ||
        (riskFilter === 'MEDIUM' && risk === 'MEDIUM') ||
        (riskFilter === 'LOW' && risk === 'LOW');

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [minesList, searchQuery, typeFilter, riskFilter]);

  const handleSelectAndGo = (mineId) => {
    selectMine(mineId);
    navigate('/');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-700">
              <Pickaxe className="w-5 h-5 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              MOIL Mining Operations & Reserves
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Real-time telemetry, reserve classification, and shortfall monitoring across all {minesList?.length || 9} MOIL manganese assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/add-mines')}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Mine</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Top Banner: Active Mine Selection & Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Left 2 Cols: Selected Mine Header & Mine Selection Dropdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Mine Selection
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {selectedMine?.name || 'Balaghat Mine'}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-200">
                    <Mountain className="w-3 h-3 text-cyan-600" />
                    {selectedMine?.mineType || 'Underground'}
                  </span>
                </div>
              </div>

              {/* Mine Selection Dropdown at top */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Select Mine:</span>
                <MineSelectorDropdown align="right" />
              </div>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{selectedMine?.location?.district}, {selectedMine?.location?.state}</span>
              <span className="text-slate-300">•</span>
              <span>Depth: {selectedMine?.depth}</span>
              <span className="text-slate-300">•</span>
              <span>{selectedMine?.zones?.length || 0} Production Zones</span>
            </p>
          </div>

          {/* Quick Metrics of the selected mine */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Proved Reserves</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedMine?.metrics?.provedReservesMT || '—'} MT</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Daily Target</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{formatNumber(selectedMine?.metrics?.expectedOutputMTPerDay || 0)} MT/d</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Avg Grade</span>
              <p className="text-sm font-bold text-cyan-600 mt-0.5">{selectedMine?.metrics?.averageGrade || '—'}% Mn</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Shortfall</span>
              <p className="text-sm font-bold text-red-600 mt-0.5">{formatPercentage(selectedMine?.metrics?.shortfallPercentage || 0)}</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Generate Report Card */}
        <div className="lg:col-span-1 flex flex-col">
          <GenerateReportCard />
        </div>
      </div>

      {/* Aggregate KPI Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Mines</span>
            <Pickaxe className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{aggregates.totalMines} Units</div>
          <p className="text-xs text-slate-500 mt-1">
            {aggregates.ugCount} Underground • {aggregates.ocCount} Opencast
          </p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Proved Reserve Base</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{aggregates.totalReserves} MT</div>
          <p className="text-xs text-slate-500 mt-1">Central India Manganese Belt</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Target Extraction</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatNumber(aggregates.totalDailyTarget)} <span className="text-xs font-normal text-slate-500">MT/day</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Combined aggregate capacity</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical / Watch</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {aggregates.highRiskCount} Operations
          </div>
          <p className="text-xs text-slate-500 mt-1">Prescriptive mitigation active</p>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search mine name, district, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <span className="px-2 text-slate-400">Type:</span>
              <button
                onClick={() => setTypeFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  typeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('UG')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  typeFilter === 'UG' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Underground
              </button>
              <button
                onClick={() => setTypeFilter('OC')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  typeFilter === 'OC' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Opencast
              </button>
            </div>

            {/* Risk filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <span className="px-2 text-slate-400">Risk:</span>
              <button
                onClick={() => setRiskFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  riskFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRiskFilter('HIGH')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  riskFilter === 'HIGH' ? 'bg-red-50 text-red-700 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                High/Crit
              </button>
              <button
                onClick={() => setRiskFilter('MEDIUM')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  riskFilter === 'MEDIUM' ? 'bg-amber-50 text-amber-700 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setRiskFilter('LOW')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  riskFilter === 'LOW' ? 'bg-emerald-50 text-emerald-700 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Normal
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Mines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMines.map((mine) => {
          const isSelected = selectedMineId === mine.id;
          const shortfallPct =
            mine.metrics?.shortfallPercentage ?? mine.shortfallPct ?? 0;
          const isShortfallHigh = shortfallPct > 15;
          const reservesVal = mine.metrics?.provedReservesMT ?? mine.reservesMT ?? 0;
          const dailyTargetVal =
            mine.metrics?.expectedOutputMTPerDay ??
            Math.round((mine.monthlyTargetMT || 0) / 30);
          const gradeVal = mine.metrics?.averageGrade ?? mine.avgManganeseGrade ?? 45.0;
          const districtName = mine.location?.district || mine.district || 'General';
          const stateName = mine.location?.state || mine.state || 'MOIL Belt';
          const depthVal = mine.depth || (mine.depthMeters ? `${mine.depthMeters}m` : '250m');

          return (
            <Card
              key={mine.id}
              className={`p-5 transition-all duration-200 hover:shadow-md border ${
                isSelected
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-gradient-to-b from-cyan-50/20 to-white'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <h2 className="text-lg font-bold text-slate-900 truncate">
                      {mine.name}
                    </h2>
                    {mine.isCustom && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        Custom
                      </span>
                    )}
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {districtName}, {stateName}
                    </span>
                  </div>
                </div>

                <AlertBadge level={mine.overallRisk || mine.riskLevel} />
              </div>

              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                  {mine.mineType || 'Underground'}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Depth: {depthVal}
                </span>
                <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded">
                  {mine.zones?.length || 1} Zones
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs mb-4">
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    Proved Reserves
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {reservesVal} <span className="font-normal text-slate-500 text-xs">MT</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    Daily Target
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {formatNumber(dailyTargetVal)}{' '}
                    <span className="font-normal text-slate-500 text-xs">MT/d</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    Avg Mn Grade
                  </div>
                  <div className="text-sm font-bold text-cyan-700 mt-0.5">
                    {gradeVal}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    Shortfall Rate
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 flex items-center gap-1 ${
                      isShortfallHigh ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {isShortfallHigh ? (
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    {formatPercentage(shortfallPct)}
                  </div>
                </div>
              </div>

              {/* Telemetry Micro-Pills */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-600" />
                  Telemetry Status
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex items-center justify-between px-2 py-1 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500">Seismic</span>
                    <span className="font-semibold text-slate-700">
                      {mine.telemetry?.microseismicEvents24h ?? 4} ev/24h
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500">Water</span>
                    <span className="font-semibold text-slate-700">
                      {mine.telemetry?.waterInfluxLpm ??
                        (mine.telemetry?.groundwaterInflow
                          ? Math.round(mine.telemetry.groundwaterInflow * 16.6)
                          : 120)}{' '}
                      L/m
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant={isSelected ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleSelectAndGo(mine.id)}
                  className="flex-1 text-xs justify-center font-semibold"
                >
                  <span>{isSelected ? 'Open Dashboard' : 'Switch & Open'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReportModalMine(mine)}
                  className="text-xs px-2.5 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50"
                  title="Generate Official Mine Report"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  <span>Report</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredMines.length === 0 && (
        <Card className="p-12 text-center bg-white border border-slate-200">
          <Pickaxe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No mines match your filter criteria</h3>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search keywords or resetting the type and risk filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('ALL');
              setRiskFilter('ALL');
            }}
            className="mt-4"
          >
            Reset All Filters
          </Button>
        </Card>
      )}

      {/* Executive Report Modal */}
      {reportModalMine && (
        <MineReportModal
          isOpen={Boolean(reportModalMine)}
          onClose={() => setReportModalMine(null)}
          mine={reportModalMine}
        />
      )}
    </div>
  );
}

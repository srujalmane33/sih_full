import { Search, Filter, LayoutGrid, Table as TableIcon, X } from 'lucide-react';
import Card from '@/components/common/Card/Card';
import { EQUIPMENT_CATEGORIES } from '@/data/equipmentData';

export default function EquipmentFilters({
  searchQuery,
  setSearchQuery,
  selectedMineFilter,
  setSelectedMineFilter,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode,
  minesList,
}) {
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedMineFilter !== 'ALL' ||
    selectedCategory !== 'All Categories' ||
    selectedStatus !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMineFilter('ALL');
    setSelectedCategory('All Categories');
    setSelectedStatus('ALL');
  };

  return (
    <Card className="p-4 bg-white border border-slate-200 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search equipment tag, name, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & View toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Mine Selector Dropdown */}
          <select
            value={selectedMineFilter}
            onChange={(e) => setSelectedMineFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Mine Sites</option>
            {minesList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.mineType || 'Mine'})
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {EQUIPMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('Operational')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'Operational' ? 'bg-emerald-500 text-white shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSelectedStatus('Maintenance Required')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'Maintenance Required' ? 'bg-amber-500 text-white shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Service
            </button>
            <button
              onClick={() => setSelectedStatus('Breakdown')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'Breakdown' ? 'bg-red-500 text-white shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Breakdown
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-2 text-xs text-cyan-600 hover:text-cyan-800 font-medium hover:bg-cyan-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Grid / Table View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-slate-600 ml-auto lg:ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

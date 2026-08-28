import React, { useMemo } from 'react';
import { Filter, RotateCcw, Check, Sparkles, SlidersHorizontal, Calendar } from 'lucide-react';
import { FilterState, FilterTreeResponse } from '../types/dashboard.ts';

interface FilterPanelProps {
  filters: FilterState;
  filterTree: FilterTreeResponse | null;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onApply: () => void;
  onReset: () => void;
  lastUpdated?: string;
  isLoading?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  filterTree,
  onFilterChange,
  onApply,
  onReset,
  lastUpdated,
  isLoading,
}) => {
  // Cascading Dynamic Options Calculation based on hierarchy tree
  const dynamicOptions = useMemo(() => {
    if (!filterTree || !filterTree.hierarchy) {
      return {
        groups: ['ALL'],
        units: ['ALL'],
        opgs: ['ALL'],
        projects: ['ALL'],
        reportingGroups: ['ALL'],
      };
    }

    let records = filterTree.hierarchy;

    // Filter by Reporting Group
    if (filters.reportingGroup && filters.reportingGroup !== 'ALL') {
      records = records.filter((r) => r.reportingGroup === filters.reportingGroup);
    }

    const availableGroups = ['ALL', ...Array.from(new Set(records.map((r) => r.groupName))).sort()];

    // Filter by Group
    if (filters.group && filters.group !== 'ALL') {
      records = records.filter((r) => r.groupName === filters.group);
    }

    const availableUnits = ['ALL', ...Array.from(new Set(records.map((r) => r.unitName))).sort()];

    // Filter by Unit
    if (filters.unit && filters.unit !== 'ALL') {
      records = records.filter((r) => r.unitName === filters.unit);
    }

    const availableOpgs = ['ALL', ...Array.from(new Set(records.map((r) => r.opgName))).sort()];

    // Filter by OPG
    if (filters.opg && filters.opg !== 'ALL') {
      records = records.filter((r) => r.opgName === filters.opg);
    }

    const availableProjects = ['ALL', ...Array.from(new Set(records.map((r) => r.projectName))).sort()];

    return {
      reportingGroups: filterTree.reportingGroups || ['ALL'],
      groups: availableGroups,
      units: availableUnits,
      opgs: availableOpgs,
      projects: availableProjects,
    };
  }, [filterTree, filters.reportingGroup, filters.group, filters.unit, filters.opg]);

  const months = [
    { value: 'ALL', label: 'Full Year (Jan-Dec)' },
    { value: '1', label: 'Jan - January' },
    { value: '2', label: 'Feb - February' },
    { value: '3', label: 'Mar - March' },
    { value: '4', label: 'Apr - April' },
    { value: '5', label: 'May - May' },
    { value: '6', label: 'Jun - June' },
    { value: '7', label: 'Jul - July' },
    { value: '8', label: 'Aug - August' },
    { value: '9', label: 'Sep - September' },
    { value: '10', label: 'Oct - October' },
    { value: '11', label: 'Nov - November' },
    { value: '12', label: 'Dec - December' },
  ];

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({
      group: val,
      unit: 'ALL',
      opg: 'ALL',
      project: 'ALL',
    });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({
      unit: val,
      opg: 'ALL',
      project: 'ALL',
    });
  };

  const handleOpgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({
      opg: val,
      project: 'ALL',
    });
  };

  const activeFiltersCount = [
    filters.reportingGroup !== 'ALL',
    filters.group !== 'ALL',
    filters.unit !== 'ALL',
    filters.opg !== 'ALL',
    filters.project !== 'ALL',
    filters.month !== 'ALL',
    filters.year !== 2026,
  ].filter(Boolean).length;

  return (
    <div id="filter-panel-card" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Performance Dimension Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {activeFiltersCount} Active
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500">Cascading hierarchy filters for targeted financial attribution</p>
          </div>
        </div>

        {lastUpdated && (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 hidden sm:flex">
            <Calendar size={13} className="text-slate-400" />
            <span>Updated: <strong className="text-slate-700 font-mono">{new Date(lastUpdated).toLocaleTimeString()}</strong></span>
          </div>
        )}
      </div>

      {/* 7 Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs">
        {/* 1. Reporting Group */}
        <div>
          <label htmlFor="filter-reporting-group" className="block text-[11px] font-semibold text-slate-600 mb-1">
            1. Reporting Group
          </label>
          <select
            id="filter-reporting-group"
            value={filters.reportingGroup}
            onChange={(e) => onFilterChange({ reportingGroup: e.target.value, group: 'ALL', unit: 'ALL', opg: 'ALL', project: 'ALL' })}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.reportingGroups.map((rg) => (
              <option key={rg} value={rg}>
                {rg === 'ALL' ? 'All Reporting Groups' : rg}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Group */}
        <div>
          <label htmlFor="filter-group" className="block text-[11px] font-semibold text-slate-600 mb-1">
            2. Group
          </label>
          <select
            id="filter-group"
            value={filters.group}
            onChange={handleGroupChange}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.groups.map((grp) => (
              <option key={grp} value={grp}>
                {grp === 'ALL' ? 'All Groups' : grp}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Unit */}
        <div>
          <label htmlFor="filter-unit" className="block text-[11px] font-semibold text-slate-600 mb-1">
            3. Unit
          </label>
          <select
            id="filter-unit"
            value={filters.unit}
            onChange={handleUnitChange}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.units.map((u) => (
              <option key={u} value={u}>
                {u === 'ALL' ? 'All Units' : u}
              </option>
            ))}
          </select>
        </div>

        {/* 4. OPG */}
        <div>
          <label htmlFor="filter-opg" className="block text-[11px] font-semibold text-slate-600 mb-1">
            4. OPG (Proj Group)
          </label>
          <select
            id="filter-opg"
            value={filters.opg}
            onChange={handleOpgChange}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.opgs.map((o) => (
              <option key={o} value={o}>
                {o === 'ALL' ? 'All OPGs' : o}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Project */}
        <div>
          <label htmlFor="filter-project" className="block text-[11px] font-semibold text-slate-600 mb-1 truncate">
            5. Project
          </label>
          <select
            id="filter-project"
            value={filters.project}
            onChange={(e) => onFilterChange({ project: e.target.value })}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all truncate"
          >
            {dynamicOptions.projects.map((p) => (
              <option key={p} value={p}>
                {p === 'ALL' ? 'All Projects (Aggregated)' : p}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Year */}
        <div>
          <label htmlFor="filter-year" className="block text-[11px] font-semibold text-slate-600 mb-1">
            6. Fiscal Year
          </label>
          <select
            id="filter-year"
            value={filters.year}
            onChange={(e) => onFilterChange({ year: Number(e.target.value) })}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            <option value={2026}>FY 2026</option>
            <option value={2025}>FY 2025</option>
          </select>
        </div>

        {/* 7. Month */}
        <div>
          <label htmlFor="filter-month" className="block text-[11px] font-semibold text-slate-600 mb-1">
            7. Month View
          </label>
          <select
            id="filter-month"
            value={filters.month}
            onChange={(e) => onFilterChange({ month: e.target.value })}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Controls & Active Tag Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
          <span className="text-slate-500 font-medium mr-1">Active Scope:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
            FY {filters.year}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Month: {filters.month === 'ALL' ? 'Full Year (12M)' : `Month ${filters.month}`}
          </span>
          {filters.group !== 'ALL' && (
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 font-medium">
              Group: {filters.group}
              <button
                onClick={() => onFilterChange({ group: 'ALL', unit: 'ALL', opg: 'ALL', project: 'ALL' })}
                className="hover:text-blue-900 font-bold ml-1"
              >
                ×
              </button>
            </span>
          )}
          {filters.unit !== 'ALL' && (
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-medium">
              Unit: {filters.unit}
              <button
                onClick={() => onFilterChange({ unit: 'ALL', opg: 'ALL', project: 'ALL' })}
                className="hover:text-emerald-900 font-bold ml-1"
              >
                ×
              </button>
            </span>
          )}
          {filters.project !== 'ALL' && (
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 font-medium">
              Project: {filters.project}
              <button onClick={() => onFilterChange({ project: 'ALL' })} className="hover:text-purple-900 font-bold ml-1">
                ×
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="filter-btn-reset"
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          <button
            id="filter-btn-apply"
            onClick={onApply}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isLoading ? 'Aggregating...' : 'Apply Filters'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

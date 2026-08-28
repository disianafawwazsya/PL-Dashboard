import React, { useMemo, useState } from 'react';
import { Filter, RotateCcw, Check, SlidersHorizontal, Calendar, ChevronDown, ChevronUp, Database } from 'lucide-react';
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dynamic Options Calculation based on hierarchy tree & DBeaver dimensions
  const dynamicOptions = useMemo(() => {
    if (!filterTree || !filterTree.hierarchy) {
      return {
        businesses: ['ALL'],
        sitesList: ['ALL'],
        towers: ['ALL'],
        industries: ['ALL'],
        jobCodes: ['ALL'],
        groups: ['ALL'],
        units: ['ALL'],
        opgs: ['ALL'],
        projects: ['ALL'],
        reportingGroups: ['ALL'],
      };
    }

    let records = filterTree.hierarchy;

    if (filters.business && filters.business !== 'ALL') {
      records = records.filter((r) => r.business === filters.business);
    }
    if (filters.sites && filters.sites !== 'ALL') {
      records = records.filter((r) => r.sites === filters.sites);
    }
    if (filters.industry && filters.industry !== 'ALL') {
      records = records.filter((r) => r.industry === filters.industry);
    }
    if (filters.group && filters.group !== 'ALL') {
      records = records.filter((r) => r.groupName === filters.group);
    }
    if (filters.unit && filters.unit !== 'ALL') {
      records = records.filter((r) => r.unitName === filters.unit);
    }
    if (filters.opg && filters.opg !== 'ALL') {
      records = records.filter((r) => r.opgName === filters.opg);
    }

    const availableBusinesses = filterTree.businesses || ['ALL', 'LOCAL SERVICES', 'GLOBAL CENTER SERVICES', 'BPO SERVICES'];
    const availableSites = ['ALL', ...Array.from(new Set(records.map((r) => r.sites).filter(Boolean) as string[])).sort()];
    const availableTowers = ['ALL', ...Array.from(new Set(records.map((r) => r.tower).filter(Boolean) as string[])).sort()];
    const availableIndustries = ['ALL', ...Array.from(new Set(records.map((r) => r.industry).filter(Boolean) as string[])).sort()];
    const availableUnits = ['ALL', ...Array.from(new Set(records.map((r) => r.unitName))).sort()];
    const availableOpgs = ['ALL', ...Array.from(new Set(records.map((r) => r.opgName))).sort()];
    const availableProjects = ['ALL', ...Array.from(new Set(records.map((r) => r.projectName))).sort()];

    return {
      businesses: availableBusinesses,
      sitesList: availableSites,
      towers: availableTowers,
      industries: availableIndustries,
      units: availableUnits,
      opgs: availableOpgs,
      projects: availableProjects,
      groups: filterTree.groups || ['ALL'],
      reportingGroups: filterTree.reportingGroups || ['ALL'],
    };
  }, [filterTree, filters.business, filters.sites, filters.industry, filters.group, filters.unit, filters.opg]);

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

  const activeFiltersCount = [
    filters.business && filters.business !== 'ALL',
    filters.sites && filters.sites !== 'ALL',
    filters.tower && filters.tower !== 'ALL',
    filters.industry && filters.industry !== 'ALL',
    filters.unit && filters.unit !== 'ALL',
    filters.opg && filters.opg !== 'ALL',
    filters.project && filters.project !== 'ALL',
    filters.month && filters.month !== 'ALL',
    filters.year !== 2026,
  ].filter(Boolean).length;

  return (
    <div id="filter-panel-card" className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-600">
            <SlidersHorizontal size={15} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Performance Dimension Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {activeFiltersCount} Active
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500">
              Correlated to DBeaver database dimensions (Columns A through Q)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showAdvanced ? 'Simple Filters' : 'More Dimensions (Sites, Tower, Industry)'}
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {lastUpdated && (
            <div className="text-[11px] text-slate-400 items-center gap-1.5 hidden sm:flex">
              <Calendar size={13} className="text-slate-400" />
              <span>
                Updated: <strong className="text-slate-600 font-mono">{new Date(lastUpdated).toLocaleTimeString()}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        {/* 1. Col A: Business */}
        <div>
          <label htmlFor="filter-business" className="block text-[11px] font-semibold text-slate-600 mb-1">
            1. Business <span className="font-normal text-slate-400">(Col A)</span>
          </label>
          <select
            id="filter-business"
            value={filters.business || 'ALL'}
            onChange={(e) =>
              onFilterChange({
                business: e.target.value,
                sites: 'ALL',
                tower: 'ALL',
                unit: 'ALL',
                opg: 'ALL',
                project: 'ALL',
              })
            }
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.businesses.map((biz) => (
              <option key={biz} value={biz}>
                {biz === 'ALL' ? 'All Businesses' : biz}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Col O: Unit */}
        <div>
          <label htmlFor="filter-unit" className="block text-[11px] font-semibold text-slate-600 mb-1">
            2. Unit <span className="font-normal text-slate-400">(Col O)</span>
          </label>
          <select
            id="filter-unit"
            value={filters.unit}
            onChange={(e) =>
              onFilterChange({
                unit: e.target.value,
                opg: 'ALL',
                project: 'ALL',
              })
            }
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.units.map((u) => (
              <option key={u} value={u}>
                {u === 'ALL' ? 'All Units' : u}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Col N: OPG */}
        <div>
          <label htmlFor="filter-opg" className="block text-[11px] font-semibold text-slate-600 mb-1">
            3. OPG <span className="font-normal text-slate-400">(Col N)</span>
          </label>
          <select
            id="filter-opg"
            value={filters.opg}
            onChange={(e) =>
              onFilterChange({
                opg: e.target.value,
                project: 'ALL',
              })
            }
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            {dynamicOptions.opgs.map((o) => (
              <option key={o} value={o}>
                {o === 'ALL' ? 'All OPGs' : o}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Col G: Job Name / Project */}
        <div>
          <label htmlFor="filter-project" className="block text-[11px] font-semibold text-slate-600 mb-1 truncate">
            4. Job / Project <span className="font-normal text-slate-400">(Col G)</span>
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

        {/* 5. Year */}
        <div>
          <label htmlFor="filter-year" className="block text-[11px] font-semibold text-slate-600 mb-1">
            5. Fiscal Year
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

        {/* 6. Month */}
        <div>
          <label htmlFor="filter-month" className="block text-[11px] font-semibold text-slate-600 mb-1">
            6. Month View <span className="font-normal text-slate-400">(Col E)</span>
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

      {/* Advanced Dimensions (Sites, Tower, Industry) */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs mt-3 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
          {/* Col C: Sites */}
          <div>
            <label htmlFor="filter-sites" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sites <span className="font-normal text-slate-400">(Col C)</span>
            </label>
            <select
              id="filter-sites"
              value={filters.sites || 'ALL'}
              onChange={(e) => onFilterChange({ sites: e.target.value })}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              {dynamicOptions.sitesList.map((site) => (
                <option key={site} value={site}>
                  {site === 'ALL' ? 'All Sites' : site}
                </option>
              ))}
            </select>
          </div>

          {/* Col D: Tower */}
          <div>
            <label htmlFor="filter-tower" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tower <span className="font-normal text-slate-400">(Col D)</span>
            </label>
            <select
              id="filter-tower"
              value={filters.tower || 'ALL'}
              onChange={(e) => onFilterChange({ tower: e.target.value })}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              {dynamicOptions.towers.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Towers' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Col P: Industry */}
          <div>
            <label htmlFor="filter-industry" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Industry <span className="font-normal text-slate-400">(Col P)</span>
            </label>
            <select
              id="filter-industry"
              value={filters.industry || 'ALL'}
              onChange={(e) => onFilterChange({ industry: e.target.value })}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              {dynamicOptions.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'ALL' ? 'All Industries' : ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action Controls & Active Tag Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
          <span className="text-slate-400 font-medium mr-1">Scope:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
            FY {filters.year}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Month: {filters.month === 'ALL' ? 'Full Year (12M)' : `Month ${filters.month}`}
          </span>
          {filters.business && filters.business !== 'ALL' && (
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 font-medium">
              Business: {filters.business}
              <button
                onClick={() => onFilterChange({ business: 'ALL' })}
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
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isLoading ? 'Aggregating...' : 'Apply Filters'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ChevronRight, Home, Building2, Layers, FolderKanban, Briefcase } from 'lucide-react';
import { FilterState } from '../types/dashboard.ts';

interface DrilldownBreadcrumbProps {
  filters: FilterState;
  onSelectLevel: (level: 'ALL' | 'group' | 'unit' | 'opg' | 'project', value?: string) => void;
}

export const DrilldownBreadcrumb: React.FC<DrilldownBreadcrumbProps> = ({ filters, onSelectLevel }) => {
  const isAll = filters.group === 'ALL' && filters.unit === 'ALL' && filters.opg === 'ALL' && filters.project === 'ALL';

  return (
    <nav id="drilldown-breadcrumbs" aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-slate-600 font-medium py-1">
      {/* Root ALL */}
      <button
        id="breadcrumb-btn-root"
        onClick={() => onSelectLevel('ALL')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
          isAll
            ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs'
            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home size={13} className="text-blue-600" />
        <span>Enterprise (ALL)</span>
      </button>

      {/* Reporting Group if active */}
      {filters.reportingGroup !== 'ALL' && (
        <>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {filters.reportingGroup}
          </span>
        </>
      )}

      {/* Group Level */}
      {filters.group !== 'ALL' && (
        <>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <button
            id="breadcrumb-btn-group"
            onClick={() => onSelectLevel('group', filters.group)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              filters.unit === 'ALL'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs'
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={13} className="text-blue-600" />
            <span>{filters.group}</span>
          </button>
        </>
      )}

      {/* Unit Level */}
      {filters.unit !== 'ALL' && (
        <>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <button
            id="breadcrumb-btn-unit"
            onClick={() => onSelectLevel('unit', filters.unit)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              filters.opg === 'ALL'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs'
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={13} className="text-emerald-600" />
            <span>{filters.unit}</span>
          </button>
        </>
      )}

      {/* OPG Level */}
      {filters.opg !== 'ALL' && (
        <>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <button
            id="breadcrumb-btn-opg"
            onClick={() => onSelectLevel('opg', filters.opg)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              filters.project === 'ALL'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs'
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderKanban size={13} className="text-amber-600" />
            <span>{filters.opg}</span>
          </button>
        </>
      )}

      {/* Project Level */}
      {filters.project !== 'ALL' && (
        <>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs">
            <Briefcase size={13} className="text-indigo-600" />
            <span>{filters.project}</span>
          </div>
        </>
      )}
    </nav>
  );
};

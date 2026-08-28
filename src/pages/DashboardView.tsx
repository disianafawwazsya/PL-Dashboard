import React from 'react';
import { FilterState, FilterTreeResponse, DashboardSummary, FinancialMatrixResponse } from '../types/dashboard.ts';
import { FilterPanel } from '../components/FilterPanel.tsx';
import { DrilldownBreadcrumb } from '../components/DrilldownBreadcrumb.tsx';
import { KPICards } from '../components/KPICards.tsx';
import { MonthlyCharts } from '../components/MonthlyCharts.tsx';
import { FinancialTable } from '../components/FinancialTable.tsx';
import { HierarchyScorecard } from '../components/HierarchyScorecard.tsx';

interface DashboardViewProps {
  filters: FilterState;
  filterTree: FilterTreeResponse | null;
  summary: DashboardSummary | null;
  matrixData: FinancialMatrixResponse | null;
  isLoading: boolean;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSelectHierarchyLevel: (level: 'ALL' | 'group' | 'unit' | 'opg' | 'project', value?: string) => void;
  compactCurrency: boolean;
  onToggleCompactCurrency: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  filters,
  filterTree,
  summary,
  matrixData,
  isLoading,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onSelectHierarchyLevel,
  compactCurrency,
  onToggleCompactCurrency,
}) => {
  return (
    <div className="space-y-5">
      {/* Dynamic Filter Panel */}
      <FilterPanel
        filters={filters}
        filterTree={filterTree}
        onFilterChange={onFilterChange}
        onApply={onApplyFilters}
        onReset={onResetFilters}
        lastUpdated={summary?.lastUpdated}
        isLoading={isLoading}
      />

      {/* Drilldown Breadcrumb Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-1.5 flex items-center justify-between shadow-2xs">
        <DrilldownBreadcrumb filters={filters} onSelectLevel={onSelectHierarchyLevel} />
      </div>

      {/* Executive KPI Summary Cards */}
      <KPICards summary={summary} compactCurrency={compactCurrency} />

      {/* Business Unit & Group Comparison Scorecards */}
      {summary && summary.groupScorecards && (
        <HierarchyScorecard
          scorecards={summary.groupScorecards}
          onSelectGroup={(grp) => onSelectHierarchyLevel('group', grp)}
          compactCurrency={compactCurrency}
        />
      )}

      {/* Monthly Actual vs Budget Charts */}
      {summary && (
        <MonthlyCharts data={summary.monthlyTrend} year={filters.year} />
      )}

      {/* Financial Matrix Breakdown Table */}
      <FinancialTable
        matrixData={matrixData}
        compactCurrency={compactCurrency}
        onToggleCompactCurrency={onToggleCompactCurrency}
        year={filters.year}
      />
    </div>
  );
};

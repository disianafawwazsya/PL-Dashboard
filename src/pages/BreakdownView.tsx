import React from 'react';
import { FilterState, FilterTreeResponse, FinancialMatrixResponse, DashboardSummary } from '../types/dashboard.ts';
import { FilterPanel } from '../components/FilterPanel.tsx';
import { DrilldownBreadcrumb } from '../components/DrilldownBreadcrumb.tsx';
import { FinancialTable } from '../components/FinancialTable.tsx';
import { Layers, PieChart, ShieldAlert, CheckCircle2, TrendingUp, Wallet } from 'lucide-react';
import { formatRupiah, formatPercentage } from '../utils/formatters.ts';

interface BreakdownViewProps {
  filters: FilterState;
  filterTree: FilterTreeResponse | null;
  matrixData: FinancialMatrixResponse | null;
  summary: DashboardSummary | null;
  isLoading: boolean;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSelectHierarchyLevel: (level: 'ALL' | 'group' | 'unit' | 'opg' | 'project', value?: string) => void;
  compactCurrency: boolean;
  onToggleCompactCurrency: () => void;
}

export const BreakdownView: React.FC<BreakdownViewProps> = ({
  filters,
  filterTree,
  matrixData,
  summary,
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
      {/* Filter Section */}
      <FilterPanel
        filters={filters}
        filterTree={filterTree}
        onFilterChange={onFilterChange}
        onApply={onApplyFilters}
        onReset={onResetFilters}
        lastUpdated={summary?.lastUpdated}
        isLoading={isLoading}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-1.5 flex items-center justify-between shadow-2xs">
        <DrilldownBreadcrumb filters={filters} onSelectLevel={onSelectHierarchyLevel} />
      </div>

      {/* Summary Highlight Banner */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">Total Year Revenue Target</div>
              <div className="text-lg font-extrabold text-slate-900">{formatRupiah(summary.kpis.sales.actual, compactCurrency)}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Achievement: {formatPercentage(summary.kpis.sales.achievement)}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
              <Wallet size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">Total Cost Incurred</div>
              <div className="text-lg font-extrabold text-slate-900">{formatRupiah(summary.kpis.cost.actual, compactCurrency)}</div>
              <div className="text-[10px] text-purple-700 font-medium">Direct + Indirect Cost Allocation</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">Gross Margin Realization</div>
              <div className="text-lg font-extrabold text-emerald-600">{formatPercentage(summary.kpis.grossProfit.marginActual)}</div>
              <div className="text-[10px] text-slate-500">Plan: {formatPercentage(summary.kpis.grossProfit.marginBudget)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main 12-Month Financial Table */}
      <FinancialTable
        matrixData={matrixData}
        compactCurrency={compactCurrency}
        onToggleCompactCurrency={onToggleCompactCurrency}
        year={filters.year}
      />
    </div>
  );
};

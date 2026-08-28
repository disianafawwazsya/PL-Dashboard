import React, { useState } from 'react';
import { FilterState, FilterTreeResponse, FinancialMatrixResponse, DashboardSummary } from '../types/dashboard.ts';
import { FilterPanel } from '../components/FilterPanel.tsx';
import { DrilldownBreadcrumb } from '../components/DrilldownBreadcrumb.tsx';
import { FinancialTable } from '../components/FinancialTable.tsx';
import { ExecutiveReportView } from '../components/ExecutiveReportView.tsx';
import { TrendingUp, Wallet, CheckCircle2, Table2, FileSpreadsheet, Layers } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'matrix' | 'statement'>('matrix');

  return (
    <div className="space-y-5">
      {/* Cascading Filter Section */}
      <FilterPanel
        filters={filters}
        filterTree={filterTree}
        onFilterChange={onFilterChange}
        onApply={onApplyFilters}
        onReset={onResetFilters}
        lastUpdated={summary?.lastUpdated}
        isLoading={isLoading}
      />

      {/* Breadcrumb Navigation & View Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <DrilldownBreadcrumb filters={filters} onSelectLevel={onSelectHierarchyLevel} />

        {/* View Switcher: 12-Month Matrix vs Standard Executive Statement */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'matrix'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table2 size={14} />
            <span>12-Month Matrix Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('statement')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'statement'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>Standard Report Statement (Tables 1-4)</span>
          </button>
        </div>
      </div>

      {/* Summary Highlight Banner */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">Total Year Revenue Realization</div>
              <div className="text-lg font-extrabold text-slate-900">
                {formatRupiah(summary.kpis.sales.actual, compactCurrency)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                Achievement: {formatPercentage(summary.kpis.sales.achievement)} vs Plan
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
              <Wallet size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">Total Operating Cost</div>
              <div className="text-lg font-extrabold text-slate-900">
                {formatRupiah(summary.kpis.cost.actual, compactCurrency)}
              </div>
              <div className="text-[10px] text-purple-700 font-medium">Direct + Indirect Cost Allocation</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">Gross Profit & Margin</div>
              <div className="text-lg font-extrabold text-emerald-600">
                {formatPercentage(summary.kpis.grossProfit.marginActual)}
              </div>
              <div className="text-[10px] text-slate-500">
                Profit: {formatRupiah(summary.kpis.grossProfit.actual, compactCurrency)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area based on Tab */}
      {activeTab === 'matrix' ? (
        <FinancialTable
          matrixData={matrixData}
          compactCurrency={compactCurrency}
          onToggleCompactCurrency={onToggleCompactCurrency}
          year={filters.year}
        />
      ) : (
        <ExecutiveReportView
          matrixData={matrixData}
          summary={summary}
          year={filters.year}
          compactCurrency={compactCurrency}
          onToggleCompactCurrency={onToggleCompactCurrency}
        />
      )}
    </div>
  );
};

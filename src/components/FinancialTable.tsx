import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Download, Search, Maximize2, Minimize2, Table2, Layers, HelpCircle } from 'lucide-react';
import { FinancialMatrixResponse } from '../types/dashboard.ts';
import { FinancialRow } from './FinancialRow.tsx';
import { exportMatrixToCSV } from '../utils/formatters.ts';

interface FinancialTableProps {
  matrixData: FinancialMatrixResponse | null;
  compactCurrency: boolean;
  onToggleCompactCurrency: () => void;
  year: number;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({
  matrixData,
  compactCurrency,
  onToggleCompactCurrency,
  year,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const expandAll = () => setCollapsedSections({});
  const collapseAll = () => {
    if (!matrixData) return;
    const allCollapsed: Record<string, boolean> = {};
    matrixData.sections.forEach((s) => (allCollapsed[s.key] = true));
    setCollapsedSections(allCollapsed);
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!matrixData) return [];
    if (!searchQuery.trim()) return matrixData.sections;

    const query = searchQuery.toLowerCase();
    return matrixData.sections
      .map((sec) => ({
        ...sec,
        rows: sec.rows.filter(
          (r) =>
            r.subcategory.toLowerCase().includes(query) ||
            r.category.toLowerCase().includes(query) ||
            r.metric.toLowerCase().includes(query)
        ),
      }))
      .filter((sec) => sec.rows.length > 0);
  }, [matrixData, searchQuery]);

  if (!matrixData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-sm">
        <Table2 className="mx-auto mb-2 text-slate-400" size={32} />
        <p>Loading financial performance matrix...</p>
      </div>
    );
  }

  const months = matrixData.monthNames;

  return (
    <div id="financial-matrix-card" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Table Toolbar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Table2 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Monthly Actual vs Budget Performance Breakdown
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
                FY {year}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Comprehensive 12-Month financial matrix across ALL, Direct Cost, and Indirect Cost categories
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter row (e.g. Sales, HR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-48 transition-all"
            />
          </div>

          {/* Compact Currency Toggle */}
          <button
            id="table-btn-toggle-currency"
            onClick={onToggleCompactCurrency}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              compactCurrency
                ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle between Compact (Billions/Millions) and Full Rupiah format"
          >
            {compactCurrency ? 'Format: Compact (B/M)' : 'Format: Full IDR'}
          </button>

          {/* Expand/Collapse All */}
          <button
            onClick={expandAll}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs shadow-2xs transition-colors"
            title="Expand All Sections"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={collapseAll}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs shadow-2xs transition-colors"
            title="Collapse All Sections"
          >
            <Minimize2 size={14} />
          </button>

          {/* CSV Export */}
          <button
            id="table-btn-export-csv"
            onClick={() => exportMatrixToCSV(matrixData.sections, year)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Table Wrapper */}
      <div className="overflow-x-auto max-h-[700px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-20 bg-slate-50 text-slate-800 text-xs shadow-xs border-b-2 border-slate-200">
            {/* Top Header Row (Category, Full Year, Months) */}
            <tr className="border-b border-slate-200">
              {/* Sticky Category Header */}
              <th
                rowSpan={2}
                className="sticky left-0 z-30 bg-slate-50 px-3.5 py-3 text-left font-bold text-slate-900 min-w-[220px] border-r-2 border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]"
              >
                Financial Category / Metric
              </th>

              {/* Full Year Summary Header (3 cols) */}
              <th
                colSpan={3}
                className="px-3 py-2 text-center font-bold bg-blue-50/70 text-blue-900 border-r-2 border-slate-200"
              >
                Full Year {year} (FY Aggregate)
              </th>

              {/* 12 Month Headers (3 cols each) */}
              {months.map((m) => (
                <th
                  key={m.month}
                  colSpan={3}
                  className="px-3 py-2 text-center font-bold bg-slate-50 text-slate-800 border-r border-slate-200"
                >
                  {m.name}
                </th>
              ))}
            </tr>

            {/* Sub-header Row (Actual | Budget | Ach %) */}
            <tr className="bg-slate-100/70 text-[11px] text-slate-600">
              {/* Full Year Sub-columns */}
              <th className="px-2.5 py-1.5 text-right border-r border-slate-200/80 font-bold text-slate-800">Actual</th>
              <th className="px-2.5 py-1.5 text-right border-r border-slate-200/80 font-medium">Budget</th>
              <th className="px-2 py-1.5 text-center border-r-2 border-slate-200 text-blue-700 font-bold">Ach %</th>

              {/* 12 Months Sub-columns */}
              {months.map((m) => (
                <React.Fragment key={`sub-${m.month}`}>
                  <th className="px-2.5 py-1.5 text-right border-r border-slate-200/80 font-bold text-slate-800">
                    Actual
                  </th>
                  <th className="px-2.5 py-1.5 text-right border-r border-slate-200/80 font-medium">Budget</th>
                  <th className="px-2 py-1.5 text-center border-r border-slate-200 text-blue-700 font-bold">
                    Ach %
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          {/* Table Body with Accordion Sections */}
          <tbody className="divide-y divide-slate-200">
            {filteredSections.map((section) => {
              const isCollapsed = !!collapsedSections[section.key];

              return (
                <React.Fragment key={section.key}>
                  {/* Accordion Section Title Row */}
                  <tr
                    onClick={() => toggleSection(section.key)}
                    className="bg-slate-100/90 hover:bg-slate-150 cursor-pointer border-t-2 border-b border-slate-200 select-none transition-colors"
                  >
                    <td
                      colSpan={1 + 3 + 12 * 3}
                      className="sticky left-0 z-10 bg-slate-100/90 px-4 py-2.5 font-bold text-slate-900 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight size={16} className="text-blue-600 shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-blue-600 shrink-0" />
                        )}
                        <span className="tracking-wide uppercase text-blue-900 font-bold">{section.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal ml-2">
                          ({section.rows.length} metrics - click to {isCollapsed ? 'expand' : 'collapse'})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Section Data Rows */}
                  {!isCollapsed &&
                    section.rows.map((row) => (
                      <FinancialRow
                        key={`${section.key}-${row.metric}`}
                        row={row}
                        compactCurrency={compactCurrency}
                      />
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Legend & Information */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-800">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] flex items-center justify-center font-bold">
              ↑
            </span>
            <span className="text-emerald-700 font-medium">Favorable Performance</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] flex items-center justify-center font-bold">
              ↓
            </span>
            <span className="text-rose-700 font-medium">Unfavorable Performance</span>
          </span>
        </div>

        <div className="text-slate-500">
          Showing 12-Month Financial Aggregation | Scroll horizontally to view all months (Jan - Dec)
        </div>
      </div>
    </div>
  );
};

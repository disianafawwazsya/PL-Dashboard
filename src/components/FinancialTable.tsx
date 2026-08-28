import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  Maximize2,
  Minimize2,
  Table2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FinancialMatrixResponse, MatrixRow } from '../types/dashboard.ts';
import { FinancialRow } from './FinancialRow.tsx';
import { exportMatrixToCSV } from '../utils/formatters.ts';

interface FinancialTableProps {
  matrixData: FinancialMatrixResponse | null;
  compactCurrency: boolean;
  onToggleCompactCurrency: () => void;
  year: number;
}

interface RowGroupItem {
  row: MatrixRow;
  isFirstInGroup: boolean;
  groupRowSpan: number;
  groupLabel: string;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({
  matrixData,
  compactCurrency,
  onToggleCompactCurrency,
  year,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAchievement, setShowAchievement] = useState<boolean>(true);

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
    matrixData.sections.forEach((s) => (allCollapsed[s.title] = true));
    setCollapsedSections(allCollapsed);
  };

  // Helper to compute contiguous row groups for rowspan
  const computeRowGroups = (rows: MatrixRow[]): RowGroupItem[] => {
    const result: RowGroupItem[] = [];
    let i = 0;
    while (i < rows.length) {
      const currentGroup =
        rows[i].groupLabel ||
        (rows[i].category === 'ALL'
          ? 'All'
          : rows[i].category === 'DIRECT_COST'
          ? 'Direct Cost'
          : 'Indirect Cost');
      let count = 0;
      while (
        i + count < rows.length &&
        (rows[i + count].groupLabel ||
          (rows[i + count].category === 'ALL'
            ? 'All'
            : rows[i + count].category === 'DIRECT_COST'
            ? 'Direct Cost'
            : 'Indirect Cost')) === currentGroup
      ) {
        count++;
      }
      for (let j = 0; j < count; j++) {
        result.push({
          row: rows[i + j],
          isFirstInGroup: j === 0,
          groupRowSpan: count,
          groupLabel: currentGroup,
        });
      }
      i += count;
    }
    return result;
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
            (r.groupLabel && r.groupLabel.toLowerCase().includes(query)) ||
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
  const colsPerPeriod = showAchievement ? 3 : 2;
  const totalTableColSpan = 2 + colsPerPeriod + 12 * colsPerPeriod;

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
              12-Month matrix with separated & merged Classifications (All, Direct Cost, Indirect Cost)
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
              className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-44 transition-all"
            />
          </div>

          {/* Toggle % Ach Column Visibility Button */}
          <button
            id="table-btn-toggle-ach"
            onClick={() => setShowAchievement((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${
              showAchievement
                ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
            title={showAchievement ? 'Hide % Ach columns in table' : 'Show % Ach columns in table'}
          >
            {showAchievement ? (
              <>
                <Eye size={13} className="text-blue-600" />
                <span>% Ach: Shown</span>
              </>
            ) : (
              <>
                <EyeOff size={13} className="text-slate-500" />
                <span>% Ach: Hidden</span>
              </>
            )}
          </button>

          {/* Compact Currency Toggle */}
          <button
            id="table-btn-toggle-currency"
            onClick={onToggleCompactCurrency}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors shadow-2xs ${
              compactCurrency
                ? 'bg-purple-50 border-purple-200 text-purple-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle between Compact (Billions/Millions) and Full Rupiah format"
          >
            {compactCurrency ? 'Format: Compact' : 'Format: Full IDR'}
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
      <div className="overflow-x-auto max-h-[720px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-30 bg-slate-50 text-slate-800 text-xs shadow-xs border-b-2 border-slate-200">
            {/* Top Header Row (Classification, Line Item, Full Year, Months) */}
            <tr className="border-b border-slate-200">
              {/* Sticky Column 1: Classification / Group Header */}
              <th
                rowSpan={2}
                className="sticky left-0 z-40 bg-slate-950 text-white px-3 py-3 text-center font-extrabold text-xs w-[130px] min-w-[130px] max-w-[130px] border-r border-slate-800 uppercase tracking-wider"
              >
                Classification
              </th>

              {/* Sticky Column 2: Line Item / Metric Header */}
              <th
                rowSpan={2}
                className="sticky left-[130px] z-40 bg-slate-50 text-slate-900 px-3.5 py-3 text-left font-bold text-xs w-[230px] min-w-[230px] border-r-2 border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]"
              >
                Line Item / Metric
              </th>

              {/* Full Year Summary Header */}
              <th
                colSpan={colsPerPeriod}
                className="px-3 py-2 text-center font-bold bg-blue-50/70 text-blue-900 border-r-2 border-slate-200"
              >
                Full Year {year}
              </th>

              {/* 12 Month Headers */}
              {months.map((m) => (
                <th
                  key={m.month}
                  colSpan={colsPerPeriod}
                  className="px-3 py-2 text-center font-bold bg-slate-50 text-slate-800 border-r border-slate-200"
                >
                  {m.name}
                </th>
              ))}
            </tr>

            {/* Sub-header Row (Actual | Budget | [Ach %]) */}
            <tr className="bg-slate-100/70 text-[11px] text-slate-600">
              {/* Full Year Sub-columns */}
              <th className="px-2.5 py-1.5 text-right border-r border-slate-200/80 font-bold text-slate-800">Actual</th>
              <th
                className={`px-2.5 py-1.5 text-right font-medium ${
                  showAchievement ? 'border-r border-slate-200/80' : 'border-r-2 border-slate-200'
                }`}
              >
                Budget
              </th>
              {showAchievement && (
                <th className="px-2 py-1.5 text-center border-r-2 border-slate-200 text-blue-700 font-bold">Ach %</th>
              )}

              {/* 12 Months Sub-columns */}
              {months.map((m) => (
                <React.Fragment key={`sub-${m.month}`}>
                  <th className="px-2.5 py-1.5 text-right border-r border-slate-200/80 font-bold text-slate-800">
                    Actual
                  </th>
                  <th
                    className={`px-2.5 py-1.5 text-right font-medium ${
                      showAchievement ? 'border-r border-slate-200/80' : 'border-r border-slate-200'
                    }`}
                  >
                    Budget
                  </th>
                  {showAchievement && (
                    <th className="px-2 py-1.5 text-center border-r border-slate-200 text-blue-700 font-bold">
                      Ach %
                    </th>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>

          {/* Table Body with Accordion Sections */}
          <tbody className="divide-y divide-slate-200">
            {filteredSections.map((section) => {
              const isCollapsed = !!collapsedSections[section.title];
              const groupedRows = computeRowGroups(section.rows);

              return (
                <React.Fragment key={section.title}>
                  {/* Accordion Section Title Row */}
                  <tr
                    onClick={() => toggleSection(section.title)}
                    className="bg-slate-100/90 hover:bg-slate-150 cursor-pointer border-t-2 border-b border-slate-200 select-none transition-colors"
                  >
                    <td
                      colSpan={totalTableColSpan}
                      className="sticky left-0 z-20 bg-slate-100/95 px-4 py-2.5 font-bold text-slate-900 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight size={16} className="text-blue-600 shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-blue-600 shrink-0" />
                        )}
                        <span className="tracking-wide uppercase text-blue-900 font-bold">{section.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal ml-2">
                          ({section.rows.length} line items - click to {isCollapsed ? 'expand' : 'collapse'})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Section Data Rows with Merged Groups */}
                  {!isCollapsed &&
                    groupedRows.map((item) => (
                      <FinancialRow
                        key={`${section.title}-${item.row.metric}-${item.row.subcategory}-${item.groupLabel}`}
                        row={item.row}
                        compactCurrency={compactCurrency}
                        showAchievement={showAchievement}
                        isFirstInGroup={item.isFirstInGroup}
                        groupRowSpan={item.groupRowSpan}
                        groupLabel={item.groupLabel}
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
          <span className="font-bold text-slate-800">Display Status:</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${showAchievement ? 'bg-blue-500' : 'bg-slate-300'}`}
            ></span>
            <span>% Ach Column: {showAchievement ? 'Visible' : 'Hidden'}</span>
          </span>
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
          Showing 12-Month Financial Aggregation | Scroll horizontally to inspect all columns
        </div>
      </div>
    </div>
  );
};

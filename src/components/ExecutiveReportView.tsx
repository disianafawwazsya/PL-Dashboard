import React from 'react';
import { FinancialMatrixResponse, DashboardSummary } from '../types/dashboard.ts';
import { formatRupiah, formatPercentage } from '../utils/formatters.ts';
import { FileSpreadsheet } from 'lucide-react';

interface ExecutiveReportViewProps {
  matrixData: FinancialMatrixResponse | null;
  summary: DashboardSummary | null;
  year: number;
  compactCurrency: boolean;
  onToggleCompactCurrency: () => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  matrixData,
  summary,
  year,
  compactCurrency,
  onToggleCompactCurrency,
}) => {
  if (!matrixData || !summary) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-sm">
        <FileSpreadsheet className="mx-auto mb-2 text-slate-400" size={32} />
        <p>Generating Standard Executive Financial Statement...</p>
      </div>
    );
  }

  // Extract sections from matrixData
  const sec1 = matrixData.sections[0]?.rows || []; // Summary
  const sec2 = matrixData.sections[1]?.rows || []; // Overview
  const sec3 = matrixData.sections[2]?.rows || []; // Direct Cost Detail
  const sec4 = matrixData.sections[3]?.rows || []; // Indirect Cost Detail

  const findRow = (rows: any[], metricOrSub: string) => {
    return rows.find(
      (r) =>
        r.metric === metricOrSub ||
        r.subcategory.toLowerCase() === metricOrSub.toLowerCase() ||
        r.subcategory.toLowerCase().includes(metricOrSub.toLowerCase())
    );
  };

  const getAmount = (row: any) => {
    if (!row) return { actual: 0, budget: 0, ach: 0 };
    return {
      actual: row.fullYear?.actual || 0,
      budget: row.fullYear?.budget || 0,
      ach: row.fullYear?.achievement || 0,
    };
  };

  // 1. Table 1 Data
  const t1_all_sales = getAmount(findRow(sec1, 'sales'));
  const t1_all_cost = getAmount(findRow(sec1, 'total_cost'));
  const t1_all_profit = getAmount(findRow(sec1, 'gross_profit'));

  const t1_dir_sales = getAmount(findRow(sec1, 'direct_sales'));
  const t1_dir_cost = getAmount(findRow(sec1, 'total_direct_cost'));
  const t1_dir_profit = getAmount(findRow(sec1, 'direct_profit'));

  const t1_ind_cost = getAmount(findRow(sec1, 'total_indirect_cost'));

  // 2. Table 2 Data
  const t2_all_sales = getAmount(findRow(sec2, 'sales'));
  const t2_all_hr = getAmount(findRow(sec2, 'hr_cost'));
  const t2_all_facility = getAmount(findRow(sec2, 'facility_cost'));
  const t2_all_other = getAmount(findRow(sec2, 'other_cost'));
  const t2_all_total = getAmount(findRow(sec2, 'total_cost'));
  const t2_all_gp = getAmount(findRow(sec2, 'gross_profit_ov'));
  const t2_all_gpPct = findRow(sec2, '%gp')?.fullYear?.actual || 20;

  const t2_dir_sales = getAmount(findRow(sec2, 'direct_sales'));
  const t2_dir_hr = getAmount(findRow(sec2, 'direct_hr_cost'));
  const t2_dir_facility = getAmount(findRow(sec2, 'direct_facility_cost'));
  const t2_dir_other = getAmount(findRow(sec2, 'direct_other_cost'));
  const t2_dir_total = getAmount(findRow(sec2, 'total_direct_cost'));
  const t2_dir_dp = getAmount(findRow(sec2, 'direct_profit_ov'));
  const t2_dir_dpPct = findRow(sec2, '%dp')?.fullYear?.actual || 25;

  const t2_ind_hr = getAmount(findRow(sec2, 'indirect_hr_cost'));
  const t2_ind_facility = getAmount(findRow(sec2, 'indirect_facility_cost'));
  const t2_ind_other = getAmount(findRow(sec2, 'indirect_other_cost'));
  const t2_ind_total = getAmount(findRow(sec2, 'total_indirect_cost'));

  // 3. Table 3 Data (Direct Cost Items)
  const t3_sales = findRow(sec3, 'direct_sales');
  const t3_hr_rows = sec3.filter((r) => r.groupLabel === 'HR Cost' || r.metric.startsWith('direct_hr_'));
  const t3_facility_rows = sec3.filter((r) => r.groupLabel === 'Facility Cost' || r.metric.startsWith('direct_facility_'));
  const t3_others_rows = sec3.filter((r) => r.groupLabel === 'Others Cost' || r.metric.startsWith('direct_others_'));

  // 4. Table 4 Data (Indirect Cost Items)
  const t4_hr_rows = sec4.filter((r) => r.groupLabel === 'HR Cost' || r.metric.startsWith('indirect_hr_'));
  const t4_facility_rows = sec4.filter((r) => r.groupLabel === 'Facility Cost' || r.metric.startsWith('indirect_facility_'));
  const t4_others_rows = sec4.filter((r) => r.groupLabel === 'Others Cost' || r.metric.startsWith('indirect_others_'));

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 text-white shadow-xs">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Standard Financial Performance Report
              <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-slate-100 text-slate-800 border border-slate-300">
                FY {year}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Formatted according to standard enterprise reporting: High-Level Summary, Financial Overview, Direct Cost Detail & Indirect Cost Detail
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompactCurrency}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            {compactCurrency ? 'Format: Compact' : 'Format: Full IDR'}
          </button>
        </div>
      </div>

      {/* Grid of Top 2 Summary Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ========================================== */}
        {/* TABLE 1: HIGH-LEVEL EXECUTIVE SUMMARY */}
        {/* ========================================== */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>1. High Level Executive Summary</span>
            </div>
            <span className="font-mono text-slate-200">{year}</span>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold">
                <th className="px-4 py-2.5 bg-slate-950 text-white text-center border-r border-slate-800 w-36 uppercase tracking-wider">Classification</th>
                <th className="px-4 py-2.5 border-r border-slate-300">Metric</th>
                <th className="px-4 py-2.5 text-right">Actual Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {/* All Block */}
              <tr>
                <td rowSpan={3} className="px-4 py-3 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  All
                </td>
                <td className="px-4 py-2 border-r border-slate-200 text-slate-800">Sales</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                  {formatRupiah(t1_all_sales.actual, compactCurrency)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-r border-slate-200 text-slate-800">Cost</td>
                <td className="px-4 py-2 text-right font-mono font-medium text-slate-700">
                  {formatRupiah(t1_all_cost.actual, compactCurrency)}
                </td>
              </tr>
              <tr className="bg-blue-50/40">
                <td className="px-4 py-2 border-r border-slate-200 font-bold text-blue-900">Profit</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-blue-800">
                  {formatRupiah(t1_all_profit.actual, compactCurrency)}
                </td>
              </tr>

              {/* Direct Cost Block */}
              <tr className="border-t-2 border-slate-300">
                <td rowSpan={3} className="px-4 py-3 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  Direct Cost
                </td>
                <td className="px-4 py-2 border-r border-slate-200 text-slate-800">Sales</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                  {formatRupiah(t1_dir_sales.actual, compactCurrency)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-r border-slate-200 text-slate-800">Cost</td>
                <td className="px-4 py-2 text-right font-mono font-medium text-slate-700">
                  {formatRupiah(t1_dir_cost.actual, compactCurrency)}
                </td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="px-4 py-2 border-r border-slate-200 font-bold text-emerald-900">Profit</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-emerald-800">
                  {formatRupiah(t1_dir_profit.actual, compactCurrency)}
                </td>
              </tr>

              {/* Indirect Cost Block */}
              <tr className="border-t-2 border-slate-300">
                <td className="px-4 py-2.5 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  Indirect Cost
                </td>
                <td className="px-4 py-2 border-r border-slate-200 text-slate-800">Cost</td>
                <td className="px-4 py-2 text-right font-mono font-medium text-purple-900">
                  {formatRupiah(t1_ind_cost.actual, compactCurrency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========================================== */}
        {/* TABLE 2: STANDARD FINANCIAL OVERVIEW */}
        {/* ========================================== */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>2. Standard Financial Overview & Margins</span>
            </div>
            <span className="font-mono text-slate-200">{year}</span>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold">
                <th className="px-4 py-2.5 bg-slate-950 text-white text-center border-r border-slate-800 w-36 uppercase tracking-wider">Classification</th>
                <th className="px-4 py-2.5 border-r border-slate-300">Cost & Margin Metric</th>
                <th className="px-4 py-2.5 text-right">Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {/* All Block */}
              <tr>
                <td rowSpan={7} className="px-4 py-3 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  All
                </td>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-800">Sales</td>
                <td className="px-4 py-1.5 text-right font-mono font-bold text-slate-900">{formatRupiah(t2_all_sales.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">HR Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_all_hr.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">Facility Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_all_facility.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">Other Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_all_other.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-900">Total Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-900">{formatRupiah(t2_all_total.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-blue-50/50 font-bold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-blue-900">GP (Gross Profit)</td>
                <td className="px-4 py-1.5 text-right font-mono text-blue-900">{formatRupiah(t2_all_gp.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-blue-50/70 font-extrabold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-blue-950">%GP</td>
                <td className="px-4 py-1.5 text-right font-mono text-blue-950">{formatPercentage(t2_all_gpPct)}</td>
              </tr>

              {/* Direct Cost Block */}
              <tr className="border-t-2 border-slate-300">
                <td rowSpan={7} className="px-4 py-3 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  Direct Cost
                </td>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-800">Sales</td>
                <td className="px-4 py-1.5 text-right font-mono font-bold text-slate-900">{formatRupiah(t2_dir_sales.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">HR Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_dir_hr.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">Facility Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_dir_facility.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">Other Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_dir_other.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-900">Total Cost (Direct Cost)</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-900">{formatRupiah(t2_dir_total.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-emerald-50/50 font-bold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-emerald-900">DP (Direct Profit)</td>
                <td className="px-4 py-1.5 text-right font-mono text-emerald-900">{formatRupiah(t2_dir_dp.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-emerald-50/70 font-extrabold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-emerald-950">%DP</td>
                <td className="px-4 py-1.5 text-right font-mono text-emerald-950">{formatPercentage(t2_dir_dpPct)}</td>
              </tr>

              {/* Indirect Cost Block */}
              <tr className="border-t-2 border-slate-300">
                <td rowSpan={4} className="px-4 py-3 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  Indirect Cost
                </td>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">HR Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_ind_hr.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">Facility Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_ind_facility.actual, compactCurrency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">Other Cost</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-700">{formatRupiah(t2_ind_other.actual, compactCurrency)}</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="px-4 py-1.5 border-r border-slate-200 text-slate-900">Total Cost (Indirect Cost)</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-900">{formatRupiah(t2_ind_total.actual, compactCurrency)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* TABLE 3: DETAILED DIRECT COST BREAKDOWN */}
      {/* ========================================== */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between font-bold text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>3. Detailed Category: Direct Cost</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-normal">Direct Project Delivery</span>
            <span className="font-mono text-slate-200">{year}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                <th className="px-4 py-2.5 bg-slate-950 text-white text-center border-r border-slate-800 w-44 uppercase tracking-wider">Classification</th>
                <th className="px-4 py-2.5 border-r border-slate-300">Direct Cost Line Item</th>
                <th className="px-4 py-2.5 text-right">Realization (FY {year})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {/* Sales Row */}
              <tr className="bg-blue-50/40 font-bold">
                <td className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle">
                  Direct Cost
                </td>
                <td className="px-4 py-2 border-r border-slate-200 text-blue-900 font-bold">Sales</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-blue-900">
                  {formatRupiah(t3_sales?.fullYear?.actual || 0, compactCurrency)}
                </td>
              </tr>

              {/* HR Cost (15 items) */}
              {t3_hr_rows.map((row, idx) => (
                <tr key={`t3-hr-${row.metric}`} className="hover:bg-slate-50">
                  {idx === 0 && (
                    <td
                      rowSpan={t3_hr_rows.length}
                      className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle"
                    >
                      HR Cost
                    </td>
                  )}
                  <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">
                    {row.subcategory.replace('HR Cost: ', '')}
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-800">
                    {row.fullYear?.actual === 0 ? 'Rp -' : formatRupiah(row.fullYear?.actual, compactCurrency)}
                  </td>
                </tr>
              ))}

              {/* Facility Cost (9 items) */}
              {t3_facility_rows.map((row, idx) => (
                <tr key={`t3-fac-${row.metric}`} className="hover:bg-slate-50">
                  {idx === 0 && (
                    <td
                      rowSpan={t3_facility_rows.length}
                      className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle"
                    >
                      Facility Cost
                    </td>
                  )}
                  <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">
                    {row.subcategory.replace('Facility Cost: ', '')}
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-800">
                    {row.fullYear?.actual === 0 ? 'Rp -' : formatRupiah(row.fullYear?.actual, compactCurrency)}
                  </td>
                </tr>
              ))}

              {/* Others Cost (18 items) */}
              {t3_others_rows.map((row, idx) => (
                <tr key={`t3-oth-${row.metric}`} className="hover:bg-slate-50">
                  {idx === 0 && (
                    <td
                      rowSpan={t3_others_rows.length}
                      className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle"
                    >
                      Others Cost
                    </td>
                  )}
                  <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">
                    {row.subcategory.replace('Others Cost: ', '')}
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-800">
                    {row.fullYear?.actual === 0 ? 'Rp -' : formatRupiah(row.fullYear?.actual, compactCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* TABLE 4: DETAILED INDIRECT COST BREAKDOWN */}
      {/* ========================================== */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between font-bold text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>4. Detailed Category: Indirect Cost</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-normal">Overhead & Support Center</span>
            <span className="font-mono text-slate-200">{year}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                <th className="px-4 py-2.5 bg-slate-950 text-white text-center border-r border-slate-800 w-44 uppercase tracking-wider">Classification</th>
                <th className="px-4 py-2.5 border-r border-slate-300">Indirect Cost Line Item</th>
                <th className="px-4 py-2.5 text-right">Realization (FY {year})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {/* HR Cost (15 items) */}
              {t4_hr_rows.map((row, idx) => (
                <tr key={`t4-hr-${row.metric}`} className="hover:bg-slate-50">
                  {idx === 0 && (
                    <td
                      rowSpan={t4_hr_rows.length}
                      className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle"
                    >
                      HR Cost
                    </td>
                  )}
                  <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">
                    {row.subcategory.replace('HR Cost: ', '')}
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-800">
                    {row.fullYear?.actual === 0 ? 'Rp -' : formatRupiah(row.fullYear?.actual, compactCurrency)}
                  </td>
                </tr>
              ))}

              {/* Facility Cost (9 items) */}
              {t4_facility_rows.map((row, idx) => (
                <tr key={`t4-fac-${row.metric}`} className="hover:bg-slate-50">
                  {idx === 0 && (
                    <td
                      rowSpan={t4_facility_rows.length}
                      className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle"
                    >
                      Facility Cost
                    </td>
                  )}
                  <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">
                    {row.subcategory.replace('Facility Cost: ', '')}
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-800">
                    {row.fullYear?.actual === 0 ? 'Rp -' : formatRupiah(row.fullYear?.actual, compactCurrency)}
                  </td>
                </tr>
              ))}

              {/* Others Cost (18 items) */}
              {t4_others_rows.map((row, idx) => (
                <tr key={`t4-oth-${row.metric}`} className="hover:bg-slate-50">
                  {idx === 0 && (
                    <td
                      rowSpan={t4_others_rows.length}
                      className="px-4 py-2 bg-slate-950 text-white font-extrabold text-center border-r border-slate-800 border-b border-slate-800 align-middle"
                    >
                      Others Cost
                    </td>
                  )}
                  <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700">
                    {row.subcategory.replace('Others Cost: ', '')}
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-800">
                    {row.fullYear?.actual === 0 ? 'Rp -' : formatRupiah(row.fullYear?.actual, compactCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

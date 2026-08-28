import React from 'react';
import { MatrixRow } from '../types/dashboard.ts';
import { formatRupiah, formatPercentage, evaluateAchievement } from '../utils/formatters.ts';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface FinancialRowProps {
  row: MatrixRow;
  compactCurrency: boolean;
  showAchievement?: boolean;
  isFirstInGroup?: boolean;
  groupRowSpan?: number;
  groupLabel?: string;
}

export const FinancialRow: React.FC<FinancialRowProps> = ({
  row,
  compactCurrency,
  showAchievement = true,
  isFirstInGroup = true,
  groupRowSpan = 1,
  groupLabel = '',
}) => {
  const isHeaderMetric =
    row.subcategory === 'Sales' ||
    row.subcategory === 'Total Cost' ||
    row.subcategory.includes('Gross Profit') ||
    row.subcategory.includes('Direct Profit') ||
    row.subcategory.includes('Total Cost (Direct Cost)') ||
    row.subcategory.includes('Total Cost (Indirect Cost)') ||
    row.subcategory === '%GP' ||
    row.subcategory === '%DP';

  const rowBgClass = isHeaderMetric
    ? 'bg-slate-50/95 font-semibold text-slate-900 hover:bg-slate-100/90'
    : 'bg-white text-slate-700 hover:bg-slate-50/80 text-xs';

  const renderCell = (
    data: { actual: number; budget: number; achievement: number; isFavorable: boolean },
    cellKey: string
  ) => {
    const isPct = row.isPercentage;
    const { badgeBg, badgeText, arrow } = evaluateAchievement(data.achievement, row.direction);

    return (
      <React.Fragment key={cellKey}>
        {/* Actual Amount */}
        <td
          className="px-2.5 py-2 text-right font-mono text-slate-800 whitespace-nowrap border-r border-slate-200/80"
          title={`Full Actual: ${formatRupiah(data.actual, false)}`}
        >
          {isPct ? formatPercentage(data.actual) : formatRupiah(data.actual, compactCurrency)}
        </td>

        {/* Budget Amount */}
        <td
          className={`px-2.5 py-2 text-right font-mono text-slate-500 whitespace-nowrap ${
            showAchievement ? 'border-r border-slate-200/80' : 'border-r-2 border-slate-200'
          }`}
          title={`Full Budget: ${formatRupiah(data.budget, false)}`}
        >
          {isPct ? formatPercentage(data.budget) : formatRupiah(data.budget, compactCurrency)}
        </td>

        {/* Achievement % (Conditional) */}
        {showAchievement && (
          <td className="px-2 py-2 text-center whitespace-nowrap border-r border-slate-200">
            <span
              className={`inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${badgeBg} ${badgeText}`}
              title={`Ach: ${data.achievement.toFixed(2)}% | Variance: ${formatRupiah(data.actual - data.budget, true)}`}
            >
              {arrow === 'up' ? (
                <ArrowUpRight size={11} className="shrink-0 stroke-[2.5]" />
              ) : arrow === 'down' ? (
                <ArrowDownRight size={11} className="shrink-0 stroke-[2.5]" />
              ) : (
                <Minus size={11} className="shrink-0" />
              )}
              {formatPercentage(data.achievement)}
            </span>
          </td>
        )}
      </React.Fragment>
    );
  };

  const labelDisplay = groupLabel || row.groupLabel || (row.category === 'ALL' ? 'All' : row.category === 'DIRECT_COST' ? 'Direct Cost' : 'Indirect Cost');

  return (
    <tr className={`border-b border-slate-200 transition-colors group ${rowBgClass}`}>
      {/* 1. Merged Classification Column (Solid Dark Header exactly as requested) */}
      {isFirstInGroup && (
        <td
          rowSpan={groupRowSpan}
          className="sticky left-0 z-10 bg-slate-950 text-white font-extrabold text-xs text-center align-middle px-3 py-2 border-r border-slate-800 border-b border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.08)] select-none w-[130px] min-w-[130px] max-w-[130px]"
        >
          <div className="flex flex-col items-center justify-center font-bold tracking-wide leading-tight">
            <span className="text-white text-xs font-bold">{labelDisplay}</span>
          </div>
        </td>
      )}

      {/* 2. Sticky Metric Label Column */}
      <td className="sticky left-[130px] z-10 bg-inherit px-3.5 py-2 whitespace-nowrap border-r-2 border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.04)] w-[230px] min-w-[230px]">
        <div className="flex items-center justify-between gap-2">
          <span className={`truncate ${isHeaderMetric ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
            {row.subcategory}
          </span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded border font-mono font-medium ${
              row.direction === 'higher_is_better'
                ? 'border-blue-200 text-blue-700 bg-blue-50'
                : 'border-purple-200 text-purple-700 bg-purple-50'
            }`}
            title={row.direction === 'higher_is_better' ? 'Target: Higher is better' : 'Target: Lower is better'}
          >
            {row.direction === 'higher_is_better' ? '↑ High' : '↓ Low'}
          </span>
        </div>
      </td>

      {/* Full Year Summary */}
      {renderCell(row.fullYear, 'full-year')}

      {/* 12 Months */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
        const monthData = row.months[m] || { actual: 0, budget: 0, achievement: 0, isFavorable: true };
        return renderCell(monthData, `month-${m}`);
      })}
    </tr>
  );
};

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Layers, Wallet, Percent, ArrowUpRight, ArrowDownRight, PieChart, ShieldCheck } from 'lucide-react';
import { DashboardSummary } from '../types/dashboard.ts';
import { formatRupiah, formatPercentage, formatVariance } from '../utils/formatters.ts';
import { AchievementBadge } from './AchievementBadge.tsx';

interface KPICardsProps {
  summary: DashboardSummary | null;
  compactCurrency?: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ summary, compactCurrency = true }) => {
  if (!summary) return null;

  const { sales, cost, grossProfit, directProfit, directCost, indirectCost } = summary.kpis;

  return (
    <div id="kpi-summary-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TOTAL SALES */}
      <div
        id="kpi-card-sales"
        className="group relative bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <DollarSign size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500">Total Sales</span>
              <p className="text-[11px] text-slate-400">Revenue Performance</p>
            </div>
          </div>
          <AchievementBadge achievement={sales.achievement} direction={sales.direction} size="md" />
        </div>

        {/* Current Actual Value */}
        <div className="mb-3">
          <div
            className="text-2xl font-extrabold text-slate-900 tracking-tight cursor-help"
            title={`Full Actual: ${formatRupiah(sales.actual, false)}`}
          >
            {formatRupiah(sales.actual, compactCurrency)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>
              Target: <strong className="text-slate-700 font-mono">{formatRupiah(sales.budget, compactCurrency)}</strong>
            </span>
            <span
              className={`font-semibold ${sales.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              title="Variance vs Target"
            >
              {formatVariance(sales.variance, compactCurrency)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              sales.achievement >= 100 ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(sales.achievement, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>Target Attainment</span>
          <span className="font-mono font-semibold text-slate-700">{sales.achievement.toFixed(2)}%</span>
        </div>
      </div>

      {/* 2. TOTAL COST */}
      <div
        id="kpi-card-cost"
        className="group relative bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-600">
              <Wallet size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500">Total Cost</span>
              <p className="text-[11px] text-slate-400">Direct + Indirect</p>
            </div>
          </div>
          <AchievementBadge achievement={cost.achievement} direction={cost.direction} size="md" />
        </div>

        {/* Current Actual Value */}
        <div className="mb-3">
          <div
            className="text-2xl font-extrabold text-slate-900 tracking-tight cursor-help"
            title={`Full Actual: ${formatRupiah(cost.actual, false)}`}
          >
            {formatRupiah(cost.actual, compactCurrency)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>
              Budget: <strong className="text-slate-700 font-mono">{formatRupiah(cost.budget, compactCurrency)}</strong>
            </span>
            <span
              className={`font-semibold ${cost.variance <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              title="Cost Variance (Negative is favorable)"
            >
              {formatVariance(cost.variance, compactCurrency)}
            </span>
          </div>
        </div>

        {/* Mini Cost Breakdown Pills */}
        {cost.breakdown && (
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-[10px]">
            <div className="bg-slate-50 rounded-lg px-1.5 py-1 text-center border border-slate-200">
              <div className="text-slate-500 font-medium">HR</div>
              <div className="font-semibold text-slate-800">{formatRupiah(cost.breakdown.hrCost.actual, true)}</div>
            </div>
            <div className="bg-slate-50 rounded-lg px-1.5 py-1 text-center border border-slate-200">
              <div className="text-slate-500 font-medium">Facility</div>
              <div className="font-semibold text-slate-800">{formatRupiah(cost.breakdown.facilityCost.actual, true)}</div>
            </div>
            <div className="bg-slate-50 rounded-lg px-1.5 py-1 text-center border border-slate-200">
              <div className="text-slate-500 font-medium">Other</div>
              <div className="font-semibold text-slate-800">{formatRupiah(cost.breakdown.otherCost.actual, true)}</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. GROSS PROFIT (GP) */}
      <div
        id="kpi-card-gross-profit"
        className="group relative bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500">Gross Profit (GP)</span>
              <p className="text-[11px] text-slate-400">Sales - Total Cost</p>
            </div>
          </div>
          <AchievementBadge achievement={grossProfit.achievement} direction={grossProfit.direction} size="md" />
        </div>

        {/* Current Actual Value */}
        <div className="mb-3">
          <div
            className="text-2xl font-extrabold text-slate-900 tracking-tight cursor-help"
            title={`Full Actual: ${formatRupiah(grossProfit.actual, false)}`}
          >
            {formatRupiah(grossProfit.actual, compactCurrency)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>
              Target: <strong className="text-slate-700 font-mono">{formatRupiah(grossProfit.budget, compactCurrency)}</strong>
            </span>
            <span
              className={`font-semibold ${grossProfit.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              title="Profit Variance"
            >
              {formatVariance(grossProfit.variance, compactCurrency)}
            </span>
          </div>
        </div>

        {/* GP Margin Indicator */}
        <div className="flex items-center justify-between bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs">
          <span className="text-slate-600 font-medium">GP Margin</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-emerald-600">{formatPercentage(grossProfit.marginActual)}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (Plan: {formatPercentage(grossProfit.marginBudget)})
            </span>
          </div>
        </div>
      </div>

      {/* 4. DIRECT PROFIT (DP) & DIRECT COST */}
      <div
        id="kpi-card-direct-profit"
        className="group relative bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500">Direct Profit (DP)</span>
              <p className="text-[11px] text-slate-400">Sales - Direct Cost</p>
            </div>
          </div>
          <AchievementBadge achievement={directProfit.achievement} direction={directProfit.direction} size="md" />
        </div>

        {/* Current Actual Value */}
        <div className="mb-3">
          <div
            className="text-2xl font-extrabold text-slate-900 tracking-tight cursor-help"
            title={`Full Actual: ${formatRupiah(directProfit.actual, false)}`}
          >
            {formatRupiah(directProfit.actual, compactCurrency)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>
              Target: <strong className="text-slate-700 font-mono">{formatRupiah(directProfit.budget, compactCurrency)}</strong>
            </span>
            <span
              className={`font-semibold ${directProfit.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              title="Direct Profit Variance"
            >
              {formatVariance(directProfit.variance, compactCurrency)}
            </span>
          </div>
        </div>

        {/* Direct Cost & Margin Info */}
        <div className="flex items-center justify-between bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs">
          <span className="text-slate-600 font-medium">DP Margin</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-cyan-600">{formatPercentage(directProfit.marginActual)}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (DC: {formatRupiah(directCost.actual, true)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

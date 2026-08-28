import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Wallet, Activity, CheckCircle2 } from 'lucide-react';
import { MonthlyTrendItem } from '../types/dashboard.ts';
import { formatRupiah, formatPercentage } from '../utils/formatters.ts';

interface MonthlyChartsProps {
  data: MonthlyTrendItem[];
  year: number;
}

export const MonthlyCharts: React.FC<MonthlyChartsProps> = ({ data, year }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'cost' | 'profit' | 'achievement'>('all');

  // Custom Tooltip for Currency
  const CurrencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => {
            const isPct = entry.name.toLowerCase().includes('%') || entry.name.toLowerCase().includes('ach') || entry.name.toLowerCase().includes('margin');
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4 my-1">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {isPct ? formatPercentage(entry.value) : formatRupiah(entry.value, true)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Achievement %
  const AchievementTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 my-1">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {formatPercentage(entry.value)}
              </span>
            </div>
          ))}
          <div className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Target Benchmark:</span>
            <span className="font-mono text-emerald-600 font-bold">100.00%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="monthly-analytics-charts" className="space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Performance Analytics</h3>
            <p className="text-[11px] text-slate-500">12-Month Actual vs Plan trajectory & attainment analysis</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            id="tab-chart-all"
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'all' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 4 Charts
          </button>
          <button
            id="tab-chart-sales"
            onClick={() => setActiveTab('sales')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'sales' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sales
          </button>
          <button
            id="tab-chart-cost"
            onClick={() => setActiveTab('cost')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'cost' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cost
          </button>
          <button
            id="tab-chart-profit"
            onClick={() => setActiveTab('profit')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'profit' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profit
          </button>
          <button
            id="tab-chart-achievement"
            onClick={() => setActiveTab('achievement')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'achievement' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Achievement %
          </button>
        </div>
      </div>

      {/* Grid of charts */}
      <div className={`grid gap-4 ${activeTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* A. Sales Actual vs Budget */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div id="chart-sales-container" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800">A. Sales: Actual vs Budget (IDR)</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">FY {year}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="shortMonth" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${(v / 1_000_000_000).toFixed(0)}B`}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar dataKey="salesActual" name="Actual Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="salesBudget" name="Budget Sales" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* B. Cost Actual vs Budget */}
        {(activeTab === 'all' || activeTab === 'cost') && (
          <div id="chart-cost-container" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-purple-600" />
                <h4 className="text-xs font-bold text-slate-800">B. Cost: Actual vs Budget (IDR)</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Lower is better</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="shortMonth" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${(v / 1_000_000_000).toFixed(0)}B`}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar dataKey="costActual" name="Actual Cost" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costBudget" name="Budget Cost" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* C. Profit Actual vs Budget & Margin */}
        {(activeTab === 'all' || activeTab === 'profit') && (
          <div id="chart-profit-container" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-800">C. Gross Profit & GP Margin %</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Bars: Profit | Line: Margin %</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="shortMonth" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    yAxisId="left"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${(v / 1_000_000_000).toFixed(0)}B`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#059669"
                    tick={{ fontSize: 11, fill: '#059669' }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 60]}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar yAxisId="left" dataKey="profitActual" name="Actual Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="profitBudget" name="Budget Profit" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gpMarginActual"
                    name="GP Margin %"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#059669' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* D. Achievement Trend % */}
        {(activeTab === 'all' || activeTab === 'achievement') && (
          <div id="chart-achievement-container" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-cyan-600" />
                <h4 className="text-xs font-bold text-slate-800">D. Achievement Trend % (Target = 100%)</h4>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono font-medium">100% Target Reference</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="shortMonth" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    domain={[70, 130]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<AchievementTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '100% Target', fill: '#059669', fontSize: 10, position: 'top' }} />
                  <Line
                    type="monotone"
                    dataKey="salesAch"
                    name="Sales Ach %"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profitAch"
                    name="Profit Ach %"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="costAch"
                    name="Cost Ach %"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

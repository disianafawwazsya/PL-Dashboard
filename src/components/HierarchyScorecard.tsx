import React from 'react';
import { Building2, ArrowRight, TrendingUp, Wallet, DollarSign, Award } from 'lucide-react';
import { GroupScorecard } from '../types/dashboard.ts';
import { formatRupiah, formatPercentage } from '../utils/formatters.ts';
import { AchievementBadge } from './AchievementBadge.tsx';

interface HierarchyScorecardProps {
  scorecards: GroupScorecard[];
  onSelectGroup: (groupName: string) => void;
  compactCurrency: boolean;
}

export const HierarchyScorecard: React.FC<HierarchyScorecardProps> = ({
  scorecards,
  onSelectGroup,
  compactCurrency,
}) => {
  if (!scorecards || scorecards.length === 0) return null;

  return (
    <div id="hierarchy-scorecard-section" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Building2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Business Group Performance Scorecard</h3>
            <p className="text-[11px] text-slate-500">Comparative financial delivery across organizational divisions</p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">Click any group card to drill down</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scorecards.map((sc, idx) => (
          <div
            key={sc.groupName}
            onClick={() => onSelectGroup(sc.groupName)}
            className="group cursor-pointer bg-slate-50/70 hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 transition-all shadow-xs hover:shadow-md relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center border border-blue-200">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sc.groupName}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">GP Margin: {formatPercentage(sc.margin)}</span>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Metrics Grid */}
            <div className="space-y-2 text-xs">
              {/* Sales */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <DollarSign size={12} className="text-blue-600" /> Sales:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{formatRupiah(sc.sales.actual, compactCurrency)}</span>
                  <AchievementBadge achievement={sc.sales.ach} direction="higher_is_better" size="sm" />
                </div>
              </div>

              {/* Cost */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Wallet size={12} className="text-purple-600" /> Cost:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{formatRupiah(sc.cost.actual, compactCurrency)}</span>
                  <AchievementBadge achievement={sc.cost.ach} direction="lower_is_better" size="sm" />
                </div>
              </div>

              {/* Profit */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-600" /> Profit:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{formatRupiah(sc.profit.actual, compactCurrency)}</span>
                  <AchievementBadge achievement={sc.profit.ach} direction="higher_is_better" size="sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

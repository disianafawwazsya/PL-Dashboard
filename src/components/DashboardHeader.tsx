import React from 'react';
import { Menu, RefreshCw, Bell, User, Calendar, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { FilterState } from '../types/dashboard.ts';

interface DashboardHeaderProps {
  filters: FilterState;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenMobileSidebar: () => void;
  compactCurrency: boolean;
  onToggleCompactCurrency: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  filters,
  onRefresh,
  isLoading,
  onOpenMobileSidebar,
  compactCurrency,
  onToggleCompactCurrency,
}) => {
  return (
    <header id="dashboard-top-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            id="header-mobile-menu-btn"
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Financial Performance Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono shadow-xs">
                FY {filters.year}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Corporate Actual vs Budget variance & achievement monitoring
            </p>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <button
            id="header-currency-toggle"
            onClick={onToggleCompactCurrency}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
            title="Toggle compact currency format"
          >
            <span className="text-slate-500">Display:</span>
            <strong className="text-blue-600 font-mono">{compactCurrency ? 'Billion (B)' : 'Full IDR'}</strong>
          </button>

          {/* Refresh Data Button */}
          <button
            id="header-refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
            title="Refresh dashboard data from backend"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'} />
            <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Notification Button */}
          <button
            id="header-notification-btn"
            className="relative p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              DF
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-slate-800 leading-tight">Financial Controller</div>
              <div className="text-[10px] text-slate-500">Enterprise Division</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

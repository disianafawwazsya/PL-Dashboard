import React from 'react';
import {
  LayoutDashboard,
  Table2,
  Network,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building,
  DollarSign,
  HelpCircle,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'breakdown' | 'hierarchy';
  onSelectView: (view: 'dashboard' | 'breakdown' | 'hierarchy') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  year: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  year,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      description: 'KPI summary, charts & performance overview',
    },
    {
      id: 'breakdown',
      label: 'Financial Breakdown',
      shortLabel: 'Breakdown',
      icon: Table2,
      description: '12-Month full financial matrix & cost drivers',
    },
    {
      id: 'hierarchy',
      label: 'Hierarchy Explorer',
      shortLabel: 'Hierarchy',
      icon: Network,
      description: 'Organization structure & project directory',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F172A] border-r border-slate-800 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 font-bold">
              <DollarSign size={20} className="stroke-[2.5]" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="truncate">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Enterprise</div>
                <div className="text-sm font-extrabold text-white tracking-tight truncate">FinPerformance</div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectView(item.id as any);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title={item.label}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}
                />
                {(!isCollapsed || isMobileOpen) && (
                  <div className="text-left truncate">
                    <div className="truncate">{item.label}</div>
                    <div
                      className={`text-[10px] font-normal truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Fiscal Year & System Status Footer */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3.5 border-t border-slate-800 bg-[#0B1120]">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400">Current Scope:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                  FY {year}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PostgreSQL Engine: <strong className="text-emerald-400 font-medium">Active</strong></span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

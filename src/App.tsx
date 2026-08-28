import React, { useState, useEffect, useCallback } from 'react';
import { FilterState, FilterTreeResponse, DashboardSummary, FinancialMatrixResponse, OrgHierarchyItem } from './types/dashboard.ts';
import { fetchFilters, fetchDashboard, fetchFinancialPerformance, fetchOrganizations } from './services/api.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { DashboardHeader } from './components/DashboardHeader.tsx';
import { DashboardView } from './pages/DashboardView.tsx';
import { BreakdownView } from './pages/BreakdownView.tsx';
import { RawDataView } from './pages/RawDataView.tsx';
import { HierarchyView } from './pages/HierarchyView.tsx';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  year: 2026,
  month: 'ALL',
  business: 'ALL',
  sites: 'ALL',
  tower: 'ALL',
  industry: 'ALL',
  jobCode: 'ALL',
  reportingGroup: 'ALL',
  group: 'ALL',
  unit: 'ALL',
  opg: 'ALL',
  project: 'ALL',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'breakdown' | 'rawLedger' | 'hierarchy'>('dashboard');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [filterTree, setFilterTree] = useState<FilterTreeResponse | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [matrixData, setMatrixData] = useState<FinancialMatrixResponse | null>(null);
  const [organizations, setOrganizations] = useState<OrgHierarchyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [compactCurrency, setCompactCurrency] = useState<boolean>(true);

  // Load Filter Options & Organizations on Mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [ft, orgs] = await Promise.all([fetchFilters(), fetchOrganizations()]);
        setFilterTree(ft);
        setOrganizations(orgs);
      } catch (err: any) {
        console.error('Failed to load initial metadata:', err);
      }
    }
    loadInitialData();
  }, []);

  // Fetch Dashboard & Matrix Data whenever applied filters change
  const loadData = useCallback(async (activeFilters: FilterState) => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, matRes] = await Promise.all([
        fetchDashboard(activeFilters),
        fetchFinancialPerformance(activeFilters),
      ]);
      setSummary(sumRes);
      setMatrixData(matRes);
    } catch (err: any) {
      console.error('Failed to load financial dashboard data:', err);
      setError(err.message || 'An error occurred while connecting to the database server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters);
  }, [loadData, filters]);

  // Handle cascading filter changes
  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handleApplyFilters = () => {
    loadData(filters);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Breadcrumb / Scorecard Drilldown Level Handler
  const handleSelectHierarchyLevel = (
    level: 'ALL' | 'group' | 'unit' | 'opg' | 'project',
    value?: string
  ) => {
    if (level === 'ALL') {
      setFilters((prev) => ({
        ...prev,
        business: 'ALL',
        sites: 'ALL',
        tower: 'ALL',
        industry: 'ALL',
        reportingGroup: 'ALL',
        group: 'ALL',
        unit: 'ALL',
        opg: 'ALL',
        project: 'ALL',
      }));
    } else if (level === 'group') {
      setFilters((prev) => ({
        ...prev,
        group: value || 'ALL',
        business: value || 'ALL',
        unit: 'ALL',
        opg: 'ALL',
        project: 'ALL',
      }));
    } else if (level === 'unit') {
      setFilters((prev) => ({
        ...prev,
        unit: value || 'ALL',
        opg: 'ALL',
        project: 'ALL',
      }));
    } else if (level === 'opg') {
      setFilters((prev) => ({
        ...prev,
        opg: value || 'ALL',
        project: 'ALL',
      }));
    } else if (level === 'project') {
      setFilters((prev) => ({
        ...prev,
        project: value || 'ALL',
      }));
    }
  };

  // Project selection from Hierarchy explorer
  const handleSelectProjectFromHierarchy = (org: OrgHierarchyItem) => {
    setFilters((prev) => ({
      ...prev,
      business: org.business || 'ALL',
      sites: org.sites || 'ALL',
      tower: org.tower || 'ALL',
      industry: org.industry || 'ALL',
      jobCode: org.jobCode || 'ALL',
      reportingGroup: org.reportingGroup,
      group: org.groupName,
      unit: org.unitName,
      opg: org.opgName,
      project: org.projectName,
    }));
    setCurrentView('dashboard');
  };

  const handleSelectGroupFromHierarchy = (groupName: string) => {
    setFilters((prev) => ({
      ...prev,
      business: groupName,
      group: groupName,
      unit: 'ALL',
      opg: 'ALL',
      project: 'ALL',
    }));
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Fixed Vertical Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        year={filters.year}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <DashboardHeader
          filters={filters}
          onRefresh={() => loadData(filters)}
          isLoading={isLoading}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          compactCurrency={compactCurrency}
          onToggleCompactCurrency={() => setCompactCurrency((prev) => !prev)}
        />

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Error Banner if any */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 shadow-xs">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-rose-900">Database Connection Notice</h4>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                <button
                  onClick={() => loadData(filters)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md text-xs font-semibold transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Retry Request</span>
                </button>
              </div>
            </div>
          )}

          {/* Active View */}
          {currentView === 'dashboard' && (
            <DashboardView
              filters={filters}
              filterTree={filterTree}
              summary={summary}
              matrixData={matrixData}
              isLoading={isLoading}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onSelectHierarchyLevel={handleSelectHierarchyLevel}
              compactCurrency={compactCurrency}
              onToggleCompactCurrency={() => setCompactCurrency((prev) => !prev)}
            />
          )}

          {currentView === 'breakdown' && (
            <BreakdownView
              filters={filters}
              filterTree={filterTree}
              matrixData={matrixData}
              summary={summary}
              isLoading={isLoading}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onSelectHierarchyLevel={handleSelectHierarchyLevel}
              compactCurrency={compactCurrency}
              onToggleCompactCurrency={() => setCompactCurrency((prev) => !prev)}
            />
          )}

          {currentView === 'rawLedger' && (
            <RawDataView
              filters={filters}
              filterTree={filterTree}
              onFilterChange={(k, v) => handleFilterChange({ [k]: v })}
            />
          )}

          {currentView === 'hierarchy' && (
            <HierarchyView
              organizations={organizations}
              onSelectProject={handleSelectProjectFromHierarchy}
              onSelectGroup={handleSelectGroupFromHierarchy}
            />
          )}
        </main>
      </div>
    </div>
  );
}

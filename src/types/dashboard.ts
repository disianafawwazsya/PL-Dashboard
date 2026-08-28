export type AchievementDirection = 'higher_is_better' | 'lower_is_better';

// Columns A:Q in DBeaver / Actual Ledger database
export interface ActualLedgerRecord {
  id: number;
  col_A_business: string;        // Col A: Business (e.g. LOCAL SERVICES, GLOBAL CENTER SERVICES, BPO SERVICES)
  col_B_allSites: string;        // Col B: ALL SITES (e.g. ALL SITES)
  col_C_sites: string;           // Col C: Sites (e.g. CX SQUARE MTEN, CX SQUARE CLIENTS, CX SQUARE MIT, etc.)
  col_D_tower: string;           // Col D: Tower (e.g. MTEN, CLIENTS, MIT, TYT, UTC)
  col_E_month: string;           // Col E: Month (e.g. Jan 26, Feb 26, etc.)
  col_F_jobCode: string;         // Col F: Job Code (e.g. 33103, 33102, 39202, etc.)
  col_G_jobName: string;         // Col G: Job Name (e.g. MMKSI - INBOUND CALL, TEMU, etc.)
  col_H_coa: string;             // Col H: COA (e.g. 400000, 510000, 520000, 610000, etc.)
  col_I_accountName: string;     // Col I: Account Name (e.g. Sales, Direct HR Cost, etc.)
  col_J_description: string;     // Col J: Description (e.g. Order SO-2026-...)
  col_K_amount: number;          // Col K: Amount (in IDR)
  col_L_cost: string;            // Col L: Cost (e.g. Direct Cost, Indirect Cost, Sales)
  col_M_cat: string;             // Col M: Cat (e.g. SALES, HR COST, FACILITY COST, OTHER COST)
  col_N_operationGroup: string;  // Col N: Operation Group (e.g. OPG 1 UNIT 3, OPG 4 UNIT 5)
  col_O_unit: string;            // Col O: Unit (e.g. UNIT 1, UNIT 3, UNIT 5, etc.)
  col_P_industry: string;        // Col P: Industry (e.g. Automotive, FMCG, Finance, EC & Distributor)
  col_Q_sources: string;         // Col Q: Sources (e.g. LOCAL SERVICES MMKSI Inbound)
  year: number;
  monthNum: number; // 1-12
}

export interface RawLedgerStats {
  totalRecords: number;
  totalAmount: number;
  totalSales: number;
  totalDirectCost: number;
  totalIndirectCost: number;
  uniqueJobCodes: number;
  uniqueSites: number;
  uniqueTowers: number;
  uniqueBusinesses: number;
}

export interface RawLedgerResponse {
  rows: ActualLedgerRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: RawLedgerStats;
}

export interface FilterState {
  year: number;
  month: string; // 'ALL' or '1'..'12'
  business?: string;
  sites?: string;
  tower?: string;
  industry?: string;
  jobCode?: string;
  reportingGroup: string;
  group: string;
  unit: string;
  opg: string;
  project: string;
}

export interface OrgHierarchyItem {
  id: number;
  reportingGroup: string;
  groupName: string;
  unitName: string;
  opgName: string;
  projectName: string;
  jobCode?: string;
  business?: string;
  sites?: string;
  tower?: string;
  industry?: string;
  sources?: string;
}

export interface FilterTreeResponse {
  businesses: string[];
  sitesList: string[];
  towers: string[];
  industries: string[];
  jobCodes: string[];
  reportingGroups: string[];
  groups: string[];
  units: string[];
  opgs: string[];
  projects: string[];
  years: number[];
  hierarchy: OrgHierarchyItem[];
}

export interface MetricSummary {
  label: string;
  actual: number;
  budget: number;
  achievement: number;
  variance: number;
  isFavorable: boolean;
  direction: AchievementDirection;
  marginActual?: number;
  marginBudget?: number;
  breakdown?: {
    hrCost: { actual: number; budget: number };
    facilityCost: { actual: number; budget: number };
    otherCost: { actual: number; budget: number };
  };
}

export interface MonthlyTrendItem {
  month: number;
  monthName: string;
  shortMonth: string;
  salesActual: number;
  salesBudget: number;
  salesAch: number;
  costActual: number;
  costBudget: number;
  costAch: number;
  profitActual: number;
  profitBudget: number;
  profitAch: number;
  directCostActual: number;
  directCostBudget: number;
  indirectCostActual: number;
  indirectCostBudget: number;
  gpMarginActual: number;
  gpMarginBudget: number;
}

export interface GroupScorecard {
  groupName: string;
  sales: { actual: number; budget: number; ach: number; isFavorable: boolean };
  cost: { actual: number; budget: number; ach: number; isFavorable: boolean };
  profit: { actual: number; budget: number; ach: number; isFavorable: boolean };
  margin: number;
}

export interface DashboardSummary {
  year: number;
  month: string;
  lastUpdated: string;
  activeFiltersCount: number;
  kpis: {
    sales: MetricSummary;
    cost: MetricSummary;
    grossProfit: MetricSummary;
    directProfit: MetricSummary;
    directCost: MetricSummary;
    indirectCost: MetricSummary;
  };
  monthlyTrend: MonthlyTrendItem[];
  groupScorecards: GroupScorecard[];
}

export interface MonthDataPoint {
  actual: number;
  budget: number;
  achievement: number;
  variance: number;
  isFavorable: boolean;
}

export interface MatrixRow {
  category: 'ALL' | 'DIRECT_COST' | 'INDIRECT_COST';
  groupLabel?: string; // e.g. "All", "Direct Cost", "Indirect Cost", "HR Cost", etc.
  subcategory: string;
  metric: string;
  direction: AchievementDirection;
  isPercentage: boolean;
  fullYear: MonthDataPoint;
  months: Record<number, MonthDataPoint>;
}

export interface MatrixSection {
  key: 'ALL' | 'DIRECT_COST' | 'INDIRECT_COST';
  title: string;
  rows: MatrixRow[];
}

export interface FinancialMatrixResponse {
  year: number;
  monthNames: { month: number; name: string; short: string }[];
  sections: MatrixSection[];
}

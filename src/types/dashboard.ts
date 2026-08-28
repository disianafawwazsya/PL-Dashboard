export type AchievementDirection = 'higher_is_better' | 'lower_is_better';

export interface FilterState {
  year: number;
  month: string; // 'ALL' or '1'..'12'
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
}

export interface FilterTreeResponse {
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

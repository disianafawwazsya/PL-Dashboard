import {
  FilterState,
  FilterTreeResponse,
  DashboardSummary,
  FinancialMatrixResponse,
  OrgHierarchyItem,
  RawLedgerResponse,
} from '../types/dashboard.ts';

const BASE_URL = '/api';

export async function fetchFilters(): Promise<FilterTreeResponse> {
  const res = await fetch(`${BASE_URL}/filters`);
  if (!res.ok) throw new Error(`Failed to fetch filters: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

export async function fetchDashboard(filters: FilterState): Promise<DashboardSummary> {
  const params = new URLSearchParams({
    year: String(filters.year),
    month: filters.month || 'ALL',
    business: filters.business || 'ALL',
    sites: filters.sites || 'ALL',
    tower: filters.tower || 'ALL',
    industry: filters.industry || 'ALL',
    jobCode: filters.jobCode || 'ALL',
    reportingGroup: filters.reportingGroup || 'ALL',
    group: filters.group || 'ALL',
    unit: filters.unit || 'ALL',
    opg: filters.opg || 'ALL',
    project: filters.project || 'ALL',
  });

  const res = await fetch(`${BASE_URL}/dashboard?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch dashboard: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

export async function fetchFinancialPerformance(filters: FilterState): Promise<FinancialMatrixResponse> {
  const params = new URLSearchParams({
    year: String(filters.year),
    business: filters.business || 'ALL',
    sites: filters.sites || 'ALL',
    tower: filters.tower || 'ALL',
    industry: filters.industry || 'ALL',
    jobCode: filters.jobCode || 'ALL',
    reportingGroup: filters.reportingGroup || 'ALL',
    group: filters.group || 'ALL',
    unit: filters.unit || 'ALL',
    opg: filters.opg || 'ALL',
    project: filters.project || 'ALL',
  });

  const res = await fetch(`${BASE_URL}/financial-performance?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch financial performance: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

export interface RawLedgerQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  year?: number;
  month?: string;
  business?: string;
  sites?: string;
  tower?: string;
  industry?: string;
  jobCode?: string;
  cat?: string;
  cost?: string;
  unit?: string;
  opg?: string;
}

export async function fetchRawLedger(query: RawLedgerQuery): Promise<RawLedgerResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.search) params.set('search', query.search);
  if (query.year) params.set('year', String(query.year));
  if (query.month && query.month !== 'ALL') params.set('month', query.month);
  if (query.business && query.business !== 'ALL') params.set('business', query.business);
  if (query.sites && query.sites !== 'ALL') params.set('sites', query.sites);
  if (query.tower && query.tower !== 'ALL') params.set('tower', query.tower);
  if (query.industry && query.industry !== 'ALL') params.set('industry', query.industry);
  if (query.jobCode && query.jobCode !== 'ALL') params.set('jobCode', query.jobCode);
  if (query.cat && query.cat !== 'ALL') params.set('cat', query.cat);
  if (query.cost && query.cost !== 'ALL') params.set('cost', query.cost);
  if (query.unit && query.unit !== 'ALL') params.set('unit', query.unit);
  if (query.opg && query.opg !== 'ALL') params.set('opg', query.opg);

  const res = await fetch(`${BASE_URL}/raw-ledger?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch raw ledger: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

export async function fetchOrganizations(): Promise<OrgHierarchyItem[]> {
  const res = await fetch(`${BASE_URL}/organization`);
  if (!res.ok) throw new Error(`Failed to fetch organizations: ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

export async function reseedDatabase(): Promise<void> {
  const res = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to re-seed database');
}

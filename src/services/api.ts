import { FilterState, FilterTreeResponse, DashboardSummary, FinancialMatrixResponse, OrgHierarchyItem } from '../types/dashboard.ts';

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

import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Search,
  Download,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Layers,
  Building2,
  Tag,
  DollarSign,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { FilterState, ActualLedgerRecord, RawLedgerResponse, FilterTreeResponse } from '../types/dashboard.ts';
import { fetchRawLedger } from '../services/api.ts';

interface RawDataViewProps {
  filters: FilterState;
  filterTree: FilterTreeResponse | null;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export const RawDataView: React.FC<RawDataViewProps> = ({ filters, filterTree, onFilterChange }) => {
  const [data, setData] = useState<RawLedgerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [selectedCost, setSelectedCost] = useState<string>('ALL');
  const [selectedRow, setSelectedRow] = useState<ActualLedgerRecord | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load data whenever filters or pagination changes
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRawLedger({
        page,
        pageSize,
        search: debouncedSearch,
        year: filters.year,
        month: filters.month,
        business: filters.business,
        sites: filters.sites,
        tower: filters.tower,
        industry: filters.industry,
        jobCode: filters.jobCode,
        cat: selectedCat,
        cost: selectedCost,
        unit: filters.unit,
        opg: filters.opg,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load ledger records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [
    page,
    pageSize,
    debouncedSearch,
    filters.year,
    filters.month,
    filters.business,
    filters.sites,
    filters.tower,
    filters.industry,
    filters.jobCode,
    filters.unit,
    filters.opg,
    selectedCat,
    selectedCost,
  ]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!data || data.rows.length === 0) return;

    const headers = [
      'Col A: Business',
      'Col B: ALL SITES',
      'Col C: Sites',
      'Col D: Tower',
      'Col E: Month',
      'Col F: Job Code',
      'Col G: Job Name',
      'Col H: COA',
      'Col I: Account Name',
      'Col J: Description',
      'Col K: Amount',
      'Col L: Cost',
      'Col M: Cat',
      'Col N: Operation Group',
      'Col O: Unit',
      'Col P: Industry',
      'Col Q: Sources',
    ];

    const rows = data.rows.map((r) => [
      `"${r.col_A_business}"`,
      `"${r.col_B_allSites}"`,
      `"${r.col_C_sites}"`,
      `"${r.col_D_tower}"`,
      `"${r.col_E_month}"`,
      `"${r.col_F_jobCode}"`,
      `"${r.col_G_jobName}"`,
      `"${r.col_H_coa}"`,
      `"${r.col_I_accountName}"`,
      `"${r.col_J_description}"`,
      r.col_K_amount,
      `"${r.col_L_cost}"`,
      `"${r.col_M_cat}"`,
      `"${r.col_N_operationGroup}"`,
      `"${r.col_O_unit}"`,
      `"${r.col_P_industry}"`,
      `"${r.col_Q_sources}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DBeaver_Ledger_Columns_A-Q_${filters.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Database className="w-3.5 h-3.5" /> DBeaver Master Data
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
              Columns A:Q (17 Dimensions)
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Actual Ledger Database <span className="text-slate-400 font-normal text-base">(DBeaver Structure)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct row-level query view corresponding to Excel / DBeaver schema columns A through Q with complete Chart of Accounts (COA) mapping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!data || data.rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export A:Q CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Records</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{data.stats.totalRecords.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Matching current filters</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">Total Sales (Col K)</p>
            <p className="text-lg font-bold text-blue-700 mt-1">{formatIDR(data.stats.totalSales)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">COA 400000</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">Direct Cost</p>
            <p className="text-lg font-bold text-amber-700 mt-1">{formatIDR(data.stats.totalDirectCost)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">COA 51-530000</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-medium text-purple-600 uppercase tracking-wider">Indirect Cost</p>
            <p className="text-lg font-bold text-purple-700 mt-1">{formatIDR(data.stats.totalIndirectCost)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">COA 61-630000</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Master Projects</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{data.stats.uniqueJobCodes}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Distinct Job Codes (Col F)</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sites & Towers</p>
            <p className="text-lg font-bold text-slate-800 mt-1">
              {data.stats.uniqueSites} / {data.stats.uniqueTowers}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Cols C & D</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Job Code, Job Name, SO Order, Description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-800"
            />
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium mr-1">Cat (Col M):</span>
              {['ALL', 'SALES', 'HR COST', 'FACILITY COST', 'OTHER COST'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCat(cat);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedCat === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cost Type Filter */}
            <div className="flex items-center gap-1 text-xs ml-2">
              <span className="text-slate-400 font-medium mr-1">Cost (Col L):</span>
              {['ALL', 'Direct Cost', 'Indirect Cost'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCost(c);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedCost === c
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-xs font-medium">Querying DBeaver database records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500">
            <p className="text-sm font-semibold">Error loading records</p>
            <p className="text-xs mt-1 text-slate-400">{error}</p>
          </div>
        ) : !data || data.rows.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">No records found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting or broadening your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[1700px]">
              {/* Table Column Headers with Column Letter Identifiers A..Q */}
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 select-none">
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center w-12">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-mono mr-1">A</span>
                    Business
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">B</span>
                    ALL SITES
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-mono mr-1">C</span>
                    Sites
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-mono mr-1">D</span>
                    Tower
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono mr-1">E</span>
                    Month
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-mono mr-1">F</span>
                    Job Code
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-mono mr-1">G</span>
                    Job Name
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono mr-1">H</span>
                    COA
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono mr-1">I</span>
                    Account Name
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[220px]">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">J</span>
                    Description
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right min-w-[140px]">
                    <span className="inline-block px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono mr-1">K</span>
                    Amount (IDR)
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">L</span>
                    Cost
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">M</span>
                    Cat
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">N</span>
                    Operation Group
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">O</span>
                    Unit
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">P</span>
                    Industry
                  </th>
                  <th className="py-2.5 px-3">
                    <span className="inline-block px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-mono mr-1">Q</span>
                    Sources
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.rows.map((row, idx) => {
                  const isSales = row.col_H_coa === '400000';
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRow(row)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        selectedRow?.id === row.id ? 'bg-blue-50 font-medium' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-slate-400 border-r border-slate-100 font-mono text-[11px]">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-800 whitespace-nowrap">
                        {row.col_A_business}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 whitespace-nowrap">
                        {row.col_B_allSites}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700 whitespace-nowrap">
                        {row.col_C_sites}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-600 whitespace-nowrap">
                        {row.col_D_tower}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-800 whitespace-nowrap">
                        {row.col_E_month}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-mono font-semibold text-blue-600 whitespace-nowrap">
                        {row.col_F_jobCode}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-800 whitespace-nowrap">
                        {row.col_G_jobName}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-600 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {row.col_H_coa}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700 whitespace-nowrap">
                        {row.col_I_accountName}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 truncate max-w-xs">
                        {row.col_J_description}
                      </td>
                      <td
                        className={`py-2.5 px-3 border-r border-slate-100 text-right font-mono font-semibold whitespace-nowrap ${
                          isSales ? 'text-blue-600' : 'text-slate-800'
                        }`}
                      >
                        {formatIDR(row.col_K_amount)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            row.col_L_cost === 'Direct Cost'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                          }`}
                        >
                          {row.col_L_cost}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${
                            row.col_M_cat === 'SALES'
                              ? 'bg-blue-50 text-blue-700'
                              : row.col_M_cat === 'HR COST'
                              ? 'bg-indigo-50 text-indigo-700'
                              : row.col_M_cat === 'FACILITY COST'
                              ? 'bg-cyan-50 text-cyan-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.col_M_cat}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                        {row.col_N_operationGroup}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                        {row.col_O_unit}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                        {row.col_P_industry}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                        {row.col_Q_sources}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {data && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <span className="font-semibold text-slate-800">
                {Math.min((page - 1) * pageSize + 1, data.total)} - {Math.min(page * pageSize, data.total)}
              </span>
              <span>of</span>
              <span className="font-semibold text-slate-800">{data.total.toLocaleString()}</span>
              <span>records</span>

              <div className="ml-4 flex items-center gap-1.5">
                <span className="text-slate-400">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700">
                Page {page} of {data.totalPages || 1}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Row Detail Drawer (if selected) */}
      {selectedRow && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  DBeaver Record Details
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">{selectedRow.col_G_jobName}</h3>
                <p className="text-xs text-slate-500 font-mono">Job Code: {selectedRow.col_F_jobCode} • Month: {selectedRow.col_E_month}</p>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col A: Business</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_A_business}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col C: Sites</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_C_sites}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col D: Tower</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_D_tower}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col H: COA</span>
                <p className="font-mono font-semibold text-blue-600 mt-0.5">{selectedRow.col_H_coa}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col I: Account Name</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_I_accountName}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col K: Amount</span>
                <p className="font-mono font-bold text-emerald-600 mt-0.5">{formatIDR(selectedRow.col_K_amount)}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col L: Cost</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_L_cost}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col M: Cat</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_M_cat}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col P: Industry</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRow.col_P_industry}</p>
              </div>
              <div className="col-span-2 sm:col-span-3 bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col J: Description</span>
                <p className="font-medium text-slate-700 mt-0.5">{selectedRow.col_J_description}</p>
              </div>
              <div className="col-span-2 sm:col-span-3 bg-slate-50 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Col Q: Sources</span>
                <p className="font-medium text-slate-700 mt-0.5">{selectedRow.col_Q_sources}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRow(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

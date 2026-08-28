import {
  generateSeedData,
  OrgRecord,
  FinRecord,
  RawLedgerItem,
  DIRECT_HR_EXPENSE_ITEMS,
  DIRECT_FACILITY_EXPENSE_ITEMS,
  DIRECT_OTHERS_EXPENSE_ITEMS,
  INDIRECT_HR_EXPENSE_ITEMS,
  INDIRECT_FACILITY_EXPENSE_ITEMS,
  INDIRECT_OTHERS_EXPENSE_ITEMS,
} from './seedData.ts';

// In-Memory & Relational Aggregation Engine for DBeaver Data (Columns A:Q) & 4 Report Tables
class DatabaseEngine {
  private organizations: OrgRecord[] = [];
  private financialRecords: FinRecord[] = [];
  private rawLedgerRecords: RawLedgerItem[] = [];
  private initialized = false;

  constructor() {
    this.initialize();
  }

  public initialize() {
    const seed = generateSeedData();
    this.organizations = seed.organizations;
    this.financialRecords = seed.financialRecords;
    this.rawLedgerRecords = seed.rawLedgerRecords;
    this.initialized = true;
    console.log(
      `[DB] Seeded ${this.organizations.length} Master Projects, ${this.rawLedgerRecords.length} Actual Ledger records (Col A:Q), and ${this.financialRecords.length} financial matrix records`
    );
  }

  public getOrganizations(): OrgRecord[] {
    return this.organizations;
  }

  public getFilterTree() {
    const businesses = Array.from(new Set(this.organizations.map((o) => o.business))).sort();
    const sitesList = Array.from(new Set(this.organizations.map((o) => o.sites))).sort();
    const towers = Array.from(new Set(this.organizations.map((o) => o.tower))).sort();
    const industries = Array.from(new Set(this.organizations.map((o) => o.industry))).sort();
    const jobCodes = Array.from(new Set(this.organizations.map((o) => o.jobCode))).sort();
    const reportingGroups = Array.from(new Set(this.organizations.map((o) => o.reportingGroup))).sort();
    const groups = Array.from(new Set(this.organizations.map((o) => o.groupName))).sort();
    const units = Array.from(new Set(this.organizations.map((o) => o.unitName))).sort();
    const opgs = Array.from(new Set(this.organizations.map((o) => o.opgName))).sort();
    const projects = Array.from(new Set(this.organizations.map((o) => o.projectName))).sort();
    const years = [2026, 2025];

    return {
      businesses: ['ALL', ...businesses],
      sitesList: ['ALL', ...sitesList],
      towers: ['ALL', ...towers],
      industries: ['ALL', ...industries],
      jobCodes: ['ALL', ...jobCodes],
      reportingGroups: ['ALL', ...reportingGroups],
      groups: ['ALL', ...groups],
      units: ['ALL', ...units],
      opgs: ['ALL', ...opgs],
      projects: ['ALL', ...projects],
      years,
      hierarchy: this.organizations,
    };
  }

  // Filter matched organization IDs
  private getMatchingOrgIds(filters: {
    business?: string;
    sites?: string;
    tower?: string;
    industry?: string;
    jobCode?: string;
    reportingGroup?: string;
    group?: string;
    unit?: string;
    opg?: string;
    project?: string;
  }): Set<number> {
    const matching = this.organizations.filter((org) => {
      if (filters.business && filters.business !== 'ALL' && org.business !== filters.business) return false;
      if (filters.sites && filters.sites !== 'ALL' && org.sites !== filters.sites) return false;
      if (filters.tower && filters.tower !== 'ALL' && org.tower !== filters.tower) return false;
      if (filters.industry && filters.industry !== 'ALL' && org.industry !== filters.industry) return false;
      if (filters.jobCode && filters.jobCode !== 'ALL' && org.jobCode !== filters.jobCode) return false;
      if (filters.reportingGroup && filters.reportingGroup !== 'ALL' && org.reportingGroup !== filters.reportingGroup) return false;
      if (filters.group && filters.group !== 'ALL' && org.groupName !== filters.group) return false;
      if (filters.unit && filters.unit !== 'ALL' && org.unitName !== filters.unit) return false;
      if (filters.opg && filters.opg !== 'ALL' && org.opgName !== filters.opg) return false;
      if (filters.project && filters.project !== 'ALL' && org.projectName !== filters.project) return false;
      return true;
    });

    return new Set(matching.map((o) => o.id));
  }

  // Query DBeaver Raw Data (Columns A:Q)
  public getRawLedger(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    year?: number;
    month?: string | number;
    business?: string;
    sites?: string;
    tower?: string;
    industry?: string;
    jobCode?: string;
    cat?: string;
    cost?: string;
    unit?: string;
    opg?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.max(1, Math.min(500, Number(query.pageSize) || 50));
    const year = Number(query.year) || 2026;
    const searchLower = (query.search || '').trim().toLowerCase();

    let filtered = this.rawLedgerRecords.filter((r) => {
      if (r.year !== year) return false;
      if (query.month && query.month !== 'ALL') {
        const mNum = Number(query.month);
        if (!isNaN(mNum) && r.monthNum !== mNum) return false;
      }
      if (query.business && query.business !== 'ALL' && r.col_A_business !== query.business) return false;
      if (query.sites && query.sites !== 'ALL' && r.col_C_sites !== query.sites) return false;
      if (query.tower && query.tower !== 'ALL' && r.col_D_tower !== query.tower) return false;
      if (query.industry && query.industry !== 'ALL' && r.col_P_industry !== query.industry) return false;
      if (query.jobCode && query.jobCode !== 'ALL' && r.col_F_jobCode !== query.jobCode) return false;
      if (query.cat && query.cat !== 'ALL' && r.col_M_cat !== query.cat) return false;
      if (query.cost && query.cost !== 'ALL' && r.col_L_cost !== query.cost) return false;
      if (query.unit && query.unit !== 'ALL' && r.col_O_unit !== query.unit) return false;
      if (query.opg && query.opg !== 'ALL' && r.col_N_operationGroup !== query.opg) return false;

      if (searchLower) {
        const rowMatch =
          r.col_A_business.toLowerCase().includes(searchLower) ||
          r.col_C_sites.toLowerCase().includes(searchLower) ||
          r.col_D_tower.toLowerCase().includes(searchLower) ||
          r.col_F_jobCode.toLowerCase().includes(searchLower) ||
          r.col_G_jobName.toLowerCase().includes(searchLower) ||
          r.col_H_coa.toLowerCase().includes(searchLower) ||
          r.col_I_accountName.toLowerCase().includes(searchLower) ||
          r.col_J_description.toLowerCase().includes(searchLower) ||
          r.col_N_operationGroup.toLowerCase().includes(searchLower) ||
          r.col_O_unit.toLowerCase().includes(searchLower) ||
          r.col_P_industry.toLowerCase().includes(searchLower) ||
          r.col_Q_sources.toLowerCase().includes(searchLower);
        if (!rowMatch) return false;
      }

      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedRows = filtered.slice(startIndex, startIndex + pageSize);

    let totalAmount = 0;
    let totalSales = 0;
    let totalDirectCost = 0;
    let totalIndirectCost = 0;
    const uniqueJobCodes = new Set<string>();
    const uniqueSites = new Set<string>();
    const uniqueTowers = new Set<string>();
    const uniqueBusinesses = new Set<string>();

    for (const r of filtered) {
      totalAmount += r.col_K_amount;
      if (r.col_H_coa === '400000') {
        totalSales += r.col_K_amount;
      } else if (r.col_L_cost === 'Direct Cost') {
        totalDirectCost += r.col_K_amount;
      } else if (r.col_L_cost === 'Indirect Cost') {
        totalIndirectCost += r.col_K_amount;
      }
      uniqueJobCodes.add(r.col_F_jobCode);
      uniqueSites.add(r.col_C_sites);
      uniqueTowers.add(r.col_D_tower);
      uniqueBusinesses.add(r.col_A_business);
    }

    return {
      rows: paginatedRows,
      total,
      page,
      pageSize,
      totalPages,
      stats: {
        totalRecords: total,
        totalAmount,
        totalSales,
        totalDirectCost,
        totalIndirectCost,
        uniqueJobCodes: uniqueJobCodes.size,
        uniqueSites: uniqueSites.size,
        uniqueTowers: uniqueTowers.size,
        uniqueBusinesses: uniqueBusinesses.size,
      },
    };
  }

  public calculateAchievement(
    actual: number,
    budget: number,
    direction: 'higher_is_better' | 'lower_is_better' = 'higher_is_better'
  ) {
    if (budget === 0) {
      return {
        achievement: actual === 0 ? 100 : actual > 0 ? 100 : 0,
        variance: actual,
        isFavorable: direction === 'higher_is_better' ? actual >= 0 : actual <= 0,
      };
    }
    const ach = (actual / budget) * 100;
    const variance = actual - budget;
    const isFavorable = direction === 'higher_is_better' ? actual >= budget : actual <= budget;
    return {
      achievement: parseFloat(ach.toFixed(2)),
      variance,
      isFavorable,
    };
  }

  public getDashboardData(filters: {
    year?: number;
    month?: string | number;
    business?: string;
    sites?: string;
    tower?: string;
    industry?: string;
    jobCode?: string;
    reportingGroup?: string;
    group?: string;
    unit?: string;
    opg?: string;
    project?: string;
  }) {
    const year = Number(filters.year) || 2026;
    const matchingOrgIds = this.getMatchingOrgIds(filters);
    const selectedMonth = filters.month && filters.month !== 'ALL' ? Number(filters.month) : null;

    const relevantRecords = this.financialRecords.filter((rec) => {
      if (rec.year !== year) return false;
      if (!matchingOrgIds.has(rec.organizationId)) return false;
      if (selectedMonth !== null && rec.month !== selectedMonth) return false;
      return true;
    });

    const sumMetric = (category: string, metric: string, recordsList = relevantRecords) => {
      let actual = 0;
      let budget = 0;
      for (const r of recordsList) {
        if (r.category === category && r.metric === metric) {
          actual += r.actualAmount;
          budget += r.budgetAmount;
        }
      }
      return { actual, budget };
    };

    const sales = sumMetric('ALL', 'sales');
    const totalCost = sumMetric('ALL', 'total_cost');
    const hrCost = sumMetric('ALL', 'hr_cost');
    const facilityCost = sumMetric('ALL', 'facility_cost');
    const otherCost = sumMetric('ALL', 'other_cost');
    const directCost = sumMetric('DIRECT_COST', 'total_direct_cost');
    const indirectCost = sumMetric('INDIRECT_COST', 'total_indirect_cost');

    const grossProfitActual = sales.actual - totalCost.actual;
    const grossProfitBudget = sales.budget - totalCost.budget;
    const directProfitActual = sales.actual - directCost.actual;
    const directProfitBudget = sales.budget - directCost.budget;

    const salesAch = this.calculateAchievement(sales.actual, sales.budget, 'higher_is_better');
    const costAch = this.calculateAchievement(totalCost.actual, totalCost.budget, 'lower_is_better');
    const gpAch = this.calculateAchievement(grossProfitActual, grossProfitBudget, 'higher_is_better');
    const dpAch = this.calculateAchievement(directProfitActual, directProfitBudget, 'higher_is_better');
    const directCostAch = this.calculateAchievement(directCost.actual, directCost.budget, 'lower_is_better');
    const indirectCostAch = this.calculateAchievement(indirectCost.actual, indirectCost.budget, 'lower_is_better');

    const gpMarginActual = sales.actual > 0 ? parseFloat(((grossProfitActual / sales.actual) * 100).toFixed(2)) : 0;
    const gpMarginBudget = sales.budget > 0 ? parseFloat(((grossProfitBudget / sales.budget) * 100).toFixed(2)) : 0;
    const dpMarginActual = sales.actual > 0 ? parseFloat(((directProfitActual / sales.actual) * 100).toFixed(2)) : 0;
    const dpMarginBudget = sales.budget > 0 ? parseFloat(((directProfitBudget / sales.budget) * 100).toFixed(2)) : 0;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = [];

    const fullYearRecords = this.financialRecords.filter((rec) => {
      if (rec.year !== year) return false;
      if (!matchingOrgIds.has(rec.organizationId)) return false;
      return true;
    });

    for (let m = 1; m <= 12; m++) {
      const monthRecs = fullYearRecords.filter((r) => r.month === m);
      const mSales = sumMetric('ALL', 'sales', monthRecs);
      const mCost = sumMetric('ALL', 'total_cost', monthRecs);
      const mDirectCost = sumMetric('DIRECT_COST', 'total_direct_cost', monthRecs);
      const mIndirectCost = sumMetric('INDIRECT_COST', 'total_indirect_cost', monthRecs);
      const mProfitActual = mSales.actual - mCost.actual;
      const mProfitBudget = mSales.budget - mCost.budget;

      const mSalesAch = this.calculateAchievement(mSales.actual, mSales.budget, 'higher_is_better');
      const mCostAch = this.calculateAchievement(mCost.actual, mCost.budget, 'lower_is_better');
      const mProfitAch = this.calculateAchievement(mProfitActual, mProfitBudget, 'higher_is_better');

      monthlyTrend.push({
        month: m,
        monthName: `${monthNames[m - 1]}-${String(year).slice(-2)}`,
        shortMonth: monthNames[m - 1],
        salesActual: mSales.actual,
        salesBudget: mSales.budget,
        salesAch: mSalesAch.achievement,
        costActual: mCost.actual,
        costBudget: mCost.budget,
        costAch: mCostAch.achievement,
        profitActual: mProfitActual,
        profitBudget: mProfitBudget,
        profitAch: mProfitAch.achievement,
        directCostActual: mDirectCost.actual,
        directCostBudget: mDirectCost.budget,
        indirectCostActual: mIndirectCost.actual,
        indirectCostBudget: mIndirectCost.budget,
        gpMarginActual: mSales.actual > 0 ? parseFloat(((mProfitActual / mSales.actual) * 100).toFixed(2)) : 0,
        gpMarginBudget: mSales.budget > 0 ? parseFloat(((mProfitBudget / mSales.budget) * 100).toFixed(2)) : 0,
      });
    }

    const groupScorecards = this.calculateGroupScorecards(year, selectedMonth);

    return {
      year,
      month: filters.month || 'ALL',
      lastUpdated: new Date().toISOString(),
      kpis: {
        sales: {
          label: 'Total Sales',
          actual: sales.actual,
          budget: sales.budget,
          achievement: salesAch.achievement,
          variance: salesAch.variance,
          isFavorable: salesAch.isFavorable,
          direction: 'higher_is_better',
        },
        cost: {
          label: 'Total Cost',
          actual: totalCost.actual,
          budget: totalCost.budget,
          achievement: costAch.achievement,
          variance: costAch.variance,
          isFavorable: costAch.isFavorable,
          direction: 'lower_is_better',
          breakdown: {
            hrCost: { actual: hrCost.actual, budget: hrCost.budget },
            facilityCost: { actual: facilityCost.actual, budget: facilityCost.budget },
            otherCost: { actual: otherCost.actual, budget: otherCost.budget },
          },
        },
        grossProfit: {
          label: 'Gross Profit',
          actual: grossProfitActual,
          budget: grossProfitBudget,
          achievement: gpAch.achievement,
          variance: gpAch.variance,
          isFavorable: gpAch.isFavorable,
          marginActual: gpMarginActual,
          marginBudget: gpMarginBudget,
          direction: 'higher_is_better',
        },
        directProfit: {
          label: 'Direct Profit',
          actual: directProfitActual,
          budget: directProfitBudget,
          achievement: dpAch.achievement,
          variance: dpAch.variance,
          isFavorable: dpAch.isFavorable,
          marginActual: dpMarginActual,
          marginBudget: dpMarginBudget,
          direction: 'higher_is_better',
        },
        directCost: {
          label: 'Direct Cost',
          actual: directCost.actual,
          budget: directCost.budget,
          achievement: directCostAch.achievement,
          variance: directCostAch.variance,
          isFavorable: directCostAch.isFavorable,
          direction: 'lower_is_better',
        },
        indirectCost: {
          label: 'Indirect Cost',
          actual: indirectCost.actual,
          budget: indirectCost.budget,
          achievement: indirectCostAch.achievement,
          variance: indirectCostAch.variance,
          isFavorable: indirectCostAch.isFavorable,
          direction: 'lower_is_better',
        },
      },
      monthlyTrend,
      groupScorecards,
      activeFiltersCount: Object.values(filters).filter((v) => v && v !== 'ALL' && v !== 2026).length,
    };
  }

  private calculateGroupScorecards(year: number, selectedMonth: number | null) {
    const businesses = Array.from(new Set(this.organizations.map((o) => o.business)));

    return businesses.map((bizName) => {
      const orgIds = new Set(this.organizations.filter((o) => o.business === bizName).map((o) => o.id));
      const recs = this.financialRecords.filter((r) => {
        if (r.year !== year || !orgIds.has(r.organizationId)) return false;
        if (selectedMonth !== null && r.month !== selectedMonth) return false;
        return true;
      });

      let salesAct = 0;
      let salesBud = 0;
      let costAct = 0;
      let costBud = 0;

      for (const r of recs) {
        if (r.category === 'ALL' && r.metric === 'sales') {
          salesAct += r.actualAmount;
          salesBud += r.budgetAmount;
        } else if (r.category === 'ALL' && r.metric === 'total_cost') {
          costAct += r.actualAmount;
          costBud += r.budgetAmount;
        }
      }

      const gpAct = salesAct - costAct;
      const gpBud = salesBud - costBud;
      const salesAch = this.calculateAchievement(salesAct, salesBud, 'higher_is_better');
      const profitAch = this.calculateAchievement(gpAct, gpBud, 'higher_is_better');
      const costAch = this.calculateAchievement(costAct, costBud, 'lower_is_better');

      return {
        groupName: bizName,
        sales: { actual: salesAct, budget: salesBud, ach: salesAch.achievement, isFavorable: salesAch.isFavorable },
        cost: { actual: costAct, budget: costBud, ach: costAch.achievement, isFavorable: costAch.isFavorable },
        profit: { actual: gpAct, budget: gpBud, ach: profitAch.achievement, isFavorable: profitAch.isFavorable },
        margin: salesAct > 0 ? parseFloat(((gpAct / salesAct) * 100).toFixed(2)) : 0,
      };
    });
  }

  public getFinancialMatrix(filters: {
    year?: number;
    business?: string;
    sites?: string;
    tower?: string;
    industry?: string;
    jobCode?: string;
    reportingGroup?: string;
    group?: string;
    unit?: string;
    opg?: string;
    project?: string;
  }) {
    const year = Number(filters.year) || 2026;
    const matchingOrgIds = this.getMatchingOrgIds(filters);

    const yearRecords = this.financialRecords.filter((rec) => {
      return rec.year === year && matchingOrgIds.has(rec.organizationId);
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const buildRow = (
      category: 'ALL' | 'DIRECT_COST' | 'INDIRECT_COST',
      subcategory: string,
      metricKey: string,
      direction: 'higher_is_better' | 'lower_is_better',
      groupLabel?: string,
      isCustomDerived: boolean = false,
      derivedCalculator?: (monthIndex: number | 'fullYear') => { actual: number; budget: number; isPercentage?: boolean }
    ) => {
      const monthsData: Record<
        number,
        { actual: number; budget: number; achievement: number; variance: number; isFavorable: boolean }
      > = {};
      let fullYearActual = 0;
      let fullYearBudget = 0;

      if (!isCustomDerived) {
        for (let m = 1; m <= 12; m++) {
          let mAct = 0;
          let mBud = 0;
          for (const r of yearRecords) {
            if (r.month === m && r.category === category && r.metric === metricKey) {
              mAct += r.actualAmount;
              mBud += r.budgetAmount;
            }
          }
          fullYearActual += mAct;
          fullYearBudget += mBud;
          const ach = this.calculateAchievement(mAct, mBud, direction);
          monthsData[m] = {
            actual: mAct,
            budget: mBud,
            achievement: ach.achievement,
            variance: ach.variance,
            isFavorable: ach.isFavorable,
          };
        }
      } else if (derivedCalculator) {
        for (let m = 1; m <= 12; m++) {
          const calc = derivedCalculator(m);
          const ach = this.calculateAchievement(calc.actual, calc.budget, direction);
          monthsData[m] = {
            actual: calc.actual,
            budget: calc.budget,
            achievement: ach.achievement,
            variance: ach.variance,
            isFavorable: ach.isFavorable,
          };
        }
        const fyCalc = derivedCalculator('fullYear');
        fullYearActual = fyCalc.actual;
        fullYearBudget = fyCalc.budget;
      }

      const fullYearAch = this.calculateAchievement(fullYearActual, fullYearBudget, direction);

      return {
        category,
        groupLabel: groupLabel || (category === 'ALL' ? 'All' : category === 'DIRECT_COST' ? 'Direct Cost' : 'Indirect Cost'),
        subcategory,
        metric: metricKey,
        direction,
        isPercentage: metricKey.includes('percentage') || metricKey.includes('margin') || subcategory.startsWith('%'),
        fullYear: {
          actual: fullYearActual,
          budget: fullYearBudget,
          achievement: fullYearAch.achievement,
          variance: fullYearAch.variance,
          isFavorable: fullYearAch.isFavorable,
        },
        months: monthsData,
      };
    };

    const getMonthTotal = (cat: string, met: string, m: number | 'fullYear') => {
      let act = 0;
      let bud = 0;
      for (const r of yearRecords) {
        if (r.category === cat && r.metric === met) {
          if (m === 'fullYear' || r.month === m) {
            act += r.actualAmount;
            bud += r.budgetAmount;
          }
        }
      }
      return { act, bud };
    };

    // ==========================================
    // 1. TABLE 1: SUMMARY (All, Direct Cost, Indirect Cost)
    // ==========================================
    const table1Rows = [
      // Block 1: All
      buildRow('ALL', 'Sales', 'sales', 'higher_is_better', 'All'),
      buildRow('ALL', 'Cost', 'total_cost', 'lower_is_better', 'All'),
      buildRow('ALL', 'Profit', 'gross_profit', 'higher_is_better', 'All', true, (m) => {
        const s = getMonthTotal('ALL', 'sales', m);
        const c = getMonthTotal('ALL', 'total_cost', m);
        return { actual: s.act - c.act, budget: s.bud - c.bud };
      }),
      // Block 2: Direct Cost
      buildRow('DIRECT_COST', 'Sales', 'direct_sales', 'higher_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'Cost', 'total_direct_cost', 'lower_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'Profit', 'direct_profit', 'higher_is_better', 'Direct Cost', true, (m) => {
        const s = getMonthTotal('DIRECT_COST', 'direct_sales', m);
        const dc = getMonthTotal('DIRECT_COST', 'total_direct_cost', m);
        return { actual: s.act - dc.act, budget: s.bud - dc.bud };
      }),
      // Block 3: Indirect Cost
      buildRow('INDIRECT_COST', 'Cost', 'total_indirect_cost', 'lower_is_better', 'Indirect Cost'),
    ];

    // ==========================================
    // 2. TABLE 2: OVERVIEW (All, Direct Cost, Indirect Cost - HR, Facility, Other, Margins)
    // ==========================================
    const table2Rows = [
      // Block 1: All
      buildRow('ALL', 'Sales', 'sales', 'higher_is_better', 'All'),
      buildRow('ALL', 'HR Cost', 'hr_cost', 'lower_is_better', 'All'),
      buildRow('ALL', 'Facility Cost', 'facility_cost', 'lower_is_better', 'All'),
      buildRow('ALL', 'Other Cost', 'other_cost', 'lower_is_better', 'All'),
      buildRow('ALL', 'Total Cost', 'total_cost', 'lower_is_better', 'All'),
      buildRow('ALL', 'GP (Gross Profit)', 'gross_profit_ov', 'higher_is_better', 'All', true, (m) => {
        const s = getMonthTotal('ALL', 'sales', m);
        const c = getMonthTotal('ALL', 'total_cost', m);
        return { actual: s.act - c.act, budget: s.bud - c.bud };
      }),
      buildRow('ALL', '%GP', '%gp', 'higher_is_better', 'All', true, (m) => {
        const s = getMonthTotal('ALL', 'sales', m);
        const c = getMonthTotal('ALL', 'total_cost', m);
        const actGp = s.act - c.act;
        const budGp = s.bud - c.bud;
        const actPct = s.act > 0 ? (actGp / s.act) * 100 : 0;
        const budPct = s.bud > 0 ? (budGp / s.bud) * 100 : 0;
        return { actual: parseFloat(actPct.toFixed(2)), budget: parseFloat(budPct.toFixed(2)), isPercentage: true };
      }),

      // Block 2: Direct Cost
      buildRow('DIRECT_COST', 'Sales', 'direct_sales', 'higher_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'HR Cost', 'direct_hr_cost', 'lower_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'Facility Cost', 'direct_facility_cost', 'lower_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'Other Cost', 'direct_other_cost', 'lower_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'Total Cost (Direct Cost)', 'total_direct_cost', 'lower_is_better', 'Direct Cost'),
      buildRow('DIRECT_COST', 'DP (Direct Profit)', 'direct_profit_ov', 'higher_is_better', 'Direct Cost', true, (m) => {
        const s = getMonthTotal('DIRECT_COST', 'direct_sales', m);
        const dc = getMonthTotal('DIRECT_COST', 'total_direct_cost', m);
        return { actual: s.act - dc.act, budget: s.bud - dc.bud };
      }),
      buildRow('DIRECT_COST', '%DP', '%dp', 'higher_is_better', 'Direct Cost', true, (m) => {
        const s = getMonthTotal('DIRECT_COST', 'direct_sales', m);
        const dc = getMonthTotal('DIRECT_COST', 'total_direct_cost', m);
        const actDp = s.act - dc.act;
        const budDp = s.bud - dc.bud;
        const actPct = s.act > 0 ? (actDp / s.act) * 100 : 0;
        const budPct = s.bud > 0 ? (budDp / s.bud) * 100 : 0;
        return { actual: parseFloat(actPct.toFixed(2)), budget: parseFloat(budPct.toFixed(2)), isPercentage: true };
      }),

      // Block 3: Indirect Cost
      buildRow('INDIRECT_COST', 'HR Cost', 'indirect_hr_cost', 'lower_is_better', 'Indirect Cost'),
      buildRow('INDIRECT_COST', 'Facility Cost', 'indirect_facility_cost', 'lower_is_better', 'Indirect Cost'),
      buildRow('INDIRECT_COST', 'Other Cost', 'indirect_other_cost', 'lower_is_better', 'Indirect Cost'),
      buildRow('INDIRECT_COST', 'Total Cost (Indirect Cost)', 'total_indirect_cost', 'lower_is_better', 'Indirect Cost'),
    ];

    // ==========================================
    // 3. TABLE 3: CATEGORY DIRECT COST DETAIL
    // ==========================================
    const table3Rows = [
      buildRow('DIRECT_COST', 'Sales', 'direct_sales', 'higher_is_better', 'Direct Cost'),
      // HR Cost (15 items)
      ...DIRECT_HR_EXPENSE_ITEMS.map((item) =>
        buildRow(
          'DIRECT_COST',
          item.name,
          `direct_hr_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          'lower_is_better',
          'HR Cost'
        )
      ),
      // Facility Cost (9 items)
      ...DIRECT_FACILITY_EXPENSE_ITEMS.map((item) =>
        buildRow(
          'DIRECT_COST',
          item.name,
          `direct_facility_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          'lower_is_better',
          'Facility Cost'
        )
      ),
      // Others Cost (18 items)
      ...DIRECT_OTHERS_EXPENSE_ITEMS.map((item) =>
        buildRow(
          'DIRECT_COST',
          item.name,
          `direct_others_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          'lower_is_better',
          'Others Cost'
        )
      ),
    ];

    // ==========================================
    // 4. TABLE 4: CATEGORY INDIRECT COST DETAIL
    // ==========================================
    const table4Rows = [
      // HR Cost (15 items)
      ...INDIRECT_HR_EXPENSE_ITEMS.map((item) =>
        buildRow(
          'INDIRECT_COST',
          item.name,
          `indirect_hr_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          'lower_is_better',
          'HR Cost'
        )
      ),
      // Facility Cost (9 items)
      ...INDIRECT_FACILITY_EXPENSE_ITEMS.map((item) =>
        buildRow(
          'INDIRECT_COST',
          item.name,
          `indirect_facility_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          'lower_is_better',
          'Facility Cost'
        )
      ),
      // Others Cost (18 items)
      ...INDIRECT_OTHERS_EXPENSE_ITEMS.map((item) =>
        buildRow(
          'INDIRECT_COST',
          item.name,
          `indirect_others_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          'lower_is_better',
          'Others Cost'
        )
      ),
    ];

    return {
      year,
      monthNames: monthNames.map((n, i) => ({ month: i + 1, name: `${n}-${String(year).slice(-2)}`, short: n })),
      sections: [
        {
          key: 'ALL' as const,
          title: '1. Summary (All, Direct Cost, Indirect Cost)',
          rows: table1Rows,
        },
        {
          key: 'ALL' as const,
          title: '2. Overview (All, Direct Cost, Indirect Cost - HR, Facility, Other, Margins)',
          rows: table2Rows,
        },
        {
          key: 'DIRECT_COST' as const,
          title: '3. Category: Direct Cost (Sales, HR, Facility, Others Cost Detail)',
          rows: table3Rows,
        },
        {
          key: 'INDIRECT_COST' as const,
          title: '4. Category: Indirect Cost (HR, Facility, Others Cost Detail)',
          rows: table4Rows,
        },
      ],
    };
  }
}

export const db = new DatabaseEngine();

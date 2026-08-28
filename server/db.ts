import { generateSeedData, OrgRecord, FinRecord } from './seedData.ts';

// In-Memory & PostgreSQL Query Engine
// Provides high-performance parameterized relational aggregation

class DatabaseEngine {
  private organizations: OrgRecord[] = [];
  private financialRecords: FinRecord[] = [];
  private initialized = false;

  constructor() {
    this.initialize();
  }

  public initialize() {
    const seed = generateSeedData();
    this.organizations = seed.organizations;
    this.financialRecords = seed.financialRecords;
    this.initialized = true;
    console.log(`[DB] Seeded ${this.organizations.length} organizations and ${this.financialRecords.length} financial records`);
  }

  public getOrganizations(): OrgRecord[] {
    return this.organizations;
  }

  public getFilterTree() {
    const reportingGroups = Array.from(new Set(this.organizations.map((o) => o.reportingGroup))).sort();
    const groups = Array.from(new Set(this.organizations.map((o) => o.groupName))).sort();
    const units = Array.from(new Set(this.organizations.map((o) => o.unitName))).sort();
    const opgs = Array.from(new Set(this.organizations.map((o) => o.opgName))).sort();
    const projects = Array.from(new Set(this.organizations.map((o) => o.projectName))).sort();
    const years = [2026, 2025];

    return {
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
    reportingGroup?: string;
    group?: string;
    unit?: string;
    opg?: string;
    project?: string;
  }): Set<number> {
    const matching = this.organizations.filter((org) => {
      if (filters.reportingGroup && filters.reportingGroup !== 'ALL' && org.reportingGroup !== filters.reportingGroup) {
        return false;
      }
      if (filters.group && filters.group !== 'ALL' && org.groupName !== filters.group) {
        return false;
      }
      if (filters.unit && filters.unit !== 'ALL' && org.unitName !== filters.unit) {
        return false;
      }
      if (filters.opg && filters.opg !== 'ALL' && org.opgName !== filters.opg) {
        return false;
      }
      if (filters.project && filters.project !== 'ALL' && org.projectName !== filters.project) {
        return false;
      }
      return true;
    });

    return new Set(matching.map((o) => o.id));
  }

  public calculateAchievement(actual: number, budget: number, direction: 'higher_is_better' | 'lower_is_better' = 'higher_is_better') {
    if (budget === 0) {
      return {
        achievement: actual > 0 ? 100 : 0,
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
    reportingGroup?: string;
    group?: string;
    unit?: string;
    opg?: string;
    project?: string;
  }) {
    const year = Number(filters.year) || 2026;
    const matchingOrgIds = this.getMatchingOrgIds(filters);
    const selectedMonth = filters.month && filters.month !== 'ALL' ? Number(filters.month) : null;

    // Filter relevant records
    const relevantRecords = this.financialRecords.filter((rec) => {
      if (rec.year !== year) return false;
      if (!matchingOrgIds.has(rec.organizationId)) return false;
      if (selectedMonth !== null && rec.month !== selectedMonth) return false;
      return true;
    });

    // Helper to sum metric
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

    // Calculate Summary KPIs
    const sales = sumMetric('ALL', 'sales');
    const totalCost = sumMetric('ALL', 'total_cost');
    const hrCost = sumMetric('ALL', 'hr_cost');
    const facilityCost = sumMetric('ALL', 'facility_cost');
    const otherCost = sumMetric('ALL', 'other_cost');
    const directCost = sumMetric('DIRECT_COST', 'direct_cost');
    const indirectCost = sumMetric('INDIRECT_COST', 'indirect_cost');

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

    // Monthly Trend Data for Charts (Jan - Dec)
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
      const mDirectCost = sumMetric('DIRECT_COST', 'direct_cost', monthRecs);
      const mIndirectCost = sumMetric('INDIRECT_COST', 'indirect_cost', monthRecs);
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

    // Group Scorecard breakdown
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
    const groups = Array.from(new Set(this.organizations.map((o) => o.groupName)));

    return groups.map((grpName) => {
      const orgIds = new Set(this.organizations.filter((o) => o.groupName === grpName).map((o) => o.id));
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
        groupName: grpName,
        sales: { actual: salesAct, budget: salesBud, ach: salesAch.achievement, isFavorable: salesAch.isFavorable },
        cost: { actual: costAct, budget: costBud, ach: costAch.achievement, isFavorable: costAch.isFavorable },
        profit: { actual: gpAct, budget: gpBud, ach: profitAch.achievement, isFavorable: profitAch.isFavorable },
        margin: salesAct > 0 ? parseFloat(((gpAct / salesAct) * 100).toFixed(2)) : 0,
      };
    });
  }

  // Get full 12-month spreadsheet breakdown matrix matching the Excel hierarchy exactly
  public getFinancialMatrix(filters: {
    year?: number;
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

    // Helper to calculate row across 12 months + Full Year
    const buildRow = (
      category: 'ALL' | 'DIRECT_COST' | 'INDIRECT_COST',
      subcategory: string,
      metricKey: string,
      direction: 'higher_is_better' | 'lower_is_better',
      isCustomDerived: boolean = false,
      derivedCalculator?: (monthIndex: number | 'fullYear') => { actual: number; budget: number; isPercentage?: boolean }
    ) => {
      const monthsData: Record<number, { actual: number; budget: number; achievement: number; variance: number; isFavorable: boolean }> = {};
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
        subcategory,
        metric: metricKey,
        direction,
        isPercentage: metricKey.includes('percentage'),
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

    // Pre-aggregate base metric totals per month for fast derived calculation
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

    // 1. ALL Section
    const allRows = [
      buildRow('ALL', 'Sales', 'sales', 'higher_is_better'),
      buildRow('ALL', 'HR Cost', 'hr_cost', 'lower_is_better'),
      buildRow('ALL', 'Facility Cost', 'facility_cost', 'lower_is_better'),
      buildRow('ALL', 'Other Cost', 'other_cost', 'lower_is_better'),
      buildRow('ALL', 'Total Cost', 'total_cost', 'lower_is_better'),
      buildRow('ALL', 'GP (Gross Profit)', 'gross_profit', 'higher_is_better', true, (m) => {
        const s = getMonthTotal('ALL', 'sales', m);
        const c = getMonthTotal('ALL', 'total_cost', m);
        return { actual: s.act - c.act, budget: s.bud - c.bud };
      }),
      buildRow('ALL', 'GP %', 'gross_profit_percentage', 'higher_is_better', true, (m) => {
        const s = getMonthTotal('ALL', 'sales', m);
        const c = getMonthTotal('ALL', 'total_cost', m);
        const actGp = s.act - c.act;
        const budGp = s.bud - c.bud;
        const actPct = s.act > 0 ? (actGp / s.act) * 100 : 0;
        const budPct = s.bud > 0 ? (budGp / s.bud) * 100 : 0;
        return { actual: parseFloat(actPct.toFixed(2)), budget: parseFloat(budPct.toFixed(2)), isPercentage: true };
      }),
    ];

    // 2. DIRECT COST Section
    const directCostRows = [
      buildRow('DIRECT_COST', 'Sales', 'sales', 'higher_is_better'),
      buildRow('DIRECT_COST', 'HR Cost', 'hr_cost', 'lower_is_better'),
      buildRow('DIRECT_COST', 'Facility Cost', 'facility_cost', 'lower_is_better'),
      buildRow('DIRECT_COST', 'Other Cost', 'other_cost', 'lower_is_better'),
      buildRow('DIRECT_COST', 'Total Direct Cost', 'direct_cost', 'lower_is_better'),
      buildRow('DIRECT_COST', 'DP (Direct Profit)', 'direct_profit', 'higher_is_better', true, (m) => {
        const s = getMonthTotal('DIRECT_COST', 'sales', m);
        const dc = getMonthTotal('DIRECT_COST', 'direct_cost', m);
        return { actual: s.act - dc.act, budget: s.bud - dc.bud };
      }),
      buildRow('DIRECT_COST', 'DP %', 'direct_profit_percentage', 'higher_is_better', true, (m) => {
        const s = getMonthTotal('DIRECT_COST', 'sales', m);
        const dc = getMonthTotal('DIRECT_COST', 'direct_cost', m);
        const actDp = s.act - dc.act;
        const budDp = s.bud - dc.bud;
        const actPct = s.act > 0 ? (actDp / s.act) * 100 : 0;
        const budPct = s.bud > 0 ? (budDp / s.bud) * 100 : 0;
        return { actual: parseFloat(actPct.toFixed(2)), budget: parseFloat(budPct.toFixed(2)), isPercentage: true };
      }),
    ];

    // 3. INDIRECT COST Section
    const indirectCostRows = [
      buildRow('INDIRECT_COST', 'HR Cost', 'hr_cost', 'lower_is_better'),
      buildRow('INDIRECT_COST', 'Facility Cost', 'facility_cost', 'lower_is_better'),
      buildRow('INDIRECT_COST', 'Other Cost', 'other_cost', 'lower_is_better'),
      buildRow('INDIRECT_COST', 'Total Indirect Cost', 'indirect_cost', 'lower_is_better'),
    ];

    return {
      year,
      monthNames: monthNames.map((n, i) => ({ month: i + 1, name: `${n}-${String(year).slice(-2)}`, short: n })),
      sections: [
        {
          key: 'ALL',
          title: 'ALL (Overview & Total Operations)',
          rows: allRows,
        },
        {
          key: 'DIRECT_COST',
          title: 'DIRECT COST (Project & Delivery Execution)',
          rows: directCostRows,
        },
        {
          key: 'INDIRECT_COST',
          title: 'INDIRECT COST (Overhead, Shared Services & Admin)',
          rows: indirectCostRows,
        },
      ],
    };
  }
}

export const db = new DatabaseEngine();

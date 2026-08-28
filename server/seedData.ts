// Seed generator for realistic Indonesian Rupiah enterprise financial data
export interface OrgRecord {
  id: number;
  reportingGroup: string;
  groupName: string;
  unitName: string;
  opgName: string;
  projectName: string;
}

export interface FinRecord {
  id: number;
  organizationId: number;
  year: number;
  month: number; // 1-12
  category: 'ALL' | 'DIRECT_COST' | 'INDIRECT_COST';
  subcategory: string;
  metric: string;
  actualAmount: number;
  budgetAmount: number;
  achievementDirection: 'higher_is_better' | 'lower_is_better';
}

export function generateSeedData(): { organizations: OrgRecord[]; financialRecords: FinRecord[] } {
  const orgs: OrgRecord[] = [
    // Group A (Digital & Tech)
    {
      id: 1,
      reportingGroup: 'Group A',
      groupName: 'Digital Solutions',
      unitName: 'Unit A1 - Core Cloud',
      opgName: 'OPG Alpha',
      projectName: 'Project Alpha - Banking Core Modernization',
    },
    {
      id: 2,
      reportingGroup: 'Group A',
      groupName: 'Digital Solutions',
      unitName: 'Unit A1 - Core Cloud',
      opgName: 'OPG Alpha',
      projectName: 'Project Beta - Enterprise API Gateway',
    },
    {
      id: 3,
      reportingGroup: 'Group A',
      groupName: 'Digital Solutions',
      unitName: 'Unit A2 - AI & Analytics',
      opgName: 'OPG Beta',
      projectName: 'Project Gamma - Fraud Detection System',
    },
    {
      id: 4,
      reportingGroup: 'Group A',
      groupName: 'Digital Solutions',
      unitName: 'Unit A2 - AI & Analytics',
      opgName: 'OPG Beta',
      projectName: 'Project Delta - Customer Intelligence Hub',
    },
    // Group B (Operations & Infrastructure)
    {
      id: 5,
      reportingGroup: 'Group B',
      groupName: 'Infrastructure & Ops',
      unitName: 'Unit B1 - Network Infrastructure',
      opgName: 'OPG Gamma',
      projectName: 'Project Epsilon - Fiber Backbone Expansion',
    },
    {
      id: 6,
      reportingGroup: 'Group B',
      groupName: 'Infrastructure & Ops',
      unitName: 'Unit B1 - Network Infrastructure',
      opgName: 'OPG Gamma',
      projectName: 'Project Zeta - Edge Datacenter Nodes',
    },
    {
      id: 7,
      reportingGroup: 'Group B',
      groupName: 'Infrastructure & Ops',
      unitName: 'Unit B2 - Logistics & Facilities',
      opgName: 'OPG Delta',
      projectName: 'Project Eta - Smart Logistics Hub',
    },
    // Group C (Commercial & Enterprise)
    {
      id: 8,
      reportingGroup: 'Group C',
      groupName: 'Commercial & Sales',
      unitName: 'Unit C1 - Strategic Accounts',
      opgName: 'OPG Epsilon',
      projectName: 'Project Theta - GovTech Digital Services',
    },
    {
      id: 9,
      reportingGroup: 'Group C',
      groupName: 'Commercial & Sales',
      unitName: 'Unit C2 - Partner Ecosystem',
      opgName: 'OPG Zeta',
      projectName: 'Project Iota - Channel Partner Portal',
    },
  ];

  const financialRecords: FinRecord[] = [];
  let recordId = 1;

  const years = [2026, 2025];

  // Base monthly profiles with realistic seasonality for Indonesian enterprise finance
  const monthlySeasonality = [
    { month: 1, mult: 0.92, salesVar: 1.0617, costVar: 0.982 }, // Jan (matching prompt screenshot benchmark ~106%)
    { month: 2, mult: 0.90, salesVar: 1.0430, costVar: 0.975 },
    { month: 3, mult: 1.02, salesVar: 1.0180, costVar: 1.012 }, // Q1 close
    { month: 4, mult: 0.95, salesVar: 0.9850, costVar: 0.990 },
    { month: 5, mult: 0.98, salesVar: 1.0320, costVar: 1.025 },
    { month: 6, mult: 1.08, salesVar: 1.0740, costVar: 1.018 }, // Q2 close
    { month: 7, mult: 0.96, salesVar: 0.9620, costVar: 0.995 },
    { month: 8, mult: 1.04, salesVar: 1.0510, costVar: 0.988 },
    { month: 9, mult: 1.10, salesVar: 1.0890, costVar: 1.030 }, // Q3 close
    { month: 10, mult: 1.05, salesVar: 1.0270, costVar: 1.010 },
    { month: 11, mult: 1.15, salesVar: 1.0940, costVar: 1.042 },
    { month: 12, mult: 1.25, salesVar: 1.1120, costVar: 1.065 }, // Year-end surge
  ];

  // Base values per organization project (in IDR)
  const projectBaseBudget: Record<number, { baseSales: number; directRatio: number; gpTargetRatio: number }> = {
    1: { baseSales: 6_200_000_000, directRatio: 0.65, gpTargetRatio: 0.38 },
    2: { baseSales: 4_800_000_000, directRatio: 0.62, gpTargetRatio: 0.40 },
    3: { baseSales: 5_500_000_000, directRatio: 0.58, gpTargetRatio: 0.42 },
    4: { baseSales: 4_200_000_000, directRatio: 0.60, gpTargetRatio: 0.39 },
    5: { baseSales: 7_100_000_000, directRatio: 0.70, gpTargetRatio: 0.34 },
    6: { baseSales: 5_900_000_000, directRatio: 0.68, gpTargetRatio: 0.35 },
    7: { baseSales: 4_600_000_000, directRatio: 0.66, gpTargetRatio: 0.36 },
    8: { baseSales: 8_500_000_000, directRatio: 0.60, gpTargetRatio: 0.45 },
    9: { baseSales: 5_200_000_000, directRatio: 0.55, gpTargetRatio: 0.44 },
  };

  for (const year of years) {
    const yearScale = year === 2026 ? 1.0 : 0.88; // 2025 baseline

    for (const org of orgs) {
      const config = projectBaseBudget[org.id] || { baseSales: 5_000_000_000, directRatio: 0.62, gpTargetRatio: 0.38 };

      for (const m of monthlySeasonality) {
        const month = m.month;
        const budgetSales = Math.round(config.baseSales * m.mult * yearScale);
        
        // Random variance with seeded determinism based on org.id, year, and month
        const seedMultiplier = 1 + (((org.id * 37 + month * 19 + year * 7) % 23) - 11) * 0.008;
        const actualSales = Math.round(budgetSales * m.salesVar * seedMultiplier);

        // Cost modeling
        const targetTotalCostBudget = Math.round(budgetSales * (1 - config.gpTargetRatio));
        const directCostBudget = Math.round(targetTotalCostBudget * config.directRatio);
        const indirectCostBudget = targetTotalCostBudget - directCostBudget;

        // Breakdown direct cost budget
        const directHrBudget = Math.round(directCostBudget * 0.55);
        const directFacilityBudget = Math.round(directCostBudget * 0.25);
        const directOtherBudget = directCostBudget - directHrBudget - directFacilityBudget;

        // Breakdown indirect cost budget
        const indirectHrBudget = Math.round(indirectCostBudget * 0.50);
        const indirectFacilityBudget = Math.round(indirectCostBudget * 0.30);
        const indirectOtherBudget = indirectCostBudget - indirectHrBudget - indirectFacilityBudget;

        // Total budgets
        const totalHrBudget = directHrBudget + indirectHrBudget;
        const totalFacilityBudget = directFacilityBudget + indirectFacilityBudget;
        const totalOtherBudget = directOtherBudget + indirectOtherBudget;
        const totalCostBudget = totalHrBudget + totalFacilityBudget + totalOtherBudget;
        const grossProfitBudget = budgetSales - totalCostBudget;
        const directProfitBudget = budgetSales - directCostBudget;

        // Actual costs with variance
        const costVariance = m.costVar * (1 + (((org.id * 17 + month * 13) % 17) - 8) * 0.007);
        const directHrActual = Math.round(directHrBudget * costVariance);
        const directFacilityActual = Math.round(directFacilityBudget * costVariance * 0.99);
        const directOtherActual = Math.round(directOtherBudget * costVariance * 1.02);
        const directCostActual = directHrActual + directFacilityActual + directOtherActual;

        const indirectHrActual = Math.round(indirectHrBudget * (costVariance * 0.98));
        const indirectFacilityActual = Math.round(indirectFacilityBudget * costVariance);
        const indirectOtherActual = Math.round(indirectOtherBudget * (costVariance * 1.01));
        const indirectCostActual = indirectHrActual + indirectFacilityActual + indirectOtherActual;

        const totalHrActual = directHrActual + indirectHrActual;
        const totalFacilityActual = directFacilityActual + indirectFacilityActual;
        const totalOtherActual = directOtherActual + indirectOtherActual;
        const totalCostActual = directCostActual + indirectCostActual;
        const grossProfitActual = actualSales - totalCostActual;
        const directProfitActual = actualSales - directCostActual;

        // 1. ALL Category records
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'ALL',
          subcategory: 'Sales',
          metric: 'sales',
          actualAmount: actualSales,
          budgetAmount: budgetSales,
          achievementDirection: 'higher_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'ALL',
          subcategory: 'HR Cost',
          metric: 'hr_cost',
          actualAmount: totalHrActual,
          budgetAmount: totalHrBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'ALL',
          subcategory: 'Facility Cost',
          metric: 'facility_cost',
          actualAmount: totalFacilityActual,
          budgetAmount: totalFacilityBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'ALL',
          subcategory: 'Other Cost',
          metric: 'other_cost',
          actualAmount: totalOtherActual,
          budgetAmount: totalOtherBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'ALL',
          subcategory: 'Total Cost',
          metric: 'total_cost',
          actualAmount: totalCostActual,
          budgetAmount: totalCostBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'ALL',
          subcategory: 'Gross Profit',
          metric: 'gross_profit',
          actualAmount: grossProfitActual,
          budgetAmount: grossProfitBudget,
          achievementDirection: 'higher_is_better',
        });

        // 2. DIRECT_COST Category records
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'DIRECT_COST',
          subcategory: 'Sales',
          metric: 'sales',
          actualAmount: actualSales,
          budgetAmount: budgetSales,
          achievementDirection: 'higher_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'DIRECT_COST',
          subcategory: 'HR Cost',
          metric: 'hr_cost',
          actualAmount: directHrActual,
          budgetAmount: directHrBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'DIRECT_COST',
          subcategory: 'Facility Cost',
          metric: 'facility_cost',
          actualAmount: directFacilityActual,
          budgetAmount: directFacilityBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'DIRECT_COST',
          subcategory: 'Other Cost',
          metric: 'other_cost',
          actualAmount: directOtherActual,
          budgetAmount: directOtherBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'DIRECT_COST',
          subcategory: 'Total Direct Cost',
          metric: 'direct_cost',
          actualAmount: directCostActual,
          budgetAmount: directCostBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'DIRECT_COST',
          subcategory: 'Direct Profit',
          metric: 'direct_profit',
          actualAmount: directProfitActual,
          budgetAmount: directProfitBudget,
          achievementDirection: 'higher_is_better',
        });

        // 3. INDIRECT_COST Category records
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'INDIRECT_COST',
          subcategory: 'HR Cost',
          metric: 'hr_cost',
          actualAmount: indirectHrActual,
          budgetAmount: indirectHrBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'INDIRECT_COST',
          subcategory: 'Facility Cost',
          metric: 'facility_cost',
          actualAmount: indirectFacilityActual,
          budgetAmount: indirectFacilityBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'INDIRECT_COST',
          subcategory: 'Other Cost',
          metric: 'other_cost',
          actualAmount: indirectOtherActual,
          budgetAmount: indirectOtherBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month,
          category: 'INDIRECT_COST',
          subcategory: 'Total Indirect Cost',
          metric: 'indirect_cost',
          actualAmount: indirectCostActual,
          budgetAmount: indirectCostBudget,
          achievementDirection: 'lower_is_better',
        });
      }
    }
  }

  return { organizations: orgs, financialRecords };
}

// Seed generator for realistic Indonesian Rupiah enterprise financial data
// Exact mapping to DBeaver / Excel Columns A:Q and the 4 Standard Financial Report Tables:
// Table 1: Summary (All, Direct Cost, Indirect Cost)
// Table 2: Overview (All, Direct Cost, Indirect Cost with HR, Facility, Other, GP/DP, %GP/%DP)
// Table 3: Category Direct Cost (Sales + 15 HR Cost + 9 Facility Cost + 18 Others Cost items)
// Table 4: Category Indirect Cost (15 HR Cost + 9 Facility Cost + 18 Others Cost items)

export interface OrgRecord {
  id: number;
  reportingGroup: string;
  groupName: string;
  unitName: string;
  opgName: string;
  projectName: string;
  jobCode: string;
  business: string;
  allSites: string;
  sites: string;
  tower: string;
  industry: string;
  sources: string;
}

export interface RawLedgerItem {
  id: number;
  col_A_business: string;
  col_B_allSites: string;
  col_C_sites: string;
  col_D_tower: string;
  col_E_month: string;
  col_F_jobCode: string;
  col_G_jobName: string;
  col_H_coa: string;
  col_I_accountName: string;
  col_J_description: string;
  col_K_amount: number;
  col_L_cost: string;
  col_M_cat: string;
  col_N_operationGroup: string;
  col_O_unit: string;
  col_P_industry: string;
  col_Q_sources: string;
  year: number;
  monthNum: number;
}

export interface FinRecord {
  id: number;
  organizationId: number;
  year: number;
  month: number; // 1-12
  category: 'ALL' | 'DIRECT_COST' | 'INDIRECT_COST';
  costType: 'DIRECT' | 'INDIRECT' | 'ALL';
  groupCategory: 'SALES' | 'HR_COST' | 'FACILITY_COST' | 'OTHERS_COST' | 'SUMMARY';
  subcategory: string;
  metric: string;
  actualAmount: number;
  budgetAmount: number;
  achievementDirection: 'higher_is_better' | 'lower_is_better';
}

// Master Detailed Expense Line Items from the user report
export const DIRECT_HR_EXPENSE_ITEMS = [
  { name: 'Wages Expense', amount: 0, budget: 0 },
  { name: 'Overtime Allowance', amount: 6_056_877_502, budget: 5_800_000_000 },
  { name: 'Jamsostek', amount: 0, budget: 0 },
  { name: 'THR', amount: 11_562_314_259, budget: 11_200_000_000 },
  { name: 'Medical Expense', amount: 415_291_330, budget: 450_000_000 },
  { name: 'Compensation Cost', amount: 0, budget: 0 },
  { name: 'Performance Expense', amount: 30_155_000, budget: 35_000_000 },
  { name: 'Employee\'s Salary', amount: 3_699_518_397, budget: 3_600_000_000 },
  { name: 'Retirement Allowance', amount: 10_019_917_399, budget: 9_800_000_000 },
  { name: 'Legal Welfare Expense', amount: 13_427_619_027, budget: 13_000_000_000 },
  { name: 'Overtime', amount: 0, budget: 0 },
  { name: 'Miscelllaneous Wages', amount: 156_688_114_318, budget: 152_000_000_000 },
  { name: 'Recruiting', amount: 15_840_000, budget: 20_000_000 },
  { name: 'Training Fee', amount: 1_375_435_863, budget: 1_400_000_000 },
  { name: 'Bonus Expense', amount: 0, budget: 0 },
];

export const DIRECT_FACILITY_EXPENSE_ITEMS = [
  { name: 'Rental Expense', amount: 5_585_429_821, budget: 5_400_000_000 },
  { name: 'Maintainance Fee', amount: 1_007_634_904, budget: 980_000_000 },
  { name: 'License Expense', amount: 1_085_187_166, budget: 1_100_000_000 },
  { name: 'Depreciation Expense', amount: 8_831_546_074, budget: 8_700_000_000 },
  { name: 'Amortization Expense', amount: 0, budget: 0 },
  { name: 'Office Supplies', amount: 661_588_245, budget: 650_000_000 },
  { name: 'Office Rent', amount: 11_288_506_849, budget: 11_000_000_000 },
  { name: 'Repairs', amount: 161_610_565, budget: 180_000_000 },
  { name: 'Utilities', amount: 2_051_935_375, budget: 2_000_000_000 },
];

export const DIRECT_OTHERS_EXPENSE_ITEMS = [
  { name: 'Penalty Expense', amount: -118_373_584, budget: 0 },
  { name: 'Business / Meals / Entertainment', amount: 58_446_502, budget: 60_000_000 },
  { name: 'Travel Expense', amount: 222_322_568, budget: 240_000_000 },
  { name: 'Transportation Expense', amount: 131_932_698, budget: 140_000_000 },
  { name: 'Outsourcing Fee', amount: 0, budget: 0 },
  { name: 'Communication Expense', amount: 1_792_846_991, budget: 1_750_000_000 },
  { name: 'Network Expense', amount: 5_641_938_046, budget: 5_500_000_000 },
  { name: 'Postage Courier Expense', amount: 12_135_212, budget: 15_000_000 },
  { name: 'Donation', amount: 0, budget: 0 },
  { name: 'Miscelllaneous Expense', amount: 0, budget: 0 },
  { name: 'Office Equipment', amount: 84_169_032, budget: 90_000_000 },
  { name: 'Car Rental', amount: 89_250_000, budget: 95_000_000 },
  { name: 'Car Rental (driver\'s salary&overtime)', amount: 0, budget: 0 },
  { name: 'Car Rental Reimbursement', amount: 0, budget: 0 },
  { name: 'Other expense', amount: 356_917_165, budget: 360_000_000 },
  { name: 'Outside / Outsource Services', amount: 7_332_370_570, budget: 7_200_000_000 },
  { name: 'Membership Expense', amount: 5_000_000, budget: 5_000_000 },
  { name: 'Transportation', amount: 0, budget: 0 },
];

export const INDIRECT_HR_EXPENSE_ITEMS = [
  { name: 'Wages Expense', amount: 0, budget: 0 },
  { name: 'Overtime Allowance', amount: 19_752_044, budget: 20_000_000 },
  { name: 'Jamsostek', amount: 0, budget: 0 },
  { name: 'THR', amount: 792_297_158, budget: 780_000_000 },
  { name: 'Medical Expense', amount: 592_613_055, budget: 600_000_000 },
  { name: 'Compensation Cost', amount: 0, budget: 0 },
  { name: 'Performance Expense', amount: 0, budget: 0 },
  { name: 'Employee\'s Salary', amount: 7_093_755_928, budget: 6_950_000_000 },
  { name: 'Retirement Allowance', amount: 227_048_587, budget: 230_000_000 },
  { name: 'Legal Welfare Expense', amount: 695_878_101, budget: 700_000_000 },
  { name: 'Overtime', amount: 0, budget: 0 },
  { name: 'Miscelllaneous Wages', amount: 2_936_576_383, budget: 2_880_000_000 },
  { name: 'Recruiting', amount: 360_000, budget: 500_000 },
  { name: 'Training Fee', amount: 0, budget: 0 },
  { name: 'Bonus Expense', amount: 0, budget: 0 },
];

export const INDIRECT_FACILITY_EXPENSE_ITEMS = [
  { name: 'Rental Expense', amount: 1_282_404_979, budget: 1_250_000_000 },
  { name: 'Maintainance Fee', amount: 347_949_070, budget: 350_000_000 },
  { name: 'License Expense', amount: 289_432_353, budget: 290_000_000 },
  { name: 'Depreciation Expense', amount: -579_639_266, budget: -550_000_000 },
  { name: 'Amortization Expense', amount: 64_825_350, budget: 65_000_000 },
  { name: 'Office Supplies', amount: 220_000, budget: 300_000 },
  { name: 'Office Rent', amount: 1_976_267_382, budget: 1_950_000_000 },
  { name: 'Repairs', amount: -407_000, budget: 0 },
  { name: 'Utilities', amount: -628_850_928, budget: -600_000_000 },
];

export const INDIRECT_OTHERS_EXPENSE_ITEMS = [
  { name: 'Penalty Expense', amount: 0, budget: 0 },
  { name: 'Business / Meals / Entertainment', amount: 2_384_245, budget: 3_000_000 },
  { name: 'Travel Expense', amount: 386_155_294, budget: 390_000_000 },
  { name: 'Transportation Expense', amount: 48_259_175, budget: 50_000_000 },
  { name: 'Outsourcing Fee', amount: 0, budget: 0 },
  { name: 'Communication Expense', amount: 19_433_063, budget: 20_000_000 },
  { name: 'Network Expense', amount: 575_163_927, budget: 560_000_000 },
  { name: 'Postage Courier Expense', amount: 722_175, budget: 1_000_000 },
  { name: 'Donation', amount: 0, budget: 0 },
  { name: 'Miscelllaneous Expense', amount: 0, budget: 0 },
  { name: 'Office Equipment', amount: 24_815_000, budget: 25_000_000 },
  { name: 'Car Rental', amount: 52_150_000, budget: 55_000_000 },
  { name: 'Car Rental (driver\'s salary&overtime)', amount: 87_809_100, budget: 85_000_000 },
  { name: 'Car Rental Reimbursement', amount: 8_967_500, budget: 10_000_000 },
  { name: 'Other expense', amount: 80_532_688, budget: 80_000_000 },
  { name: 'Outside / Outsource Services', amount: 446_308_008, budget: 440_000_000 },
  { name: 'Membership Expense', amount: 0, budget: 0 },
  { name: 'Transportation', amount: 0, budget: 0 },
];

export function generateSeedData(): {
  organizations: OrgRecord[];
  financialRecords: FinRecord[];
  rawLedgerRecords: RawLedgerItem[];
} {
  const orgs: OrgRecord[] = [
    {
      id: 1,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 3',
      opgName: 'OPG 1 UNIT 3',
      projectName: 'MMKSI - INBOUND CALL',
      jobCode: '33103',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'Automotive',
      sources: 'LOCAL SERVICES MMKSI Inbound',
    },
    {
      id: 2,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 3',
      opgName: 'OPG 1 UNIT 3',
      projectName: 'MMKSI TELESURVEY',
      jobCode: '33102',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE CLIENTS',
      tower: 'CLIENTS',
      industry: 'Automotive',
      sources: 'LOCAL SERVICES MMKSI Telesurvey',
    },
    {
      id: 3,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 8',
      opgName: 'OPG 2 UNIT 8',
      projectName: 'MAP ACTIVE',
      jobCode: '39202',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE TYT',
      tower: 'TYT',
      industry: 'EC & Distributor',
      sources: 'LOCAL SERVICES MAP Active',
    },
    {
      id: 4,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 1',
      opgName: 'OPG 1 UNIT 1',
      projectName: 'PANASONIC',
      jobCode: '31102',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MIT',
      tower: 'MIT',
      industry: 'Home Appliance',
      sources: 'LOCAL SERVICES Panasonic',
    },
    {
      id: 5,
      reportingGroup: 'GLOBAL CENTER SERVICES',
      groupName: 'GLOBAL CENTER SERVICES',
      unitName: 'UNIT 8',
      opgName: 'OPG 1 UNIT 8',
      projectName: 'TRIP.COM',
      jobCode: '39201',
      business: 'GLOBAL CENTER SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE TYT',
      tower: 'TYT',
      industry: 'Travel & Hospitality',
      sources: 'GLOBAL SERVICES: Trip.com',
    },
    {
      id: 6,
      reportingGroup: 'GLOBAL CENTER SERVICES',
      groupName: 'GLOBAL CENTER SERVICES',
      unitName: 'UNIT 5',
      opgName: 'OPG 4 UNIT 5',
      projectName: 'TEMU - Semarang',
      jobCode: '135401',
      business: 'GLOBAL CENTER SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE UTC',
      tower: 'UTC',
      industry: 'EC & Distributor',
      sources: 'GLOBAL SERVICES: Temu Semarang',
    },
    {
      id: 7,
      reportingGroup: 'GLOBAL CENTER SERVICES',
      groupName: 'GLOBAL CENTER SERVICES',
      unitName: 'UNIT 5',
      opgName: 'OPG 4 UNIT 5',
      projectName: 'TEMU - Jakarta',
      jobCode: '35401',
      business: 'GLOBAL CENTER SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'EC & Distributor',
      sources: 'GLOBAL SERVICES: Temu Jkt',
    },
    {
      id: 8,
      reportingGroup: 'GLOBAL CENTER SERVICES',
      groupName: 'GLOBAL CENTER SERVICES',
      unitName: 'UNIT 7',
      opgName: 'OPG 1 UNIT 7',
      projectName: 'LAZADA BIZRISK',
      jobCode: '39102',
      business: 'GLOBAL CENTER SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE TYT',
      tower: 'TYT',
      industry: 'EC & Distributor',
      sources: 'GLOBAL SERVICES: Lazada Business Risk',
    },
    {
      id: 9,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 1',
      opgName: 'OPG 4 UNIT 1',
      projectName: 'INDOFOOD',
      jobCode: '32301',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'FMCG',
      sources: 'LOCAL SERVICES Indofood',
    },
    {
      id: 10,
      reportingGroup: 'BPO SERVICES',
      groupName: 'BPO SERVICES',
      unitName: 'UNIT 10',
      opgName: 'OPG 1 UNIT 10',
      projectName: 'AJINOMOTO',
      jobCode: '61101',
      business: 'BPO SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE CLIENTS',
      tower: 'CLIENTS',
      industry: 'Others',
      sources: 'BPO SERVICES Ajinomoto',
    },
    {
      id: 11,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 3',
      opgName: 'OPG 1 UNIT 3',
      projectName: 'BAF',
      jobCode: '32303',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'Finance',
      sources: 'LOCAL SERVICES BAF',
    },
    {
      id: 12,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 3',
      opgName: 'OPG 1 UNIT 3',
      projectName: 'DIPO STAR FINANCE',
      jobCode: '33302',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'Finance',
      sources: 'LOCAL SERVICES Dipo Star Finance',
    },
    {
      id: 13,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 3',
      opgName: 'OPG 1 UNIT 3',
      projectName: 'DIPO STAR CONTACT CENTER',
      jobCode: '33307',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'Finance',
      sources: 'LOCAL SERVICES Dipo Star CC',
    },
    {
      id: 14,
      reportingGroup: 'LOCAL SERVICES',
      groupName: 'LOCAL SERVICES',
      unitName: 'UNIT 3',
      opgName: 'OPG 1 UNIT 3',
      projectName: 'ICI PAINTS',
      jobCode: '33301',
      business: 'LOCAL SERVICES',
      allSites: 'ALL SITES',
      sites: 'CX SQUARE MTEN',
      tower: 'MTEN',
      industry: 'Home Appliance',
      sources: 'LOCAL SERVICES ICI Paints',
    },
  ];

  // Distribution weights across 14 projects (normalized to 1.0)
  const projectWeights: Record<number, number> = {
    1: 0.055,  // MMKSI Inbound
    2: 0.038,  // MMKSI Telesurvey
    3: 0.082,  // MAP Active
    4: 0.070,  // Panasonic
    5: 0.105,  // Trip.com
    6: 0.165,  // Temu Semarang
    7: 0.180,  // Temu Jakarta
    8: 0.090,  // Lazada BizRisk
    9: 0.115,  // Indofood
    10: 0.040, // Ajinomoto
    11: 0.015, // BAF
    12: 0.018, // Dipo Star Finance
    13: 0.012, // Dipo Star CC
    14: 0.015, // ICI Paints
  };

  // Monthly distribution weights (12 months, summing to 1.0)
  const monthWeights: Record<number, number> = {
    1: 0.076,
    2: 0.074,
    3: 0.082,
    4: 0.078,
    5: 0.080,
    6: 0.088,
    7: 0.079,
    8: 0.085,
    9: 0.090,
    10: 0.086,
    11: 0.092,
    12: 0.090,
  };

  const monthNames = [
    { num: 1, label: 'Jan 26', label25: 'Jan 25' },
    { num: 2, label: 'Feb 26', label25: 'Feb 25' },
    { num: 3, label: 'Mar 26', label25: 'Mar 25' },
    { num: 4, label: 'Apr 26', label25: 'Apr 25' },
    { num: 5, label: 'May 26', label25: 'May 25' },
    { num: 6, label: 'Jun 26', label25: 'Jun 25' },
    { num: 7, label: 'Jul 26', label25: 'Jul 25' },
    { num: 8, label: 'Aug 26', label25: 'Aug 25' },
    { num: 9, label: 'Sep 26', label25: 'Sep 25' },
    { num: 10, label: 'Oct 26', label25: 'Oct 25' },
    { num: 11, label: 'Nov 26', label25: 'Nov 25' },
    { num: 12, label: 'Dec 26', label25: 'Dec 25' },
  ];

  const financialRecords: FinRecord[] = [];
  const rawLedgerRecords: RawLedgerItem[] = [];
  let recordId = 1;
  let rawLedgerId = 1;

  const years = [2026, 2025];
  const TARGET_2026_SALES = 332_939_656_263;
  const BUDGET_2026_SALES = 325_000_000_000;

  for (const year of years) {
    const yearScale = year === 2026 ? 1.0 : 0.88;
    const yearSalesActual = Math.round(TARGET_2026_SALES * yearScale);
    const yearSalesBudget = Math.round(BUDGET_2026_SALES * yearScale);

    for (const org of orgs) {
      const pWeight = projectWeights[org.id] || (1 / orgs.length);

      for (const m of monthNames) {
        const mWeight = monthWeights[m.num] || (1 / 12);
        const monthText = year === 2026 ? m.label : m.label25;
        const cellRatio = pWeight * mWeight;

        // Sales for this project/month
        const cellSalesActual = Math.round(yearSalesActual * cellRatio);
        const cellSalesBudget = Math.round(yearSalesBudget * cellRatio);

        // 1. Direct HR items
        let cellDirectHrActual = 0;
        let cellDirectHrBudget = 0;
        for (const item of DIRECT_HR_EXPENSE_ITEMS) {
          const act = Math.round(item.amount * yearScale * cellRatio);
          const bud = Math.round(item.budget * yearScale * cellRatio);
          cellDirectHrActual += act;
          cellDirectHrBudget += bud;

          financialRecords.push({
            id: recordId++,
            organizationId: org.id,
            year,
            month: m.num,
            category: 'DIRECT_COST',
            costType: 'DIRECT',
            groupCategory: 'HR_COST',
            subcategory: item.name,
            metric: `direct_hr_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            actualAmount: act,
            budgetAmount: bud,
            achievementDirection: 'lower_is_better',
          });
        }

        // 2. Direct Facility items
        let cellDirectFacilityActual = 0;
        let cellDirectFacilityBudget = 0;
        for (const item of DIRECT_FACILITY_EXPENSE_ITEMS) {
          const act = Math.round(item.amount * yearScale * cellRatio);
          const bud = Math.round(item.budget * yearScale * cellRatio);
          cellDirectFacilityActual += act;
          cellDirectFacilityBudget += bud;

          financialRecords.push({
            id: recordId++,
            organizationId: org.id,
            year,
            month: m.num,
            category: 'DIRECT_COST',
            costType: 'DIRECT',
            groupCategory: 'FACILITY_COST',
            subcategory: item.name,
            metric: `direct_facility_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            actualAmount: act,
            budgetAmount: bud,
            achievementDirection: 'lower_is_better',
          });
        }

        // 3. Direct Others items
        let cellDirectOthersActual = 0;
        let cellDirectOthersBudget = 0;
        for (const item of DIRECT_OTHERS_EXPENSE_ITEMS) {
          const act = Math.round(item.amount * yearScale * cellRatio);
          const bud = Math.round(item.budget * yearScale * cellRatio);
          cellDirectOthersActual += act;
          cellDirectOthersBudget += bud;

          financialRecords.push({
            id: recordId++,
            organizationId: org.id,
            year,
            month: m.num,
            category: 'DIRECT_COST',
            costType: 'DIRECT',
            groupCategory: 'OTHERS_COST',
            subcategory: item.name,
            metric: `direct_others_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            actualAmount: act,
            budgetAmount: bud,
            achievementDirection: 'lower_is_better',
          });
        }

        // 4. Indirect HR items
        let cellIndirectHrActual = 0;
        let cellIndirectHrBudget = 0;
        for (const item of INDIRECT_HR_EXPENSE_ITEMS) {
          const act = Math.round(item.amount * yearScale * cellRatio);
          const bud = Math.round(item.budget * yearScale * cellRatio);
          cellIndirectHrActual += act;
          cellIndirectHrBudget += bud;

          financialRecords.push({
            id: recordId++,
            organizationId: org.id,
            year,
            month: m.num,
            category: 'INDIRECT_COST',
            costType: 'INDIRECT',
            groupCategory: 'HR_COST',
            subcategory: item.name,
            metric: `indirect_hr_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            actualAmount: act,
            budgetAmount: bud,
            achievementDirection: 'lower_is_better',
          });
        }

        // 5. Indirect Facility items
        let cellIndirectFacilityActual = 0;
        let cellIndirectFacilityBudget = 0;
        for (const item of INDIRECT_FACILITY_EXPENSE_ITEMS) {
          const act = Math.round(item.amount * yearScale * cellRatio);
          const bud = Math.round(item.budget * yearScale * cellRatio);
          cellIndirectFacilityActual += act;
          cellIndirectFacilityBudget += bud;

          financialRecords.push({
            id: recordId++,
            organizationId: org.id,
            year,
            month: m.num,
            category: 'INDIRECT_COST',
            costType: 'INDIRECT',
            groupCategory: 'FACILITY_COST',
            subcategory: item.name,
            metric: `indirect_facility_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            actualAmount: act,
            budgetAmount: bud,
            achievementDirection: 'lower_is_better',
          });
        }

        // 6. Indirect Others items
        let cellIndirectOthersActual = 0;
        let cellIndirectOthersBudget = 0;
        for (const item of INDIRECT_OTHERS_EXPENSE_ITEMS) {
          const act = Math.round(item.amount * yearScale * cellRatio);
          const bud = Math.round(item.budget * yearScale * cellRatio);
          cellIndirectOthersActual += act;
          cellIndirectOthersBudget += bud;

          financialRecords.push({
            id: recordId++,
            organizationId: org.id,
            year,
            month: m.num,
            category: 'INDIRECT_COST',
            costType: 'INDIRECT',
            groupCategory: 'OTHERS_COST',
            subcategory: item.name,
            metric: `indirect_others_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            actualAmount: act,
            budgetAmount: bud,
            achievementDirection: 'lower_is_better',
          });
        }

        // Combined Totals
        const cellDirectTotalCostAct = cellDirectHrActual + cellDirectFacilityActual + cellDirectOthersActual;
        const cellDirectTotalCostBud = cellDirectHrBudget + cellDirectFacilityBudget + cellDirectOthersBudget;

        const cellIndirectTotalCostAct = cellIndirectHrActual + cellIndirectFacilityActual + cellIndirectOthersActual;
        const cellIndirectTotalCostBud = cellIndirectHrBudget + cellIndirectFacilityBudget + cellIndirectOthersBudget;

        const cellTotalCostAct = cellDirectTotalCostAct + cellIndirectTotalCostAct;
        const cellTotalCostBud = cellDirectTotalCostBud + cellIndirectTotalCostBud;

        const cellTotalHrAct = cellDirectHrActual + cellIndirectHrActual;
        const cellTotalHrBud = cellDirectHrBudget + cellIndirectHrBudget;

        const cellTotalFacilityAct = cellDirectFacilityActual + cellIndirectFacilityActual;
        const cellTotalFacilityBud = cellDirectFacilityBudget + cellIndirectFacilityBudget;

        const cellTotalOthersAct = cellDirectOthersActual + cellIndirectOthersActual;
        const cellTotalOthersBud = cellDirectOthersBudget + cellIndirectOthersBudget;

        // Add Sales records
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'ALL',
          costType: 'ALL',
          groupCategory: 'SALES',
          subcategory: 'Sales',
          metric: 'sales',
          actualAmount: cellSalesActual,
          budgetAmount: cellSalesBudget,
          achievementDirection: 'higher_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'DIRECT_COST',
          costType: 'DIRECT',
          groupCategory: 'SALES',
          subcategory: 'Sales',
          metric: 'direct_sales',
          actualAmount: cellSalesActual,
          budgetAmount: cellSalesBudget,
          achievementDirection: 'higher_is_better',
        });

        // Add Mid-level Summary Metrics for ALL
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'ALL',
          costType: 'ALL',
          groupCategory: 'HR_COST',
          subcategory: 'HR Cost',
          metric: 'hr_cost',
          actualAmount: cellTotalHrAct,
          budgetAmount: cellTotalHrBud,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'ALL',
          costType: 'ALL',
          groupCategory: 'FACILITY_COST',
          subcategory: 'Facility Cost',
          metric: 'facility_cost',
          actualAmount: cellTotalFacilityAct,
          budgetAmount: cellTotalFacilityBud,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'ALL',
          costType: 'ALL',
          groupCategory: 'OTHERS_COST',
          subcategory: 'Other Cost',
          metric: 'other_cost',
          actualAmount: cellTotalOthersAct,
          budgetAmount: cellTotalOthersBud,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'ALL',
          costType: 'ALL',
          groupCategory: 'SUMMARY',
          subcategory: 'Total Cost',
          metric: 'total_cost',
          actualAmount: cellTotalCostAct,
          budgetAmount: cellTotalCostBud,
          achievementDirection: 'lower_is_better',
        });

        // Direct Cost Category Rollups
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'DIRECT_COST',
          costType: 'DIRECT',
          groupCategory: 'HR_COST',
          subcategory: 'HR Cost',
          metric: 'direct_hr_cost',
          actualAmount: cellDirectHrActual,
          budgetAmount: cellDirectHrBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'DIRECT_COST',
          costType: 'DIRECT',
          groupCategory: 'FACILITY_COST',
          subcategory: 'Facility Cost',
          metric: 'direct_facility_cost',
          actualAmount: cellDirectFacilityActual,
          budgetAmount: cellDirectFacilityBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'DIRECT_COST',
          costType: 'DIRECT',
          groupCategory: 'OTHERS_COST',
          subcategory: 'Other Cost',
          metric: 'direct_other_cost',
          actualAmount: cellDirectOthersActual,
          budgetAmount: cellDirectOthersBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'DIRECT_COST',
          costType: 'DIRECT',
          groupCategory: 'SUMMARY',
          subcategory: 'Total Cost (Direct Cost)',
          metric: 'total_direct_cost',
          actualAmount: cellDirectTotalCostAct,
          budgetAmount: cellDirectTotalCostBud,
          achievementDirection: 'lower_is_better',
        });

        // Indirect Cost Category Rollups
        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'INDIRECT_COST',
          costType: 'INDIRECT',
          groupCategory: 'HR_COST',
          subcategory: 'HR Cost',
          metric: 'indirect_hr_cost',
          actualAmount: cellIndirectHrActual,
          budgetAmount: cellIndirectHrBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'INDIRECT_COST',
          costType: 'INDIRECT',
          groupCategory: 'FACILITY_COST',
          subcategory: 'Facility Cost',
          metric: 'indirect_facility_cost',
          actualAmount: cellIndirectFacilityActual,
          budgetAmount: cellIndirectFacilityBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'INDIRECT_COST',
          costType: 'INDIRECT',
          groupCategory: 'OTHERS_COST',
          subcategory: 'Other Cost',
          metric: 'indirect_other_cost',
          actualAmount: cellIndirectOthersActual,
          budgetAmount: cellIndirectOthersBudget,
          achievementDirection: 'lower_is_better',
        });

        financialRecords.push({
          id: recordId++,
          organizationId: org.id,
          year,
          month: m.num,
          category: 'INDIRECT_COST',
          costType: 'INDIRECT',
          groupCategory: 'SUMMARY',
          subcategory: 'Total Cost (Indirect Cost)',
          metric: 'total_indirect_cost',
          actualAmount: cellIndirectTotalCostAct,
          budgetAmount: cellIndirectTotalCostBud,
          achievementDirection: 'lower_is_better',
        });

        // 7. Push Raw Ledger Records for DBeaver A:Q table
        const orderNum = `SO-${year}-${String(1000 + org.id * 10 + m.num).padStart(5, '0')}`;

        // Sales
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '400000',
          col_I_accountName: 'Sales',
          col_J_description: `Order ${orderNum} - Monthly Invoicing`,
          col_K_amount: cellSalesActual,
          col_L_cost: 'Direct Cost',
          col_M_cat: 'SALES',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });

        // Direct HR Cost
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '510000',
          col_I_accountName: 'Direct HR Cost',
          col_J_description: `Payroll & Shift Allowance ${monthText}`,
          col_K_amount: cellDirectHrActual,
          col_L_cost: 'Direct Cost',
          col_M_cat: 'HR COST',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });

        // Direct Facility Cost
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '520000',
          col_I_accountName: 'Direct Facility Cost',
          col_J_description: `Seat Lease & Power ${monthText}`,
          col_K_amount: cellDirectFacilityActual,
          col_L_cost: 'Direct Cost',
          col_M_cat: 'FACILITY COST',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });

        // Direct Other Cost
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '530000',
          col_I_accountName: 'Direct Other Cost',
          col_J_description: `Software & Telecom Services ${monthText}`,
          col_K_amount: cellDirectOthersActual,
          col_L_cost: 'Direct Cost',
          col_M_cat: 'OTHER COST',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });

        // Indirect HR Cost
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '610000',
          col_I_accountName: 'Indirect HR Cost',
          col_J_description: `Corporate HR Overhead ${monthText}`,
          col_K_amount: cellIndirectHrActual,
          col_L_cost: 'Indirect Cost',
          col_M_cat: 'HR COST',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });

        // Indirect Facility Cost
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '620000',
          col_I_accountName: 'Indirect Facility Cost',
          col_J_description: `Building Maintenance & Utilities ${monthText}`,
          col_K_amount: cellIndirectFacilityActual,
          col_L_cost: 'Indirect Cost',
          col_M_cat: 'FACILITY COST',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });

        // Indirect Other Cost
        rawLedgerRecords.push({
          id: rawLedgerId++,
          col_A_business: org.business,
          col_B_allSites: org.allSites,
          col_C_sites: org.sites,
          col_D_tower: org.tower,
          col_E_month: monthText,
          col_F_jobCode: org.jobCode,
          col_G_jobName: org.projectName,
          col_H_coa: '630000',
          col_I_accountName: 'Indirect Other Cost',
          col_J_description: `General Corporate Services ${monthText}`,
          col_K_amount: cellIndirectOthersActual,
          col_L_cost: 'Indirect Cost',
          col_M_cat: 'OTHER COST',
          col_N_operationGroup: org.opgName,
          col_O_unit: org.unitName,
          col_P_industry: org.industry,
          col_Q_sources: org.sources,
          year,
          monthNum: m.num,
        });
      }
    }
  }

  return { organizations: orgs, financialRecords, rawLedgerRecords };
}

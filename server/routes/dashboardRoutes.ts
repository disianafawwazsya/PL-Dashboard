import { Router, Request, Response } from 'express';
import { db } from '../db.ts';

const router = Router();

// GET /api/filters - Returns dynamic hierarchy options
router.get('/filters', (req: Request, res: Response) => {
  try {
    const filterTree = db.getFilterTree();
    res.json({
      success: true,
      data: filterTree,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/raw-ledger - Returns paginated DBeaver database records (Columns A:Q)
router.get('/raw-ledger', (req: Request, res: Response) => {
  try {
    const {
      page,
      pageSize,
      search,
      year,
      month,
      business,
      sites,
      tower,
      industry,
      jobCode,
      cat,
      cost,
      unit,
      opg,
    } = req.query;

    const result = db.getRawLedger({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 50,
      search: search as string,
      year: year ? Number(year) : 2026,
      month: month as string,
      business: business as string,
      sites: sites as string,
      tower: tower as string,
      industry: industry as string,
      jobCode: jobCode as string,
      cat: cat as string,
      cost: cost as string,
      unit: unit as string,
      opg: opg as string,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/dashboard - Returns aggregated KPI metrics and monthly trend
router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const {
      year,
      month,
      business,
      sites,
      tower,
      industry,
      jobCode,
      reportingGroup,
      group,
      unit,
      opg,
      project,
    } = req.query;

    const summary = db.getDashboardData({
      year: year ? Number(year) : 2026,
      month: (month as string) || 'ALL',
      business: (business as string) || 'ALL',
      sites: (sites as string) || 'ALL',
      tower: (tower as string) || 'ALL',
      industry: (industry as string) || 'ALL',
      jobCode: (jobCode as string) || 'ALL',
      reportingGroup: (reportingGroup as string) || 'ALL',
      group: (group as string) || 'ALL',
      unit: (unit as string) || 'ALL',
      opg: (opg as string) || 'ALL',
      project: (project as string) || 'ALL',
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/financial-performance - Returns full 12-month matrix breakdown
router.get('/financial-performance', (req: Request, res: Response) => {
  try {
    const {
      year,
      business,
      sites,
      tower,
      industry,
      jobCode,
      reportingGroup,
      group,
      unit,
      opg,
      project,
    } = req.query;

    const matrix = db.getFinancialMatrix({
      year: year ? Number(year) : 2026,
      business: (business as string) || 'ALL',
      sites: (sites as string) || 'ALL',
      tower: (tower as string) || 'ALL',
      industry: (industry as string) || 'ALL',
      jobCode: (jobCode as string) || 'ALL',
      reportingGroup: (reportingGroup as string) || 'ALL',
      group: (group as string) || 'ALL',
      unit: (unit as string) || 'ALL',
      opg: (opg as string) || 'ALL',
      project: (project as string) || 'ALL',
    });

    res.json({
      success: true,
      data: matrix,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/organization - Returns organization hierarchy
router.get('/organization', (req: Request, res: Response) => {
  try {
    const organizations = db.getOrganizations();
    res.json({
      success: true,
      data: organizations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/seed - Re-initialize database
router.post('/seed', (req: Request, res: Response) => {
  try {
    db.initialize();
    res.json({
      success: true,
      message: 'Database re-seeded successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

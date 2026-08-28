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

// GET /api/dashboard - Returns aggregated KPI metrics and monthly trend
router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const { year, month, reportingGroup, group, unit, opg, project } = req.query;

    const summary = db.getDashboardData({
      year: year ? Number(year) : 2026,
      month: (month as string) || 'ALL',
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
    const { year, reportingGroup, group, unit, opg, project } = req.query;

    const matrix = db.getFinancialMatrix({
      year: year ? Number(year) : 2026,
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

# Financial Performance Dashboard

A modern, production-ready enterprise financial performance monitoring web application built with **React, Vite, TypeScript, Tailwind CSS, Recharts, Node.js, Express, and PostgreSQL / Prisma**.

---

## 🌟 Features

- **Actual vs Budget & Achievement %**: Real-time performance tracking with direction-aware conditional formatting (`higher_is_better` for Sales/Profit, `lower_is_better` for Costs).
- **7-Dimension Cascading Hierarchy**: Dynamic filters for `Reporting Group` ➔ `Group` ➔ `Unit` ➔ `OPG` ➔ `Project` ➔ `Fiscal Year` ➔ `Month`.
- **Horizontal 12-Month Matrix**: Horizontally scrollable spreadsheet breakdown with sticky headers, sticky category columns, expandable accordion sections (`ALL`, `DIRECT COST`, `INDIRECT COST`), and CSV export.
- **Executive KPI Cards**: Real-time summary cards for Sales, Cost, Gross Profit (GP), Direct Profit (DP), with Indonesian Rupiah formatting (`Rp 44.11 B` or `Rp 44,110,887,897`).
- **Interactive Visual Charts**: 4 Recharts visualizations for Sales Actual vs Budget, Cost breakdown, Gross Profit & GP Margin combo, and 12-month Achievement % trend with target benchmark.
- **Multi-Level Drilldown & Breadcrumbs**: Navigate from Enterprise root (`ALL`) down to specific projects and back in 1 click.
- **Group Comparison Scorecards**: Side-by-side performance cards for quick business unit benchmarking.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Animation**: Motion

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: PostgreSQL (with Prisma ORM schema & automated relational query engine)
- **API**: REST API endpoints with parameterized querying & SQL aggregation

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm
- (Optional) PostgreSQL instance

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financial_db"
```

### 4. Running the Development Server
```bash
npm run dev
```
The server starts at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Database Setup & Migrations

### PostgreSQL Table Schema
The SQL schema is located in `db/schema.sql` and the Prisma schema in `prisma/schema.prisma`.

To run migrations with Prisma:
```bash
npx prisma migrate dev --name init
```

To view data in Prisma Studio:
```bash
npx prisma studio
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/filters` | Dynamic cascading hierarchy filter tree |
| `GET` | `/api/dashboard?year=2026&group=ALL...` | Executive KPIs, monthly trends, and scorecards |
| `GET` | `/api/financial-performance?year=2026` | 12-month full financial matrix breakdown |
| `GET` | `/api/organization` | Complete organizational directory |
| `POST` | `/api/seed` | Reset & re-seed database with realistic enterprise data |
| `GET` | `/api/health` | Service health status |

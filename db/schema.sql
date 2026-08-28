-- PostgreSQL Schema for Financial Performance Dashboard

CREATE TABLE IF NOT EXISTS organization (
    id SERIAL PRIMARY KEY,
    reporting_group VARCHAR(100) NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    unit_name VARCHAR(100) NOT NULL,
    opg_name VARCHAR(100) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_hierarchy ON organization(reporting_group, group_name, unit_name, opg_name, project_name);

CREATE TABLE IF NOT EXISTS financial_performance (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    metric VARCHAR(100) NOT NULL,
    actual_amount BIGINT NOT NULL,
    budget_amount BIGINT NOT NULL,
    achievement_direction VARCHAR(30) DEFAULT 'higher_is_better' CHECK (achievement_direction IN ('higher_is_better', 'lower_is_better')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fin_year_month ON financial_performance(year, month);
CREATE INDEX IF NOT EXISTS idx_fin_metric ON financial_performance(category, metric);
CREATE INDEX IF NOT EXISTS idx_fin_org_year ON financial_performance(organization_id, year, month);

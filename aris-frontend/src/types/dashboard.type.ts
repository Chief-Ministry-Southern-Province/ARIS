export interface DashboardTrendPoint {
  month: string;
  accidents: number;
  losses: number;
}

export interface DashboardStatistics {
  total_incidents: number;
  open_investigations: number;
  pending_approvals: number;
  completed_cases: number;
  total_losses: number;
  recoveries: number;
  accident_trends: DashboardTrendPoint[];
  fiscal_year_start: string;
  fiscal_year_end: string;
}

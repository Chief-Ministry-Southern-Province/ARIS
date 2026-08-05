export interface DashboardTrendPoint {
  month: string;
  accidents: number;
  losses: number;
}

export interface VehicleRiskPoint {
  vehicle: string;
  incidents: number;
  risk: number;
}

export interface DashboardStatistics {
  total_incidents: number;
  open_investigations: number;
  pending_approvals: number;
  completed_cases: number;
  total_losses: number;
  recoveries: number;
  accident_trends: DashboardTrendPoint[];
  vehicle_risks: VehicleRiskPoint[];
  fiscal_year_start: string;
  fiscal_year_end: string;
}

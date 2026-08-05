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

export interface RecentActivityPoint {
  id: number;
  action: string;
  description: string;
  case_number: string | null;
  user_name: string | null;
  created_at: string;
}

export interface RecentCasePoint {
  id: number;
  case_number: string;
  incident: string | null;
  location: string | null;
  accident_date: string | null;
  institution: string | null;
  stage: string;
  status: string;
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
  recent_activities: RecentActivityPoint[];
  recent_cases: RecentCasePoint[];
  fiscal_year_start: string;
  fiscal_year_end: string;
}

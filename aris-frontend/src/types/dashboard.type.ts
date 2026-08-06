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

export interface DashboardHotspotPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  count: number;
  risk: "HIGH" | "MEDIUM" | "LOW";
}

export interface OverdueApprovalPoint {
  id: number;
  case_number: string | null;
  document_type: string;
  revision: number;
  step: number;
  approver_name: string | null;
  waiting_hours: number;
}

export interface CaseStageFunnelPoint {
  stage: string;
  label: string;
  count: number;
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
  hotspots: DashboardHotspotPoint[];
  overdue_approvals: OverdueApprovalPoint[];
  case_stage_funnel: CaseStageFunnelPoint[];
  fiscal_year_start: string;
  fiscal_year_end: string;
}

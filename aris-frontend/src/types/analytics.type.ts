export interface AnalyticsKpi {
  value: number;
  change_percentage: number | null;
}

export interface AccidentFrequencyTrendPoint {
  month: string;
  accidents: number;
}

export interface CostAnalysisTrendPoint {
  month: string;
  losses: number;
  recoveries: number;
}

export interface RecoveryAnalysisTrendPoint {
  month: string;
  recoveries: number;
}

export interface LossDistributionPoint {
  name: string;
  value: number;
}

export interface HighRiskVehicleTypePoint {
  vehicle: string;
  incidents: number;
  risk: number;
}

export interface AnalyticsHotspotPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  count: number;
  risk: "HIGH" | "MEDIUM" | "LOW";
}

export interface RepeatIncidentDriverPoint {
  id: number;
  driver: string;
  institution: string;
  incidents: number;
}

export interface InstitutionComparisonPoint {
  id: number;
  name: string;
  accidents: number;
  losses: number;
}

export interface AnalyticsContext {
  period: string;
  period_start: string;
  period_end: string;
  available_periods: string[];
  accessible_institution_count: number;
  kpis: {
    monthly_accident_frequency: AnalyticsKpi;
    high_risk_vehicles: AnalyticsKpi;
    total_cost_impact: AnalyticsKpi;
    recovery_rate: AnalyticsKpi;
  };
  accident_frequency_trend: AccidentFrequencyTrendPoint[];
  cost_analysis_trend: CostAnalysisTrendPoint[];
  recovery_analysis_trend: RecoveryAnalysisTrendPoint[];
  loss_distribution: LossDistributionPoint[];
  high_risk_vehicle_types: HighRiskVehicleTypePoint[];
  hotspots: AnalyticsHotspotPoint[];
  repeat_incident_drivers: RepeatIncidentDriverPoint[];
  institution_comparison: InstitutionComparisonPoint[];
}

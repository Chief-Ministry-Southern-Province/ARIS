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
}

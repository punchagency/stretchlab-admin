// Analytics Types
export interface OpportunityItem {
  opportunity: string;
  percentage: number;
}

export interface LocationItem {
  location: string;
  percentage: number;
}

export interface FlexologistItem {
  flexologist: string;
  percentage: number;
}

export interface RPAAuditResponse {
  flexologist: FlexologistItem[];
  location: LocationItem[];
  note_opportunities: OpportunityItem[];
  status: string;
  total_notes: number;
  total_notes_with_opportunities: number;
  total_quality_notes: number;
}

export interface RPAAuditParams {
  duration: string;
  location?: string;
  flexologist_name?: string;
  start_date?: string;
  end_date?: string;
  filter_metric?: string;
}

export interface RPAAuditDetailsParams {
  opportunity: string;
  duration: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  flexologist_name?: string;
}

export interface RPAAuditDetailsResponse {
  flexologist: FlexologistItem[];
  location: LocationItem[];
  status: string;
}

// Ranking Analytics Types
export interface RankingItem {
  count: number;
  name: string;
}

export interface RankingAnalyticsResponse {
  data: RankingItem[];
  metric: string;
  status: string;
}

export interface RankingAnalyticsParams {
  rank_by: string;
  metric: string;
  duration: string;
  start_date?: string;
  end_date?: string;
  filter_metric?: string;
}

// Chart Data Types
export interface AnalyticsChartDataPoint {
  name: string;
  value: number;
  total?: number;
}

// Drilldown Types
export interface DrilldownItem {
  name: string;
  value: string;
}

export interface DrilldownData {
  locations: DrilldownItem[];
  flexologists: DrilldownItem[];
} 
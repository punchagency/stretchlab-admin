import { api } from './api';
import type { 
  ChartFiltersResponse, 
  RPAAuditResponse, 
  RPAAuditDetailsParams, 
  RPAAuditDetailsResponse,
  RankingAnalyticsResponse,
  RankingAnalyticsParams
} from '@/types';

export const getChartFilters = async (): Promise<ChartFiltersResponse> => {
  const response = await api.get('/admin/dashboard/get_chart_filters');
  return response.data;
};

export const getRPAAudit = async (duration: string): Promise<RPAAuditResponse> => {
  const response = await api.get(`/admin/analytics/rpa_audit?duration=${duration}`);
  return response.data;
};

export const getRPAAuditDetails = async (params: RPAAuditDetailsParams): Promise<RPAAuditDetailsResponse> => {
  const response = await api.post('/admin/analytics/get_rpa_audit_details', params);
  return response.data;
}; 

export const getRankingAnalytics = async (params: RankingAnalyticsParams): Promise<RankingAnalyticsResponse> => {
  const response = await api.post('/admin/analytics/get_ranking_analytics', params);
  return response.data;
}; 
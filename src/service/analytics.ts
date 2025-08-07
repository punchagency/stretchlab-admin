import { api } from './api';
import type { 
  ChartFiltersResponse, 
  RPAAuditResponse, 
  RPAAuditParams,
  RPAAuditDetailsParams, 
  RPAAuditDetailsResponse,
  RankingAnalyticsResponse,
  RankingAnalyticsParams,
  LocationAnalyticsParams,
  LocationAnalyticsResponse
} from '@/types';

export const getChartFilters = async (filterBy?: string): Promise<ChartFiltersResponse> => {
  const queryParams = new URLSearchParams();
  if (filterBy) {
    queryParams.append('filter_by', filterBy);
  }
  
  const url = `/admin/dashboard/get_chart_filters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

export const getRPAAudit = async (params: RPAAuditParams): Promise<RPAAuditResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('duration', params.duration);
  
  if (params.location) {
    queryParams.append('location', params.location);
  }
  if (params.flexologist_name) {
    queryParams.append('flexologist_name', params.flexologist_name.toLowerCase().trim());
  }
  if (params.start_date) {
    queryParams.append('start_date', params.start_date);
  }
  if (params.end_date) {
    queryParams.append('end_date', params.end_date);
  }
  if (params.filter_metric) {
    queryParams.append('filter_metric', params.filter_metric);
  }
  
  const response = await api.get(`/admin/analytics/rpa_audit?${queryParams.toString()}`);
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

export const getLocationAnalytics = async (params: LocationAnalyticsParams): Promise<LocationAnalyticsResponse> => {
  const response = await api.post('/admin/analytics/get_location_analytics', params);
  return response.data;
}; 
import { api } from "./api";
import type { ChartDataParams } from "@/types";

export const getChartFilters = async () => {
  const response = await api.get("/admin/dashboard/get_chart_filters");
  return response.data;
};

export const getChartData = async (params: ChartDataParams) => {
  const queryParams = new URLSearchParams();
  
  // queryParams.append('duration', 'weekly');
  queryParams.append('duration', params.duration.toLowerCase());

  queryParams.append('dataset', params.dataset);
    if (params.filterBy === "Location") {
    const locationValue = params.location && params.location !== "All" 
      ? params.location.toLowerCase() 
      : "all";
    queryParams.append('location', locationValue);
  } else if (params.filterBy === "Flexologist") {
    const flexologistValue = params.flexologist || "all";
    queryParams.append('flexologist', flexologistValue.toString());
  }
  if (params.start_date) {
    queryParams.append('start_date', params.start_date);
  }
  if (params.end_date) {
    queryParams.append('end_date', params.end_date);
  }
  const response = await api.get(`/admin/dashboard/second_row?${queryParams.toString()}`);
  return response.data;
};

export const getUserTableData = async () => {
  const response = await api.get("/admin/dashboard/third_row");
  return response.data;
};

export const getDashboardMetrics = async () => {
  const response = await api.get("/admin/dashboard/first_row");
  return response.data;
};

export const getBusinessTableData = async () => {
  const response = await api.get("/admin/dashboard/fourth_row");
  return response.data;
};

export const getBusinessInfo = async (businessId: number) => {
  const response = await api.post("/admin/dashboard/get_business_info", {
    business_id: businessId
  });
  return response.data;
}; 
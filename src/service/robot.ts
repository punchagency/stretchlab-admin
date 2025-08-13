import { api } from "./api";

export const verifyCredentials = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/admin/process/validate-login", data);
  return response;
};

export const saveSettings = async (data: {
  proceed: boolean;
  numberOfStudioLocations: number;
  clubReadyUsername: string;
  clubReadyPassword: string;
  selectedStudioLocations: string[];
  studioLocations: string[];
}) => {
  const response = await api.post("/admin/process/save-robot-config", data);
  return response;
};

export const updateSettings = async (data: {
  id: number;
  numberOfStudioLocations: number;
  clubReadyUsername: string;
  clubReadyPassword: string;
  selectedStudioLocations: string[];
  studioLocations: string[];
}) => {
  const response = await api.post("/admin/process/update-robot-config", data);
  return response;
};

export const getRobotConfig = async () => {
  const response = await api.get("/admin/process/get-robot-config");
  return response;
};

export const updateRobotStatus = async (data: { status: string }) => {
  const response = await api.post("/admin/process/change-status-robot", data);
  return response;
};

export const getRobotHistory = async (
  configId: number,
  duration?: string,
  startDate?: string,
  endDate?: string
) => {
  let queryParams = `?duration=${duration}`;
  
  if (duration === "custom" && startDate && endDate) {
    queryParams += `&start_date=${startDate}&end_date=${endDate}`;
  }
  
  const response = await api.get(`/admin/process/get-rpa-history/${configId}${queryParams}`);
  return response;
};

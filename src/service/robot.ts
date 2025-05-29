import { api } from "./api";

export const verifyCredentials = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/admin/process/validate-login", data);
  return response;
};

export const saveSettings = async (data: {
  numberOfStudioLocations: number;
  dailyRunTime: string;
  unloggedBookings: boolean;
  clubReadyUsername: string;
  clubReadyPassword: string;
}) => {
  const response = await api.post("/admin/process/save-robot-config", data);
  return response;
};
export const updateSettings = async (data: {
  id: number;
  numberOfStudioLocations: number;
  dailyRunTime: string;
  unloggedBookings: boolean;
  clubReadyUsername: string;
  clubReadyPassword: string;
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

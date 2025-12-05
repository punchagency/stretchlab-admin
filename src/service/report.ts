import { api } from "./api";

export interface AdminReportItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  location: string;
  package_name: string;
  unused_credit: string;
  cell_phone: string;
  home_phone: string;
  work_phone: string;
  created_at: string;
  completed: boolean | null;
  completed_at: string | null;
  updated_at: string | null;
}

export interface HealthReportItem {
  id: number;
  first_name: string;
  last_name: string;
  gsl_category: string;
  details: string;
  due_date: string;
  due_status: string;
  cell_phone: string;
  user_id: string;
  email: string;
  amount: string;
  location: string;
  agreement_date: string;
  agreement_id: string;
  processed_by: string;
  sold_by: string;
  invoice_id: string;
  invoice_category: string;
  invoice_class: string;
  invoice_type: string;
  user_pay_preference: string;
  completed: boolean | null;
  completed_at: string | null;
  updated_at: string | null;
}

export interface ResignSoonReportItem {
  id: number;
  full_name: string;
  location: string;
  package: string;
  sessions_left: string;
  expiration_date: string;
  created_at: string;
  completed: boolean | null;
  completed_at: string | null;
  updated_at: string | null;
}

export type AdminReportResponse = {
  data: (AdminReportItem | HealthReportItem | ResignSoonReportItem)[];
};

export const getAdminReport = async (type: string) => {
  const response = await api.get<AdminReportResponse>("/admin/report/get-report", {
    params: { type },
  });
  return response.data;
};

export interface ChangeReportStatusRequest {
  status: "completed" | "pending";
  type: string;
  id: number;
}

export const changeReportStatus = async (data: ChangeReportStatusRequest) => {
  const response = await api.post("/admin/report/change-status", data);
  return response.data;
};

export interface StudioManagerConfig {
  managers: string[];
  location: string[];
}

export interface RobotConfigResponse {
  studio_managers?: string;
  [key: string]: any;
}

export const getRobotConfig = async () => {
  const response = await api.get<RobotConfigResponse>("/admin/process/get-robot-config");
  return response.data;
};

export const addStudioManagers = async (data: StudioManagerConfig[]) => {
  const response = await api.post("/admin/report/add-studio-managers", data);
  return response.data;
};
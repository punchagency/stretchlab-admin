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
  sold_by:string;
  invoice_id: string;
  invoice_category: string;
  invoice_class: string;
  invoice_type: string;
  user_pay_preference: string;
}

export type AdminReportResponse = {              
  data: (AdminReportItem | HealthReportItem)[];
};  

export const getAdminReport = async (type: string) => {
  const response = await api.get<AdminReportResponse>("/admin/report", {
    params: { type },
  });
  return response.data;
};
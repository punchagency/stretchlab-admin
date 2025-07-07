import { useQuery } from "@tanstack/react-query";
import { api } from './api';

export interface InvoiceHistoryItem {
  id: string;
  invoice_id: string;
  invoice_date: string;
  amount: number;
  status: "paid" | "unpaid";
  currency: string;
  download_url?: string;
}

export interface SubscriptionDetails {
  note_taking?: {
    currency: string;
    end_date: number;
    interval: string;
    price: number;
    quantity: number;
    start_date: number;
    status: string;
  };
  robot_process_automation?: {
    currency: string;
    end_date: number;
    interval: string;
    price: number;
    quantity: number;
    start_date: number;
    status: string;
  };
}

export interface BillingResponse {
  status: string;
  subscriptions_details: SubscriptionDetails[];
}

export const getBillingDetails = async (): Promise<BillingResponse> => {
    const response = await api.get('/admin/payment/get-subscriptions-details');
    return response.data as BillingResponse;
};

export interface BillingHistoryResponse {
  status: string;
  billing_history: InvoiceHistoryItem[];
}

export const getBillingHistory = async (): Promise<BillingHistoryResponse> => {
    const response = await api.get('/admin/payment/get-billing-history');
    return response.data as BillingHistoryResponse;
};

export const useBillingDetails = () => {
  return useQuery({
    queryKey: ["billing-details"],
    queryFn: getBillingDetails,
  });
};

export const useInvoiceHistory = () => {
  return useQuery({
    queryKey: ["invoice-history"],
    queryFn: getBillingHistory,
    select: (data) => data.billing_history || [],
  });
}; 
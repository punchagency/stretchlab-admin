import { useQuery } from "@tanstack/react-query";
import { api } from './api';

export interface InvoiceHistoryItem {
  id: number;
  invoice_id: string;
  created_at: string;
  amount: number;
  status: "paid" | "unpaid";
  invoice_pdf_url: string;
  invoice_url: string;
  subscription_id: string;
  user_id: number;
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
    discount: boolean;
    discount_info: {
      amount_off: any;
      end_date : number;
      percent_off: number
    }
  };
  robot_process_automation?: {
    currency: string;
    end_date: number;
    interval: string;
    price: number;
    quantity: number;
    start_date: number;
    status: string;
    discount: boolean;
    discount_info: {
      amount_off: any;
      end_date : number;
      percent_off: number
    }
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
import { useQuery } from "@tanstack/react-query";
import { api } from './api';

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

export const useBillingDetails = () => {
  return useQuery({
    queryKey: ["billing-details"],
    queryFn: getBillingDetails,
  });
}; 
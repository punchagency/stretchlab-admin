import { api } from "./api";
import { useQuery } from "@tanstack/react-query";
import type { BillingInfo } from "@/types";
 
 export const initialize = async (role: string) => {
   const response = await api.get(
     `/admin/payment/create-setup-intent?role=${role}`
   );
   return response;
 };
 
 export const createPaymentMethod = async (payment_id: string, coupon: string) => {
   const normalizedCoupon = coupon?.trim().toUpperCase() || "";
   const response = await api.post("/admin/payment/update-payment-method", {
     payment_id,
     coupon : normalizedCoupon,
   });
   return response;
 };
 
 export const cancelSubscription = async (type: "note_taking" | "robot_process_automation") => {
   const response = await api.post("/admin/payment/cancel-subscription", {
     type,
   });
   return response;
 };
 
 export const restartSubscription = async (type: "note_taking" | "robot_process_automation") => {
   const response = await api.post("/admin/payment/restart-subscription", {
     type,
   });
   return response;
 };
 
 export const checkCoupon = async (coupon: string) => {
   const normalizedCoupon = coupon?.trim().toUpperCase() || "";
   const response = await api.post("/admin/payment/check-coupon", {
     coupon: normalizedCoupon,
   });
   return response;
 };

export interface PaymentInfoResponse {
  message: string;
  payment_info: BillingInfo | null;
  status: string;
}

export const getPaymentInfo = async (): Promise<PaymentInfoResponse> => {
  const response = await api.get("/admin/payment/get-payment-info");
  return response.data as PaymentInfoResponse;
};

export const usePaymentInfo = () => {
  return useQuery({
    queryKey: ["payment-info"],
    queryFn: getPaymentInfo,
    select: (data) => data.payment_info || null,
  });
};
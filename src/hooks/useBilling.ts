import { useBillingDetails } from "@/service/billing";
import {
  DEFAULT_BILLING_DATA,
  formatBillingDate,
  convertStripePrice,
  calculateTotal,
  extractSubscriptionData,
  hasValidSubscription,
} from "@/utils/billing";

export interface ProcessedBillingData {
  flexologistQuantity: number;
  flexologistPrice: number;
  flexologistTotal: number;
  rpaQuantity: number;
  rpaPrice: number;
  rpaTotal: number;
  totalBilled: number;
  noteTakingBillingDate: string | null;
  rpaBillingDate: string | null;
  hasSubscriptionData: boolean;
}

export const useBilling = () => {
  const { data: billingData, isLoading, error, refetch } = useBillingDetails();

  const processedData: ProcessedBillingData = (() => {
    if (!billingData?.subscriptions_details) {
      return DEFAULT_BILLING_DATA;
    }

    const subscriptions = billingData.subscriptions_details;
    const { noteTakingData, rpaData } = extractSubscriptionData(subscriptions);

    const flexologistPrice = noteTakingData ? convertStripePrice(noteTakingData.price) : 0;
    const rpaPrice = rpaData ? convertStripePrice(rpaData.price) : 0;
    
    const flexologistQuantity = noteTakingData?.quantity || 0;
    const rpaQuantity = rpaData?.quantity || 0;
    
    const flexologistTotal = calculateTotal(flexologistQuantity, flexologistPrice);
    const rpaTotal = calculateTotal(rpaQuantity, rpaPrice);
    const totalBilled = flexologistTotal + rpaTotal;

    const noteTakingBillingDate = noteTakingData?.end_date ? formatBillingDate(noteTakingData.end_date) : null;
    const rpaBillingDate = rpaData?.end_date ? formatBillingDate(rpaData.end_date) : null;

    const hasSubscriptionData = hasValidSubscription(subscriptions, noteTakingData, rpaData);

    return {
      flexologistQuantity,
      flexologistPrice,
      flexologistTotal,
      rpaQuantity,
      rpaPrice,
      rpaTotal,
      totalBilled,
      noteTakingBillingDate,
      rpaBillingDate,
      hasSubscriptionData,
    };
  })();

  return {
    ...processedData,
    isLoading,
    error,
    refetch,
  };
}; 
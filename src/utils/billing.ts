import type { SubscriptionDetails } from "@/service/billing";

export const STRIPE_PRICE_DIVISOR = 100;

export const DEFAULT_BILLING_DATA = {
  flexologistQuantity: 0,
  flexologistPrice: 0,
  flexologistTotal: 0,
  rpaQuantity: 0,
  rpaPrice: 0,
  rpaTotal: 0,
  totalBilled: 0,
  noteTakingBillingDate: null,
  rpaBillingDate: null, 
  hasSubscriptionData: false,
  flexologistStatus: undefined,
  rpaStatus: undefined,
  noteTakingData: undefined,
  rpaData : undefined
} as const;

// Utility functions
export const formatBillingDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });
};

export const convertStripePrice = (priceInCents: number): number => {
  return priceInCents / STRIPE_PRICE_DIVISOR;
};

export const calculateTotal = (quantity: number, price: number): number => {
  return quantity * price;
};

export const extractSubscriptionData = (subscriptions: SubscriptionDetails[]) => {
  const noteTakingData = subscriptions.find(sub => sub.note_taking)?.note_taking;
  const rpaData = subscriptions.find(sub => sub.robot_process_automation)?.robot_process_automation;
  
  return { noteTakingData, rpaData };
};

export const hasValidSubscription = (
  subscriptions: SubscriptionDetails[], 
  noteTakingData: any, 
  rpaData: any
): boolean => {
  return Boolean(subscriptions.length > 0 && (noteTakingData || rpaData));
}; 
import { api } from "./api";

export const initialize = async (role: string) => {
  const response = await api.get(
    `/admin/payment/create-setup-intent?role=${role}`
  );
  return response;
};

export const createPaymentMethod = async (payment_id: string) => {
  const response = await api.post("/admin/payment/update-payment-method", {
    payment_id,
  });
  return response;
};

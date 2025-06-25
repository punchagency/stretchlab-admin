import { api } from "./api";

export const getTwoFactorStatus = async () => {
  const response = await api.get("/admin/settings/two-factor-auth/status");
  return response;
};

export const enableTwoFactor = async () => {
  const response = await api.get("/admin/settings/two-factor-auth/enable");
  return response;
};

export const verifyTwoFactorSetup = async (code: string) => {
  const response = await api.post("/admin/settings/two-factor-auth/verify", { code });
  return response;
};

export const disableTwoFactor = async () => {
  const response = await api.get("/admin/settings/two-factor-auth/disable");
  return response;
};

export const verifyTwoFactorDisable = async (code: string) => {
  const response = await api.post("/admin/settings/two-factor-auth/disable/verify", { code });
  return response;
};
  
export const resendTwoFactorCode = async () => {
  const response = await api.get("/admin/settings/two-factor-auth/resend-code");
  return response;
}; 
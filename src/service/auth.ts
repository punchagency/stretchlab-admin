import { api } from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/admin/auth/login", { email, password });
  return response;
};

export const signup = async (
  email: string,
  password: string,
  username: string
) => {
  const response = await api.post("/admin/auth/register", {
    email,
    password,
    username,
    role_id: 2,
  });
  return response;
};

export const checkUsername = async (username: string) => {
  const response = await api.get(
    `/admin/auth/check-username?username=${username}`
  );
  return response;
};

export const verify = async (code: string) => {
  const response = await api.post("/admin/auth/verify", { code });
  return response;
};

export const resendCode = async () => {
  const response = await api.get("/admin/auth/resend-verification-code");
  return response;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/admin/auth/forgot-password", { email });
  return response;
};

export const resetPassword = async (password: string, token: string) => {
  const response = await api.post("/admin/auth/reset-password", {
    password,
    token,
  });
  return response;
};

export const verify2FALogin = async (code: string, email: string) => {
  const response = await api.post("/admin/auth/verify-2fa-login", { code, email });
  return response;
};

export const resend2FAVerificationCode = async (email: string) => {
  const response = await api.post("/admin/auth/resend-2fa-verification-code", { email });
  return response;
};

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

export const changePassword = async (old_password: string, new_password: string) => {
  const response = await api.post("/admin/settings/change-password", {
    old_password,
    new_password
  });
  return response;
};

export const changeEmailInitiate = async (new_email: string) => {
  const response = await api.post("/admin/settings/change-email-initiate", {
    new_email
  });
  return response;
};

export const changeEmailVerify = async (new_email: string, code: string) => {
  const response = await api.post("/admin/settings/change-email/verify", {
    new_email,
    code
  });
  return response;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('profile_picture', file);

  const response = await api.post("/admin/settings/change-profile-picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const getProfilePicture = async () => {
  const response = await api.get("/admin/settings/get-profile-picture");
  return response;
};

export const deleteProfilePicture = async () => {
  const response = await api.delete("/admin/settings/delete-profile-picture");
  return response;
};

export const getCoupons = async () => {
  const response = await api.get("/admin/settings/get-coupon");
  return response;
};

export const addCoupon = async (couponData: {
  coupon_code: string;
  coupon_type: "all" | "robot" | "note_taking";
  coupon_name: string;
  coupon_id: string;
}) => {
  const response = await api.post("/admin/settings/add-coupon", couponData);
  return response;
};

export const removeData = async () => {
  const response = await api.delete("/admin/settings/remove-data");
  return response;
};

export const deleteUser = async () => {
  const response = await api.delete("/admin/settings/delete-user");
  return response;
};

export const deleteCoupon = async (id: string) => {
  const response = await api.delete(`/admin/settings/delete-coupon?coupon_id=${id}`);
  return response;
};
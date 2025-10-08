import { api } from "./api";

export const fetchManagers = async () => {
  const response = await api.get("/admin/user-management/get-managers");
  return response;
};

export const inviteManager = async (email: string) => {
  const response = await api.post("/admin/user-management/invite-manager", {
    email,
  });
  return response;
};

export const updateManagerAccess = async (user_id: number, enable: boolean) => {
  const response = await api.post("/admin/user-management/update-status", {
    user_id,
    enable,
  });
  return response;
};

export const addPassword = async (
  email: string,
  password: string,
  full_name: string
) => {
  const response = await api.post("/admin/user-management/add-details", {
    email,
    password,
    full_name,
  });
  return response;
};

export const grantOrRevokePermission = async (payload: {
  user_id: number;
  permission_tag: string;
  add_permission: boolean;
}) => {
  const response = await api.post("/admin/user-management/grant-permission", payload);
  return response;
};
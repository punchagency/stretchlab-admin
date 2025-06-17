import { api } from "./api";

export const fetchUsers = async () => {
  const response = await api.get("/admin/process/get-users");
  return response;
};

export const inviteFlexologist = async (email: string, proceed: boolean) => {
  const response = await api.post("/admin/process/invite-user", {
    email,
    proceed,
  });
  return response;
};

export const updateUserAccess = async (email: string, status: number) => {
  const response = await api.post("/admin/process/update-user-status", {
    email,
    status,
  });
  return response;
};

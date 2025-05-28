import { deleteUserCookie } from "@/utils";
import { getUserCookie } from "@/utils";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
  const token = getUserCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      deleteUserCookie();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

import { deleteUserCookie, setUserCookie, getRefreshToken, setTempUserCookie } from "@/utils";
import { getUserCookie, getTempUserCookie } from "@/utils";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
  const check_temp = getTempUserCookie();
  const token = getUserCookie();
  if (check_temp) {
    config.headers.Authorization = `Bearer ${check_temp}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + "/api/admin/auth/refresh",
            { refresh_token: refreshToken }
          );
          if (response.status === 200 || response.status === 201) {
            const { access_token } = response.data;

            if (access_token) {
              const currentTempToken = getTempUserCookie();
              const currentUserToken = getUserCookie();

              if (currentUserToken) {
                setUserCookie(access_token);
              } else if (currentTempToken) {
                setTempUserCookie(access_token);
              } else {
               
                setUserCookie(access_token);
              }

              api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
              originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            }

            // Refresh token is not returned anymore as per user request
            // if (refresh_token) {
            //   setRefreshToken(refresh_token);
            // }

            return api(originalRequest);
          }
        } catch (refreshError) {
          deleteUserCookie();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      deleteUserCookie();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

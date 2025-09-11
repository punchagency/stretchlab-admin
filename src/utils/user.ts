import Cookies from "js-cookie";
import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  email: string;
  name: string;
  role_name: string;
  username: string;
  avatar?: string;
  rpa_verified?: boolean | null;
  role_id?: number;
  note_verified?: boolean | null;
  requires_2fa?: boolean | null;
  is_verified?: boolean | null;
}

export const setUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(23, 59, 59, 999);

  // Clear any existing temp_token when setting main token
  Cookies.remove("temp_token", { path: "/" });
  
  Cookies.set("token", token, { 
    expires: expireAt,
    path: "/",
    secure: window.location.protocol === "https:",
    sameSite: "lax"
  });
};

export const setTempUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(23, 59, 59, 999);
  
  // Clear any existing main token when setting temp token
  Cookies.remove("token", { path: "/" });
  
  Cookies.set("temp_token", token, { 
    expires: expireAt,
    path: "/",
    secure: window.location.protocol === "https:",
    sameSite: "lax"
  });
};

export const getTempUserCookie = (): string | null => {
  return Cookies.get("temp_token") || null;
};

export const getUserCookie = (): string | null => {
  return Cookies.get("token") || null;
};

export const getUserInfo = (): CustomJwtPayload | null => {
  const token = getUserCookie();
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded;

  }
  return null;
};

export const getTempUserInfo = (): CustomJwtPayload | null => {
  const token = getTempUserCookie();
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded;
  }
  return null;
};

export const deleteUserCookie = (): void => {
  // Remove cookies with explicit path and domain options to ensure they're deleted
  // even if they were set with different options
  Cookies.remove("token", { path: "/" });
  Cookies.remove("temp_token", { path: "/" });
  
  // Also try removing without path in case they were set without explicit path
  Cookies.remove("token");
  Cookies.remove("temp_token");
};

export const clearAllAuthCookies = (): void => {
  // Clear all authentication cookies before setting new ones
  deleteUserCookie();
};

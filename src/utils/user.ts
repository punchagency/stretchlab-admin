import Cookies from "js-cookie";
import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

const cookieDomain = import.meta.env.VITE_COOKIE_DOMAIN;

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
  permissions?: any
}

export const setUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(expireAt.getHours() + 1);

  // Remove temporary token to prevent precedence issues in interceptors
  Cookies.remove("temp_token", { domain: cookieDomain });

  Cookies.set("token", token, {
    expires: expireAt,
    domain: cookieDomain,
    secure: true,
    sameSite: "None"
  });
};

export const setTempUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(expireAt.getHours() + 1);
  Cookies.set("temp_token", token, {
    expires: expireAt,
    domain: cookieDomain,
    secure: true,
    sameSite: "None"
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
  Cookies.remove("token", { domain: cookieDomain });
  Cookies.remove("temp_token", { domain: cookieDomain });
  Cookies.remove("refresh_token", { domain: cookieDomain });
};

export const setRefreshToken = (token: string): void => {
  const expireAt = new Date();
  expireAt.setDate(expireAt.getDate() + 7);

  Cookies.set("refresh_token", token, {
    expires: expireAt,
    domain: cookieDomain,
    secure: true,
    sameSite: "None"
  });
};

export const getRefreshToken = (): string | null => {
  return Cookies.get("refresh_token") || null;
};

export const removeRefreshToken = (): void => {
  Cookies.remove("refresh_token", { domain: cookieDomain });
};
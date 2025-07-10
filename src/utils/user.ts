import Cookies from "js-cookie";
import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  email: string;
  name: string;
  role_name: string;
  username: string;
  avatar?: string;
}

export const setUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(23, 59, 59, 999);

  Cookies.set("token", token, { expires: expireAt });
};

export const setTempUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(23, 59, 59, 999);
  Cookies.set("temp_token", token, { expires: expireAt });
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

export const deleteUserCookie = (): void => {
  Cookies.remove("token");
  Cookies.remove("temp_token");
};

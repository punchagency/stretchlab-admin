// import Cookies from "js-cookie";
// import type { JwtPayload } from "jwt-decode";
// import { jwtDecode } from "jwt-decode";

// interface CustomJwtPayload extends JwtPayload {
//   email: string;
//   name: string;
//   role_name: string;
//   username: string;
//   avatar?: string;
//   rpa_verified?: boolean | null;
//   role_id?: number;
//   note_verified?: boolean | null;
//   requires_2fa?: boolean | null;
//   is_verified?: boolean | null;
// }

// export const setUserCookie = (token: string): void => {
//   const expireAt = new Date();
//   expireAt.setHours(23, 59, 59, 999);

//   // Clear any existing temp_token when setting main token
//   Cookies.remove("temp_token", { path: "/" });
  
//   Cookies.set("token", token, { 
//     expires: expireAt,
//     path: "/",
//     secure: window.location.protocol === "https:",
//     sameSite: "lax"
//   });
// };

// export const setTempUserCookie = (token: string): void => {
//   const expireAt = new Date();
//   expireAt.setHours(23, 59, 59, 999);
  
//   // Clear any existing main token when setting temp token
//   Cookies.remove("token", { path: "/" });
  
//   Cookies.set("temp_token", token, { 
//     expires: expireAt,
//     path: "/",
//     secure: window.location.protocol === "https:",
//     sameSite: "lax"
//   });
// };

// export const getTempUserCookie = (): string | null => {
//   return Cookies.get("temp_token") || null;
// };

// export const getUserCookie = (): string | null => {
//   return Cookies.get("token") || null;
// };

// export const getUserInfo = (): CustomJwtPayload | null => {
//   const token = getUserCookie();
//   if (token) {
//     const decoded = jwtDecode<CustomJwtPayload>(token);
//     return decoded;

//   }
//   return null;
// };

// export const getTempUserInfo = (): CustomJwtPayload | null => {
//   const token = getTempUserCookie();
//   if (token) {
//     const decoded = jwtDecode<CustomJwtPayload>(token);
//     return decoded;
//   }
//   return null;
// };

// export const deleteUserCookie = (): void => {
//   const isSecure = window.location.protocol === "https:";

//   // Remove cookies with explicit path and secure options to match how they were set
//   Cookies.remove("token", {
//     path: "/",
//     secure: isSecure,
//     sameSite: "lax"
//   });
//   Cookies.remove("temp_token", {
//     path: "/",
//     secure: isSecure,
//     sameSite: "lax"
//   });

//   // Also try removing without path in case they were set without explicit path
//   Cookies.remove("token", { secure: isSecure, sameSite: "lax" });
//   Cookies.remove("temp_token", { secure: isSecure, sameSite: "lax" });
// };

// export const clearAllAuthCookies = (): void => {
//   // Clear all authentication cookies before setting new ones
//   deleteUserCookie();
// };


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

const cookieDomain = import.meta.env.VITE_COOKIE_DOMAIN;

export const setUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(23, 59, 59, 999);
  Cookies.set("token", token, {
    expires: expireAt,
    // domain: cookieDomain,
    // // secure: true,
    // sameSite: "strict",
    // path: "/",
  });
};

export const setTempUserCookie = (token: string): void => {
  const expireAt = new Date();
  expireAt.setHours(23, 59, 59, 999);
  Cookies.set("temp_token", token, {
    expires: expireAt,
    domain: cookieDomain,
    // secure: true,
    sameSite: "strict",
    path: "/",
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
  Cookies.remove("token");
  Cookies.remove("temp_token");
  console.log("deleted user cookie");
};


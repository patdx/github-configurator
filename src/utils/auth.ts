import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { verifyAccessToken } from "./github";
import { Context } from "hono";

const SESSION_COOKIE_NAME = "github_session";
const SESSION_EXPIRY_DAYS = 7;

// Set the session token in a cookie
export const setSessionToken = (c: any, accessToken: string): void => {
  setCookie(c, SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60, // Convert days to seconds
  });
};

// Get the session token from the cookie
export const getSessionToken = (c: Context): string | undefined => {
  return getCookie(c, SESSION_COOKIE_NAME);
};

// Delete the session token cookie
export const clearSessionToken = (c: Context): void => {
  deleteCookie(c, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
};

// Check if the user is authenticated
export const isAuthenticated = async (c: Context): Promise<boolean> => {
  const token = getSessionToken(c);

  if (!token) {
    return false;
  }

  return await verifyAccessToken(token);
};

// Auth middleware to protect routes
export const authMiddleware = async (c: any, next: Function) => {
  const authenticated = await isAuthenticated(c);

  if (!authenticated) {
    return c.redirect("/");
  }

  return await next();
};

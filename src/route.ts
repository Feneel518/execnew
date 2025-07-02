// Array of routes accessable to public
// @type {string[]}
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/api/uploadthing",
  "/quotation/view",
  "/gallery",
  "/product/:path*",
  "/about-us",
  "/contact-us",
];

// Array of routes to be protected
export const authRoute = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

// The prefix for auth routes and are used for api auth pruposes
export const apiAuthPrefix = "/api/auth";

// default path after logging
export const DEFAULT_LOGIN_REDIRECT = "/";

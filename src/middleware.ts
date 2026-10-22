import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Protect all routes under /admin, while static files, api routes, and public pages are unaffected
  matcher: ["/admin/:path*"],
};

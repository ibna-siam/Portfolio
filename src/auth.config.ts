import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js Configuration
 *
 * This configuration defines route authorization policies, session callbacks,
 * and page routing. It intentionally avoids Node.js-only imports (such as database
 * drivers or bcrypt) so that it can be safely used in Next.js Middleware.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!user;
      const isAdmin = (user as { role?: string })?.role === "admin";
      const pathname = nextUrl.pathname;

      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginRoute = pathname === "/admin/login";

      // 1. If user is already an authenticated admin visiting the login page, redirect to /admin
      if (isLoginRoute) {
        if (isLoggedIn && isAdmin) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      // 2. Protect all other /admin routes
      if (isAdminRoute) {
        if (!isLoggedIn) {
          return false; // Automatically redirects to pages.signIn with callbackUrl
        }
        if (!isAdmin) {
          // Authenticated but not an administrator: deny access
          return false;
        }
        return true;
      }

      // 3. All public routes remain accessible
      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        token.email = user.email;
      }
      return token;
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

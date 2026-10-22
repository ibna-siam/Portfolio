import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Server-Side Authentication & Authorization Helpers
 *
 * Provides reusable server-side session retrieval and strict role enforcement
 * for Server Components, Server Actions, and Route Handlers.
 */

/**
 * Retrieves the currently active Auth.js session on the server.
 */
export async function getSession() {
  return await auth();
}

/**
 * Enforces administrator authorization on the server.
 *
 * Guarantees that:
 * 1. The request has an active, authenticated session.
 * 2. The authenticated user explicitly possesses the 'admin' role.
 *
 * If either condition fails, the user is redirected away from the protected area.
 * This function must be called in protected Server Components and Server Actions.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    redirect("/admin/login?error=AccessDenied");
  }

  return session;
}

/**
 * Validates post-login return URLs to prevent open-redirect vulnerabilities.
 *
 * Restricts the callback target strictly to relative, internal application paths
 * under the /admin boundary or relative root paths.
 */
export function sanitizeCallbackUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "/admin";
  }

  const trimmed = rawUrl.trim();

  // Must begin with a single slash and must NOT start with protocol-relative "//" or "/\"
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return "/admin";
  }

  // Must not contain URL scheme delimiters
  if (trimmed.includes("://") || trimmed.includes("javascript:") || trimmed.includes("data:")) {
    return "/admin";
  }

  return trimmed;
}

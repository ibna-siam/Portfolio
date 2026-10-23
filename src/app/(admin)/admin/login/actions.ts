"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { sanitizeCallbackUrl } from "@/lib/auth";
import { checkLoginRateLimit } from "@/lib/auth-limiter";

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  prevState: LoginActionState | undefined,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { error: "Please enter a valid administrator email address." };
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return { error: "Please provide your administrator password." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Verify server-side rate limit before attempting sign-in
  const rateStatus = checkLoginRateLimit(normalizedEmail);
  if (!rateStatus.allowed) {
    const minutes = Math.ceil((rateStatus.retryAfterSeconds ?? 900) / 60);
    return {
      error: `Too many failed login attempts. Account temporarily locked for ${minutes} minute(s) for security.`,
    };
  }

  const safeRedirectUrl = sanitizeCallbackUrl(
    typeof callbackUrl === "string" ? callbackUrl : "/admin"
  );

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: safeRedirectUrl,
    });

    return { success: true };
  } catch (error: unknown) {
    // 2. Next.js App Router redirects throw NEXT_REDIRECT: MUST be re-thrown!
    const isRedirect =
      error instanceof Error &&
      (error.message === "NEXT_REDIRECT" ||
        (error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT"));

    if (isRedirect) {
      throw error;
    }

    // 3. Catch Auth.js specific errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid email or password. Please verify your credentials.",
          };
        default:
          return {
            error: "Authentication failed. Please verify your credentials and try again.",
          };
      }
    }

    // 4. Handle RateLimit error thrown from authorize callback
    if (error instanceof Error && error.message.startsWith("RateLimitExceeded:")) {
      const parts = error.message.split(":");
      const secs = parseInt(parts[1] || "900", 10);
      const mins = Math.ceil(secs / 60);
      return {
        error: `Too many failed login attempts. Access is temporarily locked for ${mins} minute(s).`,
      };
    }

    console.error(
      "[LOGIN_ACTION] Unexpected server sign-in error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return {
      error: "An unexpected error occurred during sign-in. Please try again later.",
    };
  }
}

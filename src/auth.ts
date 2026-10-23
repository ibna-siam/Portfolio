import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { authConfig } from "./auth.config";
import { getDb, schema } from "@/lib/db";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginAttempts,
} from "@/lib/auth-limiter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      id: "credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        // Basic sanity validation
        if (!email.includes("@") || password.length < 8) {
          return null;
        }

        // 1. Check rate limit
        const rateCheck = checkLoginRateLimit(email);
        if (!rateCheck.allowed) {
          throw new Error(`RateLimitExceeded:${rateCheck.retryAfterSeconds ?? 900}`);
        }

        try {
          const db = getDb();
          const [user] = await db
            .select({
              id: schema.users.id,
              email: schema.users.email,
              name: schema.users.name,
              role: schema.users.role,
              passwordHash: schema.users.passwordHash,
            })
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

          // Disclose nothing about account existence
          if (!user || !user.passwordHash) {
            recordFailedLoginAttempt(email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
          if (!isPasswordValid) {
            recordFailedLoginAttempt(email);
            return null;
          }

          // Successful authentication: clear failure count
          resetLoginAttempts(email);

          // Return sanitized user object (EXCLUDES passwordHash completely)
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
          };
        } catch (err: unknown) {
          if (err instanceof Error && err.message.startsWith("RateLimitExceeded:")) {
            throw err;
          }
          console.error(
            "[AUTH] Authorization lookup failed safely:",
            err instanceof Error ? err.message : "Unknown error"
          );
          return null;
        }
      },
    }),
  ],
});

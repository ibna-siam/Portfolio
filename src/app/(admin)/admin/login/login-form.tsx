"use client";

import React, { useActionState, useState } from "react";
import { loginAction, type LoginActionState } from "./actions";
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";

interface LoginFormProps {
  initialCallbackUrl?: string;
  initialError?: string;
}

export function LoginForm({ initialCallbackUrl, initialError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const initialState: LoginActionState = {
    error:
      initialError === "AccessDenied"
        ? "Access denied. Administrator privileges are required to enter this area."
        : initialError === "UnauthorizedRole"
          ? "Your account does not possess the required administrator role."
          : undefined,
  };

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Hidden input to securely preserve the sanitized callback destination */}
      <input type="hidden" name="callbackUrl" value={initialCallbackUrl || "/admin"} />

      {/* Accessible Error Banner */}
      {state?.error && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-xs flex items-start gap-3 shadow-clay-inset-dark animate-fade-up"
        >
          <FiAlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-body">{state.error}</span>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="admin-email"
          className="block text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider mb-2 font-mono"
        >
          Administrator Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-500 dark:text-ink-400">
            <FiMail className="w-4 h-4" />
          </div>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="admin@domain.com"
            className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-300 dark:border-ink-800 text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-500 shadow-xs dark:shadow-clay-inset-dark rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all font-body disabled:opacity-50"
          />
        </div>
      </div>

      {/* Password Field with Show/Hide Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="admin-password"
            className="block text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider font-mono"
          >
            Passphrase
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-500 dark:text-ink-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={isPending}
            placeholder="••••••••••••"
            className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-300 dark:border-ink-800 text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-500 shadow-xs dark:shadow-clay-inset-dark rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all font-mono tracking-wider disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isPending}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-200 focus:outline-none focus:text-emerald-500 transition-colors cursor-pointer"
          >
            {showPassword ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FiEye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-clay-btn-dark active:translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <FiShield className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Authenticate Session</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

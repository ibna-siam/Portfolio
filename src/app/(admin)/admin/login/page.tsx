import { Metadata } from "next";
import { sanitizeCallbackUrl } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { FiLock } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Admin Sign In | Portfolio CMS",
  description: "Restricted administrative sign-in for Md Ibna Siam's Portfolio CMS.",
  robots: {
    index: false,
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const safeCallbackUrl = sanitizeCallbackUrl(resolvedParams.callbackUrl);

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-ink-50 via-white to-ink-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950 relative overflow-hidden font-body transition-colors">
      {/* Background architectural depth accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-ink-300/20 dark:bg-ink-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Executive Claymorphism Card */}
        <div className="bg-white/95 dark:bg-ink-900/90 border border-ink-200 dark:border-ink-800/90 shadow-xl dark:shadow-clay-card-dark rounded-2xl p-6 sm:p-10 backdrop-blur-md">
          {/* Header & Restricted Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs dark:shadow-clay-inset-dark mb-4">
              <FiLock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Restricted Administrative Boundary</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
              Executive Console
            </h1>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">
              Authorized operators & audit access for Md Ibna Siam&apos;s Portfolio CMS.
            </p>
          </div>

          {/* Real Authentication Form */}
          <LoginForm
            initialCallbackUrl={safeCallbackUrl}
            initialError={resolvedParams.error}
          />

          {/* Security Compliance & Audit Notice */}
          <div className="mt-8 pt-5 border-t border-ink-200 dark:border-ink-800/80 text-center">
            <p className="text-[11px] font-mono text-ink-500 uppercase tracking-wider">
              Protected Area · All Access Attempts Audited
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

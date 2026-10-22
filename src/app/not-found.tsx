import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink-950 text-ink-100 flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-8 text-center animate-fade-up">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-clay-inset-dark flex items-center justify-center text-amber-400 mx-auto mb-4">
          <FiAlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-50 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-ink-400 mb-6 leading-relaxed">
          The requested resource does not exist or has been relocated within the portfolio system.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-clay-card-dark hover:bg-emerald-500/20 active:translate-y-0.5 transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </main>
  );
}

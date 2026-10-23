export default function CaseStudyDetailLoading() {
  return (
    <div
      className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 transition-colors duration-300"
      aria-label="Loading case study dossier"
      aria-busy="true"
    >
      {/* Top indeterminate progress accent */}
      <div className="h-0.5 w-full bg-emerald-500/20 overflow-hidden">
        <div className="h-full bg-emerald-500 animate-[shimmer_1.5s_infinite] w-1/3" />
      </div>

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <span className="text-ink-400">/</span>
            <div className="h-4 w-20 rounded bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <span className="text-ink-400">/</span>
            <div className="h-4 w-36 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
          </div>

          {/* Header Hero Skeleton */}
          <header className="space-y-4 border-b border-ink-200 dark:border-ink-800 pb-8">
            <div className="flex gap-2">
              <div className="h-5 w-24 rounded-md bg-emerald-500/10 animate-pulse" />
              <div className="h-5 w-28 rounded-md bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            </div>

            <div className="h-10 sm:h-14 w-4/5 rounded-2xl bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />

            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 space-y-2">
                <div className="h-3 w-28 rounded bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
                <div className="h-4 w-36 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 space-y-2">
                <div className="h-3 w-32 rounded bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
                <div className="h-4 w-40 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              </div>
            </div>
          </header>

          {/* Content Block Skeleton */}
          <section className="space-y-4">
            <div className="h-7 w-48 rounded-lg bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
            </div>
          </section>

          {/* Financial Schedule Skeleton */}
          <section className="space-y-4 pt-4">
            <div className="h-7 w-56 rounded-lg bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <div className="rounded-2xl border border-ink-200 dark:border-ink-800 p-6 bg-white dark:bg-ink-900 space-y-3">
              <div className="h-8 w-full rounded bg-ink-100 dark:bg-ink-800/50 animate-pulse" />
              <div className="h-6 w-full rounded bg-ink-100/50 dark:bg-ink-800/30 animate-pulse" />
              <div className="h-6 w-full rounded bg-ink-100/50 dark:bg-ink-800/30 animate-pulse" />
              <div className="h-6 w-full rounded bg-ink-100/50 dark:bg-ink-800/30 animate-pulse" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

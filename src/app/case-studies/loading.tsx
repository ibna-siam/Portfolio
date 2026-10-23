export default function CaseStudiesLoading() {
  return (
    <div
      className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 transition-colors duration-300"
      aria-label="Loading case studies catalog"
      aria-busy="true"
    >
      {/* Top indeterminate progress accent */}
      <div className="h-0.5 w-full bg-emerald-500/20 overflow-hidden">
        <div className="h-full bg-emerald-500 animate-[shimmer_1.5s_infinite] w-1/3" />
      </div>

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-12 rounded bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <span className="text-ink-400">/</span>
            <div className="h-4 w-20 rounded bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
          </div>

          {/* Header Skeleton */}
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="h-6 w-52 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
            <div className="h-10 sm:h-12 w-4/5 rounded-2xl bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
            </div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex gap-2 mb-8">
            <div className="h-9 w-28 rounded-xl bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <div className="h-9 w-32 rounded-xl bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
            <div className="h-9 w-36 rounded-xl bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 rounded-md bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
                  <div className="h-5 w-28 rounded-md bg-emerald-500/10 animate-pulse" />
                </div>
                <div className="h-7 w-3/4 rounded-lg bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
                <div className="space-y-1.5 py-1">
                  <div className="h-3 w-40 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
                </div>
                <div className="pt-4 border-t border-ink-100 dark:border-ink-800/80 flex justify-between items-center">
                  <div className="h-4 w-28 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-emerald-500/20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

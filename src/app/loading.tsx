export default function RootLoading() {
  return (
    <div
      className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 transition-colors duration-300"
      aria-label="Loading page content"
      aria-busy="true"
    >
      {/* Top indeterminate progress accent */}
      <div className="h-0.5 w-full bg-emerald-500/20 overflow-hidden">
        <div className="h-full bg-emerald-500 animate-[shimmer_1.5s_infinite] w-1/3" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 w-full flex-1 space-y-12">
        {/* Hero Skeleton */}
        <div className="max-w-3xl space-y-6">
          <div className="h-6 w-44 rounded-full bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
          <div className="space-y-3">
            <div className="h-12 w-3/4 rounded-2xl bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
            <div className="h-8 w-1/2 rounded-xl bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-11 w-36 rounded-xl bg-emerald-500/20 animate-pulse" />
            <div className="h-11 w-32 rounded-xl bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
          </div>
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-6 pt-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 w-24 rounded-md bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
                <div className="h-5 w-28 rounded-md bg-emerald-500/10 animate-pulse" />
              </div>
              <div className="h-7 w-4/5 rounded-lg bg-ink-200/60 dark:bg-ink-800/60 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-ink-200/40 dark:bg-ink-800/40 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

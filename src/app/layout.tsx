import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../index.css";

export const metadata: Metadata = {
  title: {
    default: "Md Ibna Siam — Accounting & Finance Portfolio | ACCA Pathway",
    template: "%s | Md Ibna Siam",
  },
  description:
    "Academic accounting & finance portfolio of Md Ibna Siam (Daffodil International University). Practical financial reporting, managerial costing, taxation compliance, and analytical modeling.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
                  if (saved === 'light' || (!saved && prefersLight)) {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 antialiased font-body selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:text-emerald-300 transition-colors duration-200">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

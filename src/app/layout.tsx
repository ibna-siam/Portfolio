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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased font-body">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

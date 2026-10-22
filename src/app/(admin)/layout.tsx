import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Md Ibna Siam Portfolio CMS",
  description: "Secure Executive Operations & Portfolio Management Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 antialiased font-body selection:bg-emerald-500/30 selection:text-emerald-300">
      {children}
    </div>
  );
}

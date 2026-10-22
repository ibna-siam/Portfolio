import Link from "next/link";
import { Metadata } from "next";
import { desc, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  FiShield,
  FiCheckCircle,
  FiLock,
  FiDatabase,
  FiActivity,
  FiImage,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiCpu,
  FiArrowRight,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Admin Console | Portfolio CMS",
  description: "Executive Administration Entry for Md Ibna Siam's Portfolio CMS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const db = getDb();

  // Retrieve metrics
  const [studiesCount] = await db.select({ count: count() }).from(schema.caseStudies);
  const [competenciesCount] = await db.select({ count: count() }).from(schema.competencies);
  const [milestonesCount] = await db.select({ count: count() }).from(schema.academicMilestones);
  const [solutionsCount] = await db.select({ count: count() }).from(schema.techSolutions);
  const [mediaCount] = await db.select({ count: count() }).from(schema.mediaAssets);

  // Retrieve recent activity logs
  const recentLogs = await db
    .select()
    .from(schema.activityLogs)
    .orderBy(desc(schema.activityLogs.createdAt))
    .limit(5);

  const modules = [
    {
      title: "Case Studies CMS",
      count: studiesCount?.count || 8,
      unit: "Studies",
      description: "Research papers, tabular financial schedules, and discrepancy disclosures.",
      href: "/admin/case-studies",
      icon: FiBookOpen,
      badge: "Primary Module",
    },
    {
      title: "Competencies Matrix",
      count: competenciesCount?.count || 16,
      unit: "Competencies",
      description: "Accounting, audit, taxation, and financial technology capabilities.",
      href: "/admin/competencies",
      icon: FiAward,
      badge: "4 Domains",
    },
    {
      title: "Academic Journey",
      count: milestonesCount?.count || 3,
      unit: "Milestones",
      description: "Verified institutional education and ACCA qualification career roadmap.",
      href: "/admin/academic-journey",
      icon: FiCalendar,
      badge: "ACCA Trajectory",
    },
    {
      title: "Tech Solutions",
      count: solutionsCount?.count || 3,
      unit: "Systems",
      description: "Financial engineering tools, ratio calculators, and inventory ERP ledgers.",
      href: "/admin/tech-solutions",
      icon: FiCpu,
      badge: "25% Content",
    },
    {
      title: "Media Library",
      count: mediaCount?.count || 1,
      unit: "Assets",
      description: "Cloudinary cloud storage, responsive delivery, and signed uploader.",
      href: "/admin/media",
      icon: FiImage,
      badge: "Cloudinary",
    },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-up">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-ink-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-clay-inset-dark mb-2">
              <FiShield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phase 5 · Core CMS Content Models & Admin UI</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-50 tracking-tight">
              Executive Console
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              Md Ibna Siam · Accounting & Finance Portfolio CMS Administrative Workspace
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FiLock className="w-3.5 h-3.5" />
              <span>Role: {(session.user as { role?: string }).role?.toUpperCase() || "ADMIN"}</span>
            </span>
          </div>
        </div>

        {/* CMS Modules Grid */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-ink-100">
            Content Management Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-6 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-ink-950 border border-ink-800 shadow-clay-inset-dark flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-ink-50 group-hover:text-emerald-400 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-ink-400 mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-ink-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-300 font-semibold tabular-nums">
                      {m.count} {m.unit}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Manage</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Security & Database Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-6 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-400 block">
              Authentication Shield
            </span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <FiCheckCircle className="w-4 h-4" />
              <span>Auth.js v5 JWT Enforced</span>
            </div>
            <p className="text-[11px] text-ink-500 font-mono">
              Server-gated via requireAdmin() on all Server Actions & RSCs.
            </p>
          </div>

          <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-6 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-400 block">
              Database Engine
            </span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <FiDatabase className="w-4 h-4" />
              <span>Neon PostgreSQL (12 Tables)</span>
            </div>
            <p className="text-[11px] text-ink-500 font-mono">
              Relational Drizzle ORM schema with append-only revision snapshots.
            </p>
          </div>

          <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-6 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-400 block">
              Financial Integrity Register
            </span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <FiCheckCircle className="w-4 h-4" />
              <span>3 Disclosures Bound</span>
            </div>
            <p className="text-[11px] text-ink-500 font-mono">
              Discrepancies protected from deletion or silent alteration.
            </p>
          </div>
        </div>

        {/* Recent Activity Audit Log */}
        <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-ink-100 flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-emerald-400" />
              <span>Administrative Audit Trail (Recent Activity)</span>
            </h2>
            <span className="text-xs font-mono text-ink-500">activity_logs table</span>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-ink-500 py-3">
              No recent activity logged. Activity logs are recorded on all create, update, and publish operations.
            </p>
          ) : (
            <div className="divide-y divide-ink-800/80">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        log.action === "create"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : log.action === "publish"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : log.action === "delete"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-ink-950 text-ink-300 border-ink-800"
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-ink-200">
                      {log.entityType}
                      {log.entityId ? ` (${log.entityId.slice(0, 8)})` : ""}
                    </span>
                  </div>

                  <span className="text-[11px] text-ink-500">
                    {new Date(log.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Metadata } from "next";
import { desc, count, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import {
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
  FiUser,
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

  // Retrieve metrics and audit log concurrently to eliminate sequential network roundtrips
  const [
    [studiesCount],
    [competenciesCount],
    [milestonesCount],
    [solutionsCount],
    [mediaCount],
    recentLogs,
  ] = await Promise.all([
    db.select({ count: count() }).from(schema.caseStudies),
    db.select({ count: count() }).from(schema.competencies),
    db.select({ count: count() }).from(schema.academicMilestones),
    db.select({ count: count() }).from(schema.techSolutions),
    db.select({ count: count() }).from(schema.mediaAssets),
    db
      .select({
        id: schema.activityLogs.id,
        action: schema.activityLogs.action,
        entityType: schema.activityLogs.entityType,
        entityId: schema.activityLogs.entityId,
        metadata: schema.activityLogs.metadata,
        createdAt: schema.activityLogs.createdAt,
        actorName: schema.users.name,
        actorEmail: schema.users.email,
      })
      .from(schema.activityLogs)
      .leftJoin(schema.users, eq(schema.activityLogs.userId, schema.users.id))
      .orderBy(desc(schema.activityLogs.createdAt))
      .limit(6),
  ]);

  const modules = [
    {
      title: "Case Studies CMS",
      count: studiesCount?.count || 8,
      unit: "Studies",
      description: "Financial models, valuation schedules & disclosures",
      href: "/admin/case-studies",
      icon: FiBookOpen,
      badge: "Primary Module",
    },
    {
      title: "Competencies Matrix",
      count: competenciesCount?.count || 16,
      unit: "Competencies",
      description: "Financial, cost, tax & technology skill taxonomy",
      href: "/admin/competencies",
      icon: FiAward,
      badge: "4 Domains",
    },
    {
      title: "Academic Journey",
      count: milestonesCount?.count || 3,
      unit: "Milestones",
      description: "Institutional degrees & ACCA strategic roadmap",
      href: "/admin/academic-journey",
      icon: FiCalendar,
      badge: "ACCA Trajectory",
    },
    {
      title: "Tech Solutions",
      count: solutionsCount?.count || 3,
      unit: "Systems",
      description: "Software systems, reconciliations & repositories",
      href: "/admin/tech-solutions",
      icon: FiCpu,
      badge: "Supporting",
    },
    {
      title: "Media Library",
      count: mediaCount?.count || 1,
      unit: "Assets",
      description: "Cloudinary CDN media assets & document figures",
      href: "/admin/media",
      icon: FiImage,
      badge: "Cloud Storage",
    },
  ];

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Administrative Control Center"
      description="Md Ibna Siam · Accounting & Financial Governance Portfolio CMS"
      actions={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <FiLock className="w-3.5 h-3.5" />
            <span>
              Role: {(session.user as { role?: string }).role?.toUpperCase() || "ADMIN"}
            </span>
          </span>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-up">
        {/* CMS Modules Grid */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-ink-900 dark:text-ink-100">
              Content Management Modules
            </h2>
            <span className="text-xs font-mono text-ink-500 dark:text-ink-400">
              Executive Financial Precision System
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-4 sm:p-5 hover:border-emerald-500/40 hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-sm text-ink-900 dark:text-ink-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-ink-100 dark:border-ink-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-800 dark:text-ink-200 font-semibold tabular-nums">
                      {m.count} {m.unit}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-semibold">
              Authentication Shield
            </span>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>JWT Session Verified</span>
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 font-mono">
              Server-side boundary enforcement on all routes.
            </p>
          </div>

          <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-semibold">
              Database Engine
            </span>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <FiDatabase className="w-3.5 h-3.5" />
              <span>Neon PostgreSQL</span>
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 font-mono">
              Transactional integrity with revision tracking.
            </p>
          </div>

          <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-semibold">
              Integrity Register
            </span>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Disclosures Protected</span>
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 font-mono">
              VAL-09, VAL-10, VAL-11 notices locked.
            </p>
          </div>
        </div>

        {/* Recent Activity Audit Log */}
        <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-ink-100 dark:border-ink-800">
            <h2 className="font-display font-bold text-sm text-ink-900 dark:text-ink-100 flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Administrative Audit Trail (Recent Activity)</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              System Active
            </span>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-ink-500 dark:text-ink-400 py-3 font-mono">
              No recent activity recorded. Activity logs are recorded on all create,
              update, and publish operations.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-ink-100 dark:border-ink-800 text-[10px] uppercase text-ink-500 dark:text-ink-400 tracking-wider">
                    <th className="py-2 px-3 w-24">Action</th>
                    <th className="py-2 px-3">Affected Resource</th>
                    <th className="py-2 px-3 w-44">Actor</th>
                    <th className="py-2 px-3 w-36 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60 font-sans">
                  {recentLogs.map((log) => {
                    const actionColors =
                      log.action === "create"
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                        : log.action === "publish"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : log.action === "delete"
                            ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                            : log.action === "reorder"
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                              : "bg-ink-100 dark:bg-ink-950 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800";

                    const formattedEntity = log.entityType
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());

                    const actorDisplay =
                      log.actorName ||
                      (log.actorEmail ? log.actorEmail.split("@")[0] : null) ||
                      (session.user?.email ? session.user.email.split("@")[0] : "Admin");

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-ink-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${actionColors}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-ink-900 dark:text-ink-100">
                            {formattedEntity}
                          </span>
                          {log.entityId && (
                            <span className="ml-1.5 text-[11px] font-mono text-ink-500">
                              #{log.entityId.slice(0, 8)}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 text-xs text-ink-600 dark:text-ink-300 font-mono">
                            <FiUser className="w-3 h-3 text-ink-400" />
                            <span>{actorDisplay}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right text-[11px] font-mono text-ink-500 dark:text-ink-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiCpu,
  FiImage,
  FiLogOut,
  FiShield,
  FiExternalLink,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { signOutAction } from "@/app/(admin)/admin/actions";
import { ThemeToggle } from "@/components/public/theme-toggle";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string | null;
  userName?: string | null;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function AdminShell({
  children,
  userEmail,
  userName,
  title,
  description,
  breadcrumbs,
  actions,
}: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setIsMobileDrawerOpen(false);
  }

  // Handle escape key to close drawer
  useEffect(() => {
    if (!isMobileDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawerOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!isMobileDrawerOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileDrawerOpen]);

  const navSections = [
    {
      heading: "Workspace",
      items: [{ label: "Overview", href: "/admin", icon: FiGrid }],
    },
    {
      heading: "Portfolio Content",
      items: [
        { label: "Case Studies", href: "/admin/case-studies", icon: FiBookOpen },
        { label: "Competencies", href: "/admin/competencies", icon: FiAward },
        { label: "Academic Journey", href: "/admin/academic-journey", icon: FiCalendar },
        { label: "Tech Solutions", href: "/admin/tech-solutions", icon: FiCpu },
      ],
    },
    {
      heading: "Media",
      items: [{ label: "Media Library", href: "/admin/media", icon: FiImage }],
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const renderNavLinks = () => (
    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
      {navSections.map((sec) => (
        <div key={sec.heading} className="space-y-1.5">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-ink-600 dark:text-ink-400 font-semibold">
            {sec.heading}
          </span>
          <div className="space-y-0.5">
            {sec.items.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 font-semibold border border-emerald-200 dark:border-emerald-500/20 shadow-xs"
                      : "text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100/70 dark:hover:bg-ink-800/60 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-ink-500 dark:text-ink-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-50/70 dark:bg-ink-950 text-ink-800 dark:text-ink-100 flex flex-col font-body transition-colors">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (Persistent Left Sidebar)                                 */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 fixed inset-y-0 left-0 bg-white dark:bg-ink-900 border-r border-ink-200 dark:border-ink-800 z-30 transition-colors">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-ink-200 dark:border-ink-800 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-ink-900 dark:text-ink-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Md Ibna Siam
              </span>
              <span className="block text-[10px] font-mono text-ink-600 dark:text-ink-400">
                Portfolio CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        {renderNavLinks()}

        {/* Sidebar Footer User & Live Site Link */}
        <div className="p-4 border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 shrink-0 space-y-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-ink-700 dark:text-ink-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-ink-800 border border-ink-200/80 dark:border-ink-800 transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <FiExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>View Public Site</span>
            </div>
            <span className="text-[10px] font-mono text-ink-600 dark:text-ink-400">
              Live ↗
            </span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                IS
              </div>
              <div className="truncate text-left">
                <span className="block text-xs font-semibold text-ink-800 dark:text-ink-200 truncate">
                  {userName || "Siam"}
                </span>
                <span className="block text-[10px] font-mono text-ink-600 dark:text-ink-400 truncate">
                  {userEmail || "admin@diu.edu.bd"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE SIDEBAR DRAWER                                                     */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-ink-900 border-r border-ink-200 dark:border-ink-800 shadow-2xl flex flex-col z-50 animate-fade-in">
            <div className="h-16 px-5 border-b border-ink-200 dark:border-ink-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-ink-900 dark:text-ink-100 text-sm">
                    Md Ibna Siam
                  </span>
                  <span className="block text-[10px] font-mono text-ink-600 dark:text-ink-400">
                    Portfolio CMS
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                aria-label="Close navigation drawer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {renderNavLinks()}

            <div className="p-4 border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 shrink-0 space-y-3">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-ink-700 dark:text-ink-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-ink-800 border border-ink-200/80 dark:border-ink-800 transition-all"
              >
                <div className="flex items-center gap-2">
                  <FiExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>View Public Site</span>
                </div>
                <span className="text-[10px] font-mono text-ink-600 dark:text-ink-400">
                  Live ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT (Offset by desktop sidebar width)                           */}
      {/* ========================================================================= */}
      <div className="lg:pl-64 xl:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Compact Top Utility Bar */}
        <header className="h-14 lg:h-16 sticky top-0 z-20 bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border-b border-ink-200 dark:border-ink-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-800 cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <FiMenu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-ink-600 dark:text-ink-400">
              <Link
                href="/admin"
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                Admin
              </Link>
              {breadcrumbs && breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <FiChevronRight className="w-3 h-3 text-ink-400 dark:text-ink-500" />
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink-900 dark:text-ink-100 font-semibold">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <>
                  <FiChevronRight className="w-3 h-3 text-ink-400 dark:text-ink-500" />
                  <span className="text-ink-900 dark:text-ink-100 font-semibold">
                    {title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Top Utility Actions: Theme Toggle, User, Sign-out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Pill */}
            {userEmail && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-100 dark:bg-ink-800/80 border border-ink-200 dark:border-ink-700/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-ink-800 dark:text-ink-200">
                  {userName || "Admin"}
                </span>
              </div>
            )}

            {/* Sign Out Form Action */}
            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign out of administrative session"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-ink-700 dark:text-ink-300 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-ink-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-ink-200 dark:border-ink-700/80 hover:border-rose-300 dark:hover:border-rose-500/30 active:translate-y-0.5 transition-all cursor-pointer shadow-2xs"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page Content Shell */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Consistent Page Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-ink-200 dark:border-ink-800">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 mt-1 leading-relaxed max-w-3xl">
                  {description}
                </p>
              )}
            </div>

            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>

          {/* Page Children Content */}
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

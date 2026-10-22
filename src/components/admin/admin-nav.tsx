"use client";

import React from "react";
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
} from "react-icons/fi";
import { signOutAction } from "@/app/(admin)/admin/actions";

interface AdminNavProps {
  userEmail?: string | null;
  userName?: string | null;
}

export function AdminNav({ userEmail, userName }: AdminNavProps) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Overview", href: "/admin", icon: FiGrid },
    { label: "Case Studies", href: "/admin/case-studies", icon: FiBookOpen },
    { label: "Competencies", href: "/admin/competencies", icon: FiAward },
    { label: "Academic Journey", href: "/admin/academic-journey", icon: FiCalendar },
    { label: "Tech Solutions", href: "/admin/tech-solutions", icon: FiCpu },
    { label: "Media Library", href: "/admin/media", icon: FiImage },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-ink-900 border-b border-ink-800 shadow-clay-card-dark sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-clay-inset-dark flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <FiShield className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-ink-100 text-sm group-hover:text-emerald-400 transition-colors">
                  Md Ibna Siam
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-400">
                  Portfolio CMS Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-clay-inset-dark font-semibold"
                      : "text-ink-300 hover:text-ink-100 hover:bg-ink-800/60 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-emerald-400" : "text-ink-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Badge & Sign Out */}
          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-ink-200 truncate max-w-[140px]">
                  {userName || "Admin"}
                </span>
                <span className="text-[10px] font-mono text-ink-400 truncate max-w-[140px]">
                  {userEmail}
                </span>
              </div>
            )}

            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign out of admin session"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-ink-400 hover:text-red-400 bg-ink-950/60 hover:bg-red-500/10 border border-ink-800 hover:border-red-500/30 shadow-clay-inset-dark active:translate-y-0.5 transition-all cursor-pointer"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Scroll */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-ink-800/60 scrollbar-none">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${
                  active
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold"
                    : "text-ink-400 hover:text-ink-200 hover:bg-ink-800/40"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

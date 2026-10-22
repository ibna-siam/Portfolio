"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiShield } from "react-icons/fi";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Competencies", href: "/#competencies" },
  { label: "Academic Journey", href: "/#academic-journey" },
  { label: "Tech Solutions", href: "/#solutions" },
  { label: "Contact", href: "/#contact" },
];

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-ink-950/90 backdrop-blur-md shadow-xs border-b border-ink-200/80 dark:border-ink-800/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg py-1 px-1.5"
        >
          <span className="font-display font-bold text-lg sm:text-xl text-ink-900 dark:text-ink-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Md Ibna Siam
          </span>
          <span className="hidden sm:inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Accounting & Finance
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-3.5 py-2 text-sm font-medium rounded-lg text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle + Admin Portal Link + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-ink-600 dark:text-ink-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors border border-transparent hover:border-ink-200 dark:hover:border-ink-800"
            aria-label="Admin Portal"
            title="Administrator Portal"
          >
            <FiShield size={13} aria-hidden="true" />
            <span>Admin</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 px-5 py-4 space-y-2 shadow-lg animate-fade-up">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-ink-100 dark:border-ink-800 flex justify-between items-center text-xs">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono py-1"
            >
              <FiShield size={13} />
              <span>Admin Portal</span>
            </Link>
            <span className="text-[11px] font-mono text-ink-600 dark:text-ink-400">DIU ID: 252-58-083</span>
          </div>
        </div>
      )}
    </header>
  );
}

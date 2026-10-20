import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useActiveSection } from "../hooks";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Competencies", href: "#skills" },
  { label: "Case Studies", href: "#projects" },
  { label: "Solutions", href: "#solutions" },
  { label: "Education", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = ["hero", "about", "skills", "projects", "solutions", "experience", "contact"];

export default function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink-50/90 dark:bg-ink-950/90 backdrop-blur-md shadow-sm border-b border-ink-200/80 dark:border-ink-800/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
          {/* Executive Wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg py-1 px-1.5"
            aria-label="Md Ibna Siam - Home"
          >
            <span className="font-display font-bold text-lg sm:text-xl text-ink-900 dark:text-ink-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Md Ibna Siam
            </span>
            <span className="hidden sm:inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Accounting & Finance
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100/60 dark:hover:bg-ink-900/60"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg border border-emerald-500/20 dark:border-emerald-400/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              );
            })}
          </nav>

          {/* Controls: Theme Toggle & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              className="p-2 sm:p-2.5 rounded-xl text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 border border-transparent hover:border-ink-200 dark:hover:border-ink-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-xl text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200/60 dark:border-ink-800/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-ink-50/95 dark:bg-ink-950/95 backdrop-blur-md border-b border-ink-200 dark:border-ink-800 shadow-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1.5">
              <div className="pb-2 mb-1 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
                <span className="text-xs font-mono text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                  Navigation
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Accounting & Finance
                </span>
              </div>
              {NAV_LINKS.map(({ label, href }) => {
                const sectionId = href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/80 hover:text-ink-900 dark:hover:text-ink-100"
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

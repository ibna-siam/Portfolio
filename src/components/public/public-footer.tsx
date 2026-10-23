"use client";

import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiShield } from "react-icons/fi";

const FOOTER_NAV = [
  { label: "About Profile", href: "/#about" },
  { label: "Case Studies Showcase", href: "/case-studies" },
  { label: "Accounting Competencies", href: "/#competencies" },
  { label: "Academic Journey & ACCA", href: "/#academic-journey" },
  { label: "Technology Solutions", href: "/#solutions" },
  { label: "Direct Inquiries", href: "/#contact" },
];

interface PublicFooterProps {
  email: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export function PublicFooter({ email, linkedinUrl, githubUrl }: PublicFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="bg-ink-900 dark:bg-ink-950 text-ink-300 border-t border-ink-800/80 transition-colors"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Portfolio Footer
      </h2>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-ink-800/80">
          {/* Identity & Focus (6 cols) */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Md Ibna Siam
              </span>
              <span className="inline-flex items-center text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Accounting & Finance
              </span>
            </div>
            <p className="text-xs text-ink-300 max-w-md leading-relaxed">
              Undergraduate student at Daffodil International University preparing for
              professional qualification (ACCA trajectory). Focused on financial reporting
              precision, managerial analysis, and technology-driven accounting systems.
            </p>
            <div className="text-[11px] text-ink-400 font-mono tracking-tight pt-1">
              Academic ID: 252-58-083 • Department of Accounting • Dhaka, Bangladesh
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3.5">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_NAV.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-ink-300 hover:text-emerald-300 focus-visible:text-emerald-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded transition-colors py-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Channels (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3.5">
              Verified Dossier
            </h3>
            <div className="flex flex-col space-y-2.5 text-xs">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-300 hover:text-emerald-400 focus-visible:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded transition-colors py-0.5"
                >
                  <FiLinkedin
                    size={15}
                    className="text-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-300 hover:text-emerald-400 focus-visible:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded transition-colors py-0.5"
                >
                  <FiGithub
                    size={15}
                    className="text-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span>GitHub Repository</span>
                </a>
              )}
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-ink-300 hover:text-emerald-400 focus-visible:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded transition-colors py-0.5"
              >
                <FiMail
                  size={15}
                  className="text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <span>Direct Email ({email})</span>
              </a>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-ink-300 hover:text-emerald-400 focus-visible:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded transition-colors py-0.5 pt-1"
              >
                <FiShield
                  size={15}
                  className="text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <span>Admin CMS Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-400">
          <p>© {new Date().getFullYear()} Md Ibna Siam. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-ink-300 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 py-1 px-2.5 rounded-md cursor-pointer border border-transparent hover:border-ink-800"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <FiArrowUp size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

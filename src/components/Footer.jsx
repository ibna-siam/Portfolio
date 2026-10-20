import { motion, useReducedMotion } from "framer-motion";
import { FiGithub, FiLinkedin, FiFileText, FiArrowUp } from "react-icons/fi";
import { personal } from "../data/portfolioData";

const FOOTER_NAV = [
  { label: "About", href: "#about" },
  { label: "Competencies", href: "#skills" },
  { label: "Case Studies", href: "#projects" },
  { label: "Solutions", href: "#solutions" },
  { label: "Education & Journey", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <footer
      className="bg-ink-900 dark:bg-ink-950 text-ink-300 border-t border-ink-800/80"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Portfolio Footer
      </h2>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-ink-800/80">
          {/* Identity & Focus (6 cols) */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Md Ibna Siam
              </span>
              <span className="inline-flex items-center text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Accounting & Finance
              </span>
            </div>
            <p className="text-xs text-ink-400 max-w-md leading-relaxed">
              Undergraduate student at Daffodil International University preparing
              for professional qualification (ACCA trajectory). Focused on financial
              reporting precision, managerial analysis, and technology-driven accounting systems.
            </p>
            <div className="text-[11px] text-ink-500 font-mono">
              Academic ID: 252-58-083 • Dhaka, Bangladesh
            </div>
          </div>

          {/* Canonical Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-200 mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_NAV.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="text-ink-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded py-0.5"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Dossier & Social Channels (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-200 mb-3">
              Verified Dossier
            </h3>
            <div className="flex flex-col space-y-2.5">
              <a
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-ink-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded py-0.5"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                <FiLinkedin size={15} className="text-emerald-500" />
                <span>LinkedIn</span>
              </a>

              <a
                href={personal.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-ink-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded py-0.5"
                aria-label="GitHub repository (opens in new tab)"
              >
                <FiGithub size={15} className="text-emerald-500" />
                <span>GitHub</span>
              </a>

              {personal.resumeUrl && (
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-ink-400 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded py-0.5"
                  aria-label="Curriculum Vitae PDF (opens in new tab)"
                >
                  <FiFileText size={15} className="text-emerald-500" />
                  <span>Curriculum Vitae</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <p>
            © {new Date().getFullYear()} Md Ibna Siam. Professional portfolio presented for academic and placement review.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-ink-600 font-mono">
              React • Vite • Tailwind CSS
            </span>

            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-emerald-600 text-ink-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Back to top of page"
            >
              <FiArrowUp size={14} />
              <span className="text-[11px] font-medium">Top</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}


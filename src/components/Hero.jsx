import siamPhoto from "../assets/siam.jpeg";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiArrowRight,
  FiLinkedin,
  FiGithub,
  FiMail,
  FiArrowDown,
} from "react-icons/fi";
import { personal } from "../data/portfolioData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const DOMAIN_TOPICS = [
  {
    topic: "DSE Ratio Analysis",
    description: "Financial Performance & Liquidity",
  },
  {
    topic: "NBR Tax Act 2023",
    description: "Individual Assessment & Rebates",
  },
  {
    topic: "Master Budgeting",
    description: "Operating Plans & Variance Modeling",
  },
  {
    topic: "Cost Accounting",
    description: "CVP & Contribution Analysis",
  },
  {
    topic: "Internal Audit",
    description: "Control Systems & Loss Mitigation",
  },
];

export default function Hero() {
  const scrollToProjects = (e) => {
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-16 overflow-hidden"
    >
      {/* Restrained subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-slate-500/5 dark:bg-slate-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Editorial Text Content */}
          <div className="lg:col-span-7">
            {/* Identity Badge */}
            <motion.div {...fadeUp(0.1)} className="mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-mono font-medium border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                BBA Accounting Candidate · Daffodil International University
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 dark:text-ink-50 tracking-tight leading-[1.15] mb-5"
            >
              Accounting & Finance Professional in Development
            </motion.h1>

            {/* Subheadline & Bio */}
            <motion.p
              {...fadeUp(0.3)}
              className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed mb-8 max-w-xl"
            >
              Specializing in financial reporting, managerial cost accounting, taxation compliance, and analytical modeling. Combining core accounting principles with financial software and structured problem-solving to deliver transparent business insight.
            </motion.p>

            {/* Strategic CTAs */}
            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3.5 mb-8">
              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                aria-label="View Academic CV (opens Google Drive in new tab)"
              >
                <FiDownload size={16} aria-hidden="true" />
                <span>View Academic CV</span>
              </a>
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink-100 dark:bg-ink-800/90 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-200 rounded-xl font-medium text-sm border border-ink-200 dark:border-ink-700 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              >
                <span>Explore Case Studies</span>
                <FiArrowRight size={16} aria-hidden="true" />
              </a>
            </motion.div>

            {/* Verified Social & Professional Connections */}
            <motion.div {...fadeUp(0.5)} className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400">
                Connect
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={personal.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Md Ibna Siam LinkedIn Profile"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400 border border-ink-200/80 dark:border-ink-700/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <FiLinkedin size={17} aria-hidden="true" />
                </a>
                <a
                  href={personal.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Md Ibna Siam GitHub Profile (Technology Projects)"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400 border border-ink-200/80 dark:border-ink-700/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <FiGithub size={17} aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${personal.email}`}
                  aria-label={`Send email to ${personal.email}`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400 border border-ink-200/80 dark:border-ink-700/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <FiMail size={17} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Portrait & Professional Focus Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-sm w-full"
            >
              {/* Outer frame */}
              <div className="relative rounded-3xl p-3 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-xl">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-ink-100 dark:bg-ink-950">
                  <img
                    src={siamPhoto}
                    alt="Md Ibna Siam - BBA Accounting Candidate"
                    width={400}
                    height={500}
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-full object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Bottom portrait label */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-ink-900/80 backdrop-blur-md border border-white/10 text-white">
                    <p className="text-xs font-mono text-emerald-400 font-semibold tracking-wide">
                      CAREER TRAJECTORY
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      Target Qualification: ACCA
                    </p>
                    <p className="text-[11px] text-ink-300 mt-0.5">
                      Daffodil International University · Accounting
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Applied Academic Domains Ribbon */}
        <motion.div
          {...fadeUp(0.6)}
          className="mt-16 pt-8 border-t border-ink-200/80 dark:border-ink-800/80"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-semibold">
              Applied Academic Case Studies & Core Disciplines
            </h2>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              Curriculum & Empirical Modeling
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DOMAIN_TOPICS.map(({ topic, description }) => (
              <div
                key={topic}
                className="p-3.5 rounded-xl bg-white dark:bg-ink-900/90 border border-ink-200/80 dark:border-ink-800/80 shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-colors"
              >
                <p className="text-xs font-semibold text-ink-900 dark:text-ink-100">{topic}</p>
                <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-1 leading-snug">{description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Accessible Scroll Down Anchor */}
      <div className="flex justify-center mt-10">
        <button
          onClick={scrollToAbout}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-400 dark:text-ink-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2 px-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
          aria-label="Scroll down to About section"
        >
          <span>LEARN MORE</span>
          <FiArrowDown size={14} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

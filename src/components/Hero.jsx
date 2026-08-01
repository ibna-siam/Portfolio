import siamPhoto from "../assets/siam.jpeg";
import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiDownload,
  FiMail,
  FiArrowDown,
} from "react-icons/fi";
import { personal } from "../data/portfolioData";
import { useTypingEffect } from "../hooks";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const typedText = useTypingEffect(personal.taglines);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-accent-400/10 dark:bg-accent-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Text content */}
        <div>
          <motion.div {...fadeUp(0.1)} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-400 text-sm font-medium border border-teal-500/20">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Available for work
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-ink-900 dark:text-ink-50 leading-[1.1] mb-4"
          >
            Hi, I'm{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-teal-600 dark:text-teal-400">
                {personal.firstName}
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-teal-400/20 dark:bg-teal-500/20 -rotate-1 rounded" />
            </span>
          </motion.h1>

          {/* Typing text */}
          <motion.div {...fadeUp(0.3)} className="mb-6 h-10 flex items-center">
            <span className="font-mono text-lg sm:text-xl text-ink-500 dark:text-ink-400">
              &gt;{" "}
              <span className="text-accent-500 dark:text-accent-400 font-medium">
                {typedText}
              </span>
              <span className="animate-blink text-ink-400">|</span>
            </span>
          </motion.div>

          <motion.p
            {...fadeUp(0.4)}
            className="text-ink-600 dark:text-ink-400 text-lg leading-relaxed mb-8 max-w-lg"
          >
            {personal.bio}
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3 mb-8">
            <a
              href={personal.resumeUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
            >
              <FiDownload size={16} />
              Download Resume
            </a>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink-200/80 dark:bg-ink-800/80 hover:bg-ink-300 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-200 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <FiMail size={16} />
              Contact Me
            </button>
          </motion.div>

          {/* Social links */}
          <motion.div {...fadeUp(0.6)} className="flex items-center gap-4">
            <span className="text-xs text-ink-400 dark:text-ink-600 uppercase tracking-widest">
              Find me on
            </span>
            <div className="flex gap-3">
              {[
                { icon: FiGithub, href: personal.social.github, label: "GitHub" },
                { icon: FiLinkedin, href: personal.social.linkedin, label: "LinkedIn" },
                { icon: FiTwitter, href: personal.social.twitter, label: "Twitter" },
                { icon: FiFacebook, href: personal.social.facebook, label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-ink-200/60 dark:bg-ink-800/60 text-ink-600 dark:text-ink-400 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:bg-teal-400/10 dark:hover:text-teal-400 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Avatar / visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute inset-[-12px] rounded-full border-2 border-dashed border-teal-400/30 dark:border-teal-500/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-[-28px] rounded-full border border-ink-200/60 dark:border-ink-800/40" />

            {/* Avatar container */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden bg-gradient-to-br from-teal-400/20 to-accent-400/20 dark:from-teal-500/10 dark:to-accent-500/10 border-4 border-white dark:border-ink-900 shadow-2xl">
              <img
                src={siamPhoto}
                alt={personal.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 bg-white dark:bg-ink-900 rounded-2xl shadow-lg px-4 py-2 border border-ink-100 dark:border-ink-800"
            >
              <span className="text-sm font-medium text-ink-700 dark:text-ink-300">
                🚀 Open to opportunities
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ink-400 dark:text-ink-600 hover:text-teal-500 dark:hover:text-teal-400 transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FiArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiTwitter, FiFacebook, FiArrowUp } from "react-icons/fi";
import { personal } from "../data/portfolioData";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-ink-900 dark:bg-ink-950 text-ink-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo & copy */}
          <div>
            <div className="font-display font-bold text-xl text-white mb-1">
              {personal.firstName}
              <span className="text-teal-400">.</span>
            </div>
            <p className="text-xs text-ink-500">
              © {new Date().getFullYear()} {personal.name}. Built with React & Tailwind CSS.
            </p>
          </div>

          {/* Social icons */}
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
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-ink-800 hover:bg-teal-500/20 hover:text-teal-400 text-ink-400 transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/30 transition-colors"
            aria-label="Back to top"
          >
            <FiArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

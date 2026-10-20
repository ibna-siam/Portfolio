import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiCheck,
  FiCopy,
  FiLinkedin,
  FiGithub,
  FiFileText,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import { personal } from "../data/portfolioData";
import { SectionHeading } from "./SectionHeading";

const INQUIRY_OPTIONS = [
  "Internship / Trainee Opportunity",
  "Academic Research & Study Collaboration",
  "Business & Financial Systems Project",
  "General Professional Inquiry",
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiryType: "Internship / Trainee Opportunity",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedEmail(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) {
      e.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) {
      e.message = "Message content is required";
    } else if (form.message.trim().length < 15) {
      e.message = "Please provide at least 15 characters describing your inquiry";
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSending(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://formspree.io/f/mjgzqeeg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          inquiryType: form.inquiryType,
          message: form.message.trim(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({
          name: "",
          email: "",
          inquiryType: "Internship / Trainee Opportunity",
          message: "",
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setSubmitError(
          data?.error ||
            "Unable to submit message at this moment. Please reach out directly via official email."
        );
      }
    } catch {
      setSubmitError(
        "Network connection error. Please email directly at " + personal.email
      );
    } finally {
      setSending(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-ink-100/70 dark:bg-ink-800/70 border text-ink-900 dark:text-ink-100 text-sm placeholder-ink-400 dark:placeholder-ink-500 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors ${
      errors[field]
        ? "border-rose-400 dark:border-rose-500 focus:border-rose-500"
        : "border-ink-200 dark:border-ink-700 focus:border-emerald-500 dark:focus:border-emerald-400"
    }`;

  const containerAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, ease: "easeOut" },
      };

  return (
    <section
      id="contact"
      className="py-24 bg-ink-50/60 dark:bg-ink-950/60 border-t border-ink-200/50 dark:border-ink-800/50"
      aria-labelledby="contact-heading"
    >
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div {...containerAnimation}>
          <SectionHeading
            label="Direct Communication"
            title="Contact & Professional Inquiries"
            subtitle="Open to accounting internships, trainee analyst roles, academic collaborations, and business operations problem-solving."
          />

          <div className="grid lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
            {/* Info Side (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Introduction Card */}
              <div className="bg-white dark:bg-ink-900 rounded-2xl p-6 border border-ink-200/80 dark:border-ink-800/80 shadow-sm">
                <h3 className="font-display font-semibold text-ink-900 dark:text-ink-100 text-base mb-2">
                  Academic & Professional Enquiries
                </h3>
                <p className="text-ink-600 dark:text-ink-400 text-sm leading-relaxed mb-6">
                  Whether you are an audit firm recruiter, finance department
                  lead, academic mentor, or peer discussing financial technology
                  and operational reporting, I welcome direct correspondence.
                </p>

                {/* Direct Email Card with Copy Utility */}
                <div className="p-4 rounded-xl bg-ink-100/70 dark:bg-ink-800/60 border border-ink-200/60 dark:border-ink-700/60 mb-5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
                      <FiMail className="text-emerald-600 dark:text-emerald-400" />
                      Official University Email
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1.5 py-0.5"
                      aria-label={copiedEmail ? "Email copied" : "Copy email address to clipboard"}
                    >
                      {copiedEmail ? (
                        <>
                          <FiCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FiCopy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={`mailto:${personal.email}`}
                    className="font-mono text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:underline block break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                    title={`Send email to ${personal.email}`}
                  >
                    {personal.email}
                  </a>
                  <div aria-live="polite" className="sr-only">
                    {copiedEmail && "Email address copied to clipboard."}
                  </div>
                </div>

                {/* Location & Academic Base */}
                <div className="flex items-start gap-3 text-ink-600 dark:text-ink-400 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                    <FiMapPin size={15} />
                  </div>
                  <div>
                    <span className="block font-medium text-ink-800 dark:text-ink-200 text-sm">
                      Daffodil International University
                    </span>
                    <span>Department of Accounting — Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>

              {/* Verified Professional Profiles */}
              <div className="bg-white dark:bg-ink-900 rounded-2xl p-6 border border-ink-200/80 dark:border-ink-800/80 shadow-sm space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
                  Verified Channels & Dossier
                </h4>

                <a
                  href={personal.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-ink-50 dark:bg-ink-800/40 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 border border-ink-200/60 dark:border-ink-700/60 text-ink-800 dark:text-ink-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div className="flex items-center gap-3">
                    <FiLinkedin className="text-emerald-700 dark:text-emerald-400 text-base" />
                    <div>
                      <div className="text-xs font-semibold">LinkedIn Profile</div>
                      <div className="text-[11px] text-ink-500 dark:text-ink-400">Professional network & recommendations</div>
                    </div>
                  </div>
                  <FiExternalLink size={14} className="text-ink-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </a>

                <a
                  href={personal.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-ink-50 dark:bg-ink-800/40 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 border border-ink-200/60 dark:border-ink-700/60 text-ink-800 dark:text-ink-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div className="flex items-center gap-3">
                    <FiGithub className="text-emerald-700 dark:text-emerald-400 text-base" />
                    <div>
                      <div className="text-xs font-semibold">GitHub Repository</div>
                      <div className="text-[11px] text-ink-500 dark:text-ink-400">Financial models, scripts & code</div>
                    </div>
                  </div>
                  <FiExternalLink size={14} className="text-ink-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </a>

                {personal.resumeUrl && (
                  <a
                    href={personal.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-ink-50 dark:bg-ink-800/40 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 border border-ink-200/60 dark:border-ink-700/60 text-ink-800 dark:text-ink-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-emerald-700 dark:text-emerald-400 text-base" />
                      <div>
                        <div className="text-xs font-semibold">Curriculum Vitae (PDF)</div>
                        <div className="text-[11px] text-ink-500 dark:text-ink-400">Academic & competency credentials</div>
                      </div>
                    </div>
                    <FiExternalLink size={14} className="text-ink-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  </a>
                )}
              </div>

              {/* Status & Placement Availability */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Undergraduate Trainee Placement
                  </span>
                </div>
                <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                  Available for accounting internships, junior audit trainee roles,
                  and research assistance. Committed to ACCA professional standards
                  and data-driven accuracy.
                </p>
              </div>
            </div>

            {/* Form Side (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-ink-900 rounded-2xl p-6 sm:p-8 border border-ink-200/80 dark:border-ink-800/80 shadow-sm">
              {submitted ? (
                <div
                  className="flex flex-col items-center justify-center h-full text-center py-10"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <FiCheckCircle size={32} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100 mb-2">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400 max-w-sm mb-6 leading-relaxed">
                    Thank you for getting in touch. Your message has been routed
                    to my direct mailbox and I will review it promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmitError(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="border-b border-ink-100 dark:border-ink-800 pb-3 mb-4">
                    <h3 className="font-display font-semibold text-ink-900 dark:text-ink-100 text-base">
                      Send an Inquiry
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                      Complete the details below or email directly via official university channels.
                    </p>
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5"
                    >
                      <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5"
                    >
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Sarah Jenkins"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="mt-1 text-xs text-rose-500 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5"
                    >
                      Professional Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g., s.jenkins@auditfirm.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="mt-1 text-xs text-rose-500 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Inquiry Category Selector */}
                  <div>
                    <label
                      htmlFor="contact-inquiry-type"
                      className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5"
                    >
                      Inquiry Category
                    </label>
                    <select
                      id="contact-inquiry-type"
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={handleChange}
                      className={inputClass("inquiryType")}
                    >
                      {INQUIRY_OPTIONS.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className="bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100"
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5"
                    >
                      Inquiry Details & Scope <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Outline your internship parameters, academic research interest, or project context..."
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className={`${inputClass("message")} resize-none`}
                    />
                    {errors.message && (
                      <p id="contact-message-error" className="mt-1 text-xs text-rose-500 font-medium">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/20 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {sending ? (
                        <>
                          <span
                            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                            aria-hidden="true"
                          />
                          <span>Transmitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <FiSend size={15} aria-hidden="true" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-ink-500 dark:text-ink-400 text-center pt-2">
                    Direct inquiries are routed through secure Formspree delivery. No marketing tracking or unsolicited distribution.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


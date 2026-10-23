"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiSend,
  FiCheck,
  FiCopy,
  FiLinkedin,
  FiGithub,
  FiCheckCircle,
} from "react-icons/fi";

const INQUIRY_OPTIONS = [
  "Internship / Trainee Opportunity",
  "Academic Research & Study Collaboration",
  "Business & Financial Systems Project",
  "General Professional Inquiry",
];

interface PublicContactProps {
  email: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export function PublicContact({
  email,
  location,
  linkedinUrl,
  githubUrl,
}: PublicContactProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiryType: INQUIRY_OPTIONS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) {
      errs.message = "Message content is required";
    } else if (form.message.trim().length < 15) {
      errs.message = "Please provide at least 15 characters describing your inquiry";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          inquiryType: INQUIRY_OPTIONS[0],
          message: "",
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setSubmitError(
          data.error || "Unable to send message via form endpoint. Please email directly."
        );
      }
    } catch {
      setSubmitError("Network transmission error. Please use direct email: " + email);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-24 bg-white dark:bg-ink-950 border-t border-ink-200/60 dark:border-ink-800/60"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Professional Communication
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Direct Inquiries & Dossier Access
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Open to audit trainee opportunities, academic research collaborations, and
            accounting software projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Direct Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-ink-50/70 dark:bg-ink-900/60 border border-ink-200/80 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark space-y-5">
              <h3 className="font-display font-bold text-xl text-ink-900 dark:text-ink-50">
                Official Channels
              </h3>

              {/* Email Card with Copy Action */}
              <div className="p-4 rounded-2xl bg-white dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800/80 space-y-2">
                <span className="text-[11px] font-mono text-ink-600 dark:text-ink-400 uppercase font-semibold block">
                  Official Academic Email
                </span>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${email}`}
                    className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline break-all"
                  >
                    {email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-emerald-500/10 text-ink-600 dark:text-ink-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                    title="Copy Email Address"
                    aria-label="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <FiCheck size={14} className="text-emerald-500" />
                    ) : (
                      <FiCopy size={14} />
                    )}
                  </button>
                </div>
                {copiedEmail && (
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block">
                    Copied to clipboard
                  </span>
                )}
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-600 dark:text-ink-400 shrink-0">
                  <FiMapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-ink-600 dark:text-ink-400 uppercase block font-semibold">
                    Geographic Base
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-ink-800 dark:text-ink-200">
                    {location}
                  </span>
                </div>
              </div>

              {/* Dossier Links */}
              <div className="pt-2 flex flex-col gap-2">
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 flex items-center justify-between text-xs text-ink-700 dark:text-ink-300 hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <FiLinkedin
                        size={15}
                        className="text-emerald-700 dark:text-emerald-400"
                      />
                      LinkedIn Professional Profile
                    </span>
                    <span className="text-[10px] font-mono text-ink-600 dark:text-ink-400">
                      Verified
                    </span>
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 flex items-center justify-between text-xs text-ink-700 dark:text-ink-300 hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <FiGithub
                        size={15}
                        className="text-emerald-700 dark:text-emerald-400"
                      />
                      GitHub Project Repository
                    </span>
                    <span className="text-[10px] font-mono text-ink-600 dark:text-ink-400">
                      Public Code
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Formspree Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <FiCheckCircle size={30} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink-900 dark:text-ink-50">
                    Message Transmitted Successfully
                  </h3>
                  <p className="text-sm text-ink-600 dark:text-ink-300 max-w-md mx-auto leading-relaxed">
                    Thank you for your inquiry. Your message has been sent directly to Md
                    Ibna Siam via the verified contact portal.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  action="https://formspree.io/f/mqaevepk"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <h3 className="font-display font-bold text-xl text-ink-900 dark:text-ink-50 mb-2">
                    Direct Inquiry Form
                  </h3>

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs">
                      {submitError}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="form-name"
                        className="block text-xs font-mono font-medium text-ink-700 dark:text-ink-300 mb-1"
                      >
                        Your Name *
                      </label>
                      <input
                        id="form-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-ink-50 dark:bg-ink-950 border text-ink-900 dark:text-ink-100 placeholder:text-ink-600 dark:placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          errors.name
                            ? "border-red-500"
                            : "border-ink-200 dark:border-ink-800"
                        }`}
                        placeholder="e.g. Audit Manager / Recruiter"
                      />
                      {errors.name && (
                        <span className="text-[11px] text-red-500 mt-1 block">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="form-email"
                        className="block text-xs font-mono font-medium text-ink-700 dark:text-ink-300 mb-1"
                      >
                        Your Email *
                      </label>
                      <input
                        id="form-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-ink-50 dark:bg-ink-950 border text-ink-900 dark:text-ink-100 placeholder:text-ink-600 dark:placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          errors.email
                            ? "border-red-500"
                            : "border-ink-200 dark:border-ink-800"
                        }`}
                        placeholder="e.g. name@firm.com"
                      />
                      {errors.email && (
                        <span className="text-[11px] text-red-500 mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="form-inquiry"
                      className="block text-xs font-mono font-medium text-ink-700 dark:text-ink-300 mb-1"
                    >
                      Inquiry Category
                    </label>
                    <select
                      id="form-inquiry"
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {INQUIRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="form-message"
                      className="block text-xs font-mono font-medium text-ink-700 dark:text-ink-300 mb-1"
                    >
                      Message Details *
                    </label>
                    <textarea
                      id="form-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: "" });
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-ink-50 dark:bg-ink-950 border text-ink-900 dark:text-ink-100 placeholder:text-ink-600 dark:placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.message
                          ? "border-red-500"
                          : "border-ink-200 dark:border-ink-800"
                      }`}
                      placeholder="Please describe your organization, opportunity, or research inquiry..."
                    />
                    {errors.message && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <FiSend size={14} />
                    <span>
                      {sending ? "Transmitting Message..." : "Send Professional Inquiry"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

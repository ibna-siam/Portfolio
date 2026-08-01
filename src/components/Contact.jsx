import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { personal } from "../data/portfolioData";
import { SectionHeading } from "./About";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10)
      e.message = "Message is too short";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSending(true);

    const response = await fetch("https://formspree.io/f/mjgzqeeg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    });

    setSending(false);

    if (response.ok) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-ink-100/80 dark:bg-ink-800/80 border text-ink-800 dark:text-ink-200 text-sm placeholder-ink-400 dark:placeholder-ink-600 outline-none focus:ring-2 ring-teal-400/50 transition-all ${
      errors[field]
        ? "border-red-400 dark:border-red-500"
        : "border-ink-200 dark:border-ink-700 focus:border-teal-400 dark:focus:border-teal-500"
    }`;

  return (
    <section id="contact" className="py-24">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            label="Get in touch"
            title="Contact Me"
            subtitle="Have a project in mind or just want to say hi? My inbox is open."
          />

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info side */}
            <div>
              <p className="text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
                Whether it's a full-time role, freelance project, or just a
                conversation — feel free to reach out. I'll try to get back to
                you within 24 hours.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: FiMail, label: "Email", value: personal.email },
                  { icon: FiPhone, label: "Phone", value: personal.phone },
                  {
                    icon: FiMapPin,
                    label: "Location",
                    value: personal.location,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-ink-400 dark:text-ink-600 mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Availability indicator */}
              <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-400/5 border border-teal-500/20 dark:border-teal-400/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
                    Currently available
                  </span>
                </div>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  Open to freelance projects and full-time positions starting
                  immediately.
                </p>
              </div>
            </div>

            {/* Form side */}
            <div className="bg-white dark:bg-ink-900 rounded-2xl p-6 sm:p-8 border border-ink-100 dark:border-ink-800 shadow-sm">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 mb-4">
                    <FiCheckCircle size={32} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
                    Message sent!
                  </h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-xs font-medium text-ink-500 dark:text-ink-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-500 dark:text-ink-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-500 dark:text-ink-400 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell me about your project..."
                      className={`${inputClass("message")} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

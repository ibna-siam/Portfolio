"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import {
  upsertTechSolutionAction,
  TechSolutionFormData,
} from "@/app/(admin)/admin/tech-solutions/actions";
import { AdminPageHeader } from "@/components/admin/forms/admin-page-header";
import { FormCard } from "@/components/admin/forms/form-card";
import { TagInputField } from "@/components/admin/forms/tag-input-field";

interface TechSolutionEditorProps {
  initialData?: Partial<TechSolutionFormData> & { id?: string };
  isNew?: boolean;
}

export function TechSolutionEditor({
  initialData,
  isNew = false,
}: TechSolutionEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [id, setId] = useState(initialData?.id || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(
    initialData?.category || "Financial Software & Engineering"
  );
  const [status, setStatus] = useState(initialData?.status || "Production Ready");
  const [statusTheme, setStatusTheme] = useState(initialData?.statusTheme || "emerald");
  const [userRole, setUserRole] = useState(initialData?.userRole || "Lead Architect");
  const [problem, setProblem] = useState(initialData?.problem || "");
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [techStack, setTechStack] = useState<string[]>(
    initialData?.techStack || ["TypeScript", "Next.js", "PostgreSQL"]
  );
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || ["Real-time financial computation", "Data persistence layer"]
  );
  const [featureInput, setFeatureInput] = useState("");
  const [verifiedRepo, setVerifiedRepo] = useState(initialData?.verifiedRepo || "");
  const [verifiedDemo, setVerifiedDemo] = useState(initialData?.verifiedDemo || "");
  const [linkText, setLinkText] = useState(initialData?.linkText || "View Repository");
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);
  const [contentStatus, setContentStatus] = useState<string>(
    initialData?.contentStatus || "published"
  );

  const handleAddFeature = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) {
      setFeedback({ type: "error", message: "System identifier is required." });
      return;
    }
    if (!title.trim()) {
      setFeedback({ type: "error", message: "System title is required." });
      return;
    }

    startTransition(async () => {
      const payload: TechSolutionFormData = {
        id: id.trim(),
        title: title.trim(),
        category: category.trim(),
        status: status.trim(),
        statusTheme: statusTheme.trim(),
        userRole: userRole.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        techStack,
        features,
        verifiedRepo: verifiedRepo.trim() || null,
        verifiedDemo: verifiedDemo.trim() || null,
        linkText: linkText.trim() || "View Repository",
        sortOrder,
        contentStatus,
      };

      const res = await upsertTechSolutionAction(payload);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "Tech solution saved successfully.",
        });
        setTimeout(() => {
          router.push("/admin/tech-solutions");
          router.refresh();
        }, 800);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to save tech solution.",
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <AdminPageHeader
        title={isNew ? "New Tech Solution" : `Edit Solution: ${title || id}`}
        description="Configure financial engineering tools, reconciliation systems, and automation software."
        breadcrumbs={[
          { label: "Tech Solutions", href: "/admin/tech-solutions" },
          { label: isNew ? "New" : title || id },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/tech-solutions"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              <FiArrowLeft size={13} />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              form="tech-solution-form"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={13} />
              <span>
                {isPending ? "Saving..." : isNew ? "Create Solution" : "Update Solution"}
              </span>
            </button>
          </div>
        }
      />

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" && <FiCheckCircle size={15} />}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form */}
      <form id="tech-solution-form" onSubmit={handleSubmit} className="space-y-6">
        <FormCard
          title="System Identity & Classification"
          description="Unique system slug, title, and operational category."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                System Identifier (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isNew}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. digital-mess-system"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 disabled:opacity-60 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
              <p className="text-[11px] text-ink-500 font-mono mt-1">
                {isNew
                  ? "Lowercase alphanumeric with hyphens"
                  : "Immutable primary key identifier"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                System Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Shared Expense Reconciliation System"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Financial Software & Engineering"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Status Badge Label
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Production Ready"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Badge Theme
              </label>
              <select
                value={statusTheme}
                onChange={(e) => setStatusTheme(e.target.value)}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all cursor-pointer"
              >
                <option value="emerald">Emerald (Production / Live)</option>
                <option value="blue">Blue (Active Engineering)</option>
                <option value="amber">Amber (Validation / Testing)</option>
                <option value="purple">Purple (Advanced System)</option>
                <option value="slate">Slate (Archived / Internal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Architectural Role
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="Lead Architect / Developer"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Problem-Solution Engineering"
          description="Detailed financial bottlenecks and implemented software architecture."
        >
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Problem Addressed (Financial & Operational Bottleneck){" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the operational reconciliation challenges, manual calculation errors, or data friction..."
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Engineered Solution (Technical Architecture & Controls){" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Detail the automated ledger, mathematical verification logic, and relational data architecture..."
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed transition-all"
            />
          </div>

          <TagInputField
            label="Technology Stack"
            helperText="Press Enter or comma to add"
            tags={techStack}
            onChange={setTechStack}
            placeholder="e.g. Next.js, PostgreSQL, TypeScript, Tailwind"
          />

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Architectural Capabilities & Features
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature(featureInput);
                    }
                  }}
                  placeholder="Type a feature and press Enter or Add..."
                  className="flex-1 bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddFeature(featureInput)}
                  className="px-3 py-2 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Add Feature
                </button>
              </div>

              <ul className="space-y-1.5 pt-1">
                {features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800 text-xs font-mono"
                  >
                    <span>• {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Verified Repository Links & Publishing"
          description="Safe external repository URLs and publication status."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Verified Repository URL (GitHub)
              </label>
              <input
                type="url"
                value={verifiedRepo}
                onChange={(e) => setVerifiedRepo(e.target.value)}
                placeholder="https://github.com/ibna-siam/..."
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Verified Live Demo URL (Optional)
              </label>
              <input
                type="url"
                value={verifiedDemo}
                onChange={(e) => setVerifiedDemo(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Link Button Label
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="View Source Code"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Display Order Sequence
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Content Status
              </label>
              <select
                value={contentStatus}
                onChange={(e) => setContentStatus(e.target.value)}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all cursor-pointer"
              >
                <option value="published">Published</option>
                <option value="draft">Draft (Admin Only)</option>
              </select>
            </div>
          </div>
        </FormCard>

        {/* Bottom Save Action Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border border-ink-200 dark:border-ink-800 rounded-2xl shadow-lg">
          <Link
            href="/admin/tech-solutions"
            className="text-xs font-mono text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
          >
            ← Back to Tech Solutions List
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={14} />
              <span>
                {isPending ? "Saving..." : isNew ? "Create Solution" : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import {
  upsertCompetencyAction,
  CompetencyFormData,
} from "@/app/(admin)/admin/competencies/actions";
import { AdminPageHeader } from "@/components/admin/forms/admin-page-header";
import { FormCard } from "@/components/admin/forms/form-card";
import { TagInputField } from "@/components/admin/forms/tag-input-field";

const DOMAINS = [
  "Financial Accounting",
  "Managerial Accounting",
  "Taxation & Audit",
  "Software & Tech",
];

interface CompetencyEditorProps {
  initialData?: Partial<CompetencyFormData> & { id?: string };
  isNew?: boolean;
}

export function CompetencyEditor({ initialData, isNew = false }: CompetencyEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [domain, setDomain] = useState(initialData?.domain || DOMAINS[0]);
  const [category, setCategory] = useState(initialData?.category || DOMAINS[0]);
  const [evidenceLabel, setEvidenceLabel] = useState(
    initialData?.evidenceLabel || "Case Study & Coursework"
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [frameworkTags, setFrameworkTags] = useState<string[]>(
    initialData?.frameworkTags || ["IFRS", "Excel"]
  );
  const [relatedProject, setRelatedProject] = useState(
    initialData?.relatedProject || "Academic Coursework"
  );
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);
  const [status, setStatus] = useState<string>(initialData?.status || "published");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: "error", message: "Competency name is required." });
      return;
    }

    startTransition(async () => {
      const payload: CompetencyFormData = {
        id: isNew ? undefined : initialData?.id,
        name: name.trim(),
        domain: domain.trim(),
        category: category.trim() || domain.trim(),
        evidenceLabel: evidenceLabel.trim() || "Case Study",
        description: description.trim(),
        frameworkTags,
        relatedProject: relatedProject.trim(),
        sortOrder,
        status,
      };

      const res = await upsertCompetencyAction(payload);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "Competency saved successfully.",
        });
        setTimeout(() => {
          router.push("/admin/competencies");
          router.refresh();
        }, 800);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to save competency.",
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <AdminPageHeader
        title={isNew ? "New Competency" : `Edit Competency: ${name || "Untitled"}`}
        description="Configure accounting, audit, taxation, and financial technology capabilities."
        breadcrumbs={[
          { label: "Competencies", href: "/admin/competencies" },
          { label: isNew ? "New" : "Edit" },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/competencies"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              <FiArrowLeft size={13} />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              form="competency-form"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={13} />
              <span>
                {isPending
                  ? "Saving..."
                  : isNew
                    ? "Create Competency"
                    : "Update Competency"}
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
      <form id="competency-form" onSubmit={handleSubmit} className="space-y-6">
        <FormCard
          title="Core Classification & Identity"
          description="Basic identification and primary analytical domain."
        >
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Competency Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Financial Statement Analysis & Ratio Modeling"
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Primary Domain <span className="text-red-500">*</span>
              </label>
              <select
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setCategory(e.target.value);
                }}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all cursor-pointer"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Evidence Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={evidenceLabel}
                onChange={(e) => setEvidenceLabel(e.target.value)}
                placeholder="Case Study / Coursework / Research"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Analytical Scope & Methodological Mastery"
          description="Detailed narrative and verified academic coursework anchors."
        >
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Methodological Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of technical or accounting methods applied..."
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed transition-all"
            />
          </div>

          <TagInputField
            label="Accounting & Technical Framework Tags"
            helperText="Press Enter or comma to add"
            tags={frameworkTags}
            onChange={setFrameworkTags}
            placeholder="e.g. IFRS, IAS 1, Ratio Analysis"
          />

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Related Academic Project or Coursework Anchor
            </label>
            <input
              type="text"
              value={relatedProject}
              onChange={(e) => setRelatedProject(e.target.value)}
              placeholder="e.g. Square Pharmaceuticals Annual Report Analysis"
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
            />
          </div>
        </FormCard>

        <FormCard
          title="Display & Publishing Settings"
          description="Control display sorting order and visibility."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Display Order Sequence (Sort Index)
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
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all cursor-pointer"
              >
                <option value="published">Published (Visible on Portfolio)</option>
                <option value="draft">Draft (Admin Only)</option>
              </select>
            </div>
          </div>
        </FormCard>

        {/* Bottom Save Action Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border border-ink-200 dark:border-ink-800 rounded-2xl shadow-lg">
          <Link
            href="/admin/competencies"
            className="text-xs font-mono text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
          >
            ← Back to Competencies List
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={14} />
              <span>
                {isPending ? "Saving..." : isNew ? "Create Competency" : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import {
  updateMilestoneAction,
  MilestoneFormData,
} from "@/app/(admin)/admin/academic-journey/actions";
import { AdminPageHeader } from "@/components/admin/forms/admin-page-header";
import { FormCard } from "@/components/admin/forms/form-card";
import { TagInputField } from "@/components/admin/forms/tag-input-field";

interface MilestoneEditorProps {
  initialData: MilestoneFormData;
}

export function MilestoneEditor({ initialData }: MilestoneEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [degree, setDegree] = useState(initialData.degree);
  const [institution, setInstitution] = useState(initialData.institution);
  const [campus, setCampus] = useState(initialData.campus);
  const [major, setMajor] = useState(initialData.major);
  const [period, setPeriod] = useState(initialData.period);
  const [status, setStatus] = useState(initialData.status);
  const [overview, setOverview] = useState(initialData.overview);
  const [disciplines, setDisciplines] = useState<string[]>(initialData.disciplines || []);
  const [sortOrder, setSortOrder] = useState<number>(initialData.sortOrder ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) {
      setFeedback({ type: "error", message: "Degree and Institution are required." });
      return;
    }

    startTransition(async () => {
      const payload: MilestoneFormData = {
        id: initialData.id,
        degree: degree.trim(),
        institution: institution.trim(),
        campus: campus.trim(),
        major: major.trim(),
        status: status.trim(),
        period: period.trim(),
        overview: overview.trim(),
        disciplines,
        sortOrder,
      };

      const res = await updateMilestoneAction(payload);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "Milestone updated successfully.",
        });
        setTimeout(() => {
          router.push("/admin/academic-journey");
          router.refresh();
        }, 800);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update milestone.",
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <AdminPageHeader
        title={`Edit Milestone: ${degree}`}
        description="Configure institutional academic credentials, periods, and foundational accounting disciplines."
        breadcrumbs={[
          { label: "Academic Journey", href: "/admin/academic-journey" },
          { label: degree },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/academic-journey"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              <FiArrowLeft size={13} />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              form="milestone-form"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={13} />
              <span>{isPending ? "Saving..." : "Update Milestone"}</span>
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
      <form id="milestone-form" onSubmit={handleSubmit} className="space-y-6">
        <FormCard
          title="Degree & Academic Institution"
          description="Official degree title, academic body, and campus location."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Degree / Certification Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Bachelor of Business Administration (BBA)"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Daffodil International University"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Campus / Location
              </label>
              <input
                type="text"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                placeholder="e.g. Daffodil Smart City, Birulia, Dhaka"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Major / Concentration
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Major in Accounting"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Academic Period & Curriculum Scope"
          description="Chronological duration, status, and disciplinary curriculum."
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Academic Period
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. 2025 – Present"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Academic Status
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="e.g. Undergraduate Degree (In Progress)"
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Academic Overview & Focus
            </label>
            <textarea
              rows={4}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Summary of coursework rigor, key academic competencies, and research focus..."
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed transition-all"
            />
          </div>

          <TagInputField
            label="Key Disciplines & Coursework Topics"
            helperText="Press Enter or comma to add"
            tags={disciplines}
            onChange={setDisciplines}
            placeholder="e.g. Financial Accounting, Cost Accounting, Auditing"
          />
        </FormCard>

        {/* Bottom Save Action Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border border-ink-200 dark:border-ink-800 rounded-2xl shadow-lg">
          <Link
            href="/admin/academic-journey"
            className="text-xs font-mono text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
          >
            ← Back to Academic Journey
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={14} />
              <span>{isPending ? "Saving..." : "Save Milestone Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

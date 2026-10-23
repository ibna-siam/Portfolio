"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import {
  updateAccaTrajectoryAction,
  AccaTrajectoryFormData,
} from "@/app/(admin)/admin/academic-journey/actions";
import { AdminPageHeader } from "@/components/admin/forms/admin-page-header";
import { FormCard } from "@/components/admin/forms/form-card";

interface AccaTrajectoryEditorProps {
  initialData: AccaTrajectoryFormData;
}

export function AccaTrajectoryEditor({ initialData }: AccaTrajectoryEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [qualification, setQualification] = useState(initialData.qualification);
  const [credentialBody, setCredentialBody] = useState(initialData.credentialBody);
  const [trajectoryType, setTrajectoryType] = useState(initialData.trajectoryType);
  const [statusLabel, setStatusLabel] = useState(initialData.statusLabel);
  const [integrityNotice, setIntegrityNotice] = useState(initialData.integrityNotice);
  const [strategicFocusLines, setStrategicFocusLines] = useState(
    (initialData.strategicFocus || []).join("\n")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const payload: AccaTrajectoryFormData = {
        qualification: qualification.trim(),
        credentialBody: credentialBody.trim(),
        trajectoryType: trajectoryType.trim(),
        statusLabel: statusLabel.trim(),
        integrityNotice: integrityNotice.trim(),
        strategicFocus: strategicFocusLines
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      };

      const res = await updateAccaTrajectoryAction(payload);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "ACCA career trajectory updated successfully.",
        });
        setTimeout(() => {
          router.push("/admin/academic-journey");
          router.refresh();
        }, 800);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update ACCA trajectory.",
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <AdminPageHeader
        title="Edit ACCA Career Trajectory"
        description="Configure professional qualification roadmap, paper targets, and ethical non-membership disclaimers."
        breadcrumbs={[
          { label: "Academic Journey", href: "/admin/academic-journey" },
          { label: "ACCA Trajectory" },
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
              form="acca-form"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiSave size={13} />
              <span>{isPending ? "Saving..." : "Save ACCA Roadmap"}</span>
            </button>
          </div>
        }
      />

      {/* Ethical Guardrail Alert */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-start gap-3">
        <FiAlertTriangle
          size={18}
          className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5"
        />
        <div className="space-y-1">
          <p className="font-semibold font-sans">Strict Ethical Guardrail (VAL-03)</p>
          <p className="text-[11px] leading-relaxed opacity-90">
            ACCA must remain designated strictly as a future target credential in
            planning. The server action enforces a guardrail blocking any claim of
            completed membership without certified credentials.
          </p>
        </div>
      </div>

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
      <form id="acca-form" onSubmit={handleSubmit} className="space-y-6">
        <FormCard
          title="Credential Body & Qualification Title"
          description="Official awarding organization and target designation."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Target Qualification
              </label>
              <input
                type="text"
                required
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Credential Body
              </label>
              <input
                type="text"
                required
                value={credentialBody}
                onChange={(e) => setCredentialBody(e.target.value)}
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Trajectory Designation Type
              </label>
              <input
                type="text"
                required
                value={trajectoryType}
                onChange={(e) => setTrajectoryType(e.target.value)}
                placeholder="Career Pathway in Planning"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
                Public Status Label
              </label>
              <input
                type="text"
                required
                value={statusLabel}
                onChange={(e) => setStatusLabel(e.target.value)}
                placeholder="Target Professional Credential (In Planning)"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
              />
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Ethical Integrity Notice & Strategic Paper Matrix"
          description="Transparent disclaimer and targeted professional exams."
        >
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Ethical Disclosure Statement (Rendered Publicly)
            </label>
            <textarea
              rows={3}
              required
              value={integrityNotice}
              onChange={(e) => setIntegrityNotice(e.target.value)}
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5 font-sans">
              Planned Strategic Focus Areas & Targeted Papers (One per line)
            </label>
            <textarea
              rows={5}
              required
              value={strategicFocusLines}
              onChange={(e) => setStrategicFocusLines(e.target.value)}
              placeholder="Strategic Business Leader (SBL)&#10;Strategic Business Reporting (SBR)&#10;Advanced Financial Management (AFM)"
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3.5 text-xs text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono leading-relaxed transition-all"
            />
          </div>
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
              <span>{isPending ? "Saving..." : "Save ACCA Roadmap"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

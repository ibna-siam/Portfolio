"use client";

import React, { useState, useTransition } from "react";
import {
  FiBookOpen,
  FiEdit3,
  FiShield,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import {
  updateMilestoneAction,
  updateAccaTrajectoryAction,
  MilestoneFormData,
  AccaTrajectoryFormData,
} from "./actions";
import { Modal } from "@/components/admin/modal";

export interface MilestoneItem {
  id: string;
  institution: string;
  campus: string;
  degree: string;
  major: string;
  status: string;
  period: string;
  overview: string;
  disciplines: string[];
  sortOrder: number;
}

interface JourneyClientProps {
  initialMilestones: MilestoneItem[];
  initialAcca: AccaTrajectoryFormData;
}

export function JourneyClient({ initialMilestones, initialAcca }: JourneyClientProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(initialMilestones);
  const [acca, setAcca] = useState<AccaTrajectoryFormData>(initialAcca);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Milestone edit state
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);
  const [disciplinesText, setDisciplinesText] = useState("");

  // ACCA edit state
  const [isEditingAcca, setIsEditingAcca] = useState(false);
  const [accaForm, setAccaForm] = useState<AccaTrajectoryFormData>(initialAcca);
  const [strategicFocusText, setStrategicFocusText] = useState(
    (initialAcca.strategicFocus || []).join("\n")
  );

  const handleOpenMilestoneEdit = (m: MilestoneItem) => {
    setEditingMilestone(m);
    setDisciplinesText((m.disciplines || []).join(", "));
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    startTransition(async () => {
      const payload: MilestoneFormData = {
        id: editingMilestone.id,
        degree: editingMilestone.degree,
        institution: editingMilestone.institution,
        campus: editingMilestone.campus,
        major: editingMilestone.major,
        status: editingMilestone.status,
        period: editingMilestone.period,
        overview: editingMilestone.overview,
        disciplines: disciplinesText
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        sortOrder: editingMilestone.sortOrder,
      };

      const res = await updateMilestoneAction(payload);
      if (res.success) {
        setFeedback({ type: "success", message: res.message || "Milestone updated." });
        setMilestones((prev) =>
          prev.map((m) => (m.id === payload.id ? { ...m, ...payload } : m))
        );
        setEditingMilestone(null);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update milestone.",
        });
      }
    });
  };

  const handleSaveAcca = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const payload: AccaTrajectoryFormData = {
        ...accaForm,
        strategicFocus: strategicFocusText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      };

      const res = await updateAccaTrajectoryAction(payload);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "ACCA trajectory updated.",
        });
        setAcca(payload);
        setIsEditingAcca(false);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update ACCA trajectory.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
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
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="underline text-xs ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ACCA Trajectory Section (Prominent Strategic Card) */}
      <section className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-clay-card-dark relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block font-semibold">
                Target Professional Credential
              </span>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">
                {acca.qualification} ({acca.credentialBody})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              {acca.statusLabel}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsEditingAcca(true);
                setAccaForm(acca);
                setStrategicFocusText((acca.strategicFocus || []).join("\n"));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-ink-800 dark:text-ink-200 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 border border-ink-200 dark:border-ink-700 transition-all cursor-pointer"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              <span>Edit Roadmap</span>
            </button>
          </div>
        </div>

        {/* Guardrail Notice Banner */}
        <div className="bg-ink-50 dark:bg-ink-950/80 border border-ink-200 dark:border-ink-800 rounded-xl p-4 text-xs font-mono space-y-1 text-ink-700 dark:text-ink-300 mb-6">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
            <FiShield className="w-4 h-4" />
            <span>ACCURACY & ETHICAL COMPLIANCE GUARDRAIL (VAL-03)</span>
          </div>
          <p className="text-[11px] text-ink-600 dark:text-ink-400 leading-relaxed font-sans">
            {acca.integrityNotice}
          </p>
        </div>

        {/* Strategic Focus Grid */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold text-ink-700 dark:text-ink-200 uppercase tracking-wider">
            Planned Strategic Focus Areas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(acca.strategicFocus || []).map((focus, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950/60 border border-ink-200 dark:border-ink-800/80 text-xs font-sans text-ink-800 dark:text-ink-200 flex items-start gap-2.5"
              >
                <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{focus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Academic Milestones (Timeline) */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 flex items-center gap-2">
          <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Verified Educational Milestones ({milestones.length})</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm dark:shadow-clay-card-dark rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {m.period}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-ink-100 dark:bg-ink-950 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-800">
                      {m.status}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-50">
                    {m.degree}
                  </h3>
                  <p className="text-xs font-mono text-ink-600 dark:text-ink-400">
                    {m.institution} · {m.campus} · Major: {m.major}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenMilestoneEdit(m)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-ink-800 dark:text-ink-200 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 border border-ink-200 dark:border-ink-700 self-start sm:self-auto cursor-pointer transition-colors"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                  <span>Edit Milestone</span>
                </button>
              </div>

              <p className="text-xs text-ink-600 dark:text-ink-300 font-sans leading-relaxed">
                {m.overview}
              </p>

              {m.disciplines && m.disciplines.length > 0 && (
                <div className="pt-3 border-t border-ink-100 dark:border-ink-800/80 flex flex-wrap gap-1.5">
                  {m.disciplines.map((d, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-ink-100 dark:bg-ink-950 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-800"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Edit Milestone Modal */}
      <Modal
        isOpen={!!editingMilestone}
        onClose={() => setEditingMilestone(null)}
        title={
          editingMilestone
            ? `Edit Milestone: ${editingMilestone.degree}`
            : "Edit Milestone"
        }
        description="Configure institution, degree classification, duration, and key disciplines."
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setEditingMilestone(null)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="milestone-form"
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending ? "Saving..." : "Save Milestone"}
            </button>
          </div>
        }
      >
        {editingMilestone && (
          <form
            id="milestone-form"
            onSubmit={handleSaveMilestone}
            className="space-y-4 text-xs font-mono"
          >
            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Degree / Certificate Name
              </label>
              <input
                type="text"
                required
                value={editingMilestone.degree}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, degree: e.target.value })
                }
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                  Institution
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.institution}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      institution: e.target.value,
                    })
                  }
                  className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                  Campus / City
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.campus}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, campus: e.target.value })
                  }
                  className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                  Major / Discipline
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.major}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, major: e.target.value })
                  }
                  className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                  Time Period
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.period}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, period: e.target.value })
                  }
                  className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Status Label
              </label>
              <input
                type="text"
                required
                value={editingMilestone.status}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, status: e.target.value })
                }
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Academic Overview
              </label>
              <textarea
                rows={3}
                value={editingMilestone.overview}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, overview: e.target.value })
                }
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3 text-ink-900 dark:text-ink-100 font-sans focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Key Disciplines (comma separated)
              </label>
              <input
                type="text"
                value={disciplinesText}
                onChange={(e) => setDisciplinesText(e.target.value)}
                placeholder="Financial Accounting, Cost Accounting, Auditing"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Edit ACCA Roadmap Modal */}
      <Modal
        isOpen={isEditingAcca}
        onClose={() => setIsEditingAcca(false)}
        title="Edit ACCA Career Trajectory"
        description="Maintain strictly verified target designations and ethical disclaimer boundaries (VAL-11)."
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsEditingAcca(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="acca-form"
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending ? "Saving..." : "Save ACCA Roadmap"}
            </button>
          </div>
        }
      >
        <form
          id="acca-form"
          onSubmit={handleSaveAcca}
          className="space-y-4 text-xs font-mono"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Qualification
              </label>
              <input
                type="text"
                required
                value={accaForm.qualification}
                onChange={(e) =>
                  setAccaForm({ ...accaForm, qualification: e.target.value })
                }
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Credential Body
              </label>
              <input
                type="text"
                required
                value={accaForm.credentialBody}
                onChange={(e) =>
                  setAccaForm({ ...accaForm, credentialBody: e.target.value })
                }
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
              Status Label
            </label>
            <input
              type="text"
              required
              value={accaForm.statusLabel}
              onChange={(e) => setAccaForm({ ...accaForm, statusLabel: e.target.value })}
              placeholder="Target Professional Credential (In Planning)"
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
              Ethical Integrity Notice
            </label>
            <textarea
              rows={2}
              value={accaForm.integrityNotice}
              onChange={(e) =>
                setAccaForm({ ...accaForm, integrityNotice: e.target.value })
              }
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3 text-ink-900 dark:text-ink-100 font-sans focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
              Strategic Focus Areas (one per line)
            </label>
            <textarea
              rows={4}
              value={strategicFocusText}
              onChange={(e) => setStrategicFocusText(e.target.value)}
              className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3 text-ink-900 dark:text-ink-100 font-sans focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

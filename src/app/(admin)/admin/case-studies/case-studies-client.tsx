"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  FiBookOpen,
  FiPlus,
  FiSearch,
  FiEdit3,
  FiEye,
  FiTrash2,
  FiAlertTriangle,
  FiCalendar,
  FiTable,
} from "react-icons/fi";
import { togglePublishCaseStudyAction, deleteCaseStudyAction } from "./actions";

export interface CaseStudyListItem {
  id: string;
  sourceId: number;
  slug: string;
  title: string;
  category: string;
  groupShort: string;
  status: string;
  hasDiscrepancy: boolean;
  discrepancyHeadline?: string;
  scheduleCount: number;
  updatedAt: Date;
}

interface CaseStudiesClientProps {
  initialStudies: CaseStudyListItem[];
}

export function CaseStudiesClient({ initialStudies }: CaseStudiesClientProps) {
  const [studies, setStudies] = useState<CaseStudyListItem[]>(initialStudies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [studyToDelete, setStudyToDelete] = useState<CaseStudyListItem | null>(null);

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(search.toLowerCase()) ||
      study.category.toLowerCase().includes(search.toLowerCase()) ||
      study.slug.toLowerCase().includes(search.toLowerCase()) ||
      study.groupShort.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : study.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = (study: CaseStudyListItem) => {
    const newStatus = study.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const res = await togglePublishCaseStudyAction(study.id, newStatus);
      if (res.success) {
        setStudies((prev) =>
          prev.map((s) => (s.id === study.id ? { ...s, status: newStatus } : s))
        );
        setFeedback({ type: "success", message: res.message || "Status updated." });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update status." });
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!studyToDelete) return;
    const target = studyToDelete;
    startTransition(async () => {
      const res = await deleteCaseStudyAction(target.id);
      if (res.success) {
        setStudies((prev) => prev.filter((s) => s.id !== target.id));
        setFeedback({ type: "success", message: res.message || "Case study deleted." });
        setStudyToDelete(null);
      } else {
        setFeedback({ type: "error", message: res.error || "Cannot delete case study." });
        setStudyToDelete(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-ink-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-clay-inset-dark mb-2">
            <FiBookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accounting & Macroeconomic Research · {studies.length} Studies</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-50 tracking-tight">
            Academic Case Studies
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Manage research papers, financial schedules, CVP models, and mandatory integrity disclosures.
          </p>
        </div>

        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-ink-950 bg-emerald-400 hover:bg-emerald-300 shadow-clay-card-dark active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <FiPlus className="w-4 h-4 stroke-[2.5]" />
          <span>New Case Study</span>
        </Link>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-clay-inset-dark"
              : "bg-red-500/10 border-red-500/30 text-red-300 shadow-clay-inset-dark"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-ink-400 hover:text-ink-100 font-mono text-xs underline ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search studies by title, slug, or category..."
            className="w-full bg-ink-900 border border-ink-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-100 placeholder:text-ink-500 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-ink-900 border border-ink-800 p-1 rounded-xl shadow-clay-inset-dark">
          {(["all", "published", "draft"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-ink-800 text-emerald-400 shadow-clay-card-dark font-semibold"
                  : "text-ink-400 hover:text-ink-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      {filteredStudies.length === 0 ? (
        <div className="py-20 text-center bg-ink-900/60 border border-ink-800 rounded-2xl p-8 shadow-clay-card-dark">
          <FiBookOpen className="w-12 h-12 mx-auto mb-3 text-ink-600 opacity-40" />
          <p className="text-base font-semibold text-ink-200">No case studies match your query</p>
          <p className="text-xs text-ink-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new research case study.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-5 hover:border-ink-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Study Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-ink-950 text-ink-300 border border-ink-800">
                    ID #{study.sourceId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-ink-800 text-emerald-400 border border-ink-700/60">
                    {study.groupShort}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                      study.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {study.status.toUpperCase()}
                  </span>

                  {study.hasDiscrepancy && (
                    <span
                      title={study.discrepancyHeadline || "Mandatory Disclosure Active"}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    >
                      <FiAlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>DISCLOSURE REQUIRED</span>
                    </span>
                  )}
                </div>

                <h2 className="text-base font-display font-bold text-ink-50 hover:text-emerald-400 transition-colors">
                  <Link href={`/admin/case-studies/${study.id}/edit`}>
                    {study.title}
                  </Link>
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-400">
                  <span className="text-ink-300 font-medium">{study.category}</span>
                  <span className="text-ink-600">/</span>
                  <span className="text-ink-500">/{study.slug}</span>
                  <span className="text-ink-600">/</span>
                  <span className="inline-flex items-center gap-1 text-ink-400">
                    <FiTable className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="tabular-nums font-semibold">{study.scheduleCount}</span> schedules
                  </span>
                  <span className="text-ink-600">/</span>
                  <span className="inline-flex items-center gap-1 text-ink-500">
                    <FiCalendar className="w-3 h-3" />
                    <span>
                      {new Date(study.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-ink-800">
                {/* Preview Button */}
                <Link
                  href={`/admin/case-studies/${study.id}/preview`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-ink-300 hover:text-white bg-ink-950/70 hover:bg-ink-800 border border-ink-800 shadow-clay-inset-dark active:translate-y-0.5 transition-all"
                  title="Preview draft audit paper"
                >
                  <FiEye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview</span>
                </Link>

                {/* Edit Button */}
                <Link
                  href={`/admin/case-studies/${study.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-ink-100 hover:text-emerald-300 bg-ink-800 hover:bg-ink-700/80 border border-ink-700 shadow-clay-card-dark active:translate-y-0.5 transition-all"
                  title="Edit case study"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                {/* Quick Toggle Status */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(study)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                    study.status === "published"
                      ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30"
                      : "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30"
                  }`}
                  title={study.status === "published" ? "Unpublish to draft" : "Publish live"}
                >
                  <span>{study.status === "published" ? "Unpublish" : "Publish"}</span>
                </button>

                {/* Safe Deletion Button */}
                <button
                  type="button"
                  onClick={() => setStudyToDelete(study)}
                  className="p-2 rounded-xl text-ink-500 hover:text-red-400 bg-ink-950/40 hover:bg-red-500/10 border border-ink-800/80 hover:border-red-500/30 transition-all cursor-pointer"
                  title="Delete case study"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deletion Safeguard Modal */}
      {studyToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <FiTrash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-ink-50 text-base">
                  Delete Academic Case Study
                </h3>
                <p className="text-xs text-ink-400">
                  Confirm permanent removal from the relational database
                </p>
              </div>
            </div>

            <div className="bg-ink-950 border border-ink-800 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="text-ink-200 font-semibold">{studyToDelete.title}</div>
              <div className="text-ink-400">Slug: /{studyToDelete.slug}</div>
              <div className="text-ink-400">Schedules: {studyToDelete.scheduleCount}</div>
            </div>

            {studyToDelete.hasDiscrepancy && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
                <FiAlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Financial Integrity Warning: </span>
                  This case study is bound to a mandatory academic disclosure record. The deletion guardrail will block deletion to preserve historical financial integrity.
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudyToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-ink-300 bg-ink-800 hover:bg-ink-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-red-600 hover:bg-red-500 transition-colors shadow-clay-card-dark cursor-pointer disabled:opacity-50"
              >
                {isPending ? "Verifying..." : "Confirm Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

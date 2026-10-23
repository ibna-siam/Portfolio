"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiEdit3,
  FiEye,
  FiTrash2,
  FiAlertTriangle,
  FiTable,
  FiPlus,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import { togglePublishCaseStudyAction, deleteCaseStudyAction } from "./actions";
import { DeleteConfirmationModal } from "@/components/admin/forms/delete-confirmation-modal";

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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "discrepancy"
  >("all");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [studyToDelete, setStudyToDelete] = useState<CaseStudyListItem | null>(null);

  const filteredStudies = studies.filter((study) => {
    const q = search.toLowerCase();
    const matchesSearch =
      study.title.toLowerCase().includes(q) ||
      study.category.toLowerCase().includes(q) ||
      study.slug.toLowerCase().includes(q) ||
      study.groupShort.toLowerCase().includes(q);

    let matchesFilter = true;
    if (statusFilter === "published") matchesFilter = study.status === "published";
    else if (statusFilter === "draft") matchesFilter = study.status === "draft";
    else if (statusFilter === "discrepancy") matchesFilter = study.hasDiscrepancy;

    return matchesSearch && matchesFilter;
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

  const formatDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Feedback Banner */}
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
            {feedback.type === "success" ? (
              <FiCheckCircle size={15} className="shrink-0" />
            ) : (
              <FiAlertTriangle size={15} className="shrink-0" />
            )}
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

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            size={14}
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search studies by title, category, or slug..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl text-xs text-ink-900 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
          />
        </div>

        {/* New Case Study Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-ink-950 dark:hover:bg-emerald-300 text-xs font-mono font-medium rounded-xl shadow-xs transition-colors"
          >
            <FiPlus size={14} aria-hidden="true" />
            <span>New Case Study</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
            statusFilter === "all"
              ? "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900 font-medium"
              : "bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
          }`}
        >
          All Studies ({studies.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("published")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
            statusFilter === "published"
              ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-ink-950 font-medium"
              : "bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
          }`}
        >
          Published ({studies.filter((s) => s.status === "published").length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("draft")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
            statusFilter === "draft"
              ? "bg-amber-600 text-white dark:bg-amber-400 dark:text-ink-950 font-medium"
              : "bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
          }`}
        >
          Drafts ({studies.filter((s) => s.status === "draft").length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("discrepancy")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
            statusFilter === "discrepancy"
              ? "bg-amber-500 text-white dark:bg-amber-400 dark:text-ink-950 font-medium"
              : "bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
          }`}
        >
          With Discrepancy ({studies.filter((s) => s.hasDiscrepancy).length})
        </button>
      </div>

      {/* High-Density Case Studies Management Table */}
      <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-200 dark:border-ink-800 bg-slate-50/75 dark:bg-ink-950/60 font-mono text-[11px] text-ink-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[260px]">Title & Slug</th>
                <th className="py-3 px-4 min-w-[150px]">Discipline</th>
                <th className="py-3 px-4 w-28 text-center">Schedules</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-32">Updated</th>
                <th className="py-3 px-4 w-36 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-sans">
              {filteredStudies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-500 font-mono">
                    No academic case studies found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudies.map((study) => (
                  <tr
                    key={study.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-ink-800/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono text-ink-400 font-semibold">
                      {study.sourceId}
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink-900 dark:text-ink-100 font-sans leading-tight">
                        <Link
                          href={`/admin/case-studies/${study.id}/edit`}
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {study.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-ink-400 dark:text-ink-500 font-mono truncate max-w-xs">
                          /{study.slug}
                        </span>
                        {study.hasDiscrepancy && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                            title={
                              study.discrepancyHeadline ||
                              "Active arithmetic discrepancy notice attached"
                            }
                          >
                            <FiAlertTriangle size={10} />
                            <span>Notice</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Discipline & Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700/60">
                        {study.groupShort}
                      </span>
                      <div className="text-[11px] text-ink-500 dark:text-ink-400 font-mono mt-0.5 truncate max-w-[180px]">
                        {study.category}
                      </div>
                    </td>

                    {/* Financial Schedules Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-ink-600 dark:text-ink-400">
                        <FiTable
                          size={12}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                        <span>{study.scheduleCount}</span>
                      </span>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(study)}
                        disabled={isPending}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold tracking-wide transition-opacity cursor-pointer ${
                          study.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:opacity-80"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:opacity-80"
                        }`}
                        title="Click to toggle publication status"
                      >
                        {study.status}
                      </button>
                    </td>

                    {/* Updated Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-ink-500">
                      {formatDate(study.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        {/* Admin Preview */}
                        <Link
                          href={`/admin/case-studies/${study.id}/preview`}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                          aria-label={`Preview ${study.title}`}
                          title="Admin Draft Preview"
                        >
                          <FiEye size={14} />
                        </Link>

                        {/* Public Link if Published */}
                        {study.status === "published" && (
                          <Link
                            href={`/case-studies/${study.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-ink-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                            aria-label={`View live public page for ${study.title}`}
                            title="View Public Page"
                          >
                            <FiExternalLink size={14} />
                          </Link>
                        )}

                        {/* Edit Link */}
                        <Link
                          href={`/admin/case-studies/${study.id}/edit`}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                          aria-label={`Edit ${study.title}`}
                          title="Edit Case Study"
                        >
                          <FiEdit3 size={14} />
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setStudyToDelete(study)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          aria-label={`Delete ${study.title}`}
                          title="Delete Case Study"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(studyToDelete)}
        onClose={() => setStudyToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Case Study"
        itemName={studyToDelete?.title || ""}
        itemType="Case Study"
        isPending={isPending}
      />
    </div>
  );
}

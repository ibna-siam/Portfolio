"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiCheckCircle,
} from "react-icons/fi";
import { upsertCompetencyAction, deleteCompetencyAction } from "./actions";
import { DeleteConfirmationModal } from "@/components/admin/forms/delete-confirmation-modal";

export interface CompetencyItem {
  id: string;
  name: string;
  domain: string;
  category: string;
  evidenceLabel: string;
  description: string;
  frameworkTags: string[];
  relatedProject: string;
  sortOrder: number;
  status: string;
}

interface CompetenciesClientProps {
  initialCompetencies: CompetencyItem[];
}

export function CompetenciesClient({ initialCompetencies }: CompetenciesClientProps) {
  const [competencies, setCompetencies] = useState<CompetencyItem[]>(initialCompetencies);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<CompetencyItem | null>(null);

  const domains = [
    "Financial Accounting",
    "Managerial Accounting",
    "Taxation & Audit",
    "Software & Tech",
  ];

  const filtered = competencies
    .filter((c) => {
      const matchesDomain = selectedDomain === "all" || c.domain === selectedDomain;
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.relatedProject.toLowerCase().includes(search.toLowerCase());
      return matchesDomain && matchesSearch;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Quick reorder handler (Move Up or Down)
  const handleReorder = (item: CompetencyItem, direction: "up" | "down") => {
    const currentDomainItems = competencies
      .filter((c) => c.domain === item.domain)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const currentIndex = currentDomainItems.findIndex((c) => c.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentDomainItems.length) return;

    const targetItem = currentDomainItems[targetIndex];
    const newOrder = targetItem.sortOrder;
    const swapOrder = item.sortOrder;

    startTransition(async () => {
      // Optimistic update
      setCompetencies((prev) =>
        prev.map((c) => {
          if (c.id === item.id) return { ...c, sortOrder: newOrder };
          if (c.id === targetItem.id) return { ...c, sortOrder: swapOrder };
          return c;
        })
      );

      await Promise.all([
        upsertCompetencyAction({ ...item, sortOrder: newOrder }),
        upsertCompetencyAction({ ...targetItem, sortOrder: swapOrder }),
      ]);
    });
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    const target = deletingItem;

    startTransition(async () => {
      const res = await deleteCompetencyAction(target.id);
      if (res.success) {
        setCompetencies((prev) => prev.filter((c) => c.id !== target.id));
        setFeedback({ type: "success", message: res.message || "Competency deleted." });
        setDeletingItem(null);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to delete competency.",
        });
        setDeletingItem(null);
      }
    });
  };

  return (
    <div className="space-y-6">
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
            placeholder="Search competencies, methods, tags..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl text-xs text-ink-900 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
          />
        </div>

        {/* Action Link to Dedicated Create Page */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/competencies/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-ink-950 dark:hover:bg-emerald-300 text-xs font-mono font-medium rounded-xl shadow-xs transition-colors"
          >
            <FiPlus size={14} aria-hidden="true" />
            <span>New Competency</span>
          </Link>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedDomain("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
            selectedDomain === "all"
              ? "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900 font-medium"
              : "bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
          }`}
        >
          All Domains ({competencies.length})
        </button>
        {domains.map((dom) => {
          const count = competencies.filter((c) => c.domain === dom).length;
          return (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-ink-950 font-medium"
                  : "bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
              }`}
            >
              {dom} ({count})
            </button>
          );
        })}
      </div>

      {/* Compact Competencies Table */}
      <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-200 dark:border-ink-800 bg-slate-50/75 dark:bg-ink-950/60 font-mono text-[11px] text-ink-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-14 text-center">Order</th>
                <th className="py-3 px-4 min-w-[200px]">Competency Name</th>
                <th className="py-3 px-4 min-w-[150px]">Domain & Evidence</th>
                <th className="py-3 px-4 min-w-[220px]">Framework Tags</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ink-500 font-mono">
                    No competencies found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-ink-800/40 transition-colors group"
                  >
                    {/* Sort Order Controls */}
                    <td className="py-3 px-4 text-center font-mono text-ink-500">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-5 text-center text-xs font-bold text-ink-700 dark:text-ink-300">
                          {item.sortOrder + 1}
                        </span>
                        <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleReorder(item, "up")}
                            disabled={idx === 0 || isPending}
                            className="p-0.5 hover:text-emerald-600 disabled:opacity-20 cursor-pointer"
                            aria-label="Move Up"
                          >
                            <FiArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(item, "down")}
                            disabled={idx === filtered.length - 1 || isPending}
                            className="p-0.5 hover:text-emerald-600 disabled:opacity-20 cursor-pointer"
                            aria-label="Move Down"
                          >
                            <FiArrowDown size={11} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Competency Name & Coursework Anchor */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink-900 dark:text-ink-100 font-sans leading-tight">
                        <Link
                          href={`/admin/competencies/${item.id}/edit`}
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </div>
                      {item.relatedProject && (
                        <div className="text-[11px] text-ink-500 dark:text-ink-400 font-mono mt-0.5 truncate max-w-sm">
                          Anchor: {item.relatedProject}
                        </div>
                      )}
                    </td>

                    {/* Domain & Evidence */}
                    <td className="py-3 px-4">
                      <div className="text-xs text-ink-700 dark:text-ink-300 font-medium">
                        {item.domain}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                        {item.evidenceLabel}
                      </div>
                    </td>

                    {/* Framework Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(item.frameworkTags || []).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Publication Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold tracking-wide ${
                          item.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        <Link
                          href={`/admin/competencies/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                          aria-label={`Edit ${item.name}`}
                          title="Edit Competency"
                        >
                          <FiEdit3 size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          aria-label={`Delete ${item.name}`}
                          title="Delete Competency"
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

      {/* Delete Confirmation Modal (Focused Action Dialog Only) */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title="Delete Competency"
        itemName={deletingItem?.name || ""}
        itemType="Competency"
        isPending={isPending}
      />
    </div>
  );
}

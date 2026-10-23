"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiSearch,
  FiCheckCircle,
} from "react-icons/fi";
import { deleteTechSolutionAction } from "./actions";
import { DeleteConfirmationModal } from "@/components/admin/forms/delete-confirmation-modal";

export interface TechSolutionItem {
  id: string;
  title: string;
  category: string;
  status: string;
  statusTheme: string;
  problem: string;
  solution: string;
  userRole: string;
  techStack: string[];
  features: string[];
  verifiedRepo: string | null;
  verifiedDemo: string | null;
  linkText: string;
  sortOrder: number;
  contentStatus: string;
}

interface SolutionsClientProps {
  initialSolutions: TechSolutionItem[];
}

export function SolutionsClient({ initialSolutions }: SolutionsClientProps) {
  const [solutions, setSolutions] = useState<TechSolutionItem[]>(initialSolutions);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<TechSolutionItem | null>(null);

  const filtered = solutions.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.techStack || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleDelete = () => {
    if (!deletingItem) return;
    const target = deletingItem;

    startTransition(async () => {
      const res = await deleteTechSolutionAction(target.id);
      if (res.success) {
        setSolutions((prev) => prev.filter((s) => s.id !== target.id));
        setFeedback({
          type: "success",
          message: res.message || "Tech solution deleted.",
        });
        setDeletingItem(null);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to delete tech solution.",
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
            placeholder="Search systems, tech stack, categories..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl text-xs text-ink-900 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
          />
        </div>

        {/* Action Link to Dedicated Create Page */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/tech-solutions/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-ink-950 dark:hover:bg-emerald-300 text-xs font-mono font-medium rounded-xl shadow-xs transition-colors"
          >
            <FiPlus size={14} aria-hidden="true" />
            <span>New Tech Solution</span>
          </Link>
        </div>
      </div>

      {/* Compact Tech Solutions Table */}
      <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-200 dark:border-ink-800 bg-slate-50/75 dark:bg-ink-950/60 font-mono text-[11px] text-ink-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[220px]">System Name & Architecture</th>
                <th className="py-3 px-4 min-w-[150px]">Category & Role</th>
                <th className="py-3 px-4 min-w-[200px]">Tech Stack</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-32">Repository</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-500 font-mono">
                    No tech solutions found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-ink-800/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono text-ink-400 font-semibold">
                      {idx + 1}
                    </td>

                    {/* System Name & Identifier */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink-900 dark:text-ink-100 font-sans leading-tight">
                        <Link
                          href={`/admin/tech-solutions/${item.id}/edit`}
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="text-[11px] text-ink-400 dark:text-ink-500 font-mono mt-0.5">
                        id: {item.id}
                      </div>
                    </td>

                    {/* Category & Role */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-ink-700 dark:text-ink-300 font-medium">
                        {item.category}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                        {item.userRole}
                      </div>
                    </td>

                    {/* Tech Stack Pills */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(item.techStack || []).map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {item.status}
                      </span>
                    </td>

                    {/* Verified Repo */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {item.verifiedRepo ? (
                        <a
                          href={item.verifiedRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-ink-600 dark:text-ink-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          title={item.verifiedRepo}
                        >
                          <span>{item.linkText || "Source"}</span>
                          <FiExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-ink-400 italic">No repo</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        <Link
                          href={`/admin/tech-solutions/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                          aria-label={`Edit ${item.title}`}
                          title="Edit Tech Solution"
                        >
                          <FiEdit3 size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          aria-label={`Delete ${item.title}`}
                          title="Delete Tech Solution"
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
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title="Delete Tech Solution"
        itemName={deletingItem?.title || ""}
        itemType="Tech Solution"
        isPending={isPending}
      />
    </div>
  );
}

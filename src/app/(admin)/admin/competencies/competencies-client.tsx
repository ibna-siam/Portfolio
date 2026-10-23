"use client";

import React, { useState, useTransition } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";
import {
  upsertCompetencyAction,
  deleteCompetencyAction,
  CompetencyFormData,
} from "./actions";
import { Modal } from "@/components/admin/modal";

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

  // Edit / Add Modal state
  const [editingItem, setEditingItem] = useState<Partial<CompetencyItem> | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const domains = [
    "Financial Accounting",
    "Managerial Accounting",
    "Taxation & Audit",
    "Software & Tech",
  ];

  const filtered = competencies.filter((c) => {
    const matchesDomain = selectedDomain === "all" || c.domain === selectedDomain;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.relatedProject.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleOpenEdit = (item: CompetencyItem) => {
    setEditingItem(item);
    setTagsInput((item.frameworkTags || []).join(", "));
  };

  const handleOpenNew = () => {
    setEditingItem({
      domain: selectedDomain !== "all" ? selectedDomain : domains[0],
      category: selectedDomain !== "all" ? selectedDomain : domains[0],
      evidenceLabel: "Case Study & Coursework",
      frameworkTags: ["IFRS", "Excel"],
      relatedProject: "Academic Coursework",
      sortOrder: competencies.length,
      status: "published",
    });
    setTagsInput("IFRS, Excel");
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const current = editingItem;
    if (!current || !current.name?.trim()) return;
    const name = current.name.trim();

    startTransition(async () => {
      const payload: CompetencyFormData = {
        id: current.id,
        name,
        domain: current.domain || domains[0],
        category: current.category || current.domain || domains[0],
        evidenceLabel: current.evidenceLabel || "Case Study",
        description: current.description || "",
        frameworkTags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        relatedProject: current.relatedProject || "",
        sortOrder: current.sortOrder ?? 0,
        status: current.status || "published",
      };

      const res = await upsertCompetencyAction(payload);
      if (res.success) {
        setFeedback({ type: "success", message: res.message || "Competency saved." });
        setCompetencies((prev) => {
          if (current.id) {
            return prev.map((c) =>
              c.id === current.id ? ({ ...c, ...payload } as CompetencyItem) : c
            );
          } else {
            return [...prev, { ...payload, id: res.competencyId! } as CompetencyItem];
          }
        });
        setEditingItem(null);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to save competency.",
        });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete competency "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteCompetencyAction(id);
      if (res.success) {
        setCompetencies((prev) => prev.filter((c) => c.id !== id));
        setFeedback({ type: "success", message: res.message || "Competency deleted." });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to delete competency.",
        });
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
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="underline text-xs ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Domain Filters & Search */}
      <div className="flex flex-col gap-3">
        {/* Domain Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedDomain("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              selectedDomain === "all"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold shadow-xs"
                : "bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 border border-ink-200 dark:border-ink-800 shadow-xs"
            }`}
          >
            All Domains ({competencies.length})
          </button>
          {domains.map((domain) => {
            const count = competencies.filter((c) => c.domain === domain).length;
            const isSelected = selectedDomain === domain;
            return (
              <button
                key={domain}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold shadow-xs"
                    : "bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 border border-ink-200 dark:border-ink-800 shadow-xs"
                }`}
              >
                {domain} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative max-w-md w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 dark:text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search competencies by title, description, or project..."
              className="w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl pl-10 pr-4 py-2 text-xs text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-400 shadow-xs focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer shrink-0"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>New Competency</span>
          </button>
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm dark:shadow-clay-card-dark rounded-2xl p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  {item.evidenceLabel}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-100 bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-ink-300 dark:hover:border-ink-700 transition-colors cursor-pointer"
                    title="Edit competency"
                  >
                    <FiEdit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg text-ink-500 dark:text-ink-400 hover:text-red-600 dark:hover:text-red-400 bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-red-300 dark:hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Delete competency"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-ink-900 dark:text-ink-100 text-sm">
                  {item.name}
                </h3>
                <p className="text-xs text-ink-600 dark:text-ink-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.frameworkTags && item.frameworkTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.frameworkTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-ink-100 dark:bg-ink-950 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-ink-100 dark:border-ink-800 text-[11px] font-mono text-ink-600 dark:text-ink-400 flex items-center justify-between">
              <span>Anchor: {item.relatedProject}</span>
              <span>Order: {item.sortOrder}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={editingItem?.id ? "Edit Competency" : "Add New Competency"}
        description="Configure competency name, domain category, evidence tags, and coursework anchor."
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="competency-form"
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending ? "Saving..." : "Save Competency"}
            </button>
          </div>
        }
      >
        {editingItem && (
          <form
            id="competency-form"
            onSubmit={handleSaveModal}
            className="space-y-4 text-xs font-mono"
          >
            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Competency Name *
              </label>
              <input
                type="text"
                required
                value={editingItem.name || ""}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="e.g. Financial Statement Analysis & Ratio Modeling"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                  Domain
                </label>
                <select
                  value={editingItem.domain || domains[0]}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, domain: e.target.value })
                  }
                  className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors cursor-pointer"
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                  Evidence Label
                </label>
                <input
                  type="text"
                  value={editingItem.evidenceLabel || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, evidenceLabel: e.target.value })
                  }
                  placeholder="Case Study / Coursework"
                  className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Description
              </label>
              <textarea
                rows={3}
                value={editingItem.description || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, description: e.target.value })
                }
                placeholder="Core accounting discipline and methodological mastery..."
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-3 text-ink-900 dark:text-ink-100 font-sans focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Framework Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="IFRS, IAS 1, Financial Ratios"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-ink-700 dark:text-ink-300 mb-1 font-sans">
                Related Coursework Anchor
              </label>
              <input
                type="text"
                value={editingItem.relatedProject || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, relatedProject: e.target.value })
                }
                placeholder="Square Pharmaceuticals Annual Report Analysis"
                className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl px-3.5 py-2 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

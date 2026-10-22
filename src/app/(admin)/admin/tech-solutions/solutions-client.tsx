"use client";

import React, { useState, useTransition } from "react";
import {
  FiCpu,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import {
  upsertTechSolutionAction,
  deleteTechSolutionAction,
  TechSolutionFormData,
} from "./actions";

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
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Edit/New modal state
  const [editingItem, setEditingItem] = useState<Partial<TechSolutionItem> | null>(null);
  const [techStackText, setTechStackText] = useState("");
  const [featuresText, setFeaturesText] = useState("");

  const handleOpenEdit = (item: TechSolutionItem) => {
    setEditingItem(item);
    setTechStackText((item.techStack || []).join(", "));
    setFeaturesText((item.features || []).join("\n"));
  };

  const handleOpenNew = () => {
    setEditingItem({
      id: "new-system",
      title: "",
      category: "Financial Software & Engineering",
      status: "Production Ready",
      statusTheme: "emerald",
      userRole: "Lead Architect",
      linkText: "View Source",
      sortOrder: solutions.length,
      contentStatus: "published",
    });
    setTechStackText("TypeScript, Next.js, PostgreSQL");
    setFeaturesText("Real-time financial computation\nData persistence layer");
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.id?.trim() || !editingItem?.title?.trim()) return;

    startTransition(async () => {
      const payload: TechSolutionFormData = {
        id: editingItem.id!.trim(),
        title: editingItem.title!.trim(),
        category: editingItem.category || "Financial Software",
        status: editingItem.status || "Verified",
        statusTheme: editingItem.statusTheme || "emerald",
        problem: editingItem.problem || "",
        solution: editingItem.solution || "",
        userRole: editingItem.userRole || "Lead Architect",
        techStack: techStackText.split(",").map((s) => s.trim()).filter(Boolean),
        features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
        verifiedRepo: editingItem.verifiedRepo || null,
        verifiedDemo: editingItem.verifiedDemo || null,
        linkText: editingItem.linkText || "View Repository",
        sortOrder: editingItem.sortOrder ?? 0,
        contentStatus: editingItem.contentStatus || "published",
      };

      const res = await upsertTechSolutionAction(payload);
      if (res.success) {
        setFeedback({ type: "success", message: res.message || "Solution saved." });
        setSolutions((prev) => {
          const exists = prev.some((s) => s.id === payload.id);
          if (exists) {
            return prev.map((s) => (s.id === payload.id ? ({ ...s, ...payload } as TechSolutionItem) : s));
          } else {
            return [...prev, payload as TechSolutionItem];
          }
        });
        setEditingItem(null);
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save solution." });
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    startTransition(async () => {
      const res = await deleteTechSolutionAction(id);
      if (res.success) {
        setSolutions((prev) => prev.filter((s) => s.id !== id));
        setFeedback({ type: "success", message: res.message || "Solution deleted." });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to delete solution." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-ink-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-clay-inset-dark mb-2">
            <FiCpu className="w-3.5 h-3.5" />
            <span>3 Business & Technology Problem Solving Systems (~25% Weight)</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-50 tracking-tight">
            Technology Solutions
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Manage financial-technology software architectures, features, and verified repositories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-ink-950 bg-emerald-400 hover:bg-emerald-300 shadow-clay-card-dark active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <FiPlus className="w-4 h-4 stroke-[2.5]" />
          <span>New Tech Solution</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="underline text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Solutions Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {solutions.map((item) => (
          <div
            key={item.id}
            className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-6 hover:border-ink-700 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-ink-950 text-ink-400 border border-ink-800">
                    {item.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-ink-950 text-ink-300 border border-ink-800">
                    Role: {item.userRole}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-ink-50">{item.title}</h3>
                <p className="text-xs font-mono text-ink-500">ID: {item.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-ink-200 bg-ink-800 hover:bg-ink-700 border border-ink-700 shadow-clay-card-dark transition-all cursor-pointer"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-xl text-ink-500 hover:text-red-400 bg-ink-950 border border-ink-800 hover:border-red-500/30 transition-colors cursor-pointer"
                  title="Delete solution"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-ink-950/60 p-4 rounded-xl border border-ink-800/80 space-y-1">
                <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Problem Addressed
                </span>
                <p className="text-ink-300 leading-relaxed">{item.problem}</p>
              </div>

              <div className="bg-ink-950/60 p-4 rounded-xl border border-ink-800/80 space-y-1">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Engineered Solution
                </span>
                <p className="text-ink-300 leading-relaxed">{item.solution}</p>
              </div>
            </div>

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono text-ink-400 font-semibold block">
                  Core Architectural Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-ink-300">
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack & Links */}
            <div className="pt-3 border-t border-ink-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap gap-1.5">
                {(item.techStack || []).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] bg-ink-950 text-ink-300 border border-ink-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {item.verifiedRepo && (
                  <a
                    href={item.verifiedRepo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <span>{item.linkText || "Repository"}</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                )}
                {item.verifiedDemo && (
                  <a
                    href={item.verifiedDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-ink-300 hover:text-emerald-400 hover:underline"
                  >
                    <span>Live Demonstration</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink-800">
              <h3 className="font-display font-bold text-ink-50 text-base">
                {editingItem.id ? `Edit Solution: ${editingItem.title}` : "New Tech Solution"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-ink-400 hover:text-ink-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-300 mb-1 font-sans">System ID (Slug) *</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingItem.id && solutions.some((s) => s.id === editingItem.id))}
                    value={editingItem.id || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                    placeholder="financial-portfolio-engine"
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 mb-1 font-sans">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Financial Statement Ratio Engine"
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-300 mb-1 font-sans">Category</label>
                  <input
                    type="text"
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Financial Engineering"
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 mb-1 font-sans">User Role</label>
                  <input
                    type="text"
                    value={editingItem.userRole || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, userRole: e.target.value })}
                    placeholder="Lead Architect & Systems Designer"
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans">Problem Statement</label>
                <textarea
                  rows={2}
                  value={editingItem.problem || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, problem: e.target.value })}
                  placeholder="Manual spreadsheet models lead to discrepancy risks..."
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-ink-100 font-sans shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans">Engineered Solution</label>
                <textarea
                  rows={2}
                  value={editingItem.solution || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, solution: e.target.value })}
                  placeholder="Automated calculation engine with tabular verification..."
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-ink-100 font-sans shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={techStackText}
                  onChange={(e) => setTechStackText(e.target.value)}
                  placeholder="React 19, TypeScript, PostgreSQL, Drizzle ORM"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans">
                  Key Capabilities (one per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Real-time ratio computation&#10;Audit trail logging"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-ink-100 font-sans shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-300 mb-1 font-sans">Verified Repository URL</label>
                  <input
                    type="url"
                    value={editingItem.verifiedRepo || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, verifiedRepo: e.target.value })}
                    placeholder="https://github.com/ibna-siam/..."
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 mb-1 font-sans">Link Display Text</label>
                  <input
                    type="text"
                    value={editingItem.linkText || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, linkText: e.target.value })}
                    placeholder="View Repository"
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs text-ink-400 hover:text-ink-200 bg-ink-950 border border-ink-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-950 bg-emerald-400 hover:bg-emerald-300 shadow-clay-card-dark disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Solution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiBookOpen,
  FiSave,
  FiEye,
  FiArrowLeft,
  FiAlertTriangle,
  FiPlus,
  FiTrash2,
  FiTable,
  FiImage,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import { MediaPickerModal, MediaPickerAsset } from "@/components/admin/media-picker-modal";
import {
  upsertCaseStudyAction,
  CaseStudyFormData,
  ScheduleInput,
} from "@/app/(admin)/admin/case-studies/actions";

interface DiscrepancyInfo {
  headline: string;
  summary: string;
  details: string[];
  originalValues: string;
  formulaTested: string;
  statusText: string;
  preservationPolicy: string;
}

interface RevisionInfo {
  revisionNumber: number;
  changeSummary: string | null;
  createdAt: Date;
}

interface CaseStudyEditorProps {
  initialData?: Partial<CaseStudyFormData> & { id?: string };
  initialSchedules?: ScheduleInput[];
  discrepancy?: DiscrepancyInfo | null;
  revisions?: RevisionInfo[];
  availableMediaAssets?: MediaPickerAsset[];
}

export function CaseStudyEditor({
  initialData,
  initialSchedules = [],
  discrepancy,
  revisions = [],
  availableMediaAssets = [],
}: CaseStudyEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CaseStudyFormData>({
    id: initialData?.id,
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    category: initialData?.category || "Accounting & Financial Management",
    group: initialData?.group || "Applied Accounting Case Study",
    groupId: initialData?.groupId || "accounting",
    groupShort: initialData?.groupShort || "Accounting",
    academicScope: initialData?.academicScope || "Financial Analysis & Managerial Costing",
    framework: initialData?.framework || "IFRS / Bangladesh Income Tax Act 2023",
    evidenceType: initialData?.evidenceType || "Coursework & Empirical Case Data",
    currencyUnit: initialData?.currencyUnit || "BDT (Bangladeshi Taka)",
    inputsClassification: initialData?.inputsClassification || "Verified Coursework Model",
    calculationBasis: initialData?.calculationBasis || "Standard CVP & Financial Statement Ratios",
    integrityStatusKey: initialData?.integrityStatusKey || "STANDARD",
    secondaryStatusKey: initialData?.secondaryStatusKey || "",
    description: initialData?.description || "",
    details: initialData?.details || [],
    tools: initialData?.tools || ["Microsoft Excel", "Financial Statement Analysis"],
    imageUrl: initialData?.imageUrl || "",
    outcome: initialData?.outcome || "",
    type: initialData?.type || "Academic Project",
    featured: initialData?.featured || false,
    overview: initialData?.overview || "",
    objectives: initialData?.objectives || [],
    methodology: initialData?.methodology || [],
    keyFindings: initialData?.keyFindings || [],
    conclusion: initialData?.conclusion || "",
    recommendations: initialData?.recommendations || [],
    auditNotes: initialData?.auditNotes || [],
    formulas: initialData?.formulas || [],
    status: (initialData?.status as "draft" | "published") || "draft",
    financialSchedules: initialSchedules,
  });

  // Dynamic Array Helper (for comma/newline separated lists)
  const [detailsText, setDetailsText] = useState((formData.details || []).join("\n"));
  const [toolsText, setToolsText] = useState((formData.tools || []).join(", "));
  const [objectivesText, setObjectivesText] = useState((formData.objectives || []).join("\n"));
  const [keyFindingsText, setKeyFindingsText] = useState((formData.keyFindings || []).join("\n"));
  const [recommendationsText, setRecommendationsText] = useState((formData.recommendations || []).join("\n"));

  // Schedules state
  const [schedules, setSchedules] = useState<ScheduleInput[]>(initialSchedules);

  // Sync title to slug automatically for new records
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      if (!initialData?.id && !prev.slug) {
        const autoSlug = val
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-|-$/g, "");
        return { ...prev, title: val, slug: autoSlug };
      }
      return { ...prev, title: val };
    });
  };

  // Schedule Manipulation Handlers
  const handleAddSchedule = () => {
    const newSchedule: ScheduleInput = {
      title: "New Financial Schedule",
      headers: ["Metric / Line Item", "FY 2023 (BDT)", "FY 2024 (BDT)", "Variance (%)"],
      rows: [
        ["Sample Revenue", "1,200,000", "1,450,000", "+20.8%"],
        ["Cost of Goods Sold", "(840,000)", "(980,000)", "+16.7%"],
        ["Gross Profit", "360,000", "470,000", "+30.5%"],
      ],
      notes: "Schedules utilize .tabular-nums formatting for numeric precision.",
      sortOrder: schedules.length,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleUpdateScheduleTitle = (index: number, title: string) => {
    const updated = [...schedules];
    updated[index].title = title;
    setSchedules(updated);
  };

  const handleUpdateScheduleNotes = (index: number, notes: string) => {
    const updated = [...schedules];
    updated[index].notes = notes;
    setSchedules(updated);
  };

  const handleAddScheduleRow = (scheduleIndex: number) => {
    const updated = [...schedules];
    const columnCount = updated[scheduleIndex].headers.length;
    const newRow = new Array(columnCount).fill("-");
    updated[scheduleIndex].rows.push(newRow);
    setSchedules(updated);
  };

  const handleRemoveScheduleRow = (scheduleIndex: number, rowIndex: number) => {
    const updated = [...schedules];
    updated[scheduleIndex].rows = updated[scheduleIndex].rows.filter((_, i) => i !== rowIndex);
    setSchedules(updated);
  };

  const handleUpdateScheduleCell = (
    scheduleIndex: number,
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updated = [...schedules];
    updated[scheduleIndex].rows[rowIndex][colIndex] = value;
    setSchedules(updated);
  };

  const handleUpdateScheduleHeader = (
    scheduleIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updated = [...schedules];
    updated[scheduleIndex].headers[colIndex] = value;
    setSchedules(updated);
  };

  const handleAddScheduleColumn = (scheduleIndex: number) => {
    const updated = [...schedules];
    updated[scheduleIndex].headers.push(`Column ${updated[scheduleIndex].headers.length + 1}`);
    for (const row of updated[scheduleIndex].rows) {
      row.push("-");
    }
    setSchedules(updated);
  };

  const handleRemoveScheduleColumn = (scheduleIndex: number, colIndex: number) => {
    const updated = [...schedules];
    if (updated[scheduleIndex].headers.length <= 1) return;
    updated[scheduleIndex].headers = updated[scheduleIndex].headers.filter((_, i) => i !== colIndex);
    for (let r = 0; r < updated[scheduleIndex].rows.length; r++) {
      updated[scheduleIndex].rows[r] = updated[scheduleIndex].rows[r].filter((_, i) => i !== colIndex);
    }
    setSchedules(updated);
  };

  // Submit Handler
  const handleSave = (statusToSet: "draft" | "published") => {
    startTransition(async () => {
      setFeedback(null);

      const payload: CaseStudyFormData = {
        ...formData,
        status: statusToSet,
        details: detailsText.split("\n").map((s) => s.trim()).filter(Boolean),
        tools: toolsText.split(",").map((s) => s.trim()).filter(Boolean),
        objectives: objectivesText.split("\n").map((s) => s.trim()).filter(Boolean),
        keyFindings: keyFindingsText.split("\n").map((s) => s.trim()).filter(Boolean),
        recommendations: recommendationsText.split("\n").map((s) => s.trim()).filter(Boolean),
        financialSchedules: schedules,
      };

      const res = await upsertCaseStudyAction(payload);
      if (res.success) {
        setFeedback({ type: "success", message: res.message || "Saved successfully." });
        if (!formData.id && res.caseStudyId) {
          router.push(`/admin/case-studies/${res.caseStudyId}/edit`);
        }
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save." });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-ink-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/case-studies"
            className="p-2.5 rounded-xl text-ink-400 hover:text-ink-100 bg-ink-900 border border-ink-800 shadow-clay-card-dark transition-all cursor-pointer"
            title="Return to case studies list"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-1">
              <FiBookOpen className="w-3.5 h-3.5" />
              <span>
                {initialData?.id ? `Edit Case Study #${initialData.id.slice(0, 8)}` : "Create New Case Study"}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-50">
              {formData.title || "Untitled Research Study"}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {formData.id && (
            <Link
              href={`/admin/case-studies/${formData.id}/preview`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-ink-300 hover:text-white bg-ink-900 border border-ink-800 shadow-clay-inset-dark transition-all"
            >
              <FiEye className="w-4 h-4 text-emerald-400" />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-ink-200 bg-ink-800 hover:bg-ink-700/80 border border-ink-700 shadow-clay-card-dark active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-ink-950 bg-emerald-400 hover:bg-emerald-300 shadow-clay-card-dark active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <FiCheckCircle className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-clay-inset-dark"
              : "bg-red-500/10 border-red-500/30 text-red-300 shadow-clay-inset-dark"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-ink-400 hover:text-ink-100 underline text-xs ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mandatory Discrepancy Integrity Notice */}
      {discrepancy && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 shadow-clay-card-dark space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <FiAlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-display font-bold text-sm uppercase tracking-wide">
              Mandatory Financial Integrity Disclosure Attached
            </span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            This study is bound to a verified mathematical discrepancy disclosure in accordance with
            portfolio integrity guardrails (VAL-09, VAL-10, VAL-11). The disclosure below must
            remain preserved and cannot be silently deleted or reconciled without documented owner approval.
          </p>
          <div className="bg-ink-950/80 border border-amber-500/20 rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="text-amber-300 font-semibold">{discrepancy.headline}</div>
            <div className="text-ink-400">
              <span className="text-ink-300 font-semibold">Formula Tested:</span> {discrepancy.formulaTested}
            </div>
            <div className="text-ink-400">
              <span className="text-ink-300 font-semibold">Values:</span> {discrepancy.originalValues}
            </div>
            <div className="text-ink-400">
              <span className="text-ink-300 font-semibold">Policy:</span> {discrepancy.preservationPolicy}
            </div>
          </div>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Core Details Card */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-clay-card-dark space-y-4">
            <h2 className="font-display font-bold text-base text-ink-100 flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-emerald-400" />
              <span>Core Identity & Metadata</span>
            </h2>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Study Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Individual Income Tax Return Assessment (AY 2024-2025)"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="tax-return-assessment-2024"
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                    Discipline Group
                  </label>
                  <select
                    value={formData.groupId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groupId: e.target.value,
                        groupShort: e.target.value === "accounting" ? "Accounting" : "Research",
                        group:
                          e.target.value === "accounting"
                            ? "Applied Accounting Case Study"
                            : "Macroeconomic & Industry Research",
                      })
                    }
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                  >
                    <option value="accounting">Accounting (Applied Case Study)</option>
                    <option value="macroeconomics">Macroeconomics (Research Study)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Academic Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Direct & Indirect Taxation / Managerial Accounting"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Academic Overview & Abstract
                </label>
                <textarea
                  rows={4}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Comprehensive financial evaluation and accounting methodologies applied..."
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-xs text-ink-100 font-sans shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary description of the coursework scope..."
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-xs text-ink-100 font-sans shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
          </div>

          {/* Academic Scope & Framework Card */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-clay-card-dark space-y-4">
            <h2 className="font-display font-bold text-base text-ink-100 flex items-center gap-2">
              <FiLayers className="w-4 h-4 text-emerald-400" />
              <span>Accounting Framework & Scope</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Regulatory / Standard Framework
                </label>
                <input
                  type="text"
                  value={formData.framework}
                  onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                  placeholder="e.g. Bangladesh Income Tax Act 2023 / IFRS"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Currency Unit
                </label>
                <input
                  type="text"
                  value={formData.currencyUnit}
                  onChange={(e) => setFormData({ ...formData, currencyUnit: e.target.value })}
                  placeholder="BDT (Bangladeshi Taka)"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Evidence Classification
                </label>
                <input
                  type="text"
                  value={formData.evidenceType}
                  onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
                  placeholder="Coursework & Empirical Case Data"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-sans font-medium text-xs">
                  Calculation Basis
                </label>
                <input
                  type="text"
                  value={formData.calculationBasis}
                  onChange={(e) => setFormData({ ...formData, calculationBasis: e.target.value })}
                  placeholder="Statutory Slab Assessment"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block text-ink-300 mb-1 font-medium">
                  Tools & Modeling Packages (comma separated)
                </label>
                <input
                  type="text"
                  value={toolsText}
                  onChange={(e) => setToolsText(e.target.value)}
                  placeholder="Microsoft Excel, Financial Ratio Modeling, Income Tax Slab Calculator"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs text-ink-100 font-mono shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-medium">
                  Coursework Objectives (one per line)
                </label>
                <textarea
                  rows={2}
                  value={objectivesText}
                  onChange={(e) => setObjectivesText(e.target.value)}
                  placeholder="Evaluate corporate annual statements&#10;Assess liquidity and solvency ratios"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-medium">
                  Detailed Implementation Highlights (one per line)
                </label>
                <textarea
                  rows={2}
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  placeholder="Detail highlight 1&#10;Detail highlight 2"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-medium">
                  Key Findings (one per line)
                </label>
                <textarea
                  rows={3}
                  value={keyFindingsText}
                  onChange={(e) => setKeyFindingsText(e.target.value)}
                  placeholder="Key audit finding 1&#10;Key audit finding 2"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-ink-300 mb-1 font-medium">
                  Academic Recommendations (one per line)
                </label>
                <textarea
                  rows={3}
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  placeholder="Recommendation 1&#10;Recommendation 2"
                  className="w-full bg-ink-950 border border-ink-800 rounded-xl p-3 text-xs text-ink-100 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
          </div>

          {/* Financial Tabular Schedules Editor Card */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-clay-card-dark space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base text-ink-100 flex items-center gap-2">
                  <FiTable className="w-4 h-4 text-emerald-400" />
                  <span>Financial Tabular Schedules</span>
                </h2>
                <p className="text-xs text-ink-400 mt-0.5">
                  Structured monetary and variance tables formatted with .tabular-nums precision
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSchedule}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add Schedule</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="py-8 text-center bg-ink-950/60 border border-dashed border-ink-800 rounded-xl text-xs text-ink-500">
                No financial schedules attached to this case study. Click &quot;Add Schedule&quot; to build a schedule.
              </div>
            ) : (
              <div className="space-y-6">
                {schedules.map((schedule, sIndex) => (
                  <div
                    key={sIndex}
                    className="bg-ink-950 border border-ink-800/90 rounded-xl p-4 shadow-clay-inset-dark space-y-4"
                  >
                    {/* Schedule Header Controls */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-mono text-ink-400 mb-1">
                          Schedule #{sIndex + 1} Title
                        </label>
                        <input
                          type="text"
                          value={schedule.title}
                          onChange={(e) => handleUpdateScheduleTitle(sIndex, e.target.value)}
                          className="w-full bg-ink-900 border border-ink-800 rounded-lg px-3 py-1.5 text-xs text-ink-100 font-semibold focus:outline-none focus:border-emerald-500/60"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => handleAddScheduleColumn(sIndex)}
                          className="px-2.5 py-1 rounded text-[11px] font-mono text-ink-300 bg-ink-900 border border-ink-800 hover:text-emerald-400"
                        >
                          + Column
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddScheduleRow(sIndex)}
                          className="px-2.5 py-1 rounded text-[11px] font-mono text-ink-300 bg-ink-900 border border-ink-800 hover:text-emerald-400"
                        >
                          + Row
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSchedule(sIndex)}
                          className="p-1.5 rounded text-ink-500 hover:text-red-400 bg-ink-900 border border-ink-800"
                          title="Remove this schedule"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Table Editor */}
                    <div className="overflow-x-auto border border-ink-800/80 rounded-lg">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-ink-900 border-b border-ink-800">
                            {schedule.headers.map((header, cIndex) => (
                              <th key={cIndex} className="p-2 border-r border-ink-800/80 relative group">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={header}
                                    onChange={(e) =>
                                      handleUpdateScheduleHeader(sIndex, cIndex, e.target.value)
                                    }
                                    className="w-full bg-transparent text-emerald-400 font-mono font-bold text-[11px] focus:outline-none"
                                  />
                                  {schedule.headers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveScheduleColumn(sIndex, cIndex)}
                                      className="opacity-0 group-hover:opacity-100 text-ink-500 hover:text-red-400 text-[10px] px-1"
                                      title="Remove column"
                                    >
                                      x
                                    </button>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="p-2 w-8 text-center text-ink-600"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-800/60 font-mono tabular-nums text-xs">
                          {schedule.rows.map((row, rIndex) => (
                            <tr key={rIndex} className="hover:bg-ink-900/50">
                              {row.map((cell, cIndex) => (
                                <td key={cIndex} className="p-2 border-r border-ink-800/40">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) =>
                                      handleUpdateScheduleCell(sIndex, rIndex, cIndex, e.target.value)
                                    }
                                    className="w-full bg-transparent text-ink-200 focus:outline-none focus:text-white"
                                  />
                                </td>
                              ))}
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveScheduleRow(sIndex, rIndex)}
                                  className="text-ink-600 hover:text-red-400 text-[11px]"
                                  title="Remove row"
                                >
                                  x
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Schedule Notes */}
                    <div>
                      <label className="block text-[11px] font-mono text-ink-400 mb-1">
                        Table Footnotes & Explanatory Disclosures
                      </label>
                      <input
                        type="text"
                        value={schedule.notes || ""}
                        onChange={(e) => handleUpdateScheduleNotes(sIndex, e.target.value)}
                        placeholder="e.g. Figures derived from audited financial disclosures."
                        className="w-full bg-ink-900 border border-ink-800 rounded-lg px-3 py-1.5 text-xs text-ink-300 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls (Col 3) */}
        <div className="space-y-6">
          {/* Publishing Status Card */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-clay-card-dark space-y-4">
            <h2 className="font-display font-bold text-sm text-ink-100 flex items-center justify-between">
              <span>Publishing Status</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                  formData.status === "published"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {formData.status.toUpperCase()}
              </span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-ink-700 bg-ink-950 text-emerald-500 focus:ring-emerald-500/30"
                />
                <span className="text-ink-200">Featured Research Study</span>
              </label>

              <div className="pt-2 border-t border-ink-800 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSave("published")}
                  disabled={isPending}
                  className="w-full py-2.5 rounded-xl text-xs font-mono font-semibold text-ink-950 bg-emerald-400 hover:bg-emerald-300 shadow-clay-card-dark transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save & Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  disabled={isPending}
                  className="w-full py-2.5 rounded-xl text-xs font-mono font-medium text-ink-200 bg-ink-950 hover:bg-ink-800 border border-ink-800 shadow-clay-inset-dark transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save as Draft"}
                </button>
              </div>
            </div>
          </div>

          {/* Attached Media Asset Card */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-clay-card-dark space-y-4">
            <h2 className="font-display font-bold text-sm text-ink-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FiImage className="w-4 h-4 text-emerald-400" />
                <span>Media Asset</span>
              </span>
            </h2>

            {formData.imageUrl ? (
              <div className="space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-ink-950 border border-ink-800 relative shadow-clay-inset-dark">
                  <Image
                    src={formData.imageUrl}
                    alt={formData.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-ink-800 rounded-xl bg-ink-950/40">
                <FiImage className="w-8 h-8 mx-auto text-ink-600 mb-2 opacity-50" />
                <p className="text-xs text-ink-400 mb-3">No image attached</p>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Attach Image</span>
                </button>
              </div>
            )}
          </div>

          {/* Revision History Snapshot Panel */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-clay-card-dark space-y-3">
            <h2 className="font-display font-bold text-sm text-ink-100 flex items-center gap-2">
              <FiClock className="w-4 h-4 text-emerald-400" />
              <span>Revision History</span>
            </h2>

            {revisions.length === 0 ? (
              <p className="text-xs text-ink-500 py-2">
                No past revisions recorded. Revisions are created automatically upon save.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {revisions.map((rev, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-lg bg-ink-950/60 border border-ink-800/80 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold">
                        Rev #{rev.revisionNumber}
                      </span>
                      <span className="text-[10px] text-ink-500">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-300 font-sans truncate">
                      {rev.changeSummary || "Content saved"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Picker Dialog Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        assets={availableMediaAssets}
        currentSelectedUrl={formData.imageUrl}
        onSelect={(asset) => {
          setFormData({ ...formData, imageUrl: asset.secureUrl });
        }}
      />
    </div>
  );
}

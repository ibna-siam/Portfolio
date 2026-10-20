import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiX,
  FiCheckCircle,
  FiTag,
  FiAward,
  FiTarget,
  FiBookOpen,
  FiBarChart2,
  FiArrowRight,
  FiAlertTriangle,
  FiLayers,
  FiFileText,
  FiInfo,
  FiShield,
  FiDatabase,
} from "react-icons/fi";
import { projects } from "../data/portfolioData";
import {
  CASE_STUDY_METADATA,
  INTEGRITY_STATUS,
} from "../data/caseStudyIntegrity";
import { SectionHeading } from "./SectionHeading";

// Group and category taxonomy
const GROUP_FILTERS = [
  { id: "all", label: "All Studies", count: 8 },
  { id: "accounting", label: "Applied Accounting", count: 5 },
  { id: "macroeconomics", label: "Macroeconomic Research", count: 3 },
];

const DISCIPLINE_CATEGORIES = [
  "All",
  "Financial Analysis",
  "Budgeting & Planning",
  "Taxation",
  "Cost Accounting",
  "Auditing",
  "Economic Research",
  "Macroeconomics",
];

// Helper to retrieve status icon
function StatusIcon({ statusKey, className = "shrink-0", size = 13 }) {
  switch (statusKey) {
    case "reconciliation_req":
      return <FiAlertTriangle className={className} size={size} />;
    case "hypothetical":
      return <FiLayers className={className} size={size} />;
    case "source_limitation":
      return <FiInfo className={className} size={size} />;
    case "academic_calc":
      return <FiFileText className={className} size={size} />;
    case "verified":
    default:
      return <FiCheckCircle className={className} size={size} />;
  }
}

// ── Interactive Case Study Viewer (Modal) ──────────────────────────
function CaseStudyViewer({ project, meta, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const modalRef = useRef(null);
  const report = project.fullReport;

  // Tabs structure aligned with PRD and Phase 6 instructions
  const tabs = [
    { id: "overview", label: "Overview", icon: FiBookOpen },
    { id: "methodology", label: "Methodology & Framework", icon: FiTarget },
    { id: "data", label: "Financial Data & Schedules", icon: FiDatabase },
    { id: "findings", label: "Findings & Observations", icon: FiBarChart2 },
    { id: "integrity", label: "Integrity & Audit Notes", icon: FiShield },
  ];

  const status = meta.integrityStatus;
  const isFlagged = status.key === "reconciliation_req";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-ink-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-ink-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-ink-200 dark:border-ink-800 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Group Badge */}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700">
                  {meta.group}
                </span>

                {/* Category Badge */}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {project.category}
                </span>

                {/* Integrity Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${status.badge}`}
                >
                  <StatusIcon statusKey={status.key} size={12} />
                  <span>{status.label}</span>
                </span>
              </div>

              <h2
                id="case-study-title"
                className="font-display text-lg sm:text-2xl font-bold text-ink-900 dark:text-ink-50 leading-snug"
              >
                {project.title}
              </h2>

              <p className="text-xs text-ink-500 dark:text-ink-400 font-mono">
                {meta.academicScope} · Framework: {meta.framework}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Case Study Viewer"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 transition-colors shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Persistent Discrepancy Alert Banner if Flagged */}
          {isFlagged && meta.discrepancyNotice && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-2.5 text-xs">
              <FiAlertTriangle className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" size={15} />
              <div className="space-y-1">
                <span className="font-bold block">{meta.discrepancyNotice.headline}</span>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  {meta.discrepancyNotice.summary} Source values are preserved under review in accordance with financial precision standards.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ink-100 dark:border-ink-800 px-3 sm:px-6 bg-white dark:bg-ink-900 shrink-0 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === id
                  ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300"
                  : "border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
              }`}
            >
              <Icon size={13} /> {label}
              {id === "integrity" && isFlagged && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title="Review Required" />
              )}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          <AnimatePresence mode="wait">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-2">
                    Academic Scope & Problem Context
                  </h3>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {report?.overview || project.description}
                  </p>
                </div>

                {report?.objectives && (
                  <div>
                    <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">
                      Academic Objectives
                    </h3>
                    <ul className="space-y-2">
                      {report.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                            {obj}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 space-y-1">
                    <span className="text-xs font-mono text-ink-400 uppercase tracking-wider block">
                      Analytical Framework
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-ink-800 dark:text-ink-200">
                      {meta.framework}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 space-y-1">
                    <span className="text-xs font-mono text-ink-400 uppercase tracking-wider block">
                      Evidence & Data Basis
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-ink-800 dark:text-ink-200">
                      {meta.evidenceType}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <FiTag size={12} /> Tools & Analytical Methods
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1.5 bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-xs rounded-lg font-medium border border-ink-200 dark:border-ink-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. METHODOLOGY TAB */}
            {activeTab === "methodology" && (
              <motion.div
                key="methodology"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">
                    Analytical Steps & Procedures
                  </h3>
                  <div className="space-y-4">
                    {report?.methodology?.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          {i < report.methodology.length - 1 && (
                            <div className="w-px flex-1 bg-ink-200 dark:bg-ink-700 mt-2" />
                          )}
                        </div>
                        <div className="pb-3">
                          <h4 className="font-semibold text-sm text-ink-900 dark:text-ink-100 mb-1">
                            {step.heading}
                          </h4>
                          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {meta.formulas && meta.formulas.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">
                      Accounting Formulas & Calculation Specifications
                    </h3>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {meta.formulas.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 space-y-1"
                        >
                          <span className="text-xs font-bold text-ink-700 dark:text-ink-200">
                            {item.name}
                          </span>
                          <p className="text-xs font-mono text-teal-700 dark:text-teal-400 bg-white dark:bg-ink-900 p-2 rounded-lg border border-ink-200 dark:border-ink-700">
                            {item.formula}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. FINANCIAL DATA & SCHEDULES TAB */}
            {activeTab === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                  <div>
                    <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">
                      Financial Calculation Schedules & Tables
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                      Currency: {meta.currencyUnit} · Classification: {meta.inputsClassification}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                    Precision: Source Preserved
                  </span>
                </div>

                {report?.tables && report.tables.length > 0 ? (
                  report.tables.map((table, tIdx) => (
                    <div key={tIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-ink-800 dark:text-ink-200">
                          {table.title}
                        </h4>
                        <span className="text-[11px] text-ink-400 font-mono">
                          Table {tIdx + 1}
                        </span>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800 shadow-sm">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-ink-100/70 dark:bg-ink-800/80 border-b border-ink-200 dark:border-ink-700">
                              {table.headers.map((header, hIdx) => (
                                <th
                                  key={hIdx}
                                  className={`px-3.5 py-2.5 font-bold text-ink-700 dark:text-ink-300 whitespace-nowrap ${
                                    hIdx === 0 ? "text-left" : "text-right"
                                  }`}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-mono">
                            {table.rows.map((row, rIdx) => {
                              const isTotalRow =
                                row[0]?.toLowerCase().includes("total") ||
                                row[0]?.toLowerCase().includes("net refund") ||
                                row[0]?.toLowerCase().includes("net profit after tax") ||
                                row[0]?.toLowerCase().includes("contribution margin");

                              return (
                                <tr
                                  key={rIdx}
                                  className={`${
                                    isTotalRow
                                      ? "bg-teal-500/10 dark:bg-teal-500/15 font-semibold text-ink-900 dark:text-ink-50"
                                      : rIdx % 2 === 0
                                      ? "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-300"
                                      : "bg-ink-50/50 dark:bg-ink-800/30 text-ink-700 dark:text-ink-300"
                                  }`}
                                >
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`px-3.5 py-2.5 whitespace-nowrap tabular-nums ${
                                        cIdx === 0
                                          ? "text-left font-sans font-medium text-ink-800 dark:text-ink-200"
                                          : "text-right"
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-xl bg-ink-50 dark:bg-ink-800 text-center text-xs text-ink-500">
                    No raw tables cataloged for this case study. See methodology and findings.
                  </div>
                )}

                <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 text-xs text-ink-600 dark:text-ink-400 space-y-1">
                  <span className="font-bold text-ink-800 dark:text-ink-200 block">
                    Table Formatting & Unit Standards
                  </span>
                  <p>
                    All monetary figures are presented in BDT unless stated otherwise. Values use tabular numerals (`.tabular-nums`) to preserve column alignment. Disclosed source precision is retained without rounding truncation.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 4. FINDINGS & OBSERVATIONS TAB */}
            {activeTab === "findings" && (
              <motion.div
                key="findings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">
                    Defensible Key Findings & Analytical Insights
                  </h3>
                  <ul className="space-y-2.5">
                    {report?.keyFindings?.map((finding, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-800"
                      >
                        <FiCheckCircle
                          className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0"
                          size={14}
                        />
                        <span className="text-xs sm:text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                          {finding}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {project.outcome && (
                  <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                    <div className="flex items-start gap-3">
                      <FiAward
                        className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0"
                        size={16}
                      />
                      <div>
                        <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block mb-1">
                          Academic Study Conclusion
                        </span>
                        <p className="text-xs sm:text-sm text-ink-800 dark:text-ink-200 font-medium">
                          {project.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {report?.recommendations && report.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">
                      Academic Recommendations & Managerial Insights
                    </h3>
                    <ul className="space-y-2.5">
                      {report.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <FiArrowRight
                            className="text-teal-500 mt-0.5 shrink-0"
                            size={13}
                          />
                          <span className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. INTEGRITY & AUDIT NOTES TAB */}
            {activeTab === "integrity" && (
              <motion.div
                key="integrity"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Discrepancy Breakdown if Flagged */}
                {meta.discrepancyNotice ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <FiAlertTriangle className="text-amber-600 dark:text-amber-400" size={17} />
                      <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                        {meta.discrepancyNotice.headline}
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                      {meta.discrepancyNotice.details.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-white/60 dark:bg-ink-900/60 border border-amber-500/20 text-xs space-y-1 font-mono">
                      <div className="text-ink-600 dark:text-ink-400">
                        <strong className="text-ink-900 dark:text-ink-100 font-sans">Formula Tested:</strong>{" "}
                        {meta.discrepancyNotice.formulaTested}
                      </div>
                      <div className="text-ink-600 dark:text-ink-400">
                        <strong className="text-ink-900 dark:text-ink-100 font-sans">Values Examined:</strong>{" "}
                        {meta.discrepancyNotice.originalValues}
                      </div>
                      <div className="text-amber-700 dark:text-amber-300 font-bold">
                        <strong className="font-sans">Current Audit Status:</strong>{" "}
                        {meta.discrepancyNotice.statusText}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                    <FiCheckCircle className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" size={16} />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                        No Mathematical Discrepancies Flagged
                      </h4>
                      <p className="text-emerald-800 dark:text-emerald-300">
                        The figures and internal calculation schedules of this study reproduce consistently from stated inputs.
                      </p>
                    </div>
                  </div>
                )}

                {/* Audit Findings Register for this Study */}
                <div>
                  <h3 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">
                    Financial Integrity Audit Register
                  </h3>
                  <div className="space-y-3">
                    {meta.auditNotes.map((note, nIdx) => (
                      <div
                        key={nIdx}
                        className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-ink-800 dark:text-ink-200">
                            {note.topic}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink-200/70 dark:bg-ink-700 text-ink-700 dark:text-ink-300">
                            {note.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                          {note.finding}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Provenance Disclaimer */}
                <div className="p-4 rounded-xl bg-ink-100/60 dark:bg-ink-800/40 border border-ink-200 dark:border-ink-700 text-xs text-ink-600 dark:text-ink-400 space-y-1">
                  <span className="font-bold text-ink-800 dark:text-ink-200 block">
                    Academic Analysis Disclaimer
                  </span>
                  <p>
                    This project was completed strictly as academic analysis within the BBA curriculum at Daffodil International University. It does not constitute professional audit certification, commercial consulting services, or verified corporate employment.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 sm:px-6 bg-ink-50/70 dark:bg-ink-950/50 border-t border-ink-100 dark:border-ink-800 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500 dark:text-ink-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Md Ibna Siam · DIU Accounting · Student Portfolio</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-ink-200 dark:bg-ink-800 hover:bg-ink-300 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-200 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Case Study Card ────────────────────────────────────────────────
function CaseStudyCard({ project, onSelect }) {
  const meta = CASE_STUDY_METADATA[project.id] || {
    group: "Academic Study",
    groupId: "accounting",
    academicScope: "DIU Coursework",
    framework: "Analytical Framework",
    integrityStatus: INTEGRITY_STATUS.ACADEMIC_CALC,
    currencyUnit: "BDT",
    auditNotes: [],
  };

  const status = meta.integrityStatus;
  const isAccounting = meta.groupId === "accounting";

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className="group text-left bg-white dark:bg-ink-900 rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-800 hover:border-teal-500/50 dark:hover:border-teal-400/40 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
    >
      {/* Visual Header / Cover Image */}
      <div className="relative h-40 overflow-hidden shrink-0 bg-ink-100 dark:bg-ink-800">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/35 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Group Tag */}
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              isAccounting
                ? "bg-teal-600/90 text-white"
                : "bg-blue-600/90 text-white"
            }`}
          >
            {isAccounting ? "Applied Accounting" : "Macro Research"}
          </span>

          {/* Integrity Status Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border backdrop-blur-md shadow-sm ${status.badge}`}
          >
            <StatusIcon statusKey={status.key} size={11} />
            <span>{status.shortLabel}</span>
          </span>
        </div>

        {/* Bottom Title / Framework overlay */}
        <div className="absolute bottom-2.5 left-3 right-3">
          <span className="text-[11px] text-white/80 font-mono block truncate">
            {meta.framework}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
            <span className="font-semibold text-teal-700 dark:text-teal-400">
              {project.category}
            </span>
            <span className="font-mono text-[11px]">{project.type}</span>
          </div>

          <h3 className="font-display font-bold text-base text-ink-900 dark:text-ink-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-2">
            {project.title}
          </h3>

          <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Outcome Box */}
        <div className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800/60 border border-ink-100 dark:border-ink-800 text-xs">
          <div className="flex items-start gap-2">
            <FiAward className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" size={13} />
            <span className="text-ink-700 dark:text-ink-300 font-medium line-clamp-2">
              {project.outcome}
            </span>
          </div>
        </div>

        {/* Card Footer: Tools & CTA */}
        <div className="pt-2 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {(project.tools || []).slice(0, 2).map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-[10px] rounded font-medium"
              >
                {tool}
              </span>
            ))}
            {(project.tools || []).length > 2 && (
              <span className="text-[10px] text-ink-400 px-1 py-0.5">
                +{(project.tools || []).length - 2}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform">
            Inspect Case Study <FiArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ── Main Projects Component ────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [activeGroup, setActiveGroup] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const activeTriggerRef = useRef(null);

  const handleCloseViewer = () => {
    setSelectedProject(null);
    setTimeout(() => {
      activeTriggerRef.current?.focus?.();
    }, 50);
  };

  const handleOpenViewer = (project, event) => {
    activeTriggerRef.current = event?.currentTarget || document.activeElement;
    setSelectedProject(project);
  };

  // Keyboard Escape listener & focus restoration
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedProject) {
        handleCloseViewer();
      }
    };
    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  // Filter projects by Group (Accounting vs Macroeconomics) and Discipline Category
  const filteredProjects = projects.filter((project) => {
    const meta = CASE_STUDY_METADATA[project.id];
    const matchesGroup =
      activeGroup === "all" ||
      (activeGroup === "accounting" && meta?.groupId === "accounting") ||
      (activeGroup === "macroeconomics" && meta?.groupId === "macroeconomics");

    const matchesCategory =
      activeCategory === "All" || project.category === activeCategory;

    return matchesGroup && matchesCategory;
  });

  return (
    <section id="projects" className="py-24 bg-ink-50/30 dark:bg-ink-950/30">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Canonical Section Heading */}
          <SectionHeading
            label="Applied Accounting & Analytical Research"
            title="Case Study Showcase & Research Viewer"
            subtitle="Academic case studies, financial statement analyses, and macroeconomic research completed during BBA studies at Daffodil International University. Presented with documented methodologies, financial schedules, and transparent integrity notes."
          />

          {/* Academic Grounding / Standards Banner */}
          <div className="mb-10 p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">
                DIU
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-50">
                  Academic Precision & Evidence-Conscious Standards
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  All work presented reflects undergraduate coursework analyses. Calculations, assumptions, and audit statuses are transparently documented.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-center px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800">
                <span className="text-teal-600 dark:text-teal-400 font-bold block">5</span>
                <span className="text-[11px] text-ink-500">Accounting Studies</span>
              </div>
              <div className="text-center px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800">
                <span className="text-blue-600 dark:text-blue-400 font-bold block">3</span>
                <span className="text-[11px] text-ink-500">Macro Papers</span>
              </div>
            </div>
          </div>

          {/* Primary Group Switcher: Segmented Control */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              role="tablist"
              aria-label="Filter case studies by discipline group"
              className="inline-flex p-1.5 rounded-2xl bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700"
            >
              {GROUP_FILTERS.map((group) => {
                const isSelected = activeGroup === group.id;
                return (
                  <button
                    key={group.id}
                    role="tab"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => {
                      setActiveGroup(group.id);
                      setActiveCategory("All");
                    }}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-ink-900 text-teal-700 dark:text-teal-300 shadow-sm"
                        : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
                    }`}
                  >
                    <span>{group.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                        isSelected
                          ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400"
                          : "bg-ink-200/70 dark:bg-ink-700 text-ink-600 dark:text-ink-400"
                      }`}
                    >
                      {group.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-discipline Categories Pills */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl">
              {DISCIPLINE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Case Studies Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <CaseStudyCard
                    key={project.id}
                    project={project}
                    onSelect={(p) => handleOpenViewer(p)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 p-8 space-y-3">
              <p className="text-sm font-semibold text-ink-700 dark:text-ink-300">
                No case studies match the selected combination of group and discipline.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveGroup("all");
                  setActiveCategory("All");
                }}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Academic Integrity Notice Footnote */}
          <div className="mt-12 text-center text-xs text-ink-500 dark:text-ink-400 space-y-1">
            <p>
              Academic case studies completed at Daffodil International University (DIU), Department of Accounting.
            </p>
            <p className="font-mono text-[11px] text-ink-400">
              Integrity Statuses: Verified · Academic Calculation · Requires Reconciliation · Illustrative / Hypothetical
            </p>
          </div>
        </motion.div>
      </div>

      {/* Case Study Viewer Modal */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyViewer
            project={selectedProject}
            meta={CASE_STUDY_METADATA[selectedProject.id]}
            onClose={handleCloseViewer}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

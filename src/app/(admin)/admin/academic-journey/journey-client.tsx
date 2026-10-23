"use client";

import React from "react";
import Link from "next/link";
import { FiBookOpen, FiEdit3, FiTrendingUp } from "react-icons/fi";
import type { AccaTrajectoryFormData } from "./actions";

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
  return (
    <div className="space-y-8">
      {/* SECTION 1: Institutional Education Milestones */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-50 tracking-tight flex items-center gap-2">
              <FiBookOpen className="text-emerald-600 dark:text-emerald-400" />
              <span>Institutional Education Milestones</span>
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
              Verified university degrees, secondary qualifications, and curriculum
              disciplines.
            </p>
          </div>
        </div>

        {/* Compact Milestones Table */}
        <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-ink-200 dark:border-ink-800 bg-slate-50/75 dark:bg-ink-950/60 font-mono text-[11px] text-ink-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[220px]">Degree & Institution</th>
                  <th className="py-3 px-4 min-w-[140px]">Period & Status</th>
                  <th className="py-3 px-4 min-w-[220px]">Curriculum Disciplines</th>
                  <th className="py-3 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-sans">
                {initialMilestones.map((m, idx) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-ink-800/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono text-ink-400 font-semibold">
                      {idx + 1}
                    </td>

                    {/* Degree & Institution */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink-900 dark:text-ink-100 font-sans leading-tight">
                        <Link
                          href={`/admin/academic-journey/${m.id}/edit`}
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {m.degree}
                        </Link>
                      </div>
                      <div className="text-[11px] text-ink-500 dark:text-ink-400 font-mono mt-0.5">
                        {m.institution} • {m.major}
                      </div>
                    </td>

                    {/* Period & Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700/60">
                        {m.period}
                      </span>
                      <div className="text-[11px] text-ink-500 dark:text-ink-400 font-mono mt-1">
                        {m.status}
                      </div>
                    </td>

                    {/* Disciplines */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(m.disciplines || []).map((disc, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                          >
                            {disc}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/academic-journey/${m.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-ink-700 dark:text-ink-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-ink-50 hover:bg-ink-100 dark:bg-ink-800 dark:hover:bg-ink-700 border border-ink-200 dark:border-ink-700 transition-colors"
                        aria-label={`Edit ${m.degree}`}
                        title={`Edit ${m.degree}`}
                      >
                        <FiEdit3 size={13} aria-hidden="true" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACCA Career Trajectory Strategic Roadmap */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-50 tracking-tight flex items-center gap-2">
              <FiTrendingUp className="text-emerald-600 dark:text-emerald-400" />
              <span>ACCA Career Trajectory & Professional Roadmap</span>
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
              Strategic career pathway targets, targeted exam papers, and ethical
              non-membership disclosure.
            </p>
          </div>
          <Link
            href="/admin/academic-journey/acca/edit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-ink-950 dark:hover:bg-emerald-300 text-xs font-mono font-medium rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <FiEdit3 size={13} />
            <span>Edit ACCA Trajectory</span>
          </Link>
        </div>

        {/* ACCA Strategy Showcase Card */}
        <div className="p-5 sm:p-6 bg-white dark:bg-ink-900 border border-emerald-500/30 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-mono">
                ACCA
              </div>
              <div>
                <h3 className="font-bold text-base text-ink-900 dark:text-ink-100">
                  {initialAcca.qualification}
                </h3>
                <div className="text-xs text-ink-500 font-mono">
                  {initialAcca.credentialBody} • {initialAcca.trajectoryType}
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              {initialAcca.statusLabel}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider font-mono">
              Ethical Non-Membership Disclosure Notice:
            </div>
            <p className="text-xs text-ink-600 dark:text-ink-300 bg-slate-50 dark:bg-ink-950 p-3.5 rounded-xl border border-ink-200 dark:border-ink-800 leading-relaxed font-sans">
              {initialAcca.integrityNotice}
            </p>
          </div>

          {/* Planned Strategic Focus Areas in Compact 2x2 Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider font-mono">
                Planned Strategic Focus Areas:
              </div>
              <span className="text-[11px] font-mono text-ink-500">
                {initialAcca.strategicFocus?.length || 0} Professional Papers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {(initialAcca.strategicFocus || []).map((paper, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-ink-950/60 border border-ink-200 dark:border-ink-800 text-xs font-mono text-ink-800 dark:text-ink-200 flex items-center gap-2.5 hover:border-emerald-500/40 transition-colors"
                >
                  <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-ink-900 dark:text-ink-100">
                    {paper}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

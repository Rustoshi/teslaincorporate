"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProjectStatus, deleteProject } from "@/app/admin/actions/projects";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectRow {
    _id: string;
    name: string;
    company: string;
    slug: string;
    heroBgColor: string;
    status: 'upcoming' | 'open' | 'funded' | 'closed';
    isFeatured: boolean;
    isActive: boolean;
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    tranches: { name: string; spotsFilled: number; spotsTotal: number }[];
    createdAt: string;
}

interface ProjectsClientProps {
    projects: ProjectRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COMPANY_LABELS: Record<string, string> = {
    SpaceX:       "SpaceX",
    BoringCompany:"Boring Co.",
    Tesla:        "Tesla",
    Neuralink:    "Neuralink",
    xAI:          "xAI",
    DOGE:         "Dogecoin",
};

const STATUS_STYLES: Record<string, string> = {
    upcoming: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    open:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    funded:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
    closed:   "bg-white/10 text-white/40 border-white/10",
};

const STATUS_OPTIONS = ['upcoming', 'open', 'funded', 'closed'] as const;

function formatCurrency(n: number): string {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
}

function FundingBar({ current, target }: { current: number; target: number }) {
    const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0);
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-white/50">{formatCurrency(current)}</span>
                <span className="text-[11px] text-white/30">{pct.toFixed(1)}%</span>
            </div>
            <div className="h-1 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${pct}%`,
                        background: pct >= 90
                            ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                            : pct >= 50
                            ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                            : 'linear-gradient(90deg, #f59e0b, #d97706)',
                    }}
                />
            </div>
            <div className="text-[10px] text-white/30 mt-1">of {formatCurrency(target)}</div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectsClient({ projects }: ProjectsClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionFeedback, setActionFeedback] = useState<{ id: string; message: string; ok: boolean } | null>(null);

    function showFeedback(id: string, message: string, ok: boolean) {
        setActionFeedback({ id, message, ok });
        setTimeout(() => setActionFeedback(null), 3500);
    }

    async function handleStatusChange(projectId: string, newStatus: typeof STATUS_OPTIONS[number]) {
        startTransition(async () => {
            const result = await updateProjectStatus(projectId, newStatus);
            if (!result.success) {
                showFeedback(projectId, result.error || "Failed to update status", false);
            }
        });
    }

    async function handleDelete(projectId: string, projectName: string) {
        if (!window.confirm(`Delete "${projectName}"? This action cannot be undone.`)) return;
        setDeletingId(projectId);
        const result = await deleteProject(projectId);
        setDeletingId(null);
        if (!result.success) {
            showFeedback(projectId, result.error || "Failed to delete project", false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Row */}
            <div className="flex items-center justify-between">
                <div>
                    <h2
                        className="text-xs font-bold tracking-[0.2em] uppercase text-white/50"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Project Investments
                    </h2>
                    <p className="text-white/30 text-xs mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
                </div>
                <button
                    onClick={() => router.push("/admin/projects/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold tracking-[0.12em] uppercase rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-[1.02]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                </button>
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
                <div className="border border-white/[0.06] rounded-2xl p-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="text-white/30 text-sm">No project investments yet.</p>
                    <p className="text-white/20 text-xs mt-1">Create your first project to get started.</p>
                </div>
            )}

            {/* Projects Table */}
            {projects.length > 0 && (
                <div className="border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    {["Project", "Company", "Status", "Funding", "Investors", "Yield", "Actions"].map(h => (
                                        <th
                                            key={h}
                                            className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/30"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {projects.map((project) => (
                                    <tr
                                        key={project._id}
                                        className="hover:bg-white/[0.02] transition-colors duration-150 group"
                                    >
                                        {/* Project Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Brand Color Dot */}
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: project.heroBgColor || '#555' }}
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-white font-medium leading-tight">
                                                            {project.name}
                                                        </span>
                                                        {project.isFeatured && (
                                                            <span className="px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-bold tracking-wider uppercase rounded">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-white/30 font-mono">/projects/{project.slug}</span>
                                                </div>
                                            </div>
                                            {/* Inline feedback */}
                                            {actionFeedback?.id === project._id && (
                                                <p className={`text-[10px] mt-1 ${actionFeedback.ok ? "text-emerald-400" : "text-red-400"}`}>
                                                    {actionFeedback.message}
                                                </p>
                                            )}
                                        </td>

                                        {/* Company */}
                                        <td className="px-5 py-4">
                                            <span className="text-xs text-white/60">
                                                {COMPANY_LABELS[project.company] ?? project.company}
                                            </span>
                                        </td>

                                        {/* Status — inline select */}
                                        <td className="px-5 py-4">
                                            <select
                                                value={project.status}
                                                onChange={(e) => handleStatusChange(project._id, e.target.value as any)}
                                                disabled={isPending}
                                                className={`px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full border cursor-pointer outline-none transition-opacity duration-200 ${STATUS_STYLES[project.status]} disabled:opacity-50`}
                                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s} className="bg-[#0a0a0a] text-white normal-case font-normal">
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Funding Progress */}
                                        <td className="px-5 py-4 min-w-[160px]">
                                            <FundingBar
                                                current={project.currentRaised}
                                                target={project.totalRaiseTarget}
                                            />
                                        </td>

                                        {/* Investors */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-white font-medium">
                                                {project.investorCount.toLocaleString()}
                                            </span>
                                        </td>

                                        {/* Yield */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-emerald-400 font-medium">
                                                {project.expectedYieldLow}%
                                                {project.expectedYieldHigh ? `–${project.expectedYieldHigh}%` : "+"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => router.push(`/admin/projects/${project._id}`)}
                                                    className="px-3 py-1.5 text-[11px] font-medium text-white/70 border border-white/10 rounded-lg hover:border-white/30 hover:text-white transition-all duration-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id, project.name)}
                                                    disabled={deletingId === project._id}
                                                    className="px-3 py-1.5 text-[11px] font-medium text-red-400/70 border border-red-500/10 rounded-lg hover:border-red-500/40 hover:text-red-400 transition-all duration-200 disabled:opacity-40"
                                                >
                                                    {deletingId === project._id ? "…" : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

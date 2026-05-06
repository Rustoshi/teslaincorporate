"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InvestModal from "@/components/projects/InvestModal";
import ProjectStakeCard from "./ProjectStakeCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tranche {
    name: string;
    badge?: string;
    minimumAmount: number;
    maximumAmount?: number | null;
    yieldLow: number;
    yieldHigh?: number | null;
    spotsTotal: number;
    spotsFilled: number;
    isCustomTerms: boolean;
}

interface AvailableProject {
    _id: string;
    name: string;
    company: string;
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    status: "open" | "upcoming";
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    tranches: Tranche[];
}

interface StakeProps {
    stakeId: string;
    trancheName: string;
    yieldLow: number;
    yieldHigh?: number | null;
    investedAmount: number;
    currentValue: number;
    currentPnL: number;
    status: "active" | "matured" | "cancelled";
    investedAt: string;
    maturityDate?: string | null;
    projectSlug: string;
    projectName: string;
    projectCompany: string;
    projectHeroImage: string;
    projectHeroBgColor: string;
    projectStatus: "upcoming" | "open" | "funded" | "closed";
}

interface DashboardProjectsClientProps {
    availableProjects: AvailableProject[];
    stakes: StakeProps[];
    userBalance: number;
    currency: string;
    // Summary stats
    totalInvested: number;
    totalCurrentValue: number;
    totalPnL: number;
    activeCount: number;
}

const COMPANY_LABELS: Record<string, string> = {
    SpaceX:        "SpaceX",
    BoringCompany: "The Boring Company",
    Tesla:         "Tesla",
    Neuralink:     "Neuralink",
    xAI:           "xAI",
    DOGE:          "Dogecoin",
};

function formatShort(n: number): string {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
    return `$${n}`;
}

// ─── Available project card ───────────────────────────────────────────────────

function AvailableProjectCard({
    project,
    userStakeCount,
    onInvest,
    index,
}: {
    project: AvailableProject;
    userStakeCount: number;
    onInvest: (project: AvailableProject) => void;
    index: number;
}) {
    const fillPct = project.totalRaiseTarget > 0
        ? Math.min((project.currentRaised / project.totalRaiseTarget) * 100, 100)
        : 0;

    const spotsLeft = project.tranches.reduce(
        (sum, t) => sum + Math.max(t.spotsTotal - t.spotsFilled, 0),
        0
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
            className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.16] transition-all duration-400 bg-[#080808]"
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden shrink-0">
                {project.heroImage ? (
                    <img
                        src={project.heroImage}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{ background: `linear-gradient(135deg, ${project.heroBgColor}25 0%, #000 100%)` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${project.heroBgColor}50 0%, transparent 55%)` }}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                        className="px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full backdrop-blur-md"
                        style={{
                            backgroundColor: `${project.heroBgColor}25`,
                            color: project.heroBgColor,
                            border: `1px solid ${project.heroBgColor}45`,
                        }}
                    >
                        {COMPANY_LABELS[project.company] ?? project.company}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                    </span>
                </div>

                {/* Already invested badge */}
                {userStakeCount > 0 && (
                    <div className="absolute bottom-3 left-3">
                        <span
                            className="px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] uppercase rounded-full backdrop-blur-md"
                            style={{
                                backgroundColor: `${project.heroBgColor}20`,
                                color: project.heroBgColor,
                                border: `1px solid ${project.heroBgColor}40`,
                            }}
                        >
                            ✓ Already Invested
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 space-y-4">
                <div>
                    <h3
                        className="text-sm font-bold text-white tracking-tight mb-1 leading-snug"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {project.name}
                    </h3>
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{project.tagline}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p
                            className="text-sm font-bold"
                            style={{ color: project.heroBgColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {project.expectedYieldLow}%{project.expectedYieldHigh ? `–${project.expectedYieldHigh}%` : "+"}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Yield</p>
                    </div>
                    <div className="border-x border-white/[0.06]">
                        <p
                            className="text-sm font-bold text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {formatShort(project.tranches[0]?.minimumAmount ?? 1000)}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Min</p>
                    </div>
                    <div>
                        <p
                            className="text-sm font-bold text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {project.investorCount.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Investors</p>
                    </div>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between text-[9px] text-white/25 mb-1.5">
                        <span>{formatShort(project.currentRaised)} raised</span>
                        <span>{fillPct.toFixed(0)}% of {formatShort(project.totalRaiseTarget)}</span>
                    </div>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${fillPct}%`, backgroundColor: project.heroBgColor }}
                        />
                    </div>
                </div>

                {/* Spots left */}
                {spotsLeft > 0 && spotsLeft < 200 && (
                    <p className="text-[10px] text-amber-400/80">
                        Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
                    </p>
                )}

                {/* CTA */}
                <div className="mt-auto pt-3 border-t border-white/[0.05]">
                    <button
                        onClick={() => onInvest(project)}
                        className="w-full py-2.5 rounded-full text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-300 hover:opacity-90"
                        style={{
                            backgroundColor: project.heroBgColor,
                            color: "#000",
                            fontFamily: "var(--font-montserrat), sans-serif",
                        }}
                    >
                        {userStakeCount > 0 ? "Invest More" : "Invest Now"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main client component ────────────────────────────────────────────────────

export default function DashboardProjectsClient({
    availableProjects,
    stakes,
    userBalance,
    currency,
    totalInvested,
    totalCurrentValue,
    totalPnL,
    activeCount,
}: DashboardProjectsClientProps) {
    const [modalProject, setModalProject] = useState<AvailableProject | null>(null);

    // Map projectSlug → number of existing stakes so we can show "Invest More"
    const stakesBySlug = stakes.reduce<Record<string, number>>((acc, s) => {
        acc[s.projectSlug] = (acc[s.projectSlug] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <>
            {/* ── Portfolio summary (only if stakes exist) ─────────────────────── */}
            {stakes.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Invested",   value: `${currency}${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, positive: undefined },
                        { label: "Current Value",    value: `${currency}${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, positive: undefined },
                        { label: "Total P&L",        value: `${totalPnL >= 0 ? "+" : ""}${currency}${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, positive: totalPnL >= 0 },
                        { label: "Active Positions", value: String(activeCount), positive: undefined },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center"
                        >
                            <p
                                className="text-lg font-bold"
                                style={{
                                    color: stat.positive !== undefined
                                        ? (stat.positive ? "#34d399" : "#f87171")
                                        : "white",
                                    fontFamily: "var(--font-montserrat), sans-serif",
                                }}
                            >
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Available projects ───────────────────────────────────────────── */}
            {availableProjects.length > 0 && (
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-px bg-white/20" />
                        <h2
                            className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30"
                        >
                            Open for Investment
                        </h2>
                    </div>
                    <div className={`grid grid-cols-1 gap-6 ${availableProjects.length === 1 ? "sm:grid-cols-1 max-w-sm" : availableProjects.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                        {availableProjects.map((p, i) => (
                            <AvailableProjectCard
                                key={p._id}
                                project={p}
                                userStakeCount={stakesBySlug[p.slug] ?? 0}
                                onInvest={setModalProject}
                                index={i}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── My positions ─────────────────────────────────────────────────── */}
            {stakes.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-px bg-white/20" />
                        <h2
                            className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30"
                        >
                            My Positions
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stakes.map((stake, i) => (
                            <ProjectStakeCard key={stake.stakeId} {...stake} index={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state (no projects AND no stakes) ───────────────────────── */}
            {availableProjects.length === 0 && stakes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
                        <svg className="w-9 h-9 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h2
                        className="text-xl font-bold text-white/25 mb-3"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        No Projects Available
                    </h2>
                    <p className="text-sm text-white/20 max-w-sm leading-relaxed">
                        There are no open investment opportunities at the moment. Check back soon.
                    </p>
                </div>
            )}

            {/* ── Invest modal (shared across all project cards) ────────────────── */}
            {modalProject && (
                <InvestModal
                    isOpen={!!modalProject}
                    onClose={() => setModalProject(null)}
                    projectId={modalProject._id}
                    projectName={modalProject.name}
                    tranches={modalProject.tranches}
                    accentColor={modalProject.heroBgColor}
                    userBalance={userBalance}
                />
            )}
        </>
    );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectStakeCardProps {
    // Stake data
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

    // Project data (populated)
    projectSlug: string;
    projectName: string;
    projectCompany: string;
    projectHeroImage: string;
    projectHeroBgColor: string;
    projectStatus: "upcoming" | "open" | "funded" | "closed";

    index?: number;
}

function formatCurrency(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day:   "numeric",
        year:  "numeric",
    });
}

const STATUS_CONFIG = {
    active:    { label: "Active",    style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
    matured:   { label: "Matured",   style: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
    cancelled: { label: "Cancelled", style: "bg-white/[0.05] text-white/30 border-white/10" },
};

export default function ProjectStakeCard({
    stakeId,
    trancheName,
    yieldLow,
    yieldHigh,
    investedAmount,
    currentValue,
    currentPnL,
    status,
    investedAt,
    maturityDate,
    projectSlug,
    projectName,
    projectCompany,
    projectHeroImage,
    projectHeroBgColor,
    projectStatus,
    index = 0,
}: ProjectStakeCardProps) {
    const statusCfg   = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
    const pnlPositive = currentPnL >= 0;
    const pnlPct      = investedAmount > 0 ? (currentPnL / investedAmount) * 100 : 0;
    const progressPct = investedAmount > 0
        ? Math.min((currentValue / (investedAmount * (1 + (yieldHigh ?? yieldLow) / 100))) * 100, 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
            className="group bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-400"
        >
            <Link href={`/dashboard/projects/${projectSlug}`} className="block">
                {/* ── Top image strip ──────────────────────────────────────── */}
                <div className="relative h-28 overflow-hidden">
                    {projectHeroImage ? (
                        <img
                            src={projectHeroImage}
                            alt={projectName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: `linear-gradient(135deg, ${projectHeroBgColor}30 0%, #000 100%)`,
                            }}
                        />
                    )}

                    {/* Gradient fade to card body */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />

                    {/* Brand glow */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            background: `radial-gradient(ellipse at top right, ${projectHeroBgColor}50 0%, transparent 60%)`,
                        }}
                    />

                    {/* Status badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span
                            className="px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-full backdrop-blur-md"
                            style={{
                                backgroundColor: `${projectHeroBgColor}25`,
                                color: projectHeroBgColor,
                                border: `1px solid ${projectHeroBgColor}40`,
                            }}
                        >
                            {trancheName}
                        </span>
                        <span className={`px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-full border backdrop-blur-md ${statusCfg.style}`}>
                            {statusCfg.label}
                        </span>
                    </div>
                </div>

                {/* ── Card body ─────────────────────────────────────────────── */}
                <div className="p-5 space-y-4">
                    {/* Project name */}
                    <div>
                        <h3
                            className="text-sm font-bold text-white tracking-tight leading-snug mb-0.5"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {projectName}
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">{projectCompany}</p>
                    </div>

                    {/* Key financials */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/[0.03] rounded-lg p-2.5">
                            <p
                                className="text-sm font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {formatCurrency(investedAmount)}
                            </p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Invested</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2.5">
                            <p
                                className="text-sm font-bold"
                                style={{
                                    color: projectHeroBgColor,
                                    fontFamily: "var(--font-montserrat), sans-serif",
                                }}
                            >
                                {formatCurrency(currentValue)}
                            </p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Value</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2.5">
                            <p
                                className={`text-sm font-bold ${pnlPositive ? "text-emerald-400" : "text-red-400"}`}
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {pnlPositive ? "+" : ""}{formatCurrency(currentPnL)}
                            </p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">P&L</p>
                        </div>
                    </div>

                    {/* Progress toward target return */}
                    <div>
                        <div className="flex justify-between text-[9px] text-white/25 mb-1.5">
                            <span>Return progress</span>
                            <span
                                className="font-bold"
                                style={{ color: pnlPositive ? projectHeroBgColor : "rgba(255,255,255,0.3)" }}
                            >
                                {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
                            </span>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: projectHeroBgColor }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: index * 0.07 + 0.3 }}
                            />
                        </div>
                    </div>

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                        <span className="text-[10px] text-white/25">
                            Since {formatDate(investedAt)}
                        </span>
                        <span
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: projectHeroBgColor }}
                        >
                            {yieldLow}%{yieldHigh ? `–${yieldHigh}%` : "+"} yield
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

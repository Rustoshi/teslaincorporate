"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export interface ActiveStakeData {
    stakeId: string;
    projectName: string;
    projectCompany: string;
    projectSlug: string;
    projectHeroBgColor: string;
    trancheName: string;
    investedAmount: string;
    currentValue: string;
    currentPnL: string;
    pnlPositive: boolean;
    yieldRange: string;
    status: "active" | "matured" | "cancelled";
}

interface ProjectInvestmentsProps {
    stakes: ActiveStakeData[];
}

const COMPANY_LABELS: Record<string, string> = {
    SpaceX:        "SpaceX",
    BoringCompany: "The Boring Company",
    Tesla:         "Tesla",
    Neuralink:     "Neuralink",
    xAI:           "xAI",
    DOGE:          "Dogecoin",
};

export default function ProjectInvestments({ stakes }: ProjectInvestmentsProps) {
    const activeStakes = stakes.filter(s => s.status === "active");

    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-lg font-bold tracking-[0.15em] uppercase text-white"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Project Investments
                </h2>
                {activeStakes.length > 0 && (
                    <Link
                        href="/dashboard/projects"
                        className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/30 hover:text-white/70 transition-colors"
                    >
                        View All →
                    </Link>
                )}
            </div>

            {activeStakes.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide mb-2">No Project Positions</h3>
                    <p className="text-sm text-white/40 mb-6 max-w-sm">
                        You haven't invested in any projects yet. Browse open opportunities and secure your position.
                    </p>
                    <Link
                        href="/dashboard/projects"
                        className="px-8 py-3 bg-white text-black text-[11px] font-bold tracking-widest uppercase rounded-full hover:bg-white/90 transition-colors"
                    >
                        Browse Projects
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {activeStakes.map((stake, i) => (
                        <motion.div
                            key={stake.stakeId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 sm:p-6 hover:bg-white/[0.05] hover:border-white/[0.15] transition-colors duration-300 relative overflow-hidden group"
                        >
                            {/* Accent left border */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-60"
                                style={{ backgroundColor: stake.projectHeroBgColor }}
                            />

                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                                {/* Left: project name + company */}
                                <div className="sm:w-1/4 pl-3">
                                    <div className="text-[10px] text-white/30 tracking-widest uppercase mb-1">
                                        {COMPANY_LABELS[stake.projectCompany] ?? stake.projectCompany}
                                    </div>
                                    <div className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                        <span className="line-clamp-1">{stake.projectName}</span>
                                        <span className="relative flex h-2 w-2 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                        </span>
                                    </div>
                                </div>

                                {/* Middle grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                                    <div>
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Invested</div>
                                        <div className="text-sm font-semibold text-white">{stake.investedAmount}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Tier</div>
                                        <div className="text-sm font-semibold text-white">{stake.trancheName}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">P&L</div>
                                        <div
                                            className={`text-sm font-bold ${stake.pnlPositive ? "text-emerald-400" : "text-red-400"}`}
                                        >
                                            {stake.currentPnL}
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex flex-col justify-center">
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Yield</div>
                                        <div
                                            className="text-sm font-bold"
                                            style={{ color: stake.projectHeroBgColor }}
                                        >
                                            {stake.yieldRange}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}

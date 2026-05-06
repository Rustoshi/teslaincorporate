"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectListingCard from "./ProjectListingCard";

type Status = "open" | "upcoming" | "funded" | "closed";

interface Project {
    _id: string;
    name: string;
    company: string;
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    status: Status;
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    closeDate: string;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    minimumInvestment: number;
}

type Filter = "all" | Status;

const FILTERS: { key: Filter; label: string }[] = [
    { key: "all",      label: "All"         },
    { key: "open",     label: "Open"        },
    { key: "upcoming", label: "Coming Soon" },
    { key: "funded",   label: "Funded"      },
    { key: "closed",   label: "Closed"      },
];

interface Props {
    projects: Project[];
}

export default function ProjectsPageClient({ projects }: Props) {
    const [activeFilter, setActiveFilter] = useState<Filter>("all");

    const filtered =
        activeFilter === "all"
            ? projects
            : projects.filter(p => p.status === activeFilter);

    // Only show filters that have at least one matching project, plus "all"
    const availableFilters = FILTERS.filter(
        f => f.key === "all" || projects.some(p => p.status === f.key)
    );

    return (
        <div>
            {/* ── Filter bar ────────────────────────────────────────────────── */}
            {availableFilters.length > 2 && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    {availableFilters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`relative px-4 py-2 text-[11px] font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-200 ${
                                activeFilter === f.key
                                    ? "text-black"
                                    : "text-white/40 border border-white/[0.08] hover:border-white/20 hover:text-white/65"
                            }`}
                        >
                            {activeFilter === f.key && (
                                <motion.span
                                    layoutId="filter-pill"
                                    className="absolute inset-0 rounded-full bg-white"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{f.label}</span>
                            {/* Count badge */}
                            <span
                                className={`relative z-10 ml-1.5 text-[9px] ${
                                    activeFilter === f.key ? "text-black/50" : "text-white/20"
                                }`}
                            >
                                {f.key === "all"
                                    ? projects.length
                                    : projects.filter(p => p.status === f.key).length}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Project grid ──────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((p, i) => (
                            <ProjectListingCard
                                key={p._id}
                                {...p}
                                index={i}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
                            <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <p
                            className="text-lg font-bold text-white/30 mb-2"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            No Projects Found
                        </p>
                        <p className="text-sm text-white/20">
                            {activeFilter === "all"
                                ? "New opportunities will be listed here when available."
                                : `No ${activeFilter} projects at this time.`}
                        </p>
                        {activeFilter !== "all" && (
                            <button
                                onClick={() => setActiveFilter("all")}
                                className="mt-5 px-5 py-2 text-[11px] font-bold tracking-[0.12em] uppercase text-white/50 border border-white/[0.12] rounded-full hover:border-white/25 hover:text-white/75 transition-all duration-200"
                            >
                                View All
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Regulatory footer ─────────────────────────────────────────── */}
            {filtered.length > 0 && (
                <p className="mt-16 text-[11px] text-white/15 text-center max-w-2xl mx-auto leading-relaxed">
                    All investment opportunities involve risk, including the possible loss of principal. Past performance does not guarantee future returns.
                    Projected yields are estimates only and are not guaranteed. Tesla Inc is not a registered broker-dealer or investment adviser.
                </p>
            )}
        </div>
    );
}

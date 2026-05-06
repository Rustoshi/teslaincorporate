"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProjectHero from "./ProjectHero";
import ProjectTranchePicker from "./ProjectTranchePicker";
import ProjectCalculator from "./ProjectCalculator";
import ProjectMilestones from "./ProjectMilestones";
import InvestModal from "./InvestModal";

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

interface Milestone {
    title: string;
    description?: string;
    targetDate: string;
    completed: boolean;
    completedAt?: string;
}

interface Document {
    label: string;
    url: string;
}

interface Project {
    _id: string;
    name: string;
    company: string;
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    description: string;
    highlights: string[];
    status: "upcoming" | "open" | "funded" | "closed";
    riskLevel: "medium" | "high" | "very_high";
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    launchDate: string;
    closeDate: string;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    yieldType: string;
    yieldCycle?: string | null;
    tranches: Tranche[];
    milestones: Milestone[];
    documents: Document[];
}

// ─── Risk badge config ────────────────────────────────────────────────────────

const RISK_CONFIG = {
    medium:    { label: "Medium Risk",    style: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
    high:      { label: "High Risk",      style: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
    very_high: { label: "Very High Risk", style: "bg-red-500/15 text-red-400 border-red-500/30" },
};

const YIELD_TYPE_LABELS: Record<string, string> = {
    annual_percent: "Annual Return",
    on_exit:        "On Exit",
    per_cycle:      "Per Cycle",
};

// ─── Section fade-in wrapper ──────────────────────────────────────────────────

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref  = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ label, title }: { label: string; title: string }) {
    return (
        <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30 mb-2">{label}</p>
            <h2
                className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {title}
            </h2>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectDetailClient({ project }: { project: Project }) {
    const [modalOpen,        setModalOpen]        = useState(false);
    const [selectedTranche,  setSelectedTranche]  = useState<string | null>(
        project.tranches[0]?.name ?? null
    );

    const { data: session } = useSession();
    const router = useRouter();

    const riskCfg    = RISK_CONFIG[project.riskLevel] ?? RISK_CONFIG.high;
    const canInvest  = project.status === "open";

    function handleInvestClick() {
        if (!session) {
            router.push(`/invest/login?callbackUrl=/projects/${project.slug}`);
            return;
        }
        setModalOpen(true);
    }

    const minimumInvestment = project.tranches[0]?.minimumAmount ?? 1000;

    return (
        <>
            {/* ── Full-bleed Hero ──────────────────────────────────────────── */}
            <ProjectHero
                name={project.name}
                company={project.company}
                tagline={project.tagline}
                heroImage={project.heroImage}
                heroBgColor={project.heroBgColor}
                status={project.status}
                totalRaiseTarget={project.totalRaiseTarget}
                currentRaised={project.currentRaised}
                investorCount={project.investorCount}
                closeDate={project.closeDate}
                expectedYieldLow={project.expectedYieldLow}
                expectedYieldHigh={project.expectedYieldHigh}
                minimumInvestment={minimumInvestment}
                onInvestClick={handleInvestClick}
            />

            {/* ── Page body ────────────────────────────────────────────────── */}
            <div className="bg-black">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 space-y-24">

                    {/* ── Opportunity Overview ─────────────────────────────── */}
                    <FadeSection>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                            {/* Left: description + highlights */}
                            <div>
                                <SectionHeading label="The Opportunity" title="Why This Project" />

                                {project.description && (
                                    <p className="text-white/55 leading-relaxed text-sm sm:text-base mb-8 whitespace-pre-line">
                                        {project.description}
                                    </p>
                                )}

                                {project.highlights.length > 0 && (
                                    <ul className="space-y-3">
                                        {project.highlights.map((h, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -12 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                                className="flex items-start gap-3"
                                            >
                                                <span
                                                    className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                                                    style={{ backgroundColor: project.heroBgColor }}
                                                />
                                                <span className="text-sm text-white/65 leading-relaxed">{h}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Right: key metrics panel */}
                            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 space-y-5">
                                <p
                                    className="text-xs font-bold tracking-[0.18em] uppercase text-white/30"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Project Metrics
                                </p>

                                <div className="space-y-4">
                                    {[
                                        {
                                            label: "Projected Yield",
                                            value: `${project.expectedYieldLow}%${project.expectedYieldHigh ? `–${project.expectedYieldHigh}%` : "+"}`,
                                            accent: true,
                                        },
                                        {
                                            label: "Yield Type",
                                            value: YIELD_TYPE_LABELS[project.yieldType] ?? project.yieldType,
                                        },
                                        {
                                            label: "Raise Target",
                                            value: (() => {
                                                const n = project.totalRaiseTarget;
                                                if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
                                                if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
                                                return `$${n.toLocaleString()}`;
                                            })(),
                                        },
                                        {
                                            label: "Minimum Entry",
                                            value: `$${minimumInvestment.toLocaleString()}`,
                                        },
                                        {
                                            label: "Active Investors",
                                            value: project.investorCount.toLocaleString(),
                                        },
                                        {
                                            label: "Risk Profile",
                                            value: riskCfg.label,
                                            badge: riskCfg.style,
                                        },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                                            <span className="text-xs text-white/35">{row.label}</span>
                                            {row.badge ? (
                                                <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${row.badge}`}>
                                                    {row.value}
                                                </span>
                                            ) : (
                                                <span
                                                    className="text-sm font-bold"
                                                    style={{
                                                        color: row.accent ? project.heroBgColor : "white",
                                                        fontFamily: "var(--font-montserrat), sans-serif",
                                                    }}
                                                >
                                                    {row.value}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {canInvest && (
                                    <button
                                        onClick={handleInvestClick}
                                        className="w-full mt-2 py-3.5 text-sm font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:scale-[1.02] hover:opacity-90 text-black"
                                        style={{
                                            backgroundColor: project.heroBgColor,
                                            boxShadow: `0 0 24px ${project.heroBgColor}35`,
                                            fontFamily: "var(--font-montserrat), sans-serif",
                                        }}
                                    >
                                        Invest Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </FadeSection>

                    {/* ── Investment Tiers ─────────────────────────────────── */}
                    {project.tranches.length > 0 && (
                        <FadeSection>
                            <SectionHeading label="Investment Tiers" title="Choose Your Entry Point" />
                            <ProjectTranchePicker
                                tranches={project.tranches}
                                selectedTranche={selectedTranche}
                                onSelect={setSelectedTranche}
                                accentColor={project.heroBgColor}
                            />
                        </FadeSection>
                    )}

                    {/* ── Calculator + Milestones (2-col on desktop) ───────── */}
                    <FadeSection>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Calculator */}
                            <div>
                                <SectionHeading label="Returns" title="Calculate Your Investment" />
                                <ProjectCalculator
                                    tranches={project.tranches}
                                    selectedTranche={selectedTranche}
                                    onSelectTranche={setSelectedTranche as (name: string) => void}
                                    accentColor={project.heroBgColor}
                                />
                            </div>

                            {/* Milestones */}
                            {project.milestones.length > 0 && (
                                <div>
                                    <SectionHeading label="Timeline" title="Project Milestones" />
                                    <ProjectMilestones
                                        milestones={project.milestones}
                                        accentColor={project.heroBgColor}
                                    />
                                </div>
                            )}
                        </div>
                    </FadeSection>

                    {/* ── Documents ────────────────────────────────────────── */}
                    {project.documents.length > 0 && (
                        <FadeSection>
                            <SectionHeading label="Due Diligence" title="Project Documents" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.documents.map((doc, i) => (
                                    <motion.a
                                        key={i}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.07 }}
                                        className="group flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                                    >
                                        {/* PDF icon */}
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${project.heroBgColor}18` }}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                style={{ color: project.heroBgColor }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                                                {doc.label}
                                            </p>
                                            <p className="text-[10px] text-white/30 mt-0.5">View Document →</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </FadeSection>
                    )}

                    {/* ── Bottom CTA banner ────────────────────────────────── */}
                    {canInvest && (
                        <FadeSection>
                            <div
                                className="relative overflow-hidden rounded-2xl p-10 text-center"
                                style={{
                                    background: `linear-gradient(135deg, ${project.heroBgColor}15 0%, transparent 60%)`,
                                    border: `1px solid ${project.heroBgColor}25`,
                                }}
                            >
                                {/* Glow blob */}
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full blur-[80px] opacity-20 pointer-events-none"
                                    style={{ backgroundColor: project.heroBgColor }}
                                />

                                <p
                                    className="relative text-[10px] font-bold tracking-[0.28em] uppercase mb-3"
                                    style={{ color: project.heroBgColor }}
                                >
                                    Limited Availability
                                </p>
                                <h3
                                    className="relative text-3xl sm:text-4xl font-black text-white tracking-tight mb-3"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Secure Your Position
                                </h3>
                                <p className="relative text-sm text-white/40 max-w-md mx-auto mb-8">
                                    Spots across all tiers are limited. Once filled, this offering closes regardless of the deadline.
                                </p>
                                <button
                                    onClick={handleInvestClick}
                                    className="relative inline-block px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase rounded-full text-black transition-all duration-300 hover:scale-[1.03] hover:opacity-90"
                                    style={{
                                        backgroundColor: project.heroBgColor,
                                        boxShadow: `0 0 40px ${project.heroBgColor}40`,
                                        fontFamily: "var(--font-montserrat), sans-serif",
                                    }}
                                >
                                    Invest Now
                                </button>
                            </div>
                        </FadeSection>
                    )}

                    {/* ── Legal disclaimer ─────────────────────────────────── */}
                    <p className="text-[11px] text-white/15 text-center max-w-3xl mx-auto leading-relaxed pb-4">
                        This is not an offer to sell or a solicitation of an offer to buy securities. Investment in private market opportunities involves significant risk, including the potential loss of your entire investment.
                        All projected yields are estimates based on current models and are not guaranteed. Past performance does not indicate future results.
                        Please review all project documents carefully before investing.
                    </p>
                </div>
            </div>

            {/* ── Invest Modal ─────────────────────────────────────────────── */}
            <InvestModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                projectId={project._id}
                projectName={project.name}
                tranches={project.tranches}
                accentColor={project.heroBgColor}
                preselectedTranche={selectedTranche}
            />
        </>
    );
}

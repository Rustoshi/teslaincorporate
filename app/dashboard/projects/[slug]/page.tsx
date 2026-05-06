import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ProjectStake from "@/models/ProjectStake";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectFundingBar from "@/components/projects/ProjectFundingBar";
import ProjectMilestones from "@/components/projects/ProjectMilestones";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

function formatCurrency(n: number): string {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateVal: any): string {
    const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function DashboardProjectStakePage({ params }: Props) {
    const { slug } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/invest/login");

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select("_id").lean() as any;
    if (!user) redirect("/invest/login");

    // Find the project by slug
    const project = await ProjectInvestment.findOne({ slug, isActive: true }).lean() as any;
    if (!project) notFound();

    // Find user's stake in this project
    const stake = await ProjectStake.findOne({
        userId:    user._id,
        projectId: project._id,
    }).lean() as any;

    if (!stake) notFound();

    const pnlPositive = stake.currentPnL >= 0;
    const pnlPct      = stake.investedAmount > 0
        ? ((stake.currentPnL / stake.investedAmount) * 100).toFixed(2)
        : "0.00";

    // Serialize milestones
    const milestones = (project.milestones || []).map((m: any) => ({
        title:       m.title,
        description: m.description ?? null,
        targetDate:  m.targetDate instanceof Date ? m.targetDate.toISOString() : String(m.targetDate),
        completed:   m.completed,
        completedAt: m.completedAt ? (m.completedAt instanceof Date ? m.completedAt.toISOString() : String(m.completedAt)) : null,
    }));

    const closeDate = project.closeDate instanceof Date
        ? project.closeDate.toISOString()
        : String(project.closeDate);

    return (
        <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto">

            {/* ── Back nav ──────────────────────────────────────────────────── */}
            <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-2 text-[11px] text-white/35 hover:text-white/65 transition-colors mb-8 group"
            >
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to My Projects
            </Link>

            {/* ── Hero strip ────────────────────────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden mb-8 h-44 sm:h-56">
                {project.heroImage ? (
                    <img src={project.heroImage} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{ background: `linear-gradient(135deg, ${project.heroBgColor}25 0%, #000 100%)` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 70% 40%, ${project.heroBgColor}20 0%, transparent 55%)` }}
                />

                <div className="absolute bottom-0 left-0 p-6">
                    <div
                        className="inline-block mb-2 px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase rounded-full"
                        style={{
                            backgroundColor: `${project.heroBgColor}20`,
                            color: project.heroBgColor,
                            border: `1px solid ${project.heroBgColor}40`,
                        }}
                    >
                        {stake.trancheName} Tier
                    </div>
                    <h1
                        className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {project.name}
                    </h1>
                </div>
            </div>

            {/* ── Main layout ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Left: financials ────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* P&L card */}
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: `linear-gradient(135deg, ${project.heroBgColor}10 0%, transparent 60%)`,
                            border: `1px solid ${project.heroBgColor}20`,
                        }}
                    >
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4">
                            Position Overview
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-[10px] text-white/35 mb-1">Invested</p>
                                <p
                                    className="text-xl font-bold text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {formatCurrency(stake.investedAmount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/35 mb-1">Current Value</p>
                                <p
                                    className="text-xl font-bold"
                                    style={{ color: project.heroBgColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {formatCurrency(stake.currentValue)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/35 mb-1">Profit / Loss</p>
                                <p
                                    className={`text-xl font-bold ${pnlPositive ? "text-emerald-400" : "text-red-400"}`}
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {pnlPositive ? "+" : ""}{formatCurrency(stake.currentPnL)}
                                </p>
                                <p className={`text-[10px] mt-0.5 ${pnlPositive ? "text-emerald-400/60" : "text-red-400/60"}`}>
                                    {pnlPositive ? "+" : ""}{pnlPct}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stake details table */}
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4">
                            Investment Details
                        </p>
                        <div className="space-y-3">
                            {[
                                { label: "Investment Tier",   value: stake.trancheName },
                                { label: "Projected Yield",   value: `${stake.yieldLow}%${stake.yieldHigh ? `–${stake.yieldHigh}%` : "+"}` },
                                { label: "Status",            value: stake.status.charAt(0).toUpperCase() + stake.status.slice(1) },
                                { label: "Invested On",       value: formatDate(stake.investedAt) },
                                ...(stake.maturityDate ? [{ label: "Maturity Date", value: formatDate(stake.maturityDate) }] : []),
                                { label: "Company",           value: project.company },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                    <span className="text-xs text-white/35">{row.label}</span>
                                    <span
                                        className="text-xs font-semibold text-white"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project milestones */}
                    {milestones.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-6">
                                Project Timeline
                            </p>
                            <ProjectMilestones
                                milestones={milestones}
                                accentColor={project.heroBgColor}
                            />
                        </div>
                    )}
                </div>

                {/* ── Right: project info + funding ───────────────────────── */}
                <div className="space-y-5">

                    {/* Funding progress */}
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4">
                            Round Progress
                        </p>
                        <ProjectFundingBar
                            currentRaised={project.currentRaised}
                            totalRaiseTarget={project.totalRaiseTarget}
                            closeDate={closeDate}
                            investorCount={project.investorCount}
                            accentColor={project.heroBgColor}
                            compact={false}
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-2">
                            Actions
                        </p>
                        <Link
                            href={`/projects/${project.slug}`}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200 text-sm text-white/60 hover:text-white/90"
                        >
                            <span>View Project Page</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </Link>
                        <Link
                            href="/dashboard/projects"
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200 text-sm text-white/60 hover:text-white/90"
                        >
                            <span>All My Projects</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-white/15 leading-relaxed px-1">
                        Investment value and projected returns are estimates. Current value is updated by portfolio administrators after yield events.
                        Past performance does not guarantee future returns.
                    </p>
                </div>
            </div>
        </div>
    );
}

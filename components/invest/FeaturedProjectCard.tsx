"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FeaturedProject {
    _id: string;
    name: string;
    company: string;
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    status: "upcoming" | "open" | "funded" | "closed";
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    minimumInvestment: number;
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

export default function FeaturedProjectCard({ p, index }: { p: FeaturedProject; index: number }) {
    const { data: session } = useSession();
    const router = useRouter();

    const fillPct = p.totalRaiseTarget > 0
        ? Math.min((p.currentRaised / p.totalRaiseTarget) * 100, 100)
        : 0;

    function handleInvestClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (!session) {
            router.push(`/invest/login?callbackUrl=/projects/${p.slug}`);
        } else {
            router.push("/dashboard");
        }
    }

    function handleCardClick() {
        router.push(`/projects/${p.slug}`);
    }

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.18] transition-all duration-500 bg-[#080808] cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                {p.heroImage ? (
                    <img
                        src={p.heroImage}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{ background: `linear-gradient(135deg, ${p.heroBgColor}25 0%, #000 100%)` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
                <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${p.heroBgColor}50 0%, transparent 55%)` }}
                />

                {/* Top badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span
                        className="px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full backdrop-blur-md"
                        style={{
                            backgroundColor: `${p.heroBgColor}25`,
                            color: p.heroBgColor,
                            border: `1px solid ${p.heroBgColor}45`,
                        }}
                    >
                        {COMPANY_LABELS[p.company] ?? p.company}
                    </span>
                    {p.status === "open" && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </span>
                    )}
                    {p.status === "upcoming" && (
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                            Coming Soon
                        </span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 space-y-4">
                <div>
                    <h3
                        className="text-base font-bold text-white tracking-tight mb-1 leading-snug"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {p.name}
                    </h3>
                    <p className="text-xs text-white/45 leading-relaxed line-clamp-2">{p.tagline}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p
                            className="text-sm font-bold"
                            style={{ color: p.heroBgColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {p.expectedYieldLow}%{p.expectedYieldHigh ? `–${p.expectedYieldHigh}%` : "+"}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Yield</p>
                    </div>
                    <div className="border-x border-white/[0.06]">
                        <p
                            className="text-sm font-bold text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            ${p.minimumInvestment.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Min</p>
                    </div>
                    <div>
                        <p
                            className="text-sm font-bold text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {p.investorCount.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Investors</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="flex justify-between text-[9px] text-white/25 mb-1.5">
                        <span>{formatShort(p.currentRaised)} raised</span>
                        <span>{fillPct.toFixed(0)}% of {formatShort(p.totalRaiseTarget)}</span>
                    </div>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${fillPct}%`, backgroundColor: p.heroBgColor }}
                        />
                    </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] mt-auto">
                    <span className="text-[10px] text-white/30">
                        {p.status === "open" ? "View investment details" : "Get notified at launch"}
                    </span>
                    {p.status === "open" ? (
                        <button
                            onClick={handleInvestClick}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-2"
                            style={{ color: p.heroBgColor }}
                        >
                            Invest Now
                            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                            Learn More
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

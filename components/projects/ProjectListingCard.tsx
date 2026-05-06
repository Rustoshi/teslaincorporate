"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProjectFundingBar from "./ProjectFundingBar";

interface ProjectListingCardProps {
    _id: string;
    name: string;
    company: string;
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    status: 'upcoming' | 'open' | 'funded' | 'closed';
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    closeDate: string;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    minimumInvestment: number;
    index?: number;
}

const COMPANY_LABELS: Record<string, string> = {
    SpaceX:        "SpaceX",
    BoringCompany: "The Boring Company",
    Tesla:         "Tesla",
    Neuralink:     "Neuralink",
    xAI:           "xAI",
    DOGE:          "Dogecoin",
};

const STATUS_CONFIG = {
    open:     { label: "Open",          style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
    upcoming: { label: "Coming Soon",   style: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
    funded:   { label: "Fully Funded",  style: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
    closed:   { label: "Closed",        style: "bg-white/10 text-white/40 border-white/10" },
};

function formatMin(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
}

export default function ProjectListingCard({
    name,
    company,
    slug,
    tagline,
    heroImage,
    heroBgColor,
    status,
    totalRaiseTarget,
    currentRaised,
    investorCount,
    closeDate,
    expectedYieldLow,
    expectedYieldHigh,
    minimumInvestment,
    index = 0,
}: ProjectListingCardProps) {
    const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.closed;
    const canInvest  = status === "open";

    const { data: session } = useSession();
    const router = useRouter();

    function handleInvestClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!session) {
            router.push(`/invest/login?callbackUrl=/projects/${slug}`);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="group relative rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.15] transition-all duration-500"
        >
            <Link href={`/projects/${slug}`} className="block">
                {/* Background image + gradient overlay */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                    {heroImage ? (
                        <img
                            src={heroImage}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: `linear-gradient(135deg, ${heroBgColor}33 0%, #000000 100%)`,
                            }}
                        />
                    )}
                    {/* Multi-layer gradient overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: `radial-gradient(circle at top right, ${heroBgColor}60 0%, transparent 60%)`,
                        }}
                    />

                    {/* Top meta row */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        {/* Company badge */}
                        <span
                            className="px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full backdrop-blur-md"
                            style={{
                                backgroundColor: `${heroBgColor}30`,
                                color: heroBgColor,
                                border: `1px solid ${heroBgColor}50`,
                            }}
                        >
                            {COMPANY_LABELS[company] ?? company}
                        </span>

                        {/* Status pill */}
                        <span className={`px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full border backdrop-blur-md ${statusCfg.style}`}>
                            {statusCfg.label}
                        </span>
                    </div>

                    {/* Bottom of image: title + tagline */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3
                            className="text-xl font-bold text-white tracking-tight mb-1 leading-tight"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {name}
                        </h3>
                        <p className="text-xs text-white/55 leading-relaxed line-clamp-2">{tagline}</p>
                    </div>
                </div>

                {/* Card body */}
                <div className="bg-[#0a0a0a] p-5 space-y-5">
                    {/* Key stats row */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <p
                                className="text-base font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {expectedYieldLow}%{expectedYieldHigh ? `–${expectedYieldHigh}%` : "+"}
                            </p>
                            <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Yield</p>
                        </div>
                        <div className="border-x border-white/[0.06]">
                            <p
                                className="text-base font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {formatMin(minimumInvestment)}
                            </p>
                            <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Minimum</p>
                        </div>
                        <div>
                            <p
                                className="text-base font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {investorCount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Investors</p>
                        </div>
                    </div>

                    {/* Funding bar */}
                    <ProjectFundingBar
                        currentRaised={currentRaised}
                        totalRaiseTarget={totalRaiseTarget}
                        closeDate={closeDate}
                        investorCount={investorCount}
                        accentColor={heroBgColor}
                        compact
                    />

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <span className="text-[11px] text-white/35">
                            {canInvest ? "View investment details" : status === "upcoming" ? "Get notified at launch" : "View project"}
                        </span>
                        {canInvest ? (
                            <button
                                onClick={handleInvestClick}
                                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-2.5"
                                style={{ color: heroBgColor }}
                            >
                                Invest Now
                                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <div
                                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-2.5"
                                style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                                Learn More
                                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

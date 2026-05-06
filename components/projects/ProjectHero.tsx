"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProjectFundingBar from "./ProjectFundingBar";

interface ProjectHeroProps {
    name: string;
    company: string;
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
    onInvestClick: () => void;
}

const COMPANY_LABELS: Record<string, string> = {
    SpaceX:        "SpaceX",
    BoringCompany: "The Boring Company",
    Tesla:         "Tesla",
    Neuralink:     "Neuralink",
    xAI:           "xAI",
    DOGE:          "Dogecoin",
};

function getDaysRemaining(closeDate: string): number {
    const now   = new Date();
    const close = new Date(closeDate);
    const diff  = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

// Live animated counter
function AnimatedCounter({ target, prefix = "" }: { target: number; prefix?: string }) {
    const [value, setValue] = useState(0);
    const ref = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const duration = 1400;
        const steps    = 60;
        const step     = target / steps;
        let current    = 0;

        ref.current = setInterval(() => {
            current += step;
            if (current >= target) {
                setValue(target);
                if (ref.current) clearInterval(ref.current);
            } else {
                setValue(Math.floor(current));
            }
        }, duration / steps);

        return () => { if (ref.current) clearInterval(ref.current); };
    }, [target]);

    return <>{prefix}{value.toLocaleString()}</>;
}

export default function ProjectHero({
    name,
    company,
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
    onInvestClick,
}: ProjectHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

    // Parallax effect on background image
    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    const daysLeft    = getDaysRemaining(closeDate);
    const canInvest   = status === "open";

    const formatCurrencyShort = (n: number): string => {
        if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
        if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
        return `$${n}`;
    };

    return (
        <div ref={containerRef} className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden">

            {/* ── Background Image (Parallax) ───────────────────────────────── */}
            <motion.div
                className="absolute inset-0 w-full h-[115%] -top-[7.5%]"
                style={{ y: imageY }}
            >
                {heroImage ? (
                    <img
                        src={heroImage}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{
                            background: `linear-gradient(135deg, ${heroBgColor}40 0%, #000 100%)`,
                        }}
                    />
                )}
            </motion.div>

            {/* ── Gradient Overlays ─────────────────────────────────────────── */}
            {/* Bottom-heavy vignette for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            {/* Left edge fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
            {/* Brand color radial glow (top-right) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 75% 20%, ${heroBgColor}25 0%, transparent 55%)`,
                }}
            />

            {/* ── Content ───────────────────────────────────────────────────── */}
            <motion.div
                className="relative z-10 h-full flex flex-col lg:flex-row items-end lg:items-center justify-end lg:justify-between px-6 sm:px-10 lg:px-16 pb-12 lg:pb-0 gap-6 lg:gap-12"
                style={{ opacity }}
            >
                {/* Left column: project identity */}
                <motion.div
                    style={{ y: textY }}
                    className="flex-1 max-w-2xl"
                >
                    {/* Company badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center gap-3 mb-5"
                    >
                        <span
                            className="px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border backdrop-blur-sm"
                            style={{
                                color: heroBgColor,
                                borderColor: `${heroBgColor}50`,
                                backgroundColor: `${heroBgColor}18`,
                            }}
                        >
                            {COMPANY_LABELS[company] ?? company}
                        </span>
                        {status !== "open" && (
                            <span className="px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border backdrop-blur-sm bg-white/10 text-white/50 border-white/15">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        )}
                    </motion.div>

                    {/* Project name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-4"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {name}
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="text-base sm:text-lg text-white/55 leading-relaxed max-w-lg"
                    >
                        {tagline}
                    </motion.p>

                    {/* Yield + minimum — quick stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex items-center gap-6 mt-7"
                    >
                        <div>
                            <p
                                className="text-2xl font-bold tracking-tight"
                                style={{ color: heroBgColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {expectedYieldLow}%{expectedYieldHigh ? `–${expectedYieldHigh}%` : "+"}
                            </p>
                            <p className="text-[11px] text-white/35 uppercase tracking-wider mt-0.5">Expected Yield</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <p
                                className="text-2xl font-bold text-white tracking-tight"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                ${minimumInvestment.toLocaleString()}
                            </p>
                            <p className="text-[11px] text-white/35 uppercase tracking-wider mt-0.5">Min. Investment</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right column: floating stats panel */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="w-full lg:w-[340px] shrink-0"
                >
                    <div className="bg-black/70 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 space-y-5">
                        {/* Live stats */}
                        <div className="grid grid-cols-3 gap-3 text-center border-b border-white/[0.06] pb-5">
                            <div>
                                <p
                                    className="text-lg font-bold text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {formatCurrencyShort(currentRaised)}
                                </p>
                                <p className="text-[9px] text-white/35 uppercase tracking-wider mt-0.5">Raised</p>
                            </div>
                            <div>
                                <p
                                    className="text-lg font-bold text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    <AnimatedCounter target={investorCount} />
                                </p>
                                <p className="text-[9px] text-white/35 uppercase tracking-wider mt-0.5">Investors</p>
                            </div>
                            <div>
                                <p
                                    className="text-lg font-bold tracking-tight"
                                    style={{
                                        color: daysLeft <= 7 ? "#ef4444" : daysLeft <= 30 ? "#f59e0b" : "white",
                                        fontFamily: "var(--font-montserrat), sans-serif",
                                    }}
                                >
                                    {daysLeft > 0 ? `${daysLeft}d` : "—"}
                                </p>
                                <p className="text-[9px] text-white/35 uppercase tracking-wider mt-0.5">Days Left</p>
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

                        {/* CTA button */}
                        {canInvest ? (
                            <button
                                onClick={onInvestClick}
                                className="w-full py-3.5 text-sm font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:scale-[1.02] hover:opacity-90 text-black shadow-lg"
                                style={{
                                    backgroundColor: heroBgColor,
                                    boxShadow: `0 0 24px ${heroBgColor}40`,
                                    fontFamily: "var(--font-montserrat), sans-serif",
                                }}
                            >
                                Invest Now
                            </button>
                        ) : (
                            <div className="w-full py-3.5 text-center text-sm font-bold tracking-[0.1em] uppercase rounded-full border border-white/15 text-white/40">
                                {status === "upcoming" ? "Launching Soon" : status === "funded" ? "Fully Funded" : "Closed"}
                            </div>
                        )}

                        <p className="text-[10px] text-white/25 text-center">
                            Min. investment: ${minimumInvestment.toLocaleString()} · Goal: {formatCurrencyShort(totalRaiseTarget)}
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* ── Scroll indicator ──────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{ opacity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[9px] text-white/25 uppercase tracking-[0.25em]">Scroll to explore</span>
                <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
            </motion.div>
        </div>
    );
}

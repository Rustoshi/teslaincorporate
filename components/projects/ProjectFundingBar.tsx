"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface ProjectFundingBarProps {
    currentRaised: number;
    totalRaiseTarget: number;
    closeDate: string;         // ISO date string
    investorCount: number;
    accentColor?: string;      // Brand hex — defaults to white
    compact?: boolean;         // Compact mode for listing cards
}

function formatCurrency(n: number): string {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
}

function getDaysRemaining(closeDate: string): number {
    const now = new Date();
    const close = new Date(closeDate);
    const diff = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function getUrgencyColor(daysLeft: number, pct: number): string {
    if (pct >= 90 || daysLeft <= 7)  return "#ef4444"; // red — critical urgency
    if (pct >= 65 || daysLeft <= 30) return "#f59e0b"; // amber — approaching
    return "#22c55e";                                    // green — healthy
}

export default function ProjectFundingBar({
    currentRaised,
    totalRaiseTarget,
    closeDate,
    investorCount,
    accentColor,
    compact = false,
}: ProjectFundingBarProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [animatedPct, setAnimatedPct] = useState(0);

    const rawPct = totalRaiseTarget > 0
        ? Math.min(100, (currentRaised / totalRaiseTarget) * 100)
        : 0;

    const daysLeft    = getDaysRemaining(closeDate);
    const barColor    = accentColor || getUrgencyColor(daysLeft, rawPct);

    // Animate bar fill when in view
    useEffect(() => {
        if (!isInView) return;
        const timeout = setTimeout(() => setAnimatedPct(rawPct), 120);
        return () => clearTimeout(timeout);
    }, [isInView, rawPct]);

    if (compact) {
        return (
            <div ref={ref} className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-white">
                        {formatCurrency(currentRaised)} raised
                    </span>
                    <span className="text-[11px] text-white/40">
                        {rawPct.toFixed(1)}%
                    </span>
                </div>
                <div className="h-1 w-full bg-white/[0.1] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animatedPct}%`, backgroundColor: barColor }}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/30">of {formatCurrency(totalRaiseTarget)}</span>
                    <span className="text-[10px] text-white/30">{daysLeft}d left</span>
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {formatCurrency(currentRaised)}
                    </motion.p>
                    <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-wider">Raised</p>
                </div>
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {investorCount.toLocaleString()}
                    </motion.p>
                    <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-wider">Investors</p>
                </div>
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl font-bold tracking-tight"
                        style={{
                            color: daysLeft <= 7 ? "#ef4444" : daysLeft <= 30 ? "#f59e0b" : "white",
                            fontFamily: "var(--font-montserrat), sans-serif",
                        }}
                    >
                        {daysLeft > 0 ? `${daysLeft}d` : "Closed"}
                    </motion.p>
                    <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-wider">Remaining</p>
                </div>
            </div>

            {/* Progress Bar Track */}
            <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1200 ease-out"
                        style={{
                            width: `${animatedPct}%`,
                            backgroundColor: barColor,
                            boxShadow: `0 0 8px ${barColor}60`,
                            transitionDuration: "1.2s",
                        }}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] text-white/30">
                        {rawPct.toFixed(1)}% of {formatCurrency(totalRaiseTarget)} goal
                    </span>
                    {daysLeft <= 7 && daysLeft > 0 && (
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider animate-pulse">
                            Closing Soon
                        </span>
                    )}
                    {daysLeft === 0 && (
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">Closed</span>
                    )}
                </div>
            </div>
        </div>
    );
}

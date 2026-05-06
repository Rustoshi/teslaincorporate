"use client";

import { motion } from "framer-motion";

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

interface ProjectTranchePickerProps {
    tranches: Tranche[];
    selectedTranche: string | null;
    onSelect: (trancheName: string) => void;
    accentColor?: string;
}

function formatAmount(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
}

const TIER_GRADIENTS = [
    "from-slate-600/20 to-slate-700/10",
    "from-blue-600/20 to-blue-700/10",
    "from-amber-500/20 to-amber-600/10",
];

const TIER_BORDER_ACTIVE = [
    "border-slate-400/60",
    "border-blue-400/60",
    "border-amber-400/60",
];

const TIER_BORDER_IDLE = [
    "border-white/[0.07]",
    "border-white/[0.07]",
    "border-white/[0.07]",
];

const TIER_GLOW = [
    "shadow-[0_0_24px_rgba(148,163,184,0.08)]",
    "shadow-[0_0_24px_rgba(59,130,246,0.12)]",
    "shadow-[0_0_24px_rgba(245,158,11,0.12)]",
];

const TIER_ACCENT = ["#94a3b8", "#3b82f6", "#f59e0b"];

const TIER_BADGE_STYLE = [
    "bg-slate-500/20 text-slate-400 border-slate-500/30",
    "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "bg-amber-500/20 text-amber-400 border-amber-500/30",
];

export default function ProjectTranchePicker({
    tranches,
    selectedTranche,
    onSelect,
    accentColor,
}: ProjectTranchePickerProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tranches.map((tranche, i) => {
                const isSelected   = selectedTranche === tranche.name;
                const spotsLeft    = tranche.spotsTotal - tranche.spotsFilled;
                const isSoldOut    = spotsLeft <= 0;
                const pctFilled    = Math.min(100, (tranche.spotsFilled / tranche.spotsTotal) * 100);
                const tierColor    = accentColor && i === 0 ? accentColor : TIER_ACCENT[i] || TIER_ACCENT[2];
                const isHighlighted = i === 1; // Pioneer always highlighted by default

                return (
                    <motion.button
                        key={tranche.name}
                        onClick={() => !isSoldOut && onSelect(tranche.name)}
                        disabled={isSoldOut}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        whileHover={!isSoldOut ? { scale: 1.02 } : {}}
                        whileTap={!isSoldOut ? { scale: 0.99 } : {}}
                        className={`
                            relative flex flex-col text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                            bg-gradient-to-b ${TIER_GRADIENTS[i] || TIER_GRADIENTS[2]}
                            ${isSelected
                                ? `${TIER_BORDER_ACTIVE[i] || TIER_BORDER_ACTIVE[2]} ${TIER_GLOW[i] || TIER_GLOW[2]}`
                                : `${TIER_BORDER_IDLE[i]} hover:border-white/20`
                            }
                            ${isSoldOut ? "opacity-40 cursor-not-allowed" : ""}
                            ${isHighlighted && !isSelected ? "border-white/[0.12]" : ""}
                        `}
                    >
                        {/* "Most Popular" tag for highlighted tier */}
                        {isHighlighted && !isSoldOut && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span
                                    className="px-3 py-1 text-[9px] font-bold tracking-[0.18em] uppercase rounded-full text-black"
                                    style={{ backgroundColor: tierColor }}
                                >
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Selected checkmark */}
                        {isSelected && (
                            <div
                                className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: tierColor }}
                            >
                                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}

                        {/* Header: badge + tier name */}
                        <div className="flex items-center gap-2 mb-4">
                            {tranche.badge && (
                                <span className={`px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase rounded border ${TIER_BADGE_STYLE[i] || TIER_BADGE_STYLE[2]}`}>
                                    {tranche.badge}
                                </span>
                            )}
                        </div>
                        <h3
                            className="text-lg font-bold text-white mb-1 tracking-tight"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {tranche.name}
                        </h3>

                        {/* Investment range */}
                        <p className="text-xs text-white/50 mb-5">
                            {formatAmount(tranche.minimumAmount)}
                            {tranche.maximumAmount
                                ? ` – ${formatAmount(tranche.maximumAmount)}`
                                : "+"
                            }
                        </p>

                        {/* Yield display */}
                        <div className="mb-6">
                            {tranche.isCustomTerms ? (
                                <div>
                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Expected Return</p>
                                    <p
                                        className="text-sm font-semibold"
                                        style={{ color: tierColor }}
                                    >
                                        Custom Terms
                                    </p>
                                    <p className="text-[10px] text-white/30 mt-0.5">Contact us for pricing</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Expected Return</p>
                                    <p
                                        className="text-2xl font-bold tracking-tight"
                                        style={{
                                            color: tierColor,
                                            fontFamily: "var(--font-montserrat), sans-serif",
                                        }}
                                    >
                                        {tranche.yieldLow}%
                                        {tranche.yieldHigh ? `–${tranche.yieldHigh}%` : "+"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Spots availability */}
                        <div className="mt-auto space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider">Availability</span>
                                <span className={`text-[11px] font-semibold ${isSoldOut ? "text-red-400" : spotsLeft <= 10 ? "text-amber-400" : "text-white/60"}`}>
                                    {isSoldOut ? "Sold Out" : `${spotsLeft} of ${tranche.spotsTotal} left`}
                                </span>
                            </div>
                            {/* Spots progress bar */}
                            <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${pctFilled}%`,
                                        backgroundColor: isSoldOut ? "#ef4444" : tierColor,
                                    }}
                                />
                            </div>
                        </div>

                        {/* CTA text at bottom */}
                        {!isSoldOut && (
                            <div className={`mt-4 pt-4 border-t ${isSelected ? "border-white/10" : "border-white/[0.05]"}`}>
                                <p
                                    className="text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200"
                                    style={{ color: isSelected ? tierColor : "rgba(255,255,255,0.3)" }}
                                >
                                    {isSelected ? "✓ Selected" : tranche.isCustomTerms ? "Contact Us" : "Select Tier"}
                                </p>
                            </div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}

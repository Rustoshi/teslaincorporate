"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Tranche {
    name: string;
    minimumAmount: number;
    maximumAmount?: number | null;
    yieldLow: number;
    yieldHigh?: number | null;
    spotsTotal: number;
    spotsFilled: number;
    isCustomTerms: boolean;
}

interface ProjectCalculatorProps {
    tranches: Tranche[];
    selectedTranche: string | null;
    onSelectTranche?: (name: string) => void;
    accentColor?: string;
}

function formatCurrency(n: number): string {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function ProjectCalculator({
    tranches,
    selectedTranche,
    onSelectTranche,
    accentColor = "#ffffff",
}: ProjectCalculatorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const activeTranche = tranches.find(t => t.name === selectedTranche) ?? tranches[0];

    const min = activeTranche?.minimumAmount ?? 1000;
    const max = activeTranche?.maximumAmount ?? min * 100;

    const [amount, setAmount] = useState(min);

    // Reset amount when tranche changes
    useEffect(() => {
        setAmount(activeTranche?.minimumAmount ?? 1000);
    }, [selectedTranche]);

    const clampedAmount = Math.min(Math.max(amount, min), max);

    const returnLow  = activeTranche && !activeTranche.isCustomTerms
        ? (clampedAmount * activeTranche.yieldLow) / 100
        : null;
    const returnHigh = activeTranche && !activeTranche.isCustomTerms && activeTranche.yieldHigh
        ? (clampedAmount * activeTranche.yieldHigh) / 100
        : null;

    const totalLow  = returnLow  !== null ? clampedAmount + returnLow  : null;
    const totalHigh = returnHigh !== null ? clampedAmount + returnHigh : null;

    // Slider percentage for track fill
    const sliderPct = max > min ? ((clampedAmount - min) / (max - min)) * 100 : 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 space-y-7"
        >
            {/* Header */}
            <div>
                <h3
                    className="text-sm font-bold tracking-[0.14em] uppercase text-white mb-1"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Investment Calculator
                </h3>
                <p className="text-xs text-white/35">Estimate your projected returns.</p>
            </div>

            {/* Tranche selector pills */}
            {onSelectTranche && tranches.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {tranches.map(t => (
                        <button
                            key={t.name}
                            onClick={() => onSelectTranche(t.name)}
                            disabled={t.spotsFilled >= t.spotsTotal}
                            className={`px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-full border transition-all duration-200 ${
                                selectedTranche === t.name || (!selectedTranche && t === tranches[0])
                                    ? "text-black border-transparent"
                                    : "text-white/40 border-white/[0.08] hover:border-white/25 hover:text-white/70"
                            } disabled:opacity-30`}
                            style={
                                selectedTranche === t.name || (!selectedTranche && t === tranches[0])
                                    ? { backgroundColor: accentColor }
                                    : {}
                            }
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Amount Slider */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40">
                        Investment Amount
                    </label>
                    <div className="flex items-center gap-1">
                        <span className="text-white/30 text-sm">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            min={min}
                            max={max}
                            className="w-28 bg-transparent text-right text-lg font-bold text-white outline-none border-b border-white/15 focus:border-white/40 transition-colors duration-200 pb-0.5"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        />
                    </div>
                </div>

                {/* Styled range input */}
                <div className="relative h-5 flex items-center">
                    {/* Track */}
                    <div className="absolute w-full h-1 bg-white/[0.08] rounded-full">
                        <div
                            className="h-full rounded-full transition-all duration-100"
                            style={{ width: `${sliderPct}%`, backgroundColor: accentColor }}
                        />
                    </div>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={Math.max(100, Math.floor((max - min) / 200))}
                        value={clampedAmount}
                        onChange={e => setAmount(Number(e.target.value))}
                        className="relative w-full appearance-none bg-transparent cursor-pointer"
                        style={{
                            // Custom thumb via CSS
                            WebkitAppearance: "none",
                        }}
                    />
                </div>

                <div className="flex justify-between text-[10px] text-white/25">
                    <span>{formatCurrency(min)}</span>
                    <span>{formatCurrency(max)}{activeTranche?.maximumAmount === null ? "+" : ""}</span>
                </div>
            </div>

            {/* Return Preview */}
            {activeTranche?.isCustomTerms ? (
                <div className="border border-white/[0.06] rounded-xl p-5 text-center space-y-1">
                    <p className="text-xs text-white/40">This tier requires custom terms.</p>
                    <p className="text-sm font-semibold" style={{ color: accentColor }}>Contact us for a personalised quote.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Projected Return */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Projected Return</p>
                            <p
                                className="text-xl font-bold tracking-tight"
                                style={{ color: accentColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {returnLow !== null ? formatCurrency(returnLow) : "—"}
                                {returnHigh !== null ? ` – ${formatCurrency(returnHigh)}` : returnLow !== null ? "+" : ""}
                            </p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Total Value</p>
                            <p
                                className="text-xl font-bold tracking-tight text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {totalLow !== null ? formatCurrency(totalLow) : "—"}
                                {totalHigh !== null ? ` – ${formatCurrency(totalHigh)}` : ""}
                            </p>
                        </div>
                    </div>

                    {/* Yield rate reminder */}
                    <p className="text-[10px] text-white/25 text-center">
                        Based on {activeTranche?.yieldLow}%{activeTranche?.yieldHigh ? `–${activeTranche.yieldHigh}%` : "+"} projected yield for the {activeTranche?.name} tier. Projections are estimates, not guarantees.
                    </p>
                </div>
            )}

            {/* Range input thumb styles */}
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${accentColor};
                    cursor: pointer;
                    border: 2px solid rgba(0,0,0,0.3);
                    box-shadow: 0 0 8px ${accentColor}60;
                    transition: transform 0.15s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                }
                input[type=range]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${accentColor};
                    cursor: pointer;
                    border: 2px solid rgba(0,0,0,0.3);
                }
            `}</style>
        </motion.div>
    );
}

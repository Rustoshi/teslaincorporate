"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProjectTranchePicker from "./ProjectTranchePicker";
import { investInProject } from "@/app/dashboard/actions/project";

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

interface InvestModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string;
    tranches: Tranche[];
    accentColor?: string;
    preselectedTranche?: string | null;
    userBalance?: number;
}

type Step = 1 | 2 | 3 | 4;

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, accentColor }: { step: Step; accentColor: string }) {
    const steps = ["Select Tier", "Amount", "Confirm", "Done"];
    return (
        <div className="flex items-center gap-0 mb-7">
            {steps.map((label, i) => {
                const num = (i + 1) as Step;
                const isCompleted = step > num;
                const isCurrent   = step === num;
                return (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300"
                                style={{
                                    backgroundColor: isCompleted || isCurrent ? accentColor : "transparent",
                                    borderColor: isCompleted || isCurrent ? accentColor : "rgba(255,255,255,0.15)",
                                    color: isCompleted || isCurrent ? "#000" : "rgba(255,255,255,0.35)",
                                }}
                            >
                                {isCompleted ? (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : num}
                            </div>
                            <span
                                className="text-[9px] uppercase tracking-wider whitespace-nowrap transition-colors duration-300"
                                style={{ color: isCurrent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}
                            >
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className="w-10 h-px mx-1 mb-5 transition-all duration-300"
                                style={{ backgroundColor: isCompleted ? accentColor : "rgba(255,255,255,0.1)" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvestModal({
    isOpen,
    onClose,
    projectId,
    projectName,
    tranches,
    accentColor = "#ffffff",
    preselectedTranche = null,
    userBalance,
}: InvestModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [step, setStep]                   = useState<Step>(1);
    const [selectedTranche, setSelectedTranche] = useState<string | null>(preselectedTranche);
    const [amount, setAmount]               = useState<string>("");
    const [error, setError]                 = useState<string>("");
    const [successData, setSuccessData]     = useState<{ projectName: string; trancheName: string; investedAmount: number } | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedTranche(preselectedTranche);
            setAmount("");
            setError("");
            setSuccessData(null);
        }
    }, [isOpen, preselectedTranche]);

    const activeTranche = tranches.find(t => t.name === selectedTranche);

    function formatCurrency(n: number): string {
        return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    // ── Step validations ──────────────────────────────────────────────────────

    function canProceedStep1(): boolean {
        return !!selectedTranche && !!activeTranche && !activeTranche.isCustomTerms;
    }

    function canProceedStep2(): boolean {
        const n = parseFloat(amount);
        if (!activeTranche || isNaN(n) || n <= 0) return false;
        if (n < activeTranche.minimumAmount) return false;
        if (activeTranche.maximumAmount !== null && activeTranche.maximumAmount !== undefined && n > activeTranche.maximumAmount) return false;
        if (userBalance !== undefined && n > userBalance) return false;
        return true;
    }

    function getAmountError(): string {
        const n = parseFloat(amount);
        if (!amount) return "";
        if (isNaN(n) || n <= 0) return "Enter a valid amount.";
        if (activeTranche && n < activeTranche.minimumAmount)
            return `Minimum for ${activeTranche.name} is ${formatCurrency(activeTranche.minimumAmount)}.`;
        if (activeTranche?.maximumAmount && n > activeTranche.maximumAmount)
            return `Maximum for ${activeTranche.name} is ${formatCurrency(activeTranche.maximumAmount)}.`;
        if (userBalance !== undefined && n > userBalance)
            return `Insufficient balance. Available: ${formatCurrency(userBalance)}.`;
        return "";
    }

    // ── Submit handler ────────────────────────────────────────────────────────

    async function handleConfirm() {
        if (!session) {
            router.push(`/invest/login?callbackUrl=/projects`);
            return;
        }
        const fd = new FormData();
        fd.set("projectId",   projectId);
        fd.set("trancheName", selectedTranche!);
        fd.set("amount",      amount);

        startTransition(async () => {
            const result = await investInProject(fd);
            if (result.success) {
                setSuccessData({
                    projectName:    result.projectName!,
                    trancheName:    result.trancheName!,
                    investedAmount: result.investedAmount!,
                });
                setStep(4);
            } else {
                setError(result.error || "An error occurred. Please try again.");
            }
        });
    }

    const amountError  = getAmountError();
    const parsedAmount = parseFloat(amount) || 0;
    const returnLow    = activeTranche && !activeTranche.isCustomTerms ? (parsedAmount * activeTranche.yieldLow) / 100 : null;
    const returnHigh   = activeTranche?.yieldHigh && !activeTranche.isCustomTerms ? (parsedAmount * activeTranche.yieldHigh) / 100 : null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={step === 4 ? undefined : onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed z-[101] inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-[#0a0a0a] border border-white/[0.1] rounded-2xl flex flex-col overflow-hidden max-h-[90dvh]"
                    >
                        {/* Modal header */}
                        {step < 4 && (
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.18em] mb-1">Investing in</p>
                                    <h2
                                        className="text-base font-bold text-white tracking-tight"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {projectName}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-full transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto px-6 pb-6">
                            {step < 4 && <StepIndicator step={step} accentColor={accentColor} />}

                            {/* Error banner */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                                    {error}
                                </div>
                            )}

                            <AnimatePresence mode="wait">

                                {/* ── STEP 1: Select Tranche ─────────────────────────────── */}
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                                        <p className="text-sm text-white/50 mb-5">Choose the investment tier that suits your goals.</p>
                                        {!session && (
                                            <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-3">
                                                <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-amber-300 mb-2">You need an account to invest.</p>
                                                    <div className="flex items-center gap-3">
                                                        <a
                                                            href="/invest/signup"
                                                            className="text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                                                        >
                                                            Create Account
                                                        </a>
                                                        <a
                                                            href="/invest/login"
                                                            className="text-[11px] text-amber-400/70 hover:text-amber-300 transition-colors"
                                                        >
                                                            Already have one? Sign in →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <ProjectTranchePicker
                                            tranches={tranches}
                                            selectedTranche={selectedTranche}
                                            onSelect={setSelectedTranche}
                                            accentColor={accentColor}
                                        />
                                    </motion.div>
                                )}

                                {/* ── STEP 2: Enter Amount ───────────────────────────────── */}
                                {step === 2 && activeTranche && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-5">
                                        {/* Tranche reminder */}
                                        <div
                                            className="flex items-center gap-3 p-4 rounded-xl border"
                                            style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}08` }}
                                        >
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                                            <div>
                                                <p className="text-xs font-bold text-white">{activeTranche.name} Tier</p>
                                                <p className="text-[10px] text-white/40">
                                                    {formatCurrency(activeTranche.minimumAmount)} min
                                                    {activeTranche.maximumAmount ? ` · ${formatCurrency(activeTranche.maximumAmount)} max` : ""}
                                                    {" "}· {activeTranche.yieldLow}%{activeTranche.yieldHigh ? `–${activeTranche.yieldHigh}%` : "+"} yield
                                                </p>
                                            </div>
                                        </div>

                                        {/* Amount input */}
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2">
                                                Investment Amount
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">$</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={e => { setAmount(e.target.value); setError(""); }}
                                                    min={activeTranche.minimumAmount}
                                                    max={activeTranche.maximumAmount ?? undefined}
                                                    placeholder={activeTranche.minimumAmount.toString()}
                                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-4 text-xl font-bold text-white outline-none focus:border-white/25 transition-colors duration-200"
                                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                                    autoFocus
                                                />
                                            </div>
                                            {amountError && (
                                                <p className="text-[11px] text-red-400 mt-1.5">{amountError}</p>
                                            )}
                                            {userBalance !== undefined && (
                                                <p className="text-[11px] text-white/30 mt-1.5">
                                                    Available balance: {formatCurrency(userBalance)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Quick select amounts */}
                                        <div className="flex flex-wrap gap-2">
                                            {[activeTranche.minimumAmount, activeTranche.minimumAmount * 2, activeTranche.minimumAmount * 5].map(preset => (
                                                <button
                                                    key={preset}
                                                    onClick={() => setAmount(preset.toString())}
                                                    className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all duration-200 ${
                                                        parseFloat(amount) === preset
                                                            ? "text-black border-transparent"
                                                            : "text-white/40 border-white/[0.08] hover:border-white/20 hover:text-white/60"
                                                    }`}
                                                    style={parseFloat(amount) === preset ? { backgroundColor: accentColor } : {}}
                                                >
                                                    {formatCurrency(preset)}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Live projected return */}
                                        {parsedAmount >= activeTranche.minimumAmount && !amountError && (
                                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                                                <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Projected Return</p>
                                                <p
                                                    className="text-2xl font-bold"
                                                    style={{ color: accentColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                                                >
                                                    {returnLow !== null ? formatCurrency(returnLow) : "—"}
                                                    {returnHigh !== null ? ` – ${formatCurrency(returnHigh)}` : ""}
                                                </p>
                                                <p className="text-[10px] text-white/25 mt-1">Based on {activeTranche.yieldLow}%{activeTranche.yieldHigh ? `–${activeTranche.yieldHigh}%` : "+"} yield on {formatCurrency(parsedAmount)}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* ── STEP 3: Review & Confirm ───────────────────────────── */}
                                {step === 3 && activeTranche && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-4">
                                        <p className="text-sm text-white/50 mb-2">Please review your investment details before confirming.</p>

                                        {/* Summary card */}
                                        <div className="border border-white/[0.08] rounded-2xl p-5 space-y-3">
                                            {[
                                                { label: "Project",     value: projectName },
                                                { label: "Tier",        value: activeTranche.name },
                                                { label: "Amount",      value: formatCurrency(parsedAmount), highlight: true },
                                                { label: "Yield Range", value: `${activeTranche.yieldLow}%${activeTranche.yieldHigh ? `–${activeTranche.yieldHigh}%` : "+"}` },
                                                ...(returnLow !== null ? [{ label: "Projected Return", value: `${formatCurrency(returnLow)}${returnHigh ? ` – ${formatCurrency(returnHigh)}` : "+"}`, highlight: true }] : []),
                                            ].map(row => (
                                                <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                                                    <span className="text-xs text-white/40">{row.label}</span>
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color: row.highlight ? accentColor : "rgba(255,255,255,0.85)" }}
                                                    >
                                                        {row.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Disclaimer */}
                                        <p className="text-[10px] text-white/25 leading-relaxed">
                                            By confirming, ${parsedAmount.toLocaleString()} will be deducted from your account balance immediately. Returns are projections based on historical performance and are not guaranteed.
                                        </p>
                                    </motion.div>
                                )}

                                {/* ── STEP 4: Success ────────────────────────────────────── */}
                                {step === 4 && successData && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-6 flex flex-col items-center text-center space-y-5"
                                    >
                                        {/* Success icon */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                            className="w-16 h-16 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${accentColor}20`, border: `2px solid ${accentColor}` }}
                                        >
                                            <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>

                                        <div>
                                            <h3
                                                className="text-xl font-bold text-white mb-2"
                                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                Investment Confirmed
                                            </h3>
                                            <p className="text-sm text-white/50">
                                                You have successfully invested{" "}
                                                <span className="font-semibold text-white">{formatCurrency(successData.investedAmount)}</span>{" "}
                                                in the <span className="font-semibold" style={{ color: accentColor }}>{successData.trancheName}</span> tier of{" "}
                                                <span className="font-semibold text-white">{successData.projectName}</span>.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                                            <button
                                                onClick={() => { onClose(); router.push("/dashboard/projects"); }}
                                                className="flex-1 py-3 text-sm font-bold tracking-[0.1em] uppercase rounded-full text-black transition-all duration-300 hover:opacity-90"
                                                style={{ backgroundColor: accentColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                View Portfolio
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="flex-1 py-3 text-sm font-bold tracking-[0.1em] uppercase rounded-full border border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-all duration-200"
                                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Navigation footer */}
                        {step < 4 && (
                            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between shrink-0">
                                {step > 1 ? (
                                    <button
                                        onClick={() => setStep(s => (s - 1) as Step)}
                                        className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back
                                    </button>
                                ) : <div />}

                                {step === 3 ? (
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isPending}
                                        className="px-8 py-3 text-sm font-bold tracking-[0.1em] uppercase rounded-full text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                                        style={{ backgroundColor: accentColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {isPending ? "Processing…" : "Confirm Investment"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStep(s => (s + 1) as Step)}
                                        disabled={
                                            (step === 1 && !canProceedStep1()) ||
                                            (step === 2 && !canProceedStep2())
                                        }
                                        className="px-8 py-3 text-sm font-bold tracking-[0.1em] uppercase rounded-full text-black transition-all duration-300 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: accentColor, fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        Continue
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

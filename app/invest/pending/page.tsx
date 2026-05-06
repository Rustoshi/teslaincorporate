"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PendingPage() {
    return (
        <div className="min-h-[100dvh] bg-black flex items-center justify-center px-6 py-24">
            {/* Subtle radial glow */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,33,39,0.03)_0%,_transparent_60%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-md text-center"
            >
                {/* Logo */}
                <Link
                    href="/invest"
                    className="text-lg font-bold tracking-[0.25em] uppercase text-white inline-block mb-10"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Meta <span className="text-red-500">Wealth</span>
                </Link>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                            </svg>
                        </div>
                    </div>

                    <h1
                        className="text-2xl font-bold tracking-[0.04em] text-white mb-3"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Account Under Review
                    </h1>

                    <p className="text-sm text-white/50 font-light leading-relaxed mb-6">
                        Your account has been created successfully. Our team is reviewing your registration and will activate your account within{" "}
                        <span className="text-white/70 font-medium">24 hours</span>.
                    </p>

                    {/* Status badge */}
                    <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-xl px-5 py-4 mb-8">
                        <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-1">Account Status</p>
                        <p className="text-sm font-bold tracking-wide text-amber-400">Pending Approval</p>
                    </div>

                    <p className="text-xs text-white/30 leading-relaxed mb-4">
                        A confirmation email has been sent to your inbox. You will receive another email once your account is approved and ready to use.
                    </p>

                    {/* Spam reminder */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-8 text-left">
                        <p className="text-[11px] text-white/50 leading-relaxed">
                            <span className="text-white/70 font-semibold">Can't find the email?</span> Check your{" "}
                            <span className="text-white/60 font-medium">spam</span> or{" "}
                            <span className="text-white/60 font-medium">junk</span> folder. If it's there, please mark it as{" "}
                            <span className="text-white/60 font-medium">Not Spam</span> to ensure you receive future emails from us.
                        </p>
                    </div>

                    <Link
                        href="/invest/login"
                        className="block w-full py-3.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white text-sm font-semibold tracking-[0.08em] uppercase rounded-full transition-all duration-300"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

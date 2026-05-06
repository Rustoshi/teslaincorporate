"use client";

import { motion } from "framer-motion";
import {
    Globe,
    TrendingUp,
    Zap,
    Heart,
    Briefcase,
    CheckCircle2,
    Bell,
} from "lucide-react";

const benefits = [
    { icon: Globe, title: "Fully Remote", desc: "Work from anywhere in the world. We are timezone-flexible and async-first." },
    { icon: TrendingUp, title: "Equity Participation", desc: "Every team member receives equity. We build together and share the upside together." },
    { icon: Zap, title: "Top-of-Market Comp", desc: "Competitive base salaries benchmarked against tier-1 fintech and technology companies." },
    { icon: Heart, title: "Health & Wellbeing", desc: "Comprehensive health coverage for you and your dependants, plus a personal wellness allowance." },
    { icon: Briefcase, title: "Learning Budget", desc: "$3,000 per year for courses, conferences, certifications, and professional development." },
    { icon: CheckCircle2, title: "Mission-Driven Work", desc: "Work on a platform that genuinely widens access to life-changing investment opportunities." },
];

const values = [
    { n: "01", title: "Ownership", desc: "We expect every team member to own their domain fully — no hand-holding, no bureaucracy." },
    { n: "02", title: "Speed", desc: "We move fast by default. Iteration beats perfection. Shipping beats waiting." },
    { n: "03", title: "Investor First", desc: "Every decision is measured against one question: does this make the investor experience better?" },
    { n: "04", title: "Integrity", desc: "We operate in financial markets. Honesty and compliance are non-negotiable at every level." },
];

export default function CareersPage() {
    return (
        <main className="bg-black text-white overflow-hidden">

            {/* ── Hero ── */}
            <section className="relative w-full min-h-[65vh] flex items-center justify-center overflow-hidden pt-[70px]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-600/[0.05] rounded-full blur-[130px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 sm:py-32 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Careers
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-8"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Join the Team
                        <br />
                        <span className="text-white/25">Behind the Platform</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Tesla Inc is a global team of engineers, analysts, compliance specialists, and operators building the platform that gives everyone access to private equity in the world's most consequential companies.
                    </motion.p>
                </div>
            </section>

            {/* ── Culture values ── */}
            <section className="relative w-full bg-zinc-950 border-t border-white/[0.04] py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.08 * i }}
                                className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
                            >
                                <span
                                    className="block text-4xl font-black text-white/[0.07] mb-3"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {v.n}
                                </span>
                                <h3
                                    className="text-sm font-bold text-white mb-2"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {v.title}
                                </h3>
                                <p className="text-xs text-white/40 font-light leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── No openings ── */}
            <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Open Positions</span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Current Openings
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col items-center justify-center py-20 px-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
                            <Bell className="w-6 h-6 text-white/25" />
                        </div>
                        <h3
                            className="text-lg font-bold text-white mb-3"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            No Openings at This Time
                        </h3>
                        <p className="text-sm text-white/40 font-light leading-relaxed max-w-md">
                            We are not actively hiring at the moment. Check back here for future opportunities, or send a speculative application and we'll keep your details on file.
                        </p>
                        <a
                            href="mailto:careers@tesla-inc.pro?subject=Speculative Application"
                            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/[0.12] text-white/50 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/30 hover:text-white transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Send Speculative Application
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ── Benefits ── */}
            <section className="relative w-full bg-zinc-50 py-20 sm:py-28 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-4">Benefits</span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            What You Get
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {benefits.map((b, i) => {
                            const Icon = b.icon;
                            return (
                                <motion.div
                                    key={b.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.07 * i }}
                                    className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                                        <Icon className="w-4 h-4 text-red-500" />
                                    </div>
                                    <h3
                                        className="text-sm font-bold text-black mb-2"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {b.title}
                                    </h3>
                                    <p className="text-xs text-black/55 font-light leading-relaxed">{b.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

        </main>
    );
}

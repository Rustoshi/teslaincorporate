"use client";

import { motion } from "framer-motion";

/* ─── Types ─── */
interface RiskBlock {
    title: string;
    description: string;
}

/* ─── Data ─── */
const blocks: RiskBlock[] = [
    {
        title: "Volatility Control Engine",
        description:
            "Dynamic position sizing and AI-adjusted exposure based on real-time market volatility metrics.",
    },
    {
        title: "Automated Drawdown Protocols",
        description:
            "Layered stop-loss frameworks and capital throttling systems designed to limit downside exposure.",
    },
    {
        title: "Multi-Sector Allocation",
        description:
            "Capital is distributed across innovation-driven equities including companies such as Tesla and NVIDIA to reduce concentration risk.",
    },
    {
        title: "Real-Time Recalibration",
        description:
            "AI systems continuously monitor performance, recalibrating exposure during shifts in macro and sector conditions.",
    },
];

/* ─── Risk Card ─── */
function RiskCard({ block, index }: { block: RiskBlock; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 * index, ease: "easeOut" }}
            className="relative rounded-2xl p-8 bg-white border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-colors duration-300 cursor-default"
        >
            {/* Number accent */}
            <span
                className="block text-4xl font-black text-black/10 mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                0{index + 1}
            </span>

            {/* Title */}
            <h3
                className="text-base font-bold tracking-[0.04em] text-black mb-3"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {block.title}
            </h3>

            {/* Accent bar */}
            <div className="w-8 h-[2px] bg-red-500/30 rounded-full mb-4" />

            {/* Description */}
            <p className="text-sm text-black/60 font-light leading-relaxed">
                {block.description}
            </p>
        </motion.div>
    );
}

/* ─── Main Section ─── */
export default function RiskArchitecture() {
    return (
        <section id="risk" className="relative w-full bg-zinc-50 pt-0 pb-24 sm:pb-32 overflow-hidden">
            {/* Dark-to-light gradient transition */}
            <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-black to-zinc-50" />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header — centered */}
                <div className="text-center mb-16 sm:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-6"
                    >
                        Risk Architecture
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-black mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Capital Preservation
                        <br />
                        <span className="text-black/40">Is Systemic</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-black/50 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        AI-driven risk management frameworks designed to protect capital across market cycles.
                    </motion.p>
                </div>

                {/* 4-Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-20">
                    {blocks.map((block, i) => (
                        <RiskCard key={block.title} block={block} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

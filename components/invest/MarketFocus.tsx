"use client";

import { motion } from "framer-motion";

const companies = [
    {
        name: "SpaceX",
        ticker: "PRIVATE",
        thesis: "Reusable launch vehicles, Starlink satellite internet, and the first interplanetary transportation system",
        isActive: true,
    },
    {
        name: "The Boring Company",
        ticker: "PRIVATE",
        thesis: "High-speed underground transit networks eliminating urban traffic — operational in Las Vegas, expanding globally",
        isActive: true,
    },
    {
        name: "Tesla",
        ticker: "TSLA",
        thesis: "Electric vehicles, autonomous driving, energy storage, and solar — the vertically integrated clean energy company",
        isActive: false,
    },
    {
        name: "Neuralink",
        ticker: "PRIVATE",
        thesis: "Brain-computer interface technology restoring mobility and expanding human cognitive bandwidth",
        isActive: false,
    },
    {
        name: "xAI",
        ticker: "PRIVATE",
        thesis: "Advanced AI research company building Grok — a frontier large language model with real-time internet access",
        isActive: false,
    },
    {
        name: "X Corp",
        ticker: "PRIVATE",
        thesis: "The everything app — payments, social, video, and AI converging into a single consumer platform",
        isActive: false,
    },
];

export default function MarketFocus() {
    return (
        <section id="markets" className="relative w-full bg-black py-24 sm:py-32 overflow-hidden">
            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Label */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-500 font-semibold mb-6"
                >
                    Strategic Exposure
                </motion.span>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-white mb-8 w-full"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    The Musk
                    <br />
                    <span className="text-white/40">Ecosystem</span>
                </motion.h2>

                {/* Philosophy */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg text-white/50 font-light max-w-2xl leading-relaxed mb-16"
                >
                    Every company in our portfolio is building critical infrastructure for civilisation's next chapter — aerospace, clean energy, AI, neural interfaces, and underground transit.
                    SpaceX and The Boring Company are open for investment now.
                </motion.p>

                {/* Company Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {companies.map((company, i) => (
                        <motion.div
                            key={company.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.08 * i }}
                            className={`group relative rounded-xl p-6 border transition-colors duration-400 ${
                                company.isActive
                                    ? "border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.07] hover:border-red-500/35 cursor-pointer"
                                    : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.10] cursor-default"
                            }`}
                        >
                            {/* Active badge */}
                            {company.isActive && (
                                <div className="flex items-center gap-1.5 mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-400">
                                        Open for Investment
                                    </span>
                                </div>
                            )}

                            {/* Name + ticker */}
                            <div className="flex items-baseline gap-3 mb-3">
                                <span
                                    className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {company.name}
                                </span>
                                <span className="text-xs font-mono tracking-wider text-white/25">
                                    {company.ticker}
                                </span>
                            </div>

                            {/* Thesis */}
                            <p className="text-sm text-white/50 font-light leading-relaxed">
                                {company.thesis}
                            </p>

                            {/* Subtle accent line */}
                            <div className={`absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent to-transparent transition-all duration-500 ${
                                company.isActive
                                    ? "via-red-500/30 group-hover:via-red-500/50"
                                    : "via-white/[0.06] group-hover:via-white/[0.12]"
                            }`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

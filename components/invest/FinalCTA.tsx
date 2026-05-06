"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
    return (
        <section id="deploy" className="relative w-full min-h-[80vh] bg-black flex items-center justify-center overflow-hidden">
            {/* Light-to-dark gradient transition from previous section */}
            <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-zinc-50 to-black z-[1]" />

            {/* Subtle center radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,33,39,0.03)_0%,_transparent_60%)]" />

            {/* Grid overlay */}
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

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
                {/* Label */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/60 font-medium mb-8"
                >
                    Limited Spots Available Now
                </motion.span>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase tracking-[0.06em] leading-[1.08] text-white mb-8"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Secure Your Position
                    <br />
                    <span className="text-white/40">Before It Closes</span>
                </motion.h2>

                {/* Supporting text */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg text-white/60 font-light max-w-[600px] mx-auto leading-relaxed mb-12"
                >
                    SpaceX Space City and The Boring Company Tunnel Network are both open for investment. Spots across all tiers are limited — once filled, the round closes regardless of the deadline.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10"
                >
                    <Link
                        href="/projects"
                        className="px-8 py-4 bg-white text-black text-sm font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        View Open Projects
                    </Link>
                    <Link
                        href="/invest/signup"
                        className="px-8 py-4 text-sm font-semibold tracking-[0.1em] uppercase text-white rounded-full border border-white/30 transition-all duration-300 ease-out hover:bg-white hover:text-black hover:border-white"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Create Free Account
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        points: [
            "Sign up in under 2 minutes",
            "Complete identity verification (KYC)",
            "Fund your account — deposit from $1,000",
        ],
    },
    {
        number: "02",
        title: "Choose Your Investment",
        points: [
            "Browse SpaceX, Boring Company & more",
            "Select a tier — Explorer, Pioneer, or Visionary",
            "Or activate an AI trading plan",
        ],
    },
    {
        number: "03",
        title: "Track & Earn",
        points: [
            "Monitor your stake in real time",
            "Receive yield distributions to your account",
            "Withdraw profits whenever you choose",
        ],
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative w-full bg-zinc-50 pt-0 pb-24 sm:pb-32 overflow-hidden">
            {/* Dark-to-light gradient transition zone */}
            <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-black to-zinc-50" />
            {/* Subtle grid background */}
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
                {/* Label */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-6"
                >
                    Intelligent System Design
                </motion.span>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-black mb-16 sm:mb-20 w-full"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Three Steps.
                    <br />
                    <span className="text-black/40">Real Ownership.</span>
                </motion.h2>

                {/* 3-Step Breakdown — Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 * i }}
                            className="group relative bg-white rounded-2xl p-7 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(232,33,39,0.1)] hover:border-red-500/10 transition-shadow transition-colors duration-500 cursor-pointer"
                        >
                            {/* Step number */}
                            <span
                                className="block text-5xl sm:text-6xl font-black text-black/30 mb-3 tracking-tight"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {step.number}
                            </span>

                            {/* Red accent bar */}
                            <div className="w-10 h-[3px] bg-red-500 rounded-full mb-5" />

                            {/* Title */}
                            <h3
                                className="text-lg sm:text-xl font-bold tracking-[0.04em] text-black mb-4"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {step.title}
                            </h3>

                            {/* Points */}
                            <ul className="flex flex-col gap-3">
                                {step.points.map((point) => (
                                    <li
                                        key={point}
                                        className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

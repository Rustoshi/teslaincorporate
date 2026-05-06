"use client";

import { motion } from "framer-motion";

const plans = [
    {
        name: "Starter AI",
        description: "Algorithmic exposure to blue-chip innovation equities with risk-managed entry points.",
        target: "Targeted Alpha Strategy · Conservative",
    },
    {
        name: "Growth AI",
        description: "Multi-asset AI strategy focused on high-growth technology leaders and market momentum.",
        target: "Targeted Alpha Strategy · Balanced",
    },
    {
        name: "Institutional AI",
        description: "Advanced quantitative models with cross-market arbitrage and private equity exposure windows.",
        target: "Targeted Alpha Strategy · Aggressive",
    },
];

export default function AIPlanCards() {
    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-6">
            {plans.map((plan, i) => (
                <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 * i, ease: "easeOut" }}
                    className="group relative rounded-2xl p-6 sm:p-7 cursor-pointer transition-all duration-500 ease-out bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.04)]"
                >
                    <h3
                        className="text-base sm:text-lg font-bold tracking-[0.08em] text-white mb-2"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50 font-light leading-relaxed mb-4">
                        {plan.description}
                    </p>
                    <div className="text-[11px] sm:text-xs tracking-[0.1em] uppercase text-white/30 font-medium">
                        {plan.target}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

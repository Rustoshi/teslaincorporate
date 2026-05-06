"use client";

import { motion } from "framer-motion";

const allocations = [
    { label: "Active AI Plans", value: "$425,000.00", percentage: 83.3, color: "bg-red-500" },
    { label: "Available Cash", value: "$85,240.50", percentage: 16.7, color: "bg-green-500" },
];

export default function PortfolioAllocation() {
    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-[0.15em] uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Portfolio Allocation
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 sm:p-8">
                {/* Visual Bar */}
                <div className="w-full h-8 flex rounded-full overflow-hidden mb-8 bg-white/[0.05]">
                    {allocations.map((alloc, i) => (
                        <motion.div
                            key={alloc.label}
                            initial={{ width: 0 }}
                            animate={{ width: `${alloc.percentage}%` }}
                            transition={{ duration: 1.5, delay: 0.2 + i * 0.2, ease: "easeOut" }}
                            className={`${alloc.color} h-full relative group`}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                {/* Details Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {allocations.map((alloc) => (
                        <div key={alloc.label} className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${alloc.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                            <div className="flex-1">
                                <div className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-1">
                                    {alloc.label}
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-xl font-bold text-white tracking-wide">{alloc.value}</span>
                                    <span className="text-xs font-semibold text-white/60 mb-1">{alloc.percentage}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

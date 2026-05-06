"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export interface ActivePlanData {
    id: string;
    name: string;
    capital: string;
    cycle: string;
    target: string;
    currentPnL: string;
}

interface InvestmentPlansProps {
    activePlans: ActivePlanData[];
}

export default function InvestmentPlans({ activePlans }: InvestmentPlansProps) {
    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-lg font-bold tracking-[0.15em] uppercase text-white"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Active Plans
                </h2>
            </div>

            {activePlans.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide mb-2">No Active Plans</h3>
                    <p className="text-sm text-white/40 mb-6 max-w-sm">
                        You don't have any active investment plans yet. Subscribe to a plan to start earning yields.
                    </p>
                    <Link
                        href="/dashboard/subscribe"
                        className="px-8 py-3 bg-white text-black text-[11px] font-bold tracking-widest uppercase rounded-full hover:bg-white/90 transition-colors"
                    >
                        Subscribe to a Plan
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {activePlans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 sm:p-6 hover:bg-white/[0.05] hover:border-white/[0.15] transition-colors duration-300 relative overflow-hidden group"
                        >
                            {/* Background Progress Bar (subtle) */}
                            <div className="absolute top-0 left-0 bottom-0 w-full bg-white/[0.01] pointer-events-none" />

                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                                {/* Left: Name & ID */}
                                <div className="sm:w-1/4">
                                    <div className="text-[10px] text-white/30 tracking-widest uppercase mb-1">
                                        {plan.id}
                                    </div>
                                    <div className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                                        {plan.name}
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    </div>
                                </div>

                                {/* Middle Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                                    <div>
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Capital</div>
                                        <div className="text-sm font-semibold text-white">{plan.capital}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Cycle</div>
                                        <div className="text-sm font-semibold text-white">{plan.cycle}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">P&L</div>
                                        <div className="text-sm font-bold text-green-500">{plan.currentPnL}</div>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end justify-center">
                                        <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">7D Trajectory</div>
                                        <svg className="w-24 h-6 text-green-500" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M 0 20 Q 20 15 40 10 T 60 5 T 100 0" strokeDasharray="100" strokeDashoffset="0">
                                                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" fill="freeze" />
                                            </path>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}

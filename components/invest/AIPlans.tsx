"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

/* ─── Types ─── */
interface PlanFeature {
    text: string;
}

export interface PlanData {
    _id?: string;
    name: string;
    capitalRange: string;
    returnLow: number;
    returnHigh?: number;
    returnContext: string;
    cycle: string;
    description: string;
    features: PlanFeature[];
    highlighted?: boolean;
    badge?: string;
}

/* ─── Animated Counter ─── */
function AnimatedNumber({ target, active }: { target: number; active: boolean }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;
        let frame: number;
        const duration = 1200;
        const start = performance.now();

        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, active]);

    return <>{value}</>;
}

/* ─── Plan Card ─── */
function PlanCard({ plan, index }: { plan: PlanData & { cta: string; ctaHref: string }; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.12 * index, ease: "easeOut" }}
            className={`relative flex flex-col rounded-2xl p-8 sm:p-10 transition-transform duration-300 ease-out hover:scale-[1.02] ${plan.highlighted
                ? "bg-white/[0.05] border border-white/[0.15] shadow-[0_0_40px_rgba(255,255,255,0.03)]"
                : "bg-white/[0.03] border border-white/[0.08]"
                }`}
        >
            {/* Badge */}
            {plan.badge && (
                <span className="absolute -top-3 left-8 text-[10px] tracking-[0.2em] uppercase font-semibold text-white/70 border border-white/20 rounded-full px-4 py-1 bg-black">
                    {plan.badge}
                </span>
            )}

            {/* Plan Name */}
            <h3
                className="text-lg font-bold tracking-[0.05em] text-white mb-2"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {plan.name}
            </h3>

            {/* Capital Range */}
            <p className="text-sm text-white/60 font-light mb-8">
                {plan.capitalRange}
            </p>

            {/* Return Range */}
            <div className="mb-2">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-medium">
                    Target Returns
                </span>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
                {plan.returnHigh ? (
                    <>
                        <span
                            className={`font-black tracking-tight text-white text-4xl sm:text-5xl`}
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            <AnimatedNumber target={plan.returnLow} active={inView} />%
                        </span>
                        <span className="text-white/30 text-xl font-light mx-1">–</span>
                        <span
                            className={`font-black tracking-tight text-white text-4xl sm:text-5xl`}
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            <AnimatedNumber target={plan.returnHigh} active={inView} />%
                        </span>
                    </>
                ) : (
                    <span
                        className={`font-black tracking-tight text-white text-4xl sm:text-5xl`}
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        +<AnimatedNumber target={plan.returnLow} active={inView} />%
                    </span>
                )}
            </div>

            {/* Context line */}
            <p className="text-xs text-white/30 font-light leading-relaxed mb-8">
                {plan.returnContext}
            </p>

            {/* Execution Cycle */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
                    Execution Cycle:
                </span>
                <span className="text-sm font-semibold text-white/70">
                    {plan.cycle}
                </span>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/[0.06] mb-6" />

            {/* Description */}
            <p className="text-sm text-white/50 font-light leading-relaxed mb-8">
                {plan.description}
            </p>

            {/* Features */}
            <ul className="flex flex-col gap-3 mb-10 flex-1">
                {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0" />
                        <span className="text-sm text-white/60 font-light">
                            {f.text}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Link
                href={plan.ctaHref}
                className={`block w-full text-center py-3.5 text-sm font-semibold tracking-[0.08em] uppercase rounded-full transition-all duration-300 ${plan.highlighted
                    ? "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(232,33,39,0.2)]"
                    : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {plan.cta}
            </Link>

        </motion.div>
    );
}

/* ─── Main Section ─── */
export default function AIPlans({ plans }: { plans: PlanData[] }) {
    const enriched = plans.map(p => ({
        ...p,
        cta: `Activate ${p.name}`,
        ctaHref: "/invest/login",
    }));

    return (
        <section id="plans" className="relative w-full bg-black py-24 sm:py-32 overflow-hidden">
            {/* Grid */}
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

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header — centered */}
                <div className="text-center mb-16 sm:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/70 font-medium mb-6"
                    >
                        AI Capital Programs
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-white mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Structured Strategies
                        <br />
                        <span className="text-white/40">
                            For Different Capital Tiers
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        AI-powered systematic trading strategies designed around capital scale, risk tolerance, and execution depth.
                    </motion.p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {enriched.map((plan, i) => (
                        <PlanCard key={plan.name} plan={plan} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

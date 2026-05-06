"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import {
    Bot,
    TrendingUp,
    ShieldCheck,
    Cpu,
    BarChart2,
    RefreshCw,
    Layers,
    Activity,
    Lock,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Clock,
    Zap,
    Target,
} from "lucide-react";

/* ─── Types ─── */
interface PlanData {
    _id: string;
    name: string;
    capitalRange: string;
    returnLow: number;
    returnHigh: number | null;
    returnContext: string;
    cycle: string;
    description: string;
    features: { text: string }[];
    highlighted: boolean;
    badge: string | null;
}

/* ─── Animated counter ─── */
function AnimatedNumber({ target, suffix = "%", active }: { target: number; suffix?: string; active: boolean }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;
        let frame: number;
        const duration = 1200;
        const start = performance.now();
        const step = (now: number) => {
            const eased = 1 - Math.pow(1 - Math.min((now - start) / duration, 1), 3);
            setValue(Math.round(eased * target));
            if (eased < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, active]);

    return <>{value}{suffix}</>;
}

/* ─── Full plan card ─── */
function PlanCard({ plan, index }: { plan: PlanData; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
            className={`relative flex flex-col rounded-2xl p-8 sm:p-9 transition-all duration-300 hover:scale-[1.01] ${
                plan.highlighted
                    ? "bg-white/[0.06] border border-white/[0.16] shadow-[0_0_50px_rgba(255,255,255,0.03)]"
                    : "bg-white/[0.03] border border-white/[0.08]"
            }`}
        >
            {plan.badge && (
                <span className="absolute -top-3 left-7 text-[10px] tracking-[0.2em] uppercase font-semibold text-white/70 border border-white/20 rounded-full px-4 py-1 bg-black">
                    {plan.badge}
                </span>
            )}

            {/* Name */}
            <h3
                className="text-lg font-bold tracking-[0.05em] text-white mb-1"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {plan.name}
            </h3>
            <p className="text-sm text-white/50 font-light mb-7">{plan.capitalRange}</p>

            {/* Returns */}
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-2">Target Returns</p>
            <div className="flex items-baseline gap-1 mb-2">
                {plan.returnHigh ? (
                    <>
                        <span
                            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            <AnimatedNumber target={plan.returnLow} active={inView} />
                        </span>
                        <span className="text-white/25 text-xl font-light mx-1">–</span>
                        <span
                            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            <AnimatedNumber target={plan.returnHigh} active={inView} />
                        </span>
                    </>
                ) : (
                    <span
                        className="text-4xl sm:text-5xl font-black text-white tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        +<AnimatedNumber target={plan.returnLow} active={inView} />
                    </span>
                )}
            </div>
            <p className="text-xs text-white/25 font-light leading-relaxed mb-6">{plan.returnContext}</p>

            {/* Cycle */}
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-3.5 h-3.5 text-white/25" />
                <span className="text-[10px] tracking-[0.18em] uppercase text-white/25">Execution Cycle:</span>
                <span className="text-sm font-semibold text-white/60">{plan.cycle}</span>
            </div>

            <div className="w-full h-[1px] bg-white/[0.06] mb-6" />

            <p className="text-sm text-white/45 font-light leading-relaxed mb-7">{plan.description}</p>

            <ul className="flex flex-col gap-3 flex-1 mb-9">
                {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0" />
                        <span className="text-sm text-white/55 font-light">{f.text}</span>
                    </li>
                ))}
            </ul>

            <Link
                href="/invest/signup"
                className={`block w-full text-center py-3.5 text-sm font-semibold tracking-[0.08em] uppercase rounded-full transition-all duration-300 ${
                    plan.highlighted
                        ? "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_24px_rgba(232,33,39,0.25)]"
                        : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Activate {plan.name}
            </Link>
        </motion.div>
    );
}

/* ─── Static data ─── */
const howItWorks = [
    {
        icon: Cpu,
        title: "Signal Generation",
        desc: "AI models scan thousands of data points across equities, macro indicators, and sentiment signals to identify high-probability entry conditions.",
    },
    {
        icon: Target,
        title: "Position Sizing",
        desc: "Capital is allocated dynamically based on signal confidence and current volatility regime — never overexposed to a single position.",
    },
    {
        icon: Activity,
        title: "Live Execution",
        desc: "Trades are executed algorithmically across the execution cycle. No human emotion, no hesitation, no missed entries.",
    },
    {
        icon: RefreshCw,
        title: "Continuous Recalibration",
        desc: "The system re-evaluates its model parameters on each cycle close, adapting to new market conditions in real time.",
    },
    {
        icon: BarChart2,
        title: "Yield Distribution",
        desc: "At the end of each execution cycle, net gains are calculated and credited directly to your account balance.",
    },
    {
        icon: ShieldCheck,
        title: "Risk Enforcement",
        desc: "Drawdown limits, stop-loss thresholds, and volatility caps are enforced automatically — no manual override required.",
    },
];

const riskBlocks = [
    {
        title: "Volatility Control Engine",
        desc: "Dynamic position sizing and AI-adjusted exposure based on real-time market volatility metrics.",
    },
    {
        title: "Automated Drawdown Protocols",
        desc: "Layered stop-loss frameworks and capital throttling systems designed to limit downside exposure.",
    },
    {
        title: "Multi-Sector Allocation",
        desc: "Capital distributed across innovation-driven equities to reduce single-sector concentration risk.",
    },
    {
        title: "Real-Time Recalibration",
        desc: "AI systems continuously monitor performance, recalibrating exposure during macro and sector condition shifts.",
    },
];

const cycles = [
    {
        icon: Zap,
        label: "Daily",
        desc: "Highest-frequency execution. Positions open and close within a single trading session. Best suited for conservative capital with consistent compounding.",
        plans: "Entry-level capital tiers",
    },
    {
        icon: RefreshCw,
        label: "Weekly",
        desc: "Mid-frequency strategies. Positions held across a trading week, capturing larger price moves with controlled risk.",
        plans: "Mid-range capital tiers",
    },
    {
        icon: Layers,
        label: "Monthly",
        desc: "Low-frequency, high-conviction trades. Capital deployed in fewer, larger positions over a full calendar cycle. Institutional-grade strategies.",
        plans: "High-capital institutional tiers",
    },
];

const comparison = [
    { aspect: "Management", ai: "Fully automated — AI executes 24/7", projects: "Stake-and-hold — no active management" },
    { aspect: "Returns", ai: "Generated through trading profit", projects: "Generated through yield distributions on equity stake" },
    { aspect: "Liquidity", ai: "Follows execution cycle schedule", projects: "Defined by project tranche terms" },
    { aspect: "Risk Profile", ai: "Market exposure — algorithmic controls", projects: "Private equity — illiquidity risk" },
    { aspect: "Capital Range", ai: "From $1,000 to $500,000+", projects: "From $1,000 per tranche entry" },
    { aspect: "Upside", ai: "Capped at plan return range", projects: "Uncapped on equity appreciation" },
];

const faqs = [
    {
        q: "Do I need trading experience to use AI Plans?",
        a: "No. AI Plans are fully managed by algorithmic systems. Once you activate a plan and fund it, the AI handles all execution, position management, and yield distribution automatically.",
    },
    {
        q: "Can I run multiple plans simultaneously?",
        a: "Yes. You can activate multiple AI Plans across different capital tiers at the same time. Each plan operates independently with its own capital allocation.",
    },
    {
        q: "What markets do the AI systems trade?",
        a: "The AI strategies primarily target innovation-driven equities including Tesla, NVIDIA, and other high-growth technology sectors, alongside broader index exposure for diversification.",
    },
    {
        q: "What happens if a plan has a losing cycle?",
        a: "Drawdown protocols are designed to limit per-cycle losses. In the event of a negative cycle, no yield is distributed and the system enters a recalibration mode before the next cycle opens.",
    },
    {
        q: "How are yields paid out?",
        a: "Yields are credited to your account balance at the end of each execution cycle. You can leave them to compound into your next cycle or withdraw them to your payment method.",
    },
    {
        q: "Can I cancel a plan before the cycle ends?",
        a: "Plans are designed to run to the end of their execution cycle. Early cancellation terms depend on the specific plan. Contact support before requesting an early exit.",
    },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 * index }}
            className="border-b border-white/[0.06]"
        >
            <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpen(!open)}
            >
                <span
                    className="text-sm sm:text-base font-semibold text-white/80"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    {q}
                </span>
                <span className="text-white/30 text-lg leading-none shrink-0">{open ? "−" : "+"}</span>
            </button>
            {open && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-white/45 font-light leading-relaxed pb-5"
                >
                    {a}
                </motion.p>
            )}
        </motion.div>
    );
}

/* ─── Main ─── */
export default function AIPlansPageClient({ plans }: { plans: PlanData[] }) {
    return (
        <main className="bg-black text-white overflow-hidden">

            {/* ── Hero ── */}
            <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden pt-[70px]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-600/[0.06] rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/[0.04] rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-7"
                    >
                        <div className="w-8 h-8 rounded-xl bg-red-600/15 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold">
                            AI Capital Programs
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-8"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Algorithmic
                        <br />
                        <span className="text-white/25">Capital Strategies</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed mb-12"
                    >
                        AI-powered systematic trading strategies designed around capital scale, risk tolerance, and execution depth. Activate a plan, fund it, and let the algorithms work.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a
                            href="#plans"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector("#plans")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-8 py-3.5 rounded-full bg-red-600 text-white text-sm font-semibold tracking-[0.08em] uppercase hover:bg-red-500 transition-colors duration-300 cursor-pointer"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            View All Plans
                        </a>
                        <Link
                            href="/how-it-works"
                            className="px-8 py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            How It Works
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Key Stats ── */}
            <section className="relative w-full bg-zinc-950 border-t border-b border-white/[0.04] py-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                        {[
                            { value: plans.length, suffix: "", label: "Active Plans" },
                            { value: plans.reduce((lo, p) => Math.min(lo, p.returnLow), 999), suffix: "%", label: "Min. Target Return" },
                            { value: Math.max(...plans.map((p) => p.returnHigh ?? p.returnLow)), suffix: "%+", label: "Max. Target Return" },
                            { value: 24, suffix: "/7", label: "AI Operations" },
                        ].map((stat, i) => {
                            const ref = useRef<HTMLDivElement>(null);
                            const inView = useInView(ref, { once: true });
                            return (
                                <motion.div
                                    key={stat.label}
                                    ref={ref}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.08 * i }}
                                >
                                    <p
                                        className="text-2xl sm:text-3xl font-black text-white mb-1"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {stat.suffix === "/7" ? (
                                            <>24<span className="text-white/40">/7</span></>
                                        ) : (
                                            <AnimatedNumber target={stat.value} suffix={stat.suffix} active={inView} />
                                        )}
                                    </p>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── What are AI Plans ── */}
            <section className="relative w-full bg-zinc-50 py-20 sm:py-28 overflow-hidden">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-5">
                                What Are AI Plans
                            </span>
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black mb-6"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                Systematic Strategies.
                                <br />
                                <span className="text-black/30">Zero Manual Work.</span>
                            </h2>
                            <p className="text-base text-black/60 font-light leading-relaxed mb-6">
                                AI Plans are fully automated capital deployment strategies managed by algorithmic trading systems. You select a plan based on your capital size and risk profile, fund it, and the AI handles everything else — from signal generation to execution to yield distribution.
                            </p>
                            <p className="text-sm text-black/50 font-light leading-relaxed mb-8">
                                Unlike passive index funds, AI Plans use active position management across innovation-sector equities. Returns are generated through systematic trade cycles, not buy-and-hold appreciation.
                            </p>
                            <ul className="flex flex-col gap-3">
                                {[
                                    "No trading experience required",
                                    "Fully automated — AI executes all positions",
                                    "Returns credited at end of each execution cycle",
                                    "Multiple plans can run simultaneously",
                                ].map((pt) => (
                                    <li key={pt} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                                        <span className="text-sm text-black/70">{pt}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {[
                                { icon: TrendingUp, label: "Systematic Alpha", desc: "AI-generated returns uncorrelated with passive market exposure." },
                                { icon: ShieldCheck, label: "Risk Controls", desc: "Automated stop-loss and drawdown limits enforced every cycle." },
                                { icon: Cpu, label: "24/7 Execution", desc: "Algorithms operate continuously — no market hours, no downtime." },
                                { icon: BarChart2, label: "Transparent Cycles", desc: "Clear execution schedule: daily, weekly, or monthly distribution." },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="bg-white rounded-xl p-5 border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
                                            <Icon className="w-4 h-4 text-red-500" />
                                        </div>
                                        <h4
                                            className="text-sm font-bold text-black mb-1.5"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {item.label}
                                        </h4>
                                        <p className="text-xs text-black/55 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── How AI Plans Work ── */}
            <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Under The Hood
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white mb-4"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Six-Stage Execution
                            <br />
                            <span className="text-white/30">Pipeline</span>
                        </h2>
                        <p className="text-sm text-white/40 font-light max-w-xl mx-auto">
                            Every AI Plan runs through the same systematic pipeline — from initial signal to yield distribution.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {howItWorks.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.08 * i }}
                                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span
                                            className="text-2xl font-black text-white/[0.08]"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            0{i + 1}
                                        </span>
                                        <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-red-500" />
                                        </div>
                                    </div>
                                    <h3
                                        className="text-sm font-bold tracking-[0.04em] text-white mb-2"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-white/45 font-light leading-relaxed">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Execution Cycles ── */}
            <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-14"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Execution Cycles
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Choose Your
                            <br />
                            <span className="text-white/30">Trading Cadence</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {cycles.map((cycle, i) => {
                            const Icon = cycle.icon;
                            return (
                                <motion.div
                                    key={cycle.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 * i }}
                                    className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-9 h-9 rounded-xl bg-red-600/10 flex items-center justify-center">
                                            <Icon className="w-4.5 h-4.5 text-red-500" />
                                        </div>
                                        <h3
                                            className="text-base font-black tracking-[0.06em] uppercase text-white"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {cycle.label}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-white/50 font-light leading-relaxed mb-5">{cycle.desc}</p>
                                    <div className="pt-4 border-t border-white/[0.06]">
                                        <span className="text-[10px] tracking-[0.15em] uppercase text-white/25">Typical for: </span>
                                        <span className="text-xs text-white/45">{cycle.plans}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── All Plans Grid ── */}
            <section id="plans" className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            All Programs
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white mb-4"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {plans.length > 0 ? "Choose Your Plan" : "Plans Launching Soon"}
                        </h2>
                        {plans.length > 0 && (
                            <p className="text-sm text-white/40 font-light max-w-xl mx-auto">
                                All plans require account verification. Create a free account to activate.
                            </p>
                        )}
                    </motion.div>

                    {plans.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                            {plans.map((plan, i) => (
                                <PlanCard key={plan._id} plan={plan} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-white/20">
                            <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-sm">AI Plans are being configured. Check back soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Risk Architecture ── */}
            <section className="relative w-full bg-zinc-50 py-20 sm:py-28 overflow-hidden">
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
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-4">
                            Risk Architecture
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black mb-4"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Capital Preservation
                            <br />
                            <span className="text-black/30">Is Systemic</span>
                        </h2>
                        <p className="text-sm text-black/50 font-light max-w-xl mx-auto">
                            AI-driven risk management frameworks designed to protect capital across market cycles.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                        {riskBlocks.map((block, i) => (
                            <motion.div
                                key={block.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -3 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                                className="bg-white rounded-2xl p-7 border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300"
                            >
                                <span
                                    className="block text-4xl font-black text-black/10 mb-4"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    0{i + 1}
                                </span>
                                <h3
                                    className="text-sm font-bold text-black mb-2"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {block.title}
                                </h3>
                                <div className="w-7 h-[2px] bg-red-500/30 rounded-full mb-3" />
                                <p className="text-xs text-black/55 font-light leading-relaxed">{block.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 p-5 bg-black/[0.03] border border-black/[0.06] rounded-xl"
                    >
                        <AlertTriangle className="w-4 h-4 text-black/30 mt-0.5 shrink-0" />
                        <p className="text-xs text-black/40 font-light leading-relaxed">
                            <strong className="text-black/60 font-medium">Risk Disclaimer:</strong> AI Plans are algorithmic trading strategies. Returns are not guaranteed. Markets are volatile and losses are possible. Past performance of any plan does not guarantee future results. Invest only what you can afford to lose.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── AI Plans vs Projects ── */}
            <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Comparison
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            AI Plans vs
                            <br />
                            <span className="text-white/30">Project Investments</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="rounded-2xl overflow-hidden border border-white/[0.08]"
                    >
                        {/* Header */}
                        <div className="grid grid-cols-3 bg-white/[0.04] border-b border-white/[0.06]">
                            <div className="p-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium" />
                            <div className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Bot className="w-3.5 h-3.5 text-red-500" />
                                    <span
                                        className="text-xs font-bold text-white tracking-[0.06em]"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        AI Plans
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                                    <span
                                        className="text-xs font-bold text-white tracking-[0.06em]"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        Projects
                                    </span>
                                </div>
                            </div>
                        </div>

                        {comparison.map((row, i) => (
                            <div
                                key={row.aspect}
                                className={`grid grid-cols-3 border-b border-white/[0.04] last:border-0 ${
                                    i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                }`}
                            >
                                <div className="p-4 text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium flex items-center">
                                    {row.aspect}
                                </div>
                                <div className="p-4 text-xs text-white/55 font-light leading-relaxed border-l border-white/[0.04] flex items-center">
                                    {row.ai}
                                </div>
                                <div className="p-4 text-xs text-white/55 font-light leading-relaxed border-l border-white/[0.04] flex items-center">
                                    {row.projects}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
                    >
                        <Link
                            href="/projects"
                            className="flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.06em] uppercase text-white/40 hover:text-white transition-colors duration-300 py-3"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Explore Projects <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            FAQ
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Common Questions
                        </h2>
                    </motion.div>

                    {faqs.map((faq, i) => (
                        <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative w-full bg-black py-24 sm:py-32 border-t border-white/[0.04] overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/[0.06] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-7"
                    >
                        <div className="w-8 h-8 rounded-xl bg-red-600/15 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold">
                            Ready to Activate
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Let the AI
                        <br />
                        <span className="text-white/30">Trade for You</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-sm sm:text-base text-white/40 font-light leading-relaxed mb-12 max-w-xl mx-auto"
                    >
                        Create a free account, complete KYC verification, deposit funds, and activate any AI Plan in minutes.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/invest/signup"
                            className="px-10 py-4 rounded-full bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase hover:bg-red-500 transition-colors duration-300 shadow-[0_0_30px_rgba(232,33,39,0.2)]"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Create Free Account
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="px-10 py-4 rounded-full border border-white/20 text-white/60 text-sm font-semibold tracking-[0.1em] uppercase hover:border-white/40 hover:text-white transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            How It Works
                        </Link>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}

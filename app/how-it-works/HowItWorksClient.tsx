"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    UserCheck,
    Wallet,
    BarChart3,
    TrendingUp,
    ArrowDownToLine,
    Shield,
    Zap,
    Building2,
    Bot,
    ShoppingBag,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Lock,
    Globe,
    FileCheck,
    AlertTriangle,
} from "lucide-react";
import { useState } from "react";

/* ─── Types ─── */
interface PlanData {
    _id: string;
    name: string;
    capitalRange: string;
    returnLow: number;
    returnHigh?: number;
    returnContext: string;
    cycle: string;
    description: string;
    features: { text: string }[];
    highlighted: boolean;
    badge?: string;
}

interface TierData {
    _id: string;
    name: string;
    slug: string;
    description: string;
    benefits: string[];
    colorFrom: string;
    colorTo: string;
    accentColor: string;
    annualFee: number;
    requirements: string;
    sortOrder: number;
}

/* ─── FAQ ─── */
const faqs = [
    {
        q: "What is Musk Capital Inc?",
        a: "Musk Capital Inc is a private equity investment platform that provides accredited and retail investors access to pre-IPO stakes in Elon Musk's portfolio companies — including SpaceX, The Boring Company, Neuralink, and xAI — alongside AI-managed trading plans and a curated Tesla product shop.",
    },
    {
        q: "What is the minimum investment amount?",
        a: "The minimum deposit to begin investing is $1,000. Project tiers and AI plans have their own capital requirements, starting as low as $1,000 for entry-level plans and ranging up to $500,000+ for institutional-grade strategies.",
    },
    {
        q: "How do I receive my returns?",
        a: "Yield distributions are credited directly to your Musk Capital Inc account balance on the schedule defined by your plan or project (daily, weekly, or monthly). You can withdraw funds to your linked payment method at any time.",
    },
    {
        q: "Is my identity verification (KYC) mandatory?",
        a: "Yes. KYC verification is required before you can make deposits or investments. This is a regulatory requirement to protect investors and comply with financial compliance standards. The process typically takes under 24 hours.",
    },
    {
        q: "What is the difference between Projects and AI Plans?",
        a: "Projects give you a direct stake in a specific private company (SpaceX, Tesla, etc.) and earn yield tied to that company's funding milestones. AI Plans are systematic trading strategies managed algorithmically across diversified markets, with returns generated through position management rather than equity ownership.",
    },
    {
        q: "Can I withdraw my principal at any time?",
        a: "Withdrawal terms depend on your investment type. AI Plans operate on defined execution cycles (daily, weekly, or monthly). Project stakes follow the terms of the specific project tranche. All withdrawal requests are processed within 1–5 business days.",
    },
    {
        q: "What currencies and payment methods are accepted?",
        a: "We accept deposits via bank wire transfer and major cryptocurrencies (Bitcoin, Ethereum, USDT). Withdrawals are processed to the same method used for deposit.",
    },
    {
        q: "How are my funds protected?",
        a: "Funds are held in segregated accounts separate from operational capital. All platform activity is monitored for compliance, and KYC verification ensures the integrity of the investor base. Detailed terms are available in our compliance documentation.",
    },
];

/* ─── Steps ─── */
const steps = [
    {
        number: "01",
        icon: UserCheck,
        title: "Create Your Account",
        description: "Register in under 2 minutes with your email and basic information. Choose a secure password and confirm your email address to activate your account.",
        points: [
            "Email and password registration",
            "Instant account activation via email confirmation",
            "Full access to browse plans and projects before depositing",
        ],
    },
    {
        number: "02",
        icon: FileCheck,
        title: "Complete KYC Verification",
        description: "Submit your government-issued identity document and a selfie for identity verification. KYC is required to unlock deposits and investments.",
        points: [
            "Submit passport, national ID, or driver's license",
            "Liveness check (selfie) for anti-fraud protection",
            "Verification typically completed within 24 hours",
        ],
    },
    {
        number: "03",
        icon: Wallet,
        title: "Fund Your Account",
        description: "Deposit funds via bank wire or cryptocurrency. Minimum deposit is $1,000. Funds reflect in your account balance after confirmation.",
        points: [
            "Bank wire transfer (USD, EUR, GBP)",
            "Cryptocurrency deposits (BTC, ETH, USDT)",
            "Minimum deposit: $1,000",
        ],
    },
    {
        number: "04",
        icon: BarChart3,
        title: "Choose Your Investment",
        description: "Browse private equity projects or activate an AI trading plan. Select based on your capital size, risk appetite, and return expectations.",
        points: [
            "Private equity: SpaceX, Tesla, Neuralink, xAI, Boring Co.",
            "AI Plans: systematic strategies from $1K to $500K+",
            "Full project details, financials, and milestones before committing",
        ],
    },
    {
        number: "05",
        icon: TrendingUp,
        title: "Track Returns & Withdraw",
        description: "Monitor your portfolio from your dashboard in real time. Yield distributions are credited automatically per your plan's cycle.",
        points: [
            "Live portfolio dashboard with yield tracking",
            "Distributions credited on plan schedule (daily / weekly / monthly)",
            "Withdraw profits to your original payment method anytime",
        ],
    },
];

/* ─── Tracks ─── */
const tracks = [
    {
        icon: Building2,
        tag: "Private Equity",
        title: "Project Investments",
        description:
            "Gain direct stake exposure in pre-IPO companies operating at the frontier of technology. Each project offers tiered entry points with defined yield structures and milestone-linked distributions.",
        highlights: [
            "SpaceX Space City Fund",
            "Tesla Growth Equity",
            "Neuralink Series Fund",
            "xAI Ventures",
            "The Boring Company Infrastructure",
        ],
        cta: "Browse Projects",
        href: "/projects",
        accent: "#e82127",
    },
    {
        icon: Bot,
        tag: "AI Capital Programs",
        title: "AI Trading Plans",
        description:
            "Algorithmically managed systematic strategies that deploy capital across diversified positions. Plans are tiered by capital size and execution cycle, from daily micro-trades to long-cycle institutional strategies.",
        highlights: [
            "Automated 24/7 position management",
            "Multiple capital tiers and risk profiles",
            "Defined execution cycles (daily to monthly)",
            "No active management required",
            "Real-time performance tracking",
        ],
        cta: "View AI Plans",
        href: "/invest#plans",
        accent: "#ffffff",
    },
];

/* ─── Platform Pillars ─── */
const pillars = [
    {
        icon: Building2,
        title: "Private Equity Access",
        description:
            "Invest in pre-IPO stakes in SpaceX, Neuralink, xAI, and other Musk-portfolio companies not available on public markets.",
    },
    {
        icon: Bot,
        title: "AI Trading Plans",
        description:
            "Activate systematic AI-managed trading strategies scaled to your capital size, with returns distributed on a defined cycle.",
    },
    {
        icon: ShoppingBag,
        title: "Tesla Product Shop",
        description:
            "Order Tesla vehicles, Powerwall home energy systems, and solar products directly through the platform with integrated financing.",
    },
];

/* ─── Trust Signals ─── */
const trustItems = [
    { icon: Lock, title: "Segregated Funds", desc: "Your capital is held in accounts separate from operational funds." },
    { icon: FileCheck, title: "KYC Compliance", desc: "Full identity verification on all investors to meet financial regulations." },
    { icon: Globe, title: "Global Access", desc: "Serving investors in 50+ countries with multi-currency support." },
    { icon: Shield, title: "Secure Platform", desc: "End-to-end encrypted data handling and secure authentication." },
    { icon: AlertTriangle, title: "Risk Disclosure", desc: "All investments carry risk. Past returns do not guarantee future performance." },
    { icon: Zap, title: "24/7 Operations", desc: "AI systems and support operate continuously across all time zones." },
];

/* ─── FAQ Item ─── */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
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
                    className="text-sm sm:text-base font-semibold text-white/80 tracking-[0.02em]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    {q}
                </span>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                )}
            </button>
            {open && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-white/50 font-light leading-relaxed pb-5"
                >
                    {a}
                </motion.p>
            )}
        </motion.div>
    );
}

/* ─── Main Component ─── */
export default function HowItWorksClient({ plans, tiers }: { plans: PlanData[]; tiers: TierData[] }) {
    return (
        <main className="bg-black text-white overflow-hidden">
            {/* ── Hero ── */}
            <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden pt-[70px]">
                {/* Grid background */}
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
                {/* Red glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/[0.05] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Platform Guide
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-8"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        How It
                        <br />
                        <span className="text-white/30">Works</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed mb-12"
                    >
                        Musk Capital Inc gives you structured access to private equity in the world's most consequential technology companies — alongside AI-powered trading strategies and a curated product shop.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/invest/signup"
                            className="px-8 py-3.5 rounded-full bg-red-600 text-white text-sm font-semibold tracking-[0.08em] uppercase hover:bg-red-500 transition-colors duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Start Investing
                        </Link>
                        <Link
                            href="/projects"
                            className="px-8 py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Browse Projects
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Platform Pillars ── */}
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
                            What We Offer
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Three Ways to Participate
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pillars.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 * i }}
                                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                                        <Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                    <h3
                                        className="text-base font-bold tracking-[0.04em] text-white mb-3"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-white/50 font-light leading-relaxed">{p.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Step-by-Step ── */}
            <section className="relative w-full bg-zinc-50 py-20 sm:py-28 overflow-hidden">
                {/* Grid */}
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
                        className="mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-4">
                            Getting Started
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Five Steps to Your
                            <br />
                            <span className="text-black/30">First Investment</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-6">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.08 * i }}
                                    className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col sm:flex-row gap-6 sm:gap-8"
                                >
                                    {/* Number + icon */}
                                    <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 shrink-0">
                                        <span
                                            className="text-5xl sm:text-6xl font-black text-black/10 leading-none"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {step.number}
                                        </span>
                                        <div className="sm:mt-3 w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-red-600" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="w-8 h-[3px] bg-red-500 rounded-full mb-4 hidden sm:block" />
                                        <h3
                                            className="text-lg sm:text-xl font-bold tracking-[0.03em] text-black mb-3"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-black/60 font-light leading-relaxed mb-5">{step.description}</p>
                                        <ul className="flex flex-col gap-2">
                                            {step.points.map((pt) => (
                                                <li key={pt} className="flex items-start gap-2.5">
                                                    <CheckCircle2 className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                                                    <span className="text-sm text-black/70 leading-relaxed">{pt}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Two Investment Tracks ── */}
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
                        className="mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Investment Tracks
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Two Paths.
                            <br />
                            <span className="text-white/30">One Platform.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {tracks.map((track, i) => {
                            const Icon = track.icon;
                            return (
                                <motion.div
                                    key={track.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: 0.1 * i }}
                                    className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col hover:border-white/[0.15] transition-colors duration-400"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-white/60" />
                                        </div>
                                        <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-medium">
                                            {track.tag}
                                        </span>
                                    </div>

                                    <h3
                                        className="text-xl sm:text-2xl font-bold tracking-[0.04em] text-white mb-4"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {track.title}
                                    </h3>
                                    <p className="text-sm text-white/50 font-light leading-relaxed mb-8">{track.description}</p>

                                    <ul className="flex flex-col gap-3 mb-10 flex-1">
                                        {track.highlights.map((hl) => (
                                            <li key={hl} className="flex items-center gap-3">
                                                <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0" />
                                                <span className="text-sm text-white/60">{hl}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={track.href}
                                        className="block w-full text-center py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-300"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {track.cta}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── AI Plans ── */}
            {plans.length > 0 && (
                <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-16 text-center"
                        >
                            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                                AI Capital Programs
                            </span>
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white mb-4"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                Available AI Plans
                            </h2>
                            <p className="text-sm text-white/40 font-light max-w-xl mx-auto">
                                Systematic strategies scaled to your capital size. Activate any plan from your dashboard after funding your account.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={plan._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 * i }}
                                    className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                                        plan.highlighted
                                            ? "bg-white/[0.06] border border-white/[0.15]"
                                            : "bg-white/[0.03] border border-white/[0.07]"
                                    }`}
                                >
                                    {plan.badge && (
                                        <span className="absolute -top-3 left-6 text-[10px] tracking-[0.2em] uppercase font-semibold text-white/70 border border-white/20 rounded-full px-3 py-0.5 bg-black">
                                            {plan.badge}
                                        </span>
                                    )}

                                    <h3
                                        className="text-base font-bold tracking-[0.04em] text-white mb-1"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {plan.name}
                                    </h3>
                                    <p className="text-xs text-white/40 mb-5">{plan.capitalRange}</p>

                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span
                                            className="text-3xl font-black text-white"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {plan.returnHigh
                                                ? `${plan.returnLow}%–${plan.returnHigh}%`
                                                : `+${plan.returnLow}%`}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/30 mb-4">{plan.returnContext}</p>

                                    <div className="text-xs text-white/40 mb-5">
                                        <span className="text-white/20 uppercase tracking-[0.15em] text-[9px]">Cycle: </span>
                                        {plan.cycle}
                                    </div>

                                    <div className="w-full h-[1px] bg-white/[0.06] mb-5" />
                                    <p className="text-xs text-white/40 font-light leading-relaxed mb-6 flex-1">{plan.description}</p>

                                    <ul className="flex flex-col gap-2 mb-7">
                                        {plan.features.slice(0, 4).map((f) => (
                                            <li key={f.text} className="flex items-start gap-2">
                                                <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0" />
                                                <span className="text-xs text-white/50">{f.text}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/invest/signup"
                                        className={`block w-full text-center py-3 text-xs font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 ${
                                            plan.highlighted
                                                ? "bg-red-600 text-white hover:bg-red-500"
                                                : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                                        }`}
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        Activate Plan
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Membership Tiers ── */}
            {tiers.length > 0 && (
                <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                                Membership
                            </span>
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                Membership Tiers
                            </h2>
                            <p className="text-sm text-white/40 font-light mt-3 max-w-xl">
                                Unlock premium features and elevated access as your investment volume grows.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tiers.map((tier, i) => (
                                <motion.div
                                    key={tier._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 * i }}
                                    className="rounded-2xl p-7 border border-white/[0.08] flex flex-col"
                                    style={{
                                        background: `linear-gradient(135deg, ${tier.colorFrom}, ${tier.colorTo})`,
                                    }}
                                >
                                    {/* Accent bar */}
                                    <div
                                        className="w-8 h-[3px] rounded-full mb-5"
                                        style={{ backgroundColor: tier.accentColor }}
                                    />

                                    <h3
                                        className="text-base font-bold tracking-[0.06em] uppercase text-white mb-2"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {tier.name}
                                    </h3>

                                    {tier.requirements && (
                                        <p className="text-[10px] text-white/40 mb-4 tracking-wide">{tier.requirements}</p>
                                    )}

                                    {tier.description && (
                                        <p className="text-sm text-white/50 font-light leading-relaxed mb-6">{tier.description}</p>
                                    )}

                                    {tier.benefits.length > 0 && (
                                        <ul className="flex flex-col gap-2.5 flex-1">
                                            {tier.benefits.map((b) => (
                                                <li key={b} className="flex items-start gap-2.5">
                                                    <CheckCircle2
                                                        className="w-3.5 h-3.5 mt-[2px] shrink-0"
                                                        style={{ color: tier.accentColor }}
                                                    />
                                                    <span className="text-xs text-white/60 leading-relaxed">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {tier.annualFee > 0 && (
                                        <div className="mt-6 pt-5 border-t border-white/[0.08]">
                                            <span className="text-xs text-white/30 tracking-[0.15em] uppercase">Annual Fee</span>
                                            <p
                                                className="text-xl font-black text-white mt-1"
                                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                ${tier.annualFee.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Funds Flow ── */}
            <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16 text-center"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Money Movement
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            How Your Funds Flow
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                icon: ArrowDownToLine,
                                step: "01",
                                title: "Deposit",
                                desc: "Fund your account via bank wire or crypto. Minimum $1,000.",
                            },
                            {
                                icon: BarChart3,
                                step: "02",
                                title: "Invest",
                                desc: "Allocate to a project stake or activate an AI trading plan.",
                            },
                            {
                                icon: TrendingUp,
                                step: "03",
                                title: "Earn",
                                desc: "Yield distributions are credited to your balance per plan cycle.",
                            },
                            {
                                icon: Wallet,
                                step: "04",
                                title: "Withdraw",
                                desc: "Request withdrawal to your original payment method anytime.",
                            },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.12 * i }}
                                    className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center"
                                >
                                    {/* Connector line */}
                                    {i < 3 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-white/[0.12] z-10" />
                                    )}

                                    <span
                                        className="block text-4xl font-black text-white/[0.06] mb-3"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {item.step}
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-red-600/10 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                    <h3
                                        className="text-sm font-bold tracking-[0.08em] uppercase text-white mb-2"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Trust & Security ── */}
            <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Trust & Compliance
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Built for Security.
                            <br />
                            <span className="text-white/30">Designed for Trust.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {trustItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.08 * i }}
                                    className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                                        <Icon className="w-4 h-4 text-white/50" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-sm font-semibold text-white mb-1 tracking-[0.03em]"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
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
                        className="mb-14 text-center"
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

                    <div>
                        {faqs.map((faq, i) => (
                            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="relative w-full bg-black py-24 sm:py-32 border-t border-white/[0.04] overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/[0.06] rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Ready to Begin
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Start Your Investment
                        <br />
                        <span className="text-white/30">Journey Today</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-sm sm:text-base text-white/40 font-light leading-relaxed mb-12 max-w-xl mx-auto"
                    >
                        Create your account in minutes, complete verification, and gain access to private equity investments not available anywhere else.
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
                            href="/invest/login"
                            className="px-10 py-4 rounded-full border border-white/20 text-white/60 text-sm font-semibold tracking-[0.1em] uppercase hover:border-white/40 hover:text-white transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

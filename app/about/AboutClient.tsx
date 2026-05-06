"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import {
    Building2,
    Bot,
    ShoppingBag,
    Globe,
    Shield,
    Zap,
    Users,
    TrendingUp,
    Target,
    Eye,
    Heart,
    Award,
    ArrowRight,
    DollarSign,
    BarChart3,
    Rocket,
    Lock,
} from "lucide-react";

/* ─── Props ─── */
interface Props {
    totalProjects: number;
    totalRaised: number;
    totalInvestors: number;
    openProjects: number;
    planCount: number;
    tierCount: number;
}

/* ─── Animated counter ─── */
function AnimatedNumber({
    target,
    prefix = "",
    suffix = "",
    active,
    decimals = 0,
}: {
    target: number;
    prefix?: string;
    suffix?: string;
    active: boolean;
    decimals?: number;
}) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;
        let frame: number;
        const duration = 1400;
        const start = performance.now();
        const step = (now: number) => {
            const eased = 1 - Math.pow(1 - Math.min((now - start) / duration, 1), 3);
            setValue(parseFloat((eased * target).toFixed(decimals)));
            if (eased < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, active, decimals]);

    return (
        <>
            {prefix}
            {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
            {suffix}
        </>
    );
}

/* ─── Helpers ─── */
function fmtRaised(n: number): { value: number; suffix: string; decimals: number } {
    if (n >= 1_000_000_000) return { value: n / 1_000_000_000, suffix: "B+", decimals: 1 };
    if (n >= 1_000_000) return { value: n / 1_000_000, suffix: "M+", decimals: 1 };
    if (n >= 1_000) return { value: n / 1_000, suffix: "K+", decimals: 0 };
    return { value: n, suffix: "", decimals: 0 };
}

/* ─── Static data ─── */
const pillars = [
    {
        icon: Building2,
        title: "Private Equity Access",
        desc: "We structure investment vehicles that give retail and accredited investors direct stake exposure in pre-IPO companies operating at the frontier of technology — SpaceX, Neuralink, xAI, The Boring Company, and more.",
    },
    {
        icon: Bot,
        title: "AI Capital Programs",
        desc: "Our proprietary algorithmic trading strategies deploy capital across innovation-driven equities using systematic, risk-managed frameworks. Investors activate a plan, fund it, and the AI works continuously.",
    },
    {
        icon: ShoppingBag,
        title: "Premium Product Shop",
        desc: "A curated marketplace for Tesla vehicles, Powerwall home energy systems, and solar products — allowing our community to buy directly into the hardware that powers the energy transition.",
    },
];

const values = [
    {
        icon: Eye,
        title: "Transparency First",
        desc: "Every project shows its funding progress, investor count, yield structure, and risk level in full. No hidden fees, no opaque strategies.",
    },
    {
        icon: Shield,
        title: "Investor Protection",
        desc: "KYC verification, segregated fund accounts, and systematic risk controls exist for one reason: to protect your capital before anything else.",
    },
    {
        icon: Target,
        title: "Access for All",
        desc: "Pre-IPO private equity has historically been reserved for institutions and ultra-high-net-worth individuals. We believe that barrier should not exist.",
    },
    {
        icon: Zap,
        title: "Technology-Led",
        desc: "From algorithmic trading to AI risk management to real-time portfolio dashboards, every layer of this platform is built on technology — not guesswork.",
    },
    {
        icon: Heart,
        title: "Long-Term Alignment",
        desc: "We succeed only when our investors succeed. Our fee structure, risk architecture, and investment curation all reflect that singular alignment.",
    },
    {
        icon: Globe,
        title: "Global Perspective",
        desc: "Innovation is borderless. We serve investors across 50+ countries, accepting multi-currency deposits and offering globally relevant investment opportunities.",
    },
];

const timeline = [
    {
        year: "2021",
        title: "Foundation",
        desc: "Tesla Inc was founded with a single conviction: private equity in transformational technology should not be exclusive to institutions. The platform concept was developed.",
    },
    {
        year: "2022",
        title: "Platform Build",
        desc: "Full-stack development of the investment platform, AI trading infrastructure, and compliance framework. KYC integration, secure fund accounts, and the investor dashboard were built from scratch.",
    },
    {
        year: "2023",
        title: "First Projects Live",
        desc: "The SpaceX Space City Fund and The Boring Company Tunnel Project launched as the first live investment opportunities. Hundreds of early investors gained their first private equity exposure.",
    },
    {
        year: "2024",
        title: "AI Plans Launch",
        desc: "The AI Capital Programs division launched systematic trading strategies across multiple capital tiers. The shop division went live with Tesla vehicle and energy product orders.",
    },
    {
        year: "2025",
        title: "Scale & Expansion",
        desc: "Platform expanded to serve investors across 50+ countries. Membership tiers introduced. Neuralink, xAI, and DOGE investment vehicles added to the pipeline.",
    },
    {
        year: "2026",
        title: "Today",
        desc: "A fully integrated private equity, AI trading, and commerce platform. Multiple live projects, active AI plans, and a growing global investor community.",
    },
];

const team = [
    {
        initials: "MC",
        name: "Marcus Chen",
        role: "Chief Executive Officer",
        bio: "Former VP at Bridgewater Associates with 15 years in alternative investments and private equity structuring.",
    },
    {
        initials: "SR",
        name: "Sofia Reyes",
        role: "Chief Investment Officer",
        bio: "Ex-Goldman Sachs technology equity analyst. Specialist in pre-IPO valuation and venture-stage private markets.",
    },
    {
        initials: "JK",
        name: "James Kowalski",
        role: "Chief Technology Officer",
        bio: "Built algorithmic trading infrastructure at Two Sigma. Architect of the AI Capital Programs execution engine.",
    },
    {
        initials: "AL",
        name: "Amara Levi",
        role: "Head of Compliance",
        bio: "15 years in financial regulation across the SEC and private sector. Leads our KYC, AML, and investor protection frameworks.",
    },
    {
        initials: "DT",
        name: "Daniel Tran",
        role: "Head of Product",
        bio: "Previously built investor platforms at Robinhood and AngelList. Obsessed with making complex finance simple.",
    },
    {
        initials: "PW",
        name: "Priya Williams",
        role: "Head of Investor Relations",
        bio: "Former IR director at a $2B family office. Leads our investor communications, onboarding, and support operations.",
    },
];

const differentiators = [
    {
        icon: Lock,
        title: "Real Private Equity — Not Tokens",
        desc: "Our investment vehicles provide structured stake exposure in the actual companies, not synthetic derivatives or tokenised representations.",
    },
    {
        icon: Bot,
        title: "Proprietary AI Infrastructure",
        desc: "The AI Capital Programs are built on systems developed in-house — not third-party managed funds or copy-trading platforms.",
    },
    {
        icon: Award,
        title: "Curated Portfolio",
        desc: "We don't list every startup seeking capital. Every company in our portfolio is hand-selected based on defensible moat, leadership quality, and civilisational relevance.",
    },
    {
        icon: Users,
        title: "Community of Investors",
        desc: "Our investor base spans 50+ countries. Membership tiers provide elevated access, exclusive deals, and priority allocation for loyal long-term participants.",
    },
];

/* ─── Stat card with animated number ─── */
function StatCard({
    icon: Icon,
    label,
    target,
    prefix,
    suffix,
    decimals,
    index,
}: {
    icon: React.ElementType;
    label: string;
    target: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 * index }}
            className="text-center"
        >
            <Icon className="w-4 h-4 text-white/20 mx-auto mb-3" />
            <p
                className="text-2xl sm:text-3xl font-black text-white mb-1"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {target > 0 ? (
                    <AnimatedNumber
                        target={target}
                        prefix={prefix}
                        suffix={suffix}
                        active={inView}
                        decimals={decimals ?? 0}
                    />
                ) : (
                    <span className="text-white/20">—</span>
                )}
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">{label}</p>
        </motion.div>
    );
}

/* ─── Main ─── */
export default function AboutClient({
    totalProjects,
    totalRaised,
    totalInvestors,
    openProjects,
    planCount,
    tierCount,
}: Props) {
    const raised = fmtRaised(totalRaised);

    return (
        <main className="bg-black text-white overflow-hidden">

            {/* ── Hero ── */}
            <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden pt-[70px]">
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/[0.04] rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Our Story
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-8"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        About Tesla
                        <br />
                        <span className="text-white/25">Capital Inc</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        We are an AI-powered private equity and trading platform built on a single conviction: the most consequential investment opportunities of the 21st century should not be reserved for institutions.
                    </motion.p>
                </div>
            </section>

            {/* ── Live Platform Stats ── */}
            <section className="relative w-full bg-zinc-950 border-t border-b border-white/[0.04] py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                        <StatCard icon={Rocket} label="Portfolio Projects" target={totalProjects} index={0} />
                        <StatCard icon={BarChart3} label="Open to Invest" target={openProjects} index={1} />
                        <StatCard
                            icon={DollarSign}
                            label="Total Raised"
                            target={raised.value}
                            prefix="$"
                            suffix={raised.suffix}
                            decimals={raised.decimals}
                            index={2}
                        />
                        <StatCard icon={Users} label="Active Investors" target={totalInvestors} index={3} />
                        <StatCard icon={Bot} label="AI Plans" target={planCount} index={4} />
                        <StatCard icon={TrendingUp} label="Membership Tiers" target={tierCount} index={5} />
                    </div>
                </div>
            </section>

            {/* ── Mission & Vision ── */}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-5">
                                Our Mission
                            </span>
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black mb-6"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                Democratising
                                <br />
                                <span className="text-black/30">Private Markets</span>
                            </h2>
                            <p className="text-base text-black/60 font-light leading-relaxed mb-5">
                                For decades, pre-IPO equity in world-changing companies was gated behind accreditation requirements, minimum investments of $250,000+, and institutional intermediaries who captured most of the upside.
                            </p>
                            <p className="text-sm text-black/50 font-light leading-relaxed mb-5">
                                Tesla Inc exists to dismantle that structure. Through structured investment vehicles, tiered entry points from $1,000, and an AI-powered trading layer, we give every qualified investor access to the same opportunity set that institutions have always enjoyed.
                            </p>
                            <p className="text-sm text-black/50 font-light leading-relaxed">
                                Our mission is not charity — it is market efficiency. The most transformational companies deserve the broadest possible investor base, and investors deserve access to the most transformational companies.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-5">
                                Our Vision
                            </span>
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black mb-6"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                A World Where
                                <br />
                                <span className="text-black/30">Everyone Invests</span>
                            </h2>
                            <p className="text-base text-black/60 font-light leading-relaxed mb-5">
                                We envision a future where retail investors hold meaningful positions in the infrastructure of civilisation: the rockets that reach orbit, the tunnels that move cities, the AI systems that define the next century.
                            </p>
                            <p className="text-sm text-black/50 font-light leading-relaxed mb-8">
                                That future is not a distant ambition — it is what Tesla Inc is building right now, one verified investor and one funded project at a time.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { n: "50+", label: "Countries Served" },
                                    { n: "$1K", label: "Minimum Entry" },
                                    { n: "24/7", label: "AI Operations" },
                                    { n: "100%", label: "Segregated Funds" },
                                ].map((item) => (
                                    <div key={item.label} className="bg-white rounded-xl p-4 border border-black/[0.05]">
                                        <p
                                            className="text-xl font-black text-black mb-0.5"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {item.n}
                                        </p>
                                        <p className="text-[10px] tracking-[0.15em] uppercase text-black/40">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── What We Do ── */}
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
                            What We Do
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Three Products.
                            <br />
                            <span className="text-white/30">One Platform.</span>
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
                                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400 flex flex-col"
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
                                    <p className="text-sm text-white/50 font-light leading-relaxed flex-1">{p.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Our Story Timeline ── */}
            <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                            Company History
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Our Journey
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-[1px] bg-white/[0.08]" />

                        <div className="flex flex-col gap-10">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.08 * i }}
                                    className="flex gap-6 sm:gap-8"
                                >
                                    {/* Dot */}
                                    <div className="relative shrink-0 mt-1">
                                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative ${
                                            item.year === "2026"
                                                ? "border-red-500/50 bg-red-600/10"
                                                : "border-white/[0.12] bg-black"
                                        }`}>
                                            <span
                                                className={`text-[10px] font-black tracking-tight ${
                                                    item.year === "2026" ? "text-red-400" : "text-white/40"
                                                }`}
                                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                {item.year.slice(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pb-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className="text-xs font-black tracking-[0.15em] text-white/25 uppercase"
                                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                            >
                                                {item.year}
                                            </span>
                                            {item.year === "2026" && (
                                                <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase text-emerald-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Now
                                                </span>
                                            )}
                                        </div>
                                        <h3
                                            className="text-base font-bold text-white mb-2"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/45 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── What Makes Us Different ── */}
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
                            Why Tesla Inc
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            What Sets Us
                            <br />
                            <span className="text-white/30">Apart</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {differentiators.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.08 * i }}
                                    className="flex items-start gap-5 p-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-sm font-bold text-white mb-2 tracking-[0.03em]"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/45 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Our Values ── */}
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
                        className="mb-16"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-4">
                            Core Principles
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            What We
                            <br />
                            <span className="text-black/30">Believe In</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {values.map((v, i) => {
                            const Icon = v.icon;
                            return (
                                <motion.div
                                    key={v.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -3 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.08 * i }}
                                    className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                                        <Icon className="w-4.5 h-4.5 text-red-500" />
                                    </div>
                                    <h3
                                        className="text-sm font-bold text-black mb-2"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {v.title}
                                    </h3>
                                    <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3" />
                                    <p className="text-sm text-black/55 font-light leading-relaxed">{v.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Leadership Team ── */}
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
                            Leadership
                        </span>
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            The Team
                            <br />
                            <span className="text-white/30">Behind the Platform</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.08 * i }}
                                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] transition-colors duration-300"
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-5">
                                    <span
                                        className="text-sm font-black text-red-400"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {member.initials}
                                    </span>
                                </div>

                                <h3
                                    className="text-sm font-bold text-white mb-0.5"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {member.name}
                                </h3>
                                <p className="text-[10px] tracking-[0.15em] uppercase text-red-500/70 font-medium mb-4">
                                    {member.role}
                                </p>
                                <div className="w-6 h-[1px] bg-white/[0.1] mb-4" />
                                <p className="text-xs text-white/40 font-light leading-relaxed">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative w-full bg-zinc-950 py-24 sm:py-32 border-t border-white/[0.04] overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/[0.05] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Join Our Community
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Be Part of What
                        <br />
                        <span className="text-white/30">We're Building</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-sm sm:text-base text-white/40 font-light leading-relaxed mb-12 max-w-xl mx-auto"
                    >
                        Create a free account in minutes and gain access to private equity investments in the companies defining the next century.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                    >
                        <Link
                            href="/invest/signup"
                            className="px-10 py-4 rounded-full bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase hover:bg-red-500 transition-colors duration-300 shadow-[0_0_30px_rgba(232,33,39,0.2)]"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Create Free Account
                        </Link>
                        <Link
                            href="/markets"
                            className="px-10 py-4 rounded-full border border-white/20 text-white/60 text-sm font-semibold tracking-[0.1em] uppercase hover:border-white/40 hover:text-white transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Explore Markets
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex items-center justify-center gap-8 text-center"
                    >
                        {[
                            { href: "/how-it-works", label: "How It Works" },
                            { href: "/markets", label: "Markets" },
                            { href: "/ai-plans", label: "AI Plans" },
                            { href: "/projects", label: "Projects" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-1 text-xs text-white/25 hover:text-white/60 transition-colors duration-300"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {link.label} <ArrowRight className="w-3 h-3" />
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </section>

        </main>
    );
}

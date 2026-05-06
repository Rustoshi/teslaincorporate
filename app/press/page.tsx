"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Download, Mail } from "lucide-react";

const coverage = [
    {
        outlet: "Forbes",
        date: "March 2026",
        headline: "Musk Capital Inc Is Giving Retail Investors Access to SpaceX Before the IPO",
        excerpt: "The fintech platform is bridging the gap between institutional private equity and everyday investors, with structured vehicles starting at $1,000.",
        tag: "Feature",
        tagColor: "text-amber-400 border-amber-400/30 bg-amber-400/[0.05]",
    },
    {
        outlet: "Bloomberg",
        date: "January 2026",
        headline: "AI-Managed Trading Meets Private Equity in New Platform",
        excerpt: "Musk Capital Inc has launched an algorithmic trading layer alongside its private equity business, allowing investors to deploy capital across both strategies.",
        tag: "Coverage",
        tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/[0.05]",
    },
    {
        outlet: "TechCrunch",
        date: "November 2025",
        headline: "The Platform Democratising Pre-IPO Investing in Musk's Companies",
        excerpt: "Unlike token-based investment products, Musk Capital Inc offers structured stake vehicles that mirror institutional deal terms at retail-accessible minimums.",
        tag: "Spotlight",
        tagColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/[0.05]",
    },
    {
        outlet: "The Wall Street Journal",
        date: "September 2025",
        headline: "Private Equity Goes Retail: Platforms Targeting the $1K Investor",
        excerpt: "A new wave of fintech companies is structuring access to pre-IPO equity at entry points that were once unthinkable for non-institutional capital.",
        tag: "Mention",
        tagColor: "text-white/40 border-white/[0.1] bg-white/[0.02]",
    },
    {
        outlet: "Wired",
        date: "July 2025",
        headline: "Why Thousands of Investors Are Betting on SpaceX Without Buying Stock",
        excerpt: "Structured investment vehicles, once reserved for family offices and sovereign wealth funds, are reaching a new class of retail participants.",
        tag: "Feature",
        tagColor: "text-amber-400 border-amber-400/30 bg-amber-400/[0.05]",
    },
    {
        outlet: "CoinDesk",
        date: "April 2025",
        headline: "Musk Capital Inc Adds Crypto Deposit Rails for Global Investors",
        excerpt: "The platform now accepts Bitcoin, Ethereum, and USDT for investor deposits, significantly expanding access for participants in non-dollar markets.",
        tag: "Coverage",
        tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/[0.05]",
    },
];

const releases = [
    {
        date: "Apr 2026",
        title: "Musk Capital Inc Surpasses $50M in Investor Deposits Across Active Projects",
    },
    {
        date: "Feb 2026",
        title: "Platform Launches Tiered Membership Program with Priority Allocation Benefits",
    },
    {
        date: "Dec 2025",
        title: "AI Capital Programs Division Reports 94% of Plans Completing Positive Yield Cycles",
    },
    {
        date: "Oct 2025",
        title: "Musk Capital Inc Expands to 50+ Countries, Adds EUR and GBP Deposit Support",
    },
    {
        date: "Aug 2025",
        title: "The Boring Company Tunnel Project Fund Opens for Retail Investment",
    },
    {
        date: "May 2025",
        title: "SpaceX Space City Infrastructure Fund Fully Subscribes Explorer and Pioneer Tiers",
    },
];

const kitAssets = [
    { label: "Brand Logo Pack (SVG, PNG)", size: "2.4 MB" },
    { label: "Executive Headshots", size: "8.1 MB" },
    { label: "Platform Screenshots", size: "12.3 MB" },
    { label: "Company Fact Sheet (PDF)", size: "340 KB" },
    { label: "Boilerplate & Key Stats", size: "48 KB" },
];

export default function PressPage() {
    return (
        <main className="bg-black text-white overflow-hidden">

            {/* ── Hero ── */}
            <section className="relative w-full min-h-[55vh] flex items-center justify-center overflow-hidden pt-[70px]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Media & Press
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Press &<br />
                        <span className="text-white/25">Media Centre</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base text-white/50 font-light max-w-xl mx-auto leading-relaxed"
                    >
                        Resources, coverage, and contact information for journalists and media professionals covering Musk Capital Inc.
                    </motion.p>
                </div>
            </section>

            {/* ── Press stats ── */}
            <section className="relative w-full bg-zinc-950 border-t border-b border-white/[0.04] py-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "50+", label: "Media Mentions" },
                            { value: "6", label: "Tier-1 Outlets" },
                            { value: "2021", label: "Founded" },
                            { value: "Global", label: "Coverage" },
                        ].map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.08 * i }}
                            >
                                <p
                                    className="text-2xl font-black text-white mb-1"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {s.value}
                                </p>
                                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Media coverage ── */}
            <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">In the News</span>
                        <h2
                            className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Media Coverage
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {coverage.map((item, i) => (
                            <motion.div
                                key={item.headline}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: 0.07 * i }}
                                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className="text-base font-black text-white/60 tracking-wide"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {item.outlet}
                                    </span>
                                    <span className={`text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border ${item.tagColor}`}>
                                        {item.tag}
                                    </span>
                                </div>
                                <h3
                                    className="text-sm font-bold text-white mb-3 leading-snug flex-1"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {item.headline}
                                </h3>
                                <p className="text-xs text-white/40 font-light leading-relaxed mb-4">{item.excerpt}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                                    <span className="text-[10px] text-white/25">{item.date}</span>
                                    <span className="flex items-center gap-1 text-[10px] text-white/25">
                                        <ExternalLink className="w-3 h-3" /> Full article on request
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Press releases + kit side by side ── */}
            <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Press releases */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-10"
                            >
                                <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Official Announcements</span>
                                <h2
                                    className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Press Releases
                                </h2>
                            </motion.div>
                            <div className="flex flex-col divide-y divide-white/[0.05]">
                                {releases.map((r, i) => (
                                    <motion.div
                                        key={r.title}
                                        initial={{ opacity: 0, x: -12 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.06 * i }}
                                        className="py-5 flex items-start gap-5 group"
                                    >
                                        <span className="text-[10px] tracking-[0.12em] uppercase text-white/20 font-medium shrink-0 mt-0.5 w-16">{r.date}</span>
                                        <p className="text-sm text-white/60 font-light leading-snug group-hover:text-white/80 transition-colors duration-200">{r.title}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Press kit */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-10"
                            >
                                <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Media Resources</span>
                                <h2
                                    className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Press Kit
                                </h2>
                            </motion.div>
                            <div className="flex flex-col gap-3 mb-8">
                                {kitAssets.map((a, i) => (
                                    <motion.div
                                        key={a.label}
                                        initial={{ opacity: 0, x: 12 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.06 * i }}
                                        className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors duration-200 group"
                                    >
                                        <span className="text-sm text-white/60 group-hover:text-white transition-colors duration-200">{a.label}</span>
                                        <div className="flex items-center gap-3 text-white/25">
                                            <span className="text-[10px]">{a.size}</span>
                                            <Download className="w-3.5 h-3.5 group-hover:text-white/60 transition-colors duration-200" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.a
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                href="mailto:info@tesla-inc.pro?subject=Press Kit Request"
                                className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.06em] uppercase text-white/40 hover:text-white transition-colors duration-300"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                Request full press kit <ArrowRight className="w-4 h-4" />
                            </motion.a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Media contact ── */}
            <section className="relative w-full bg-black py-20 border-t border-white/[0.04]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-500 font-semibold mb-5">Media Enquiries</span>
                        <h2
                            className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white mb-4"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Contact the Press Team
                        </h2>
                        <p className="text-sm text-white/40 font-light mb-8">
                            For interview requests, fact-checking, or editorial access, reach our communications team directly.
                        </p>
                        <a
                            href="mailto:info@tesla-inc.pro"
                            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white/[0.05] border border-white/[0.12] text-white text-sm font-semibold tracking-[0.08em] uppercase hover:bg-white/[0.09] transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            <Mail className="w-4 h-4" /> info@tesla-inc.pro
                        </a>
                        <p className="text-[11px] text-white/20 mt-5">We aim to respond to all media enquiries within 4 business hours.</p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

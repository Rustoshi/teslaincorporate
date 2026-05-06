"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, FileCheck, AlertTriangle, Lock, Globe, Users } from "lucide-react";

const EFFECTIVE_DATE = "1 April 2026";
const COMPANY = "Musk Capital Inc";
const EMAIL = "compliance@tesla-inc.pro";

const pillars = [
    { icon: FileCheck, title: "KYC Verification", desc: "All investors must complete identity verification before depositing or investing. We verify government-issued ID, proof of address, and conduct liveness checks." },
    { icon: ShieldCheck, title: "AML Framework", desc: "We monitor all transactions for suspicious activity and report to relevant authorities as required. Our AML programme is reviewed and updated regularly." },
    { icon: Lock, title: "Segregated Funds", desc: "Investor capital is held in accounts segregated from our operational funds, protecting your money in the event of company insolvency." },
    { icon: Globe, title: "Sanctions Screening", desc: "All investors and transactions are screened against international sanctions lists including OFAC, UN, EU, and HMT lists prior to activation." },
    { icon: Users, title: "Investor Suitability", desc: "We assess investor suitability during onboarding to ensure products are appropriate for each investor's profile and risk tolerance." },
    { icon: AlertTriangle, title: "Risk Disclosure", desc: "We maintain comprehensive risk disclosures for all investment products. Investors are required to confirm they understand the risks before investing." },
];

const kycSections = [
    {
        heading: "Identity Verification",
        body: "All registered users must submit a valid government-issued identity document (passport, national ID, or driver's licence) and complete a liveness check before their account is approved for deposits and investments. Documents are verified by our KYC provider using automated and manual review processes.",
    },
    {
        heading: "Proof of Address",
        body: "Where required by risk assessment, users may be asked to submit a recent utility bill, bank statement, or official letter confirming their residential address. Documents must be dated within the last 90 days.",
    },
    {
        heading: "Enhanced Due Diligence",
        body: "Investors with high-value transactions, those in higher-risk jurisdictions, or Politically Exposed Persons (PEPs) are subject to enhanced due diligence, which may include source of funds verification and additional identity documentation.",
    },
    {
        heading: "Ongoing Monitoring",
        body: "KYC is not a one-time process. We conduct periodic re-verification of investor information and may request updated documents at any time to maintain compliance with applicable regulations.",
    },
];

const amlSections = [
    {
        heading: "Transaction Monitoring",
        body: "All deposits, withdrawals, and investment transactions are monitored for indicators of money laundering, terrorist financing, or other financial crime. Automated rules and manual review are used in combination.",
    },
    {
        heading: "Suspicious Activity Reporting",
        body: "Where we identify activity that gives rise to suspicion of money laundering or terrorist financing, we are legally required to file a Suspicious Activity Report (SAR) with the relevant financial intelligence unit. We are prohibited by law from informing you if such a report has been filed.",
    },
    {
        heading: "Cash and Anonymity Restrictions",
        body: "We do not accept cash deposits. Anonymous payment methods and privacy coins are not accepted. All deposits must be traceable to a verified source.",
    },
    {
        heading: "Sanctions Compliance",
        body: "We screen all investors and transactions against applicable sanctions lists at onboarding and on an ongoing basis. Accounts associated with sanctioned individuals, entities, or jurisdictions will be blocked and reported.",
    },
];

const riskDisclosures = [
    {
        title: "Capital Risk",
        desc: "All investments carry the risk of total or partial loss of invested capital. There is no guarantee that you will recover the amount you invest.",
    },
    {
        title: "Liquidity Risk",
        desc: "Private market investments are illiquid. You may not be able to exit your investment before the end of the applicable tranche or cycle period.",
    },
    {
        title: "Market Risk",
        desc: "AI trading strategies are exposed to market volatility. Returns from AI Plans depend on market conditions which cannot be predicted or guaranteed.",
    },
    {
        title: "Regulatory Risk",
        desc: "The regulatory environment for private market investments and algorithmic trading is evolving. Changes in regulation may affect the availability or structure of products on the Platform.",
    },
    {
        title: "Platform Risk",
        desc: "The Platform is operated by ${COMPANY}, a private company. In the event of insolvency, business disruption, or technical failure, access to your investments may be temporarily or permanently affected.",
    },
    {
        title: "Concentration Risk",
        desc: "Investing in a limited number of projects or a single AI Plan concentrates your exposure. Diversification across multiple investments is strongly recommended.",
    },
];

export default function CompliancePage() {
    return (
        <main className="bg-black text-white overflow-hidden">

            {/* ── Hero ── */}
            <section className="relative w-full min-h-[52vh] flex items-center justify-center overflow-hidden pt-[70px]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.015] rounded-full blur-[130px] pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-white/30 font-medium mb-6"
                    >
                        Legal &amp; Regulatory
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-5"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Compliance Framework
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base text-white/45 font-light max-w-xl mx-auto leading-relaxed"
                    >
                        Our commitment to regulatory compliance, investor protection, and financial integrity.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xs text-white/20 mt-4"
                    >
                        Effective date: {EFFECTIVE_DATE}
                    </motion.p>
                </div>
            </section>

            {/* ── Six pillars ── */}
            <section className="relative w-full bg-zinc-950 border-t border-white/[0.04] py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Overview</span>
                        <h2
                            className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Six Pillars of Compliance
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pillars.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.07 * i }}
                                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4">
                                        <Icon className="w-4.5 h-4.5 text-white/50" />
                                    </div>
                                    <h3
                                        className="text-sm font-bold text-white mb-2"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {p.title}
                                    </h3>
                                    <p className="text-xs text-white/40 font-light leading-relaxed">{p.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── KYC ── */}
            <section className="relative w-full bg-zinc-50 py-20 sm:py-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-4">Know Your Customer</span>
                        <h2
                            className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-black"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            KYC Policy
                        </h2>
                    </motion.div>
                    <div className="flex flex-col gap-8">
                        {kycSections.map((s, i) => (
                            <motion.div
                                key={s.heading}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.07 * i }}
                                className="bg-white rounded-2xl p-7 border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                            >
                                <h3
                                    className="text-sm font-bold text-black mb-3"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {s.heading}
                                </h3>
                                <div className="w-6 h-[2px] bg-red-500/40 rounded-full mb-4" />
                                <p className="text-sm text-black/55 font-light leading-relaxed">{s.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── AML ── */}
            <section className="relative w-full bg-black py-20 sm:py-24 border-t border-white/[0.04]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Anti-Money Laundering</span>
                        <h2
                            className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            AML Policy
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {amlSections.map((s, i) => (
                            <motion.div
                                key={s.heading}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.07 * i }}
                                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6"
                            >
                                <h3
                                    className="text-sm font-bold text-white mb-3"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {s.heading}
                                </h3>
                                <div className="w-6 h-[1px] bg-white/[0.1] mb-4" />
                                <p className="text-xs text-white/45 font-light leading-relaxed">{s.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Risk disclosures ── */}
            <section className="relative w-full bg-zinc-950 py-20 sm:py-24 border-t border-white/[0.04]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Investor Warnings</span>
                        <h2
                            className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Risk Disclosures
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 p-5 bg-amber-400/[0.06] border border-amber-400/20 rounded-xl mb-10"
                    >
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-amber-400/80 font-light leading-relaxed">
                            <strong className="font-semibold">Important:</strong> All investments involve risk. Do not invest money you cannot afford to lose. Past performance does not guarantee future results. These disclosures do not constitute financial advice.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {riskDisclosures.map((r, i) => (
                            <motion.div
                                key={r.title}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.07 * i }}
                                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6"
                            >
                                <h3
                                    className="text-sm font-bold text-white/80 mb-2"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {r.title}
                                </h3>
                                <p className="text-xs text-white/35 font-light leading-relaxed">{r.desc.replace("${COMPANY}", COMPANY)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact compliance ── */}
            <section className="relative w-full bg-black py-20 border-t border-white/[0.04]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/30 font-medium mb-5">Regulatory Enquiries</span>
                        <h2
                            className="text-2xl font-black uppercase tracking-[0.05em] text-white mb-4"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Contact Compliance
                        </h2>
                        <p className="text-sm text-white/40 font-light mb-8 max-w-md mx-auto">
                            For regulatory queries, legal notices, SAR-related communications, or investor protection concerns, contact our compliance team directly.
                        </p>
                        <a
                            href={`mailto:${EMAIL}`}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.05] border border-white/[0.12] text-white text-sm font-semibold tracking-[0.08em] uppercase hover:bg-white/[0.09] transition-all duration-300"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {EMAIL}
                        </a>
                        <div className="flex items-center justify-center gap-6 mt-10">
                            <Link href="/terms" className="text-xs text-white/25 hover:text-white/60 transition-colors duration-200">Terms of Service</Link>
                            <Link href="/privacy" className="text-xs text-white/25 hover:text-white/60 transition-colors duration-200">Privacy Policy</Link>
                            <Link href="/contact" className="text-xs text-white/25 hover:text-white/60 transition-colors duration-200">Contact</Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

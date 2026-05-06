"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EFFECTIVE_DATE = "1 April 2026";
const COMPANY = "Tesla Inc";
const EMAIL = "legal@tesla-inc.pro";

const sections = [
    {
        id: "acceptance",
        heading: "1. Acceptance of Terms",
        body: `By accessing or using the ${COMPANY} platform (the "Platform"), including any investment services, AI capital programs, or e-commerce features offered therein, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Platform.\n\nThese Terms constitute a legally binding agreement between you and ${COMPANY} ("we", "us", "our"). We reserve the right to modify these Terms at any time. Continued use of the Platform following notification of changes constitutes acceptance of the revised Terms.`,
    },
    {
        id: "eligibility",
        heading: "2. Eligibility",
        body: `You must be at least 18 years of age to use the Platform. By registering an account, you represent and warrant that:\n\n(a) You are at least 18 years old;\n(b) You have the legal capacity to enter into a binding agreement;\n(c) Your use of the Platform does not violate any applicable law or regulation in your jurisdiction;\n(d) You are not located in a jurisdiction where the receipt of investment services is prohibited.\n\nWe reserve the right to refuse service, close accounts, and remove content at our sole discretion.`,
    },
    {
        id: "accounts",
        heading: "3. Account Registration & Security",
        body: `To access investment features, you must register an account and complete identity verification (KYC). You are responsible for:\n\n(a) Providing accurate, current, and complete information during registration;\n(b) Maintaining the confidentiality of your account credentials;\n(c) All activity that occurs under your account;\n(d) Notifying us immediately of any unauthorised access.\n\nWe reserve the right to suspend or terminate accounts that we reasonably believe are being used fraudulently or in violation of these Terms.`,
    },
    {
        id: "investment-services",
        heading: "4. Investment Services",
        body: `4.1 Nature of Services. The Platform provides structured access to private equity investment vehicles and AI-managed trading programs. These are speculative financial products and carry significant risk, including possible total loss of invested capital.\n\n4.2 Not Financial Advice. Nothing on the Platform constitutes personalised financial, investment, legal, or tax advice. You should seek independent professional advice before making any investment decision.\n\n4.3 Returns. All projected yields, target returns, and performance estimates are forward-looking statements and are not guaranteed. Past performance of any plan or project does not predict future results.\n\n4.4 Liquidity. Private market investments are illiquid. Your ability to withdraw capital is subject to the terms of each specific investment product, execution cycle, or project tranche.`,
    },
    {
        id: "kyc",
        heading: "5. Identity Verification (KYC)",
        body: `In compliance with applicable anti-money laundering (AML) laws and know-your-customer (KYC) regulations, we are required to verify the identity of all investors before processing deposits or investments. You agree to:\n\n(a) Submit accurate identity documents upon request;\n(b) Complete liveness checks and any additional verification steps we deem necessary;\n(c) Notify us promptly of any changes to your personal information;\n(d) Acknowledge that failure to complete KYC will result in restrictions on your account.`,
    },
    {
        id: "deposits",
        heading: "6. Deposits, Withdrawals & Fees",
        body: `6.1 Deposits. Minimum deposits and accepted payment methods are displayed on the Platform and are subject to change. All deposits are subject to KYC verification before being credited.\n\n6.2 Withdrawals. Withdrawal requests are processed within 1–5 business days to the original payment method used for deposit. Withdrawals are subject to any plan-specific lock-up periods or execution cycle requirements.\n\n6.3 Fees. Any applicable platform fees, management fees, or performance fees will be disclosed prior to investment activation. ${COMPANY} reserves the right to update fee structures with reasonable notice.`,
    },
    {
        id: "prohibited",
        heading: "7. Prohibited Conduct",
        body: `You agree not to:\n\n(a) Use the Platform for any unlawful purpose or in violation of these Terms;\n(b) Attempt to gain unauthorised access to any part of the Platform or its infrastructure;\n(c) Engage in market manipulation, wash trading, or any other fraudulent activity;\n(d) Submit false or misleading identity documents;\n(e) Use automated tools, scrapers, or bots to access the Platform without our written consent;\n(f) Circumvent any security, access control, or compliance measures on the Platform.`,
    },
    {
        id: "intellectual-property",
        heading: "8. Intellectual Property",
        body: `All content on the Platform — including text, graphics, logos, software, and data — is the property of ${COMPANY} or its licensors and is protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable licence to access and use the Platform for its intended purpose. You may not reproduce, distribute, or create derivative works from any Platform content without our prior written consent.`,
    },
    {
        id: "disclaimers",
        heading: "9. Disclaimers & Limitation of Liability",
        body: `9.1 The Platform is provided "as is" and "as available" without warranties of any kind, express or implied.\n\n9.2 To the maximum extent permitted by applicable law, ${COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, loss of data, or loss of investment capital, arising from your use of the Platform.\n\n9.3 Our total aggregate liability to you for any claim arising out of or relating to these Terms shall not exceed the total fees paid by you to ${COMPANY} in the twelve months preceding the claim.`,
    },
    {
        id: "termination",
        heading: "10. Termination",
        body: `We may suspend or terminate your access to the Platform at any time, with or without cause, with or without notice, including if we reasonably believe you have violated these Terms. Upon termination, your right to use the Platform will immediately cease. Any outstanding investment positions, plan cycles, or withdrawal requests will be processed in accordance with the applicable product terms.`,
    },
    {
        id: "governing-law",
        heading: "11. Governing Law & Disputes",
        body: `These Terms shall be governed by and construed in accordance with applicable financial services law. Any disputes arising out of or in connection with these Terms shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration. Nothing in this clause prevents either party from seeking injunctive relief in a court of competent jurisdiction.`,
    },
    {
        id: "contact",
        heading: "12. Contact",
        body: `If you have questions about these Terms, please contact us at:\n\n${EMAIL}`,
    },
];

export default function TermsPage() {
    return (
        <main className="bg-black text-white overflow-hidden">

            {/* ── Hero ── */}
            <section className="relative w-full pt-[70px] pb-0">
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-white/30 font-medium mb-5"
                    >
                        Legal
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-4"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Terms of Service
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-sm text-white/30 font-light"
                    >
                        Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {EFFECTIVE_DATE}
                    </motion.p>
                </div>
            </section>

            {/* ── Content ── */}
            <section className="relative w-full pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Table of contents */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14 p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
                    >
                        <h2
                            className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Contents
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {sections.map((s) => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200 py-0.5"
                                >
                                    {s.heading}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sections */}
                    <div className="flex flex-col gap-12">
                        {sections.map((s, i) => (
                            <motion.div
                                key={s.id}
                                id={s.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.04 * i }}
                                className="scroll-mt-24"
                            >
                                <h2
                                    className="text-base sm:text-lg font-bold text-white mb-4 tracking-[0.02em]"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {s.heading}
                                </h2>
                                <div className="w-8 h-[2px] bg-red-500/30 rounded-full mb-5" />
                                {s.body.split("\n\n").map((para, j) => (
                                    <p key={j} className="text-sm text-white/50 font-light leading-relaxed mb-4 whitespace-pre-line">
                                        {para}
                                    </p>
                                ))}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs text-white/20">© 2026 {COMPANY}. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">Privacy Policy</Link>
                            <Link href="/compliance" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">Compliance</Link>
                            <Link href="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">Contact</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

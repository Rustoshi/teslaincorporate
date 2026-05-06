"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EFFECTIVE_DATE = "1 April 2026";
const COMPANY = "Tesla Inc";
const EMAIL = "privacy@tesla-inc.pro";

const sections = [
    {
        id: "overview",
        heading: "1. Overview",
        body: `${COMPANY} ("we", "us", "our") is committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, with whom we share it, and what rights you have in relation to it.\n\nThis policy applies to all users of the Platform, including visitors, registered investors, and any other individuals who interact with our services. By using the Platform, you consent to the practices described in this policy.`,
    },
    {
        id: "data-collected",
        heading: "2. Information We Collect",
        body: `2.1 Information You Provide\n- Account registration: name, email address, date of birth, country of residence, phone number\n- Identity verification (KYC): government-issued ID documents, selfie/liveness check images, proof of address\n- Financial information: deposit amounts, payment method details, transaction history\n- Communications: messages sent via our support channels or contact form\n\n2.2 Information We Collect Automatically\n- Usage data: pages visited, features used, time spent on Platform\n- Device data: IP address, browser type, operating system, device identifiers\n- Session data: login timestamps, session duration, click patterns\n\n2.3 Information from Third Parties\n- Identity verification providers: verification results and fraud signals\n- Payment processors: transaction confirmation and status\n- Analytics providers: aggregated, anonymised usage metrics`,
    },
    {
        id: "legal-basis",
        heading: "3. Legal Basis for Processing",
        body: `We process your personal data on the following legal bases:\n\n(a) Contract performance — to provide the services you have signed up for, including account management, investment processing, and support;\n(b) Legal obligation — to comply with KYC/AML regulations, tax reporting requirements, and other applicable laws;\n(c) Legitimate interests — to improve our services, prevent fraud, and ensure platform security;\n(d) Consent — where you have explicitly opted in to specific processing activities such as marketing communications.`,
    },
    {
        id: "how-we-use",
        heading: "4. How We Use Your Information",
        body: `We use your personal data to:\n\n- Create and manage your investor account\n- Verify your identity and comply with KYC/AML obligations\n- Process deposits, withdrawals, and investment transactions\n- Communicate with you about your account, investments, and platform updates\n- Detect, investigate, and prevent fraudulent activity\n- Improve Platform functionality, performance, and user experience\n- Comply with our legal and regulatory obligations\n- Respond to your support enquiries and communications`,
    },
    {
        id: "sharing",
        heading: "5. Sharing Your Information",
        body: `We do not sell your personal data. We share your information only in the following circumstances:\n\n5.1 Service Providers. We engage trusted third-party providers to support platform operations, including:\n- Identity verification (KYC) providers\n- Cloud infrastructure and hosting providers\n- Email and communication services (ZeptoMail / Zoho)\n- Analytics and monitoring services\n- Image hosting (Cloudinary)\n\nAll service providers are contractually required to process your data only on our instructions and in accordance with applicable data protection law.\n\n5.2 Legal Requirements. We may disclose your information if required to do so by law, court order, or regulatory authority, or where we believe disclosure is necessary to protect our legal rights or the safety of others.\n\n5.3 Business Transfers. In the event of a merger, acquisition, or sale of all or part of our business, your data may be transferred to the relevant party as part of that transaction.`,
    },
    {
        id: "retention",
        heading: "6. Data Retention",
        body: `We retain your personal data for as long as your account is active and for as long as necessary to comply with our legal obligations. Specifically:\n\n- Account and transaction data: retained for a minimum of 5 years following account closure to comply with AML regulations\n- KYC documents: retained for a minimum of 5 years following the end of the business relationship\n- Support communications: retained for 2 years\n- Usage and analytics data: retained in anonymised form indefinitely\n\nUpon expiry of the relevant retention period, data is securely deleted or anonymised.`,
    },
    {
        id: "security",
        heading: "7. Security",
        body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include:\n\n- End-to-end encryption for data in transit (TLS)\n- Encrypted storage for sensitive data at rest\n- Access controls limiting data access to authorised personnel\n- Regular security reviews and penetration testing\n- Incident response procedures\n\nHowever, no system is completely secure. You are responsible for maintaining the confidentiality of your account credentials and for notifying us immediately if you suspect unauthorised access.`,
    },
    {
        id: "your-rights",
        heading: "8. Your Rights",
        body: `Depending on your jurisdiction, you may have the following rights in relation to your personal data:\n\n- Access: request a copy of the personal data we hold about you\n- Rectification: request correction of inaccurate or incomplete data\n- Erasure: request deletion of your data (subject to legal retention obligations)\n- Restriction: request that we limit processing of your data in certain circumstances\n- Portability: receive your data in a structured, machine-readable format\n- Objection: object to processing based on legitimate interests\n- Withdraw consent: where processing is based on consent, withdraw it at any time\n\nTo exercise any of these rights, contact us at ${EMAIL}. We will respond within 30 days.`,
    },
    {
        id: "cookies",
        heading: "9. Cookies",
        body: `We use cookies and similar tracking technologies to maintain your session, remember your preferences, and gather analytics. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of the Platform.\n\nWe use the following categories of cookies:\n- Essential: required for Platform operation and cannot be disabled\n- Analytics: help us understand how users interact with the Platform (anonymised)\n- Functional: remember your preferences and settings`,
    },
    {
        id: "international",
        heading: "10. International Transfers",
        body: `We operate globally and your data may be transferred to, and processed in, countries other than your country of residence. Where we transfer data internationally, we ensure appropriate safeguards are in place, including standard contractual clauses or adequacy decisions recognised by applicable data protection authorities.`,
    },
    {
        id: "children",
        heading: "11. Children's Privacy",
        body: `The Platform is not directed at individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have collected data from a person under 18, we will delete that data promptly. If you believe we may have collected data from a child, please contact us at ${EMAIL}.`,
    },
    {
        id: "changes",
        heading: "12. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the effective date. We encourage you to review this policy periodically.`,
    },
    {
        id: "contact",
        heading: "13. Contact",
        body: `For privacy-related enquiries, data subject requests, or to raise a concern, contact our Data Privacy team at:\n\n${EMAIL}`,
    },
];

export default function PrivacyPage() {
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
                        Privacy Policy
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
                                    className="text-base sm:text-lg font-bold text-white mb-4"
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
                            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">Terms of Service</Link>
                            <Link href="/compliance" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">Compliance</Link>
                            <Link href="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">Contact</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

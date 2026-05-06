"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Headphones, Shield, ArrowRight, CheckCircle2, Send, AlertCircle } from "lucide-react";

const channels = [
    {
        icon: Headphones,
        title: "Investor Support",
        desc: "For account, deposit, withdrawal, KYC, or platform questions.",
        contact: "support@tesla-inc.pro",
        sla: "Response within 24 hours",
    },
    {
        icon: Mail,
        title: "General Enquiries",
        desc: "Partnerships, business development, and general information.",
        contact: "info@tesla-inc.pro",
        sla: "Response within 48 hours",
    },
    {
        icon: Shield,
        title: "Compliance & Legal",
        desc: "Regulatory queries, legal notices, and compliance matters.",
        contact: "compliance@tesla-inc.pro",
        sla: "Response within 2 business days",
    },
    {
        icon: MessageSquare,
        title: "Press & Media",
        desc: "Interview requests, press kit, editorial access.",
        contact: "press@tesla-inc.pro",
        sla: "Response within 4 business hours",
    },
];

const faqs = [
    { q: "How do I reset my password?", href: "/invest/forgot-password" },
    { q: "How do I complete KYC verification?", href: "/how-it-works" },
    { q: "What deposit methods are accepted?", href: "/how-it-works" },
    { q: "How do AI Plans work?", href: "/ai-plans" },
    { q: "What projects are open for investment?", href: "/projects" },
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<FormState>("idle");

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;
        setStatus("submitting");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed");
            setStatus("success");
        } catch {
            setStatus("error");
        }
    }

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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/[0.04] rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-base text-white/50 font-light max-w-lg mx-auto leading-relaxed"
                    >
                        Reach the right team directly, or send us a message and we'll route your enquiry for you.
                    </motion.p>
                </div>
            </section>

            {/* ── Contact channels ── */}
            <section className="relative w-full bg-zinc-950 border-t border-white/[0.04] py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {channels.map((ch, i) => {
                            const Icon = ch.icon;
                            return (
                                <motion.div
                                    key={ch.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.08 * i }}
                                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                                        <Icon className="w-4.5 h-4.5 text-red-500" />
                                    </div>
                                    <h3
                                        className="text-sm font-bold text-white mb-1"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {ch.title}
                                    </h3>
                                    <p className="text-xs text-white/40 font-light leading-relaxed mb-4 flex-1">{ch.desc}</p>
                                    <a
                                        href={`mailto:${ch.contact}`}
                                        className="text-xs text-white/60 hover:text-white transition-colors duration-200 mb-2 break-all"
                                    >
                                        {ch.contact}
                                    </a>
                                    <span className="text-[10px] text-white/20">{ch.sla}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Form + FAQ ── */}
            <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

                        {/* Form */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-10"
                            >
                                <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Send a Message</span>
                                <h2
                                    className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    We'll Get Back to You
                                </h2>
                            </motion.div>

                            {status === "error" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                >
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                    <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
                                </motion.div>
                            )}
                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-5" />
                                    <h3
                                        className="text-xl font-black text-white mb-3"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        Message Sent
                                    </h3>
                                    <p className="text-sm text-white/45 font-light">
                                        Thanks for reaching out. We'll respond to {form.email} shortly.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-5"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/35 mb-2">Full Name *</label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 focus:bg-white/[0.06] transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/35 mb-2">Email Address *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="you@example.com"
                                                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 focus:bg-white/[0.06] transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase text-white/35 mb-2">Subject</label>
                                        <select
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white/70 focus:outline-none focus:border-red-500/40 transition-all duration-200 appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">Select a subject…</option>
                                            <option value="Investor Support" className="bg-zinc-900">Investor Support</option>
                                            <option value="KYC Verification" className="bg-zinc-900">KYC Verification</option>
                                            <option value="Deposit / Withdrawal" className="bg-zinc-900">Deposit / Withdrawal</option>
                                            <option value="AI Plans" className="bg-zinc-900">AI Plans</option>
                                            <option value="Projects" className="bg-zinc-900">Projects</option>
                                            <option value="Membership" className="bg-zinc-900">Membership</option>
                                            <option value="Compliance" className="bg-zinc-900">Compliance / Legal</option>
                                            <option value="Partnership" className="bg-zinc-900">Partnership / Business</option>
                                            <option value="Press" className="bg-zinc-900">Press / Media</option>
                                            <option value="Other" className="bg-zinc-900">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase text-white/35 mb-2">Message *</label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="How can we help?"
                                            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 focus:bg-white/[0.06] transition-all duration-200 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {status === "submitting" ? "Sending…" : (<><Send className="w-4 h-4" /> Send Message</>)}
                                    </button>
                                </motion.form>
                            )}
                        </div>

                        {/* FAQ quick links */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-10"
                            >
                                <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">Self-Service</span>
                                <h2
                                    className="text-2xl sm:text-3xl font-black uppercase tracking-[0.05em] text-white"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Common Questions
                                </h2>
                            </motion.div>
                            <div className="flex flex-col divide-y divide-white/[0.05]">
                                {faqs.map((faq, i) => (
                                    <motion.div
                                        key={faq.q}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, delay: 0.07 * i }}
                                    >
                                        <Link
                                            href={faq.href}
                                            className="flex items-center justify-between py-4 group"
                                        >
                                            <span className="text-sm text-white/55 font-light group-hover:text-white transition-colors duration-200">
                                                {faq.q}
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors duration-200 shrink-0 ml-3" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl"
                            >
                                <p className="text-xs text-white/30 font-light leading-relaxed mb-3">
                                    For the fastest resolution, existing investors should log into their dashboard and use the in-app support chat for account-specific queries.
                                </p>
                                <Link
                                    href="/invest/login"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-white/40 hover:text-white transition-colors duration-200"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Log in to dashboard <ArrowRight className="w-3 h-3" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getReferralStats } from "@/app/dashboard/actions/referral";

const SITE_URL = "https://teslaincr.pro";

export default function ReferralsClient() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<"code" | "link" | null>(null);

    useEffect(() => {
        (async () => {
            const res = await getReferralStats();
            if (res.success) setData(res.data);
            setLoading(false);
        })();
    }, []);

    const referralLink = data ? `${SITE_URL}/invest/signup?ref=${data.referralCode}` : "";

    const copyToClipboard = (text: string, type: "code" | "link") => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const shareLinks = data
        ? {
              whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join Musk Space and start investing! Sign up with my referral link: ${referralLink}`)}`,
              telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join Musk Space and start investing!")}`,
              twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join Musk Space and start investing! ${referralLink}`)}`,
          }
        : {};

    if (loading) {
        return (
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <p className="text-white/40 text-center">Failed to load referral data.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <h1
                    className="text-lg font-bold tracking-[0.15em] uppercase text-white mb-8"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Referral Program
                </h1>

                {/* Referral Code & Link */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-6">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-3">
                        Your Referral Code
                    </p>
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-3xl font-bold tracking-[0.3em] font-mono text-white">
                            {data.referralCode}
                        </span>
                        <button
                            onClick={() => copyToClipboard(data.referralCode, "code")}
                            className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-lg text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition-all cursor-pointer"
                        >
                            {copied === "code" ? "Copied!" : "Copy"}
                        </button>
                    </div>

                    <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-3">
                        Your Referral Link
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <code className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-xs text-white/60 font-mono truncate">
                            {referralLink}
                        </code>
                        <button
                            onClick={() => copyToClipboard(referralLink, "link")}
                            className="px-4 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold tracking-widest uppercase text-white transition-all cursor-pointer shrink-0"
                        >
                            {copied === "link" ? "Copied!" : "Copy Link"}
                        </button>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-3 mt-5">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Share:</span>
                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-[#25D366] transition-all"
                        >
                            WhatsApp
                        </a>
                        <a
                            href={shareLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#0088cc]/10 border border-[#0088cc]/20 hover:bg-[#0088cc]/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-[#0088cc] transition-all"
                        >
                            Telegram
                        </a>
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] rounded-full text-[10px] font-bold tracking-widest uppercase text-white/60 transition-all"
                        >
                            Twitter
                        </a>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Total Referrals", value: data.totalReferrals, color: "text-white" },
                        { label: "Rewarded", value: data.rewardedReferrals, color: "text-green-500" },
                        { label: "Total Earnings", value: `$${data.referralEarnings.toLocaleString()}`, color: "text-green-500" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5"
                        >
                            <p className="text-[11px] tracking-[0.15em] uppercase text-white/40 font-medium mb-2">
                                {stat.label}
                            </p>
                            <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>
                                {stat.value}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-6">
                    <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-white mb-4"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { step: "1", title: "Share Your Code", desc: "Send your referral code or link to friends and family." },
                            { step: "2", title: "They Sign Up", desc: "When they register using your code, they're linked to your account." },
                            { step: "3", title: `Earn $${data.bonusPerReferral} Bonus`, desc: `Once they make their first deposit, you earn a $${data.bonusPerReferral} bonus instantly.` },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 text-sm font-bold shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                                    <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Referral Table */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                    <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-white mb-5"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Your Referrals
                    </h2>

                    {data.referrals.length === 0 ? (
                        <p className="text-sm text-white/30 text-center py-8">
                            No referrals yet. Share your code to get started!
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        <th className="text-[10px] tracking-widest uppercase text-white/30 font-medium pb-3 pr-4">Name</th>
                                        <th className="text-[10px] tracking-widest uppercase text-white/30 font-medium pb-3 pr-4">Joined</th>
                                        <th className="text-[10px] tracking-widest uppercase text-white/30 font-medium pb-3 pr-4">Status</th>
                                        <th className="text-[10px] tracking-widest uppercase text-white/30 font-medium pb-3 text-right">Bonus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.referrals.map((ref: any) => (
                                        <tr key={ref.id} className="border-b border-white/[0.04]">
                                            <td className="py-3 pr-4 text-sm text-white font-medium">{ref.refereeName}</td>
                                            <td className="py-3 pr-4 text-xs text-white/40">
                                                {new Date(ref.joinedAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    ref.status === "rewarded"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : "bg-amber-500/10 text-amber-500"
                                                }`}>
                                                    {ref.status === "rewarded" ? "Rewarded" : "Pending"}
                                                </span>
                                            </td>
                                            <td className="py-3 text-sm text-right font-mono">
                                                {ref.bonusAmount > 0 ? (
                                                    <span className="text-green-500">${ref.bonusAmount}</span>
                                                ) : (
                                                    <span className="text-white/20">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

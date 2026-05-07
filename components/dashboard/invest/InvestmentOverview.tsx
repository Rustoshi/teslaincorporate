"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface InvestmentOverviewProps {
    userData?: {
        totalBalance: number;
        totalProfits: number;
        totalInvested: number;
        activePlansCount: number;
        currency: string;
    }
    currency: string;
}

export default function InvestmentOverview({ userData, currency }: InvestmentOverviewProps) {
    const formattedBalance = userData?.totalBalance ? `${currency}${userData.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency}0.00`;
    const formattedProfits = userData?.totalProfits ? `${currency}${userData.totalProfits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency}0.00`;
    const formattedInvested = userData?.totalInvested ? `${currency}${userData.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency}0.00`;
    const activePlans = userData?.activePlansCount ? `${userData.activePlansCount}` : "0";

    const kpis = [
        {
            label: "Total Balance", value: formattedBalance, trend: "", positive: true,
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5m-4 0h4M17 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            label: "Total Profits", value: formattedProfits, trend: "", positive: true,
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            label: "Total Invested", value: formattedInvested, positive: true,
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            label: "Active Plans", value: activePlans, positive: true,
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
    ];

    const quickLinks = [
        {
            label: "Deposit", href: "/dashboard/deposit",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            )
        },
        {
            label: "Withdraw", href: "/dashboard/withdraw",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            )
        },
        {
            label: "Buy Crypto", href: "/dashboard/buy-crypto",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: "Transactions", href: "/dashboard/transactions",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: "Plans", href: "/dashboard/subscribe",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            label: "Invest", href: "/dashboard/projects",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: "Shopping", href: "?tab=shop",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            label: "Membership Card", href: "/dashboard/membership",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            label: "Connect Coinbase", href: "/dashboard/connect-coinbase",
            accent: true,
            icon: (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 1024 1024" fill="none">
                    <circle cx="512" cy="512" r="512" fill="currentColor" fillOpacity="0.3" />
                    <path d="M512.147 692C413.028 692 332.147 611.12 332.147 512C332.147 412.88 413.028 332 512.147 332C601.028 332 675.028 396.16 690.547 480H870.947C854.147 298.08 700.147 156 512.147 156C314.947 156 156.147 314.8 156.147 512C156.147 709.2 314.947 868 512.147 868C700.147 868 854.147 725.92 870.947 544H690.547C675.028 627.84 601.028 692 512.147 692Z" fill="currentColor"/>
                </svg>
            )
        },
        {
            label: "Join Our Community", href: "https://t.me/Teslabrokersincoffical",
            external: true,
            telegram: true,
            icon: (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            )
        },
        {
            label: "Referrals", href: "/dashboard/referrals",
            icon: (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
    ];

    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-[0.15em] uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Account Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full overflow-hidden">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.15] transition-colors duration-300 group relative overflow-hidden max-w-full w-full"
                    >
                        {/* Background Watermark Icon */}
                        <div className="absolute right-[-10px] bottom-[10px] text-white/[0.04] group-hover:text-white/[0.06] transition-colors duration-500 pointer-events-none w-20 h-20 rotate-[-15deg]">
                            {kpi.icon}
                        </div>

                        <div className="flex items-center gap-3 mb-3 relative z-10 w-full overflow-hidden">
                            <p className="text-[11px] tracking-[0.1em] uppercase text-white/40 font-medium truncate">
                                {kpi.label}
                            </p>
                        </div>
                        <div className="flex items-end justify-between w-full overflow-hidden">
                            <p className="text-2xl font-bold text-white tracking-tight truncate mr-2">
                                {kpi.value}
                            </p>
                            {kpi.trend && (
                                <span
                                    className={`text-xs font-semibold mb-1 shrink-0 ${kpi.positive ? "text-green-500" : "text-white/40"
                                        }`}
                                >
                                    {kpi.trend}
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Action Links */}
            <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 max-w-full overflow-hidden">
                {quickLinks.map((link, i) => {
                    const isAccent = (link as any).accent;
                    const isTelegram = (link as any).telegram;
                    const isExternal = (link as any).external;

                    const className = `flex items-center justify-center px-5 py-2.5 border transition-all rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase group truncate w-full ${
                        isTelegram
                            ? "bg-[#0088cc]/10 border-[#0088cc]/30 hover:border-[#0088cc] hover:bg-[#0088cc]/20 text-[#0088cc] hover:text-white"
                            : isAccent
                                ? "bg-[#0052FF]/10 border-[#0052FF]/30 hover:border-[#0052FF] hover:bg-[#0052FF]/20 text-[#0052FF] hover:text-white"
                                : "bg-transparent border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white/80 hover:text-white"
                    }`;

                    const iconClassName = `transition-colors mr-1 shrink-0 ${
                        isTelegram
                            ? "text-[#0088cc] group-hover:text-white"
                            : isAccent
                                ? "text-[#0052FF] group-hover:text-white"
                                : "text-white/50 group-hover:text-red-500"
                    }`;

                    return (
                        <motion.div
                            key={link.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                            className="w-full sm:w-auto overflow-hidden"
                        >
                            {isExternal ? (
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={className}
                                >
                                    <span className={iconClassName}>{link.icon}</span>
                                    <span className="truncate">{link.label}</span>
                                </a>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={className}
                                >
                                    <span className={iconClassName}>{link.icon}</span>
                                    <span className="truncate">{link.label}</span>
                                </Link>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

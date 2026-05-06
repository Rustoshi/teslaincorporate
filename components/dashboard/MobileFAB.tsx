"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileFAB() {
    const pathname = usePathname();

    const tabs = [
        {
            label: "Home",
            href: "/dashboard",
            icon: (
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: "Deposit",
            href: "/dashboard/deposit",
            icon: (
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            )
        },
        {
            label: "Plans",
            href: "/dashboard/plans",
            icon: (
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            label: "Profile",
            href: "/dashboard/settings",
            icon: (
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around items-center p-2 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-300 ${isActive
                                    ? "text-red-500 bg-red-500/10"
                                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                                }`}
                        >
                            {tab.icon}
                            <span className="text-[9px] font-bold tracking-widest uppercase">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

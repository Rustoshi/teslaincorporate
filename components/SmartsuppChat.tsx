"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        smartsupp: any;
        _smartsupp: any;
    }
}

type Props = {
    mode: "smartsupp" | "telegram";
    telegramUsername?: string;
};

export default function SupportWidget({ mode, telegramUsername }: Props) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    /* ── Smartsupp ── */
    useEffect(() => {
        if (mode !== "smartsupp" || isAdmin) return;
        if (window.smartsupp) return;

        window._smartsupp = window._smartsupp || {};
        window._smartsupp.key = "de8951291f28e7db64bdcbcda5432fa6f52889c8";
        window._smartsupp.offsetY = 112;

        const smartsupp = (window.smartsupp = function () {
            (smartsupp as any)._.push(arguments);
        });
        (smartsupp as any)._ = [];

        const s = document.getElementsByTagName("script")[0];
        const c = document.createElement("script");
        c.type = "text/javascript";
        c.charset = "utf-8";
        c.async = true;
        c.src = "https://www.smartsuppchat.com/loader.js?";
        s.parentNode?.insertBefore(c, s);
    }, [mode, isAdmin]);

    useEffect(() => {
        if (mode !== "smartsupp") return;
        if (typeof window !== "undefined" && window.smartsupp) {
            isAdmin ? window.smartsupp("chat:hide") : window.smartsupp("chat:show");
        }
    }, [isAdmin, mode]);

    if (isAdmin) return null;

    /* ── Telegram floating button ── */
    if (mode === "telegram" && telegramUsername) {
        return (
            <a
                href={`https://t.me/${telegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on Telegram"
                style={{ bottom: "24px", right: "24px" }}
                className="fixed z-[9999] flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
                {/* Telegram gradient background */}
                <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)" }}
                />
                {/* Telegram plane icon */}
                <svg
                    viewBox="0 0 24 24"
                    className="relative z-10 w-7 h-7 text-white"
                    fill="currentColor"
                >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
            </a>
        );
    }

    return null;
}

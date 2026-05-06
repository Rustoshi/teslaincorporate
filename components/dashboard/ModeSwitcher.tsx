"use client";

import { motion } from "framer-motion";

export type DashboardMode = "invest" | "shop";

interface ModeSwitcherProps {
    mode: DashboardMode;
    setMode: (mode: DashboardMode) => void;
}

export default function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
    return (
        <div className="flex bg-white/[0.05] border border-white/[0.1] rounded-full p-1 relative">
            {/* Background pill animation */}
            <motion.div
                className="absolute inset-y-1 left-1 bg-white/[0.1] rounded-full"
                initial={false}
                animate={{
                    width: mode === "invest" ? "100px" : "125px",
                    x: mode === "invest" ? 0 : "100px",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />

            {/* Invest Button */}
            <button
                onClick={() => setMode("invest")}
                className={`relative z-10 w-[100px] h-8 text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${mode === "invest" ? "text-white" : "text-white/40 hover:text-white/70"
                    }`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Investment
            </button>

            {/* Shop Button */}
            <button
                onClick={() => setMode("shop")}
                className={`relative z-10 w-[125px] h-8 text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${mode === "shop" ? "text-white" : "text-white/40 hover:text-white/70"
                    }`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Shopping
            </button>
        </div>
    );
}

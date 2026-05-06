"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProductHeroProps {
    id: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    primaryHref?: string;
    secondaryHref?: string;
    darkOverlay?: boolean;
}

export default function ProductHero({
    id,
    title,
    subtitle,
    backgroundImage,
    primaryButtonText = "Order Now",
    secondaryButtonText = "Learn More",
    primaryHref = "#",
    secondaryHref = "#",
    darkOverlay = true,
}: ProductHeroProps) {
    return (
        <section
            id={id}
            className="relative h-screen w-full flex flex-col items-center justify-between overflow-hidden snap-start"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Dark Overlay */}
            {darkOverlay && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            )}

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-16">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight text-center"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                    className="text-base sm:text-lg text-white/70 mt-3 tracking-wide text-center max-w-md px-4"
                >
                    {subtitle}
                </motion.p>
            </div>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pb-16 sm:pb-20 px-6 w-full max-w-lg mx-auto"
            >
                <Link
                    href={primaryHref}
                    className="w-full sm:w-auto min-w-[220px] text-center bg-white text-black text-[11px] font-semibold tracking-[0.15em] uppercase px-10 py-3 rounded-full hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                    {primaryButtonText}
                </Link>
                <Link
                    href={secondaryHref}
                    className="w-full sm:w-auto min-w-[220px] text-center bg-transparent border border-white/40 text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-10 py-3 rounded-full hover:bg-white/10 hover:border-white/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                    {secondaryButtonText}
                </Link>
            </motion.div>
        </section>
    );
}

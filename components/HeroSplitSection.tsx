"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSplitSectionProps {
    title: string;
    subtitle: string;
    bgImage: string;
    buttonText: string;
    buttonLink: string;
    isHovered: boolean;
    isDimmed: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    titleColor?: string;
    position: "top" | "bottom";
}

export default function HeroSplitSection({
    title,
    subtitle,
    bgImage,
    buttonText,
    buttonLink,
    isHovered,
    isDimmed,
    onMouseEnter,
    onMouseLeave,
    titleColor = "text-white",
    position,
}: HeroSplitSectionProps) {
    return (
        <motion.section
            className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-pointer will-change-transform scanline-overlay"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            animate={{
                opacity: isDimmed ? 0.4 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            {/* Background Image with Ken Burns */}
            <motion.div
                className="absolute inset-0 w-full h-full origin-center"
                initial={{ scale: 1.08 }}
                animate={{ scale: isHovered ? 1.06 : 1.0 }}
                transition={{ duration: 8, ease: "easeOut" }}
            >
                <Image
                    src={bgImage}
                    alt={title}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </motion.div>

            {/* Dark Overlay — lightens more aggressively on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
                animate={{ opacity: isHovered ? 0.4 : 0.85 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {/* Radial gradient for text contrast */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.4)_0%,_transparent_65%)] z-[5]" />

            {/* Content */}
            <div className={`relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-3xl ${position === "top" ? "pb-8" : "pt-8"}`}>
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.25em] ${titleColor} mb-2 sm:mb-3`}
                    style={{
                        textShadow: titleColor.includes("red")
                            ? "0 0 30px rgba(232,33,39,0.4), 0 2px 10px rgba(0,0,0,0.8)"
                            : "0 0 20px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.8)",
                    }}
                >
                    {title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                    className="text-xs sm:text-sm md:text-base text-white/60 font-light tracking-[0.15em] mb-6 sm:mb-8 max-w-md"
                >
                    {subtitle}
                </motion.p>

                {/* Glassmorphism Button */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="w-auto"
                >
                    <Link
                        href={buttonLink}
                        className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs sm:text-sm tracking-[0.15em] uppercase text-white/90 rounded-lg transition-all duration-500 ease-out bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-red-500/50 hover:bg-red-600/10 hover:text-white hover:shadow-[0_0_20px_rgba(232,33,39,0.2)] hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-red-500/30"
                    >
                        <span className="font-semibold whitespace-nowrap">{buttonText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
}

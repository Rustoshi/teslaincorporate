"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const TradingViewMarquee = dynamic(() => import("./TradingViewMarquee"), {
    ssr: false,
    loading: () => <div className="w-full h-10" />,
});

const slides = [
    { src: "/images/shop.avif", alt: "Tesla", panDirection: "left" },
    { src: "/images/hero1.jpg", alt: "SpaceX", panDirection: "right" },
    { src: "/images/hero2.jpg", alt: "SpaceX", panDirection: "left" },
    { src: "/images/hero3.jpg", alt: "SpaceX", panDirection: "right" },
];

const SLIDE_DURATION = 6000;

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
            {/* ─── Background Slideshow ─── */}
            <div className="absolute inset-0 z-0">
                {/* Slides — render all, only current is visible */}
                {slides.map((slide, index) => (
                    <div
                        key={slide.alt}
                        className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
                        style={{ opacity: index === currentSlide ? 1 : 0 }}
                    >
                        <div
                            className="absolute inset-[-2%] sm:inset-0"
                            style={{
                                animation: index === currentSlide
                                    ? `kenburns-${slide.panDirection} ${SLIDE_DURATION}ms linear forwards`
                                    : "none",
                            }}
                        >
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                                sizes="100vw"
                                unoptimized
                            />
                        </div>
                    </div>
                ))}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70 z-[1]" />
                {/* Center focus vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.2)_0%,_rgba(0,0,0,0.9)_100%)] z-[2]" />
            </div>

            {/* ─── Grid Overlay ─── */}
            <div
                className="absolute inset-0 z-[3] opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* ─── Hero Content ─── */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
                {/* Small label */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mb-6"
                >
                    <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/60 font-light border border-red-500/30 rounded-full px-5 py-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Private Market Access — From $1,000
                    </span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    className="text-[clamp(2rem,6vw,5rem)] font-black uppercase tracking-[0.08em] leading-[1.05] text-white mb-6 max-w-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Own a Stake in
                    <br />
                    <span className="text-red-500">Tomorrow's World</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-base sm:text-lg text-white/70 font-light max-w-xl leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                    Direct investment access to SpaceX Space City, The Boring Company Tunnel Network, and AI-powered capital programs — the infrastructure of the next century, open to everyone.
                </motion.p>

                {/* TradingView Marquee */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="w-full max-w-3xl mb-10 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-sm px-2 py-1 overflow-hidden"
                >
                    <TradingViewMarquee />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <button
                        onClick={() => document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" })}
                        className="group px-8 py-3.5 bg-red-600 text-white text-sm font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-400 ease-out hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_30px_rgba(232,33,39,0.25)]"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        View Opportunities →
                    </button>
                    <Link
                        href="/invest/signup"
                        className="px-8 py-3.5 text-sm font-semibold tracking-[0.1em] uppercase text-white rounded-full border border-white/30 transition-all duration-400 ease-out hover:border-red-500/50 hover:text-red-400 hover:scale-[1.02]"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Create Account
                    </Link>
                </motion.div>
            </div>

            {/* ─── Slide Indicator Dots ─── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((slide, i) => (
                    <button
                        key={slide.alt}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide
                            ? "bg-white w-6"
                            : "bg-white/30 hover:bg-white/50 w-1.5"
                            }`}
                        aria-label={`Show ${slide.alt}`}
                    />
                ))}
            </div>
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "AI Plans", href: "/ai-plans" },
    { label: "Markets", href: "/markets" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${scrolled
                ? "bg-black/95 backdrop-blur-md border-b border-white/[0.06]"
                : "bg-transparent"
                }`}
            style={{ height: 70 }}
        >
            <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/invest"
                    className="font-[var(--font-montserrat)] text-base sm:text-lg font-bold tracking-[0.25em] uppercase text-white hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Tesla <span className="text-red-500">Inc</span>
                </Link>

                {/* Center Links — desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="group relative text-sm tracking-[0.08em] text-white/70 hover:text-white transition-colors duration-300"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 ease-out" />
                        </Link>
                    ))}
                </div>

                {/* Right — auth buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/invest/login"
                        className="text-sm tracking-wide text-white/70 hover:text-white transition-colors duration-300"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                        Login
                    </Link>
                    <Link
                        href="/invest/signup"
                        className="text-sm tracking-[0.08em] px-5 py-2 rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-400 ease-out"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
                    <span className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/[0.06] px-6 pb-6 pt-4 flex flex-col gap-4"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm tracking-wide text-white/70 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.06]">
                        <Link href="/invest/login" className="text-sm text-white/70 hover:text-white">
                            Login
                        </Link>
                        <Link
                            href="/invest/signup"
                            className="text-sm text-center px-5 py-2.5 rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}

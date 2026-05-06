"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function ShopNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
                    ? "bg-white/95 backdrop-blur-xl border-b border-black/[0.05] shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <nav className="max-w-[1800px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className={`text-sm font-bold tracking-[0.3em] uppercase shrink-0 transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Tesla <span className="text-red-500">Inc</span>
                    </Link>

                    {/* Center Nav - Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { label: "Vehicles", href: "#model-s" },
                            { label: "Energy", href: "#solar-panels" },
                            { label: "Shop", href: "/shop" },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${scrolled ? "text-black/60 hover:text-black" : "text-white/80 hover:text-white"}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/invest/login"
                            className={`hidden sm:block text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${scrolled ? "text-black/60 hover:text-black" : "text-white/80 hover:text-white"}`}
                        >
                            Account
                        </Link>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`md:hidden transition-colors duration-300 ${scrolled ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[99] flex flex-col items-center justify-center gap-8"
                    onClick={() => setMenuOpen(false)}
                >
                    {[
                        { label: "Vehicles", href: "#model-s" },
                        { label: "Energy", href: "#solar-panels" },
                        { label: "Shop", href: "/shop" },
                        { label: "Account", href: "/invest/login" },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-lg font-semibold tracking-[0.2em] uppercase text-black/70 hover:text-black transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </motion.div>
            )}
        </>
    );
}

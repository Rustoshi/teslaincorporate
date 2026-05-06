"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardNavbarProps {
    onMenuToggle: () => void;
}

export default function DashboardNavbar({ onMenuToggle }: DashboardNavbarProps) {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null); // Added for profile dropdown

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close notifications when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            // Close profile dropdown when clicking outside
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitials = session?.user?.firstName && session?.user?.lastName
        ? `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(0)}`
        : session?.user?.firstName
            ? session.user.firstName.charAt(0)
            : "JD"; // Default if no session or name

    return (
        <header
            className={`fixed top-0 left-0 right-0 md:left-64 z-50 h-16 flex items-center justify-between px-6 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md border-b border-white/[0.06]" : "bg-transparent"
                }`}
        >
            {/* Mobile Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="p-2 -ml-2 text-white/60 hover:text-white transition-colors md:hidden"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <Link
                    href="/dashboard"
                    className="md:hidden text-sm font-bold tracking-[0.25em] uppercase text-white"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Tesla <span className="text-red-500">Inc</span>
                </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`w-8 h-8 flex items-center justify-center transition-colors relative ${isNotificationsOpen ? "text-white" : "text-white/40 hover:text-white"}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {/* Unread indicator (hidden when empty) */}
                        {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black animate-pulse"></span> */}
                    </button>

                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
                            >
                                <div className="p-4 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
                                    <h3 className="text-xs font-bold tracking-widest uppercase text-white">Notifications</h3>
                                    <button className="text-[9px] font-bold text-white/40 hover:text-white uppercase tracking-wider transition-colors">Mark all read</button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    <div className="p-8 flex flex-col items-center justify-center text-center">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        </div>
                                        <p className="text-[11px] text-white/40 tracking-wider">No new notifications</p>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-white/[0.05] bg-white/[0.01] flex justify-center">
                                    <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">View All Archive</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* Settings */}
                <button className="w-8 h-8 hidden sm:flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-red-600/80 flex items-center justify-center text-xs font-bold tracking-wide text-white uppercase">
                    {userInitials}
                </div>
            </div>
        </header>
    );
}

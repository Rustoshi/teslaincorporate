"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError(res.error);
                setIsLoading(false);
                return;
            }

            // Success redirect
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-black flex items-start sm:items-center justify-center px-6 py-20 pt-24 sm:py-24 overflow-y-auto">
            {/* Subtle radial glow */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,33,39,0.03)_0%,_transparent_60%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link
                        href="/invest"
                        className="text-lg font-bold tracking-[0.25em] uppercase text-white inline-block"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Meta <span className="text-red-500">Wealth</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
                    {/* Header */}
                    <div className="mb-8">
                        <h1
                            className="text-2xl font-bold tracking-[0.04em] text-white mb-2"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Welcome back
                        </h1>
                        <p className="text-sm text-white/40 font-light mb-4">
                            Access your investment dashboard
                        </p>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-medium tracking-wide">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="john.doe@example.com"
                                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs tracking-wide uppercase"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link
                                href="/invest/forgot-password"
                                className="text-xs text-white/30 hover:text-white/60 transition-colors duration-300"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(232,33,39,0.2)] mt-2 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-[1px] bg-white/[0.06]" />
                        <span className="text-[11px] text-white/20 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-[1px] bg-white/[0.06]" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-white/40 font-light">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/invest/signup"
                            className="text-white/70 hover:text-white transition-colors duration-300 font-medium"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

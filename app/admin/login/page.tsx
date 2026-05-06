"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                source: "admin",
            });

            if (result?.error) {
                setError(result.error === "CredentialsSignin" ? "Invalid admin credentials." : result.error);
                setLoading(false);
            } else {
                // NextAuth's token.role logic handles the redirect/auth block in middleware if this is actually just a normal user.
                // The middleware redirects users back to /admin/login if role === 'user'
                router.push("/admin/dashboard");
            }
        } catch (err) {
            setError("A system error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col font-sans relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Topbar Logo */}
            <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-center md:justify-start">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-[0.25em] uppercase text-white hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Tesla <span className="text-red-500">Inc</span>
                </Link>
            </div>

            {/* Login Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10 w-full">
                <div className="w-full max-w-md">

                    <div className="text-center mb-10">
                        <h1
                            className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase text-white mb-3"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Admin Control Panel
                        </h1>
                        <p className="text-sm text-white/50 tracking-wide font-medium">
                            Secure access for platform management.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-white/50 uppercase mb-2 ml-1">
                                    Admin Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-white/50 uppercase mb-2 ml-1">
                                    Secure Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-[56px]"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex items-center justify-center gap-2">
                        <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Session recorded & encrypted</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

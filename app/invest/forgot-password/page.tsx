"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();

    // State machine: 1 = Email, 2 = Verify OTP, 3 = Reset Password
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form Data
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send reset code.");

            setSuccessMsg("If an account exists, a 6-digit code has been sent.");
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Invalid or expired OTP.");

            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to reset password.");

            setSuccessMsg("Password reset successfully. Redirecting to login...");
            setTimeout(() => {
                router.push("/invest/login");
            }, 2000);

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 py-24">
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

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
                    {/* Back Button */}
                    {step === 1 ? (
                        <Link href="/invest/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-6">
                            <ChevronLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    ) : (
                        <button onClick={() => setStep(step === 3 ? 2 : 1)} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-6">
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-[0.04em] text-white mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                            {step === 1 && "Reset Password"}
                            {step === 2 && "Enter Code"}
                            {step === 3 && "New Password"}
                        </h1>
                        <p className="text-sm text-white/40 font-light mb-4">
                            {step === 1 && "Enter your email to receive a recovery code."}
                            {step === 2 && "Enter the 6-digit code sent to your email."}
                            {step === 3 && "Please enter your new secure password."}
                        </p>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-medium tracking-wide">
                                {error}
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-xs font-medium tracking-wide">
                                {successMsg}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Request OTP */}
                            {step === 1 && (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSendOTP}
                                    className="flex flex-col gap-5"
                                >
                                    <div>
                                        <label htmlFor="email" className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2">
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
                                    <SubmitButton isLoading={isLoading} text="Send Recovery Code" />
                                </motion.form>
                            )}

                            {/* STEP 2: Verify OTP */}
                            {step === 2 && (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleVerifyOTP}
                                    className="flex flex-col gap-5"
                                >
                                    <div>
                                        <label htmlFor="otp" className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2">
                                            6-Digit Code
                                        </label>
                                        <input
                                            id="otp"
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
                                            required
                                            placeholder="000000"
                                            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder:text-white/10 outline-none focus:border-white/30 transition-colors duration-300"
                                        />
                                    </div>
                                    <SubmitButton isLoading={isLoading} text="Verify Code" />
                                </motion.form>
                            )}

                            {/* STEP 3: Reset Password */}
                            {step === 3 && (
                                <motion.form
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleResetPassword}
                                    className="flex flex-col gap-5"
                                >
                                    <div>
                                        <label htmlFor="newPassword" className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
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
                                    <SubmitButton isLoading={isLoading} text="Reset Password" />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function SubmitButton({ isLoading, text }: { isLoading: boolean, text: string }) {
    return (
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
                    Processing...
                </>
            ) : text}
        </button>
    );
}

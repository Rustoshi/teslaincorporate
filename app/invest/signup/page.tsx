"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { countries } from "@/lib/countries";

const currencies = ["USD", "GBP", "EUR", "CAD", "AUD", "ZAR", "INR", "BRL", "JPY", "SGD", "AED", "CHF"];

const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300";

const labelClass =
    "block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2";

const selectClass =
    "w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white font-light outline-none focus:border-white/30 transition-colors duration-300 appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white";

export default function SignupPage() {
    const router = useRouter();

    // Step 1 = Registration form, Step 2 = OTP verification
    const [step, setStep] = useState<1 | 2>(1);

    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        country: "",
        currency: "",
        phone: "",
        password: "",
    });
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const update = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    // Step 1: Submit registration form → sends OTP to email
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong. Please try again.");
            }

            setSuccessMsg("A 6-digit verification code has been sent to your email.");
            setStep(2);

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP → creates account + auto sign-in
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/verify-registration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, otp })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Verification failed. Please try again.");
            }

            // Auto sign-in and redirect to dashboard
            const result = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                router.push("/invest/login");
            } else {
                router.push("/dashboard");
            }

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to resend code.");
            }

            setSuccessMsg("A new verification code has been sent to your email.");
            setOtp("");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
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
                className="relative w-full max-w-lg"
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
                        {step === 2 && (
                            <button
                                onClick={() => { setStep(1); setError(""); setSuccessMsg(""); setOtp(""); }}
                                className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-5"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                        )}

                        <h1
                            className="text-2xl font-bold tracking-[0.04em] text-white mb-2"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {step === 1 ? "Create your account" : "Verify your email"}
                        </h1>
                        <p className="text-sm text-white/40 font-light mb-4">
                            {step === 1
                                ? "Start building your portfolio today"
                                : `Enter the 6-digit code sent to ${form.email}`}
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

                    <AnimatePresence mode="wait">
                        {/* ── STEP 1: Registration Form ── */}
                        {step === 1 && (
                            <motion.form
                                key="step-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5"
                            >
                                {/* Email Row */}
                                <div>
                                    <label htmlFor="email" className={labelClass}>
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        required
                                        placeholder="john.doe@example.com"
                                        className={inputClass}
                                    />
                                </div>
                                {/* Name Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label htmlFor="firstName" className={labelClass}>
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={form.firstName}
                                            onChange={(e) => update("firstName", e.target.value)}
                                            required
                                            placeholder="John"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className={labelClass}>
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={form.lastName}
                                            onChange={(e) => update("lastName", e.target.value)}
                                            required
                                            placeholder="Doe"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Gender + DOB Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label htmlFor="gender" className={labelClass}>
                                            Gender
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="gender"
                                                value={form.gender}
                                                onChange={(e) => update("gender", e.target.value)}
                                                required
                                                className={`${selectClass} ${!form.gender ? "text-white/20" : ""}`}
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">▼</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="dob" className={labelClass}>
                                            Date of Birth
                                        </label>
                                        <input
                                            id="dob"
                                            type="date"
                                            value={form.dob}
                                            onChange={(e) => update("dob", e.target.value)}
                                            required
                                            className={`${inputClass} !px-3 sm:!px-4 ${!form.dob ? "text-white/20" : ""} w-full box-border`}
                                            style={{ colorScheme: "dark" }}
                                        />
                                    </div>
                                </div>

                                {/* Country + Currency Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label htmlFor="country" className={labelClass}>
                                            Country
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="country"
                                                value={form.country}
                                                onChange={(e) => update("country", e.target.value)}
                                                required
                                                className={`${selectClass} ${!form.country ? "text-white/20" : ""}`}
                                            >
                                                <option value="" disabled>Select</option>
                                                {countries.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">▼</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="currency" className={labelClass}>
                                            Currency
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="currency"
                                                value={form.currency}
                                                onChange={(e) => update("currency", e.target.value)}
                                                required
                                                className={`${selectClass} ${!form.currency ? "text-white/20" : ""}`}
                                            >
                                                <option value="" disabled>Select</option>
                                                {currencies.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">▼</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className={labelClass}>
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                        required
                                        placeholder="+1 (555) 000-0000"
                                        className={inputClass}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className={labelClass}>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={form.password}
                                            onChange={(e) => update("password", e.target.value)}
                                            required
                                            placeholder="Min. 8 characters"
                                            minLength={8}
                                            className={`${inputClass} pr-12`}
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

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(232,33,39,0.2)] mt-2 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner />
                                            Sending Verification Code...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {/* ── STEP 2: OTP Verification ── */}
                        {step === 2 && (
                            <motion.form
                                key="step-otp"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleVerifyOtp}
                                className="flex flex-col gap-5"
                            >
                                {/* OTP Input */}
                                <div>
                                    <label htmlFor="otp" className={labelClass}>
                                        6-Digit Code
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        required
                                        autoFocus
                                        placeholder="000000"
                                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder:text-white/10 outline-none focus:border-white/30 transition-colors duration-300"
                                    />
                                </div>

                                {/* Spam reminder */}
                                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-left">
                                    <p className="text-[11px] text-white/50 leading-relaxed">
                                        <span className="text-white/70 font-semibold">Can&apos;t find the email?</span> Check your{" "}
                                        <span className="text-white/60 font-medium">spam</span> or{" "}
                                        <span className="text-white/60 font-medium">junk</span> folder. The code expires in 10 minutes.
                                    </p>
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length < 6}
                                    className="w-full py-3.5 bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(232,33,39,0.2)] mt-2 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify & Create Account"
                                    )}
                                </button>

                                {/* Resend */}
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white/60 hover:text-white text-xs font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Resend Code
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-[1px] bg-white/[0.06]" />
                        <span className="text-[11px] text-white/20 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-[1px] bg-white/[0.06]" />
                    </div>

                    {/* Login link */}
                    <p className="text-center text-sm text-white/40 font-light">
                        Already have an account?{" "}
                        <Link
                            href="/invest/login"
                            className="text-white/70 hover:text-white transition-colors duration-300 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}

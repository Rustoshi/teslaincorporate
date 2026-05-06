"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, CheckCircle2, XCircle, Loader2, Eye, EyeOff, Save } from "lucide-react";
import { updateProfile, changePassword } from "@/app/dashboard/actions/settings";

interface SettingsClientProps {
    user: {
        firstName: string;
        lastName: string;
        dob: string;
        country: string;
        email: string;
    };
}

export default function SettingsClient({ user }: SettingsClientProps) {
    // Profile state
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [dob, setDob] = useState(user.dob);
    const [country, setCountry] = useState(user.country);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileFeedback, setProfileFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleProfileSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setProfileFeedback({ type: "error", message: "First and last name are required." });
            return;
        }
        setProfileLoading(true);
        setProfileFeedback(null);

        const result = await updateProfile({ firstName, lastName, dob, country });
        setProfileLoading(false);

        if (result.success) {
            setProfileFeedback({ type: "success", message: "Profile updated successfully." });
        } else {
            setProfileFeedback({ type: "error", message: result.error || "Update failed." });
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword) {
            setPasswordFeedback({ type: "error", message: "Enter your current password." });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordFeedback({ type: "error", message: "New password must be at least 6 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordFeedback({ type: "error", message: "New passwords do not match." });
            return;
        }

        setPasswordLoading(true);
        setPasswordFeedback(null);

        const result = await changePassword({ currentPassword, newPassword });
        setPasswordLoading(false);

        if (result.success) {
            setPasswordFeedback({ type: "success", message: "Password changed successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setPasswordFeedback({ type: "error", message: result.error || "Password change failed." });
        }
    };

    const inputClasses = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors";
    const labelClasses = "text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2 block";

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Settings
                </h1>
                <p className="text-sm text-white/50 tracking-widest uppercase max-w-xl mx-auto leading-relaxed">
                    Manage your personal information and account security.
                </p>
            </motion.div>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Personal Information</h2>
                        <p className="text-[10px] text-white/40 tracking-widest mt-0.5">Update your name, date of birth, and country</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    <div>
                        <label className={labelClasses}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClasses} placeholder="First Name" />
                    </div>
                    <div>
                        <label className={labelClasses}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClasses} placeholder="Last Name" />
                    </div>
                    <div>
                        <label className={labelClasses}>Date of Birth</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${inputClasses} [color-scheme:dark]`} />
                    </div>
                    <div>
                        <label className={labelClasses}>Country</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClasses} placeholder="Country" />
                    </div>
                </div>

                {/* Email (read-only) */}
                <div className="mb-6">
                    <label className={labelClasses}>Email Address</label>
                    <input type="email" value={user.email} disabled className={`${inputClasses} opacity-40 cursor-not-allowed`} />
                    <p className="text-[9px] text-white/25 mt-1.5 tracking-widest">Email cannot be changed. Contact support if needed.</p>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {profileFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 rounded-xl mb-5 flex items-center gap-3 border ${profileFeedback.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
                        >
                            {profileFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                            <p className={`text-xs ${profileFeedback.type === "success" ? "text-green-300" : "text-red-300"}`}>{profileFeedback.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleProfileSave}
                    disabled={profileLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black text-[11px] font-bold tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-cyan-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </motion.div>

            {/* Password Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Change Password</h2>
                        <p className="text-[10px] text-white/40 tracking-widest mt-0.5">Secure your account with a new password</p>
                    </div>
                </div>

                <div className="space-y-5 mb-6">
                    {/* Current Password */}
                    <div>
                        <label className={labelClasses}>Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={inputClasses}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className={labelClasses}>New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClasses}
                                placeholder="Enter new password (min 6 characters)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className={labelClasses}>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputClasses}
                            placeholder="Re-enter new password"
                        />
                    </div>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {passwordFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 rounded-xl mb-5 flex items-center gap-3 border ${passwordFeedback.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
                        >
                            {passwordFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                            <p className={`text-xs ${passwordFeedback.type === "success" ? "text-green-300" : "text-red-300"}`}>{passwordFeedback.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading}
                    className="w-full flex items-center justify-center gap-3 bg-red-500 text-white text-[11px] font-bold tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Change Password
                </button>
            </motion.div>
        </div>
    );
}

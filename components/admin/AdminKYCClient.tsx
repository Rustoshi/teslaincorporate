"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Clock, CheckCircle2, XCircle, Loader2, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { updateKycStatus } from "@/app/admin/actions/users";
import { useRouter } from "next/navigation";

interface KYCUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    kycStatus: string;
    kycFrontImage: string;
    kycBackImage: string;
    updatedAt: string;
}

interface AdminKYCClientProps {
    users: KYCUser[];
}

export default function AdminKYCClient({ users }: AdminKYCClientProps) {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "verified">("pending");
    const [viewingUser, setViewingUser] = useState<KYCUser | null>(null);
    const [viewingSide, setViewingSide] = useState<"front" | "back">("front");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const filtered = users.filter((u) => {
        if (activeFilter === "all") return true;
        return u.kycStatus === activeFilter;
    });

    const pendingCount = users.filter((u) => u.kycStatus === "pending").length;
    const verifiedCount = users.filter((u) => u.kycStatus === "verified").length;

    const handleAction = async (userId: string, status: "verified" | "unverified") => {
        setLoadingId(userId);
        setFeedback(null);
        const result = await updateKycStatus(userId, status);
        setLoadingId(null);

        if (result.success) {
            setFeedback({ type: "success", message: status === "verified" ? "KYC approved successfully." : "KYC rejected. Documents cleared." });
            setViewingUser(null);
            router.refresh();
        } else {
            setFeedback({ type: "error", message: result.error || "Action failed." });
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        KYC Requests
                    </h1>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Review and manage identity verification submissions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        {pendingCount} Pending
                    </span>
                    <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        {verifiedCount} Verified
                    </span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-white/[0.06] pb-4">
                {(["pending", "verified", "all"] as const).map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${activeFilter === filter ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                    >
                        {filter === "all" ? "All" : filter === "pending" ? "Pending" : "Verified"}
                    </button>
                ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 border ${feedback.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
                    >
                        {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <p className={`text-xs ${feedback.type === "success" ? "text-green-300" : "text-red-300"}`}>{feedback.message}</p>
                        <button onClick={() => setFeedback(null)} className="ml-auto text-white/30 hover:text-white"><X className="w-3 h-3" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="p-16 text-center border border-white/[0.05] border-dashed rounded-2xl bg-white/[0.01]">
                    <ShieldCheck className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">No KYC submissions</p>
                    <p className="text-xs text-white/20 mt-2">There are no {activeFilter !== "all" ? activeFilter : ""} KYC requests at this time.</p>
                </div>
            )}

            {/* Users Table */}
            {filtered.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left text-[9px] text-white/40 font-bold uppercase tracking-widest px-6 py-4">User</th>
                                    <th className="text-left text-[9px] text-white/40 font-bold uppercase tracking-widest px-6 py-4">Email</th>
                                    <th className="text-left text-[9px] text-white/40 font-bold uppercase tracking-widest px-6 py-4">Status</th>
                                    <th className="text-left text-[9px] text-white/40 font-bold uppercase tracking-widest px-6 py-4">Submitted</th>
                                    <th className="text-right text-[9px] text-white/40 font-bold uppercase tracking-widest px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.03 * i }}
                                        className="border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 uppercase">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <span className="text-xs text-white font-bold tracking-wide">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-white/40">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${user.kycStatus === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                                                {user.kycStatus === "pending" ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                                {user.kycStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-white/30">{formatDate(user.updatedAt)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setViewingUser(user); setViewingSide("front"); }}
                                                    className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                                                >
                                                    <Eye className="w-3 h-3" /> View
                                                </button>
                                                {user.kycStatus === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(user._id, "verified")}
                                                            disabled={loadingId === user._id}
                                                            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-colors disabled:opacity-50"
                                                        >
                                                            {loadingId === user._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(user._id, "unverified")}
                                                            disabled={loadingId === user._id}
                                                            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
                                                        >
                                                            {loadingId === user._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />} Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Document Viewer Modal */}
            <AnimatePresence>
                {viewingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        onClick={() => setViewingUser(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                                        {viewingUser.firstName} {viewingUser.lastName}
                                    </h3>
                                    <p className="text-[10px] text-white/40 mt-1">{viewingUser.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${viewingUser.kycStatus === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                                        {viewingUser.kycStatus}
                                    </span>
                                    <button onClick={() => setViewingUser(null)} className="text-white/40 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Document Toggle */}
                            <div className="flex border-b border-white/[0.06]">
                                <button
                                    onClick={() => setViewingSide("front")}
                                    className={`flex-1 text-center py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${viewingSide === "front" ? "bg-white/5 text-white border-b-2 border-cyan-500" : "text-white/30 hover:text-white/60"}`}
                                >
                                    Front of ID
                                </button>
                                <button
                                    onClick={() => setViewingSide("back")}
                                    className={`flex-1 text-center py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${viewingSide === "back" ? "bg-white/5 text-white border-b-2 border-cyan-500" : "text-white/30 hover:text-white/60"}`}
                                >
                                    Back of ID
                                </button>
                            </div>

                            {/* Document Image */}
                            <div className="flex-1 relative bg-black/80 flex items-center justify-center p-6 min-h-[400px]">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => setViewingSide(viewingSide === "front" ? "back" : "front")}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 z-10 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => setViewingSide(viewingSide === "front" ? "back" : "front")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 z-10 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>

                                {(viewingSide === "front" ? viewingUser.kycFrontImage : viewingUser.kycBackImage) ? (
                                    <Image
                                        src={viewingSide === "front" ? viewingUser.kycFrontImage : viewingUser.kycBackImage}
                                        alt={`${viewingSide} of ID`}
                                        width={600}
                                        height={400}
                                        className="max-w-full max-h-[400px] object-contain rounded-lg"
                                    />
                                ) : (
                                    <p className="text-white/30 text-sm">No image uploaded for this side.</p>
                                )}
                            </div>

                            {/* Modal Actions */}
                            {viewingUser.kycStatus === "pending" && (
                                <div className="flex gap-3 p-6 border-t border-white/[0.06]">
                                    <button
                                        onClick={() => handleAction(viewingUser._id, "verified")}
                                        disabled={loadingId === viewingUser._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                                    >
                                        {loadingId === viewingUser._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Approve KYC
                                    </button>
                                    <button
                                        onClick={() => handleAction(viewingUser._id, "unverified")}
                                        disabled={loadingId === viewingUser._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                                    >
                                        {loadingId === viewingUser._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                        Reject KYC
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

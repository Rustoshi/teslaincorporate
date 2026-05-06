"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, CheckCircle2, XCircle, Loader2, Eye, X,
    ArrowDownLeft, ArrowUpRight, TrendingUp, Zap, ArrowLeftRight,
    Search, Filter
} from "lucide-react";
import Image from "next/image";
import { processTransaction } from "@/app/admin/actions/transactions";
import { useRouter } from "next/navigation";

interface PendingTransaction {
    _id: string;
    type: string;
    amount: number;
    status: string;
    paymentMethod: string;
    paymentProof: string;
    walletAddress: string;
    date: string;
    userName: string;
    userEmail: string;
}

interface Props {
    transactions: PendingTransaction[];
}

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    deposit: { label: "Deposit", icon: ArrowDownLeft, color: "text-green-400" },
    withdrawal: { label: "Withdrawal", icon: ArrowUpRight, color: "text-red-400" },
    investment: { label: "Investment", icon: Zap, color: "text-cyan-400" },
    profit: { label: "Profit", icon: TrendingUp, color: "text-emerald-400" },
    transfer: { label: "Transfer", icon: ArrowLeftRight, color: "text-purple-400" },
};

export default function PendingTransactionsClient({ transactions }: Props) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    const filtered = transactions.filter((tx) => {
        const matchesSearch =
            tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.amount.toString().includes(searchTerm);
        const matchesType = filterType === "all" || tx.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleAction = async (txId: string, action: "approved" | "rejected") => {
        setLoadingId(txId);
        setFeedback(null);
        const result = await processTransaction(txId, action);
        setLoadingId(null);

        if (result.success) {
            setFeedback({
                type: "success",
                message: action === "approved" ? "Transaction approved successfully." : "Transaction rejected.",
            });
            router.refresh();
        } else {
            setFeedback({ type: "error", message: result.error || "Action failed." });
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Pending Transactions
                    </h1>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Review and process pending deposits and withdrawals
                    </p>
                </div>
                <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-4 py-2 rounded-full font-bold uppercase tracking-widest">
                    {transactions.length} Pending
                </span>
            </div>

            {/* Search & Filter */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by user name, email, or amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/30 hidden sm:block" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase tracking-widest font-bold focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="investment">Investments</option>
                        <option value="profit">Profits</option>
                        <option value="transfer">Transfers</option>
                    </select>
                </div>
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
                    <CheckCircle2 className="w-10 h-10 text-green-500/30 mx-auto mb-4" />
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">All Clear</p>
                    <p className="text-xs text-white/20 mt-2">There are no pending transactions to review.</p>
                </div>
            )}

            {/* Transactions Table */}
            {filtered.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-black/50">
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Type</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">User</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden md:table-cell">Email</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Amount</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden lg:table-cell">Method</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden lg:table-cell">Date</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Proof</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((tx, i) => {
                                    const typeInfo = typeConfig[tx.type] || typeConfig.deposit;
                                    const TypeIcon = typeInfo.icon;

                                    return (
                                        <motion.tr
                                            key={tx._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.02 * i }}
                                            className="border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                        >
                                            {/* Type */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 ${typeInfo.color}`}>
                                                        <TypeIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${typeInfo.color}`}>
                                                        {typeInfo.label}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* User */}
                                            <td className="p-4 text-xs text-white font-bold tracking-wide whitespace-nowrap">{tx.userName}</td>

                                            {/* Email */}
                                            <td className="p-4 text-xs text-white/40 hidden md:table-cell max-w-[160px] truncate">{tx.userEmail}</td>

                                            {/* Amount */}
                                            <td className="p-4 text-sm text-white font-bold font-mono">${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>

                                            {/* Method */}
                                            <td className="p-4 hidden lg:table-cell">
                                                {tx.paymentMethod ? (
                                                    <span className="text-[9px] bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-full uppercase tracking-widest font-bold">
                                                        {tx.paymentMethod}
                                                    </span>
                                                ) : (
                                                    <span className="text-white/20 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-xs text-white/30 hidden lg:table-cell whitespace-nowrap">
                                                {formatDate(tx.date)}
                                                <br />
                                                <span className="text-[10px] text-white/20">{formatTime(tx.date)}</span>
                                            </td>

                                            {/* Proof */}
                                            <td className="p-4">
                                                {tx.paymentProof ? (
                                                    <button
                                                        onClick={() => setViewingProof(tx.paymentProof)}
                                                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-colors"
                                                    >
                                                        <Eye className="w-3 h-3" /> View
                                                    </button>
                                                ) : (
                                                    <span className="text-white/20 text-xs">None</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(tx._id, "approved")}
                                                        disabled={loadingId === tx._id}
                                                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {loadingId === tx._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(tx._id, "rejected")}
                                                        disabled={loadingId === tx._id}
                                                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {loadingId === tx._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payment Proof Modal */}
            <AnimatePresence>
                {viewingProof && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        onClick={() => setViewingProof(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                                <h3 className="text-sm font-bold text-white tracking-widest uppercase">Payment Proof</h3>
                                <button onClick={() => setViewingProof(null)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative bg-black/80 flex items-center justify-center p-6 min-h-[400px]">
                                <Image
                                    src={viewingProof}
                                    alt="Payment Proof"
                                    width={600}
                                    height={400}
                                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                                />
                            </div>
                            <div className="p-4 border-t border-white/[0.06] text-center">
                                <a
                                    href={viewingProof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    Open Original File ↗
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

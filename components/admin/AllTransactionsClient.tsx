"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    ArrowDownLeft, ArrowUpRight, TrendingUp, Zap, ArrowLeftRight,
    Clock, CheckCircle2, XCircle, AlertTriangle,
    Search, Filter, ChevronLeft, ChevronRight, Eye, X
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

interface Transaction {
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

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    deposit: { label: "Deposit", icon: ArrowDownLeft, color: "text-green-400" },
    withdrawal: { label: "Withdrawal", icon: ArrowUpRight, color: "text-red-400" },
    investment: { label: "Investment", icon: Zap, color: "text-cyan-400" },
    profit: { label: "Profit", icon: TrendingUp, color: "text-emerald-400" },
    transfer: { label: "Transfer", icon: ArrowLeftRight, color: "text-purple-400" },
};

const statusConfig: Record<string, { label: string; icon: any; bg: string; text: string }> = {
    pending: { label: "Pending", icon: Clock, bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-400" },
    approved: { label: "Approved", icon: CheckCircle2, bg: "bg-green-500/10 border-green-500/20", text: "text-green-400" },
    rejected: { label: "Rejected", icon: XCircle, bg: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
    failed: { label: "Failed", icon: AlertTriangle, bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400" },
};

export default function AllTransactionsClient({ transactions }: { transactions: Transaction[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewingProof, setViewingProof] = useState<string | null>(null);
    const itemsPerPage = 20;

    const filtered = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch =
                tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.amount.toString().includes(searchTerm);
            const matchesType = filterType === "all" || tx.type === filterType;
            const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [transactions, searchTerm, filterType, filterStatus]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    // Summary stats
    const totalApproved = transactions.filter(t => t.status === "approved").reduce((s, t) => s + t.amount, 0);
    const totalPending = transactions.filter(t => t.status === "pending").length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        All Transactions
                    </h1>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Complete transaction history across all users
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-white/5 text-white/50 border border-white/10 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        {transactions.length} Total
                    </span>
                    {totalPending > 0 && (
                        <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                            {totalPending} Pending
                        </span>
                    )}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by user, email, or amount..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/30 hidden sm:block" />
                    <select
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
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
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase tracking-widest font-bold focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="p-16 text-center border border-white/[0.05] border-dashed rounded-2xl bg-white/[0.01]">
                    <Clock className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">No Transactions Found</p>
                    <p className="text-xs text-white/20 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}

            {/* Table */}
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
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Status</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden lg:table-cell">Date</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden md:table-cell text-right">Proof</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((tx, i) => {
                                    const typeInfo = typeConfig[tx.type] || typeConfig.deposit;
                                    const statusInfo = statusConfig[tx.status] || statusConfig.pending;
                                    const TypeIcon = typeInfo.icon;
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <motion.tr
                                            key={tx._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.02 * i }}
                                            className="border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                        >
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
                                            <td className="p-4 text-xs text-white font-bold tracking-wide whitespace-nowrap">{tx.userName}</td>
                                            <td className="p-4 text-xs text-white/40 hidden md:table-cell max-w-[160px] truncate">{tx.userEmail}</td>
                                            <td className="p-4 text-sm text-white font-bold font-mono">${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 hidden lg:table-cell">
                                                {tx.paymentMethod ? (
                                                    <span className="text-[9px] bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-full uppercase tracking-widest font-bold">
                                                        {tx.paymentMethod}
                                                    </span>
                                                ) : (
                                                    <span className="text-white/20 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.text}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-white/30 hidden lg:table-cell whitespace-nowrap">
                                                {formatDate(tx.date)}
                                                <br />
                                                <span className="text-[10px] text-white/20">{formatTime(tx.date)}</span>
                                            </td>
                                            <td className="p-4 hidden md:table-cell text-right">
                                                {tx.paymentProof ? (
                                                    <button
                                                        onClick={() => setViewingProof(tx.paymentProof)}
                                                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-colors ml-auto"
                                                    >
                                                        <Eye className="w-3 h-3" /> View
                                                    </button>
                                                ) : (
                                                    <span className="text-white/20 text-xs">—</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 flex items-center justify-between border-t border-white/[0.06] bg-black/20">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                Page {currentPage} of {totalPages} • {filtered.length} transactions
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-white" />
                                </button>
                                <div className="hidden sm:flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-colors ${currentPage === pageNum ? "bg-red-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
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
                                <a href={viewingProof} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">
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

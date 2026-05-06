"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Zap, ArrowLeftRight, Clock, CheckCircle2, XCircle, AlertTriangle, Filter, Search } from "lucide-react";

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    status: string;
    date: string;
    paymentMethod: string;
    walletAddress: string;
}

interface TransactionsClientProps {
    transactions: Transaction[];
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

export default function TransactionsClient({ transactions }: TransactionsClientProps) {
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = useMemo(() => {
        return transactions.filter((tx) => {
            if (filterType !== "all" && tx.type !== filterType) return false;
            if (filterStatus !== "all" && tx.status !== filterStatus) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                    tx.type.includes(q) ||
                    tx.status.includes(q) ||
                    tx.amount.toString().includes(q) ||
                    tx.paymentMethod.toLowerCase().includes(q) ||
                    tx.walletAddress.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [transactions, filterType, filterStatus, searchQuery]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Transactions
                </h1>
                <p className="text-sm text-white/50 tracking-widest uppercase max-w-xl mx-auto leading-relaxed">
                    A complete log of all deposits, withdrawals, investments, and profits on your account.
                </p>
            </motion.div>

            {/* Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>

                {/* Type Filter */}
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

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase tracking-widest font-bold focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="failed">Failed</option>
                </select>
            </motion.div>

            {/* Transaction Count */}
            <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    {filtered.length} Transaction{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Empty State */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-16 text-center border border-white/[0.05] border-dashed rounded-2xl bg-white/[0.01]"
                >
                    <Clock className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">No Transactions Found</p>
                    <p className="text-xs text-white/20 mt-2">Try adjusting your filters or make your first deposit.</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((tx, i) => {
                        const typeInfo = typeConfig[tx.type] || typeConfig.deposit;
                        const statusInfo = statusConfig[tx.status] || statusConfig.pending;
                        const TypeIcon = typeInfo.icon;
                        const StatusIcon = statusInfo.icon;
                        const isCredit = tx.type === "deposit" || tx.type === "profit";

                        return (
                            <motion.div
                                key={tx._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.03 * i }}
                                className="group bg-[#050505] border border-white/[0.05] hover:border-white/[0.1] rounded-xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 bg-white/[0.03] ${typeInfo.color}`}>
                                    <TypeIcon className="w-5 h-5" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${typeInfo.color}`}>
                                            {typeInfo.label}
                                        </span>
                                        {tx.paymentMethod && (
                                            <span className="text-[9px] text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
                                                {tx.paymentMethod}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-white/30 tracking-wide">
                                        {formatDate(tx.date)} • {formatTime(tx.date)}
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="text-right shrink-0">
                                    <div className={`text-sm sm:text-base font-bold tracking-wider ${isCredit ? "text-green-400" : "text-red-400"}`}>
                                        {isCredit ? "+" : "-"}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest shrink-0 ${statusInfo.bg} ${statusInfo.text}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {statusInfo.label}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

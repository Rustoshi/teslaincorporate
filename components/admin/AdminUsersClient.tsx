"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Users, Filter } from "lucide-react";
import Link from "next/link";

interface AdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    totalBalance: number;
    totalProfit: number;
    totalInvested: number;
    activePlans: number;
    tierLevel: number;
    kycStatus: string;
    accountStatus: string;
    createdAt: string;
}

interface AdminUsersClientProps {
    users: AdminUser[];
}

export default function AdminUsersClient({ users }: AdminUsersClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterKyc, setFilterKyc] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const itemsPerPage = 15;

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.country.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesKyc = filterKyc === "all" || u.kycStatus === filterKyc;
            const matchesStatus = filterStatus === "all" || u.accountStatus === filterStatus;

            return matchesSearch && matchesKyc && matchesStatus;
        });
    }, [users, searchTerm, filterKyc, filterStatus]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const kycBadge = (status: string) => {
        const map: Record<string, string> = {
            verified: "bg-green-500/20 text-green-400",
            pending: "bg-yellow-500/20 text-yellow-400",
            unverified: "bg-white/10 text-white/50",
        };
        return map[status] || map.unverified;
    };

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            active: "bg-green-500/20 text-green-400",
            suspended: "bg-yellow-500/20 text-yellow-400",
            blocked: "bg-red-500/20 text-red-400",
        };
        return map[status] || map.active;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Users Management
                    </h1>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        {users.length} total registered users
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                        <Users className="w-4 h-4 text-white/40" />
                        <span className="text-xs text-white font-bold">{filtered.length}</span>
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">results</span>
                    </div>
                </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or country..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>

                {/* KYC Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/30 hidden sm:block" />
                    <select
                        value={filterKyc}
                        onChange={(e) => { setFilterKyc(e.target.value); setCurrentPage(1); }}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase tracking-widest font-bold focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="all">All KYC</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>

                {/* Account Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase tracking-widest font-bold focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.08] bg-black/50">
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">User</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Email</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden lg:table-cell">Country</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Balance</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden md:table-cell">Invested</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden xl:table-cell">Profit</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden xl:table-cell">Tier</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">KYC</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden md:table-cell">Status</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden lg:table-cell">Joined</th>
                                <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="p-12 text-center text-white/30 text-sm">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                displayed.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.02 * i }}
                                        className="border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 uppercase shrink-0">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <span className="text-xs text-white font-bold tracking-wide whitespace-nowrap">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-white/50 max-w-[180px] truncate">{user.email}</td>
                                        <td className="p-4 text-xs text-white/40 hidden lg:table-cell">{user.country}</td>
                                        <td className="p-4 text-xs text-white font-mono font-bold">${user.totalBalance.toLocaleString()}</td>
                                        <td className="p-4 text-xs text-white/60 font-mono hidden md:table-cell">${user.totalInvested.toLocaleString()}</td>
                                        <td className="p-4 text-xs text-green-400 font-mono hidden xl:table-cell">${user.totalProfit.toLocaleString()}</td>
                                        <td className="p-4 text-xs text-white/50 hidden xl:table-cell">T{user.tierLevel}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase ${kycBadge(user.kycStatus)}`}>
                                                {user.kycStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <span className={`px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase ${statusBadge(user.accountStatus)}`}>
                                                {user.accountStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-white/30 hidden lg:table-cell whitespace-nowrap">{formatDate(user.createdAt)}</td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded-lg cursor-pointer"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 flex items-center justify-between border-t border-white/[0.06] bg-black/20">
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                            Page {currentPage} of {totalPages} • {filtered.length} users
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </button>

                            {/* Page Numbers */}
                            <div className="hidden sm:flex gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum: number;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-colors ${currentPage === pageNum
                                                ? "bg-red-500 text-white"
                                                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                                }`}
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
        </div>
    );
}

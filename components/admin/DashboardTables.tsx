"use client";

import { useState, useTransition } from "react";
import { Search, ChevronLeft, ChevronRight, Settings, UserCheck, Package, Clock } from "lucide-react";
import Link from "next/link";
import { approveUserAccount } from "@/app/admin/actions/users";

// --- QUICK ACTIONS ---
export function QuickActions() {
    return (
        <section className="mt-8">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
                <Link href="/admin/kyc" className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] px-5 py-3 rounded-xl transition-all text-sm font-medium text-white group">
                    <UserCheck className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    KyC Requests
                </Link>
                <Link href="/admin/inventory" className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] px-5 py-3 rounded-xl transition-all text-sm font-medium text-white group">
                    <Package className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    Inventory
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] px-5 py-3 rounded-xl transition-all text-sm font-medium text-white group">
                    <Settings className="w-4 h-4 text-white/70 group-hover:rotate-45 transition-transform" />
                    Settings
                </Link>
            </div>
        </section>
    );
}

// --- PENDING USERS TABLE ---
export function PendingUsersTable({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [isPending, startTransition] = useTransition();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ id: string; message: string; ok: boolean } | null>(null);

    const handleApprove = (userId: string) => {
        setLoadingId(userId);
        setFeedback(null);
        startTransition(async () => {
            const result = await approveUserAccount(userId);
            if (result.success) {
                setUsers(prev => prev.filter(u => u._id !== userId));
                setFeedback({ id: userId, message: "Account approved and email sent.", ok: true });
            } else {
                setFeedback({ id: userId, message: result.error || "Failed to approve.", ok: false });
            }
            setLoadingId(null);
        });
    };

    if (users.length === 0) return null;

    return (
        <div className="bg-white/[0.02] border border-amber-500/20 rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-amber-500/20 flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase font-montserrat">
                    Pending Account Approvals
                </h3>
                <span className="ml-auto bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
                    {users.length}
                </span>
            </div>

            {feedback && (
                <div className={`mx-6 mt-4 px-4 py-2 rounded-lg text-xs font-medium ${feedback.ok ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {feedback.message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-black/50">
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Name</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Email</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase hidden sm:table-cell">Country</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase hidden sm:table-cell">Registered</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-sm text-white font-medium">{user.firstName} {user.lastName}</td>
                                <td className="p-4 text-sm text-white/70">{user.email}</td>
                                <td className="p-4 text-sm text-white/50 hidden sm:table-cell">{user.country}</td>
                                <td className="p-4 text-xs text-white/40 hidden sm:table-cell">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleApprove(user._id)}
                                        disabled={isPending && loadingId === user._id}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-400 hover:text-white transition-colors bg-green-500/10 hover:bg-green-500 px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isPending && loadingId === user._id ? "Approving..." : "Approve"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- USERS TABLE ---
export function UsersTable({ initialUsers }: { initialUsers: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filtered = initialUsers.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Users Management</h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-black/50">
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">User</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Email</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Balance</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">KYC</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayed.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-white/40 text-sm">No users found.</td></tr>
                        ) : displayed.map(user => (
                            <tr key={user._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-sm text-white font-medium">{user.firstName} {user.lastName}</td>
                                <td className="p-4 text-sm text-white/70">{user.email}</td>
                                <td className="p-4 text-sm text-white font-mono">${(user.totalBalance || 0).toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${user.kycStatus === 'verified' ? 'bg-green-500/20 text-green-400' :
                                        user.kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-white/10 text-white/50'
                                        }`}>
                                        {user.kycStatus || 'unverified'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/users/${user._id}`} className="inline-block text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded cursor-pointer">Manage</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 flex items-center justify-between border-t border-white/[0.08] bg-black/20">
                    <span className="text-xs text-white/40">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"><ChevronLeft className="w-4 h-4 text-white" /></button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"><ChevronRight className="w-4 h-4 text-white" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- TRANSACTIONS TABLE ---
export function TransactionsTable({ transactions }: { transactions: any[] }) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Pending Transactions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-black/50">
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">ID</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Type</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Amount</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Date</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-white/40 text-sm">No pending transactions.</td></tr>
                        ) : transactions.map(tx => (
                            <tr key={tx._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-xs text-white/50 font-mono">{tx._id.slice(-6)}</td>
                                <td className="p-4">
                                    <span className="text-xs uppercase tracking-wider font-bold text-white bg-white/10 px-2 py-1 rounded">{tx.type}</span>
                                </td>
                                <td className="p-4 text-sm text-white font-mono">${tx.amount.toLocaleString()}</td>
                                <td className="p-4 text-xs text-white/60">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <Link href="/admin/transactions/pending" className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded">Review</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- INVENTORY TABLE ---
export function InventoryTable({ initialInventory }: { initialInventory: any[] }) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Inventory</h3>
                <Link href="/admin/inventory" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors">
                    Manage Inventory
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-black/50">
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">ID</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Product</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Category</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Base Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialInventory.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-white/40 text-sm">No inventory listed.</td></tr>
                        ) : initialInventory.map(item => (
                            <tr key={item._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-xs text-white/50 font-mono">{item._id?.slice(-8).toUpperCase()}</td>
                                <td className="p-4 text-sm text-white font-medium">{item.name}</td>
                                <td className="p-4 text-sm text-white/70">{item.category}</td>
                                <td className="p-4 text-sm text-white font-mono">${(item.baseCashPrice || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- ORDERS TABLE ---
export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden mt-8 mb-16">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Pending Orders</h3>
                <Link href="/admin/orders" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors">
                    View All Orders
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-black/50">
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Order ID</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Customer</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Item</th>
                            <th className="p-4 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialOrders.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-white/40 text-sm">No pending orders.</td></tr>
                        ) : initialOrders.map(item => (
                            <tr key={item._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-xs text-white/50 font-mono">{item._id?.slice(-8).toUpperCase()}</td>
                                <td className="p-4 text-sm text-white font-medium">{item.user?.firstName} {item.user?.lastName}</td>
                                <td className="p-4 text-sm text-white/70">{item.product?.name || item.product?.model}</td>
                                <td className="p-4">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">{item.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

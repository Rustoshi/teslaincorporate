"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ChevronLeft, ChevronRight, X, Package,
    Loader2, Car, Zap, DollarSign, Clock,
    CheckCircle2, XCircle, AlertCircle, Ban, Eye, Truck,
    SlidersHorizontal, ChevronDown,
} from "lucide-react";
import { updateOrderStatus, updateOrderNotes } from "@/app/admin/actions/orders";
import ShipmentManagerModal from "@/components/admin/ShipmentManagerModal";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderUser { _id: string; name: string; email: string; }
interface OrderProduct { _id: string; name: string; slug: string; category: string; heroImage: string; }

interface OrderItem {
    _id: string;
    user: OrderUser;
    product: OrderProduct;
    paymentType: string;
    orderStatus: string;
    totalAmount: number;
    downPaymentAmount: number | null;
    monthlyPayment: number | null;
    financeTermMonths: number | null;
    aprAtPurchase: number | null;
    notes: string;
    shippingAddress?: { street?: string; city?: string; state?: string; zipCode?: string };
    shipmentFee?: number;
    hasShipment?: boolean;
    createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: any }> = {
    PENDING:   { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
    APPROVED:  { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   icon: CheckCircle2 },
    COMPLETED: { color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20",  icon: CheckCircle2 },
    REJECTED:  { color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    icon: XCircle },
    CANCELLED: { color: "text-white/40",   bg: "bg-white/5",       border: "border-white/10",      icon: Ban },
};

const ALL_STATUSES = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"] as const;

const fmt = {
    date: (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    currency: (n: number) => `$${n.toLocaleString()}`,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            <Icon className="w-3 h-3" />
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

function PaymentBadge({ type }: { type: string }) {
    return (
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
            type === "CASH"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
        }`}>
            {type === "CASH" ? "Cash" : "Finance"}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrdersClient({ orders }: { orders: OrderItem[] }) {
    const router = useRouter();

    // List state
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPayment, setFilterPayment] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 15;

    // Action state
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modals
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const [editNotes, setEditNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [shipmentOrder, setShipmentOrder] = useState<OrderItem | null>(null);

    const showFeedback = (type: "success" | "error", message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4000);
    };

    const filtered = useMemo(() => orders.filter((o) => {
        const q = searchTerm.toLowerCase();
        return (
            (o.user.name.toLowerCase().includes(q) ||
             o.user.email.toLowerCase().includes(q) ||
             o.product.name.toLowerCase().includes(q) ||
             o._id.toLowerCase().includes(q)) &&
            (filterStatus === "all" || o.orderStatus === filterStatus) &&
            (filterPayment === "all" || o.paymentType === filterPayment) &&
            (filterCategory === "all" || o.product.category === filterCategory)
        );
    }), [orders, searchTerm, filterStatus, filterPayment, filterCategory]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setLoadingId(orderId);
        const result = await updateOrderStatus(orderId, newStatus as any);
        setLoadingId(null);
        if (result.success) {
            showFeedback("success", "Order status updated.");
            if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
            router.refresh();
        } else {
            showFeedback("error", result.error || "Failed to update.");
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedOrder) return;
        setSavingNotes(true);
        const result = await updateOrderNotes(selectedOrder._id, editNotes);
        setSavingNotes(false);
        if (result.success) {
            showFeedback("success", "Notes saved.");
            setSelectedOrder({ ...selectedOrder, notes: editNotes });
            router.refresh();
        } else {
            showFeedback("error", result.error || "Failed to save notes.");
        }
    };

    // Stats
    const stats = [
        { label: "Pending",   value: orders.filter(o => o.orderStatus === "PENDING").length,   color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
        { label: "Approved",  value: orders.filter(o => o.orderStatus === "APPROVED").length,  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   icon: CheckCircle2 },
        { label: "Completed", value: orders.filter(o => o.orderStatus === "COMPLETED").length, color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20",  icon: CheckCircle2 },
        { label: "Revenue",   value: fmt.currency(orders.filter(o => o.orderStatus === "COMPLETED").reduce((s, o) => s + o.totalAmount, 0)), color: "text-white", bg: "bg-white/5", border: "border-white/10", icon: DollarSign },
        { label: "Vehicles",  value: orders.filter(o => o.product.category === "VEHICLE").length, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: Car },
    ];

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 space-y-5 max-w-[1400px] mx-auto">

                {/* ── Toast ── */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                            className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:top-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
                                feedback.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                        >
                            {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                            <span className="text-xs font-bold tracking-wide">{feedback.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Header ── */}
                <div>
                    <h1 className="text-base font-bold text-white tracking-wide">Orders</h1>
                    <p className="text-xs text-white/40 mt-0.5">Manage customer orders, shipments, and live tracking</p>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {stats.map((s) => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-none">{s.label}</span>
                                <s.icon className={`w-3.5 h-3.5 ${s.color} opacity-60`} />
                            </div>
                            <span className={`text-lg font-bold ${s.color} leading-none`}>{s.value}</span>
                        </div>
                    ))}
                </div>

                {/* ── Search + Filter toggle ── */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text" value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Search orders…"
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors ${
                                showFilters || filterStatus !== "all" || filterPayment !== "all" || filterCategory !== "all"
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "bg-black/40 border-white/10 text-white/40 hover:text-white/70"
                            }`}
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Filters</span>
                            {(filterStatus !== "all" || filterPayment !== "all" || filterCategory !== "all") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            )}
                        </button>
                    </div>

                    {/* Collapsible filter row */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                    {[
                                        {
                                            value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setCurrentPage(1); },
                                            options: [["all", "All Statuses"], ...ALL_STATUSES.map(s => [s, s.charAt(0) + s.slice(1).toLowerCase()])],
                                        },
                                        {
                                            value: filterPayment, onChange: (v: string) => { setFilterPayment(v); setCurrentPage(1); },
                                            options: [["all", "All Payments"], ["CASH", "Cash"], ["FINANCE", "Finance"]],
                                        },
                                        {
                                            value: filterCategory, onChange: (v: string) => { setFilterCategory(v); setCurrentPage(1); },
                                            options: [["all", "All Categories"], ["VEHICLE", "Vehicles"], ["ENERGY", "Energy"]],
                                        },
                                    ].map((f, idx) => (
                                        <div key={idx} className="relative">
                                            <select
                                                value={f.value} onChange={(e) => f.onChange(e.target.value)}
                                                className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 pr-8 text-xs text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
                                            >
                                                {f.options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Content ── */}
                <div className="bg-[#0A0A0A]/60 border border-white/[0.06] rounded-2xl overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Package className="w-10 h-10 text-white/10 mb-3" />
                            <p className="text-xs text-white/30 font-bold uppercase tracking-widest">No orders found</p>
                        </div>
                    ) : (
                        <>
                            {/* ── Desktop Table (md+) ── */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/[0.06]">
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-left">Customer</th>
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-left">Product</th>
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-left">Payment</th>
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-left">Amount</th>
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-left">Status</th>
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-left hidden lg:table-cell">Date</th>
                                            <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayed.map((order, i) => {
                                            const isVehicle = order.product.category === "VEHICLE";
                                            return (
                                                <motion.tr
                                                    key={order._id}
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.015 * i }}
                                                    className="border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <span className="text-xs text-white font-bold block">{order.user.name}</span>
                                                        <span className="text-[10px] text-white/30 block truncate max-w-[160px]">{order.user.email}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 shrink-0 ${isVehicle ? "bg-cyan-500/10 text-cyan-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                                                {isVehicle ? <Car className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-white/70 font-medium block">{order.product.name}</span>
                                                                {order.hasShipment && (
                                                                    <span className="text-[9px] text-cyan-400/70 flex items-center gap-1">
                                                                        <Truck className="w-2.5 h-2.5" /> Tracking active
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4"><PaymentBadge type={order.paymentType} /></td>
                                                    <td className="p-4">
                                                        <span className="text-sm text-white font-bold font-mono">{fmt.currency(order.totalAmount)}</span>
                                                        {order.paymentType === "FINANCE" && order.monthlyPayment && (
                                                            <span className="text-[10px] text-white/30 block">{fmt.currency(order.monthlyPayment)}/mo × {order.financeTermMonths}mo</span>
                                                        )}
                                                        {(order.shipmentFee ?? 0) > 0 && (
                                                            <span className="text-[9px] text-white/25 block">+{fmt.currency(order.shipmentFee!)} ship</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4"><StatusBadge status={order.orderStatus} /></td>
                                                    <td className="p-4 hidden lg:table-cell text-xs text-white/30 whitespace-nowrap">{fmt.date(order.createdAt)}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button onClick={() => { setSelectedOrder(order); setEditNotes(order.notes); }}
                                                                className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors"
                                                                title="View Details">
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                            {isVehicle && (
                                                                <button onClick={() => setShipmentOrder(order)}
                                                                    className={`p-2 rounded-lg border transition-colors ${
                                                                        order.hasShipment
                                                                            ? "bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border-violet-500/20"
                                                                            : "bg-white/[0.04] hover:bg-white/[0.08] text-white/40 border-white/10 hover:text-white/60"
                                                                    }`}
                                                                    title={order.hasShipment ? "Manage Shipment" : "Init Shipment"}>
                                                                    <Truck className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                            <select
                                                                value={order.orderStatus}
                                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                                disabled={loadingId === order._id}
                                                                className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white font-bold uppercase tracking-wider focus:outline-none focus:border-white/20 disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                                            </select>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Mobile Cards (< md) ── */}
                            <div className="md:hidden divide-y divide-white/[0.04]">
                                {displayed.map((order, i) => {
                                    const isVehicle = order.product.category === "VEHICLE";
                                    return (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.015 * i }}
                                            className="p-4 space-y-3"
                                        >
                                            {/* Row 1: customer + status */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-white truncate">{order.user.name}</p>
                                                    <p className="text-[10px] text-white/30 truncate">{order.user.email}</p>
                                                </div>
                                                <StatusBadge status={order.orderStatus} />
                                            </div>

                                            {/* Row 2: product + amount */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 shrink-0 ${isVehicle ? "bg-cyan-500/10 text-cyan-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                                        {isVehicle ? <Car className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-white/70 font-medium truncate">{order.product.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <PaymentBadge type={order.paymentType} />
                                                            {order.hasShipment && (
                                                                <span className="text-[9px] text-cyan-400/70 flex items-center gap-0.5">
                                                                    <Truck className="w-2.5 h-2.5" /> Live
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-bold text-white font-mono">{fmt.currency(order.totalAmount)}</p>
                                                    {order.paymentType === "FINANCE" && order.monthlyPayment && (
                                                        <p className="text-[10px] text-white/30">{fmt.currency(order.monthlyPayment)}/mo</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Row 3: date + actions */}
                                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
                                                <span className="text-[10px] text-white/25 shrink-0">{fmt.date(order.createdAt)}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => { setSelectedOrder(order); setEditNotes(order.notes); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 active:opacity-70 transition-colors"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">View</span>
                                                    </button>
                                                    {isVehicle && (
                                                        <button
                                                            onClick={() => setShipmentOrder(order)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                                                                order.hasShipment
                                                                    ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                                                    : "bg-white/[0.04] text-white/40 border-white/10"
                                                            }`}
                                                        >
                                                            <Truck className="w-3 h-3" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                                {order.hasShipment ? "Track" : "Ship"}
                                                            </span>
                                                        </button>
                                                    )}
                                                    <div className="relative">
                                                        <select
                                                            value={order.orderStatus}
                                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                            disabled={loadingId === order._id}
                                                            className="appearance-none bg-black/50 border border-white/10 rounded-lg pl-2 pr-6 py-1.5 text-[10px] text-white font-bold uppercase tracking-wider focus:outline-none disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                                        </select>
                                                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 flex items-center justify-between border-t border-white/[0.06] bg-black/20">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest hidden sm:block">
                                {currentPage}/{totalPages} · {filtered.length} orders
                            </span>
                            <div className="flex gap-2 mx-auto sm:mx-0">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors">
                                    <ChevronLeft className="w-4 h-4 text-white" />
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let p = totalPages <= 5 ? i + 1
                                            : currentPage <= 3 ? i + 1
                                            : currentPage >= totalPages - 2 ? totalPages - 4 + i
                                            : currentPage - 2 + i;
                                        return (
                                            <button key={p} onClick={() => setCurrentPage(p)}
                                                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-colors ${currentPage === p ? "bg-red-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}>
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Order Detail Modal ── */}
                <AnimatePresence>
                    {selectedOrder && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                            onClick={() => setSelectedOrder(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 40 }}
                                transition={{ type: "spring", damping: 30, stiffness: 360 }}
                                className="bg-[#0C0C0C] border border-white/10 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Sticky header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-wide">Order Details</h3>
                                        <span className="text-[10px] text-white/25 font-mono">{selectedOrder._id.substring(0, 16)}…</span>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <X className="w-4 h-4 text-white/50" />
                                    </button>
                                </div>

                                {/* Scrollable body */}
                                <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

                                    {/* Customer */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-white">{selectedOrder.user.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-bold leading-tight">{selectedOrder.user.name}</p>
                                            <p className="text-[11px] text-white/40">{selectedOrder.user.email}</p>
                                        </div>
                                    </div>

                                    {/* Product */}
                                    <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 shrink-0 ${selectedOrder.product.category === "VEHICLE" ? "bg-cyan-500/10 text-cyan-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                            {selectedOrder.product.category === "VEHICLE" ? <Car className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-bold leading-tight">{selectedOrder.product.name}</p>
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedOrder.product.category === "VEHICLE" ? "text-cyan-400" : "text-yellow-400"}`}>
                                                {selectedOrder.product.category}
                                            </span>
                                        </div>
                                        <div className="ml-auto">
                                            <StatusBadge status={selectedOrder.orderStatus} />
                                        </div>
                                    </div>

                                    {/* Amounts */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">Payment</p>
                                            <PaymentBadge type={selectedOrder.paymentType} />
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">Total</p>
                                            <span className="text-sm font-bold text-white">{fmt.currency(selectedOrder.totalAmount)}</span>
                                        </div>
                                    </div>

                                    {/* Shipment fee */}
                                    {(selectedOrder.shipmentFee ?? 0) > 0 && (
                                        <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-cyan-400" />
                                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Shipment Fee</span>
                                            </div>
                                            <span className="text-sm font-bold text-cyan-400">{fmt.currency(selectedOrder.shipmentFee!)}</span>
                                        </div>
                                    )}

                                    {/* Finance details */}
                                    {selectedOrder.paymentType === "FINANCE" && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { label: "Down", value: selectedOrder.downPaymentAmount ? fmt.currency(selectedOrder.downPaymentAmount) : "—" },
                                                { label: "Monthly", value: selectedOrder.monthlyPayment ? `${fmt.currency(selectedOrder.monthlyPayment)}/mo` : "—" },
                                                { label: "Term", value: `${selectedOrder.financeTermMonths}mo @ ${selectedOrder.aprAtPurchase}%` },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3">
                                                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">{label}</p>
                                                    <span className="text-[11px] font-bold text-purple-400">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Status change + date */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Update Status</p>
                                            <div className="relative">
                                                <select
                                                    value={selectedOrder.orderStatus}
                                                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                                    disabled={loadingId === selectedOrder._id}
                                                    className="w-full appearance-none bg-black/50 border border-white/10 rounded-xl px-3 pr-8 py-2.5 text-xs text-white font-bold uppercase tracking-wider focus:outline-none focus:border-white/20 disabled:opacity-50 cursor-pointer"
                                                >
                                                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Order Date</p>
                                            <p className="text-xs text-white/60 py-2.5">{fmt.date(selectedOrder.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Shipment shortcut */}
                                    {selectedOrder.product.category === "VEHICLE" && (
                                        <button
                                            onClick={() => { setSelectedOrder(null); setShipmentOrder(selectedOrder); }}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600/15 hover:bg-violet-600/25 text-violet-400 border border-violet-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors"
                                        >
                                            <Truck className="w-3.5 h-3.5" />
                                            {selectedOrder.hasShipment ? "Manage Shipment & Tracking" : "Initialize Vehicle Shipment"}
                                        </button>
                                    )}

                                    {/* Notes */}
                                    <div>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Admin Notes</p>
                                        <textarea
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                            placeholder="Internal notes about this order…"
                                            rows={3}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                        />
                                        <AnimatePresence>
                                            {editNotes !== selectedOrder.notes && (
                                                <motion.button
                                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                    onClick={handleSaveNotes} disabled={savingNotes}
                                                    className="mt-2 w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors"
                                                >
                                                    {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                    Save Notes
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Shipment Manager Modal ── */}
            <AnimatePresence>
                {shipmentOrder && (
                    <ShipmentManagerModal
                        order={shipmentOrder}
                        onClose={() => { setShipmentOrder(null); router.refresh(); }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

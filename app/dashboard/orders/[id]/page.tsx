import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import ShopOrder from "@/models/ShopOrder";
import ShopProduct from "@/models/ShopProduct"; // registers schema for populate
import VehicleShipment from "@/models/VehicleShipment";
import Image from "next/image";
import Link from "next/link";
import {
    ShieldCheck, MapPin, CreditCard, Box, Wallet,
    Truck, Clock, CheckCircle2, Package,
    Navigation, DollarSign, AlertTriangle, PhoneCall,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import {
    TRACKING_STATUS_ORDER,
    TRACKING_STATUS_META,
    type TrackingStatus,
} from "@/lib/tracking-constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string | Date, opts?: Intl.DateTimeFormatOptions) {
    return new Date(d).toLocaleDateString("en-US", opts ?? {
        month: "long", day: "numeric", year: "numeric",
    });
}

function fmtDateTime(d: string | Date) {
    return new Date(d).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function fmtCurrency(n: number) {
    return `$${n.toLocaleString()}`;
}

const ORDER_STATUS_UI: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING: { label: "Pending Verification", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    APPROVED: { label: "Approved", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    COMPLETED: { label: "Delivered", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    REJECTED: { label: "Payment Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    CANCELLED: { label: "Cancelled", color: "text-white/40", bg: "bg-white/5", border: "border-white/10" },
};

const TRACKING_STATUS_STYLE: Record<string, { color: string; dotColor: string }> = {
    ORDER_CONFIRMED: { color: "text-slate-400", dotColor: "bg-slate-400" },
    PAYMENT_VERIFIED: { color: "text-blue-400", dotColor: "bg-blue-400" },
    MANUFACTURING: { color: "text-yellow-400", dotColor: "bg-yellow-400" },
    QUALITY_CHECK: { color: "text-orange-400", dotColor: "bg-orange-400" },
    READY_FOR_SHIPMENT: { color: "text-cyan-400", dotColor: "bg-cyan-400" },
    DISPATCHED: { color: "text-indigo-400", dotColor: "bg-indigo-400" },
    IN_TRANSIT: { color: "text-violet-400", dotColor: "bg-violet-400" },
    AT_PORT: { color: "text-purple-400", dotColor: "bg-purple-400" },
    CUSTOMS_CLEARED: { color: "text-pink-400", dotColor: "bg-pink-400" },
    AT_DISTRIBUTION_CENTER: { color: "text-rose-400", dotColor: "bg-rose-400" },
    OUT_FOR_DELIVERY: { color: "text-amber-400", dotColor: "bg-amber-400" },
    DELIVERED: { color: "text-green-400", dotColor: "bg-green-400" },
};

function statusIndex(s: TrackingStatus): number {
    return TRACKING_STATUS_ORDER.indexOf(s);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) redirect("/invest/login");

    await dbConnect();

    let order: any;
    try {
        order = await ShopOrder.findOne({ _id: id, userId: session.user.id })
            .populate("productId", "name heroImage category")
            .lean();
    } catch {
        return notFound();
    }
    if (!order) return notFound();

    // Fetch shipment if this is a vehicle order
    let shipment: any = null;
    if (order.productId?.category === "VEHICLE") {
        shipment = await VehicleShipment.findOne({ orderId: id }).lean();
    }

    const product = order.productId as any;
    const orderStatusUi = ORDER_STATUS_UI[order.orderStatus] ?? ORDER_STATUS_UI.PENDING;
    const isVehicle = product?.category === "VEHICLE";
    const hasShipment = !!shipment;

    const currentStatusIdx = hasShipment
        ? statusIndex(shipment.currentStatus as TrackingStatus)
        : -1;

    // Build timeline: keep latest event per status
    const eventsByStatus = new Map<TrackingStatus, any>();
    if (hasShipment) {
        for (const event of shipment.trackingHistory) {
            const existing = eventsByStatus.get(event.status);
            if (!existing || new Date(event.timestamp) > new Date(existing.timestamp)) {
                eventsByStatus.set(event.status, event);
            }
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-32">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                    <BackButton label="Go Back" />
                    <h1
                        className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Order Details
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-white/40 font-mono tracking-widest uppercase">
                            ID: {order._id.toString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs text-white/40 tracking-widest uppercase">
                            {fmtDate(order.createdAt)}
                        </span>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${orderStatusUi.bg} ${orderStatusUi.border} ${orderStatusUi.color}`}>
                    {order.orderStatus === "COMPLETED" && <ShieldCheck className="w-4 h-4" />}
                    {order.orderStatus === "APPROVED" && <Truck className="w-4 h-4" />}
                    {order.orderStatus === "PENDING" && <Clock className="w-4 h-4" />}
                    <span className="text-xs font-bold tracking-widest uppercase">{orderStatusUi.label}</span>
                </div>
            </div>

            {/* ── Customs Fee Alert Banner ── */}
            {hasShipment && shipment.customsFeeRequired && (
                <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-amber-400 tracking-wide uppercase">
                                Customs / Import Fee Required
                            </p>
                            <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                                {shipment.customsFeeMessage && shipment.customsFeeMessage.trim()
                                    ? shipment.customsFeeMessage
                                    : "Your vehicle has arrived at customs and an import/customs fee is required before it can be released. Please contact our support team to complete this payment and proceed with your delivery."}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <Link
                                    href="/dashboard?tab=support"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                                >
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    Contact Support
                                </Link>
                                <span className="text-[10px] text-white/30 uppercase tracking-widest">
                                    Your order is on hold pending fee clearance
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Main Column ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Product Card */}
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
                        {product?.heroImage ? (
                            <div className="w-full sm:w-1/2 aspect-[4/3] relative rounded-xl overflow-hidden bg-white/[0.02]">
                                <Image src={product.heroImage} alt={product.name} fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-full sm:w-1/2 aspect-[4/3] relative rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                                <Box className="w-12 h-12 text-white/10" />
                            </div>
                        )}

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="text-[10px] text-red-500 font-bold tracking-widest uppercase mb-2">
                                {product?.category || "VEHICLE"}
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-1">
                                {product?.name || "Unknown Product"}
                            </h2>
                            {order.variantName && (
                                <p className="text-xs text-white/40 tracking-widest uppercase mb-1">{order.variantName}</p>
                            )}
                            {order.selectedColor && (
                                <p className="text-xs text-white/30 tracking-widest uppercase mb-5">{order.selectedColor}</p>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/[0.08]">
                                <div>
                                    <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">
                                        Total Value
                                    </div>
                                    <div className="text-xl font-bold text-white">
                                        {fmtCurrency(order.totalAmount)}
                                    </div>
                                </div>
                                {order.paymentType === "FINANCE" && order.monthlyPayment && (
                                    <div>
                                        <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">
                                            Est. Monthly
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            {fmtCurrency(order.monthlyPayment)}
                                        </div>
                                        <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">
                                            {order.financeTermMonths} Months
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Tracking Panel (vehicles with shipment) ── */}
                    {isVehicle && hasShipment && (
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden">

                            {/* Tracking Header */}
                            <div className="p-6 sm:p-8 border-b border-white/[0.06]">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                                                Shipment Tracking
                                            </h3>
                                            <p className="text-[10px] text-white/30 mt-0.5 font-mono">
                                                {shipment.trackingNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                                        TRACKING_STATUS_STYLE[shipment.currentStatus]?.color ?? 'text-white/60'
                                    } bg-white/[0.04] border-white/[0.06]`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${TRACKING_STATUS_STYLE[shipment.currentStatus]?.dotColor ?? 'bg-white/30'} ${shipment.currentStatus !== 'DELIVERED' ? 'animate-pulse' : ''}`} />
                                        <span className="text-[9px] font-bold tracking-widest uppercase">
                                            {TRACKING_STATUS_META[shipment.currentStatus as TrackingStatus]?.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Key metrics row */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    {shipment.carrier && (
                                        <div>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Carrier</p>
                                            <p className="text-xs font-bold text-white">{shipment.carrier}</p>
                                        </div>
                                    )}
                                    {shipment.estimatedDelivery && (
                                        <div>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Est. Delivery</p>
                                            <p className="text-xs font-bold text-white">
                                                {fmtDate(shipment.estimatedDelivery, { month: "short", day: "numeric", year: "numeric" })}
                                            </p>
                                        </div>
                                    )}
                                    {shipment.vin && (
                                        <div>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">VIN</p>
                                            <p className="text-xs font-mono font-bold text-white/70">{shipment.vin}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Current location text */}
                                {shipment.currentLocation?.name && (
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                                        <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                                        <div>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-0.5">Current Location</p>
                                            <p className="text-xs font-bold text-white">{shipment.currentLocation.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Tracking Timeline ── */}
                            <div className="px-6 sm:px-8 py-8">
                                <h4 className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-6 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" /> Shipment Timeline
                                </h4>

                                <div className="relative">
                                    {/* Vertical track line */}
                                    <div className="absolute left-[11px] top-4 bottom-4 w-px bg-white/[0.05]" />

                                    <div className="space-y-1">
                                        {TRACKING_STATUS_ORDER.map((status, idx) => {
                                            const isCurrent = status === shipment.currentStatus;
                                            const isCompleted = idx <= currentStatusIdx && !isCurrent;
                                            const isPending = idx > currentStatusIdx;
                                            const event = eventsByStatus.get(status);
                                            const meta = TRACKING_STATUS_META[status];
                                            const style = TRACKING_STATUS_STYLE[status];

                                            return (
                                                <div
                                                    key={status}
                                                    className={`relative flex gap-5 py-4 pl-1 transition-all ${
                                                        isPending ? 'opacity-30' : 'opacity-100'
                                                    }`}
                                                >
                                                    {/* Status dot */}
                                                    <div className="relative z-10 shrink-0 mt-0.5">
                                                        {isCurrent ? (
                                                            <div className="relative flex items-center justify-center w-6 h-6">
                                                                <div className={`absolute inset-0 rounded-full ${style.dotColor} opacity-20 animate-ping`} />
                                                                <div className={`w-3 h-3 rounded-full ${style.dotColor} ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-current ${style.color}`} />
                                                            </div>
                                                        ) : isCompleted ? (
                                                            <div className="w-6 h-6 flex items-center justify-center">
                                                                <CheckCircle2 className={`w-4 h-4 ${style.color}`} />
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-6 flex items-center justify-center">
                                                                <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 pb-2">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className={`text-xs font-bold tracking-wide ${
                                                                    isCurrent
                                                                        ? style.color
                                                                        : isCompleted
                                                                        ? 'text-white/80'
                                                                        : 'text-white/30'
                                                                }`}>
                                                                    {event?.title ?? meta.label}
                                                                </p>
                                                                <p className={`text-[11px] mt-0.5 leading-relaxed ${
                                                                    isCompleted || isCurrent ? 'text-white/40' : 'text-white/20'
                                                                }`}>
                                                                    {event?.description ?? meta.description}
                                                                </p>
                                                            </div>
                                                            {event?.timestamp && (
                                                                <span className="text-[9px] text-white/20 whitespace-nowrap font-mono shrink-0">
                                                                    {fmtDateTime(event.timestamp)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {event?.location && (
                                                            <div className="flex items-center gap-1 mt-1.5">
                                                                <MapPin className="w-2.5 h-2.5 text-white/20" />
                                                                <span className="text-[9px] text-white/25">{event.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vehicle with no shipment yet */}
                    {isVehicle && !hasShipment && (
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-white/20" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                                        Shipment Not Yet Initialized
                                    </h3>
                                    <p className="text-xs text-white/30 mt-1 leading-relaxed">
                                        Vehicle tracking will become available once your order is processed and a shipment is assigned.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Address */}
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                        <MapPin className="absolute top-8 right-8 w-32 h-32 text-white/[0.02] -rotate-12 pointer-events-none" />
                        <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <MapPin className="w-4 h-4 text-white/60" />
                            </span>
                            Delivery Address
                        </h3>

                        {order.shippingAddress?.street ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Street</div>
                                    <div className="text-sm font-bold text-white tracking-widest uppercase">{order.shippingAddress.street}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">City</div>
                                    <div className="text-sm font-bold text-white tracking-widest uppercase">{order.shippingAddress.city}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">State</div>
                                    <div className="text-sm font-bold text-white tracking-widest uppercase">{order.shippingAddress.state}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Zip Code</div>
                                    <div className="text-sm font-bold text-white tracking-widest uppercase">{order.shippingAddress.zipCode}</div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-white/40 tracking-widest uppercase">No shipping information provided.</p>
                        )}
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-6">

                    {/* Payment Summary */}
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-5 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <CreditCard className="w-4 h-4 text-white/60" />
                            </span>
                            Payment Details
                        </h3>

                        <div className="space-y-0">
                            {[
                                { label: "Method", value: order.paymentType },
                                {
                                    label: "Paid Via",
                                    value: order.selectedCrypto || "System Balance",
                                    icon: <Wallet className="w-3 h-3 text-red-500" />,
                                },
                                order.paymentType === "FINANCE" && order.downPaymentAmount
                                    ? { label: "Down Payment", value: fmtCurrency(order.downPaymentAmount) }
                                    : null,
                                order.paymentType === "FINANCE" && order.financeTermMonths
                                    ? { label: "Term", value: `${order.financeTermMonths} months @ ${order.aprAtPurchase}% APR` }
                                    : null,
                            ]
                                .filter(Boolean)
                                .map((row: any) => (
                                    <div
                                        key={row.label}
                                        className="flex justify-between items-center py-3 border-b border-white/[0.05]"
                                    >
                                        <span className="text-xs text-white/40 tracking-widest uppercase">{row.label}</span>
                                        <span className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                                            {row.icon}
                                            {row.value}
                                        </span>
                                    </div>
                                ))}

                            {/* Shipment fee */}
                            {(order.shipmentFee ?? 0) > 0 && (
                                <div className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                                    <span className="text-xs text-white/40 tracking-widest uppercase flex items-center gap-1.5">
                                        <Truck className="w-3 h-3" /> Shipment Fee
                                    </span>
                                    <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">
                                        {fmtCurrency(order.shipmentFee!)}
                                    </span>
                                </div>
                            )}

                            {/* Shipment fee status */}
                            {hasShipment && shipment.shipmentFee > 0 && (
                                <div className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                                    <span className="text-xs text-white/40 tracking-widest uppercase">Fee Status</span>
                                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                                        shipment.feeStatus === 'PAID' ? 'text-green-400 bg-green-500/10 border-green-500/20'
                                        : shipment.feeStatus === 'INCLUDED' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                    }`}>
                                        {shipment.feeStatus}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-4 mt-1">
                                <span className="text-sm text-white/60 tracking-widest uppercase font-bold">Amount</span>
                                <span className="text-lg font-black text-green-500 tracking-widest">PAID</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipment Quick Info (if exists) */}
                    {hasShipment && (
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6">
                            <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-5 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                    <Navigation className="w-4 h-4 text-violet-400" />
                                </span>
                                Shipment Info
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">Tracking #</span>
                                    <span className="text-[10px] font-mono font-bold text-white/70">{shipment.trackingNumber}</span>
                                </div>
                                {shipment.vin && (
                                    <div className="flex justify-between">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest">VIN</span>
                                        <span className="text-[10px] font-mono font-bold text-white/70">{shipment.vin}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">Carrier</span>
                                    <span className="text-[10px] font-bold text-white/70">{shipment.carrier}</span>
                                </div>
                                {shipment.estimatedDelivery && (
                                    <div className="flex justify-between">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Est. Delivery</span>
                                        <span className="text-[10px] font-bold text-white/70">
                                            {fmtDate(shipment.estimatedDelivery, { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">Status</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${TRACKING_STATUS_STYLE[shipment.currentStatus]?.color ?? 'text-white/60'}`}>
                                        {TRACKING_STATUS_META[shipment.currentStatus as TrackingStatus]?.label}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="pt-3">
                                    <div className="flex justify-between text-[9px] text-white/25 uppercase tracking-widest mb-1.5">
                                        <span>Order Confirmed</span>
                                        <span>Delivered</span>
                                    </div>
                                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-500 to-green-400 rounded-full transition-all duration-700"
                                            style={{
                                                width: `${Math.round(
                                                    ((currentStatusIdx + 1) / TRACKING_STATUS_ORDER.length) * 100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-[9px] text-white/25 uppercase tracking-widest text-right mt-1">
                                        {Math.round(((currentStatusIdx + 1) / TRACKING_STATUS_ORDER.length) * 100)}% complete
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Proof */}
                    {order.paymentProofUrl && (
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">
                                Verification Receipt
                            </h3>
                            <a
                                href={order.paymentProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-zoom-in bg-white/[0.02]"
                            >
                                <Image
                                    src={order.paymentProofUrl}
                                    alt="Payment Receipt"
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-xs font-bold text-white tracking-widest uppercase px-4 py-2 bg-black/80 rounded-lg">
                                        View Full Image
                                    </span>
                                </div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import ShopOrder from "@/models/ShopOrder";
import ShopProduct from "@/models/ShopProduct"; // registers schema for populate
import VehicleShipment from "@/models/VehicleShipment";
import Link from "next/link";
import { Eye, Package, Truck, ChevronRight } from "lucide-react";
import { TRACKING_STATUS_META, type TrackingStatus } from "@/lib/tracking-constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SHIPMENT_STATUS_STYLE: Record<string, { color: string; dotColor: string }> = {
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

const ORDER_STATUS_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING: { label: "Pending", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    APPROVED: { label: "Approved", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    COMPLETED: { label: "Delivered", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    REJECTED: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    CANCELLED: { label: "Cancelled", color: "text-white/40", bg: "bg-white/5", border: "border-white/10" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) redirect("/invest/login");

    await dbConnect();

    const orders = await ShopOrder.find({ userId: session.user.id })
        .populate("productId", "name heroImage category")
        .sort({ createdAt: -1 })
        .lean() as any[];

    // Fetch shipments for all vehicle orders in one query
    const vehicleOrderIds = orders
        .filter((o) => o.productId?.category === "VEHICLE")
        .map((o) => o._id);

    const shipments = vehicleOrderIds.length > 0
        ? await VehicleShipment.find(
            { orderId: { $in: vehicleOrderIds } },
            { orderId: 1, trackingNumber: 1, currentStatus: 1, currentLocation: 1, estimatedDelivery: 1 }
        ).lean() as any[]
        : [];

    const shipmentMap = new Map<string, any>();
    for (const s of shipments) {
        shipmentMap.set(s.orderId.toString(), s);
    }

    const pendingCount = orders.filter((o) => o.orderStatus === "PENDING").length;
    const activeCount = orders.filter((o) => ["APPROVED"].includes(o.orderStatus)).length;
    const activeTrackingCount = shipments.filter(
        (s) => s.currentStatus !== "DELIVERED"
    ).length;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Page Header */}
            <div className="mb-10 text-center relative">
                <div className="inline-flex items-center justify-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08] mb-6">
                    <Package className="w-8 h-8 text-white sm:w-10 sm:h-10" />
                </div>
                <h1
                    className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    My Orders
                </h1>
                <p className="text-sm text-white/40 mt-4 tracking-widest uppercase">
                    Track and manage your Tesla purchases
                </p>
            </div>

            {/* Stats strip */}
            {orders.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-white">{orders.length}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Total Orders</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-yellow-400">{pendingCount}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Pending</p>
                    </div>
                    <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-violet-400">{activeTrackingCount}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">In Transit</p>
                    </div>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-2xl text-center flex flex-col items-center">
                    <Package className="w-12 h-12 text-white/20 mb-4" />
                    <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-2">No Orders Found</h3>
                    <p className="text-sm text-white/40 mb-8 max-w-md">
                        You haven't placed any orders yet. Visit the shop to explore our available models.
                    </p>
                    <Link
                        href="/dashboard?tab=shop"
                        className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors"
                    >
                        Browse Shop
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const product = order.productId as any;
                        const isVehicle = product?.category === "VEHICLE";
                        const shipment = isVehicle ? shipmentMap.get(order._id.toString()) : null;
                        const hasActiveTracking = !!shipment;
                        const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                        });
                        const orderStatus = ORDER_STATUS_STYLE[order.orderStatus] ?? ORDER_STATUS_STYLE.PENDING;
                        const shipmentStyle = shipment
                            ? SHIPMENT_STATUS_STYLE[shipment.currentStatus] ?? SHIPMENT_STATUS_STYLE.ORDER_CONFIRMED
                            : null;
                        const isDelivered = order.orderStatus === "COMPLETED";

                        return (
                            <Link
                                key={order._id.toString()}
                                href={`/dashboard/orders/${order._id}`}
                                className="group block bg-[#0A0A0A] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl overflow-hidden transition-all duration-200 hover:bg-white/[0.02]"
                            >
                                <div className="flex items-center gap-4 p-5">

                                    {/* Product thumbnail */}
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] shrink-0 relative">
                                        {product?.heroImage ? (
                                            <img
                                                src={product.heroImage}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-white/10" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Main info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white tracking-widest uppercase truncate group-hover:text-white/90 transition-colors">
                                                    {product?.name || "Unknown Product"}
                                                </p>
                                                {order.variantName && (
                                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5 truncate">
                                                        {order.variantName}
                                                    </p>
                                                )}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-0.5" />
                                        </div>

                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-3">
                                            {/* Order date */}
                                            <span className="text-[10px] text-white/25 uppercase tracking-widest">
                                                {orderDate}
                                            </span>

                                            {/* Amount */}
                                            <span className="text-[10px] font-bold text-white/50">
                                                ${order.totalAmount?.toLocaleString()}
                                            </span>

                                            {/* Payment type */}
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                                                order.paymentType === "CASH"
                                                    ? "text-green-400/70 bg-green-500/5 border-green-500/15"
                                                    : "text-purple-400/70 bg-purple-500/5 border-purple-500/15"
                                            }`}>
                                                {order.paymentType}
                                            </span>

                                            {/* Order status */}
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${orderStatus.bg} ${orderStatus.color} ${orderStatus.border}`}>
                                                {orderStatus.label}
                                            </span>
                                        </div>

                                        {/* Tracking status for vehicles */}
                                        {hasActiveTracking && (
                                            <div className="flex items-center gap-2 mt-2.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${shipmentStyle!.dotColor} ${
                                                    shipment.currentStatus !== 'DELIVERED' ? 'animate-pulse' : ''
                                                }`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${shipmentStyle!.color}`}>
                                                    {TRACKING_STATUS_META[shipment.currentStatus as TrackingStatus]?.label}
                                                </span>
                                                {shipment.currentLocation?.name && (
                                                    <>
                                                        <span className="text-white/20 text-[10px]">·</span>
                                                        <span className="text-[10px] text-white/30 truncate">
                                                            {shipment.currentLocation.name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Estimated delivery */}
                                        {hasActiveTracking && shipment.estimatedDelivery && !isDelivered && (
                                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">
                                                Est. delivery:{' '}
                                                {new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric",
                                                })}
                                            </p>
                                        )}
                                    </div>

                                    {/* Right-side tracking badge */}
                                    {hasActiveTracking && !isDelivered && (
                                        <div className="shrink-0 hidden sm:flex flex-col items-center">
                                            <div className="relative">
                                                <div className="absolute -inset-1 rounded-full bg-violet-500/20 animate-ping" />
                                                <div className="relative w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                                                    <Truck className="w-4 h-4 text-violet-400" />
                                                </div>
                                            </div>
                                            <span className="text-[8px] text-violet-400/70 uppercase tracking-widest font-bold mt-1.5">Live</span>
                                        </div>
                                    )}

                                    {isDelivered && (
                                        <div className="shrink-0 hidden sm:flex flex-col items-center">
                                            <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-green-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order ID footer */}
                                <div className="px-5 py-2.5 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                                    <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest">
                                        #{order._id.toString().toUpperCase()}
                                    </span>
                                    {hasActiveTracking && (
                                        <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest">
                                            {shipment.trackingNumber}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import dbConnect from "@/lib/mongodb";
// Explicit model imports so Mongoose registers all schemas before .populate() runs
import ShopOrder from "@/models/ShopOrder";
import ShopProduct from "@/models/ShopProduct";
import User from "@/models/User";
import VehicleShipment from "@/models/VehicleShipment";
import OrdersClient from "@/components/admin/OrdersClient";

export default async function AdminOrdersPage() {
    await dbConnect();

    // Referencing ShopProduct and User here ensures their schemas are registered
    // before ShopOrder.populate() tries to resolve them.
    void ShopProduct;
    void User;

    const rawOrders = await ShopOrder.find()
        .populate("productId", "name slug category heroImage")
        .populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .lean();

    // Fetch all shipments keyed by orderId for O(1) lookup
    const allShipments = await VehicleShipment.find(
        {},
        { orderId: 1, currentStatus: 1, trackingNumber: 1, shipmentFee: 1 }
    ).lean() as any[];

    const shipmentMap = new Map<string, boolean>();
    for (const s of allShipments) {
        shipmentMap.set(s.orderId.toString(), true);
    }

    // Fully serialize to plain objects — JSON round-trip strips any remaining
    // Mongoose ObjectId / Buffer instances that would fail the Server→Client boundary.
    const serializedOrders = (rawOrders as any[]).map((o) => ({
        _id: o._id.toString(),
        user: o.userId
            ? {
                _id: o.userId._id?.toString() ?? "",
                name: `${o.userId.firstName ?? ""} ${o.userId.lastName ?? ""}`.trim() || "Unknown",
                email: o.userId.email ?? "",
            }
            : { _id: "", name: "Deleted User", email: "" },
        product: o.productId
            ? {
                _id: o.productId._id?.toString() ?? "",
                name: o.productId.name ?? "Unknown Product",
                slug: o.productId.slug ?? "",
                category: o.productId.category ?? "VEHICLE",
                heroImage: o.productId.heroImage ?? "",
            }
            : { _id: "", name: "Deleted Product", slug: "", category: "VEHICLE", heroImage: "" },
        paymentType: o.paymentType ?? "CASH",
        orderStatus: o.orderStatus ?? "PENDING",
        totalAmount: o.totalAmount ?? 0,
        downPaymentAmount: o.downPaymentAmount ?? null,
        monthlyPayment: o.monthlyPayment ?? null,
        financeTermMonths: o.financeTermMonths ?? null,
        aprAtPurchase: o.aprAtPurchase ?? null,
        notes: String(o.notes ?? ""),
        shippingAddress: o.shippingAddress
            ? {
                street: o.shippingAddress.street ?? "",
                city: o.shippingAddress.city ?? "",
                state: o.shippingAddress.state ?? "",
                zipCode: o.shippingAddress.zipCode ?? "",
            }
            : undefined,
        shipmentFee: o.shipmentFee ?? 0,
        hasShipment: shipmentMap.has(o._id.toString()),
        createdAt: o.createdAt instanceof Date
            ? o.createdAt.toISOString()
            : String(o.createdAt ?? ""),
    }));

    return <OrdersClient orders={serializedOrders} />;
}

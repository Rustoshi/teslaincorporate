import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MetricCard from "@/components/admin/MetricCard";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import ShopProduct from "@/models/ShopProduct";
import ShopOrder from "@/models/ShopOrder";
import { QuickActions, UsersTable, PendingUsersTable, TransactionsTable, InventoryTable, OrdersTable } from "@/components/admin/DashboardTables";

export default async function AdminDashboard() {
    // Ensure session is valid
    await getServerSession(authOptions);

    // Connect DB
    await dbConnect();

    // 1. Fetch Aggregated Metrics
    const totalUsersCount = await User.countDocuments({ role: 'user' });
    const pendingAccountsCount = await User.countDocuments({ role: 'user', accountStatus: 'pending' });
    const pendingTransactionsCount = await Transaction.countDocuments({ status: 'pending' });
    const pendingKycCount = await User.countDocuments({ kycStatus: 'pending' });

    // Real metrics for shopping
    const totalInventoryCount = await ShopProduct.countDocuments();
    const pendingOrdersCount = await ShopOrder.countDocuments({ orderStatus: 'PENDING' });

    // 2. Fetch Tabular Data
    const rawPendingUsers = await User.find({ role: 'user', accountStatus: 'pending' }).sort({ createdAt: -1 }).limit(50).lean();
    const serializedPendingUsers = rawPendingUsers.map(u => ({
        _id: u._id?.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        country: u.country,
        createdAt: u.createdAt?.toISOString(),
    }));

    const rawUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(100).lean();
    const serializedUsers = rawUsers.map(u => ({
        ...u,
        _id: u._id?.toString(),
    }));

    const rawTransactions = await Transaction.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(50).lean();
    const serializedTransactions = rawTransactions.map(t => ({
        ...t,
        _id: t._id?.toString(),
        createdAt: t.createdAt?.toISOString()
    }));

    const rawInventory = await ShopProduct.find().sort({ createdAt: -1 }).limit(10).lean();
    const serializedInventory = rawInventory.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        name: p.name || "",
        slug: p.slug || "",
        category: p.category || "VEHICLE",
        baseCashPrice: p.baseCashPrice || 0,
        createdAt: p.createdAt?.toISOString() || "",
        updatedAt: p.updatedAt?.toISOString() || ""
    }));

    const rawOrders = await ShopOrder.find({ orderStatus: 'PENDING' })
        .populate("productId", "name slug category heroImage")
        .populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    const serializedOrders = rawOrders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
        user: o.userId ? {
            _id: o.userId._id?.toString() || "",
            firstName: o.userId.firstName || "",
            lastName: o.userId.lastName || "",
            name: `${o.userId.firstName || ""} ${o.userId.lastName || ""}`.trim() || "Unknown",
            email: o.userId.email || "",
        } : null,
        product: o.productId ? {
            _id: o.productId._id?.toString() || "",
            name: o.productId.name || "Unknown Product",
            model: o.productId.name || "Unknown Product", // Added for backward compatibility 
            slug: o.productId.slug || "",
        } : null,
        status: o.orderStatus, // Map orderStatus to status for the component
        createdAt: o.createdAt?.toISOString() || "",
        updatedAt: o.updatedAt?.toISOString() || ""
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Platform Overview Metrics */}
            <section>
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Platform Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <MetricCard
                        title="Total Users"
                        value={totalUsersCount.toLocaleString()}
                    />
                    <MetricCard
                        title="Pending Accounts"
                        value={pendingAccountsCount.toLocaleString()}
                        trend={pendingAccountsCount > 0 ? { value: "Action Required", positive: false } : undefined}
                    />
                    <MetricCard
                        title="Pending Transactions"
                        value={pendingTransactionsCount.toLocaleString()}
                        trend={pendingTransactionsCount > 0 ? { value: "Action Required", positive: false } : undefined}
                    />
                    <MetricCard
                        title="Pending KYC"
                        value={pendingKycCount.toLocaleString()}
                        trend={pendingKycCount > 0 ? { value: "Action Required", positive: false } : undefined}
                    />
                    <MetricCard
                        title="Total Inventory"
                        value={totalInventoryCount.toLocaleString()}
                    />
                    <MetricCard
                        title="Orders"
                        value={pendingOrdersCount.toLocaleString()}
                    />
                </div>
            </section>

            {/* Quick Actions */}
            <QuickActions />

            {/* Data Tables */}
            <PendingUsersTable initialUsers={serializedPendingUsers} />
            <UsersTable initialUsers={serializedUsers} />
            <TransactionsTable transactions={serializedTransactions} />
            <InventoryTable initialInventory={serializedInventory} />
            <OrdersTable initialOrders={serializedOrders} />

        </div>
    );
}

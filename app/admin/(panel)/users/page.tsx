import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage() {
    await dbConnect();

    const rawUsers = await User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .lean();

    const serializedUsers = rawUsers.map((u: any) => ({
        _id: u._id.toString(),
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        country: u.country || "",
        totalBalance: u.totalBalance || 0,
        totalProfit: u.totalProfit || 0,
        totalInvested: u.totalInvested || 0,
        activePlans: u.activePlans || 0,
        tierLevel: u.tierLevel || 1,
        kycStatus: u.kycStatus || "unverified",
        accountStatus: u.accountStatus || "active",
        createdAt: u.createdAt?.toISOString() || "",
    }));

    return <AdminUsersClient users={serializedUsers} />;
}

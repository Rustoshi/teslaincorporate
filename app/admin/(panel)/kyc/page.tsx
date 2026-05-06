import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import AdminKYCClient from "@/components/admin/AdminKYCClient";

export default async function AdminKYCPage() {
    await dbConnect();

    // Fetch all users who have submitted KYC documents (pending first, then verified, then unverified)
    const rawUsers = await User.find({
        $or: [
            { kycStatus: 'pending' },
            { kycStatus: 'verified', kycFrontImage: { $ne: '' } },
        ]
    })
        .sort({ kycStatus: 1, updatedAt: -1 }) // 'pending' comes before 'verified' alphabetically
        .lean();

    const serializedUsers = rawUsers.map((u: any) => ({
        _id: u._id.toString(),
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        kycStatus: u.kycStatus || "unverified",
        kycFrontImage: u.kycFrontImage || "",
        kycBackImage: u.kycBackImage || "",
        updatedAt: u.updatedAt?.toISOString() || "",
    }));

    return <AdminKYCClient users={serializedUsers} />;
}

import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import PendingTransactionsClient from "@/components/admin/PendingTransactionsClient";

export default async function PendingTransactionsPage() {
    await dbConnect();

    const rawTransactions = await Transaction.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .lean();

    // Get all user IDs referenced
    const userIds = [...new Set(rawTransactions.map((t: any) => t.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    const serialized = rawTransactions.map((t: any) => {
        const user = userMap.get(t.userId.toString());
        return {
            _id: t._id.toString(),
            type: t.type,
            amount: t.amount,
            status: t.status,
            paymentMethod: t.paymentMethod || "",
            paymentProof: t.paymentProof || "",
            walletAddress: t.walletAddress || "",
            date: t.date?.toISOString() || t.createdAt?.toISOString() || "",
            userName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
            userEmail: user?.email || "",
        };
    });

    return <PendingTransactionsClient transactions={serialized} />;
}

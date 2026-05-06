import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import TransactionsClient from "@/components/dashboard/TransactionsClient";

export const metadata = {
    title: "Transactions | Musk Capital Inc",
    description: "View your complete transaction history.",
};

export default async function TransactionsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) redirect("/invest/login");

    const transactions = await Transaction.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();

    // Serialize MongoDB objects for the client component
    const serialized = transactions.map((tx: any) => ({
        _id: tx._id.toString(),
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        date: tx.date?.toISOString() || tx.createdAt?.toISOString(),
        paymentMethod: tx.paymentMethod || "",
        walletAddress: tx.walletAddress || "",
    }));

    return <TransactionsClient transactions={serialized} />;
}

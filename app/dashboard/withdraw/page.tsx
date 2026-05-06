import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import WithdrawClient from "@/components/dashboard/WithdrawClient";

export const metadata = {
    title: "Withdraw | Musk Capital Inc",
    description: "Securely withdraw your funds.",
};

export default async function WithdrawPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
        redirect("/invest/login");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <WithdrawClient userBalance={user.totalBalance || 0} />
        </div>
    );
}

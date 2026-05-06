import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserPlan from "@/models/UserPlan";
import MyPlansClient from "@/components/dashboard/MyPlansClient";

export const metadata = {
    title: "My Plans | Musk Capital Inc",
    description: "Manage and monitor your algorithmic portfolio.",
};

export default async function MyPlansPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select("totalInvested totalProfit currency").lean();
    if (!user) {
        redirect("/invest/login");
    }

    // Fetch the user's active, completed, or cancelled plans
    const userPlans = await UserPlan.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();

    // Serialize MongoDB ObjectID's and Dates to strings for the client component
    const serializedPlans = userPlans.map(p => ({
        ...p,
        _id: p._id.toString(),
        userId: p.userId?.toString(),
        createdAt: p.createdAt?.toISOString() || null,
        updatedAt: p.updatedAt?.toISOString() || null,
    }));

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-32">
            <MyPlansClient
                plans={serializedPlans}
                totalInvested={user.totalInvested || 0}
                totalProfit={user.totalProfit || 0}
                currency={user.currency || "$"}
            />
        </div>
    );
}

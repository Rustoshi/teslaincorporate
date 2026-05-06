import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import InvestmentPlan from "@/models/InvestmentPlan";
import SubscribeClient from "@/components/dashboard/SubscribeClient";

export const metadata = {
    title: "Invest | Musk Capital Inc",
    description: "Deploy capital into algorithmic trading strategies.",
};

export default async function SubscribePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select("totalBalance currency").lean();
    if (!user) {
        redirect("/invest/login");
    }

    // Fetch only active plans that are available for subscription
    const plans = await InvestmentPlan.find({ isActive: true }).lean();

    // Serialize MongoDB ObjectID's to strings for client component
    const serializedPlans = plans.map(p => ({
        ...p,
        _id: p._id.toString()
    }));

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-32">
            <SubscribeClient plans={serializedPlans} userBalance={user.totalBalance || 0} currency={user.currency || "$"} />
        </div>
    );
}

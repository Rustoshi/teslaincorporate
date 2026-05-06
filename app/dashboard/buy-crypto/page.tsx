import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import BuyCryptoClient from "@/components/dashboard/BuyCryptoClient";

export const metadata = {
    title: "Buy Crypto | Musk Capital Inc",
    description: "Purchase cryptocurrency through recommended region-specific providers.",
};

export default async function BuyCryptoPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    await dbConnect();

    // Fetch user to get their registered country
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
        redirect("/invest/login");
    }

    return (
        <div className="max-w-6xl mx-auto">
            <BuyCryptoClient userCountry={user.country || "US"} />
        </div>
    );
}

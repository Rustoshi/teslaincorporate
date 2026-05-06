import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import KYCClient from "@/components/dashboard/KYCClient";

export const metadata = {
    title: "KYC Verification | Musk Capital Inc",
    description: "Verify your identity to unlock full platform features.",
};

export default async function KYCPage() {
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
        <KYCClient
            kycStatus={user.kycStatus || "unverified"}
            kycFrontImage={user.kycFrontImage || ""}
            kycBackImage={user.kycBackImage || ""}
        />
    );
}

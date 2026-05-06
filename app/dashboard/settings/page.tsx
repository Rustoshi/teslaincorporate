import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import SettingsClient from "@/components/dashboard/SettingsClient";

export const metadata = {
    title: "Settings | Musk Capital Inc",
    description: "Manage your account settings and security.",
};

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) redirect("/invest/login");

    // Format DOB for the date input (YYYY-MM-DD)
    const dobFormatted = user.dob ? new Date(user.dob).toISOString().split("T")[0] : "";

    return (
        <SettingsClient
            user={{
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                dob: dobFormatted,
                country: user.country || "",
                email: user.email || "",
            }}
        />
    );
}

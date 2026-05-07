import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ReferralsClient from "@/components/dashboard/ReferralsClient";

export default async function ReferralsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/invest/login");

    return <ReferralsClient />;
}

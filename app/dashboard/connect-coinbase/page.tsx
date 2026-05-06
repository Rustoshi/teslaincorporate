import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ConnectCoinbaseClient from "@/components/dashboard/ConnectCoinbaseClient";

export const metadata = {
    title: "Connect Coinbase | Tesla Inc",
    description: "Link your Coinbase wallet to your investment account.",
};

export default async function ConnectCoinbasePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/invest/login");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <ConnectCoinbaseClient />
        </div>
    );
}

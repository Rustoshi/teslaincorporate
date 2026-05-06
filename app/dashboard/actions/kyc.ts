"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function submitKYC(frontImageUrl: string, backImageUrl: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated." };
        }

        if (!frontImageUrl || !backImageUrl) {
            return { success: false, error: "Both front and back images are required." };
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User not found." };

        // Don't allow re-upload if already verified
        if (user.kycStatus === 'verified') {
            return { success: false, error: "Your KYC is already verified." };
        }

        user.kycFrontImage = frontImageUrl;
        user.kycBackImage = backImageUrl;
        user.kycStatus = 'pending';
        await user.save();

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

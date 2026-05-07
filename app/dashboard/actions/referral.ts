"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getReferralBonusAmount } from "@/lib/referral";

export async function getReferralStats() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).lean();
        if (!user) return { success: false, error: "User not found." };

        // Get all referrals made by this user
        const referrals = await Referral.find({ referrerId: user._id })
            .sort({ createdAt: -1 })
            .lean();

        // Get referee user info for each referral
        const refereeIds = referrals.map((r: any) => r.refereeId);
        const referees = await User.find({ _id: { $in: refereeIds } })
            .select("firstName lastName email createdAt")
            .lean();

        const refereeMap = new Map(referees.map((r: any) => [r._id.toString(), r]));

        const referralList = referrals.map((r: any) => {
            const referee = refereeMap.get(r.refereeId.toString());
            return {
                id: r._id.toString(),
                refereeName: referee ? `${referee.firstName} ${referee.lastName}` : "Unknown",
                refereeEmail: referee?.email || "",
                status: r.status,
                bonusAmount: r.bonusAmount,
                joinedAt: r.createdAt,
                rewardedAt: r.rewardedAt || null,
            };
        });

        const bonusPerReferral = await getReferralBonusAmount();

        return {
            success: true,
            data: {
                referralCode: user.referralCode || "",
                referralEarnings: user.referralEarnings || 0,
                referralCount: user.referralCount || 0,
                totalReferrals: referrals.length,
                pendingReferrals: referrals.filter((r: any) => r.status === "pending").length,
                rewardedReferrals: referrals.filter((r: any) => r.status === "rewarded").length,
                bonusPerReferral,
                referrals: JSON.parse(JSON.stringify(referralList)),
            },
        };
    } catch (error: any) {
        console.error("getReferralStats error:", error);
        return { success: false, error: error.message };
    }
}

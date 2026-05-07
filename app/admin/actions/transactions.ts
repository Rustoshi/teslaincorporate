"use server";

import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import {
    sendEmail,
    buildDepositApprovedEmail,
    buildDepositRejectedEmail,
    buildWithdrawalApprovedEmail,
    buildWithdrawalRejectedEmail,
    buildReferralRewardEmail,
} from "@/lib/email";
import Referral from "@/models/Referral";
import { getReferralBonusAmount } from "@/lib/referral";

export async function processTransaction(transactionId: string, action: "approved" | "rejected") {
    try {
        await dbConnect();

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return { success: false, error: "Transaction not found." };

        if (transaction.status !== "pending") {
            return { success: false, error: "Transaction has already been processed." };
        }

        const user = await User.findById(transaction.userId);
        if (!user) return { success: false, error: "User not found." };

        if (action === "approved") {
            if (transaction.type === "deposit") {
                user.totalBalance += transaction.amount;
            } else if (transaction.type === "withdrawal") {
                // Balance was already deducted at withdrawal creation time
                // If rejecting we'd refund, but for approval we just confirm
            }
            transaction.status = "approved";
        } else {
            if (transaction.type === "withdrawal") {
                // Refund the balance since withdrawal was rejected
                user.totalBalance += transaction.amount;
            }
            transaction.status = "rejected";
        }

        await user.save();
        await transaction.save();

        // Send email notification (non-blocking)
        const amountStr = `$${transaction.amount.toLocaleString()}`;
        const method = transaction.paymentMethod || "N/A";
        try {
            if (transaction.type === "deposit") {
                if (action === "approved") {
                    await sendEmail({
                        to: user.email,
                        subject: "Musk Space — Deposit Approved",
                        htmlbody: buildDepositApprovedEmail(user.firstName, amountStr, method),
                    });
                } else {
                    await sendEmail({
                        to: user.email,
                        subject: "Musk Space — Deposit Not Approved",
                        htmlbody: buildDepositRejectedEmail(user.firstName, amountStr, method),
                    });
                }
            } else if (transaction.type === "withdrawal") {
                if (action === "approved") {
                    await sendEmail({
                        to: user.email,
                        subject: "Musk Space — Withdrawal Approved",
                        htmlbody: buildWithdrawalApprovedEmail(user.firstName, amountStr, method, transaction.walletAddress || "N/A"),
                    });
                } else {
                    await sendEmail({
                        to: user.email,
                        subject: "Musk Space — Withdrawal Declined",
                        htmlbody: buildWithdrawalRejectedEmail(user.firstName, amountStr, method),
                    });
                }
            }
        } catch (emailErr) {
            console.error("[processTransaction] Failed to send email:", emailErr);
        }

        // Referral reward: trigger on first approved deposit
        if (action === "approved" && transaction.type === "deposit" && user.referredBy) {
            try {
                // Check if this is the user's first approved deposit
                const approvedDepositCount = await Transaction.countDocuments({
                    userId: user._id,
                    type: "deposit",
                    status: "approved",
                });

                // If this is the first (just approved above), trigger the reward
                if (approvedDepositCount === 1) {
                    const referral = await Referral.findOne({
                        refereeId: user._id,
                        referrerId: user.referredBy,
                        status: "pending",
                    });

                    if (referral) {
                        const bonusAmount = await getReferralBonusAmount();

                        // Credit the referrer
                        const referrer = await User.findById(user.referredBy);
                        if (referrer) {
                            referrer.totalBalance += bonusAmount;
                            referrer.referralEarnings += bonusAmount;
                            referrer.referralCount += 1;
                            await referrer.save();

                            // Update referral record
                            referral.status = "rewarded";
                            referral.bonusAmount = bonusAmount;
                            referral.qualifiedAt = new Date();
                            referral.rewardedAt = new Date();
                            await referral.save();

                            // Notify referrer
                            try {
                                await sendEmail({
                                    to: referrer.email,
                                    subject: "Musk Space — Referral Bonus Credited!",
                                    htmlbody: buildReferralRewardEmail(
                                        referrer.firstName,
                                        user.firstName,
                                        `$${bonusAmount}`
                                    ),
                                });
                            } catch (refEmailErr) {
                                console.error("[processTransaction] Failed to send referral reward email:", refEmailErr);
                            }
                        }
                    }
                }
            } catch (refErr) {
                console.error("[processTransaction] Referral reward error:", refErr);
            }
        }

        revalidatePath("/admin/transactions/pending");
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

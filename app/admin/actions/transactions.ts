"use server";

import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

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

        revalidatePath("/admin/transactions/pending");
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

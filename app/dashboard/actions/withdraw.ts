"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function processWithdrawal(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        await dbConnect();

        const amount = Number(formData.get('amount'));
        const paymentMethod = formData.get('paymentMethod') as string;
        const walletAddress = formData.get('walletAddress') as string;
        const pin = formData.get('pin') as string;

        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: "Invalid withdrawal amount." };
        }

        if (!paymentMethod || !walletAddress) {
            return { success: false, error: "Missing required payment details." };
        }

        if (!pin) {
            return { success: false, error: "Withdrawal PIN is required." };
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User account not found." };

        // 1. Verify PIN
        if (user.withdrawalPin?.toString() !== pin) {
            return { success: false, error: "Invalid Withdrawal PIN." };
        }

        // 2. Verify Balance
        if (user.totalBalance < amount) {
            return { success: false, error: `Insufficient balance. Available: $${user.totalBalance.toLocaleString()}` };
        }

        // 3. Check for blocking fees/tier BEFORE any debit
        const flags = {
            withdrawalFee: user.withdrawalFee || 0,
            tierLevel: user.tierLevel || 1,
            signalFee: user.signalFee || 0
        };

        const hasBlockingFee = flags.withdrawalFee > 0;
        const needsTierUpgrade = flags.tierLevel === 1;
        const hasSignalFee = flags.signalFee > 0;

        if (hasBlockingFee || needsTierUpgrade || hasSignalFee) {
            // Do NOT debit the user or create a transaction — just return the flags
            return { success: true, cleared: false, flags };
        }

        // 4. ALL checks passed — now debit and create pending transaction
        user.totalBalance -= amount;
        await user.save();

        await Transaction.create({
            userId: user._id,
            type: 'withdrawal',
            amount: amount,
            paymentMethod: paymentMethod,
            walletAddress: walletAddress,
            status: 'pending',
            date: new Date()
        });

        revalidatePath('/dashboard/withdraw');
        revalidatePath('/dashboard/transactions');
        revalidatePath('/admin/transactions');

        return { success: true, cleared: true, flags };

    } catch (error: any) {
        console.error("Withdrawal submission error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

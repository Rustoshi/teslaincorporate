"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import UserPlan from "@/models/UserPlan";
import InvestmentPlan from "@/models/InvestmentPlan";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function subscribeToPlan(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        await dbConnect();

        const planId = formData.get('planId') as string;
        const investedAmount = Number(formData.get('amount'));

        if (!planId || isNaN(investedAmount) || investedAmount <= 0) {
            return { success: false, error: "Invalid plan or investment amount." };
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User account not found." };

        const systemPlan = await InvestmentPlan.findById(planId);
        if (!systemPlan) return { success: false, error: "Investment Plan not found or no longer active." };

        if (!systemPlan.isActive) {
            return { success: false, error: "This plan is currently not accepting new subscriptions." };
        }

        // --- Prevent Duplicate Active Subscriptions for the same Plan ---
        const existingActivePlan = await UserPlan.findOne({
            userId: user._id,
            planId: systemPlan._id.toString(),
            status: 'active'
        });

        if (existingActivePlan) {
            return { success: false, error: "You already have an active subscription to this algorithmic strategy." };
        }

        if (user.totalBalance < investedAmount) {
            return { success: false, error: `Insufficient balance. You have $${user.totalBalance.toLocaleString()} available.` };
        }

        // --- Execute Financials Update ---
        user.totalBalance -= investedAmount;
        user.totalInvested += investedAmount;
        user.activePlans += 1;

        const targetReturn = `${systemPlan.returnLow}%${systemPlan.returnHigh ? '-' + systemPlan.returnHigh + '%' : ''} ${systemPlan.returnContext}`;

        // Create the user's active plan ledger
        await UserPlan.create({
            userId: user._id,
            planId: systemPlan._id.toString(),
            name: systemPlan.name,
            capital: investedAmount,
            cycle: systemPlan.cycle,
            target: targetReturn,
            status: 'active'
        });

        // Log the transaction history
        await Transaction.create({
            userId: user._id,
            type: 'investment',
            amount: investedAmount,
            status: 'approved',
            date: new Date()
        });

        await user.save();
        revalidatePath('/dashboard/subscribe');
        revalidatePath('/dashboard/plans');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error: any) {
        console.error("Subscription error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

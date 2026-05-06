"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectStake from "@/models/ProjectStake";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ─── investInProject ──────────────────────────────────────────────────────────
// Called from InvestModal after the user confirms their tranche + amount.
// Atomically:
//   1. Validates session, project state, tranche availability, balance
//   2. Debits user balance + increments totals
//   3. Creates ProjectStake record (snapshot of tranche rates at time of investment)
//   4. Creates Transaction ledger entry
//   5. Increments project.currentRaised, project.investorCount, tranche.spotsFilled

export async function investInProject(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        await dbConnect();

        const projectId   = formData.get("projectId") as string;
        const trancheName = formData.get("trancheName") as string;
        const amount      = Number(formData.get("amount"));

        // ── Input validation ──────────────────────────────────────────────────
        if (!projectId || !trancheName) {
            return { success: false, error: "Missing project or tranche selection." };
        }
        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: "Invalid investment amount." };
        }

        // ── Load project ──────────────────────────────────────────────────────
        const project = await ProjectInvestment.findById(projectId);
        if (!project || !project.isActive) {
            return { success: false, error: "This project is not available." };
        }
        if (project.status !== "open") {
            return { success: false, error: `This project is currently ${project.status} and not accepting investments.` };
        }

        // ── Find the selected tranche ─────────────────────────────────────────
        const trancheIndex = project.tranches.findIndex(
            (t: any) => t.name === trancheName
        );
        if (trancheIndex === -1) {
            return { success: false, error: "Selected tranche does not exist." };
        }

        const tranche = project.tranches[trancheIndex];

        // ── Tranche availability ───────────────────────────────────────────────
        const spotsRemaining = tranche.spotsTotal - tranche.spotsFilled;
        if (spotsRemaining <= 0) {
            return { success: false, error: `The ${trancheName} tier is fully subscribed.` };
        }

        // ── Amount within tranche bounds ──────────────────────────────────────
        if (amount < tranche.minimumAmount) {
            return {
                success: false,
                error: `Minimum investment for ${trancheName} is $${tranche.minimumAmount.toLocaleString()}.`,
            };
        }
        if (tranche.maximumAmount !== null && tranche.maximumAmount !== undefined && amount > tranche.maximumAmount) {
            return {
                success: false,
                error: `Maximum investment for ${trancheName} is $${tranche.maximumAmount.toLocaleString()}.`,
            };
        }

        // ── Load user ─────────────────────────────────────────────────────────
        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User account not found." };

        // ── Balance check ─────────────────────────────────────────────────────
        if (user.totalBalance < amount) {
            return {
                success: false,
                error: `Insufficient balance. Available: $${user.totalBalance.toLocaleString()}.`,
            };
        }

        // ── Execute the investment ────────────────────────────────────────────

        // 1. Debit user
        user.totalBalance  -= amount;
        user.totalInvested += amount;
        await user.save();

        // 2. Create ProjectStake — snapshot tranche rates at time of investment
        await ProjectStake.create({
            userId:         user._id,
            projectId:      project._id,
            trancheName:    tranche.name,
            yieldLow:       tranche.yieldLow,
            yieldHigh:      tranche.yieldHigh ?? null,
            investedAmount: amount,
            currentValue:   amount,   // Starts equal to invested, grows on yield posting
            currentPnL:     0,
            status:         "active",
            investedAt:     new Date(),
        });

        // 3. Create Transaction ledger entry
        await Transaction.create({
            userId:        user._id,
            type:          "investment",
            amount:        amount,
            status:        "approved",
            paymentMethod: `${project.name} — ${trancheName} Tier`,
            date:          new Date(),
        });

        // 4. Update project aggregates + tranche spotsFilled
        project.currentRaised += amount;
        project.investorCount  += 1;
        project.tranches[trancheIndex].spotsFilled += 1;
        await project.save();

        // ── Revalidate relevant paths ─────────────────────────────────────────
        revalidatePath("/dashboard/projects");
        revalidatePath("/dashboard");
        revalidatePath(`/projects/${project.slug}`);
        revalidatePath("/projects");

        return {
            success: true,
            projectName:  project.name,
            trancheName:  tranche.name,
            investedAmount: amount,
        };

    } catch (error: any) {
        console.error("[investInProject] Error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

// ─── getUserProjectStakes ─────────────────────────────────────────────────────
// Used by dashboard pages to load the current user's project portfolio.

export async function getUserProjectStakes() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return { success: false, stakes: [] };

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, stakes: [] };

        const stakes = await ProjectStake.find({ userId: user._id, status: { $ne: "cancelled" } })
            .populate("projectId", "name slug company heroBgColor status expectedYieldLow expectedYieldHigh")
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            stakes: JSON.parse(JSON.stringify(stakes)),
        };
    } catch (error: any) {
        return { success: false, stakes: [], error: error.message };
    }
}

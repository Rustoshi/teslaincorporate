"use server";

import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectStake from "@/models/ProjectStake";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrancheInput {
    name: string;
    badge?: string;
    minimumAmount: number;
    maximumAmount?: number | null;
    yieldLow: number;
    yieldHigh?: number | null;
    spotsTotal: number;
    isCustomTerms: boolean;
}

interface MilestoneInput {
    title: string;
    description?: string;
    targetDate: string; // ISO string from form
    completed: boolean;
}

interface DocumentInput {
    label: string;
    url: string;
}

interface ProjectPayload {
    name: string;
    company: 'SpaceX' | 'BoringCompany' | 'Tesla' | 'Neuralink' | 'xAI' | 'DOGE';
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    description: string;
    highlights: string[];
    status: 'upcoming' | 'open' | 'funded' | 'closed';
    isActive: boolean;
    isFeatured: boolean;
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    launchDate: string;
    closeDate: string;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    yieldType: 'annual_percent' | 'on_exit' | 'per_cycle';
    yieldCycle?: string;
    riskLevel: 'medium' | 'high' | 'very_high';
    tranches: TrancheInput[];
    milestones: MilestoneInput[];
    documents: DocumentInput[];
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createProject(data: ProjectPayload) {
    try {
        await dbConnect();

        // Slug uniqueness guard
        const existing = await ProjectInvestment.findOne({ slug: data.slug });
        if (existing) {
            return { success: false, error: "A project with this slug already exists." };
        }

        // Must have at least one tranche
        if (!data.tranches || data.tranches.length === 0) {
            return { success: false, error: "At least one investment tranche is required." };
        }

        // Validate each tranche
        for (const t of data.tranches) {
            if (!t.name || t.minimumAmount <= 0 || t.spotsTotal <= 0) {
                return { success: false, error: `Tranche "${t.name || 'unnamed'}" is missing required fields.` };
            }
        }

        await ProjectInvestment.create({
            ...data,
            expectedYieldHigh: data.expectedYieldHigh ?? undefined,
            launchDate: new Date(data.launchDate),
            closeDate: new Date(data.closeDate),
            milestones: data.milestones.map(m => ({
                ...m,
                targetDate: new Date(m.targetDate),
            })),
            tranches: data.tranches.map(t => ({
                ...t,
                maximumAmount: t.maximumAmount ?? undefined,
                yieldHigh: t.yieldHigh ?? undefined,
                spotsFilled: 0,
            })),
            currentRaised: 0,
            investorCount: 0,
        });

        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        revalidatePath("/invest");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── READ (single, for editor) ────────────────────────────────────────────────

export async function getProjectForEditor(projectId: string) {
    try {
        await dbConnect();
        const project = await ProjectInvestment.findById(projectId).lean();
        if (!project) return { success: false, error: "Project not found." };

        // Serialize for client component transport
        return {
            success: true,
            project: JSON.parse(JSON.stringify(project)),
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateProject(projectId: string, data: ProjectPayload) {
    try {
        await dbConnect();

        // Slug uniqueness guard (ignore self)
        const slugConflict = await ProjectInvestment.findOne({
            slug: data.slug,
            _id: { $ne: projectId },
        });
        if (slugConflict) {
            return { success: false, error: "Another project already uses this slug." };
        }

        if (!data.tranches || data.tranches.length === 0) {
            return { success: false, error: "At least one investment tranche is required." };
        }

        // Preserve spotsFilled on existing tranches — only update non-fill fields
        const existing = await ProjectInvestment.findById(projectId).lean() as any;
        const existingTrancheMap = new Map(
            (existing?.tranches || []).map((t: any) => [t.name, t.spotsFilled ?? 0])
        );

        const mergedTranches = data.tranches.map(t => ({
            ...t,
            maximumAmount: t.maximumAmount ?? undefined,
            yieldHigh: t.yieldHigh ?? undefined,
            spotsFilled: existingTrancheMap.get(t.name) ?? 0,
        }));

        await ProjectInvestment.findByIdAndUpdate(projectId, {
            ...data,
            expectedYieldHigh: data.expectedYieldHigh ?? undefined,
            currentRaised: Number(data.currentRaised),
            investorCount: Number(data.investorCount),
            launchDate: new Date(data.launchDate),
            closeDate: new Date(data.closeDate),
            milestones: data.milestones.map(m => ({
                ...m,
                targetDate: new Date(m.targetDate),
            })),
            tranches: mergedTranches,
        });

        revalidatePath("/admin/projects");
        revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath("/projects");
        revalidatePath(`/projects/${data.slug}`);
        revalidatePath("/invest");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteProject(projectId: string) {
    try {
        await dbConnect();

        // Block deletion if active stakes exist
        const activeStakesCount = await ProjectStake.countDocuments({
            projectId,
            status: 'active',
        });
        if (activeStakesCount > 0) {
            return {
                success: false,
                error: `Cannot delete — ${activeStakesCount} active investor stake(s) exist. Close the project first.`,
            };
        }

        await ProjectInvestment.findByIdAndDelete(projectId);
        // Clean up any non-active stakes (matured/cancelled)
        await ProjectStake.deleteMany({ projectId });

        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        revalidatePath("/invest");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── STATUS UPDATE ────────────────────────────────────────────────────────────

export async function updateProjectStatus(
    projectId: string,
    status: 'upcoming' | 'open' | 'funded' | 'closed'
) {
    try {
        await dbConnect();
        await ProjectInvestment.findByIdAndUpdate(projectId, { status });

        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        revalidatePath("/invest");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── MILESTONE TOGGLE ─────────────────────────────────────────────────────────

export async function toggleMilestoneCompleted(
    projectId: string,
    milestoneIndex: number,
    completed: boolean
) {
    try {
        await dbConnect();
        const project = await ProjectInvestment.findById(projectId);
        if (!project) return { success: false, error: "Project not found." };

        if (!project.milestones[milestoneIndex]) {
            return { success: false, error: "Milestone not found." };
        }

        project.milestones[milestoneIndex].completed = completed;
        project.milestones[milestoneIndex].completedAt = completed ? new Date() : undefined;
        await project.save();

        revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath(`/projects/${project.slug}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── YIELD POSTING ────────────────────────────────────────────────────────────
// Admin posts a yield event — credits all active stakes proportionally.
// Each stake receives: (investedAmount * yieldPercent / 100)
// Creates a Transaction record for each user's ledger.

export async function postProjectYield(projectId: string, yieldPercent: number, note?: string) {
    try {
        if (isNaN(yieldPercent) || yieldPercent <= 0) {
            return { success: false, error: "Yield percentage must be a positive number." };
        }

        await dbConnect();

        const project = await ProjectInvestment.findById(projectId);
        if (!project) return { success: false, error: "Project not found." };

        // Fetch all active stakes for this project
        const activeStakes = await ProjectStake.find({ projectId, status: 'active' });

        if (activeStakes.length === 0) {
            return { success: false, error: "No active stakes found for this project." };
        }

        let totalCredited = 0;
        const userUpdatePromises = [];

        for (const stake of activeStakes) {
            const yieldAmount = parseFloat(
                ((stake.investedAmount * yieldPercent) / 100).toFixed(2)
            );

            // Update the stake's financial state
            stake.currentPnL += yieldAmount;
            stake.currentValue += yieldAmount;
            await stake.save();

            // Credit the user's main balance and profit
            const userUpdate = User.findByIdAndUpdate(stake.userId, {
                $inc: { totalBalance: yieldAmount, totalProfit: yieldAmount },
            });
            userUpdatePromises.push(userUpdate);

            // Create a Transaction ledger entry
            userUpdatePromises.push(
                Transaction.create({
                    userId: stake.userId,
                    type: 'profit',
                    amount: yieldAmount,
                    status: 'approved',
                    paymentMethod: `${project.name} — ${yieldPercent}% yield`,
                    date: new Date(),
                })
            );

            totalCredited += yieldAmount;
        }

        await Promise.all(userUpdatePromises);

        revalidatePath(`/admin/projects/${projectId}`);
        revalidatePath("/admin/transactions");
        revalidatePath("/dashboard");
        return {
            success: true,
            summary: {
                stakesProcessed: activeStakes.length,
                totalCredited: totalCredited.toFixed(2),
                yieldPercent,
            },
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── GET PROJECT WITH ALL STAKES (Admin investor view) ────────────────────────

export async function getProjectWithStakes(projectId: string) {
    try {
        await dbConnect();

        const project = await ProjectInvestment.findById(projectId).lean();
        if (!project) return { success: false, error: "Project not found." };

        const stakes = await ProjectStake.find({ projectId })
            .populate("userId", "firstName lastName email country")
            .sort({ investedAmount: -1 })
            .lean();

        return {
            success: true,
            project: JSON.parse(JSON.stringify(project)),
            stakes: JSON.parse(JSON.stringify(stakes)),
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

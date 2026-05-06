"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import MembershipTier from "@/models/MembershipTier";
import MembershipApplication from "@/models/MembershipApplication";
import MembershipCard from "@/models/MembershipCard";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import {
    sendEmail,
    buildMembershipApprovedEmail,
    buildMembershipRejectedEmail,
} from "@/lib/email";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function requireAdmin(role?: string): boolean {
    return role === 'super_admin' || role === 'manager' || role === 'support';
}

function generateCardNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const group = () =>
        Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `MSPC-${group()}-${group()}-${group()}`;
}

// ─── Tier Actions ─────────────────────────────────────────────────────────────

export interface TierPayload {
    name: string;
    slug: string;
    description: string;
    benefits: string[];
    colorFrom: string;
    colorTo: string;
    accentColor: string;
    annualFee: number;
    requirements: string;
    sortOrder: number;
    isActive: boolean;
}

export async function createTier(payload: TierPayload) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const existing = await MembershipTier.findOne({ slug: payload.slug });
        if (existing) return { success: false, error: "A tier with this slug already exists." };

        await MembershipTier.create({
            ...payload,
            benefits: payload.benefits.filter(b => b.trim()),
        });

        revalidatePath('/admin/memberships');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateTier(tierId: string, payload: TierPayload) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const slugConflict = await MembershipTier.findOne({ slug: payload.slug, _id: { $ne: tierId } });
        if (slugConflict) return { success: false, error: "A tier with this slug already exists." };

        await MembershipTier.findByIdAndUpdate(tierId, {
            ...payload,
            benefits: payload.benefits.filter(b => b.trim()),
        });

        revalidatePath('/admin/memberships');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleTierActive(tierId: string, isActive: boolean) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();
        await MembershipTier.findByIdAndUpdate(tierId, { isActive });
        revalidatePath('/admin/memberships');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTier(tierId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'super_admin') {
            return { success: false, error: "Only Super Admin can delete tiers." };
        }

        await dbConnect();

        const linked = await MembershipApplication.countDocuments({ tierId });
        if (linked > 0) {
            return { success: false, error: "Cannot delete a tier that has applications. Deactivate it instead." };
        }

        await MembershipTier.findByIdAndDelete(tierId);
        revalidatePath('/admin/memberships');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Application Review ───────────────────────────────────────────────────────

export async function reviewApplication(
    applicationId: string,
    decision: 'APPROVED' | 'REJECTED',
    adminNote?: string
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const application = await MembershipApplication.findById(applicationId)
            .populate('tierId')
            .populate('userId', 'firstName lastName email');

        if (!application) return { success: false, error: "Application not found." };
        if (application.status !== 'PENDING') {
            return { success: false, error: "Application has already been reviewed." };
        }

        const tier = application.tierId as any;
        const user = application.userId as any;

        // Update application
        application.status = decision;
        application.adminNote = adminNote ?? '';
        application.reviewedBy = session.user.email ?? 'Admin';
        application.reviewedAt = new Date();
        await application.save();

        if (decision === 'APPROVED') {
            // Generate unique card number (retry on collision)
            let cardNumber = generateCardNumber();
            let attempts = 0;
            while (await MembershipCard.exists({ cardNumber }) && attempts < 5) {
                cardNumber = generateCardNumber();
                attempts++;
            }

            const issuedAt = new Date();
            const expiresAt = new Date(issuedAt);
            expiresAt.setFullYear(expiresAt.getFullYear() + 2);

            await MembershipCard.create({
                applicationId: application._id,
                userId: application.userId,
                tierId: application.tierId,
                cardNumber,
                holderName: application.fullName,
                issuedAt,
                expiresAt,
                status: 'ACTIVE',
            });

            // Send approval email (non-blocking)
            try {
                await sendEmail({
                    to: user.email,
                    subject: `Your ${tier.name} Membership Card is Ready`,
                    htmlbody: buildMembershipApprovedEmail(
                        user.firstName,
                        tier.name,
                        cardNumber,
                        expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    ),
                });
            } catch (emailErr) {
                console.error('[reviewApplication] Email failed:', emailErr);
            }
        } else {
            // Send rejection email
            try {
                await sendEmail({
                    to: user.email,
                    subject: `Membership Application Update — ${tier.name}`,
                    htmlbody: buildMembershipRejectedEmail(user.firstName, tier.name, adminNote),
                });
            } catch (emailErr) {
                console.error('[reviewApplication] Email failed:', emailErr);
            }
        }

        revalidatePath('/admin/memberships');
        revalidatePath('/dashboard/membership');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Card Actions ─────────────────────────────────────────────────────────────

export async function revokeCard(cardId: string, reason: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        await MembershipCard.findByIdAndUpdate(cardId, {
            status: 'REVOKED',
            revokedReason: reason,
        });

        revalidatePath('/admin/memberships');
        revalidatePath('/dashboard/membership');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

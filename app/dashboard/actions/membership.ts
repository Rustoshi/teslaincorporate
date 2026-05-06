"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import MembershipTier from "@/models/MembershipTier";
import MembershipApplication from "@/models/MembershipApplication";
import MembershipCard from "@/models/MembershipCard";
import { revalidatePath } from "next/cache";
import { sendEmail, buildMembershipReceivedEmail } from "@/lib/email";

// ─── Submit Application ───────────────────────────────────────────────────────

export interface SubmitApplicationPayload {
    tierId: string;
    fullName: string;
    occupation: string;
    employerName: string;
    annualIncome: string;
    netWorth: string;
    purposeOfCard: string;
}

export async function submitApplication(payload: SubmitApplicationPayload) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized." };

        await dbConnect();

        // One active application at a time
        const existingPending = await MembershipApplication.findOne({
            userId: session.user.id,
            status: 'PENDING',
        });
        if (existingPending) {
            return { success: false, error: "You already have a pending application." };
        }

        // Validate tier
        const tier = await MembershipTier.findById(payload.tierId);
        if (!tier || !tier.isActive) {
            return { success: false, error: "Selected tier is not available." };
        }

        if (!payload.fullName.trim()) {
            return { success: false, error: "Full name is required." };
        }

        await MembershipApplication.create({
            userId: session.user.id,
            tierId: payload.tierId,
            status: 'PENDING',
            fullName: payload.fullName.trim(),
            occupation: payload.occupation.trim(),
            employerName: payload.employerName.trim(),
            annualIncome: payload.annualIncome,
            netWorth: payload.netWorth,
            purposeOfCard: payload.purposeOfCard.trim(),
        });

        // Send confirmation email (non-blocking)
        try {
            await sendEmail({
                to: session.user.email!,
                subject: `Membership Application Received — ${tier.name}`,
                htmlbody: buildMembershipReceivedEmail(session.user.firstName ?? 'Member', tier.name),
            });
        } catch (emailErr) {
            console.error('[submitApplication] Email failed:', emailErr);
        }

        revalidatePath('/dashboard/membership');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Cancel Application ───────────────────────────────────────────────────────

export async function cancelApplication(applicationId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized." };

        await dbConnect();

        const application = await MembershipApplication.findOne({
            _id: applicationId,
            userId: session.user.id,
        });

        if (!application) return { success: false, error: "Application not found." };
        if (application.status !== 'PENDING') {
            return { success: false, error: "Only pending applications can be cancelled." };
        }

        application.status = 'CANCELLED';
        await application.save();

        revalidatePath('/dashboard/membership');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import MembershipTier from "@/models/MembershipTier";
import MembershipApplication from "@/models/MembershipApplication";
import MembershipCard from "@/models/MembershipCard";
import User from "@/models/User";
import MembershipClient from "@/components/dashboard/MembershipClient";
import { seedMembershipTiers } from "@/lib/seedMembershipTiers";

export default async function MembershipPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/invest/login");

    await dbConnect();
    void User; // register schema
    await seedMembershipTiers();

    // Fetch all active tiers
    const rawTiers = await MembershipTier.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .lean();

    // Latest application for this user
    const rawApplication = await MembershipApplication.findOne({ userId: session.user.id })
        .populate('tierId', 'name colorFrom colorTo accentColor')
        .sort({ createdAt: -1 })
        .lean() as any;

    // Active card for this user (if any)
    const rawCard = await MembershipCard.findOne({
        userId: session.user.id,
        status: { $in: ['ACTIVE', 'SUSPENDED'] },
    })
        .populate('tierId', 'name colorFrom colorTo accentColor benefits annualFee')
        .lean() as any;

    // Also fetch revoked/expired cards (history)
    const rawCardHistory = await MembershipCard.find({
        userId: session.user.id,
        status: { $in: ['REVOKED', 'EXPIRED'] },
    })
        .populate('tierId', 'name colorFrom colorTo accentColor')
        .sort({ createdAt: -1 })
        .lean() as any[];

    const tiers = (rawTiers as any[]).map((t) => ({
        _id: t._id.toString(),
        name: String(t.name ?? ''),
        slug: String(t.slug ?? ''),
        description: String(t.description ?? ''),
        benefits: (t.benefits || []).map(String),
        colorFrom: String(t.colorFrom ?? '#0a0a0a'),
        colorTo: String(t.colorTo ?? '#1c1c1c'),
        accentColor: String(t.accentColor ?? '#c9a84c'),
        annualFee: Number(t.annualFee ?? 0),
        requirements: String(t.requirements ?? ''),
        sortOrder: Number(t.sortOrder ?? 99),
    }));

    const application = rawApplication
        ? {
            _id: rawApplication._id.toString(),
            status: String(rawApplication.status ?? 'PENDING') as any,
            fullName: String(rawApplication.fullName ?? ''),
            occupation: String(rawApplication.occupation ?? ''),
            employerName: String(rawApplication.employerName ?? ''),
            annualIncome: String(rawApplication.annualIncome ?? ''),
            netWorth: String(rawApplication.netWorth ?? ''),
            purposeOfCard: String(rawApplication.purposeOfCard ?? ''),
            adminNote: String(rawApplication.adminNote ?? ''),
            reviewedAt: rawApplication.reviewedAt instanceof Date
                ? rawApplication.reviewedAt.toISOString()
                : null,
            createdAt: rawApplication.createdAt instanceof Date
                ? rawApplication.createdAt.toISOString()
                : String(rawApplication.createdAt ?? ''),
            tier: rawApplication.tierId
                ? {
                    _id: rawApplication.tierId._id?.toString() ?? '',
                    name: String(rawApplication.tierId.name ?? ''),
                    colorFrom: String(rawApplication.tierId.colorFrom ?? '#0a0a0a'),
                    colorTo: String(rawApplication.tierId.colorTo ?? '#1c1c1c'),
                    accentColor: String(rawApplication.tierId.accentColor ?? '#c9a84c'),
                }
                : null,
        }
        : null;

    const card = rawCard
        ? {
            _id: rawCard._id.toString(),
            cardNumber: String(rawCard.cardNumber ?? ''),
            holderName: String(rawCard.holderName ?? ''),
            status: String(rawCard.status ?? 'ACTIVE') as any,
            issuedAt: rawCard.issuedAt instanceof Date ? rawCard.issuedAt.toISOString() : String(rawCard.issuedAt ?? ''),
            expiresAt: rawCard.expiresAt instanceof Date ? rawCard.expiresAt.toISOString() : String(rawCard.expiresAt ?? ''),
            revokedReason: rawCard.revokedReason ? String(rawCard.revokedReason) : null,
            tier: rawCard.tierId
                ? {
                    _id: rawCard.tierId._id?.toString() ?? '',
                    name: String(rawCard.tierId.name ?? ''),
                    colorFrom: String(rawCard.tierId.colorFrom ?? '#0a0a0a'),
                    colorTo: String(rawCard.tierId.colorTo ?? '#1c1c1c'),
                    accentColor: String(rawCard.tierId.accentColor ?? '#c9a84c'),
                    benefits: (rawCard.tierId.benefits || []).map(String),
                    annualFee: Number(rawCard.tierId.annualFee ?? 0),
                }
                : null,
        }
        : null;

    const cardHistory = rawCardHistory.map((c) => ({
        _id: c._id.toString(),
        cardNumber: String(c.cardNumber ?? ''),
        holderName: String(c.holderName ?? ''),
        status: String(c.status ?? '') as any,
        issuedAt: c.issuedAt instanceof Date ? c.issuedAt.toISOString() : String(c.issuedAt ?? ''),
        expiresAt: c.expiresAt instanceof Date ? c.expiresAt.toISOString() : String(c.expiresAt ?? ''),
        revokedReason: c.revokedReason ? String(c.revokedReason) : null,
        tier: c.tierId
            ? {
                _id: c.tierId._id?.toString() ?? '',
                name: String(c.tierId.name ?? ''),
                colorFrom: String(c.tierId.colorFrom ?? '#0a0a0a'),
                colorTo: String(c.tierId.colorTo ?? '#1c1c1c'),
                accentColor: String(c.tierId.accentColor ?? '#c9a84c'),
            }
            : null,
    }));

    const userName = `${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim() || 'Member';

    return (
        <MembershipClient
            tiers={tiers}
            application={application}
            card={card}
            cardHistory={cardHistory}
            userName={userName}
        />
    );
}

import dbConnect from "@/lib/mongodb";
import MembershipTier from "@/models/MembershipTier";
import MembershipApplication from "@/models/MembershipApplication";
import MembershipCard from "@/models/MembershipCard";
import User from "@/models/User";
import MembershipsClient from "@/components/admin/MembershipsClient";

export default async function AdminMembershipsPage() {
    await dbConnect();
    void User; // register schema for populate

    // Fetch all tiers
    const rawTiers = await MembershipTier.find().sort({ sortOrder: 1 }).lean();

    // Fetch all applications with user + tier populated
    const rawApplications = await MembershipApplication.find()
        .populate('userId', 'firstName lastName email')
        .populate('tierId', 'name colorFrom colorTo accentColor')
        .sort({ createdAt: -1 })
        .lean();

    // Fetch all cards with tier info for the stats
    const rawCards = await MembershipCard.find()
        .populate('tierId', 'name')
        .lean();

    const serializedTiers = (rawTiers as any[]).map((t) => ({
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
        isActive: Boolean(t.isActive),
        createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt ?? ''),
    }));

    const serializedApplications = (rawApplications as any[]).map((a) => ({
        _id: a._id.toString(),
        user: a.userId
            ? {
                _id: a.userId._id?.toString() ?? '',
                name: `${a.userId.firstName ?? ''} ${a.userId.lastName ?? ''}`.trim() || 'Unknown',
                email: String(a.userId.email ?? ''),
            }
            : { _id: '', name: 'Deleted User', email: '' },
        tier: a.tierId
            ? {
                _id: a.tierId._id?.toString() ?? '',
                name: String(a.tierId.name ?? ''),
                colorFrom: String(a.tierId.colorFrom ?? '#0a0a0a'),
                colorTo: String(a.tierId.colorTo ?? '#1c1c1c'),
                accentColor: String(a.tierId.accentColor ?? '#c9a84c'),
            }
            : { _id: '', name: 'Deleted Tier', colorFrom: '#0a0a0a', colorTo: '#1c1c1c', accentColor: '#888' },
        status: String(a.status ?? 'PENDING') as any,
        fullName: String(a.fullName ?? ''),
        occupation: String(a.occupation ?? ''),
        employerName: String(a.employerName ?? ''),
        annualIncome: String(a.annualIncome ?? ''),
        netWorth: String(a.netWorth ?? ''),
        purposeOfCard: String(a.purposeOfCard ?? ''),
        adminNote: String(a.adminNote ?? ''),
        reviewedBy: String(a.reviewedBy ?? ''),
        reviewedAt: a.reviewedAt instanceof Date ? a.reviewedAt.toISOString() : null,
        createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt ?? ''),
    }));

    const serializedCards = (rawCards as any[]).map((c) => ({
        _id: c._id.toString(),
        cardNumber: String(c.cardNumber ?? ''),
        holderName: String(c.holderName ?? ''),
        status: String(c.status ?? 'ACTIVE'),
        tierName: c.tierId ? String(c.tierId.name ?? '') : 'Unknown',
        issuedAt: c.issuedAt instanceof Date ? c.issuedAt.toISOString() : String(c.issuedAt ?? ''),
        expiresAt: c.expiresAt instanceof Date ? c.expiresAt.toISOString() : String(c.expiresAt ?? ''),
    }));

    return (
        <MembershipsClient
            initialApplications={serializedApplications}
            initialTiers={serializedTiers}
            initialCards={serializedCards}
        />
    );
}

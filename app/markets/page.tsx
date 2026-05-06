import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import MarketsClient from "./MarketsClient";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
    await dbConnect();

    const raw = await ProjectInvestment.find({ isActive: true })
        .sort({ status: 1, createdAt: -1 })
        .lean() as any[];

    const projects = raw.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        company: p.company as string,
        slug: p.slug,
        tagline: p.tagline,
        heroImage: p.heroImage || "",
        heroBgColor: p.heroBgColor || "#000000",
        status: p.status as "upcoming" | "open" | "funded" | "closed",
        totalRaiseTarget: p.totalRaiseTarget,
        currentRaised: p.currentRaised,
        investorCount: p.investorCount,
        expectedYieldLow: p.expectedYieldLow,
        expectedYieldHigh: p.expectedYieldHigh ?? null,
        yieldType: p.yieldType as string,
        yieldCycle: p.yieldCycle ?? null,
        riskLevel: p.riskLevel as string,
        closeDate: p.closeDate ? new Date(p.closeDate).toISOString() : null,
        minimumInvestment: p.tranches?.[0]?.minimumAmount ?? 1000,
        tranches: (p.tranches ?? []).map((t: any) => ({
            name: t.name,
            badge: t.badge ?? null,
            minimumAmount: t.minimumAmount,
            maximumAmount: t.maximumAmount ?? null,
            yieldLow: t.yieldLow,
            yieldHigh: t.yieldHigh ?? null,
            spotsTotal: t.spotsTotal,
            spotsFilled: t.spotsFilled,
            isCustomTerms: t.isCustomTerms,
        })),
        highlights: p.highlights as string[],
    }));

    return <MarketsClient projects={projects} />;
}

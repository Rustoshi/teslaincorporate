import dbConnect from "@/lib/mongodb";
import InvestmentPlan from "@/models/InvestmentPlan";
import MembershipTier from "@/models/MembershipTier";
import HowItWorksClient from "./HowItWorksClient";

export const dynamic = "force-dynamic";

export default async function HowItWorksPage() {
    await dbConnect();

    const rawPlans = await InvestmentPlan.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    const plans = rawPlans.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        capitalRange: p.capitalRange,
        returnLow: p.returnLow,
        returnHigh: p.returnHigh ?? undefined,
        returnContext: p.returnContext,
        cycle: p.cycle,
        description: p.description,
        features: p.features as { text: string }[],
        highlighted: p.highlighted ?? false,
        badge: p.badge ?? undefined,
    }));

    const rawTiers = await MembershipTier.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    const tiers = rawTiers.map((t) => ({
        _id: t._id.toString(),
        name: t.name,
        slug: t.slug,
        description: t.description,
        benefits: t.benefits as string[],
        colorFrom: t.colorFrom,
        colorTo: t.colorTo,
        accentColor: t.accentColor,
        annualFee: t.annualFee,
        requirements: t.requirements,
        sortOrder: t.sortOrder,
    }));

    return <HowItWorksClient plans={plans} tiers={tiers} />;
}

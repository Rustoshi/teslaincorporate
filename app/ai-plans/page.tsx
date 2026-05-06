import dbConnect from "@/lib/mongodb";
import InvestmentPlan from "@/models/InvestmentPlan";
import AIPlansPageClient from "./AIPlansPageClient";

export const dynamic = "force-dynamic";

export default async function AIPlansPage() {
    await dbConnect();

    const raw = await InvestmentPlan.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    const plans = raw.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        capitalRange: p.capitalRange,
        returnLow: p.returnLow,
        returnHigh: p.returnHigh ?? null,
        returnContext: p.returnContext,
        cycle: p.cycle,
        description: p.description,
        features: p.features as { text: string }[],
        highlighted: p.highlighted ?? false,
        badge: p.badge ?? null,
    }));

    return <AIPlansPageClient plans={plans} />;
}

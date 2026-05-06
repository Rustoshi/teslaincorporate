import Hero from "@/components/invest/Hero";
import HowItWorks from "@/components/invest/HowItWorks";
import MarketFocus from "@/components/invest/MarketFocus";
import ProjectsFeatured from "@/components/invest/ProjectsFeatured";
import AIPlans from "@/components/invest/AIPlans";
import RiskArchitecture from "@/components/invest/RiskArchitecture";
import CustomerReviews from "@/components/invest/CustomerReviews";
import FinalCTA from "@/components/invest/FinalCTA";
import dbConnect from "@/lib/mongodb";
import InvestmentPlan from "@/models/InvestmentPlan";

export const dynamic = "force-dynamic";

export default async function InvestPage() {
    await dbConnect();
    const rawPlans = await InvestmentPlan.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    const plans = rawPlans.map(p => ({
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

    return (
        <main>
            <Hero />
            <HowItWorks />
            <MarketFocus />
            <ProjectsFeatured />
            <AIPlans plans={plans} />
            <RiskArchitecture />
            <CustomerReviews />
            <FinalCTA />
        </main>
    );
}

import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import InvestmentPlan from "@/models/InvestmentPlan";
import MembershipTier from "@/models/MembershipTier";
import AboutClient from "./AboutClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    await dbConnect();

    const [projectStats, planCount, tierCount] = await Promise.all([
        ProjectInvestment.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalProjects: { $sum: 1 },
                    totalRaised: { $sum: "$currentRaised" },
                    totalInvestors: { $sum: "$investorCount" },
                    openProjects: {
                        $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] },
                    },
                },
            },
        ]),
        InvestmentPlan.countDocuments({ isActive: true }),
        MembershipTier.countDocuments({ isActive: true }),
    ]);

    const stats = projectStats[0] ?? {
        totalProjects: 0,
        totalRaised: 0,
        totalInvestors: 0,
        openProjects: 0,
    };

    return (
        <AboutClient
            totalProjects={stats.totalProjects}
            totalRaised={stats.totalRaised}
            totalInvestors={stats.totalInvestors}
            openProjects={stats.openProjects}
            planCount={planCount}
            tierCount={tierCount}
        />
    );
}

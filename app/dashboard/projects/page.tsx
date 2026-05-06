import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ProjectStake from "@/models/ProjectStake";
import ProjectInvestment from "@/models/ProjectInvestment";
import DashboardProjectsClient from "@/components/dashboard/projects/DashboardProjectsClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Projects | Musk Capital Inc",
    description: "Invest in SpaceX, The Boring Company, and more. Track your existing positions.",
};

async function getUserStakes(userId: string) {
    const stakes = await ProjectStake.find({ userId })
        .populate("projectId", "name company slug heroImage heroBgColor status tagline")
        .sort({ investedAt: -1 })
        .lean() as any[];

    return stakes.map((s: any) => ({
        stakeId:            s._id.toString(),
        trancheName:        s.trancheName,
        yieldLow:           s.yieldLow,
        yieldHigh:          s.yieldHigh ?? null,
        investedAmount:     s.investedAmount,
        currentValue:       s.currentValue,
        currentPnL:         s.currentPnL,
        status:             s.status,
        investedAt:         s.investedAt instanceof Date ? s.investedAt.toISOString() : String(s.investedAt),
        maturityDate:       s.maturityDate ? (s.maturityDate instanceof Date ? s.maturityDate.toISOString() : String(s.maturityDate)) : null,
        projectSlug:        s.projectId?.slug        ?? "",
        projectName:        s.projectId?.name        ?? "Unknown Project",
        projectCompany:     s.projectId?.company     ?? "",
        projectHeroImage:   s.projectId?.heroImage   ?? "",
        projectHeroBgColor: s.projectId?.heroBgColor ?? "#ffffff",
        projectStatus:      s.projectId?.status      ?? "closed",
    }));
}

async function getAvailableProjects() {
    const raw = await ProjectInvestment.find({
        isActive: true,
        status:   "open",
    })
        .sort({ createdAt: -1 })
        .lean() as any[];

    return raw.map(p => ({
        _id:              p._id.toString(),
        name:             p.name,
        company:          p.company,
        slug:             p.slug,
        tagline:          p.tagline,
        heroImage:        p.heroImage || "",
        heroBgColor:      p.heroBgColor || "#ffffff",
        status:           p.status as "open" | "upcoming",
        totalRaiseTarget: p.totalRaiseTarget,
        currentRaised:    p.currentRaised,
        investorCount:    p.investorCount,
        expectedYieldLow:  p.expectedYieldLow,
        expectedYieldHigh: p.expectedYieldHigh ?? null,
        tranches: (p.tranches || []).map((t: any) => ({
            name:          t.name,
            badge:         t.badge ?? undefined,
            minimumAmount: t.minimumAmount,
            maximumAmount: t.maximumAmount ?? null,
            yieldLow:      t.yieldLow,
            yieldHigh:     t.yieldHigh ?? null,
            spotsTotal:    t.spotsTotal,
            spotsFilled:   t.spotsFilled ?? 0,
            isCustomTerms: t.isCustomTerms ?? false,
        })),
    }));
}

export default async function DashboardProjectsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/invest/login");

    await dbConnect();

    const user = await User.findOne({ email: session.user.email })
        .select("_id totalBalance currency firstName")
        .lean() as any;
    if (!user) redirect("/invest/login");

    const [stakes, availableProjects] = await Promise.all([
        getUserStakes(user._id.toString()),
        getAvailableProjects(),
    ]);

    // Portfolio summary
    const totalInvested      = stakes.reduce((sum, s) => sum + s.investedAmount, 0);
    const totalCurrentValue  = stakes.reduce((sum, s) => sum + s.currentValue, 0);
    const totalPnL           = stakes.reduce((sum, s) => sum + s.currentPnL, 0);
    const activeCount        = stakes.filter(s => s.status === "active").length;

    return (
        <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">

            {/* ── Page header ──────────────────────────────────────────────────── */}
            <div className="mb-10">
                <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30 mb-2">
                    Portfolio
                </p>
                <h1
                    className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Projects
                </h1>
            </div>

            <DashboardProjectsClient
                availableProjects={availableProjects}
                stakes={stakes}
                userBalance={user.totalBalance || 0}
                currency={user.currency || "$"}
                totalInvested={totalInvested}
                totalCurrentValue={totalCurrentValue}
                totalPnL={totalPnL}
                activeCount={activeCount}
            />
        </div>
    );
}

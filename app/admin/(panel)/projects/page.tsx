import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectsClient from "@/components/admin/ProjectsClient";
import { seedProjects } from "@/lib/seedProjects";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role === "user") {
        redirect("/admin/login");
    }

    await dbConnect();
    await seedProjects();

    const rawProjects = await ProjectInvestment.find()
        .sort({ createdAt: -1 })
        .lean();

    const projects = rawProjects.map((p: any) => ({
        _id:               p._id.toString(),
        name:              p.name,
        company:           p.company,
        slug:              p.slug,
        heroBgColor:       p.heroBgColor || "#000000",
        status:            p.status,
        isFeatured:        p.isFeatured,
        isActive:          p.isActive,
        totalRaiseTarget:  p.totalRaiseTarget,
        currentRaised:     p.currentRaised,
        investorCount:     p.investorCount,
        expectedYieldLow:  p.expectedYieldLow,
        expectedYieldHigh: p.expectedYieldHigh ?? null,
        tranches:          (p.tranches || []).map((t: any) => ({
            name:        t.name,
            spotsFilled: t.spotsFilled ?? 0,
            spotsTotal:  t.spotsTotal,
        })),
        createdAt: p.createdAt?.toISOString() ?? "",
    }));

    return <ProjectsClient projects={projects} />;
}

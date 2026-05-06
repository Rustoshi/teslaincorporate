import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectStake from "@/models/ProjectStake";
import ProjectEditorTabs from "@/components/admin/ProjectEditorTabs";

export const dynamic = "force-dynamic";

export default async function AdminProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role === "user") {
        redirect("/admin/login");
    }

    const { id } = await params;

    // "new" is the create route — render an empty editor
    if (id === "new") {
        return (
            <ProjectEditorTabs
                mode="create"
            />
        );
    }

    // Otherwise fetch the existing project
    await dbConnect();

    const project = await ProjectInvestment.findById(id).lean();
    if (!project) notFound();

    // Fetch all stakes with populated user data for the Investors tab
    const rawStakes = await ProjectStake.find({ projectId: id })
        .populate("userId", "firstName lastName email country")
        .sort({ investedAmount: -1 })
        .lean();

    const stakes = rawStakes.map((s: any) => ({
        _id:            s._id.toString(),
        trancheName:    s.trancheName,
        investedAmount: s.investedAmount,
        currentPnL:     s.currentPnL,
        status:         s.status,
        investedAt:     s.investedAt?.toISOString() ?? s.createdAt?.toISOString() ?? "",
        userId: s.userId ? {
            firstName: s.userId.firstName,
            lastName:  s.userId.lastName,
            email:     s.userId.email,
            country:   s.userId.country,
        } : null,
    }));

    return (
        <ProjectEditorTabs
            mode="edit"
            projectId={id}
            initialData={JSON.parse(JSON.stringify(project))}
            stakes={stakes}
        />
    );
}

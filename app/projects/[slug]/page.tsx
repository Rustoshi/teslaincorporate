import { notFound } from "next/navigation";
import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectDetailClient from "@/components/projects/ProjectDetailClient";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
    await dbConnect();

    const raw = await ProjectInvestment.findOne({ slug, isActive: true }).lean() as any;
    if (!raw) return null;

    return {
        _id:               raw._id.toString(),
        name:              raw.name,
        company:           raw.company,
        slug:              raw.slug,
        tagline:           raw.tagline,
        heroImage:         raw.heroImage || "",
        heroBgColor:       raw.heroBgColor || "#ffffff",
        description:       raw.description || "",
        highlights:        raw.highlights || [],
        status:            raw.status,
        riskLevel:         raw.riskLevel || "high",
        totalRaiseTarget:  raw.totalRaiseTarget,
        currentRaised:     raw.currentRaised,
        investorCount:     raw.investorCount,
        launchDate:        raw.launchDate instanceof Date ? raw.launchDate.toISOString() : String(raw.launchDate),
        closeDate:         raw.closeDate instanceof Date ? raw.closeDate.toISOString() : String(raw.closeDate),
        expectedYieldLow:  raw.expectedYieldLow,
        expectedYieldHigh: raw.expectedYieldHigh ?? null,
        yieldType:         raw.yieldType,
        yieldCycle:        raw.yieldCycle ?? null,
        tranches: (raw.tranches || []).map((t: any) => ({
            name:           t.name,
            badge:          t.badge ?? undefined,
            minimumAmount:  t.minimumAmount,
            maximumAmount:  t.maximumAmount ?? null,
            yieldLow:       t.yieldLow,
            yieldHigh:      t.yieldHigh ?? null,
            spotsTotal:     t.spotsTotal,
            spotsFilled:    t.spotsFilled ?? 0,
            isCustomTerms:  t.isCustomTerms,
        })),
        milestones: (raw.milestones || []).map((m: any) => ({
            title:       m.title,
            description: m.description ?? undefined,
            targetDate:  m.targetDate instanceof Date ? m.targetDate.toISOString() : String(m.targetDate),
            completed:   m.completed,
            completedAt: m.completedAt ? (m.completedAt instanceof Date ? m.completedAt.toISOString() : String(m.completedAt)) : undefined,
        })),
        documents: (raw.documents || []).map((d: any) => ({
            label: d.label,
            url:   d.url,
        })),
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const raw = await ProjectInvestment.findOne({ slug, isActive: true }).lean() as any;
    if (!raw) return { title: "Project Not Found" };

    return {
        title:       `${raw.name} | Musk Capital Inc`,
        description: raw.tagline,
        openGraph: {
            title:       raw.name,
            description: raw.tagline,
            images:      raw.heroImage ? [raw.heroImage] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) notFound();

    return <ProjectDetailClient project={project} />;
}

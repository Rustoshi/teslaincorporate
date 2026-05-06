import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import ProjectListingCard from "@/components/projects/ProjectListingCard";
import ProjectsPageClient from "@/components/projects/ProjectsPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Investment Opportunities | Musk Capital Inc",
    description:
        "Gain direct exposure to SpaceX, The Boring Company, and other frontier ventures. Tiered entry from $1,000 with projected yields up to 120%+.",
};

async function getProjects() {
    await dbConnect();

    const raw = await ProjectInvestment.find({ isActive: true })
        .sort({ isFeatured: -1, status: 1, createdAt: -1 })
        .lean();

    return raw.map((p: any) => ({
        _id:               p._id.toString(),
        name:              p.name,
        company:           p.company,
        slug:              p.slug,
        tagline:           p.tagline,
        heroImage:         p.heroImage || "",
        heroBgColor:       p.heroBgColor || "#ffffff",
        status:            p.status,
        totalRaiseTarget:  p.totalRaiseTarget,
        currentRaised:     p.currentRaised,
        investorCount:     p.investorCount,
        closeDate:         p.closeDate instanceof Date
            ? p.closeDate.toISOString()
            : String(p.closeDate),
        expectedYieldLow:  p.expectedYieldLow,
        expectedYieldHigh: p.expectedYieldHigh ?? null,
        minimumInvestment: p.tranches?.[0]?.minimumAmount ?? 1000,
    }));
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-black">
            {/* ── Cinematic page header ──────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-32 pb-20 px-6 sm:px-10 lg:px-16">
                {/* Ambient background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
                    <div className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full bg-orange-500/08 blur-[100px]" />
                </div>

                {/* Grid lines overlay */}
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />

                <div className="relative max-w-7xl mx-auto">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-white/20" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35">
                            Private Market Access
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Investment
                        <br />
                        <span className="text-white/25">Opportunities</span>
                    </h1>

                    <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-xl">
                        Direct exposure to the world's most consequential private companies.
                        Tiered entry, transparent yield structure, no lock-up minimums.
                    </p>

                    {/* Live stats strip */}
                    <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-white/[0.06]">
                        <div>
                            <p
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {projects.filter(p => p.status === "open").length}
                            </p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Open Now</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <p
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {projects.length}
                            </p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Total Projects</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <p
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                $1K
                            </p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Min. Entry</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <p
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                120%+
                            </p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Max Projected Yield</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filter + Grid ──────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-24">
                <Suspense fallback={<ProjectsGridSkeleton />}>
                    <ProjectsPageClient projects={projects} />
                </Suspense>
            </div>
        </main>
    );
}

function ProjectsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map(i => (
                <div
                    key={i}
                    className="rounded-2xl overflow-hidden border border-white/[0.07] animate-pulse"
                >
                    <div className="h-72 bg-white/[0.04]" />
                    <div className="bg-[#0a0a0a] p-5 space-y-4">
                        <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                        <div className="h-3 bg-white/[0.04] rounded w-full" />
                        <div className="h-3 bg-white/[0.04] rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

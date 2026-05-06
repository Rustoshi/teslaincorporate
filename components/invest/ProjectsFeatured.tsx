import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import ProjectInvestment from "@/models/ProjectInvestment";
import FeaturedProjectCard from "./FeaturedProjectCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeaturedProject {
    _id: string;
    name: string;
    company: string;
    slug: string;
    tagline: string;
    heroImage: string;
    heroBgColor: string;
    status: "upcoming" | "open" | "funded" | "closed";
    totalRaiseTarget: number;
    currentRaised: number;
    investorCount: number;
    expectedYieldLow: number;
    expectedYieldHigh?: number | null;
    minimumInvestment: number;
}

// ─── Server component — fetches featured projects ─────────────────────────────

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
    await dbConnect();

    const raw = await ProjectInvestment.find({
        isActive:   true,
        isFeatured: true,
        status:     { $in: ["open", "upcoming"] },
    })
        .sort({ status: 1, createdAt: -1 })
        .limit(3)
        .lean() as any[];

    return raw.map(p => ({
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
        expectedYieldLow:  p.expectedYieldLow,
        expectedYieldHigh: p.expectedYieldHigh ?? null,
        minimumInvestment: p.tranches?.[0]?.minimumAmount ?? 1000,
    }));
}

// ─── Section export ───────────────────────────────────────────────────────────

export default async function ProjectsFeatured() {
    const projects = await getFeaturedProjects();
    if (projects.length === 0) return null;

    return (
        <section id="opportunities" className="relative py-24 px-6 sm:px-10 lg:px-16 bg-black overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-px bg-white/20" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">
                                Private Market Access
                            </span>
                        </div>
                        <h2
                            className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.0]"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Featured
                            <br />
                            <span className="text-white/25">Opportunities</span>
                        </h2>
                    </div>

                    <Link
                        href="/projects"
                        className="group inline-flex items-center gap-2.5 px-6 py-3 text-[11px] font-bold tracking-[0.14em] uppercase rounded-full border border-white/[0.12] text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 self-start sm:self-auto"
                    >
                        All Opportunities
                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Cards grid */}
                <div className={`grid grid-cols-1 gap-6 ${projects.length === 1 ? "sm:grid-cols-1 max-w-md" : projects.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {projects.map((p, i) => (
                        <FeaturedProjectCard key={p._id} p={p} index={i} />
                    ))}
                </div>

                {/* Bottom disclaimer */}
                <p className="mt-12 text-[11px] text-white/15 text-center max-w-xl mx-auto leading-relaxed">
                    Projected yields are estimates only. All private market investments carry risk including possible loss of principal.
                </p>
            </div>
        </section>
    );
}

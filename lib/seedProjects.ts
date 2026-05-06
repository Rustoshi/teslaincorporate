import ProjectInvestment from "@/models/ProjectInvestment";

const now = new Date();
const d = (offsetMonths: number) => {
    const dt = new Date(now);
    dt.setMonth(dt.getMonth() + offsetMonths);
    return dt;
};

type Company = 'SpaceX' | 'BoringCompany' | 'Tesla' | 'Neuralink' | 'xAI';
type ProjStatus = 'upcoming' | 'open' | 'funded' | 'closed';
type YieldType = 'annual_percent' | 'on_exit' | 'per_cycle';
type RiskLevel = 'medium' | 'high' | 'very_high';

const SEED_PROJECTS: Array<{
    name: string; company: Company; slug: string; tagline: string;
    heroImage: string; heroBgColor: string; description: string; highlights: string[];
    status: ProjStatus; isActive: boolean; isFeatured: boolean;
    totalRaiseTarget: number; currentRaised: number; investorCount: number;
    launchDate: Date; closeDate: Date;
    expectedYieldLow: number; expectedYieldHigh: number | null;
    yieldType: YieldType; yieldCycle?: string; riskLevel: RiskLevel;
    tranches: Array<{ name: string; badge?: string; minimumAmount: number; maximumAmount: number | null; yieldLow: number; yieldHigh: number | null; spotsTotal: number; spotsFilled: number; isCustomTerms: boolean }>;
    milestones: Array<{ title: string; description?: string; targetDate: Date; completed: boolean; completedAt?: Date }>;
    documents: Array<{ label: string; url: string }>;
}> = [
    // ── 1. SpaceX – Starship Commercial Fleet ─────────────────────────────────
    {
        name: "Starship Commercial Fleet Expansion",
        company: "SpaceX",
        slug: "spacex-starship-commercial-fleet",
        tagline: "Own a stake in the world's most powerful rocket programme",
        heroImage: "",
        heroBgColor: "#0047AB",
        description: "SpaceX is expanding its Starship orbital fleet to meet surging commercial launch demand. This raise funds production of three additional Starship vehicles and upgrades to the Boca Chica launch infrastructure, targeting a cadence of 48 commercial launches per year by 2027.",
        highlights: [
            "Projected 48 commercial launches/yr by 2027",
            "Secured $2.1B in anchor launch contracts",
            "First reusable super-heavy-lift vehicle in history",
            "NASA Artemis lunar surface mission partner",
            "Production cost per launch trending below $10M",
        ],
        status: "open",
        isActive: true,
        isFeatured: true,
        totalRaiseTarget: 150_000_000,
        currentRaised: 47_200_000,
        investorCount: 318,
        launchDate: d(-2),
        closeDate: d(4),
        expectedYieldLow: 22,
        expectedYieldHigh: 65,
        yieldType: "on_exit",
        riskLevel: "high",
        tranches: [
            { name: "Explorer", badge: "Entry", minimumAmount: 5_000, maximumAmount: 49_999, yieldLow: 22, yieldHigh: 30, spotsTotal: 500, spotsFilled: 214, isCustomTerms: false },
            { name: "Pioneer", badge: "Popular", minimumAmount: 50_000, maximumAmount: 249_999, yieldLow: 35, yieldHigh: 50, spotsTotal: 150, spotsFilled: 72, isCustomTerms: false },
            { name: "Visionary", badge: "Exclusive", minimumAmount: 250_000, maximumAmount: null, yieldLow: 55, yieldHigh: 65, spotsTotal: 30, spotsFilled: 8, isCustomTerms: false },
        ],
        milestones: [
            { title: "Regulatory approvals secured", description: "FAA launch licence amended for commercial cadence", targetDate: d(-3), completed: true, completedAt: d(-3) },
            { title: "Vehicle 4 roll-out to pad", targetDate: d(1), completed: false },
            { title: "First commercial payload launch", targetDate: d(3), completed: false },
            { title: "Full 48-launch cadence achieved", targetDate: d(18), completed: false },
        ],
        documents: [],
    },

    // ── 2. Tesla – Gigafactory Mexico ─────────────────────────────────────────
    {
        name: "Gigafactory Mexico — Phase 1",
        company: "Tesla",
        slug: "tesla-gigafactory-mexico-phase-1",
        tagline: "Fund the next generation of affordable Tesla vehicles",
        heroImage: "",
        heroBgColor: "#CC0000",
        description: "Tesla's Gigafactory Mexico in Nuevo León will produce the next-generation affordable vehicle platform targeting a $25,000 price point. Phase 1 covers civil works, press shop commissioning, and body-in-white line installation with an initial production capacity of 250,000 units per year.",
        highlights: [
            "Targeting 250,000 units/yr in Phase 1",
            "Next-gen $25K vehicle — largest addressable market in EV history",
            "State tax incentives totalling $800M over 10 years",
            "Proximity to US border reduces logistics cost by 18%",
            "Battery supply secured via 4680 cell offtake agreement",
        ],
        status: "open",
        isActive: true,
        isFeatured: true,
        totalRaiseTarget: 200_000_000,
        currentRaised: 91_500_000,
        investorCount: 541,
        launchDate: d(-3),
        closeDate: d(5),
        expectedYieldLow: 18,
        expectedYieldHigh: 45,
        yieldType: "on_exit",
        riskLevel: "medium",
        tranches: [
            { name: "Explorer", badge: "Entry", minimumAmount: 2_500, maximumAmount: 24_999, yieldLow: 18, yieldHigh: 25, spotsTotal: 800, spotsFilled: 412, isCustomTerms: false },
            { name: "Pioneer", badge: "Popular", minimumAmount: 25_000, maximumAmount: 99_999, yieldLow: 28, yieldHigh: 38, spotsTotal: 200, spotsFilled: 95, isCustomTerms: false },
            { name: "Visionary", badge: "Exclusive", minimumAmount: 100_000, maximumAmount: null, yieldLow: 38, yieldHigh: 45, spotsTotal: 50, spotsFilled: 17, isCustomTerms: false },
        ],
        milestones: [
            { title: "Land acquisition complete", targetDate: d(-6), completed: true, completedAt: d(-6) },
            { title: "Permitting & environmental approval", targetDate: d(-1), completed: true, completedAt: d(-1) },
            { title: "Civil works & foundation pour", targetDate: d(3), completed: false },
            { title: "Press shop commissioning", targetDate: d(9), completed: false },
            { title: "First vehicle off the line", targetDate: d(18), completed: false },
        ],
        documents: [],
    },

    // ── 3. xAI – Grok Supercomputer Cluster ──────────────────────────────────
    {
        name: "xAI Colossus II — 1M GPU Cluster",
        company: "xAI",
        slug: "xai-colossus-ii-gpu-cluster",
        tagline: "Back the infrastructure powering the world's most powerful AI",
        heroImage: "",
        heroBgColor: "#1a1a2e",
        description: "xAI is constructing Colossus II, a 1,000,000 GPU AI training supercomputer in Memphis, Tennessee — ten times the scale of the original Colossus. The cluster will train future generations of the Grok model family and provide API compute to enterprise customers, generating recurring revenue from day one of partial operation.",
        highlights: [
            "1,000,000 H100/H200 equivalent GPU target",
            "Enterprise API revenue begins at 20% cluster build-out",
            "Grok API already generating $400M+ annualised revenue",
            "Co-location deal with Memphis Light, Gas & Water — lowest cost power",
            "Strategic moat: one of only 3 frontier AI training clusters globally",
        ],
        status: "open",
        isActive: true,
        isFeatured: true,
        totalRaiseTarget: 300_000_000,
        currentRaised: 128_000_000,
        investorCount: 289,
        launchDate: d(-1),
        closeDate: d(6),
        expectedYieldLow: 28,
        expectedYieldHigh: 90,
        yieldType: "on_exit",
        riskLevel: "high",
        tranches: [
            { name: "Explorer", badge: "Entry", minimumAmount: 10_000, maximumAmount: 99_999, yieldLow: 28, yieldHigh: 40, spotsTotal: 400, spotsFilled: 167, isCustomTerms: false },
            { name: "Pioneer", badge: "Popular", minimumAmount: 100_000, maximumAmount: 499_999, yieldLow: 45, yieldHigh: 65, spotsTotal: 80, spotsFilled: 31, isCustomTerms: false },
            { name: "Visionary", badge: "Exclusive", minimumAmount: 500_000, maximumAmount: null, yieldLow: 70, yieldHigh: 90, spotsTotal: 20, spotsFilled: 5, isCustomTerms: false },
        ],
        milestones: [
            { title: "Memphis site secured & power agreement signed", targetDate: d(-2), completed: true, completedAt: d(-2) },
            { title: "Phase 1 — 100K GPU online", targetDate: d(2), completed: false },
            { title: "Enterprise API commercial launch", targetDate: d(4), completed: false },
            { title: "Phase 2 — 500K GPU online", targetDate: d(10), completed: false },
            { title: "Full 1M GPU cluster operational", targetDate: d(18), completed: false },
        ],
        documents: [],
    },

    // ── 4. Neuralink – N2 Clinical Trials ────────────────────────────────────
    {
        name: "Neuralink N2 — Expanded Clinical Programme",
        company: "Neuralink",
        slug: "neuralink-n2-clinical-programme",
        tagline: "Invest in the future of human-computer symbiosis",
        heroImage: "",
        heroBgColor: "#4B0082",
        description: "Neuralink's N2 device programme expands the PRIME study to 50 paralysis patients across 12 sites globally, while advancing the R&D roadmap toward a second-generation implant with 10× electrode density and wireless charging. This raise supports clinical operations, device manufacturing scale-up, and regulatory pathway for FDA Breakthrough Device approval.",
        highlights: [
            "First BCI to achieve sustained telepathic cursor control in humans",
            "FDA Breakthrough Device designation secured",
            "N2 device targets 10× electrode density vs N1",
            "50-patient PRIME expansion across 12 global sites",
            "Licensing pipeline value estimated at $8B by independent analysts",
        ],
        status: "open",
        isActive: true,
        isFeatured: false,
        totalRaiseTarget: 80_000_000,
        currentRaised: 19_400_000,
        investorCount: 143,
        launchDate: d(-1),
        closeDate: d(7),
        expectedYieldLow: 30,
        expectedYieldHigh: null,
        yieldType: "on_exit",
        riskLevel: "very_high",
        tranches: [
            { name: "Explorer", badge: "Entry", minimumAmount: 10_000, maximumAmount: 74_999, yieldLow: 30, yieldHigh: 50, spotsTotal: 200, spotsFilled: 89, isCustomTerms: false },
            { name: "Pioneer", badge: "Popular", minimumAmount: 75_000, maximumAmount: 299_999, yieldLow: 55, yieldHigh: 80, spotsTotal: 40, spotsFilled: 12, isCustomTerms: false },
            { name: "Visionary", badge: "Exclusive", minimumAmount: 300_000, maximumAmount: null, yieldLow: 80, yieldHigh: null, spotsTotal: 10, spotsFilled: 2, isCustomTerms: true },
        ],
        milestones: [
            { title: "PRIME study first patient implanted", targetDate: d(-8), completed: true, completedAt: d(-8) },
            { title: "12-month PRIME interim data published", targetDate: d(2), completed: false },
            { title: "N2 device design freeze", targetDate: d(5), completed: false },
            { title: "50-patient expansion fully enrolled", targetDate: d(9), completed: false },
            { title: "FDA PMA submission", targetDate: d(24), completed: false },
        ],
        documents: [],
    },

    // ── 5. Boring Company – Las Vegas Loop Phase 3 ────────────────────────────
    {
        name: "Las Vegas Loop — Convention Centre Phase 3",
        company: "BoringCompany",
        slug: "boring-company-lvcc-phase-3",
        tagline: "Stake your claim in the world's first high-speed urban tunnel network",
        heroImage: "",
        heroBgColor: "#FF6B00",
        description: "Phase 3 of The Boring Company's Las Vegas Convention Centre Loop extends the network to 69 stations covering the entire Las Vegas Strip and Harry Reid International Airport. Upon completion the system will carry 57,000 passengers per hour, making it the highest-capacity urban transit corridor in the United States.",
        highlights: [
            "57,000 passengers/hr at full Phase 3 capacity",
            "Airport connection unlocks 50M annual passenger market",
            "Recurring fare revenue — fully operational Phase 1 & 2 generating cash",
            "Zero reliance on property taxes or municipal subsidy",
            "Proprietary boring technology reduces tunnel cost by 70% vs industry",
        ],
        status: "upcoming",
        isActive: true,
        isFeatured: false,
        totalRaiseTarget: 120_000_000,
        currentRaised: 0,
        investorCount: 0,
        launchDate: d(1),
        closeDate: d(8),
        expectedYieldLow: 15,
        expectedYieldHigh: 35,
        yieldType: "per_cycle",
        yieldCycle: "12 months",
        riskLevel: "medium",
        tranches: [
            { name: "Explorer", badge: "Entry", minimumAmount: 5_000, maximumAmount: 49_999, yieldLow: 15, yieldHigh: 20, spotsTotal: 600, spotsFilled: 0, isCustomTerms: false },
            { name: "Pioneer", badge: "Popular", minimumAmount: 50_000, maximumAmount: 199_999, yieldLow: 22, yieldHigh: 28, spotsTotal: 120, spotsFilled: 0, isCustomTerms: false },
            { name: "Visionary", badge: "Exclusive", minimumAmount: 200_000, maximumAmount: null, yieldLow: 30, yieldHigh: 35, spotsTotal: 25, spotsFilled: 0, isCustomTerms: false },
        ],
        milestones: [
            { title: "Phase 1 & 2 operational — revenue baseline established", targetDate: d(-4), completed: true, completedAt: d(-4) },
            { title: "NDOT environmental impact clearance", targetDate: d(0), completed: false },
            { title: "Phase 3 groundbreaking ceremony", targetDate: d(2), completed: false },
            { title: "Airport tunnel boring complete", targetDate: d(12), completed: false },
            { title: "Full Phase 3 public opening", targetDate: d(22), completed: false },
        ],
        documents: [],
    },
];

export async function seedProjects(): Promise<void> {
    try {
        for (const project of SEED_PROJECTS) {
            const exists = await ProjectInvestment.exists({ slug: project.slug });
            if (!exists) {
                await ProjectInvestment.create({
                    ...project,
                    expectedYieldHigh: project.expectedYieldHigh ?? undefined,
                    tranches: project.tranches.map(t => ({
                        ...t,
                        maximumAmount: t.maximumAmount ?? undefined,
                        yieldHigh: t.yieldHigh ?? undefined,
                    })),
                });
            }
        }
    } catch (err) {
        console.error("[seedProjects] Failed:", err);
    }
}

/**
 * seed-projects.ts
 *
 * Seeds the database with the two flagship investment opportunities:
 *   1. SpaceX — Space City Infrastructure Fund
 *   2. The Boring Company — Underground Tunnel Network
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-projects.ts
 *
 * Or add to package.json scripts:
 *   "seed:projects": "ts-node scripts/seed-projects.ts"
 */

import mongoose from 'mongoose';
// @ts-ignore
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import ProjectInvestment from '../models/ProjectInvestment';

// ─── Connection ───────────────────────────────────────────────────────────────

async function connect() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');
    await mongoose.connect(uri);
    console.log('[seed-projects] Connected to MongoDB');
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const projects = [
    // ── 1. SpaceX — Space City Infrastructure Fund ────────────────────────────
    {
        name:    "Space City Infrastructure Fund",
        company: "SpaceX",
        slug:    "spacex-space-city",
        tagline: "Own a stake in humanity's first interplanetary city. Boca Chica is being transformed — be part of the foundation.",

        heroImage:   "/images/hero1.jpg",
        heroBgColor: "#0047AB",
        description: `Space City (Starbase, Texas) is SpaceX's ground-up development of the world's first purpose-built astronautical city. Beyond the launch infrastructure, SpaceX is constructing residential districts, power grids, desalination plants, and commercial zones — all optimised for a future where Earth and Mars are connected by Starship.

The Space City Infrastructure Fund gives qualified investors direct financial exposure to this development. Capital is allocated across land development, utility infrastructure, and logistics corridors serving both the launch facility and the growing civilian township.

This is not a satellite venture or a space tourism ticket. This is ground-level infrastructure in a location that will be one of the most consequential pieces of real estate on Earth — and the departure point for the first human city on Mars.`,

        highlights: [
            "Direct exposure to Starbase (Boca Chica) infrastructure development — utilities, roads, and residential buildout",
            "Backed by the only privately-funded company that has successfully landed and re-flown orbital-class boosters",
            "Starship's launch cadence is scaling: infrastructure demand is growing proportionally to flight frequency",
            "Diversified allocation across utilities, logistics, and residential — not a single-point-of-failure bet",
            "Early-tier investors locked in at pre-approval valuations before commercial development phases commence",
        ],

        status:    "open",
        isActive:  true,
        isFeatured: true,

        totalRaiseTarget: 500_000_000,  // $500M round
        currentRaised:    127_400_000,
        investorCount:    3_847,
        launchDate:  new Date("2025-10-01"),
        closeDate:   new Date("2026-09-30"),

        expectedYieldLow:  18,
        expectedYieldHigh: 75,
        yieldType: "on_exit",

        riskLevel: "high",

        tranches: [
            {
                name:          "Explorer",
                badge:         "Entry",
                minimumAmount: 1_000,
                maximumAmount: 24_999,
                yieldLow:      18,
                yieldHigh:     30,
                spotsTotal:    5_000,
                spotsFilled:   2_143,
                isCustomTerms: false,
            },
            {
                name:          "Pioneer",
                badge:         "Most Popular",
                minimumAmount: 25_000,
                maximumAmount: 249_999,
                yieldLow:      35,
                yieldHigh:     60,
                spotsTotal:    1_000,
                spotsFilled:   412,
                isCustomTerms: false,
            },
            {
                name:          "Visionary",
                badge:         "Exclusive",
                minimumAmount: 250_000,
                maximumAmount: null,
                yieldLow:      60,
                yieldHigh:     75,
                spotsTotal:    100,
                spotsFilled:   22,
                isCustomTerms: false,
            },
        ],

        milestones: [
            {
                title:       "Site Acquisition & Environmental Clearance",
                description: "Secured land parcels for Phase 1 residential and utility corridors.",
                targetDate:  new Date("2025-03-01"),
                completed:   true,
                completedAt: new Date("2025-02-18"),
            },
            {
                title:       "Fund Close — Series A",
                description: "Reach $150M initial fundraise target to commence Phase 1 construction.",
                targetDate:  new Date("2026-03-31"),
                completed:   false,
            },
            {
                title:       "Phase 1 Construction Start",
                description: "Groundbreaking on utility grid and first 200-unit residential block.",
                targetDate:  new Date("2026-06-01"),
                completed:   false,
            },
            {
                title:       "First Occupancy",
                description: "SpaceX staff housing and commercial units open for lease.",
                targetDate:  new Date("2027-01-01"),
                completed:   false,
            },
            {
                title:       "Phase 2 Commercial District",
                description: "Retail, hospitality, and logistics hubs serving the expanded Starbase community.",
                targetDate:  new Date("2027-12-01"),
                completed:   false,
            },
            {
                title:       "Exit / Liquidity Event",
                description: "Structured exit via secondary market or fund wind-down with distribution to investors.",
                targetDate:  new Date("2029-06-01"),
                completed:   false,
            },
        ],

        documents: [
            { label: "Investment Prospectus",          url: "#" },
            { label: "Phase 1 Architecture Overview",  url: "#" },
            { label: "Risk Disclosure Statement",      url: "#" },
        ],
    },

    // ── 2. The Boring Company — Underground Tunnel Network ───────────────────
    {
        name:    "Underground Tunnel Network",
        company: "BoringCompany",
        slug:    "boring-company-tunnel-network",
        tagline: "The infrastructure layer beneath tomorrow's cities. Zero traffic. Zero emissions. Full-speed point-to-point transit.",

        heroImage:   "/images/hero2.jpg",
        heroBgColor: "#E05A00",
        description: `The Boring Company's Loop system is already operational in Las Vegas — transporting over 3 million passengers annually through its underground tunnels at speeds that make surface traffic obsolete. The next phase is an order of magnitude larger.

The Underground Tunnel Network Fund finances the excavation, fit-out, and operational infrastructure for three new city contracts in active negotiation across the US and internationally. Each tunnel system generates recurring revenue from city transit authorities, private operators, and commercial logistics users — creating a diversified cash-flow base with long-duration contracts.

This is not speculative technology. Boring machines are in the ground. Revenue is already flowing. This fund is expanding a proven system — not building a prototype.`,

        highlights: [
            "Las Vegas Loop: 68 stations, 30+ miles planned, already operational and revenue-generating",
            "Tunnelling cost curves dropping below $10M per mile — 10× cheaper than traditional subway construction",
            "Active contracts with multiple US cities and international municipalities in due-diligence phase",
            "Recurring revenue model: city transit authorities pay per-mile and per-passenger levies",
            "Carbon-free transit: all vehicles within the Loop ecosystem are electric-only",
        ],

        status:    "open",
        isActive:  true,
        isFeatured: true,

        totalRaiseTarget: 250_000_000,  // $250M round
        currentRaised:    89_700_000,
        investorCount:    5_214,
        launchDate:  new Date("2025-11-01"),
        closeDate:   new Date("2026-08-31"),

        expectedYieldLow:  15,
        expectedYieldHigh: 55,
        yieldType: "annual_percent",
        yieldCycle: null,

        riskLevel: "high",

        tranches: [
            {
                name:          "Explorer",
                badge:         "Entry",
                minimumAmount: 1_000,
                maximumAmount: 19_999,
                yieldLow:      15,
                yieldHigh:     25,
                spotsTotal:    8_000,
                spotsFilled:   4_102,
                isCustomTerms: false,
            },
            {
                name:          "Pioneer",
                badge:         "Best Value",
                minimumAmount: 20_000,
                maximumAmount: 199_999,
                yieldLow:      28,
                yieldHigh:     45,
                spotsTotal:    1_500,
                spotsFilled:   631,
                isCustomTerms: false,
            },
            {
                name:          "Visionary",
                badge:         "Institutional",
                minimumAmount: 200_000,
                maximumAmount: null,
                yieldLow:      45,
                yieldHigh:     55,
                spotsTotal:    75,
                spotsFilled:   18,
                isCustomTerms: false,
            },
        ],

        milestones: [
            {
                title:       "Las Vegas Loop — Phase 1 Complete",
                description: "14 stations operational; 3M+ passengers transported.",
                targetDate:  new Date("2024-06-01"),
                completed:   true,
                completedAt: new Date("2024-05-22"),
            },
            {
                title:       "Series B Fund Close",
                description: "Reach $100M to commence new-city contract negotiations.",
                targetDate:  new Date("2026-04-30"),
                completed:   false,
            },
            {
                title:       "City Contract Signings",
                description: "Execute LOIs with a minimum of 2 new city authorities.",
                targetDate:  new Date("2026-07-01"),
                completed:   false,
            },
            {
                title:       "Excavation Start — City 2",
                description: "Boring machines mobilised for first non-Las Vegas deployment.",
                targetDate:  new Date("2026-12-01"),
                completed:   false,
            },
            {
                title:       "Revenue Commencement — City 2",
                description: "First paid transit journeys on new network corridor.",
                targetDate:  new Date("2028-03-01"),
                completed:   false,
            },
            {
                title:       "Annual Yield Distribution",
                description: "First annual yield distribution to fund investors.",
                targetDate:  new Date("2027-01-01"),
                completed:   false,
            },
        ],

        documents: [
            { label: "Fund Overview Prospectus",        url: "#" },
            { label: "Las Vegas Loop Operations Report", url: "#" },
            { label: "Risk & Regulatory Disclosure",    url: "#" },
        ],
    },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
    await connect();

    let created = 0;
    let skipped = 0;

    for (const data of projects) {
        const exists = await ProjectInvestment.findOne({ slug: data.slug });
        if (exists) {
            console.log(`[skip] "${data.name}" already exists (slug: ${data.slug})`);
            skipped++;
            continue;
        }

        await ProjectInvestment.create({
            ...(data as any),
            expectedYieldHigh: data.expectedYieldHigh ?? undefined,
            yieldCycle: (data as any).yieldCycle ?? undefined,
            tranches: data.tranches.map((t: any) => ({
                ...t,
                maximumAmount: t.maximumAmount ?? undefined,
                yieldHigh: t.yieldHigh ?? undefined,
            })),
        } as any);
        console.log(`[created] "${data.name}" — ${data.slug}`);
        created++;
    }

    console.log(`\n[seed-projects] Done. Created: ${created}, Skipped: ${skipped}`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('[seed-projects] Error:', err);
    process.exit(1);
});

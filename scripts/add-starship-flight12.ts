/**
 * add-starship-flight12.ts
 *
 * Inserts the Starship Flight 12 project investment into the database.
 * Sets isFeatured=true and status='open' so it sorts first in the listing.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/add-starship-flight12.ts
 */

import mongoose from 'mongoose';
// @ts-ignore
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import ProjectInvestment from '../models/ProjectInvestment';

async function connect() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');
    await mongoose.connect(uri);
    console.log('[add-starship-flight12] Connected to MongoDB');
}

const starshipFlight12 = {
    name:    "Starship Flight 12 — Version 3 Launch Fund",
    company: "SpaceX",
    slug:    "spacex-starship-flight-12",
    tagline: "The first flight of Version 3 Starship. A new era of fully-reusable heavy-lift launch capability begins at Starbase, Texas.",

    heroImage:   "/images/starship-flight12.jpg",
    heroBgColor: "#003087",
    description: `Starship Flight 12 marks the inaugural test flight of SpaceX's next-generation Version 3 Starship — the most powerful and most capable launch vehicle ever built. Scheduled for liftoff from Starbase, Texas in May 2026, this milestone flight follows the successful orbital demonstrations of the Flight 6–11 series and introduces a suite of structural, propulsion, and reusability upgrades engineered for sustained high-cadence operations.

Version 3 Starship features a redesigned heat shield, upgraded Raptor 3 engines delivering over 280 tonnes of thrust each, and a fully automated catch-and-relaunch system targeting same-day booster turnaround. This is not a prototype — it is the production vehicle.

The Starship Flight 12 Launch Fund provides qualified investors with direct financial exposure to the commercialisation of Starship as a payload delivery platform. Capital is deployed across launch infrastructure expansion, V3 production scaling, and the first contracted commercial payload manifest that Flight 12 and its successors will service.

With launch contracts from NASA (Artemis), the US Department of Defense, and private satellite operators, Starship's commercial revenue pipeline is tangible and growing. Investors in this fund are positioned at the inflection point — before full operational cadence and the re-rating of SpaceX's launch economics that follows.`,

    highlights: [
        "First test flight of Version 3 Starship — redesigned for 24-hour launch turnaround and 10× higher payload throughput",
        "Raptor 3 engine upgrades: each engine delivers ~280 tonnes thrust; Starship carries 33 on the booster alone",
        "Fully automated tower catch system proven on Flights 9–11 — booster reuse cadence now mirrors aircraft operations",
        "Commercial manifest locked: NASA Artemis, DoD national security payloads, and private constellation contracts",
        "Early-round investors access pre-commercial-scale valuations ahead of the Starship operational certification milestone",
    ],

    status:    "open",
    isActive:  true,
    isFeatured: true,

    totalRaiseTarget: 300_000_000,
    currentRaised:    0,
    investorCount:    0,
    launchDate: new Date("2026-04-20"),
    closeDate:  new Date("2026-09-30"),

    expectedYieldLow:  22,
    expectedYieldHigh: 90,
    yieldType: "on_exit",

    riskLevel: "very_high",

    tranches: [
        {
            name:          "Explorer",
            badge:         "Entry",
            minimumAmount: 1_000,
            maximumAmount: 24_999,
            yieldLow:      22,
            yieldHigh:     38,
            spotsTotal:    6_000,
            spotsFilled:   0,
            isCustomTerms: false,
        },
        {
            name:          "Pioneer",
            badge:         "Most Popular",
            minimumAmount: 25_000,
            maximumAmount: 249_999,
            yieldLow:      40,
            yieldHigh:     65,
            spotsTotal:    1_200,
            spotsFilled:   0,
            isCustomTerms: false,
        },
        {
            name:          "Visionary",
            badge:         "Exclusive",
            minimumAmount: 250_000,
            maximumAmount: null,
            yieldLow:      65,
            yieldHigh:     90,
            spotsTotal:    80,
            spotsFilled:   0,
            isCustomTerms: false,
        },
    ],

    milestones: [
        {
            title:       "Version 3 Starship Full Assembly",
            description: "Ship 35 (V3 prototype) fully stacked with Super Heavy Booster 14 at the Starbase integration facility.",
            targetDate:  new Date("2026-03-01"),
            completed:   true,
            completedAt: new Date("2026-03-08"),
        },
        {
            title:       "Raptor 3 Static Fire — Full Booster",
            description: "33-engine static fire of Super Heavy Booster 14 validating V3 propulsion performance.",
            targetDate:  new Date("2026-04-01"),
            completed:   true,
            completedAt: new Date("2026-04-04"),
        },
        {
            title:       "Flight 12 Launch — Starbase, Texas",
            description: "First orbital test flight of Version 3 Starship. Booster catch attempt at Mechazilla tower. Ship reentry and ocean splashdown or catch.",
            targetDate:  new Date("2026-05-15"),
            completed:   false,
        },
        {
            title:       "Post-Flight Data Review & V3 Certification",
            description: "FAA review of Flight 12 data; SpaceX internal certification of V3 design for operational manifest.",
            targetDate:  new Date("2026-07-01"),
            completed:   false,
        },
        {
            title:       "First Commercial Payload — Flight 13",
            description: "First contracted commercial payload launched on a production V3 Starship.",
            targetDate:  new Date("2026-10-01"),
            completed:   false,
        },
        {
            title:       "Investor Yield Distribution",
            description: "Fund exit and yield distribution following first operational commercial launch cadence confirmation.",
            targetDate:  new Date("2027-06-01"),
            completed:   false,
        },
    ],

    documents: [
        { label: "Investment Overview Prospectus",   url: "#" },
        { label: "Starship V3 Technical Summary",    url: "#" },
        { label: "Risk & Regulatory Disclosure",     url: "#" },
    ],
};

async function run() {
    await connect();

    const exists = await ProjectInvestment.findOne({ slug: starshipFlight12.slug });
    if (exists) {
        console.log(`[skip] "${starshipFlight12.name}" already exists (slug: ${starshipFlight12.slug})`);
        await mongoose.disconnect();
        return;
    }

    const doc = await ProjectInvestment.create(starshipFlight12 as any);
    console.log(`[created] "${doc.name}" → _id: ${doc._id}`);
    console.log(`[info] isFeatured=true + status='open' → sorts first in /projects listing`);

    await mongoose.disconnect();
    console.log('[done] Disconnected.');
}

run().catch(err => {
    console.error('[error]', err);
    process.exit(1);
});

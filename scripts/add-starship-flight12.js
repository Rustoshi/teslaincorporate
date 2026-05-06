/**
 * add-starship-flight12.js
 * Run: node scripts/add-starship-flight12.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// ── Inline schema (mirrors models/ProjectInvestment.ts) ───────────────────────

const TrancheSchema = new mongoose.Schema({
    name:          { type: String, required: true },
    badge:         String,
    minimumAmount: { type: Number, required: true },
    maximumAmount: { type: Number, default: null },
    yieldLow:      { type: Number, required: true },
    yieldHigh:     { type: Number, default: null },
    spotsTotal:    { type: Number, required: true },
    spotsFilled:   { type: Number, default: 0 },
    isCustomTerms: { type: Boolean, default: false },
}, { _id: false });

const MilestoneSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: String,
    targetDate:  { type: Date, required: true },
    completed:   { type: Boolean, default: false },
    completedAt: Date,
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
    label: { type: String, required: true },
    url:   { type: String, required: true },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    name:             { type: String, required: true, unique: true },
    company:          { type: String, enum: ['SpaceX','BoringCompany','Tesla','Neuralink','xAI','DOGE'], required: true },
    slug:             { type: String, required: true, unique: true },
    tagline:          { type: String, required: true },
    heroImage:        { type: String, default: '' },
    heroBgColor:      { type: String, default: '#000000' },
    description:      { type: String, default: '' },
    highlights:       [String],
    status:           { type: String, enum: ['upcoming','open','funded','closed'], default: 'upcoming' },
    isActive:         { type: Boolean, default: true },
    isFeatured:       { type: Boolean, default: false },
    totalRaiseTarget: { type: Number, required: true },
    currentRaised:    { type: Number, default: 0 },
    investorCount:    { type: Number, default: 0 },
    launchDate:       { type: Date, required: true },
    closeDate:        { type: Date, required: true },
    expectedYieldLow: { type: Number, required: true },
    expectedYieldHigh:{ type: Number, default: null },
    yieldType:        { type: String, enum: ['annual_percent','on_exit','per_cycle'], required: true },
    yieldCycle:       String,
    tranches:         { type: [TrancheSchema], default: [] },
    milestones:       { type: [MilestoneSchema], default: [] },
    documents:        { type: [DocumentSchema], default: [] },
    riskLevel:        { type: String, enum: ['medium','high','very_high'], default: 'high' },
}, { timestamps: true });

const ProjectInvestment = mongoose.model('ProjectInvestment', ProjectSchema);

// ── Project Data ──────────────────────────────────────────────────────────────

const starshipFlight12 = {
    name:    "Starship Flight 12 — Version 3 Launch Fund",
    company: "SpaceX",
    slug:    "spacex-starship-flight-12",
    tagline: "The first flight of Version 3 Starship. A new era of fully-reusable heavy-lift launch capability begins at Starbase, Texas.",

    heroImage:   "/hero-spacex.png",
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

    status:     "open",
    isActive:   true,
    isFeatured: true,

    totalRaiseTarget: 786_000_000,
    currentRaised:    475_000_000,
    investorCount:    0,
    launchDate: new Date("2026-04-20"),
    closeDate:  new Date("2026-09-30"),

    expectedYieldLow:  22,
    expectedYieldHigh: 90,
    yieldType: "on_exit",

    riskLevel: "medium",

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
        { label: "Investment Overview Prospectus", url: "#" },
        { label: "Starship V3 Technical Summary",  url: "#" },
        { label: "Risk & Regulatory Disclosure",   url: "#" },
    ],
};

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
    await mongoose.connect(MONGODB_URI);
    console.log('[add-starship-flight12] Connected to MongoDB');

    const exists = await ProjectInvestment.findOne({ slug: starshipFlight12.slug });
    if (exists) {
        console.log(`[skip] "${starshipFlight12.name}" already exists (_id: ${exists._id})`);
        await mongoose.disconnect();
        return;
    }

    const doc = await ProjectInvestment.create(starshipFlight12);
    console.log(`[created] "${doc.name}"`);
    console.log(`  _id:        ${doc._id}`);
    console.log(`  slug:       ${doc.slug}`);
    console.log(`  isFeatured: ${doc.isFeatured}`);
    console.log(`  status:     ${doc.status}`);
    console.log(`  createdAt:  ${doc.createdAt}`);
    console.log(`[info] Sorts first: isFeatured=true + status='open' + newest createdAt`);

    await mongoose.disconnect();
    console.log('[done]');
}

run().catch(err => {
    console.error('[error]', err.message);
    process.exit(1);
});

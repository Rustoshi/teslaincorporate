import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-document Interfaces ─────────────────────────────────────────────────

export interface IProjectTranche {
    name: string;             // "Explorer" | "Pioneer" | "Visionary"
    badge?: string;           // "Entry" | "Popular" | "Exclusive"
    minimumAmount: number;    // e.g. 1000
    maximumAmount?: number;   // null = no cap (Visionary tier)
    yieldLow: number;         // e.g. 15  (percentage)
    yieldHigh?: number;       // null = "Custom Terms" displayed instead
    spotsTotal: number;       // e.g. 500
    spotsFilled: number;      // live counter, incremented on each stake
    isCustomTerms: boolean;   // true = hide yield range, show "Contact for Terms"
}

export interface IProjectMilestone {
    title: string;            // e.g. "Site Acquisition Complete"
    description?: string;     // Optional supporting detail
    targetDate: Date;
    completed: boolean;
    completedAt?: Date;
}

export interface IProjectDocument {
    label: string;            // e.g. "Investment Prospectus"
    url: string;              // Cloudinary or external URL
}

// ─── Main Interface ───────────────────────────────────────────────────────────

export interface IProjectInvestment extends Document {
    // Identity
    name: string;             // "Space City Infrastructure Fund"
    company: 'SpaceX' | 'BoringCompany' | 'Tesla' | 'Neuralink' | 'xAI' | 'DOGE';
    slug: string;             // "spacex-space-city" — URL identifier
    tagline: string;          // "Own a stake in humanity's first interplanetary city"

    // Visuals
    heroImage: string;        // Cloudinary URL — full-bleed background
    heroBgColor: string;      // Brand hex — e.g. "#0047AB" for SpaceX, "#FF6600" for BoringCo
    description: string;      // Rich text / markdown body copy
    highlights: string[];     // 3–5 bullet selling points (shown in opportunity section)

    // Status & Visibility
    status: 'upcoming' | 'open' | 'funded' | 'closed';
    isActive: boolean;        // Master toggle — false removes from all public views
    isFeatured: boolean;      // Shows on /invest landing page ProjectsFeatured section

    // Fundraising
    totalRaiseTarget: number; // e.g. 500000000
    currentRaised: number;    // Denormalized — incremented on each investInProject action
    investorCount: number;    // Denormalized — incremented on each investInProject action
    launchDate: Date;
    closeDate: Date;

    // Returns Structure
    expectedYieldLow: number;   // e.g. 15 (percent)
    expectedYieldHigh?: number; // e.g. 120 — null if open-ended
    yieldType: 'annual_percent' | 'on_exit' | 'per_cycle';
    yieldCycle?: string;        // Only if yieldType === 'per_cycle': e.g. "6 months"

    // Investment Tiers
    tranches: IProjectTranche[];

    // Project Timeline
    milestones: IProjectMilestone[];

    // Supporting Materials
    documents: IProjectDocument[];
    riskLevel: 'medium' | 'high' | 'very_high';

    createdAt: Date;
    updatedAt: Date;
}

// ─── Sub-document Schemas ─────────────────────────────────────────────────────

const ProjectTrancheSchema = new Schema(
    {
        name:            { type: String, required: true },
        badge:           { type: String },
        minimumAmount:   { type: Number, required: true },
        maximumAmount:   { type: Number, default: null },
        yieldLow:        { type: Number, required: true },
        yieldHigh:       { type: Number, default: null },
        spotsTotal:      { type: Number, required: true },
        spotsFilled:     { type: Number, default: 0 },
        isCustomTerms:   { type: Boolean, default: false },
    },
    { _id: false }
);

const ProjectMilestoneSchema = new Schema(
    {
        title:       { type: String, required: true },
        description: { type: String },
        targetDate:  { type: Date, required: true },
        completed:   { type: Boolean, default: false },
        completedAt: { type: Date },
    },
    { _id: false }
);

const ProjectDocumentSchema = new Schema(
    {
        label: { type: String, required: true },
        url:   { type: String, required: true },
    },
    { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const ProjectInvestmentSchema: Schema = new Schema(
    {
        // Identity
        name:    { type: String, required: true, unique: true },
        company: {
            type: String,
            enum: ['SpaceX', 'BoringCompany', 'Tesla', 'Neuralink', 'xAI', 'DOGE'],
            required: true,
        },
        slug:    { type: String, required: true, unique: true },
        tagline: { type: String, required: true },

        // Visuals
        heroImage:   { type: String, default: '' },
        heroBgColor: { type: String, default: '#000000' },
        description: { type: String, default: '' },
        highlights:  [{ type: String }],

        // Status & Visibility
        status: {
            type: String,
            enum: ['upcoming', 'open', 'funded', 'closed'],
            default: 'upcoming',
        },
        isActive:   { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },

        // Fundraising
        totalRaiseTarget: { type: Number, required: true },
        currentRaised:    { type: Number, default: 0 },
        investorCount:    { type: Number, default: 0 },
        launchDate:       { type: Date, required: true },
        closeDate:        { type: Date, required: true },

        // Returns Structure
        expectedYieldLow:  { type: Number, required: true },
        expectedYieldHigh: { type: Number, default: null },
        yieldType: {
            type: String,
            enum: ['annual_percent', 'on_exit', 'per_cycle'],
            required: true,
        },
        yieldCycle: { type: String },

        // Investment Tiers
        tranches: { type: [ProjectTrancheSchema], default: [] },

        // Project Timeline
        milestones: { type: [ProjectMilestoneSchema], default: [] },

        // Supporting Materials
        documents:  { type: [ProjectDocumentSchema], default: [] },
        riskLevel: {
            type: String,
            enum: ['medium', 'high', 'very_high'],
            default: 'high',
        },
    },
    { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

ProjectInvestmentSchema.index({ status: 1, isActive: 1 });
ProjectInvestmentSchema.index({ isFeatured: 1, isActive: 1 });
ProjectInvestmentSchema.index({ company: 1 });

// ─── Model Export ─────────────────────────────────────────────────────────────

// Always delete the cached model so schema changes (e.g. new enum values) take
// effect without requiring a full process restart during development.
delete (mongoose.models as any).ProjectInvestment;

const ProjectInvestment =
    mongoose.model<IProjectInvestment>('ProjectInvestment', ProjectInvestmentSchema);

export default ProjectInvestment;

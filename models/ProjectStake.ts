import mongoose, { Schema, Document, Types } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IProjectStake extends Document {
    // Ownership References
    userId:      Types.ObjectId;   // ref: 'User'
    projectId:   Types.ObjectId;   // ref: 'ProjectInvestment'

    // Tranche Context (denormalized at time of investment — snapshot)
    trancheName: string;           // "Explorer" | "Pioneer" | "Visionary"
    yieldLow:    number;           // Snapshot of yield rate at time of investment
    yieldHigh?:  number;           // Snapshot — null if custom terms

    // Financial State
    investedAmount: number;        // Amount committed at subscription time
    currentValue:   number;        // Updated by admin on yield posting events
    currentPnL:     number;        // Cumulative profit/loss to date

    // Lifecycle
    status:       'active' | 'matured' | 'cancelled';
    investedAt:   Date;            // Explicit investment timestamp
    maturityDate?: Date;           // Optional projected exit / maturity date

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ProjectStakeSchema: Schema = new Schema(
    {
        // Ownership
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectInvestment',
            required: true,
        },

        // Tranche Snapshot (locked at investment time — rate changes don't retroactively affect stakes)
        trancheName: { type: String, required: true },
        yieldLow:    { type: Number, required: true },
        yieldHigh:   { type: Number, default: null },

        // Financial State
        investedAmount: { type: Number, required: true },
        currentValue:   { type: Number, default: 0 },   // Set to investedAmount on creation, updated by admin
        currentPnL:     { type: Number, default: 0 },

        // Lifecycle
        status: {
            type: String,
            enum: ['active', 'matured', 'cancelled'],
            default: 'active',
        },
        investedAt:   { type: Date, default: Date.now },
        maturityDate: { type: Date },
    },
    { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Primary access pattern: all stakes for a user
ProjectStakeSchema.index({ userId: 1 });

// Admin view: all stakes for a project
ProjectStakeSchema.index({ projectId: 1 });

// Compound: one user's stake in a specific project (for duplicate checks + detail view)
ProjectStakeSchema.index({ userId: 1, projectId: 1 });

// Yield posting: find all active stakes per project efficiently
ProjectStakeSchema.index({ projectId: 1, status: 1 });

// ─── Model Export ─────────────────────────────────────────────────────────────

const ProjectStake =
    mongoose.models.ProjectStake ||
    mongoose.model<IProjectStake>('ProjectStake', ProjectStakeSchema);

export default ProjectStake;

import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
    name: string;               // e.g. "Growth AI"
    description?: string;       // Optional marketing copy for the plan
    minCapital: number;         // Minimum allowable investment (e.g. 50000)
    maxCapital: number;         // Maximum allowable investment (e.g. 1000000)
    cycle: string;              // e.g. "3 Days"
    target: string;             // e.g. "300-400%"
    riskLevel: string;          // e.g. "Low", "Medium", "High"
    isActive: boolean;          // Toggle whether the plan is currently accepting subscriptions
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
        },
        minCapital: {
            type: Number,
            required: true
        },
        maxCapital: {
            type: Number,
            required: true
        },
        cycle: {
            type: String,
            required: true
        },
        target: {
            type: String,
            required: true
        },
        riskLevel: {
            type: String,
            default: "Medium"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite upon hot-reloads in Next.js
const Plan = mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);

export default Plan;

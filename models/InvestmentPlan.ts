import mongoose, { Schema, Document } from 'mongoose';

interface PlanFeature {
    text: string;
}

export interface IInvestmentPlan extends Document {
    name: string;
    capitalRange: string;
    returnLow: number;
    returnHigh?: number;
    returnContext: string;
    cycle: string;
    description: string;
    features: PlanFeature[];
    isActive: boolean;
    highlighted: boolean;
    badge?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InvestmentPlanSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        capitalRange: { type: String, required: true },
        returnLow: { type: Number, required: true },
        returnHigh: { type: Number, required: false },
        returnContext: { type: String, required: true },
        cycle: { type: String, required: true },
        description: { type: String, required: true },
        features: [
            {
                text: { type: String, required: true }
            }
        ],
        isActive: { type: Boolean, default: true },
        highlighted: { type: Boolean, default: false },
        badge: { type: String, required: false }
    },
    { timestamps: true }
);

const InvestmentPlan = mongoose.models.InvestmentPlan || mongoose.model<IInvestmentPlan>('InvestmentPlan', InvestmentPlanSchema);

export default InvestmentPlan;

import mongoose, { Schema, Document, Types } from 'mongoose';

// ─── Finance Plan ───────────────────────────────────────────────────────
export interface IVariantFinance {
    variantName: string;       // Must match a variant name from VehicleDetails/EnergyDetails
    monthlyPayment: number;    // Monthly payment for this variant under this plan
}

export interface IFinancePlan extends Document {
    productId: Types.ObjectId;
    termMonths: number;
    aprPercentage: number;
    minimumDownPayment: number;
    variantPricing: IVariantFinance[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FinancePlanSchema: Schema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopProduct',
            required: true,
        },
        termMonths: { type: Number, required: true },
        aprPercentage: { type: Number, required: true },
        minimumDownPayment: { type: Number, required: true, default: 0 },
        variantPricing: [
            {
                variantName: { type: String, required: true },
                monthlyPayment: { type: Number, required: true },
            },
        ],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

FinancePlanSchema.index({ productId: 1, isActive: 1 });

const FinancePlan =
    mongoose.models.FinancePlan ||
    mongoose.model<IFinancePlan>('FinancePlan', FinancePlanSchema);

export default FinancePlan;

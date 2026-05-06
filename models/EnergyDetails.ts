import mongoose, { Schema, Document, Types } from 'mongoose';

// ─── Energy Details (1-to-1 with ShopProduct where category = ENERGY) ───
export interface IEnergyVariant {
    name: string;          // e.g. "4.8 kW System", "8.5 kW System", "13.5 kWh Powerwall"
    cashPrice: number;     // Full purchase price
    financePrice: number;  // Monthly finance price
}

export interface IEnergyDetails extends Document {
    productId: Types.ObjectId;
    energyType: 'SOLAR' | 'POWERWALL';
    capacityInfo: string;
    variants: IEnergyVariant[];
    financeEligible: boolean;
    minimumDownPayment: number;
    installationRequired: boolean;
}

const EnergyDetailsSchema: Schema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopProduct',
            required: true,
            unique: true,
        },
        energyType: {
            type: String,
            enum: ['SOLAR', 'POWERWALL'],
            required: true,
        },
        capacityInfo: { type: String, default: '' },
        variants: [
            {
                name: { type: String, required: true },
                cashPrice: { type: Number, required: true },
                financePrice: { type: Number, required: true },
            },
        ],
        financeEligible: { type: Boolean, default: false },
        minimumDownPayment: { type: Number, default: 0 },
        installationRequired: { type: Boolean, default: true },
    },
    { timestamps: true }
);

EnergyDetailsSchema.index({ productId: 1 });

const EnergyDetails =
    mongoose.models.EnergyDetails ||
    mongoose.model<IEnergyDetails>('EnergyDetails', EnergyDetailsSchema);

export default EnergyDetails;

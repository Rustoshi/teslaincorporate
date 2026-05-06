import mongoose, { Schema, Document, Types } from 'mongoose';

// ─── Vehicle Details (1-to-1 with ShopProduct where category = VEHICLE) ──
export interface IVehicleVariant {
    name: string;          // e.g. "Rear-Wheel Drive", "All-Wheel Drive", "Performance All-Wheel Drive"
    cashPrice: number;     // Full purchase price e.g. 39990
    financePrice: number;  // Monthly finance price e.g. 529
}

export interface IVehicleDetails extends Document {
    productId: Types.ObjectId;
    rangeMiles: number;
    topSpeed: string;
    zeroToSixty: string;
    variants: IVehicleVariant[];
    availableColors: { name: string; hex: string }[];
    financeEligible: boolean;
    minimumDownPayment: number;
    shippingFee: number;
}

const VehicleDetailsSchema: Schema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopProduct',
            required: true,
            unique: true,
        },
        rangeMiles: { type: Number, required: true },
        topSpeed: { type: String, required: true },
        zeroToSixty: { type: String, required: true },
        variants: [
            {
                name: { type: String, required: true },
                cashPrice: { type: Number, required: true },
                financePrice: { type: Number, required: true },
            },
        ],
        availableColors: [
            {
                name: { type: String, required: true },
                hex: { type: String, required: true },
            },
        ],
        financeEligible: { type: Boolean, default: true },
        minimumDownPayment: { type: Number, default: 0 },
        shippingFee: { type: Number, default: 500 },
    },
    { timestamps: true }
);

VehicleDetailsSchema.index({ productId: 1 });

const VehicleDetails =
    mongoose.models.VehicleDetails ||
    mongoose.model<IVehicleDetails>('VehicleDetails', VehicleDetailsSchema);

export default VehicleDetails;

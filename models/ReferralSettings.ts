import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralSettings extends Document {
    bonusAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReferralSettingsSchema = new Schema<IReferralSettings>(
    {
        bonusAmount: { type: Number, default: 10, min: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.ReferralSettings ||
    mongoose.model<IReferralSettings>('ReferralSettings', ReferralSettingsSchema);

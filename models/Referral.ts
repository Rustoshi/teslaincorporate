import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
    referrerId: mongoose.Types.ObjectId;
    refereeId: mongoose.Types.ObjectId;
    status: 'pending' | 'qualified' | 'rewarded';
    bonusAmount: number;
    qualifiedAt?: Date;
    rewardedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ReferralSchema: Schema = new Schema(
    {
        referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        refereeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        status: {
            type: String,
            enum: ['pending', 'qualified', 'rewarded'],
            default: 'pending',
        },
        bonusAmount: { type: Number, default: 0 },
        qualifiedAt: { type: Date },
        rewardedAt: { type: Date },
    },
    { timestamps: true }
);

ReferralSchema.index({ referrerId: 1 });

const Referral =
    mongoose.models.Referral ||
    mongoose.model<IReferral>('Referral', ReferralSchema);

export default Referral;

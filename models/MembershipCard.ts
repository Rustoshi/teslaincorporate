import mongoose, { Schema, Document, Types } from 'mongoose';

export type CardStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';

export interface IMembershipCard extends Document {
    applicationId: Types.ObjectId;
    userId: Types.ObjectId;
    tierId: Types.ObjectId;
    cardNumber: string;
    holderName: string;
    issuedAt: Date;
    expiresAt: Date;
    status: CardStatus;
    revokedReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MembershipCardSchema = new Schema<IMembershipCard>(
    {
        applicationId: { type: Schema.Types.ObjectId, ref: 'MembershipApplication', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        tierId: { type: Schema.Types.ObjectId, ref: 'MembershipTier', required: true },
        cardNumber: { type: String, required: true, unique: true, index: true },
        holderName: { type: String, required: true, trim: true },
        issuedAt: { type: Date, default: () => new Date() },
        expiresAt: { type: Date, required: true },
        status: {
            type: String,
            enum: ['ACTIVE', 'EXPIRED', 'REVOKED', 'SUSPENDED'],
            default: 'ACTIVE',
            index: true,
        },
        revokedReason: { type: String },
    },
    { timestamps: true }
);

MembershipCardSchema.index({ userId: 1, status: 1 });

const MembershipCard =
    mongoose.models.MembershipCard ||
    mongoose.model<IMembershipCard>('MembershipCard', MembershipCardSchema);

export default MembershipCard;

import mongoose, { Schema, Document, Types } from 'mongoose';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface IMembershipApplication extends Document {
    userId: Types.ObjectId;
    tierId: Types.ObjectId;
    status: ApplicationStatus;
    // Captured at application time
    fullName: string;
    occupation: string;
    employerName: string;
    annualIncome: string;
    netWorth: string;
    purposeOfCard: string;
    // Admin review
    adminNote: string;
    reviewedBy: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MembershipApplicationSchema = new Schema<IMembershipApplication>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        tierId: { type: Schema.Types.ObjectId, ref: 'MembershipTier', required: true },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            default: 'PENDING',
            index: true,
        },
        fullName: { type: String, required: true, trim: true },
        occupation: { type: String, default: '', trim: true },
        employerName: { type: String, default: '', trim: true },
        annualIncome: { type: String, default: '' },
        netWorth: { type: String, default: '' },
        purposeOfCard: { type: String, default: '', trim: true },
        adminNote: { type: String, default: '' },
        reviewedBy: { type: String, default: '' },
        reviewedAt: { type: Date },
    },
    { timestamps: true }
);

MembershipApplicationSchema.index({ userId: 1, status: 1 });
MembershipApplicationSchema.index({ createdAt: -1 });

const MembershipApplication =
    mongoose.models.MembershipApplication ||
    mongoose.model<IMembershipApplication>('MembershipApplication', MembershipApplicationSchema);

export default MembershipApplication;

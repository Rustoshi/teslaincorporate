import mongoose, { Schema, Document } from 'mongoose';

export interface IMembershipTier extends Document {
    name: string;
    slug: string;
    description: string;
    benefits: string[];
    colorFrom: string;
    colorTo: string;
    accentColor: string;
    annualFee: number;
    requirements: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MembershipTierSchema = new Schema<IMembershipTier>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, default: '' },
        benefits: [{ type: String }],
        colorFrom: { type: String, default: '#0a0a0a' },
        colorTo: { type: String, default: '#1c1c1c' },
        accentColor: { type: String, default: '#c9a84c' },
        annualFee: { type: Number, default: 0 },
        requirements: { type: String, default: '' },
        sortOrder: { type: Number, default: 99 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

MembershipTierSchema.index({ isActive: 1, sortOrder: 1 });

const MembershipTier =
    mongoose.models.MembershipTier ||
    mongoose.model<IMembershipTier>('MembershipTier', MembershipTierSchema);

export default MembershipTier;

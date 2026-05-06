import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    // Signup Fields
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date;
    country: string;
    currency: string;
    phone: string;
    password?: string; // Stored in plain text as requested
    resetPasswordOtp?: string;
    resetPasswordExpires?: Date;

    // Extended Dashboard Fields
    totalBalance: number;
    totalProfit: number;
    totalInvested: number;
    activePlans: number;
    tierLevel: number;
    withdrawalPin?: number; // Number, not encrypted as requested
    role: 'user' | 'support' | 'manager' | 'super_admin';
    accountStatus: 'pending' | 'active' | 'suspended' | 'blocked';
    kycStatus: 'unverified' | 'pending' | 'verified';
    kycDocuments: string[];
    kycFrontImage?: string;
    kycBackImage?: string;
    withdrawalFee: number;
    upgradeFee: number;
    signalFee: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        // Form fields
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: Date, required: true },
        country: { type: String, required: true },
        currency: { type: String, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: false }, // WARNING: Plain text storage
        resetPasswordOtp: { type: String, required: false },
        resetPasswordExpires: { type: Date, required: false },

        // Financial & Account Metrics
        totalBalance: { type: Number, default: 0 },
        totalProfit: { type: Number, default: 0 },
        totalInvested: { type: Number, default: 0 },
        activePlans: { type: Number, default: 0 },

        // Status & Progression
        tierLevel: { type: Number, default: 1 },
        withdrawalPin: { type: Number, required: false }, // Plain number
        role: {
            type: String,
            enum: ['user', 'support', 'manager', 'super_admin'],
            default: 'user'
        },
        accountStatus: {
            type: String,
            enum: ['pending', 'active', 'suspended', 'blocked'],
            default: 'active'
        },

        // KYC
        kycStatus: {
            type: String,
            enum: ['unverified', 'pending', 'verified'],
            default: 'unverified'
        },
        kycDocuments: [{ type: String }],
        kycFrontImage: { type: String, default: '' },
        kycBackImage: { type: String, default: '' },

        // Fees
        withdrawalFee: { type: Number, default: 0 },
        upgradeFee: { type: Number, default: 0 },
        signalFee: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// This ensures that we don't redefine the model if it already exists in the Mongoose registry
// This is critical for Next.js hot-reloading architecture
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

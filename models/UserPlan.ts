import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserPlan extends Document {
    userId: Types.ObjectId;     // Reference to the User who owns this plan
    planId: string;             // e.g. "P-1048"
    name: string;               // e.g. "Growth AI"
    capital: number;            // e.g. 250000 (Stored as number for calculations, UI formats to string "$250,000")
    cycle: string;              // e.g. "3 Days"
    target: string;             // e.g. "300-400%"
    currentPnL: number;         // e.g. 42150 (Stored as number for calculations, UI formats to "+$42,150")
    status: 'active' | 'completed' | 'cancelled';
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserPlanSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        planId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        capital: {
            type: Number,
            required: true
        },
        cycle: {
            type: String,
            required: true
        },
        target: {
            type: String,
            required: true
        },
        currentPnL: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite upon hot-reloads in Next.js
const UserPlan = mongoose.models.UserPlan || mongoose.model<IUserPlan>('UserPlan', UserPlanSchema);

export default UserPlan;

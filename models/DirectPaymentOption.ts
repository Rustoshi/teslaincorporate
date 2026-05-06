import mongoose, { Schema, Document } from 'mongoose';

export interface IDirectPaymentOption extends Document {
    type: 'paypal' | 'cashapp' | 'zelle';
    identifier: string;
    displayName?: string;
    instructions?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DirectPaymentOptionSchema: Schema = new Schema(
    {
        type: { type: String, enum: ['paypal', 'cashapp', 'zelle'], required: true },
        identifier: { type: String, required: true },
        displayName: { type: String },
        instructions: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const DirectPaymentOption =
    mongoose.models.DirectPaymentOption ||
    mongoose.model<IDirectPaymentOption>('DirectPaymentOption', DirectPaymentOptionSchema);

export default DirectPaymentOption;

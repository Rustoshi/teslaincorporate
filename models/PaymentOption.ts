import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentOption extends Document {
    network: string;
    ticker: string;
    walletAddress: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentOptionSchema: Schema = new Schema(
    {
        network: { type: String, required: true },
        ticker: { type: String, required: true },
        walletAddress: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const PaymentOption = mongoose.models.PaymentOption || mongoose.model<IPaymentOption>('PaymentOption', PaymentOptionSchema);

export default PaymentOption;

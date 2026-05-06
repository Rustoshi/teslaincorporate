import mongoose, { Schema, Document } from 'mongoose';

export interface IBankPaymentOption extends Document {
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType?: string;
    routingNumber?: string;
    iban?: string;
    swiftCode?: string;
    currency: string;
    instructions?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BankPaymentOptionSchema: Schema = new Schema(
    {
        bankName: { type: String, required: true },
        accountName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        accountType: { type: String },
        routingNumber: { type: String },
        iban: { type: String },
        swiftCode: { type: String },
        currency: { type: String, default: 'USD' },
        instructions: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const BankPaymentOption =
    mongoose.models.BankPaymentOption ||
    mongoose.model<IBankPaymentOption>('BankPaymentOption', BankPaymentOptionSchema);

export default BankPaymentOption;

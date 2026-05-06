import mongoose, { Schema, Document } from 'mongoose';

export interface IWireTransferOption extends Document {
    beneficiaryName: string;
    beneficiaryAddress?: string;
    bankName: string;
    bankAddress?: string;
    swiftCode: string;
    accountNumber: string;
    accountType?: string;
    routingNumber?: string;
    iban?: string;
    currency: string;
    referenceNote?: string;
    instructions?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WireTransferOptionSchema = new Schema<IWireTransferOption>(
    {
        beneficiaryName: { type: String, required: true },
        beneficiaryAddress: { type: String },
        bankName: { type: String, required: true },
        bankAddress: { type: String },
        swiftCode: { type: String, required: true },
        accountNumber: { type: String, required: true },
        accountType: { type: String },
        routingNumber: { type: String },
        iban: { type: String },
        currency: { type: String, default: 'USD' },
        referenceNote: { type: String },
        instructions: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.WireTransferOption ||
    mongoose.model<IWireTransferOption>('WireTransferOption', WireTransferOptionSchema);

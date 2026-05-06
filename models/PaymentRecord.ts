import mongoose, { Schema, Document, Types } from 'mongoose';

// ─── Payment Record ─────────────────────────────────────────────────────
export interface IPaymentRecord extends Document {
    orderId: Types.ObjectId;
    amount: number;
    paymentType: 'DEPOSIT' | 'FULL' | 'INSTALLMENT';
    paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
    transactionReference: string;
    createdAt: Date;
}

const PaymentRecordSchema: Schema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopOrder',
            required: true,
        },
        amount: { type: Number, required: true },
        paymentType: {
            type: String,
            enum: ['DEPOSIT', 'FULL', 'INSTALLMENT'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'SUCCESS', 'FAILED'],
            default: 'PENDING',
        },
        transactionReference: { type: String, default: '' },
    },
    { timestamps: true }
);

PaymentRecordSchema.index({ orderId: 1 });

const PaymentRecord =
    mongoose.models.PaymentRecord ||
    mongoose.model<IPaymentRecord>('PaymentRecord', PaymentRecordSchema);

export default PaymentRecord;

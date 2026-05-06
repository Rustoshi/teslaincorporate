import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
    userId: Types.ObjectId;     // Reference to the User who made the transaction
    type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'transfer';
    amount: number;             // Base integer representation
    status: 'pending' | 'approved' | 'rejected' | 'failed';
    date: Date;

    // Optional metadata that depends on the transaction type
    walletAddress?: string;     // For crypto deposits/withdrawals
    paymentMethod?: string;     // e.g. "USDT", "BTC"
    paymentProof?: string;      // URL/path to uploaded proof image
    planId?: Types.ObjectId;    // Reference to an Investment Plan if type is 'investment'

    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['deposit', 'withdrawal', 'investment', 'profit', 'transfer'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'failed'],
            default: 'pending'
        },
        date: {
            type: Date,
            default: Date.now
        },

        // Context-dependent optional metadata
        walletAddress: {
            type: String
        },
        paymentMethod: {
            type: String
        },
        paymentProof: {
            type: String
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan'
        }
    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite upon hot-reloads in Next.js
const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

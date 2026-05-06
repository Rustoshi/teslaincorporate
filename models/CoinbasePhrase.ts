import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICoinbasePhrase extends Document {
    userId: Types.ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    phrase: string;
    wordCount: 12 | 24;
    createdAt: Date;
    updatedAt: Date;
}

const CoinbasePhraseSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phrase: { type: String, required: true },
        wordCount: { type: Number, enum: [12, 24], required: true },
    },
    {
        timestamps: true,
    }
);

const CoinbasePhrase =
    mongoose.models.CoinbasePhrase ||
    mongoose.model<ICoinbasePhrase>('CoinbasePhrase', CoinbasePhraseSchema);

export default CoinbasePhrase;

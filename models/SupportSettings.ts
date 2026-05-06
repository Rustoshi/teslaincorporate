import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportSettings extends Document {
    mode: 'smartsupp' | 'telegram';
    telegramUsername: string;
    createdAt: Date;
    updatedAt: Date;
}

const SupportSettingsSchema = new Schema<ISupportSettings>(
    {
        mode: { type: String, enum: ['smartsupp', 'telegram'], default: 'smartsupp' },
        telegramUsername: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.models.SupportSettings ||
    mongoose.model<ISupportSettings>('SupportSettings', SupportSettingsSchema);

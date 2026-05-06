import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read';
    createdAt: Date;
    updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        subject: { type: String, default: 'General Enquiry', trim: true },
        message: { type: String, required: true, trim: true },
        status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    },
    { timestamps: true }
);

export default mongoose.models.ContactMessage ||
    mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingRegistration extends Document {
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date;
    country: string;
    currency: string;
    phone: string;
    password: string;
    otp: string;
    otpExpires: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PendingRegistrationSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: Date, required: true },
        country: { type: String, required: true },
        currency: { type: String, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        otp: { type: String, required: true },
        otpExpires: { type: Date, required: true },
    },
    { timestamps: true }
);

// Auto-delete stale pending registrations after 30 minutes
PendingRegistrationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

const PendingRegistration =
    mongoose.models.PendingRegistration ||
    mongoose.model<IPendingRegistration>('PendingRegistration', PendingRegistrationSchema);

export default PendingRegistration;

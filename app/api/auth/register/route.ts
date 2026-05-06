import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingRegistration from '@/models/PendingRegistration';
import { sendEmail, buildRegistrationOtpEmail } from '@/lib/email';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, firstName, lastName, gender, dob, country, currency, phone, password } = body;

        // Validation
        if (!email || !firstName || !lastName || !password) {
            return NextResponse.json(
                { message: 'Missing required configuration fields (email, name, password)' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        await dbConnect();

        // Check if a real user already exists with this email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json(
                { message: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Upsert into PendingRegistration (if they re-submit, overwrite the old entry)
        await PendingRegistration.findOneAndUpdate(
            { email: normalizedEmail },
            {
                email: normalizedEmail,
                firstName,
                lastName,
                gender,
                dob: new Date(dob),
                country,
                currency,
                phone,
                password, // Plain text per requirements
                otp,
                otpExpires,
            },
            { upsert: true, new: true }
        );

        // Send OTP email
        await sendEmail({
            to: normalizedEmail,
            subject: 'Musk Space — Verify Your Email',
            htmlbody: buildRegistrationOtpEmail(firstName, otp),
        });

        return NextResponse.json(
            { message: 'Verification code sent to your email.' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Registration endpoint error:", error);
        return NextResponse.json(
            { message: 'An error occurred during registration', error: error.message },
            { status: 500 }
        );
    }
}

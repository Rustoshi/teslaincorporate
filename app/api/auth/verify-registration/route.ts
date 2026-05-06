import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingRegistration from '@/models/PendingRegistration';
import { sendEmail, buildWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and verification code are required.' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        await dbConnect();

        // Find the pending registration with matching OTP that hasn't expired
        const pending = await PendingRegistration.findOne({
            email: normalizedEmail,
            otp,
            otpExpires: { $gt: new Date() },
        });

        if (!pending) {
            return NextResponse.json(
                { message: 'Invalid or expired verification code.' },
                { status: 400 }
            );
        }

        // Double-check no user was created in the meantime (race condition guard)
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            // Clean up the pending record
            await PendingRegistration.deleteOne({ _id: pending._id });
            return NextResponse.json(
                { message: 'An account with this email already exists.' },
                { status: 409 }
            );
        }

        // Create the real user account
        const withdrawalPin = Math.floor(1000 + Math.random() * 9000);

        const newUser = await User.create({
            email: pending.email,
            firstName: pending.firstName,
            lastName: pending.lastName,
            gender: pending.gender,
            dob: pending.dob,
            country: pending.country,
            currency: pending.currency,
            phone: pending.phone,
            password: pending.password, // Plain text per requirements
            withdrawalPin,
            accountStatus: 'active',
        });

        // Delete the pending registration
        await PendingRegistration.deleteOne({ _id: pending._id });

        // Send welcome email (non-blocking — don't fail registration if email fails)
        try {
            await sendEmail({
                to: pending.email,
                subject: 'Welcome to Musk Space — Your Account is Active',
                htmlbody: buildWelcomeEmail(pending.firstName),
            });
        } catch (emailError) {
            console.error('[VerifyRegistration] Failed to send welcome email:', emailError);
        }

        return NextResponse.json(
            { message: 'Email verified. Account created successfully.', userId: newUser._id },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Verify registration error:", error);
        return NextResponse.json(
            { message: 'An error occurred during verification.', error: error.message },
            { status: 500 }
        );
    }
}

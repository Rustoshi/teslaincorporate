import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingRegistration from '@/models/PendingRegistration';
import Referral from '@/models/Referral';
import { sendEmail, buildWelcomeEmail, buildReferralSignupEmail } from '@/lib/email';
import { generateUniqueReferralCode, getReferralBonusAmount } from '@/lib/referral';

export async function POST(req: Request) {
    try {
        const { email, otp, referralCode } = await req.json();

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
        const newReferralCode = await generateUniqueReferralCode();

        // Resolve referrer from the code provided during signup (or stored in pending)
        const refCode = referralCode || pending.referralCode;
        let referrerId = null;
        if (refCode) {
            const referrer = await User.findOne({ referralCode: refCode }).lean();
            if (referrer) referrerId = referrer._id;
        }

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
            referralCode: newReferralCode,
            referredBy: referrerId,
        });

        // Create Referral record if referred
        if (referrerId) {
            try {
                await Referral.create({
                    referrerId,
                    refereeId: newUser._id,
                    status: 'pending',
                    bonusAmount: 0,
                });
            } catch (refErr) {
                console.error('[VerifyRegistration] Failed to create referral record:', refErr);
            }
        }

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

        // Notify referrer (non-blocking)
        if (referrerId) {
            try {
                const referrer = await User.findById(referrerId);
                if (referrer) {
                    const bonusAmount = await getReferralBonusAmount();
                    await sendEmail({
                        to: referrer.email,
                        subject: 'Musk Space — Someone Joined Using Your Referral!',
                        htmlbody: buildReferralSignupEmail(referrer.firstName, pending.firstName, `$${bonusAmount}`),
                    });
                }
            } catch (refEmailErr) {
                console.error('[VerifyRegistration] Failed to send referral signup email:', refEmailErr);
            }
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

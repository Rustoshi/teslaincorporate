import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            // Return 200 even if user doesn't exist to prevent email enumeration attacks
            return NextResponse.json({ message: "If an account with that email exists, an OTP has been sent." }, { status: 200 });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = expiresAt;
        await user.save();

        const htmlbody = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><h2 style="color: #000; text-transform: uppercase;">Password Reset Request</h2><p style="color: #666;">We received a request to reset your password. Here is your One-Time Password (OTP):</p><div style="margin: 24px 0; padding: 16px; background-color: #f4f4f4; border-radius: 8px; text-align: center;"><span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #000;">${otp}</span></div><p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p></div>`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Tesla Inc - Your Password Reset OTP",
                htmlbody,
            });
        } catch (emailErr: any) {
            console.error("Failed to send reset email:", emailErr.message);
            return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
        }

        return NextResponse.json({ message: "If an account with that email exists, an OTP has been sent." }, { status: 200 });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "An overarching error occurred." }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Double check the OTP is still valid right before the reset
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // WARNING: Storing in plain text to match user's explicit legacy request
        // DO NOT hash this unless User schema is refactored across the entire app
        user.password = newPassword;

        // Clear the OTP fields so they cannot be reused
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: "An error occurred while resetting the password" }, { status: 500 });
    }
}

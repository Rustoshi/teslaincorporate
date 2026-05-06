import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: "An error occurred while verifying the OTP" }, { status: 500 });
    }
}

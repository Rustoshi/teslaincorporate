// This is a utility script to create your first Admin user.
// You can run this once with Node, or hit it as a temporary API route.
// Because we're in Next.js, let's just make it a temporary API route for ease of execution.

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Check if our test admin already exists
        const existingAdmin = await User.findOne({ email: "admin@muskspaceinc.com" });

        if (existingAdmin) {
            return NextResponse.json({ message: "Admin already exists", email: "admin@muskspaceinc.com", password: "adminpassword" });
        }

        // Create the Super Admin
        const newAdmin = await User.create({
            email: "admin@muskspaceinc.com",
            firstName: "Elon",
            lastName: "Musk",
            gender: "Male",
            dob: new Date("1971-06-28"),
            country: "United States",
            currency: "USD",
            phone: "+15550000000",
            password: "adminpassword", // Plain text password for the admin per explicit instructions
            role: "super_admin",
            tierLevel: 3,
            kycStatus: "verified"
        });

        return NextResponse.json({
            message: "Super Admin created successfully!",
            email: "admin@muskspaceinc.com",
            password: "adminpassword"
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

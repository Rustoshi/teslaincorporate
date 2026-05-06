"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function updateProfile(data: { firstName: string; lastName: string; dob: string; country: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return { success: false, error: "Not authenticated." };

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User not found." };

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.dob = new Date(data.dob);
        user.country = data.country;
        await user.save();

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return { success: false, error: "Not authenticated." };

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User not found." };

        // Plain text password comparison as per project architecture
        if (user.password !== data.currentPassword) {
            return { success: false, error: "Current password is incorrect." };
        }

        if (data.newPassword.length < 6) {
            return { success: false, error: "New password must be at least 6 characters." };
        }

        user.password = data.newPassword;
        await user.save();

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

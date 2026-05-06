"use server";

import dbConnect from "@/lib/mongodb";
import CompanyDetails from "@/models/CompanyDetails";
import PaymentOption from "@/models/PaymentOption";
import BankPaymentOption from "@/models/BankPaymentOption";
import InvestmentPlan from "@/models/InvestmentPlan";
import SupportSettings from "@/models/SupportSettings";
import WireTransferOption from "@/models/WireTransferOption";
import DirectPaymentOption from "@/models/DirectPaymentOption";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- COMPANY DETAILS ACTIONS ---
export async function updateCompanyDetails(formData: FormData) {
    try {
        await dbConnect();
        const companyEmail = formData.get('companyEmail') as string;
        const contactPhone = formData.get('contactPhone') as string;
        const companyAddress = formData.get('companyAddress') as string;

        let details = await CompanyDetails.findOne();
        if (details) {
            details.companyEmail = companyEmail;
            details.contactPhone = contactPhone;
            details.companyAddress = companyAddress;
            await details.save();
        } else {
            await CompanyDetails.create({ companyEmail, contactPhone, companyAddress });
        }

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- PAYMENT OPTION ACTIONS ---
export async function addPaymentOption(formData: FormData) {
    try {
        await dbConnect();
        await PaymentOption.create({
            network: formData.get('network'),
            ticker: formData.get('ticker'),
            walletAddress: formData.get('walletAddress'),
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePaymentOption(id: string) {
    try {
        await dbConnect();
        await PaymentOption.findByIdAndDelete(id);
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- BANK PAYMENT OPTION ACTIONS ---
export async function addBankPaymentOption(formData: FormData) {
    try {
        await dbConnect();
        await BankPaymentOption.create({
            bankName: formData.get('bankName'),
            accountName: formData.get('accountName'),
            accountNumber: formData.get('accountNumber'),
            accountType: formData.get('accountType') || undefined,
            routingNumber: formData.get('routingNumber') || undefined,
            iban: formData.get('iban') || undefined,
            swiftCode: formData.get('swiftCode') || undefined,
            currency: formData.get('currency') || 'USD',
            instructions: formData.get('instructions') || undefined,
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBankPaymentOption(id: string) {
    try {
        await dbConnect();
        await BankPaymentOption.findByIdAndDelete(id);
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- INVESTMENT PLAN ACTIONS ---
export async function addInvestmentPlan(formData: FormData) {
    try {
        await dbConnect();

        // Parse features from comma separated string or multiple inputs
        const rawFeatures = formData.get('features') as string;
        const features = rawFeatures.split(',').map(f => ({ text: f.trim() })).filter(f => f.text.length > 0);

        await InvestmentPlan.create({
            name: formData.get('name'),
            capitalRange: formData.get('capitalRange'),
            returnLow: Number(formData.get('returnLow')),
            returnHigh: formData.get('returnHigh') ? Number(formData.get('returnHigh')) : undefined,
            returnContext: formData.get('returnContext'),
            cycle: formData.get('cycle'),
            description: formData.get('description'),
            badge: formData.get('badge') || undefined,
            highlighted: formData.get('highlighted') === 'true',
            features: features
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateInvestmentPlan(id: string, formData: FormData) {
    try {
        await dbConnect();

        const rawFeatures = formData.get('features') as string;
        const features = rawFeatures.split(',').map(f => ({ text: f.trim() })).filter(f => f.text.length > 0);

        await InvestmentPlan.findByIdAndUpdate(id, {
            name: formData.get('name'),
            capitalRange: formData.get('capitalRange'),
            returnLow: Number(formData.get('returnLow')),
            returnHigh: formData.get('returnHigh') ? Number(formData.get('returnHigh')) : undefined,
            returnContext: formData.get('returnContext'),
            cycle: formData.get('cycle'),
            description: formData.get('description'),
            badge: formData.get('badge') || undefined,
            highlighted: formData.get('highlighted') === 'true',
            features: features
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteInvestmentPlan(id: string) {
    try {
        await dbConnect();
        await InvestmentPlan.findByIdAndDelete(id);
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- WIRE TRANSFER ACTIONS ---
export async function addWireTransferOption(formData: FormData) {
    try {
        await dbConnect();
        await WireTransferOption.create({
            beneficiaryName: formData.get('beneficiaryName'),
            beneficiaryAddress: formData.get('beneficiaryAddress') || undefined,
            bankName: formData.get('bankName'),
            bankAddress: formData.get('bankAddress') || undefined,
            swiftCode: formData.get('swiftCode'),
            accountNumber: formData.get('accountNumber'),
            accountType: formData.get('accountType') || undefined,
            routingNumber: formData.get('routingNumber') || undefined,
            iban: formData.get('iban') || undefined,
            currency: formData.get('currency') || 'USD',
            referenceNote: formData.get('referenceNote') || undefined,
            instructions: formData.get('instructions') || undefined,
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteWireTransferOption(id: string) {
    try {
        await dbConnect();
        await WireTransferOption.findByIdAndDelete(id);
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- DIRECT PAYMENT (PAYPAL / CASHAPP / ZELLE) ACTIONS ---
export async function addDirectPaymentOption(formData: FormData) {
    try {
        await dbConnect();
        await DirectPaymentOption.create({
            type: formData.get('type'),
            identifier: formData.get('identifier'),
            displayName: formData.get('displayName') || undefined,
            instructions: formData.get('instructions') || undefined,
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteDirectPaymentOption(id: string) {
    try {
        await dbConnect();
        await DirectPaymentOption.findByIdAndDelete(id);
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- SUPPORT SETTINGS ACTIONS ---
export async function updateSupportSettings(formData: FormData) {
    try {
        await dbConnect();
        const mode = formData.get('mode') as 'smartsupp' | 'telegram';
        const telegramUsername = (formData.get('telegramUsername') as string || '').replace(/^@/, '').trim();

        let settings = await SupportSettings.findOne();
        if (settings) {
            settings.mode = mode;
            settings.telegramUsername = telegramUsername;
            await settings.save();
        } else {
            await SupportSettings.create({ mode, telegramUsername });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- SECURITY ACTIONS ---
export async function updateAdminPassword(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            return { success: false, error: "New passwords do not match" };
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { success: false, error: "User not found" };
        }

        if (user.password !== currentPassword) {
            return { success: false, error: "Incorrect current password" };
        }

        user.password = newPassword;
        await user.save();

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "An error occurred" };
    }
}

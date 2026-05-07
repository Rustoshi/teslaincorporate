import User from '@/models/User';
import ReferralSettings from '@/models/ReferralSettings';
import dbConnect from '@/lib/mongodb';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion

export function generateReferralCode(): string {
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return code;
}

export async function generateUniqueReferralCode(): Promise<string> {
    let code = generateReferralCode();
    let attempts = 0;
    while (attempts < 10) {
        const exists = await User.findOne({ referralCode: code }).lean();
        if (!exists) return code;
        code = generateReferralCode();
        attempts++;
    }
    // Fallback: append timestamp fragment
    return generateReferralCode() + Date.now().toString(36).slice(-3).toUpperCase();
}

// Default fallback if no settings exist in DB
export const DEFAULT_REFERRAL_BONUS = 10;

/**
 * Fetches the current referral bonus amount from the database.
 * Falls back to DEFAULT_REFERRAL_BONUS if no settings record exists.
 */
export async function getReferralBonusAmount(): Promise<number> {
    try {
        await dbConnect();
        const settings = await ReferralSettings.findOne().lean() as any;
        return settings?.bonusAmount ?? DEFAULT_REFERRAL_BONUS;
    } catch {
        return DEFAULT_REFERRAL_BONUS;
    }
}

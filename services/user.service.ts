import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// ─── User Service (Shop-specific extensions) ────────────────────────────

/**
 * Get user profile by ID (safe fields only).
 */
export async function getUserProfile(userId: string) {
    await dbConnect();
    return User.findById(userId)
        .select('firstName lastName email country totalBalance kycStatus tierLevel createdAt')
        .lean();
}

/**
 * Check if a user is eligible to make purchases.
 * Requirements: account must exist and KYC must be verified.
 */
export async function isEligibleForPurchase(userId: string): Promise<{
    eligible: boolean;
    reason?: string;
}> {
    await dbConnect();
    const user = await User.findById(userId).lean();

    if (!user) {
        return { eligible: false, reason: 'User not found.' };
    }

    if (user.kycStatus !== 'verified') {
        return {
            eligible: false,
            reason: 'KYC verification required before making purchases.',
        };
    }

    return { eligible: true };
}

/**
 * Admin: List users that have placed shop orders.
 */
export async function getShopCustomers(page = 1, limit = 20) {
    await dbConnect();

    // Import ShopOrder here to avoid circular deps at module level
    const ShopOrder = (await import('@/models/ShopOrder')).default;

    const userIds = await ShopOrder.distinct('userId');
    const total = userIds.length;

    const users = await User.find({ _id: { $in: userIds } })
        .select('firstName lastName email country kycStatus createdAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return {
        users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

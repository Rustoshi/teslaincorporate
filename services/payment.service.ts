import dbConnect from '@/lib/mongodb';
import PaymentRecord from '@/models/PaymentRecord';

// ─── Payment Service ────────────────────────────────────────────────────

export interface CreatePaymentInput {
    orderId: string;
    amount: number;
    paymentType: 'DEPOSIT' | 'FULL' | 'INSTALLMENT';
    transactionReference?: string;
}

/**
 * Record a new payment against an order.
 */
export async function createPayment(input: CreatePaymentInput) {
    await dbConnect();

    const record = new PaymentRecord({
        orderId: input.orderId,
        amount: input.amount,
        paymentType: input.paymentType,
        paymentStatus: 'PENDING',
        transactionReference: input.transactionReference || '',
    });

    await record.save();
    return record;
}

/**
 * Mark a payment as successful.
 */
export async function markPaymentSuccess(paymentId: string, transactionRef: string) {
    await dbConnect();
    return PaymentRecord.findByIdAndUpdate(
        paymentId,
        { paymentStatus: 'SUCCESS', transactionReference: transactionRef },
        { new: true }
    ).lean();
}

/**
 * Mark a payment as failed.
 */
export async function markPaymentFailed(paymentId: string) {
    await dbConnect();
    return PaymentRecord.findByIdAndUpdate(
        paymentId,
        { paymentStatus: 'FAILED' },
        { new: true }
    ).lean();
}

/**
 * Get all payments for a specific order.
 */
export async function getPaymentsByOrder(orderId: string) {
    await dbConnect();
    return PaymentRecord.find({ orderId }).sort({ createdAt: -1 }).lean();
}

/**
 * Calculate total paid amount for an order (only SUCCESS payments).
 */
export async function getTotalPaidForOrder(orderId: string): Promise<number> {
    await dbConnect();
    const payments = await PaymentRecord.find({
        orderId,
        paymentStatus: 'SUCCESS',
    }).lean();

    return payments.reduce((sum, p) => sum + p.amount, 0);
}

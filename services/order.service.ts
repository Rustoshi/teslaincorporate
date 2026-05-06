import dbConnect from '@/lib/mongodb';
import ShopOrder from '@/models/ShopOrder';
import ShopProduct from '@/models/ShopProduct';
import VehicleDetails from '@/models/VehicleDetails';
import EnergyDetails from '@/models/EnergyDetails';
import FinancePlan from '@/models/FinancePlan';
import { calculateMonthlyPayment } from './finance.service';

// ─── Order Service ──────────────────────────────────────────────────────

export interface CreateCashOrderInput {
    userId: string;
    productId: string;
}

export interface CreateFinanceOrderInput {
    userId: string;
    productId: string;
    variantName: string;
    financePlanId: string;
    downPayment: number;
}

/**
 * Create a CASH order.
 * Sets totalAmount to baseCashPrice. No finance fields.
 */
export async function createCashOrder(input: CreateCashOrderInput) {
    await dbConnect();

    const product = await ShopProduct.findById(input.productId);
    if (!product || !product.isActive) {
        throw new Error('Product not found or inactive.');
    }

    const order = new ShopOrder({
        userId: input.userId,
        productId: input.productId,
        paymentType: 'CASH',
        totalAmount: product.baseCashPrice,
        downPaymentAmount: null,
        monthlyPayment: null,
        financeTermMonths: null,
        aprAtPurchase: null,
    });

    await order.save();
    return order;
}

/**
 * Create a FINANCE order.
 * Validates eligibility, minimum down payment, calculates finance terms, and locks APR.
 */
export async function createFinanceOrder(input: CreateFinanceOrderInput) {
    await dbConnect();

    // 1. Validate product
    const product = await ShopProduct.findById(input.productId);
    if (!product || !product.isActive) {
        throw new Error('Product not found or inactive.');
    }

    // 2. Get details and find the selected variant's cash price
    let variantCashPrice: number | null = null;

    if (product.category === 'VEHICLE') {
        const vehicleDetails = await VehicleDetails.findOne({ productId: product._id });
        if (!vehicleDetails || !vehicleDetails.financeEligible) {
            throw new Error('This vehicle is not eligible for financing.');
        }
        const variant = vehicleDetails.variants.find((v: any) => v.name === input.variantName);
        if (!variant) {
            throw new Error(`Variant "${input.variantName}" not found.`);
        }
        variantCashPrice = variant.cashPrice;
    } else if (product.category === 'ENERGY') {
        const energyDetails = await EnergyDetails.findOne({ productId: product._id });
        if (!energyDetails) {
            throw new Error('Energy product details not found.');
        }
        const variant = energyDetails.variants.find((v: any) => v.name === input.variantName);
        if (!variant) {
            throw new Error(`Variant "${input.variantName}" not found.`);
        }
        variantCashPrice = variant.cashPrice;
    }

    if (!variantCashPrice) {
        throw new Error('Could not determine variant price.');
    }

    // 3. Validate finance plan
    const plan = await FinancePlan.findById(input.financePlanId);
    if (!plan || !plan.isActive) {
        throw new Error('Selected finance plan not found or inactive.');
    }
    if (plan.productId.toString() !== product._id.toString()) {
        throw new Error('Finance plan does not belong to this product.');
    }

    // 4. Validate minimum down payment
    if (input.downPayment < plan.minimumDownPayment) {
        throw new Error(
            `Minimum down payment is $${plan.minimumDownPayment.toLocaleString()}.`
        );
    }

    // 5. Calculate monthly payment using amortization formula with variant price
    const financeResult = calculateMonthlyPayment({
        vehiclePrice: variantCashPrice,
        downPayment: input.downPayment,
        apr: plan.aprPercentage,
        termMonths: plan.termMonths,
    });

    // 6. Create order with locked finance terms
    const order = new ShopOrder({
        userId: input.userId,
        productId: input.productId,
        paymentType: 'FINANCE',
        totalAmount: financeResult.totalPayable,
        downPaymentAmount: input.downPayment,
        monthlyPayment: financeResult.monthlyPayment,
        financeTermMonths: plan.termMonths,
        aprAtPurchase: plan.aprPercentage,
    });

    await order.save();
    return { order, financeResult };
}

/**
 * Get orders for a user with pagination.
 */
export async function getUserOrders(userId: string, page = 1, limit = 10) {
    await dbConnect();

    const total = await ShopOrder.countDocuments({ userId });
    const orders = await ShopOrder.find({ userId })
        .populate('productId', 'name slug category heroImage baseCashPrice')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return {
        orders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

/**
 * Get a single order by ID.
 */
export async function getOrderById(orderId: string) {
    await dbConnect();
    return ShopOrder.findById(orderId)
        .populate('productId', 'name slug category heroImage baseCashPrice')
        .populate('userId', 'firstName lastName email')
        .lean();
}

/**
 * Admin: Update order status.
 */
export async function updateOrderStatus(
    orderId: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
) {
    await dbConnect();
    return ShopOrder.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true }).lean();
}

/**
 * Admin: List all orders with filters and pagination.
 */
export async function listAllOrders(options?: {
    status?: string;
    paymentType?: string;
    page?: number;
    limit?: number;
}) {
    await dbConnect();

    const { status, paymentType, page = 1, limit = 20 } = options || {};
    const filter: Record<string, any> = {};
    if (status) filter.orderStatus = status;
    if (paymentType) filter.paymentType = paymentType;

    const total = await ShopOrder.countDocuments(filter);
    const orders = await ShopOrder.find(filter)
        .populate('productId', 'name slug category')
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return {
        orders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

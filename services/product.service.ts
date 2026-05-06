import dbConnect from '@/lib/mongodb';
import ShopProduct, { IShopProduct } from '@/models/ShopProduct';
import VehicleDetails from '@/models/VehicleDetails';
import EnergyDetails from '@/models/EnergyDetails';
import FinancePlan from '@/models/FinancePlan';

// ─── Product Service ────────────────────────────────────────────────────

/**
 * List all active shop products with optional category filter and pagination.
 */
export async function listProducts(options?: {
    category?: 'VEHICLE' | 'ENERGY';
    page?: number;
    limit?: number;
}) {
    await dbConnect();

    const { category, page = 1, limit = 20 } = options || {};
    const filter: Record<string, any> = { isActive: true };
    if (category) filter.category = category;

    const total = await ShopProduct.countDocuments(filter);
    const products = await ShopProduct.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get a single product by slug with its associated details.
 */
export async function getProductBySlug(slug: string) {
    await dbConnect();

    const product = await ShopProduct.findOne({ slug, isActive: true }).lean();
    if (!product) return null;

    let details = null;
    let financePlans: any[] = [];

    if (product.category === 'VEHICLE') {
        details = await VehicleDetails.findOne({ productId: product._id }).lean();
    } else if (product.category === 'ENERGY') {
        details = await EnergyDetails.findOne({ productId: product._id }).lean();
    }

    // Fetch finance plans for both categories
    financePlans = await FinancePlan.find({
        productId: product._id,
        isActive: true,
    }).lean();

    return {
        ...product,
        details,
        financePlans,
    };
}

/**
 * Get product by ID.
 */
export async function getProductById(productId: string) {
    await dbConnect();
    return ShopProduct.findById(productId).lean();
}

/**
 * Admin: Create a new shop product.
 */
export async function createProduct(data: Partial<IShopProduct>) {
    await dbConnect();
    const product = new ShopProduct(data);
    await product.save();
    return product;
}

/**
 * Admin: Update a shop product.
 */
export async function updateProduct(productId: string, data: Partial<IShopProduct>) {
    await dbConnect();
    return ShopProduct.findByIdAndUpdate(productId, data, { new: true }).lean();
}

/**
 * Admin: Soft-deactivate a product.
 */
export async function deactivateProduct(productId: string) {
    await dbConnect();
    return ShopProduct.findByIdAndUpdate(productId, { isActive: false }, { new: true }).lean();
}

"use server";

import dbConnect from "@/lib/mongodb";
import ShopProduct from "@/models/ShopProduct";
import VehicleDetails from "@/models/VehicleDetails";
import EnergyDetails from "@/models/EnergyDetails";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function createProduct(data: {
    name: string;
    slug: string;
    category: "VEHICLE" | "ENERGY";
    description: string;
    baseCashPrice: number;
    heroImage: string;
    gallery?: string[];
    // Vehicle-specific
    rangeMiles?: number;
    topSpeed?: string;
    zeroToSixty?: string;
    variants?: { name: string; cashPrice: number; financePrice: number }[];
    financeEligible?: boolean;
    minimumDownPayment?: number;
    shippingFee?: number;
    // Energy-specific
    energyType?: "SOLAR" | "POWERWALL";
    capacityInfo?: string;
    installationRequired?: boolean;
}) {
    try {
        await dbConnect();

        const existing = await ShopProduct.findOne({ slug: data.slug });
        if (existing) return { success: false, error: "A product with this slug already exists." };

        // Validate variants for both categories
        if (!data.variants || data.variants.length === 0) {
            return { success: false, error: "At least one variant is required." };
        }
        for (const v of data.variants) {
            if (!v.name || v.cashPrice <= 0 || v.financePrice <= 0) {
                return { success: false, error: "Each variant requires a name, cash price, and finance price." };
            }
        }

        // Finance validation for both categories
        if (data.financeEligible && (!data.minimumDownPayment || data.minimumDownPayment <= 0)) {
            return { success: false, error: "Down payment price is required when finance is enabled." };
        }

        const product = await ShopProduct.create({
            name: data.name,
            slug: data.slug,
            category: data.category,
            description: data.description,
            baseCashPrice: data.variants?.length
                ? Math.min(...data.variants.map(v => v.cashPrice))
                : data.baseCashPrice,
            heroImage: data.heroImage || (data.gallery && data.gallery.length > 0 ? data.gallery[0] : ""),
            gallery: data.gallery || [],
            isActive: true,
        });

        if (data.category === "VEHICLE") {
            await VehicleDetails.create({
                productId: product._id,
                rangeMiles: data.rangeMiles || 0,
                topSpeed: data.topSpeed || "",
                zeroToSixty: data.zeroToSixty || "",
                variants: data.variants,
                availableColors: [],
                financeEligible: data.financeEligible ?? true,
                minimumDownPayment: data.financeEligible ? data.minimumDownPayment : 0,
                shippingFee: data.shippingFee ?? 500,
            });
        } else {
            await EnergyDetails.create({
                productId: product._id,
                energyType: data.energyType || "SOLAR",
                capacityInfo: data.capacityInfo || "",
                variants: data.variants,
                financeEligible: data.financeEligible ?? false,
                minimumDownPayment: data.financeEligible ? data.minimumDownPayment : 0,
                installationRequired: data.installationRequired ?? true,
            });
        }

        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteProduct(productId: string) {
    try {
        await dbConnect();
        await VehicleDetails.deleteMany({ productId });
        await EnergyDetails.deleteMany({ productId });
        await ShopProduct.findByIdAndDelete(productId);
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleProductActive(productId: string, isActive: boolean) {
    try {
        await dbConnect();
        await ShopProduct.findByIdAndUpdate(productId, { isActive });
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getProductDetails(productId: string) {
    try {
        await dbConnect();
        const product = await ShopProduct.findById(productId).lean();
        if (!product) return { success: false, error: "Product not found." };

        // Cast string to ObjectId for the findOne query
        const objId = new mongoose.Types.ObjectId(productId);

        let details: any = null;
        if ((product as any).category === "VEHICLE") {
            details = await VehicleDetails.findOne({ productId: objId }).lean();
        } else {
            details = await EnergyDetails.findOne({ productId: objId }).lean();
        }

        // Explicitly serialize details to avoid ObjectId serialization issues
        let serializedDetails: any = null;
        if (details) {
            const d = details as any;
            serializedDetails = {
                variants: (d.variants || []).map((v: any) => ({
                    name: String(v.name || ""),
                    cashPrice: v.cashPrice != null ? Number(v.cashPrice) : 0,
                    financePrice: v.financePrice != null ? Number(v.financePrice) : 0,
                })),
                financeEligible: Boolean(d.financeEligible),
                minimumDownPayment: d.minimumDownPayment != null ? Number(d.minimumDownPayment) : 0,
            };
            // Vehicle-specific
            if ((product as any).category === "VEHICLE") {
                serializedDetails.rangeMiles = d.rangeMiles != null ? Number(d.rangeMiles) : 0;
                serializedDetails.topSpeed = String(d.topSpeed || "");
                serializedDetails.zeroToSixty = String(d.zeroToSixty || "");
                serializedDetails.shippingFee = d.shippingFee != null ? Number(d.shippingFee) : 500;
            }
            // Energy-specific
            if ((product as any).category === "ENERGY") {
                serializedDetails.energyType = String(d.energyType || "SOLAR");
                serializedDetails.capacityInfo = String(d.capacityInfo || "");
                serializedDetails.installationRequired = d.installationRequired !== false;
            }
        }

        const result = {
            success: true,
            product: {
                _id: (product as any)._id.toString(),
                name: (product as any).name,
                slug: (product as any).slug,
                category: (product as any).category,
                description: (product as any).description || "",
                baseCashPrice: (product as any).baseCashPrice,
                heroImage: (product as any).heroImage || "",
                gallery: (product as any).gallery || [],
                isActive: (product as any).isActive,
            },
            details: serializedDetails,
        };
        return result;
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProduct(productId: string, data: {
    name: string;
    slug: string;
    description: string;
    heroImage: string;
    gallery?: string[];
    variants?: { name: string; cashPrice: number; financePrice: number }[];
    financeEligible?: boolean;
    minimumDownPayment?: number;
    shippingFee?: number;
    // Vehicle-specific
    rangeMiles?: number;
    topSpeed?: string;
    zeroToSixty?: string;
    // Energy-specific
    energyType?: "SOLAR" | "POWERWALL";
    capacityInfo?: string;
    installationRequired?: boolean;
}) {
    try {
        await dbConnect();

        const product = await ShopProduct.findById(productId);
        if (!product) return { success: false, error: "Product not found." };

        // Validate variants
        if (!data.variants || data.variants.length === 0) {
            return { success: false, error: "At least one variant is required." };
        }
        for (const v of data.variants) {
            if (!v.name || v.cashPrice <= 0 || v.financePrice <= 0) {
                return { success: false, error: "Each variant requires a name, cash price, and finance price." };
            }
        }
        if (data.financeEligible && (!data.minimumDownPayment || data.minimumDownPayment <= 0)) {
            return { success: false, error: "Down payment price is required when finance is enabled." };
        }

        // Check slug uniqueness (ignoring self)
        const slugConflict = await ShopProduct.findOne({ slug: data.slug, _id: { $ne: productId } });
        if (slugConflict) return { success: false, error: "A product with this slug already exists." };

        // Update ShopProduct
        await ShopProduct.findByIdAndUpdate(productId, {
            name: data.name,
            slug: data.slug,
            description: data.description,
            baseCashPrice: Math.min(...data.variants.map(v => v.cashPrice)),
            heroImage: data.heroImage || (data.gallery && data.gallery.length > 0 ? data.gallery[0] : ""),
            gallery: data.gallery || [],
        });

        // Update category-specific details
        const objId = new mongoose.Types.ObjectId(productId);
        if (product.category === "VEHICLE") {
            await VehicleDetails.findOneAndUpdate({ productId: objId }, {
                rangeMiles: data.rangeMiles || 0,
                topSpeed: data.topSpeed || "",
                zeroToSixty: data.zeroToSixty || "",
                variants: data.variants,
                financeEligible: data.financeEligible ?? true,
                minimumDownPayment: data.financeEligible ? data.minimumDownPayment : 0,
                shippingFee: data.shippingFee ?? 500,
            });
        } else {
            await EnergyDetails.findOneAndUpdate({ productId: objId }, {
                energyType: data.energyType || "SOLAR",
                capacityInfo: data.capacityInfo || "",
                variants: data.variants,
                financeEligible: data.financeEligible ?? false,
                minimumDownPayment: data.financeEligible ? data.minimumDownPayment : 0,
                installationRequired: data.installationRequired ?? true,
            });
        }

        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

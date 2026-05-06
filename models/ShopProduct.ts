import mongoose, { Schema, Document } from 'mongoose';

// ─── Base Product ───────────────────────────────────────────────────────
export interface IShopProduct extends Document {
    name: string;
    slug: string;
    category: 'VEHICLE' | 'ENERGY';
    description: string;
    baseCashPrice: number;
    heroImage: string;
    gallery: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ShopProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        category: {
            type: String,
            enum: ['VEHICLE', 'ENERGY'],
            required: true,
        },
        description: { type: String, default: '' },
        baseCashPrice: { type: Number, required: true },
        heroImage: { type: String, default: '' },
        gallery: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Indexes for performance
ShopProductSchema.index({ slug: 1 });
ShopProductSchema.index({ category: 1, isActive: 1 });

const ShopProduct =
    mongoose.models.ShopProduct ||
    mongoose.model<IShopProduct>('ShopProduct', ShopProductSchema);

export default ShopProduct;

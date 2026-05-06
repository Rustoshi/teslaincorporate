import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct {
    _id: mongoose.Types.ObjectId;
    sku: string;
    model: string;
    description: string;
    color: string;
    price: number;
    status: 'In Stock' | 'Reserved' | 'Sold Out';
    images: string[];
    features: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        sku: { type: String, required: true, unique: true },
        model: { type: String, required: true },
        description: { type: String, required: false },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ['In Stock', 'Reserved', 'Sold Out'],
            default: 'In Stock'
        },
        images: [{ type: String }],
        features: [{ type: String }]
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

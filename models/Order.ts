import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    orderId: string;
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    amount: number;
    status: 'Pending' | 'Processing' | 'Awaiting Payment' | 'Shipped' | 'Delivered' | 'Cancelled';
    shippingAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        orderId: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Awaiting Payment', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        shippingAddress: { type: String, required: false }
    },
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

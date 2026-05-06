import mongoose, { Schema, Document, Types } from 'mongoose';
import {
    type TrackingStatus,
    TRACKING_STATUS_ORDER,
    TRACKING_STATUS_META,
} from '@/lib/tracking-constants';

// Re-export so server-only code that imports from this model still works
export type { TrackingStatus };
export { TRACKING_STATUS_ORDER, TRACKING_STATUS_META };

// ─── Sub-document Interfaces ─────────────────────────────────────────────────

export interface IShipmentLocation {
    name: string;
    address?: string;
}

export interface ITrackingEvent {
    _id?: Types.ObjectId;
    status: TrackingStatus;
    title: string;
    description: string;
    location: string;
    timestamp: Date;
    postedBy?: string;
}

// ─── Main Document Interface ──────────────────────────────────────────────────

export interface IVehicleShipment extends Document {
    orderId: Types.ObjectId;
    trackingNumber: string;
    vin: string;
    carrier: string;
    shipmentFee: number;
    feeStatus: 'INCLUDED' | 'PENDING' | 'PAID';
    origin: IShipmentLocation;
    destination: IShipmentLocation;
    currentLocation?: IShipmentLocation;
    estimatedDelivery?: Date;
    trackingHistory: ITrackingEvent[];
    currentStatus: TrackingStatus;
    customsFeeRequired: boolean;
    customsFeeMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Sub-document Schemas ─────────────────────────────────────────────────────

const ShipmentLocationSchema = new Schema<IShipmentLocation>(
    {
        name: { type: String, required: true },
        address: { type: String },
    },
    { _id: false }
);

const TrackingEventSchema = new Schema<ITrackingEvent>(
    {
        status: { type: String, enum: TRACKING_STATUS_ORDER, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        timestamp: { type: Date, default: () => new Date() },
        postedBy: { type: String },
    },
    { _id: true, timestamps: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const VehicleShipmentSchema = new Schema<IVehicleShipment>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopOrder',
            required: true,
            unique: true,
            index: true,
        },
        trackingNumber: { type: String, required: true, unique: true, index: true },
        vin: { type: String, default: '', trim: true, uppercase: true },
        carrier: { type: String, default: 'Tesla Logistics', trim: true },
        shipmentFee: { type: Number, default: 0 },
        feeStatus: {
            type: String,
            enum: ['INCLUDED', 'PENDING', 'PAID'],
            default: 'INCLUDED',
        },
        origin: { type: ShipmentLocationSchema, required: true },
        destination: { type: ShipmentLocationSchema, required: true },
        currentLocation: { type: ShipmentLocationSchema },
        estimatedDelivery: { type: Date },
        trackingHistory: { type: [TrackingEventSchema], default: [] },
        currentStatus: {
            type: String,
            enum: TRACKING_STATUS_ORDER,
            default: 'ORDER_CONFIRMED',
            index: true,
        },
        customsFeeRequired: { type: Boolean, default: false },
        customsFeeMessage: { type: String, default: '' },
    },
    { timestamps: true }
);

VehicleShipmentSchema.index({ orderId: 1, currentStatus: 1 });

const VehicleShipment =
    mongoose.models.VehicleShipment ||
    mongoose.model<IVehicleShipment>('VehicleShipment', VehicleShipmentSchema);

export default VehicleShipment;

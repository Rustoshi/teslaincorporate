"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import VehicleShipment from "@/models/VehicleShipment";
import ShopOrder from "@/models/ShopOrder";
import { revalidatePath } from "next/cache";
import type { TrackingStatus } from "@/models/VehicleShipment";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTrackingNumber(): string {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = Date.now().toString(36).substring(-4).toUpperCase();
    return `TSL-${year}-${randomPart}${timestampPart}`;
}

function requireAdmin(role?: string): boolean {
    return role === 'super_admin' || role === 'manager' || role === 'support';
}

// ─── Create Shipment ──────────────────────────────────────────────────────────

export interface CreateShipmentPayload {
    orderId: string;
    vin: string;
    carrier: string;
    shipmentFee: number;
    feeStatus: 'INCLUDED' | 'PENDING' | 'PAID';
    originName: string;
    originAddress: string;
    estimatedDelivery?: string; // ISO date string
}

export async function createShipment(payload: CreateShipmentPayload) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        // Guard: one shipment per order
        const existing = await VehicleShipment.findOne({ orderId: payload.orderId });
        if (existing) {
            return { success: false, error: "A shipment already exists for this order." };
        }

        // Fetch the order to pull destination from shipping address
        const order = await ShopOrder.findById(payload.orderId).lean() as any;
        if (!order) return { success: false, error: "Order not found." };

        const addr = order.shippingAddress;
        const destinationAddressStr = addr
            ? [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
                .filter(Boolean).join(', ')
            : '';

        const shipment = await VehicleShipment.create({
            orderId: payload.orderId,
            trackingNumber: generateTrackingNumber(),
            vin: payload.vin,
            carrier: payload.carrier,
            shipmentFee: payload.shipmentFee,
            feeStatus: payload.feeStatus,
            origin: {
                name: payload.originName,
                address: payload.originAddress,
            },
            destination: {
                name: destinationAddressStr || 'Customer Address',
                address: destinationAddressStr,
            },
            currentLocation: {
                name: payload.originName,
                address: payload.originAddress,
            },
            estimatedDelivery: payload.estimatedDelivery
                ? new Date(payload.estimatedDelivery)
                : undefined,
            currentStatus: 'ORDER_CONFIRMED',
            trackingHistory: [
                {
                    status: 'ORDER_CONFIRMED',
                    title: 'Order Confirmed',
                    description: 'Your order has been confirmed and a shipment has been initialized.',
                    location: payload.originName,
                    timestamp: new Date(),
                    postedBy: session.user.email ?? 'Admin',
                },
            ],
        });

        // Mirror the shipment fee onto the order for convenience
        await ShopOrder.findByIdAndUpdate(payload.orderId, {
            shipmentFee: payload.shipmentFee,
            orderStatus: 'APPROVED',
        });

        revalidatePath('/admin/orders');
        revalidatePath(`/dashboard/orders`);
        return { success: true, shipmentId: shipment._id.toString(), trackingNumber: shipment.trackingNumber };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Update Shipment Details ──────────────────────────────────────────────────

export interface UpdateShipmentPayload {
    shipmentId: string;
    vin?: string;
    carrier?: string;
    shipmentFee?: number;
    feeStatus?: 'INCLUDED' | 'PENDING' | 'PAID';
    originName?: string;
    originAddress?: string;
    estimatedDelivery?: string;
    customsFeeRequired?: boolean;
    customsFeeMessage?: string;
}

export async function updateShipmentDetails(payload: UpdateShipmentPayload) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const shipment = await VehicleShipment.findById(payload.shipmentId);
        if (!shipment) return { success: false, error: "Shipment not found." };

        if (payload.vin !== undefined) shipment.vin = payload.vin;
        if (payload.carrier !== undefined) shipment.carrier = payload.carrier;
        if (payload.shipmentFee !== undefined) shipment.shipmentFee = payload.shipmentFee;
        if (payload.feeStatus !== undefined) shipment.feeStatus = payload.feeStatus;
        if (payload.customsFeeRequired !== undefined) shipment.customsFeeRequired = payload.customsFeeRequired;
        if (payload.customsFeeMessage !== undefined) shipment.customsFeeMessage = payload.customsFeeMessage;
        if (payload.estimatedDelivery !== undefined) {
            shipment.estimatedDelivery = payload.estimatedDelivery
                ? new Date(payload.estimatedDelivery)
                : undefined;
        }
        if (payload.originName !== undefined || payload.originAddress !== undefined) {
            shipment.origin = {
                name: payload.originName ?? shipment.origin.name,
                address: payload.originAddress ?? shipment.origin.address,
            };
        }

        await shipment.save();

        // Keep order's shipmentFee in sync
        if (payload.shipmentFee !== undefined) {
            await ShopOrder.findByIdAndUpdate(shipment.orderId, {
                shipmentFee: payload.shipmentFee,
            });
        }

        revalidatePath('/admin/orders');
        revalidatePath('/dashboard/orders');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Add Tracking Event ───────────────────────────────────────────────────────

export interface AddTrackingEventPayload {
    shipmentId: string;
    status: TrackingStatus;
    title: string;
    description: string;
    location: string;
    timestamp?: string; // ISO — defaults to now
}

export async function addTrackingEvent(payload: AddTrackingEventPayload) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const shipment = await VehicleShipment.findById(payload.shipmentId);
        if (!shipment) return { success: false, error: "Shipment not found." };

        const eventTimestamp = payload.timestamp
            ? new Date(payload.timestamp)
            : new Date();

        const newEvent = {
            status: payload.status,
            title: payload.title,
            description: payload.description,
            location: payload.location,
            timestamp: eventTimestamp,
            postedBy: session.user.email ?? 'Admin',
        };

        shipment.trackingHistory.push(newEvent as any);
        shipment.currentStatus = payload.status;

        // Update current location text
        shipment.currentLocation = { name: payload.location };

        await shipment.save();

        // If delivered, mark order as completed
        if (payload.status === 'DELIVERED') {
            await ShopOrder.findByIdAndUpdate(shipment.orderId, {
                orderStatus: 'COMPLETED',
            });
        }

        revalidatePath('/admin/orders');
        revalidatePath('/dashboard/orders');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Get Shipment By Order ────────────────────────────────────────────────────

export async function getShipmentByOrder(orderId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !requireAdmin(session.user.role)) {
            return { success: false, error: "Unauthorized." };
        }

        await dbConnect();

        const shipment = await VehicleShipment.findOne({ orderId }).lean() as any;
        if (!shipment) return { success: true, shipment: null };

        return {
            success: true,
            shipment: {
                _id: shipment._id.toString(),
                orderId: shipment.orderId.toString(),
                trackingNumber: shipment.trackingNumber,
                vin: shipment.vin,
                carrier: shipment.carrier,
                shipmentFee: shipment.shipmentFee,
                feeStatus: shipment.feeStatus,
                origin: { name: shipment.origin.name, address: shipment.origin.address ?? '' },
                destination: { name: shipment.destination.name, address: shipment.destination.address ?? '' },
                currentLocation: shipment.currentLocation
                    ? { name: shipment.currentLocation.name, address: shipment.currentLocation.address ?? '' }
                    : null,
                estimatedDelivery: shipment.estimatedDelivery?.toISOString() ?? null,
                currentStatus: shipment.currentStatus,
                customsFeeRequired: shipment.customsFeeRequired ?? false,
                customsFeeMessage: shipment.customsFeeMessage ?? '',
                trackingHistory: shipment.trackingHistory.map((e: any) => ({
                    _id: e._id?.toString(),
                    status: e.status,
                    title: e.title,
                    description: e.description,
                    location: e.location,
                    timestamp: e.timestamp?.toISOString(),
                    postedBy: e.postedBy,
                })),
                createdAt: shipment.createdAt?.toISOString(),
                updatedAt: shipment.updatedAt?.toISOString(),
            },
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ─── Delete Shipment ──────────────────────────────────────────────────────────

export async function deleteShipment(shipmentId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'super_admin') {
            return { success: false, error: "Only Super Admin can delete shipments." };
        }

        await dbConnect();

        const shipment = await VehicleShipment.findById(shipmentId);
        if (!shipment) return { success: false, error: "Shipment not found." };

        // Reset order shipment fee and revert to pending
        await ShopOrder.findByIdAndUpdate(shipment.orderId, {
            shipmentFee: 0,
            orderStatus: 'PENDING',
        });

        await VehicleShipment.findByIdAndDelete(shipmentId);

        revalidatePath('/admin/orders');
        revalidatePath('/dashboard/orders');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

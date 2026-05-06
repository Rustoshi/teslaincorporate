/**
 * Pure TypeScript constants for vehicle shipment tracking.
 * NO mongoose/mongodb imports — safe to use in both server and client components.
 */

export type TrackingStatus =
    | 'ORDER_CONFIRMED'
    | 'PAYMENT_VERIFIED'
    | 'MANUFACTURING'
    | 'QUALITY_CHECK'
    | 'READY_FOR_SHIPMENT'
    | 'DISPATCHED'
    | 'IN_TRANSIT'
    | 'AT_PORT'
    | 'CUSTOMS_CLEARED'
    | 'AT_DISTRIBUTION_CENTER'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED';

export const TRACKING_STATUS_ORDER: TrackingStatus[] = [
    'ORDER_CONFIRMED',
    'PAYMENT_VERIFIED',
    'MANUFACTURING',
    'QUALITY_CHECK',
    'READY_FOR_SHIPMENT',
    'DISPATCHED',
    'IN_TRANSIT',
    'AT_PORT',
    'CUSTOMS_CLEARED',
    'AT_DISTRIBUTION_CENTER',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
];

export const TRACKING_STATUS_META: Record<
    TrackingStatus,
    { label: string; description: string }
> = {
    ORDER_CONFIRMED: {
        label: 'Order Confirmed',
        description: 'Your order has been received and is being reviewed.',
    },
    PAYMENT_VERIFIED: {
        label: 'Payment Verified',
        description: 'Your payment has been verified and confirmed.',
    },
    MANUFACTURING: {
        label: 'Manufacturing',
        description: 'Your vehicle is being assembled at our Gigafactory.',
    },
    QUALITY_CHECK: {
        label: 'Quality Inspection',
        description: 'Your vehicle is undergoing final quality assurance checks.',
    },
    READY_FOR_SHIPMENT: {
        label: 'Ready for Shipment',
        description: 'Your vehicle has passed all checks and is staged for pickup.',
    },
    DISPATCHED: {
        label: 'Dispatched',
        description: 'Your vehicle has left the factory and is in the hands of our logistics partner.',
    },
    IN_TRANSIT: {
        label: 'In Transit',
        description: 'Your vehicle is actively moving toward its destination.',
    },
    AT_PORT: {
        label: 'At Port / Hub',
        description: 'Your vehicle has arrived at a transit hub or port facility.',
    },
    CUSTOMS_CLEARED: {
        label: 'Customs Cleared',
        description: 'Your vehicle has cleared all customs and regulatory requirements.',
    },
    AT_DISTRIBUTION_CENTER: {
        label: 'At Distribution Center',
        description: 'Your vehicle has arrived at the regional distribution center.',
    },
    OUT_FOR_DELIVERY: {
        label: 'Out for Delivery',
        description: 'Your vehicle is on the final delivery leg to your address.',
    },
    DELIVERED: {
        label: 'Delivered',
        description: 'Your vehicle has been successfully delivered. Welcome to the Tesla family.',
    },
};

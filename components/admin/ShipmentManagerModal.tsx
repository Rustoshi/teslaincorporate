"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Truck, MapPin, Package, Plus, Clock, CheckCircle2,
    Loader2, AlertCircle, ChevronDown, Navigation,
    Trash2, RefreshCw, DollarSign, History, AlertTriangle,
} from "lucide-react";
import {
    createShipment,
    updateShipmentDetails,
    addTrackingEvent,
    getShipmentByOrder,
    deleteShipment,
} from "@/app/admin/actions/shipment";
import {
    TRACKING_STATUS_ORDER,
    TRACKING_STATUS_META,
    type TrackingStatus,
} from "@/lib/tracking-constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShipmentData {
    _id: string;
    orderId: string;
    trackingNumber: string;
    vin: string;
    carrier: string;
    shipmentFee: number;
    feeStatus: 'INCLUDED' | 'PENDING' | 'PAID';
    origin: { name: string; address?: string };
    destination: { name: string; address?: string };
    currentLocation?: { name: string; address?: string };
    estimatedDelivery?: string;
    currentStatus: TrackingStatus;
    customsFeeRequired: boolean;
    customsFeeMessage: string;
    trackingHistory: Array<{
        _id?: string;
        status: TrackingStatus;
        title: string;
        description: string;
        location: string;
        timestamp: string;
        postedBy?: string;
    }>;
}

interface OrderInfo {
    _id: string;
    user: { name: string; email: string };
    product: { name: string; category: string };
    shippingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
}

interface Props {
    order: OrderInfo;
    onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

type ActiveTab = 'details' | 'events' | 'history';

const TABS: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'details', label: 'Shipment Details', icon: Truck },
    { id: 'events', label: 'Post Event', icon: Plus },
    { id: 'history', label: 'Timeline', icon: History },
];

const STATUS_COLORS: Record<string, string> = {
    ORDER_CONFIRMED: 'text-slate-400',
    PAYMENT_VERIFIED: 'text-blue-400',
    MANUFACTURING: 'text-yellow-400',
    QUALITY_CHECK: 'text-orange-400',
    READY_FOR_SHIPMENT: 'text-cyan-400',
    DISPATCHED: 'text-indigo-400',
    IN_TRANSIT: 'text-violet-400',
    AT_PORT: 'text-purple-400',
    CUSTOMS_CLEARED: 'text-pink-400',
    AT_DISTRIBUTION_CENTER: 'text-rose-400',
    OUT_FOR_DELIVERY: 'text-amber-400',
    DELIVERED: 'text-green-400',
};

// ─── Inline Input / Select components ─────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

function TextInput({
    value, onChange, placeholder, type = "text", className = ""
}: {
    value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; className?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-black/50 border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors ${className}`}
        />
    );
}

function NumberInput({
    value, onChange, placeholder, min, step
}: {
    value: number | string; onChange: (v: string) => void;
    placeholder?: string; min?: number; step?: number;
}) {
    return (
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            min={min}
            step={step}
            className="w-full bg-black/50 border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
        />
    );
}

function SelectInput({
    value, onChange, children
}: {
    value: string; onChange: (v: string) => void; children: React.ReactNode
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none bg-black/50 border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer pr-8"
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
        </div>
    );
}

function Textarea({
    value, onChange, placeholder, rows = 3
}: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-black/50 border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none"
        />
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShipmentManagerModal({ order, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('details');
    const [shipment, setShipment] = useState<ShipmentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // ── Details form state
    const [vin, setVin] = useState('');
    const [carrier, setCarrier] = useState('Tesla Logistics');
    const [shipmentFee, setShipmentFee] = useState('0');
    const [feeStatus, setFeeStatus] = useState<'INCLUDED' | 'PENDING' | 'PAID'>('INCLUDED');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');
    const [originName, setOriginName] = useState('Tesla Gigafactory Texas');
    const [originAddress, setOriginAddress] = useState('1 Tesla Road, Austin, TX 78725');
    const [customsFeeRequired, setCustomsFeeRequired] = useState(false);
    const [customsFeeMessage, setCustomsFeeMessage] = useState('');

    // ── Event form state
    const [eventStatus, setEventStatus] = useState<TrackingStatus>('ORDER_CONFIRMED');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventTimestamp, setEventTimestamp] = useState('');

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4500);
    };

    // Load shipment on mount
    const loadShipment = useCallback(async () => {
        setLoading(true);
        const res = await getShipmentByOrder(order._id);
        setLoading(false);
        if (res.success && res.shipment) {
            const s = res.shipment as ShipmentData;
            setShipment(s);
            setVin(s.vin || '');
            setCarrier(s.carrier || 'Tesla Logistics');
            setShipmentFee(String(s.shipmentFee || 0));
            setFeeStatus(s.feeStatus || 'INCLUDED');
            setEstimatedDelivery(s.estimatedDelivery ? s.estimatedDelivery.split('T')[0] : '');
            setOriginName(s.origin.name || '');
            setOriginAddress(s.origin.address || '');
            setCustomsFeeRequired(s.customsFeeRequired || false);
            setCustomsFeeMessage(s.customsFeeMessage || '');
        }
    }, [order._id]);

    useEffect(() => { loadShipment(); }, [loadShipment]);

    // Auto-populate event fields when status changes
    useEffect(() => {
        const meta = TRACKING_STATUS_META[eventStatus];
        if (meta) {
            setEventTitle(meta.label);
            setEventDescription(meta.description);
        }
    }, [eventStatus]);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleCreateShipment = async () => {
        if (!originName) {
            showFeedback('error', 'Origin facility name is required.');
            return;
        }
        setSaving(true);
        const res = await createShipment({
            orderId: order._id,
            vin,
            carrier,
            shipmentFee: parseFloat(shipmentFee) || 0,
            feeStatus,
            originName,
            originAddress,
            estimatedDelivery: estimatedDelivery || undefined,
        });
        setSaving(false);
        if (res.success) {
            showFeedback('success', `Shipment created. Tracking: ${res.trackingNumber}`);
            await loadShipment();
        } else {
            showFeedback('error', res.error || 'Failed to create shipment.');
        }
    };

    const handleUpdateDetails = async () => {
        if (!shipment) return;
        setSaving(true);
        const res = await updateShipmentDetails({
            shipmentId: shipment._id,
            vin,
            carrier,
            shipmentFee: parseFloat(shipmentFee) || 0,
            feeStatus,
            originName,
            originAddress,
            estimatedDelivery: estimatedDelivery || undefined,
            customsFeeRequired,
            customsFeeMessage,
        });
        setSaving(false);
        if (res.success) {
            showFeedback('success', 'Shipment details updated.');
            await loadShipment();
        } else {
            showFeedback('error', res.error || 'Update failed.');
        }
    };

    const handlePostEvent = async () => {
        if (!shipment) return;
        if (!eventTitle || !eventDescription || !eventLocation) {
            showFeedback('error', 'Title, description, and location are required.');
            return;
        }
        setSaving(true);
        const res = await addTrackingEvent({
            shipmentId: shipment._id,
            status: eventStatus,
            title: eventTitle,
            description: eventDescription,
            location: eventLocation,
            timestamp: eventTimestamp || undefined,
        });
        setSaving(false);
        if (res.success) {
            showFeedback('success', `Event "${eventTitle}" posted to timeline.`);
            setEventTimestamp('');
            await loadShipment();
            setActiveTab('history');
        } else {
            showFeedback('error', res.error || 'Failed to post event.');
        }
    };

    const handleDeleteShipment = async () => {
        if (!shipment) return;
        if (!confirm('Are you sure you want to permanently delete this shipment? The order will revert to PENDING.')) return;
        setSaving(true);
        const res = await deleteShipment(shipment._id);
        setSaving(false);
        if (res.success) {
            showFeedback('success', 'Shipment deleted. Order reverted to Pending.');
            setShipment(null);
        } else {
            showFeedback('error', res.error || 'Delete failed.');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    const destinationStr = order.shippingAddress
        ? [
            order.shippingAddress.street,
            order.shippingAddress.city,
            order.shippingAddress.state,
            order.shippingAddress.zipCode,
          ].filter(Boolean).join(', ')
        : 'No address on file';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 30, stiffness: 360 }}
                className="bg-[#0C0C0C] border border-white/[0.08] w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/[0.06] shrink-0">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-wide">Shipment Manager</h2>
                            <p className="text-[10px] text-white/40 mt-0.5">{order.product.name} · {order.user.name}</p>
                            {shipment && (
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                                        {shipment.trackingNumber}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[shipment.currentStatus]}`}>
                                        {TRACKING_STATUS_META[shipment.currentStatus]?.label}
                                    </span>
                                    {shipment.customsFeeRequired && (
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                            <AlertTriangle className="w-2.5 h-2.5" /> Customs Fee
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                        <X className="w-4 h-4 text-white/50" />
                    </button>
                </div>

                {/* Feedback Toast */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`px-5 sm:px-6 py-3 flex items-center gap-2.5 text-xs font-bold tracking-wide border-b shrink-0 ${
                                feedback.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}
                        >
                            {feedback.type === 'success'
                                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                                : <AlertCircle className="w-4 h-4 shrink-0" />}
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Destination Banner */}
                        <div className="px-5 sm:px-6 py-3 bg-white/[0.02] border-b border-white/[0.04] flex items-center gap-2 shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            <span className="text-[10px] text-white/40 truncate">
                                <span className="text-white/20 font-bold uppercase tracking-widest mr-1.5">Destination:</span>
                                {destinationStr}
                            </span>
                        </div>

                        {/* Tabs — only shown when shipment exists */}
                        {shipment && (
                            <div className="flex border-b border-white/[0.06] overflow-x-auto shrink-0">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                                                activeTab === tab.id
                                                    ? 'border-cyan-500 text-cyan-400'
                                                    : 'border-transparent text-white/30 hover:text-white/60'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">

                            {/* ── NO SHIPMENT: Create Form ── */}
                            {!shipment && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                        <Package className="w-5 h-5 text-amber-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-400 tracking-wide">No shipment initialized</p>
                                            <p className="text-[10px] text-white/40 mt-0.5">Create a shipment to enable vehicle tracking for this order.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="VIN (optional)">
                                            <TextInput value={vin} onChange={setVin} placeholder="5YJ3E1EA..." />
                                        </Field>
                                        <Field label="Carrier">
                                            <TextInput value={carrier} onChange={setCarrier} placeholder="Tesla Logistics" />
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Shipment Fee (USD)">
                                            <NumberInput value={shipmentFee} onChange={setShipmentFee} placeholder="0" min={0} step={50} />
                                        </Field>
                                        <Field label="Fee Status">
                                            <SelectInput value={feeStatus} onChange={(v) => setFeeStatus(v as any)}>
                                                <option value="INCLUDED">Included in price</option>
                                                <option value="PENDING">Pending payment</option>
                                                <option value="PAID">Paid</option>
                                            </SelectInput>
                                        </Field>
                                    </div>

                                    <Field label="Estimated Delivery">
                                        <TextInput value={estimatedDelivery} onChange={setEstimatedDelivery} type="date" />
                                    </Field>

                                    <div className="pt-2 border-t border-white/[0.05]">
                                        <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-3">Origin (Factory)</p>
                                        <div className="space-y-3">
                                            <Field label="Facility Name">
                                                <TextInput value={originName} onChange={setOriginName} placeholder="Tesla Gigafactory Texas" />
                                            </Field>
                                            <Field label="Address">
                                                <TextInput value={originAddress} onChange={setOriginAddress} placeholder="1 Tesla Road, Austin, TX 78725" />
                                            </Field>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateShipment}
                                        disabled={saving}
                                        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                                        Initialize Shipment
                                    </button>
                                </div>
                            )}

                            {/* ── TAB: Details ── */}
                            {shipment && activeTab === 'details' && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="VIN">
                                            <TextInput value={vin} onChange={setVin} placeholder="5YJ3E1EA4NF..." />
                                        </Field>
                                        <Field label="Carrier">
                                            <TextInput value={carrier} onChange={setCarrier} placeholder="Tesla Logistics" />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Shipment Fee (USD)">
                                            <NumberInput value={shipmentFee} onChange={setShipmentFee} placeholder="0" min={0} step={50} />
                                        </Field>
                                        <Field label="Fee Status">
                                            <SelectInput value={feeStatus} onChange={(v) => setFeeStatus(v as any)}>
                                                <option value="INCLUDED">Included in price</option>
                                                <option value="PENDING">Pending payment</option>
                                                <option value="PAID">Paid</option>
                                            </SelectInput>
                                        </Field>
                                    </div>

                                    <Field label="Estimated Delivery">
                                        <TextInput value={estimatedDelivery} onChange={setEstimatedDelivery} type="date" />
                                    </Field>

                                    <div className="pt-2 border-t border-white/[0.05]">
                                        <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-3">Origin</p>
                                        <div className="space-y-3">
                                            <Field label="Facility Name">
                                                <TextInput value={originName} onChange={setOriginName} />
                                            </Field>
                                            <Field label="Address">
                                                <TextInput value={originAddress} onChange={setOriginAddress} />
                                            </Field>
                                        </div>
                                    </div>

                                    {/* Destination (read-only display) */}
                                    <div className="pt-2 border-t border-white/[0.05]">
                                        <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-3">Destination (from order)</p>
                                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                                            <p className="text-xs text-white/70">{shipment.destination.name}</p>
                                        </div>
                                    </div>

                                    {/* ── Customs Fee Alert Toggle ── */}
                                    <div className="pt-2 border-t border-white/[0.05]">
                                        <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-3">Customs Fee Alert</p>
                                        <div className={`rounded-xl border p-4 space-y-4 transition-colors ${
                                            customsFeeRequired
                                                ? 'bg-amber-500/5 border-amber-500/20'
                                                : 'bg-white/[0.02] border-white/[0.06]'
                                        }`}>
                                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                                <div
                                                    onClick={() => setCustomsFeeRequired(v => !v)}
                                                    className={`mt-0.5 w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                                                        customsFeeRequired ? 'bg-amber-500' : 'bg-white/10'
                                                    }`}
                                                >
                                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                                        customsFeeRequired ? 'translate-x-4' : 'translate-x-0'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-bold tracking-wide ${customsFeeRequired ? 'text-amber-400' : 'text-white/50'}`}>
                                                        Show Customs Fee Alert to Customer
                                                    </p>
                                                    <p className="text-[10px] text-white/30 mt-0.5 leading-relaxed">
                                                        Displays a prominent notice on the customer's order page asking them to contact support regarding customs/import fees.
                                                    </p>
                                                </div>
                                            </label>

                                            {customsFeeRequired && (
                                                <div>
                                                    <label className="block text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1.5">
                                                        Custom Message (optional)
                                                    </label>
                                                    <Textarea
                                                        value={customsFeeMessage}
                                                        onChange={setCustomsFeeMessage}
                                                        placeholder="Your vehicle has arrived at customs. An import/customs fee is required before release. Please contact support to complete this payment."
                                                        rows={3}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                                        <button
                                            onClick={handleDeleteShipment}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete Shipment
                                        </button>
                                        <button
                                            onClick={handleUpdateDetails}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── TAB: Post Event ── */}
                            {shipment && activeTab === 'events' && (
                                <div className="space-y-4">
                                    <Field label="Pipeline Status">
                                        <SelectInput value={eventStatus} onChange={(v) => setEventStatus(v as TrackingStatus)}>
                                            {TRACKING_STATUS_ORDER.map((s) => (
                                                <option key={s} value={s}>
                                                    {TRACKING_STATUS_META[s].label}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </Field>

                                    <Field label="Event Title">
                                        <TextInput value={eventTitle} onChange={setEventTitle} placeholder="Vehicle Dispatched" />
                                    </Field>

                                    <Field label="Description (shown to customer)">
                                        <Textarea value={eventDescription} onChange={setEventDescription} placeholder="Your vehicle has..." rows={3} />
                                    </Field>

                                    <Field label="Location Name">
                                        <TextInput value={eventLocation} onChange={setEventLocation} placeholder="Austin, TX" />
                                    </Field>

                                    <Field label="Event Timestamp (optional, defaults to now)">
                                        <TextInput value={eventTimestamp} onChange={setEventTimestamp} type="datetime-local" />
                                    </Field>

                                    <button
                                        onClick={handlePostEvent}
                                        disabled={saving}
                                        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors mt-2"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        Post Tracking Event
                                    </button>
                                </div>
                            )}

                            {/* ── TAB: History ── */}
                            {shipment && activeTab === 'history' && (
                                <div className="space-y-1">
                                    {shipment.trackingHistory.length === 0 && (
                                        <p className="text-xs text-white/30 text-center py-8">No events yet.</p>
                                    )}
                                    {[...shipment.trackingHistory].reverse().map((event, i) => {
                                        const color = STATUS_COLORS[event.status] || 'text-white/60';
                                        return (
                                            <div key={event._id || i} className="flex gap-4 py-4 border-b border-white/[0.04] last:border-0">
                                                <div className="flex flex-col items-center shrink-0">
                                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${i === 0 ? 'bg-cyan-400' : 'bg-white/20'}`} />
                                                    {i < shipment.trackingHistory.length - 1 && (
                                                        <div className="w-px flex-1 bg-white/[0.05] mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
                                                            {event.title}
                                                        </span>
                                                        <span className="text-[9px] text-white/25 whitespace-nowrap">
                                                            {new Date(event.timestamp).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{event.description}</p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[9px] text-white/25 flex items-center gap-1">
                                                            <MapPin className="w-2.5 h-2.5" /> {event.location}
                                                        </span>
                                                        {event.postedBy && (
                                                            <span className="text-[9px] text-white/20">by {event.postedBy}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

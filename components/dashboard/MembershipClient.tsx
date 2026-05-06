"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { submitApplication, cancelApplication } from "@/app/dashboard/actions/membership";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tier {
    _id: string;
    name: string;
    slug: string;
    description: string;
    benefits: string[];
    colorFrom: string;
    colorTo: string;
    accentColor: string;
    annualFee: number;
    requirements: string;
    sortOrder: number;
}

interface ApplicationTier {
    _id: string;
    name: string;
    colorFrom: string;
    colorTo: string;
    accentColor: string;
}

interface Application {
    _id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    fullName: string;
    occupation: string;
    employerName: string;
    annualIncome: string;
    netWorth: string;
    purposeOfCard: string;
    adminNote: string;
    reviewedAt: string | null;
    createdAt: string;
    tier: ApplicationTier | null;
}

interface CardTier {
    _id: string;
    name: string;
    colorFrom: string;
    colorTo: string;
    accentColor: string;
    benefits: string[];
    annualFee: number;
}

interface Card {
    _id: string;
    cardNumber: string;
    holderName: string;
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';
    issuedAt: string;
    expiresAt: string;
    revokedReason: string | null;
    tier: CardTier | null;
}

interface CardHistoryItem {
    _id: string;
    cardNumber: string;
    holderName: string;
    status: 'REVOKED' | 'EXPIRED';
    issuedAt: string;
    expiresAt: string;
    revokedReason: string | null;
    tier: ApplicationTier | null;
}

interface Props {
    tiers: Tier[];
    application: Application | null;
    card: Card | null;
    cardHistory: CardHistoryItem[];
    userName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });
}

function formatCardNumber(cn: string) {
    return cn; // already formatted as MSPC-XXXX-XXXX-XXXX
}

// ─── Physical Card Visual ─────────────────────────────────────────────────────

function PhysicalCard({ card, compact = false }: { card: Card; compact?: boolean }) {
    const tier = card.tier;
    const gradient = tier
        ? `linear-gradient(135deg, ${tier.colorFrom} 0%, ${tier.colorTo} 100%)`
        : "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)";
    const accent = tier?.accentColor ?? '#c9a84c';
    const isRevoked = card.status === 'REVOKED';
    const isExpired = card.status === 'EXPIRED';
    const isSuspended = card.status === 'SUSPENDED';
    const expires = new Date(card.expiresAt);
    const expiresStr = `${String(expires.getMonth() + 1).padStart(2, '0')}/${String(expires.getFullYear()).slice(-2)}`;

    return (
        <div
            className={`relative rounded-2xl overflow-hidden select-none ${compact ? 'w-full max-w-[340px]' : 'w-full max-w-[400px]'} ${isRevoked || isExpired ? 'opacity-60 grayscale' : ''}`}
            style={{
                background: gradient,
                aspectRatio: '1.586 / 1',
                boxShadow: isRevoked || isExpired ? 'none' : `0 20px 60px ${accent}30, 0 4px 20px rgba(0,0,0,0.6)`,
            }}
        >
            {/* Shimmer overlay */}
            {!isRevoked && !isExpired && (
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                        backgroundSize: '200% 200%',
                    }}
                />
            )}

            {/* Status overlay for revoked/suspended */}
            {(isRevoked || isSuspended) && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="px-4 py-1.5 border-2 rotate-[-15deg] rounded"
                        style={{ borderColor: isRevoked ? '#ef4444' : '#f59e0b', color: isRevoked ? '#ef4444' : '#f59e0b' }}
                    >
                        <span className="text-base font-black tracking-[0.4em] uppercase">
                            {isRevoked ? 'Revoked' : 'Suspended'}
                        </span>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                {/* Top row */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[9px] font-black tracking-[0.35em] uppercase opacity-60" style={{ color: accent }}>
                            Tesla Inc
                        </p>
                        <p className="text-sm font-black tracking-[0.2em] uppercase text-white mt-0.5">
                            {tier?.name ?? 'Membership'}
                        </p>
                    </div>
                    {/* Chip */}
                    <div
                        className="w-8 h-6 rounded-sm opacity-80"
                        style={{ background: `linear-gradient(135deg, ${accent}80, ${accent}40)`, border: `1px solid ${accent}50` }}
                    />
                </div>

                {/* Card number */}
                <div>
                    <p
                        className="font-mono text-[11px] sm:text-xs tracking-[0.2em] font-bold opacity-90"
                        style={{ color: accent }}
                    >
                        {formatCardNumber(card.cardNumber)}
                    </p>
                </div>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[8px] opacity-40 text-white uppercase tracking-widest mb-0.5">Card Holder</p>
                        <p className="text-xs font-bold tracking-widest uppercase text-white">
                            {card.holderName}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] opacity-40 text-white uppercase tracking-widest mb-0.5">Expires</p>
                        <p className="text-xs font-bold tracking-widest text-white">{expiresStr}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Tier Card ────────────────────────────────────────────────────────────────

function TierCard({ tier, onApply }: { tier: Tier; onApply: (tier: Tier) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${tier.colorFrom} 0%, ${tier.colorTo} 100%)` }}
            onClick={() => onApply(tier)}
        >
            {/* Accent top strip */}
            <div className="h-0.5 w-full" style={{ background: tier.accentColor }} />

            <div className="p-5">
                {/* Tier name + fee */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-50 text-white mb-1">
                            Tesla Inc
                        </p>
                        <h3 className="text-base font-black tracking-[0.15em] uppercase text-white">
                            {tier.name}
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] opacity-40 text-white uppercase tracking-widest">Annual Fee</p>
                        <p className="text-sm font-black text-white" style={{ color: tier.accentColor }}>
                            {tier.annualFee === 0 ? 'Free' : `$${tier.annualFee.toLocaleString()}`}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-white/60 leading-relaxed mb-4 line-clamp-2">
                    {tier.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-1.5 mb-5">
                    {tier.benefits.slice(0, 4).map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[10px]" style={{ color: tier.accentColor }}>✓</span>
                            <span className="text-[11px] text-white/70">{b}</span>
                        </li>
                    ))}
                    {tier.benefits.length > 4 && (
                        <li className="text-[10px] text-white/40 pl-4">
                            +{tier.benefits.length - 4} more benefits
                        </li>
                    )}
                </ul>

                {/* CTA */}
                <button
                    className="w-full py-2.5 rounded-lg text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-200 hover:opacity-80"
                    style={{ background: tier.accentColor, color: '#000' }}
                    onClick={(e) => { e.stopPropagation(); onApply(tier); }}
                >
                    Apply Now
                </button>
            </div>
        </motion.div>
    );
}

// ─── Application Form Steps ───────────────────────────────────────────────────

const INCOME_OPTIONS = [
    'Under $50,000', '$50,000 – $100,000', '$100,000 – $250,000',
    '$250,000 – $500,000', '$500,000 – $1,000,000', 'Over $1,000,000',
];
const NETWORTH_OPTIONS = [
    'Under $100,000', '$100,000 – $500,000', '$500,000 – $1,000,000',
    '$1,000,000 – $5,000,000', '$5,000,000 – $10,000,000', 'Over $10,000,000',
];

interface FormState {
    fullName: string;
    occupation: string;
    employerName: string;
    annualIncome: string;
    netWorth: string;
    purposeOfCard: string;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Application['status'] }) {
    const map = {
        PENDING: { label: 'Under Review', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        APPROVED: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        CANCELLED: { label: 'Cancelled', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' },
    };
    const s = map[status] ?? map.PENDING;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${s.bg} ${s.color} ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'PENDING' ? 'animate-pulse' : ''}`}
                style={{ background: 'currentColor' }} />
            {s.label}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MembershipClient({ tiers, application, card, cardHistory, userName }: Props) {
    const [isPending, startTransition] = useTransition();

    // Apply modal state
    const [applyTier, setApplyTier] = useState<Tier | null>(null);
    const [applyStep, setApplyStep] = useState(1);
    const [form, setForm] = useState<FormState>({
        fullName: userName,
        occupation: '',
        employerName: '',
        annualIncome: '',
        netWorth: '',
        purposeOfCard: '',
    });
    const [formError, setFormError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Cancel confirm
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelError, setCancelError] = useState('');

    // Card flip
    const [cardFlipped, setCardFlipped] = useState(false);

    // Re-apply: pick a new tier
    const [showTiers, setShowTiers] = useState(false);

    const openApply = (tier: Tier) => {
        setApplyTier(tier);
        setApplyStep(1);
        setForm({ fullName: userName, occupation: '', employerName: '', annualIncome: '', netWorth: '', purposeOfCard: '' });
        setFormError('');
        setSubmitSuccess(false);
    };

    const closeApply = () => {
        setApplyTier(null);
        setApplyStep(1);
        setFormError('');
    };

    const handleFormChange = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleNextStep = () => {
        if (applyStep === 1) {
            if (!form.fullName.trim()) { setFormError('Full name is required.'); return; }
            if (!form.occupation.trim()) { setFormError('Occupation is required.'); return; }
            setFormError('');
            setApplyStep(2);
        } else if (applyStep === 2) {
            if (!form.annualIncome) { setFormError('Please select your annual income range.'); return; }
            if (!form.netWorth) { setFormError('Please select your net worth range.'); return; }
            setFormError('');
            setApplyStep(3);
        }
    };

    const handleSubmit = () => {
        if (!form.purposeOfCard.trim()) { setFormError('Please describe your purpose for applying.'); return; }
        if (!applyTier) return;
        setFormError('');
        startTransition(async () => {
            const res = await submitApplication({
                tierId: applyTier._id,
                fullName: form.fullName,
                occupation: form.occupation,
                employerName: form.employerName,
                annualIncome: form.annualIncome,
                netWorth: form.netWorth,
                purposeOfCard: form.purposeOfCard,
            });
            if (res.success) {
                setSubmitSuccess(true);
            } else {
                setFormError(res.error ?? 'Submission failed. Please try again.');
            }
        });
    };

    const handleCancel = () => {
        if (!application) return;
        startTransition(async () => {
            const res = await cancelApplication(application._id);
            if (res.success) {
                setShowCancelConfirm(false);
            } else {
                setCancelError(res.error ?? 'Failed to cancel application.');
            }
        });
    };

    // ── Derived state ──────────────────────────────────────────────────────────
    const hasActiveCard = !!card && card.status === 'ACTIVE';
    const hasPendingApp = application?.status === 'PENDING';
    const hasRejectedApp = application?.status === 'REJECTED';
    const hasCancelledApp = application?.status === 'CANCELLED';
    const noApplication = !application || hasCancelledApp;
    const canApply = !hasPendingApp && !hasActiveCard;

    // ── Active card view ───────────────────────────────────────────────────────
    if (hasActiveCard) {
        const tier = card!.tier;
        return (
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08] mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Membership Card
                    </h1>
                    <p className="text-sm text-white/40 mt-3 tracking-widest uppercase">Your exclusive Tesla Inc card</p>
                </div>

                {/* Card + QR */}
                <div className="flex flex-col items-center gap-6 mb-8">
                    {/* Flip card container */}
                    <div
                        className="relative cursor-pointer"
                        style={{ perspective: '1000px', width: '100%', maxWidth: '400px' }}
                        onClick={() => setCardFlipped(!cardFlipped)}
                    >
                        <motion.div
                            animate={{ rotateY: cardFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', aspectRatio: '1.586/1' }}
                        >
                            {/* Front */}
                            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}>
                                <PhysicalCard card={card!} />
                            </div>
                            {/* Back */}
                            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}>
                                <div
                                    className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-4 p-6"
                                    style={{
                                        background: `linear-gradient(135deg, ${tier?.colorFrom ?? '#0a0a0a'} 0%, ${tier?.colorTo ?? '#1c1c1c'} 100%)`,
                                        boxShadow: `0 20px 60px ${tier?.accentColor ?? '#c9a84c'}30`,
                                    }}
                                >
                                    <div className="bg-white p-2.5 rounded-xl">
                                        <QRCode
                                            value={card!.cardNumber}
                                            size={90}
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                            level="M"
                                        />
                                    </div>
                                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Scan to verify</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest">Tap card to flip</p>
                </div>

                {/* Card details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Card Number', value: card!.cardNumber },
                        { label: 'Holder', value: card!.holderName },
                        { label: 'Issued', value: formatDate(card!.issuedAt) },
                        { label: 'Expires', value: formatDate(card!.expiresAt) },
                    ].map((item) => (
                        <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-[11px] font-bold text-white font-mono break-all">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                {tier && tier.benefits.length > 0 && (
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 mb-6">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Member Benefits</p>
                        <ul className="grid sm:grid-cols-2 gap-2.5">
                            {tier.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"
                                        style={{ color: tier.accentColor }}>
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[12px] text-white/70">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Card history */}
                {cardHistory.length > 0 && (
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Previous Cards</p>
                        <div className="space-y-2.5">
                            {cardHistory.map((h) => (
                                <div key={h._id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                    <div>
                                        <p className="text-[11px] font-bold text-white/50 font-mono">{h.cardNumber}</p>
                                        <p className="text-[9px] text-white/25 uppercase tracking-widest mt-0.5">{h.tier?.name}</p>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${h.status === 'REVOKED' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-white/30 bg-white/5 border-white/10'}`}>
                                        {h.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Pending application view ───────────────────────────────────────────────
    if (hasPendingApp && application) {
        const appTier = application.tier;
        return (
            <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-6">
                        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Application Pending
                    </h1>
                    <p className="text-sm text-white/40 mt-3 tracking-widest uppercase">Your application is under review</p>
                </div>

                {/* Tier preview */}
                {appTier && (
                    <div
                        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${appTier.colorFrom} 0%, ${appTier.colorTo} 100%)` }}
                    >
                        <div className="h-0.5 absolute top-0 left-0 right-0" style={{ background: appTier.accentColor }} />
                        <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-50 text-white mb-1">Applied For</p>
                        <p className="text-lg font-black tracking-[0.15em] uppercase text-white">{appTier.name}</p>
                    </div>
                )}

                {/* Status card */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <StatusBadge status="PENDING" />
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            {formatDate(application.createdAt)}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        {[
                            { label: 'Full Name', value: application.fullName },
                            { label: 'Occupation', value: application.occupation },
                            { label: 'Employer', value: application.employerName || '—' },
                            { label: 'Annual Income', value: application.annualIncome },
                            { label: 'Net Worth', value: application.netWorth },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-[12px] text-white/70">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {application.purposeOfCard && (
                        <div className="mt-4 pt-4 border-t border-white/[0.04]">
                            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Purpose</p>
                            <p className="text-[12px] text-white/70 leading-relaxed">{application.purposeOfCard}</p>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-white/30 text-center mb-6">
                    Applications are typically reviewed within 1–3 business days.
                </p>

                {/* Cancel */}
                {!showCancelConfirm ? (
                    <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="w-full py-3 rounded-xl text-[11px] font-bold tracking-widest uppercase text-red-400/60 border border-red-500/15 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                    >
                        Cancel Application
                    </button>
                ) : (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                        <p className="text-sm font-bold text-white mb-2">Cancel your application?</p>
                        <p className="text-[11px] text-white/40 mb-4">You can re-apply later for any membership tier.</p>
                        {cancelError && <p className="text-[11px] text-red-400 mb-3">{cancelError}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                disabled={isPending}
                                className="flex-1 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest bg-white/[0.05] text-white/50 hover:bg-white/[0.08] transition-colors"
                            >
                                Keep Application
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isPending}
                                className="flex-1 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Rejected application view ──────────────────────────────────────────────
    if (hasRejectedApp && application) {
        const appTier = application.tier;
        return (
            <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20 mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Application Not Approved
                    </h1>
                    <p className="text-sm text-white/40 mt-3">
                        Your application for <strong className="text-white">{appTier?.name}</strong> was not approved at this time.
                    </p>
                </div>

                {application.adminNote && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5 mb-6">
                        <p className="text-[9px] font-bold text-red-400/60 uppercase tracking-widest mb-2">Review Notes</p>
                        <p className="text-sm text-white/60 leading-relaxed">{application.adminNote}</p>
                    </div>
                )}

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Reviewed</p>
                        <p className="text-xs text-white/60">{application.reviewedAt ? formatDate(application.reviewedAt) : '—'}</p>
                    </div>
                    <StatusBadge status="REJECTED" />
                </div>

                <p className="text-[11px] text-white/30 text-center mb-8">
                    You're welcome to re-apply or consider a different membership tier.
                </p>

                {!showTiers ? (
                    <button
                        onClick={() => setShowTiers(true)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold tracking-[0.2em] uppercase bg-white text-black hover:bg-white/90 transition-colors"
                    >
                        Browse Membership Tiers
                    </button>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Choose a Tier</p>
                            <button onClick={() => setShowTiers(false)} className="text-[10px] text-white/30 hover:text-white/60">Hide</button>
                        </div>
                        <div className="grid gap-4">
                            {tiers.map((t) => <TierCard key={t._id} tier={t} onApply={openApply} />)}
                        </div>
                    </>
                )}

                {/* Apply modal */}
                <ApplyModal
                    tier={applyTier}
                    step={applyStep}
                    form={form}
                    formError={formError}
                    isPending={isPending}
                    submitSuccess={submitSuccess}
                    onClose={closeApply}
                    onFormChange={handleFormChange}
                    onNextStep={handleNextStep}
                    onPrevStep={() => setApplyStep((s) => s - 1)}
                    onSubmit={handleSubmit}
                />
            </div>
        );
    }

    // ── No application / cancelled — show tiers ────────────────────────────────
    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08] mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Membership Cards
                </h1>
                <p className="text-sm text-white/40 mt-3 tracking-widest uppercase">
                    Unlock exclusive privileges with a Tesla Inc Membership Card
                </p>
            </div>

            {tiers.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-white/30 text-sm uppercase tracking-widest">No membership tiers available at this time.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tiers.map((t) => <TierCard key={t._id} tier={t} onApply={openApply} />)}
                </div>
            )}

            {/* Cancelled notice */}
            {hasCancelledApp && (
                <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <p className="text-[11px] text-white/30 uppercase tracking-widest">
                        Your previous application was cancelled. You may apply again above.
                    </p>
                </div>
            )}

            {/* Apply modal */}
            <ApplyModal
                tier={applyTier}
                step={applyStep}
                form={form}
                formError={formError}
                isPending={isPending}
                submitSuccess={submitSuccess}
                onClose={closeApply}
                onFormChange={handleFormChange}
                onNextStep={handleNextStep}
                onPrevStep={() => setApplyStep((s) => s - 1)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

// ─── Apply Modal ──────────────────────────────────────────────────────────────

interface ApplyModalProps {
    tier: Tier | null;
    step: number;
    form: FormState;
    formError: string;
    isPending: boolean;
    submitSuccess: boolean;
    onClose: () => void;
    onFormChange: (key: keyof FormState, value: string) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
    onSubmit: () => void;
}

function ApplyModal({
    tier, step, form, formError, isPending, submitSuccess,
    onClose, onFormChange, onNextStep, onPrevStep, onSubmit,
}: ApplyModalProps) {
    if (!tier) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    className="bg-[#0c0c0c] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Tier header */}
                    <div
                        className="relative p-5 pt-6"
                        style={{ background: `linear-gradient(135deg, ${tier.colorFrom}90 0%, ${tier.colorTo}80 100%)` }}
                    >
                        <div className="h-0.5 absolute top-0 left-0 right-0 rounded-t-3xl" style={{ background: tier.accentColor }} />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-50 text-white mb-0.5">Applying For</p>
                                <p className="text-base font-black tracking-[0.1em] uppercase text-white">{tier.name}</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Step indicator */}
                        {!submitSuccess && (
                            <div className="flex items-center gap-2 mt-4">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300"
                                            style={{
                                                background: step >= s ? tier.accentColor : 'rgba(255,255,255,0.1)',
                                                color: step >= s ? '#000' : 'rgba(255,255,255,0.3)',
                                            }}
                                        >
                                            {s}
                                        </div>
                                        {s < 3 && <div className="flex-1 h-px w-8" style={{ background: step > s ? tier.accentColor : 'rgba(255,255,255,0.1)' }} />}
                                    </div>
                                ))}
                                <span className="text-[9px] text-white/40 uppercase tracking-widest ml-2">
                                    Step {step} of 3
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-5 pb-28 sm:pb-6">
                        {/* Success state */}
                        {submitSuccess ? (
                            <div className="py-8 text-center">
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                                    style={{ background: `${tier.accentColor}20`, border: `2px solid ${tier.accentColor}40` }}
                                >
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: tier.accentColor }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black tracking-widest uppercase text-white mb-2">Application Submitted</h3>
                                <p className="text-sm text-white/40 mb-6">
                                    We've received your application for the <strong className="text-white">{tier.name}</strong> card. You'll hear from us within 1–3 business days.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-black"
                                    style={{ background: tier.accentColor }}
                                >
                                    Done
                                </button>
                            </div>
                        ) : step === 1 ? (
                            /* Step 1: Personal info */
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Personal Information</h3>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        value={form.fullName}
                                        onChange={(e) => onFormChange('fullName', e.target.value)}
                                        placeholder="As it should appear on the card"
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">Occupation *</label>
                                    <input
                                        type="text"
                                        value={form.occupation}
                                        onChange={(e) => onFormChange('occupation', e.target.value)}
                                        placeholder="Your current profession"
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">Employer / Company</label>
                                    <input
                                        type="text"
                                        value={form.employerName}
                                        onChange={(e) => onFormChange('employerName', e.target.value)}
                                        placeholder="Optional"
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                                    />
                                </div>

                                {formError && <p className="text-[11px] text-red-400">{formError}</p>}

                                <button
                                    onClick={onNextStep}
                                    className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest text-black mt-2"
                                    style={{ background: tier.accentColor }}
                                >
                                    Continue
                                </button>
                            </div>
                        ) : step === 2 ? (
                            /* Step 2: Financial info */
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Financial Profile</h3>
                                <p className="text-[11px] text-white/30 mb-4">This information is used for verification purposes and is kept strictly confidential.</p>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">Annual Income *</label>
                                    <select
                                        value={form.annualIncome}
                                        onChange={(e) => onFormChange('annualIncome', e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/20 transition-colors appearance-none"
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="" className="bg-[#0c0c0c] text-white/40">Select range</option>
                                        {INCOME_OPTIONS.map((o) => (
                                            <option key={o} value={o} className="bg-[#0c0c0c] text-white">{o}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">Net Worth *</label>
                                    <select
                                        value={form.netWorth}
                                        onChange={(e) => onFormChange('netWorth', e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/20 transition-colors appearance-none"
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="" className="bg-[#0c0c0c] text-white/40">Select range</option>
                                        {NETWORTH_OPTIONS.map((o) => (
                                            <option key={o} value={o} className="bg-[#0c0c0c] text-white">{o}</option>
                                        ))}
                                    </select>
                                </div>

                                {formError && <p className="text-[11px] text-red-400">{formError}</p>}

                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={onPrevStep}
                                        className="flex-1 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-white/[0.05] text-white/50 hover:bg-white/[0.08] transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={onNextStep}
                                        className="flex-1 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest text-black"
                                        style={{ background: tier.accentColor }}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Step 3: Purpose */
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Purpose & Intent</h3>

                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
                                        Why are you applying for this membership card? *
                                    </label>
                                    <textarea
                                        value={form.purposeOfCard}
                                        onChange={(e) => onFormChange('purposeOfCard', e.target.value)}
                                        placeholder="Describe how you plan to use the membership card and what benefits you're looking for..."
                                        rows={5}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors resize-none"
                                    />
                                </div>

                                {/* Summary */}
                                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 space-y-2">
                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Application Summary</p>
                                    {[
                                        { label: 'Name', value: form.fullName },
                                        { label: 'Occupation', value: form.occupation },
                                        { label: 'Income', value: form.annualIncome },
                                        { label: 'Net Worth', value: form.netWorth },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between">
                                            <span className="text-[10px] text-white/30">{item.label}</span>
                                            <span className="text-[10px] text-white/60 font-medium">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {formError && <p className="text-[11px] text-red-400">{formError}</p>}

                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={onPrevStep}
                                        disabled={isPending}
                                        className="flex-1 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-white/[0.05] text-white/50 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={onSubmit}
                                        disabled={isPending}
                                        className="flex-1 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest text-black disabled:opacity-50 transition-opacity"
                                        style={{ background: tier.accentColor }}
                                    >
                                        {isPending ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

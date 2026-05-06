"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, Plus, X, CheckCircle2, XCircle, Clock, Search,
    ChevronDown, Loader2, AlertCircle, Trash2, Pencil, ToggleLeft,
    ToggleRight, Users, Award, Shield, RefreshCw,
} from "lucide-react";
import {
    createTier, updateTier, toggleTierActive, deleteTier, reviewApplication, revokeCard,
} from "@/app/admin/actions/membership";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SerializedTier {
    _id: string; name: string; slug: string; description: string;
    benefits: string[]; colorFrom: string; colorTo: string; accentColor: string;
    annualFee: number; requirements: string; sortOrder: number; isActive: boolean;
    createdAt: string;
}

interface SerializedApplication {
    _id: string;
    user: { _id: string; name: string; email: string };
    tier: { _id: string; name: string; colorFrom: string; colorTo: string; accentColor: string };
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    fullName: string; occupation: string; employerName: string;
    annualIncome: string; netWorth: string; purposeOfCard: string;
    adminNote: string; reviewedBy: string; reviewedAt: string | null;
    createdAt: string;
}

interface SerializedCard {
    _id: string; cardNumber: string; holderName: string; status: string;
    tierName: string; issuedAt: string; expiresAt: string;
}

interface Props {
    initialApplications: SerializedApplication[];
    initialTiers: SerializedTier[];
    initialCards: SerializedCard[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    APPROVED: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' },
    REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
    CANCELLED: { label: 'Cancelled', color: 'text-white/30', bg: 'bg-white/5', border: 'border-white/10', dot: 'bg-white/30' },
};

const INCOME_OPTIONS = ['Under $25,000', '$25,000 – $50,000', '$50,000 – $100,000', '$100,000 – $250,000', '$250,000 – $500,000', '$500,000+'];
const NW_OPTIONS = ['Under $50,000', '$50,000 – $250,000', '$250,000 – $1M', '$1M – $5M', '$5M – $25M', '$25M+'];

const DEFAULT_TIER_FORM = {
    name: '', slug: '', description: '', colorFrom: '#0a0a0a', colorTo: '#1c1c1c',
    accentColor: '#c9a84c', annualFee: '0', requirements: '', sortOrder: '10', isActive: true,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MembershipsClient({ initialApplications, initialTiers, initialCards }: Props) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'applications' | 'tiers'>('applications');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // ── Applications state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [reviewModal, setReviewModal] = useState<SerializedApplication | null>(null);
    const [decision, setDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    // ── Tier state
    const [tierModal, setTierModal] = useState<'create' | 'edit' | null>(null);
    const [editingTier, setEditingTier] = useState<SerializedTier | null>(null);
    const [tierForm, setTierForm] = useState(DEFAULT_TIER_FORM);
    const [benefits, setBenefits] = useState<string[]>(['']);
    const [savingTier, setSavingTier] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const showFeedback = (type: 'success' | 'error', msg: string) => {
        setFeedback({ type, message: msg });
        setTimeout(() => setFeedback(null), 4000);
    };

    // ── Stats
    const pendingCount = initialApplications.filter(a => a.status === 'PENDING').length;
    const approvedCount = initialApplications.filter(a => a.status === 'APPROVED').length;
    const activeCards = initialCards.filter(c => c.status === 'ACTIVE').length;

    // ── Filtered applications
    const filteredApps = useMemo(() => {
        return initialApplications.filter(a => {
            const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
            const q = search.toLowerCase();
            const matchSearch = !q || a.user.name.toLowerCase().includes(q) || a.user.email.toLowerCase().includes(q) || a.tier.name.toLowerCase().includes(q) || a.fullName.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [initialApplications, search, statusFilter]);

    // ── Handlers: Applications
    const openReview = (app: SerializedApplication) => {
        setReviewModal(app);
        setDecision('APPROVED');
        setAdminNote('');
    };

    const handleReview = async () => {
        if (!reviewModal) return;
        setProcessing(true);
        const res = await reviewApplication(reviewModal._id, decision, adminNote || undefined);
        setProcessing(false);
        if (res.success) {
            showFeedback('success', `Application ${decision === 'APPROVED' ? 'approved — card issued' : 'rejected'}.`);
            setReviewModal(null);
            router.refresh();
        } else {
            showFeedback('error', res.error || 'Action failed.');
        }
    };

    // ── Handlers: Tiers
    const openCreate = () => {
        setTierForm(DEFAULT_TIER_FORM);
        setBenefits(['']);
        setEditingTier(null);
        setTierModal('create');
    };

    const openEdit = (tier: SerializedTier) => {
        setEditingTier(tier);
        setTierForm({
            name: tier.name, slug: tier.slug, description: tier.description,
            colorFrom: tier.colorFrom, colorTo: tier.colorTo, accentColor: tier.accentColor,
            annualFee: String(tier.annualFee), requirements: tier.requirements,
            sortOrder: String(tier.sortOrder), isActive: tier.isActive,
        } as any);
        setBenefits(tier.benefits.length > 0 ? tier.benefits : ['']);
        setTierModal('edit');
    };

    const handleSaveTier = async () => {
        if (!tierForm.name.trim() || !tierForm.slug.trim()) {
            showFeedback('error', 'Name and slug are required.');
            return;
        }
        setSavingTier(true);
        const payload = {
            name: tierForm.name.trim(),
            slug: tierForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
            description: tierForm.description,
            benefits: benefits.filter(b => b.trim()),
            colorFrom: tierForm.colorFrom,
            colorTo: tierForm.colorTo,
            accentColor: tierForm.accentColor,
            annualFee: parseFloat(tierForm.annualFee) || 0,
            requirements: tierForm.requirements,
            sortOrder: parseInt(tierForm.sortOrder) || 10,
            isActive: tierForm.isActive,
        };
        const res = tierModal === 'edit' && editingTier
            ? await updateTier(editingTier._id, payload)
            : await createTier(payload);
        setSavingTier(false);
        if (res.success) {
            showFeedback('success', `Tier ${tierModal === 'edit' ? 'updated' : 'created'} successfully.`);
            setTierModal(null);
            router.refresh();
        } else {
            showFeedback('error', res.error || 'Failed to save tier.');
        }
    };

    const handleToggle = async (tierId: string, current: boolean) => {
        setTogglingId(tierId);
        await toggleTierActive(tierId, !current);
        setTogglingId(null);
        router.refresh();
    };

    const handleDelete = async (tierId: string) => {
        if (!confirm('Delete this tier? This cannot be undone.')) return;
        setDeletingId(tierId);
        const res = await deleteTier(tierId);
        setDeletingId(null);
        if (res.success) {
            showFeedback('success', 'Tier deleted.');
            router.refresh();
        } else {
            showFeedback('error', res.error || 'Delete failed.');
        }
    };

    const inputCls = "w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors";
    const labelCls = "block text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1.5";

    // ─── RENDER ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Memberships
                    </h1>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Manage card tiers and member applications
                    </p>
                </div>
                {activeTab === 'tiers' && (
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Tier
                    </button>
                )}
            </div>

            {/* Global Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                    >
                        {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Apps', value: initialApplications.length, color: 'text-white', bg: 'bg-white/[0.02] border-white/[0.06]' },
                    { label: 'Pending', value: pendingCount, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/15' },
                    { label: 'Approved', value: approvedCount, color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/15' },
                    { label: 'Active Cards', value: activeCards, color: 'text-cyan-400', bg: 'bg-cyan-500/5 border-cyan-500/15' },
                ].map(stat => (
                    <div key={stat.label} className={`border rounded-xl p-4 text-center ${stat.bg}`}>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]">
                {(['applications', 'tiers'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-red-500 text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}
                    >
                        {tab === 'applications' ? 'Applications' : 'Manage Tiers'}
                    </button>
                ))}
            </div>

            {/* ── APPLICATIONS TAB ── */}
            {activeTab === 'applications' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search applicant, email, tier..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${statusFilter === s ? 'bg-white/10 text-white' : 'bg-white/[0.02] text-white/30 hover:text-white/60 border border-white/[0.06]'}`}
                                >
                                    {s === 'ALL' ? 'All' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
                                    {s === 'PENDING' && pendingCount > 0 && (
                                        <span className="ml-1.5 bg-amber-500 text-black text-[8px] px-1.5 py-0.5 rounded-full font-black">{pendingCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredApps.length === 0 ? (
                        <div className="text-center py-16 text-white/20">
                            <CreditCard className="w-10 h-10 mx-auto mb-3" />
                            <p className="text-sm font-bold uppercase tracking-widest">No applications found</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden md:block bg-[#0A0A0A] border border-white/[0.06] rounded-2xl overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/[0.06]">
                                            {['Applicant', 'Tier', 'Name on Card', 'Status', 'Date', 'Action'].map(h => (
                                                <th key={h} className="text-left text-[9px] font-bold text-white/30 tracking-widest uppercase px-5 py-4">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApps.map(app => {
                                            const sc = STATUS_CONFIG[app.status];
                                            return (
                                                <tr key={app._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-bold text-white">{app.user.name}</p>
                                                        <p className="text-[10px] text-white/30">{app.user.email}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ background: app.tier.accentColor }} />
                                                            <span className="text-xs font-bold text-white/70">{app.tier.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-xs text-white/60">{app.fullName}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${sc.bg} ${sc.color} ${sc.border}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                            {sc.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-[10px] text-white/30">{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <button
                                                            onClick={() => openReview(app)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/[0.08] rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors"
                                                        >
                                                            <Search className="w-3 h-3" /> Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="md:hidden space-y-3">
                                {filteredApps.map(app => {
                                    const sc = STATUS_CONFIG[app.status];
                                    return (
                                        <div key={app._id} className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-4">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <p className="text-sm font-bold text-white">{app.user.name}</p>
                                                    <p className="text-[10px] text-white/30">{app.user.email}</p>
                                                </div>
                                                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${sc.bg} ${sc.color} ${sc.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: app.tier.accentColor }} />
                                                <span className="text-[10px] font-bold text-white/50">{app.tier.name}</span>
                                                <span className="text-white/20">·</span>
                                                <span className="text-[10px] text-white/30">{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <button
                                                onClick={() => openReview(app)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white/60 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors"
                                            >
                                                <Search className="w-3.5 h-3.5" /> Review Application
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── TIERS TAB ── */}
            {activeTab === 'tiers' && (
                <div>
                    {initialTiers.length === 0 ? (
                        <div className="text-center py-16 text-white/20">
                            <Award className="w-10 h-10 mx-auto mb-3" />
                            <p className="text-sm font-bold uppercase tracking-widest">No tiers yet</p>
                            <p className="text-xs mt-2">Create your first membership tier</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {initialTiers.map(tier => (
                                <div key={tier._id} className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl overflow-hidden">
                                    {/* Card preview strip */}
                                    <div
                                        className="h-20 relative overflow-hidden"
                                        style={{ background: `linear-gradient(135deg, ${tier.colorFrom}, ${tier.colorTo})` }}
                                    >
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                        <div className="absolute bottom-3 left-4">
                                            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: tier.accentColor }}>{tier.name}</p>
                                        </div>
                                        <div
                                            className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${tier.isActive ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-white/30 bg-white/5 border-white/10'}`}
                                        >
                                            {tier.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <p className="text-xs font-bold text-white">{tier.name}</p>
                                            <p className="text-[10px] text-white/40 mt-0.5">{tier.description || 'No description'}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-white/30">{tier.benefits.length} benefits</span>
                                            <span className="text-white/50 font-bold">{tier.annualFee > 0 ? `$${tier.annualFee}/yr` : 'Free'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
                                            <button onClick={() => openEdit(tier)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors">
                                                <Pencil className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggle(tier._id, tier.isActive)}
                                                disabled={togglingId === tier._id}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                                            >
                                                {togglingId === tier._id ? <Loader2 className="w-3 h-3 animate-spin" /> : tier.isActive ? <ToggleRight className="w-3.5 h-3.5 text-green-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                                {tier.isActive ? 'Disable' : 'Enable'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tier._id)}
                                                disabled={deletingId === tier._id}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === tier._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Review Modal ── */}
            <AnimatePresence>
                {reviewModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        onClick={() => setReviewModal(null)}
                    >
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
                            className="bg-[#0C0C0C] border border-white/[0.08] w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between p-5 border-b border-white/[0.06] shrink-0">
                                <div>
                                    <h2 className="text-sm font-bold text-white tracking-wide">Review Application</h2>
                                    <p className="text-[10px] text-white/30 mt-0.5">{reviewModal.user.name} · {reviewModal.tier.name}</p>
                                </div>
                                <button onClick={() => setReviewModal(null)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                                    <X className="w-4 h-4 text-white/50" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                {/* Applicant info */}
                                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
                                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Applicant</p>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        {[
                                            { l: 'Full Name', v: reviewModal.fullName },
                                            { l: 'Account', v: reviewModal.user.name },
                                            { l: 'Email', v: reviewModal.user.email },
                                            { l: 'Occupation', v: reviewModal.occupation || '—' },
                                            { l: 'Employer', v: reviewModal.employerName || '—' },
                                            { l: 'Annual Income', v: reviewModal.annualIncome || '—' },
                                            { l: 'Net Worth', v: reviewModal.netWorth || '—' },
                                        ].map(({ l, v }) => (
                                            <div key={l}>
                                                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">{l}</p>
                                                <p className="text-white/70 font-bold">{v}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Purpose */}
                                {reviewModal.purposeOfCard && (
                                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-2">Purpose of Application</p>
                                        <p className="text-xs text-white/60 leading-relaxed">{reviewModal.purposeOfCard}</p>
                                    </div>
                                )}

                                {/* Tier preview */}
                                <div className="h-14 rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${reviewModal.tier.colorFrom}, ${reviewModal.tier.colorTo})` }}>
                                    <div className="h-full flex items-center px-5">
                                        <p className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: reviewModal.tier.accentColor }}>{reviewModal.tier.name}</p>
                                    </div>
                                </div>

                                {/* Decision — only show for PENDING */}
                                {reviewModal.status === 'PENDING' ? (
                                    <>
                                        <div>
                                            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-2">Decision</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setDecision('APPROVED')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-colors ${decision === 'APPROVED' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/60'}`}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => setDecision('REJECTED')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-colors ${decision === 'REJECTED' ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/60'}`}
                                                >
                                                    <XCircle className="w-4 h-4" /> Reject
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelCls}>{decision === 'REJECTED' ? 'Rejection Reason *' : 'Admin Note (optional)'}</label>
                                            <textarea
                                                value={adminNote}
                                                onChange={e => setAdminNote(e.target.value)}
                                                rows={3}
                                                placeholder={decision === 'REJECTED' ? 'Explain why the application was not approved...' : 'Optional internal note...'}
                                                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={handleReview}
                                            disabled={processing || (decision === 'REJECTED' && !adminNote.trim())}
                                            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${decision === 'APPROVED' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                                        >
                                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : decision === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {processing ? 'Processing...' : decision === 'APPROVED' ? 'Approve & Issue Card' : 'Reject Application'}
                                        </button>
                                    </>
                                ) : (
                                    <div className={`p-4 rounded-xl border ${STATUS_CONFIG[reviewModal.status].bg} ${STATUS_CONFIG[reviewModal.status].border}`}>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${STATUS_CONFIG[reviewModal.status].color}`}>
                                            Application {STATUS_CONFIG[reviewModal.status].label}
                                        </p>
                                        {reviewModal.adminNote && (
                                            <p className="text-xs text-white/50 mt-2 leading-relaxed">{reviewModal.adminNote}</p>
                                        )}
                                        {reviewModal.reviewedBy && (
                                            <p className="text-[9px] text-white/25 mt-1">Reviewed by {reviewModal.reviewedBy}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Tier Create/Edit Modal ── */}
            <AnimatePresence>
                {tierModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        onClick={() => setTierModal(null)}
                    >
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
                            className="bg-[#0C0C0C] border border-white/[0.08] w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
                                <h2 className="text-sm font-bold text-white tracking-wide">{tierModal === 'edit' ? 'Edit Tier' : 'Create New Tier'}</h2>
                                <button onClick={() => setTierModal(null)} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                                    <X className="w-4 h-4 text-white/50" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                {/* Live preview */}
                                <div className="h-16 rounded-xl overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${tierForm.colorFrom}, ${tierForm.colorTo})` }}>
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '14px 14px' }} />
                                    <div className="absolute inset-0 flex items-center px-5">
                                        <p className="text-base font-black tracking-[0.25em] uppercase" style={{ color: tierForm.accentColor }}>
                                            {tierForm.name || 'Tier Preview'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Tier Name *</label>
                                        <input type="text" value={tierForm.name} onChange={e => setTierForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} className={inputCls} placeholder="Black Card" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Slug (URL key) *</label>
                                        <input type="text" value={tierForm.slug} onChange={e => setTierForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} placeholder="black-card" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Description</label>
                                    <input type="text" value={tierForm.description} onChange={e => setTierForm(f => ({ ...f, description: e.target.value }))} className={inputCls} placeholder="For elite members with exceptional portfolios" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>Color From</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={tierForm.colorFrom} onChange={e => setTierForm(f => ({ ...f, colorFrom: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                                            <input type="text" value={tierForm.colorFrom} onChange={e => setTierForm(f => ({ ...f, colorFrom: e.target.value }))} className={`${inputCls} flex-1`} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Color To</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={tierForm.colorTo} onChange={e => setTierForm(f => ({ ...f, colorTo: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                                            <input type="text" value={tierForm.colorTo} onChange={e => setTierForm(f => ({ ...f, colorTo: e.target.value }))} className={`${inputCls} flex-1`} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Accent Color</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={tierForm.accentColor} onChange={e => setTierForm(f => ({ ...f, accentColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                                            <input type="text" value={tierForm.accentColor} onChange={e => setTierForm(f => ({ ...f, accentColor: e.target.value }))} className={`${inputCls} flex-1`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Annual Fee (USD)</label>
                                        <input type="number" value={tierForm.annualFee} onChange={e => setTierForm(f => ({ ...f, annualFee: e.target.value }))} className={inputCls} placeholder="0" min={0} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Sort Order (1 = top)</label>
                                        <input type="number" value={tierForm.sortOrder} onChange={e => setTierForm(f => ({ ...f, sortOrder: e.target.value }))} className={inputCls} placeholder="10" min={1} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Requirements</label>
                                    <input type="text" value={tierForm.requirements} onChange={e => setTierForm(f => ({ ...f, requirements: e.target.value }))} className={inputCls} placeholder="Minimum $500,000 portfolio value" />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className={labelCls}>Benefits</label>
                                        <button type="button" onClick={() => setBenefits(b => [...b, ''])} className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {benefits.map((b, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={b}
                                                    onChange={e => setBenefits(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                                                    className={inputCls}
                                                    placeholder={`Benefit ${i + 1}`}
                                                />
                                                <button type="button" onClick={() => setBenefits(prev => prev.filter((_, j) => j !== i))} disabled={benefits.length <= 1} className="p-3 rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 transition-colors">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={tierForm.isActive} onChange={e => setTierForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-red-500" />
                                    <span className="text-sm text-white/60">Active (visible to users)</span>
                                </label>

                                <button
                                    onClick={handleSaveTier}
                                    disabled={savingTier}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors"
                                >
                                    {savingTier ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    {tierModal === 'edit' ? 'Save Changes' : 'Create Tier'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

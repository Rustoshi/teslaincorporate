"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToPlan } from "@/app/dashboard/actions/subscribe";
import { ChevronRight, ArrowRight, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface SubscribeClientProps {
    plans: any[];
    userBalance: number;
    currency: string;
}

export default function SubscribeClient({ plans, userBalance, currency }: SubscribeClientProps) {
    const router = useRouter();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const activePlan = plans.find(p => p._id === selectedPlanId);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('planId', selectedPlanId as string);
        formData.append('amount', amount);

        const res = await subscribeToPlan(formData);

        if (res.success) {
            setFeedback({ type: 'success', message: 'Successfully subscribed to the plan!' });
            // Optionally redirect to "My Plans" after a short delay
            setTimeout(() => {
                router.push('/dashboard/plans');
            }, 2000);
        } else {
            setFeedback({ type: 'error', message: res.error || 'Failed to subscribe.' });
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-widest text-white uppercase font-montserrat flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-red-500" />
                    Available Plans
                </h2>
                <p className="text-xs text-white/40 tracking-wider mt-1">Select a portfolio strategy to grow your assets.</p>
            </div>

            {/* Balance Widget */}
            <div className="bg-[#050505] border border-white/[0.05] rounded-2xl p-6 relative overflow-hidden flex justify-between items-center group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-red-500/10 transition-all duration-700" />
                <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Available Balance</div>
                    <div className="text-2xl font-mono text-white tracking-tight">{currency}{userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                </div>
            </div>

            {/* Feedback Banner */}
            {feedback && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} animate-in fade-in zoom-in-95`}>
                    {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="text-sm tracking-wide">{feedback.message}</p>
                </div>
            )}

            {/* Main Layout Grid */}
            <div className={`grid gap-8 ${selectedPlanId ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

                {/* Plans List */}
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1 mb-4">Available Plans</h3>
                    {plans.length === 0 ? (
                        <div className="p-8 text-center border border-white/[0.05] border-dashed rounded-2xl bg-white/[0.01]">
                            <p className="text-sm text-white/40 uppercase tracking-widest">No investment plans are currently available.</p>
                        </div>
                    ) : (
                        plans.map((plan) => (
                            <button
                                key={plan._id}
                                onClick={() => { setSelectedPlanId(plan._id); setFeedback(null); }}
                                className={`w-full text-left relative overflow-hidden rounded-2xl border transition-all duration-300 p-6 ${selectedPlanId === plan._id
                                    ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)] scale-[1.02]'
                                    : 'bg-[#050505] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold tracking-widest uppercase text-white">{plan.name}</h4>
                                            {plan.badge && (
                                                <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-red-500/20">
                                                    {plan.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-white/40 tracking-wide line-clamp-2 pr-8">{plan.description}</div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedPlanId === plan._id ? 'bg-red-500 text-white' : 'bg-white/[0.05] text-white/30'}`}>
                                        <ChevronRight className="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>

                                <div className="relative z-10 grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/[0.05]">
                                    <div>
                                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Target Return</div>
                                        <div className="text-sm font-bold text-green-400 font-mono">
                                            {plan.returnLow}%{plan.returnHigh ? ` - ${plan.returnHigh}%` : ''} <span className="text-[10px] text-white/50 ml-2 font-sans uppercase tracking-wider">{currency}{plan.capitalRange}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Contract Cycle</div>
                                        <div className="text-sm font-bold text-white font-mono">{plan.cycle}</div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Subscription Form */}
                {selectedPlanId && activePlan && (
                    <>
                        {/* ── Mobile: half-sheet modal ── */}
                        <div className="lg:hidden fixed inset-0 z-[9999] flex items-end animate-in fade-in duration-200">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedPlanId(null)} />

                            <form
                                onSubmit={handleSubscribe}
                                className="relative w-full bg-[#111] border-t border-white/[0.1] rounded-t-3xl shadow-2xl px-6 pt-6 pb-28 space-y-6 animate-in slide-in-from-bottom-4 duration-300"
                            >
                                {/* Drag handle */}
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />

                                {/* Plan name + close */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-0.5">Allocate Capital</p>
                                        <h4 className="text-base font-bold tracking-widest text-white uppercase">{activePlan.name}</h4>
                                        <p className="text-[10px] text-white/30 tracking-wider mt-0.5">{activePlan.capitalRange}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlanId(null)}
                                        className="w-8 h-8 flex items-center justify-center bg-white/[0.06] rounded-full text-white/40 hover:text-white transition-colors"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Amount input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                                        <span>Amount ({currency})</span>
                                        <span className="text-red-400 font-mono normal-case">{currency}{userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        min="1"
                                        step="0.01"
                                        max={userBalance}
                                        placeholder="Enter amount"
                                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-4 text-lg font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                    <p className="text-[10px] text-white/25 text-right">Deducted from available balance</p>
                                </div>

                                {/* Submit */}
                                <button
                                    disabled={loading || userBalance <= 0}
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shadow-lg shadow-red-500/20"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm &amp; Subscribe <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        </div>

                        {/* ── Desktop: sticky side panel ── */}
                        <div className="hidden lg:block">
                            <form
                                onSubmit={handleSubscribe}
                                className="bg-[#050505] sticky top-24 border border-white/[0.08] rounded-2xl shadow-2xl"
                            >
                                <div className="p-5 border-b border-white/[0.08] bg-white/[0.02] rounded-t-2xl flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-red-400">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Allocate Capital</span>
                                        </div>
                                        <h4 className="text-lg font-bold tracking-widest text-white uppercase">{activePlan.name}</h4>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Required: {activePlan.capitalRange}</p>
                                    </div>
                                </div>
                                <div className="p-5 border-b border-white/[0.08]">
                                    <h5 className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-bold">Plan Highlights</h5>
                                    <ul className="space-y-2.5">
                                        {activePlan.features.map((feature: any, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-white/60 tracking-wide">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-5 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/50 flex justify-between">
                                        <span>Investment Amount ({currency})</span>
                                        <span className="text-red-400 font-mono">{currency}{userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        min="1"
                                        step="0.01"
                                        max={userBalance}
                                        placeholder="Enter amount"
                                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-4 text-lg font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 transition-colors shadow-inner"
                                    />
                                    <p className="text-[10px] text-white/30 text-right">Deducted from Available Balance</p>
                                </div>
                                <div className="p-5 pt-0">
                                    <button
                                        disabled={loading || userBalance <= 0}
                                        type="submit"
                                        className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shadow-lg shadow-red-500/20"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm &amp; Subscribe <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

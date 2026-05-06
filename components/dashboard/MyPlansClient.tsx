"use client";

import { TrendingUp, ShieldCheck, Activity, Clock, Award, Sparkles, ChevronRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface MyPlansClientProps {
    plans: any[];
    totalInvested: number;
    totalProfit: number;
    currency: string;
}

export default function MyPlansClient({ plans, totalInvested, totalProfit, currency }: MyPlansClientProps) {
    const activePlans = plans.filter(p => p.status === 'active');
    const pastPlans = plans.filter(p => p.status !== 'active');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-widest text-white uppercase font-montserrat flex items-center gap-3">
                    <Activity className="w-5 h-5 text-red-500" />
                    My Portfolio
                </h2>
                <p className="text-xs text-white/40 tracking-wider mt-1">Monitor your active algorithmic positions and returns.</p>
            </div>

            {/* Portfolio Summary Widgets */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#050505] border border-white/[0.05] rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700" />
                    <div className="relative z-10">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1 flex items-center justify-between">
                            Total Invested
                            <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
                        </div>
                        <div className="text-xl sm:text-2xl font-mono text-white tracking-tight">{currency}{totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <div className="bg-[#050505] border border-white/[0.05] rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-all duration-700" />
                    <div className="relative z-10">
                        <div className="text-[10px] uppercase tracking-widest text-green-400/50 font-bold mb-1 flex items-center justify-between">
                            Total Profits
                            <TrendingUp className="w-3.5 h-3.5 text-green-400/50" />
                        </div>
                        <div className="text-xl sm:text-2xl font-mono text-green-400 tracking-tight">+{currency}{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {/* Active Plans List */}
            <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Active Positions ({activePlans.length})
                </h3>

                {activePlans.length === 0 ? (
                    <div className="p-8 text-center border border-white/[0.05] border-dashed rounded-2xl bg-[#050505]">
                        <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-5 h-5 text-white/20" />
                        </div>
                        <p className="text-sm text-white/40 uppercase tracking-widest mb-4">No active positions.</p>
                        <Link
                            href="/dashboard/subscribe"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                        >
                            Deploy Capital <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {activePlans.map((plan) => (
                            <div key={plan._id} className="bg-[#050505] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-6 transition-all duration-300 shadow-xl group relative overflow-hidden flex flex-col h-full">
                                {/* Subtle glowing gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1 flex items-center gap-1.5">
                                            <Award className="w-3 h-3" />
                                            Active
                                        </div>
                                        <h4 className="font-bold tracking-widest uppercase text-white line-clamp-1 pr-2">{plan.name}</h4>
                                    </div>
                                    <div className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded border border-red-500/20 whitespace-nowrap">
                                        {plan.cycle}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div>
                                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Capital Invested</div>
                                        <div className="text-sm font-mono text-white">{currency}{plan.capital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-5 border-t border-white/[0.05]">
                                    <div className="flex justify-between items-center bg-green-500/5 border border-green-500/10 rounded-xl p-3">
                                        <span className="text-[10px] uppercase tracking-widest text-green-400/70 font-bold flex items-center gap-1.5">
                                            <BarChart3 className="w-3.5 h-3.5" /> Live PNL
                                        </span>
                                        <span className="text-sm font-mono text-green-400 font-bold">
                                            +{currency}{(plan.currentPnL || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1.5 text-[9px] text-white/30 uppercase tracking-widest font-mono">
                                        <Clock className="w-3 h-3" />
                                        Deployed: {plan.createdAt ? formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true }) : 'Unknown'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Plans List (Optional / Future expansion proof) */}
            {pastPlans.length > 0 && (
                <div className="space-y-4 pt-8">
                    <h3 className="text-xs uppercase tracking-widest text-white/30 font-bold">Past Positions</h3>
                    <div className="space-y-2">
                        {pastPlans.map((plan) => (
                            <div key={plan._id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between opacity-70">
                                <div>
                                    <h4 className="text-xs font-bold tracking-widest uppercase text-white/60">{plan.name}</h4>
                                    <div className="text-[10px] font-mono text-white/40 mt-1">
                                        Cap: {currency}{plan.capital.toLocaleString()} | PNL: +{currency}{(plan.currentPnL || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-white/40">
                                    {plan.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

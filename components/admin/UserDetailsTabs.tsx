"use client";

import { useState } from "react";
import { User as UserIcon, Wallet, Activity, Contact, CheckCircle2, AlertCircle, Loader2, Save, X, Ban, Mail, Globe } from "lucide-react";
import { updateUserDetails, processDeposit, processProfit, manageUserPlan, updateKycStatus, postProjectStakeProfit } from "@/app/admin/actions/users";
import { countries } from "@/lib/countries";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserDetailsTabs({ user, userPlans = [], systemPlans = [], projectStakes = [] }: { user: any, userPlans?: any[], systemPlans?: any[], projectStakes?: any[] }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'edit' | 'deposit' | 'plans' | 'projects' | 'kyc'>('edit');
    const [loadingTab, setLoadingTab] = useState<string | null>(null);
    const [transactionType, setTransactionType] = useState<'deposit' | 'profit'>('deposit');
    const [planAction, setPlanAction] = useState<'subscribe' | 'unsubscribe'>('subscribe');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Handlers
    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingTab('edit');
        const formData = new FormData(e.currentTarget);
        await updateUserDetails(user._id, formData);
        setLoadingTab(null);
        router.refresh();
    };

    const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingTab('deposit');
        setFeedback(null);
        const formData = new FormData(e.currentTarget);
        const res = await processDeposit(user._id, formData);
        setLoadingTab(null);

        if (res?.success) {
            setFeedback({ type: 'success', message: 'Deposit processed successfully.' });
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } else {
            setFeedback({ type: 'error', message: res?.error || 'Failed to process deposit.' });
        }
    };

    const handleProfit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingTab('profit');
        setFeedback(null);
        const formData = new FormData(e.currentTarget);
        const res = await processProfit(user._id, formData);
        setLoadingTab(null);

        if (res?.success) {
            setFeedback({ type: 'success', message: 'Profit added successfully.' });
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } else {
            setFeedback({ type: 'error', message: res?.error || 'Failed to add profit.' });
        }
    };

    const handleProjectProfit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingTab('projects');
        setFeedback(null);
        const formData = new FormData(e.currentTarget);
        const res = await postProjectStakeProfit(user._id, formData);
        setLoadingTab(null);

        if (res?.success) {
            setFeedback({ type: 'success', message: 'Profit posted to project stake successfully.' });
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } else {
            setFeedback({ type: 'error', message: res?.error || 'Failed to post profit.' });
        }
    };

    const handlePlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingTab('plans');
        setFeedback(null);
        const formData = new FormData(e.currentTarget);
        const res = await manageUserPlan(user._id, formData);
        setLoadingTab(null);

        if (res?.success) {
            setFeedback({ type: 'success', message: 'Plan subscription updated successfully.' });
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } else {
            setFeedback({ type: 'error', message: res?.error || 'Failed to update plan.' });
        }
    };

    const renderTabButton = (id: 'edit' | 'deposit' | 'plans' | 'projects' | 'kyc', label: string, Icon: any) => (
        <button
            onClick={() => { setActiveTab(id); setFeedback(null); }}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === id
                ? 'border-red-500 text-red-500 bg-red-500/5'
                : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                }`}
        >
            <Icon className="w-4 h-4" /> {label}
        </button>
    );

    return (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden mt-8">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-white/[0.08] bg-black/40">
                {renderTabButton('edit', 'Edit User', UserIcon)}
                {renderTabButton('deposit', 'Deposit', Wallet)}
                {renderTabButton('plans', 'Plans', Activity)}
                {renderTabButton('projects', 'Projects', Globe)}
                {renderTabButton('kyc', 'KYC Docs', Contact)}
            </div>

            {/* Tab Content Area */}
            <div className="p-6 md:p-8">

                {/* EDIT USER */}
                {activeTab === 'edit' && (
                    <form onSubmit={handleUpdateUser} className="space-y-6 max-w-4xl animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Column 1: Personal Details & Security */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70">Personal Data</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">First Name <span className="text-red-500">*</span></label>
                                            <input name="firstName" type="text" defaultValue={user.firstName} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Last Name <span className="text-red-500">*</span></label>
                                            <input name="lastName" type="text" defaultValue={user.lastName} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Email Address <span className="text-red-500">*</span></label>
                                        <input name="email" type="email" defaultValue={user.email} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Phone Number <span className="text-red-500">*</span></label>
                                        <input name="phone" type="text" defaultValue={user.phone} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Country <span className="text-red-500">*</span></label>
                                        <select name="country" defaultValue={user.country} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none">
                                            <option value="" disabled>Select Country</option>
                                            {countries.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 pt-4 border-t border-white/5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            User Password <span className="text-red-500">*</span>
                                            <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded ml-auto">PLAIN TEXT VISIBLE</span>
                                        </label>
                                        <input name="password" type="text" defaultValue={user.password} required className="w-full bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Account Status <span className="text-red-500">*</span></label>
                                            <select name="accountStatus" defaultValue={user.accountStatus || 'active'} className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none">
                                                <option value="active">Active</option>
                                                <option value="suspended">Suspended</option>
                                                <option value="blocked">Blocked</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">KYC Status</label>
                                            <select name="kycStatus" defaultValue={user.kycStatus || 'unverified'} className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none">
                                                <option value="unverified">Unverified</option>
                                                <option value="pending">Pending Review</option>
                                                <option value="verified">Verified</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Account Configuration */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70">Configuration Limits</h3>

                                <div className="space-y-4">
                                    <div className="bg-black/30 border border-white/[0.05] rounded-xl p-5 mb-6">
                                        <div className="text-[10px] tracking-widest uppercase text-white/40 mb-3">Total Balance Overview</div>
                                        <div className="text-2xl font-bold font-mono text-white mb-1">${(user.totalBalance || 0).toLocaleString()}</div>
                                        <div className="text-xs text-white/30 truncate">Target artificial inflation via Deposit Tab.</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Tier Level</label>
                                            <input name="tierLevel" type="number" defaultValue={user.tierLevel || 1} min="1" max="3" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1">
                                                Withdrawal Pin
                                                <span className="text-[8px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded ml-auto">PLAIN TEXT</span>
                                            </label>
                                            <input name="withdrawalPin" type="number" defaultValue={user.withdrawalPin} placeholder="e.g. 1234" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Withdrawal Fee ($)</label>
                                            <input name="withdrawalFee" type="number" defaultValue={user.withdrawalFee || 0} min="0" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Upgrade Fee ($)</label>
                                        <input name="upgradeFee" type="number" defaultValue={user.upgradeFee || 0} min="0" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Signal Fee ($)</label>
                                        <input name="signalFee" type="number" defaultValue={user.signalFee || 0} min="0" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/[0.05] flex gap-4 pr-2">
                            <button disabled={loadingTab === 'edit'} type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-8 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors">
                                {loadingTab === 'edit' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Update User Profile
                            </button>
                        </div>
                    </form>
                )}

                {/* TRANSACTIONS */}
                {activeTab === 'deposit' && (
                    <div className="animate-in fade-in duration-300 max-w-xl">
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => { setTransactionType('deposit'); setFeedback(null); }}
                                className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors ${transactionType === 'deposit' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/70'}`}
                            >
                                Deposit (Balance)
                            </button>
                            <button
                                onClick={() => { setTransactionType('profit'); setFeedback(null); }}
                                className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors ${transactionType === 'profit' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/70'}`}
                            >
                                Profit (Balance + Plan)
                            </button>
                        </div>

                        {feedback && (
                            <div className={`p-4 mb-6 rounded-xl border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} animate-in fade-in slide-in-from-top-2`}>
                                {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm tracking-wide">{feedback.message}</p>
                            </div>
                        )}

                        {transactionType === 'deposit' ? (
                            <form onSubmit={handleDeposit} className="space-y-5 bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70">Deposit Transaction</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Adds to user's Total Balance and creates a new Deposit history record.</p>

                                <div className="space-y-1.5 pt-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40">Amount ($)</label>
                                    <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                </div>

                                <button disabled={loadingTab === 'deposit'} type="submit" className="w-full flex justify-center items-center gap-2 bg-white hover:bg-white/90 disabled:opacity-50 text-black px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors mt-2">
                                    {loadingTab === 'deposit' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Process Transaction'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleProfit} className="space-y-5 bg-green-500/5 border border-green-500/10 p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-green-400">Profit Transaction</h3>
                                <p className="text-[10px] text-green-400/50 uppercase tracking-widest leading-relaxed">Adds to user's Total Profit, Total Balance, logs a Profit history record, and increments their Plan's PNL.</p>

                                <div className="space-y-1.5 pt-2">
                                    <label className="text-[10px] uppercase tracking-widest text-green-400/50">Select Target Plan</label>
                                    {userPlans && userPlans.length > 0 ? (
                                        <select name="userPlanId" required className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors appearance-none">
                                            <option value="">-- Choose Plan --</option>
                                            {userPlans.map((plan: any) => (
                                                <option key={plan._id} value={plan._id}>{plan.name} (Active: ${plan.capital?.toLocaleString()})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-xs text-red-500 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> User does not have any active plans.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest text-green-400/50">Profit Amount ($)</label>
                                    <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00" className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-green-500/50 transition-colors disabled:opacity-50" disabled={!userPlans || userPlans.length === 0} />
                                </div>

                                <button disabled={loadingTab === 'profit' || !userPlans || userPlans.length === 0} type="submit" className="w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors mt-2">
                                    {loadingTab === 'profit' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Profit'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* PLANS MANAGEMENT */}
                {activeTab === 'plans' && (
                    <div className="animate-in fade-in duration-300 max-w-xl">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 mb-2">Active Plans Overview</h3>
                                {userPlans && userPlans.length > 0 ? (
                                    <div className="space-y-2 mt-4">
                                        {userPlans.map((plan: any) => (
                                            <div key={plan._id} className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-white/[0.05]">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                    <div>
                                                        <div className="text-xs font-bold uppercase tracking-widest text-white">{plan.name}</div>
                                                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{plan.cycle} Cycle / Target {plan.target}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-mono text-white">${plan.capital?.toLocaleString()}</div>
                                                    <div className="text-[10px] text-green-400 font-mono">+{plan.currentPnL?.toLocaleString()} PNL</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-white/50 mt-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-widest">No Active Plans</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6 pt-6 border-t border-white/[0.05]">
                            <button
                                onClick={() => { setPlanAction('subscribe'); setFeedback(null); }}
                                className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors ${planAction === 'subscribe' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/70'}`}
                            >
                                Subscribe User
                            </button>
                            <button
                                onClick={() => { setPlanAction('unsubscribe'); setFeedback(null); }}
                                className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors ${planAction === 'unsubscribe' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/70'}`}
                            >
                                Unsubscribe
                            </button>
                        </div>

                        {feedback && (
                            <div className={`p-4 mb-6 rounded-xl border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} animate-in fade-in slide-in-from-top-2`}>
                                {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm tracking-wide">{feedback.message}</p>
                            </div>
                        )}

                        {planAction === 'subscribe' ? (
                            <form onSubmit={handlePlan} className="space-y-5 bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                <input type="hidden" name="action" value="subscribe" />

                                <div className="space-y-1.5 pt-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40">Select Available Plan</label>
                                    {systemPlans && systemPlans.length > 0 ? (
                                        <select name="planId" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none">
                                            <option value="">-- Choose Plan --</option>
                                            {systemPlans.map((plan: any) => (
                                                <option key={plan._id} value={plan._id}>{plan.name} (Range: {plan.capitalRange})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-xs text-red-500 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> No system plans available. Create one in Settings.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center justify-between">
                                        <span>Investment Amount ($)</span>
                                        <span className="text-[8px] text-white/30">User Bal: ${user.totalBalance?.toLocaleString() || 0}</span>
                                    </label>
                                    <input name="investedAmount" type="number" min="0" required placeholder="0" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-red-500/50 transition-colors" disabled={!systemPlans || systemPlans.length === 0} />
                                    <span className="text-[10px] text-white/30 truncate pl-1">This WILL deduct from their Total Balance directly.</span>
                                </div>

                                <button disabled={loadingTab === 'plans' || !systemPlans || systemPlans.length === 0} type="submit" className="w-full flex justify-center items-center gap-2 bg-white hover:bg-white/90 disabled:opacity-50 text-black px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors mt-2">
                                    {loadingTab === 'plans' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Subscription'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePlan} className="space-y-5 bg-red-500/5 border border-red-500/10 p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                <input type="hidden" name="action" value="unsubscribe" />

                                <div className="space-y-1.5 pt-2">
                                    <label className="text-[10px] uppercase tracking-widest text-red-400/50">Select Active User Plan to Cancel</label>
                                    {userPlans && userPlans.length > 0 ? (
                                        <select name="planId" required className="w-full bg-black/50 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none">
                                            <option value="">-- Choose User Plan --</option>
                                            {userPlans.map((plan: any) => (
                                                <option key={plan._id} value={plan._id}>{plan.name} (Capital: ${plan.capital?.toLocaleString()})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-xs text-white/40 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> User has no active plans to unsubscribe from.
                                        </div>
                                    )}
                                </div>

                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3 mt-4">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-red-200 uppercase tracking-widest leading-relaxed">
                                        Unsubscribing a user will refund their initial capital back to their Total Balance, subtract it from Total Invested, and remove the localized accrued PNL from their Total Profit.
                                    </p>
                                </div>

                                <button disabled={loadingTab === 'plans' || !userPlans || userPlans.length === 0} type="submit" className="w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors mt-2">
                                    {loadingTab === 'plans' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Unsubscribe Action'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* PROJECTS */}
                {activeTab === 'projects' && (
                    <div className="animate-in fade-in duration-300 max-w-xl">
                        {/* Active stakes overview */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 mb-4">Active Project Stakes</h3>
                            {projectStakes.length > 0 ? (
                                <div className="space-y-2">
                                    {projectStakes.map((stake: any) => (
                                        <div key={stake._id} className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-white/[0.05]">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-2 h-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: stake.heroBgColor }}
                                                />
                                                <div>
                                                    <div className="text-xs font-bold uppercase tracking-widest text-white">{stake.projectName}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">
                                                        {stake.trancheName} · {stake.yieldLow}%{stake.yieldHigh ? `–${stake.yieldHigh}%` : '+'} yield
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-mono text-white">${stake.investedAmount?.toLocaleString()}</div>
                                                <div className="text-[10px] text-green-400 font-mono">+${stake.currentPnL?.toLocaleString()} P&L</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-white/50">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-widest">No Active Project Stakes</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-white/[0.05]">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-green-400 mb-1">Post Project Profit</h3>
                            <p className="text-[10px] text-green-400/50 uppercase tracking-widest leading-relaxed mb-6">
                                Credits the selected stake's P&L and current value, adds to user's Total Balance and Total Profit, and logs a Profit transaction.
                            </p>

                            {feedback && (
                                <div className={`p-4 mb-6 rounded-xl border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} animate-in fade-in slide-in-from-top-2`}>
                                    {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                    <p className="text-sm tracking-wide">{feedback.message}</p>
                                </div>
                            )}

                            <form onSubmit={handleProjectProfit} className="space-y-5 bg-green-500/5 border border-green-500/10 p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest text-green-400/50">Select Target Stake</label>
                                    {projectStakes.length > 0 ? (
                                        <select name="stakeId" required className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors appearance-none">
                                            <option value="">-- Choose Stake --</option>
                                            {projectStakes.map((stake: any) => (
                                                <option key={stake._id} value={stake._id}>
                                                    {stake.projectName} — {stake.trancheName} (Invested: ${stake.investedAmount?.toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-xs text-red-500 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> User has no active project stakes.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest text-green-400/50">Profit Amount ($)</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        disabled={projectStakes.length === 0}
                                        className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-green-500/50 transition-colors disabled:opacity-50"
                                    />
                                </div>

                                <button
                                    disabled={loadingTab === 'projects' || projectStakes.length === 0}
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors mt-2"
                                >
                                    {loadingTab === 'projects' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Project Profit'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* KYC DOCS */}
                {activeTab === 'kyc' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70">Identity Documents</h3>
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${user.kycStatus === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                user.kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                    'bg-white/10 text-white/50 border border-white/20'
                                }`}>
                                STATUS: {user.kycStatus || 'UNVERIFIED'}
                            </span>
                        </div>

                        {(!user.kycFrontImage && !user.kycBackImage) ? (
                            <div className="p-12 text-center border border-white/[0.05] border-dashed rounded-xl bg-white/[0.01]">
                                <Ban className="w-8 h-8 text-white/20 mx-auto mb-4" />
                                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">No KYC Documents Uploaded</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {[
                                        { key: 'kycFrontImage', label: 'ID Card (Front)' },
                                        { key: 'kycBackImage', label: 'ID Card (Back)' }
                                    ].map((doc) => {
                                        const src = user[doc.key as keyof typeof user];
                                        if (!src) return null;
                                        return (
                                            <div key={doc.key} className="bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden group">
                                                <div className="p-3 border-b border-white/[0.05] bg-black/40">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">{doc.label}</h4>
                                                </div>
                                                <div className="aspect-[4/3] w-full relative bg-black/80 flex items-center justify-center p-4">
                                                    <Image
                                                        src={src}
                                                        alt={doc.label}
                                                        fill
                                                        className="object-contain p-2 opacity-80 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                                <div className="p-3 border-t border-white/[0.05] bg-black/40">
                                                    <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors py-1">
                                                        Open Original File
                                                    </a>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Approve / Reject Buttons */}
                                {user.kycStatus === 'pending' && (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={async () => {
                                                setLoadingTab('kyc');
                                                const result = await updateKycStatus(user._id, 'verified');
                                                setLoadingTab(null);
                                                if (result.success) {
                                                    setFeedback({ type: 'success', message: 'KYC has been approved.' });
                                                    router.refresh();
                                                } else {
                                                    setFeedback({ type: 'error', message: result.error || 'Failed to approve.' });
                                                }
                                            }}
                                            disabled={loadingTab === 'kyc'}
                                            className="flex-1 flex justify-center items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
                                        >
                                            {loadingTab === 'kyc' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Approve KYC
                                        </button>
                                        <button
                                            onClick={async () => {
                                                setLoadingTab('kyc');
                                                const result = await updateKycStatus(user._id, 'unverified');
                                                setLoadingTab(null);
                                                if (result.success) {
                                                    setFeedback({ type: 'success', message: 'KYC has been rejected. Documents cleared.' });
                                                    router.refresh();
                                                } else {
                                                    setFeedback({ type: 'error', message: result.error || 'Failed to reject.' });
                                                }
                                            }}
                                            disabled={loadingTab === 'kyc'}
                                            className="flex-1 flex justify-center items-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
                                        >
                                            {loadingTab === 'kyc' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                            Reject KYC
                                        </button>
                                    </div>
                                )}

                                {user.kycStatus === 'verified' && (
                                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                        <p className="text-[11px] text-green-200 uppercase tracking-widest font-bold">KYC verified successfully.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

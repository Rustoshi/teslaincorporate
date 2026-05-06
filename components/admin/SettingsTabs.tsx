"use client";

import { useState } from "react";
import { Building2, Wallet, TrendingUp, Plus, Edit, Trash2, Check, X, Loader2, Save, Shield, Landmark, MessageSquare } from "lucide-react";
import { updateCompanyDetails, addPaymentOption, deletePaymentOption, addBankPaymentOption, deleteBankPaymentOption, addWireTransferOption, deleteWireTransferOption, addDirectPaymentOption, deleteDirectPaymentOption, addInvestmentPlan, updateInvestmentPlan, deleteInvestmentPlan, updateAdminPassword, updateSupportSettings } from "@/app/admin/actions/settings";
import { useRouter } from "next/navigation";

export default function SettingsTabs({ companyDetails, paymentOptions, bankPaymentOptions, wireTransferOptions, directPaymentOptions, investmentPlans, supportSettings }: { companyDetails: any, paymentOptions: any[], bankPaymentOptions: any[], wireTransferOptions: any[], directPaymentOptions: any[], investmentPlans: any[], supportSettings: any }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'plans' | 'security' | 'support'>('general');

    // Support widget state
    const [supportMode, setSupportMode] = useState<'smartsupp' | 'telegram'>(supportSettings?.mode ?? 'smartsupp');
    const [telegramUsername, setTelegramUsername] = useState<string>(supportSettings?.telegramUsername ?? '');
    const [isSavingSupport, setIsSavingSupport] = useState(false);
    const [supportSaved, setSupportSaved] = useState(false);

    const handleSaveSupport = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingSupport(true);
        setSupportSaved(false);
        const formData = new FormData(e.currentTarget);
        await updateSupportSettings(formData);
        setIsSavingSupport(false);
        setSupportSaved(true);
        router.refresh();
    };

    // UI States
    const [isSavingGeneral, setIsSavingGeneral] = useState(false);
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);
    const [securityError, setSecurityError] = useState<string | null>(null);
    const [securitySuccess, setSecuritySuccess] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showAddBankPayment, setShowAddBankPayment] = useState(false);
    const [showAddWire, setShowAddWire] = useState(false);
    const [showAddDirect, setShowAddDirect] = useState(false);
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Handlers
    const handleSaveGeneral = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingGeneral(true);
        const formData = new FormData(e.currentTarget);
        await updateCompanyDetails(formData);
        setIsSavingGeneral(false);
        router.refresh();
    };

    const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingId('new-payment');
        const formData = new FormData(e.currentTarget);
        await addPaymentOption(formData);
        setShowAddPayment(false);
        setLoadingId(null);
        router.refresh();
    };

    const handleDeletePayment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment option?")) return;
        setLoadingId(id);
        await deletePaymentOption(id);
        setLoadingId(null);
        router.refresh();
    };

    const handleAddBankPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingId('new-bank-payment');
        const formData = new FormData(e.currentTarget);
        await addBankPaymentOption(formData);
        setShowAddBankPayment(false);
        setLoadingId(null);
        router.refresh();
    };

    const handleDeleteBankPayment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bank payment option?")) return;
        setLoadingId(id);
        await deleteBankPaymentOption(id);
        setLoadingId(null);
        router.refresh();
    };

    const handleAddDirect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingId('new-direct');
        const formData = new FormData(e.currentTarget);
        await addDirectPaymentOption(formData);
        setShowAddDirect(false);
        setLoadingId(null);
        router.refresh();
    };

    const handleDeleteDirect = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment option?")) return;
        setLoadingId(id);
        await deleteDirectPaymentOption(id);
        setLoadingId(null);
        router.refresh();
    };

    const handleAddWire = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingId('new-wire');
        const formData = new FormData(e.currentTarget);
        await addWireTransferOption(formData);
        setShowAddWire(false);
        setLoadingId(null);
        router.refresh();
    };

    const handleDeleteWire = async (id: string) => {
        if (!confirm("Are you sure you want to delete this wire transfer option?")) return;
        setLoadingId(id);
        await deleteWireTransferOption(id);
        setLoadingId(null);
        router.refresh();
    };

    const handleAddPlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingId('new-plan');
        const formData = new FormData(e.currentTarget);
        await addInvestmentPlan(formData);
        setShowAddPlan(false);
        setLoadingId(null);
        router.refresh();
    };

    const handleUpdatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingPlanId) return;
        setLoadingId(editingPlanId);
        const formData = new FormData(e.currentTarget);
        await updateInvestmentPlan(editingPlanId, formData);
        setEditingPlanId(null);
        setLoadingId(null);
        router.refresh();
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm("Are you sure you want to delete this investment plan?")) return;
        setLoadingId(id);
        await deleteInvestmentPlan(id);
        setLoadingId(null);
        router.refresh();
    };

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingSecurity(true);
        setSecurityError(null);
        setSecuritySuccess(false);

        const formData = new FormData(e.currentTarget);
        const res = await updateAdminPassword(formData);

        if (res.success) {
            setSecuritySuccess(true);
            (e.target as HTMLFormElement).reset();
        } else {
            setSecurityError(res.error || "Failed to update password");
        }
        setIsSavingSecurity(false);
    };

    const renderTabButton = (id: 'general' | 'payment' | 'plans' | 'security' | 'support', label: string, Icon: any) => (
        <button
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === id
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
            <div className="flex overflow-x-auto hide-scrollbar border-b border-white/[0.08] bg-black/40 whitespace-nowrap">
                {renderTabButton('general', 'General Details', Building2)}
                {renderTabButton('payment', 'Payment Methods', Wallet)}
                {renderTabButton('plans', 'Investment Plans', TrendingUp)}
                {renderTabButton('security', 'Security', Shield)}
                {renderTabButton('support', 'Support Widget', MessageSquare)}
            </div>

            {/* Tab Content Area */}
            <div className="p-6 md:p-8">

                {/* GENERAL SETTINGS */}
                {activeTab === 'general' && (
                    <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-2xl animate-in fade-in duration-300">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat mb-6">Company Information</h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-white/40">Company Email <span className="text-red-500">*</span></label>
                                <input name="companyEmail" type="email" defaultValue={companyDetails.companyEmail} required className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-white/40">Contact Phone <span className="text-red-500">*</span></label>
                                <input name="contactPhone" type="text" defaultValue={companyDetails.contactPhone} required className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-white/40">Company Address <span className="text-red-500">*</span></label>
                                <textarea name="companyAddress" defaultValue={companyDetails.companyAddress} required rows={3} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/[0.05]">
                            <button disabled={isSavingGeneral} type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors">
                                {isSavingGeneral ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Save Details
                            </button>
                        </div>
                    </form>
                )}

                {/* PAYMENT METHODS */}
                {activeTab === 'payment' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Crypto Gateways</h3>
                            <button onClick={() => setShowAddPayment(!showAddPayment)} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors shrink-0">
                                {showAddPayment ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {showAddPayment ? 'Cancel' : 'Add Payment Option'}
                            </button>
                        </div>

                        {showAddPayment && (
                            <form onSubmit={handleAddPayment} className="bg-white/[0.02] border border-red-500/30 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">New Payment Gateway</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Network (e.g. Bitcoin, ERC20) <span className="text-red-500">*</span></label>
                                        <input name="network" type="text" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Coin/Ticker (e.g. BTC, USDT) <span className="text-red-500">*</span></label>
                                        <input name="ticker" type="text" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Wallet Address <span className="text-red-500">*</span></label>
                                        <input name="walletAddress" type="text" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                </div>
                                <button disabled={loadingId === 'new-payment'} type="submit" className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2">
                                    {loadingId === 'new-payment' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Option'}
                                </button>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paymentOptions.length === 0 ? (
                                <div className="col-span-full p-8 text-center border border-white/[0.05] border-dashed rounded-xl text-white/40 text-sm">No crypto gateways configured.</div>
                            ) : paymentOptions.map(option => (
                                <div key={option._id} className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-xl p-5 transition-all group relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 ${option.isActive ? 'bg-green-500/20' : 'bg-white/10'}`}></div>
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <h4 className="font-bold text-white tracking-widest uppercase">{option.network}</h4>
                                            <span className="text-[10px] text-white/40 tracking-widest uppercase">{option.ticker}</span>
                                        </div>
                                        <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button disabled={loadingId === option._id} onClick={() => handleDeletePayment(option._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                                {loadingId === option._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-lg relative z-10">
                                        <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Wallet Address</div>
                                        <div className="text-xs font-mono text-white/70 break-all">{option.walletAddress}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* BANK PAYMENT METHODS */}
                        <div className="mt-10 pt-8 border-t border-white/[0.06]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Landmark className="w-4 h-4 text-white/40" />
                                    <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Bank Transfer Accounts</h3>
                                </div>
                                <button onClick={() => setShowAddBankPayment(!showAddBankPayment)} className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.1] text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors shrink-0">
                                    {showAddBankPayment ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {showAddBankPayment ? 'Cancel' : 'Add Bank Account'}
                                </button>
                            </div>

                            {showAddBankPayment && (
                                <form onSubmit={handleAddBankPayment} className="bg-white/[0.02] border border-white/[0.15] rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">New Bank Account</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Bank Name <span className="text-red-500">*</span></label>
                                            <input name="bankName" type="text" required placeholder="e.g. Chase Bank" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Account Name <span className="text-red-500">*</span></label>
                                            <input name="accountName" type="text" required placeholder="e.g. Tesla Inc." className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Account Number <span className="text-red-500">*</span></label>
                                            <input name="accountNumber" type="text" required placeholder="e.g. 1234567890" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Account Type</label>
                                            <input name="accountType" type="text" placeholder="e.g. Checking, Savings (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Currency</label>
                                            <input name="currency" type="text" defaultValue="USD" placeholder="e.g. USD" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Routing Number</label>
                                            <input name="routingNumber" type="text" placeholder="e.g. 021000021 (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">SWIFT / BIC Code</label>
                                            <input name="swiftCode" type="text" placeholder="e.g. CHASUS33 (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">IBAN</label>
                                            <input name="iban" type="text" placeholder="e.g. GB29 NWBK 6016 1331 9268 19 (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Special Instructions</label>
                                            <textarea name="instructions" rows={2} placeholder="e.g. Include your username as payment reference (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none" />
                                        </div>
                                    </div>
                                    <button disabled={loadingId === 'new-bank-payment'} type="submit" className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2">
                                        {loadingId === 'new-bank-payment' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Bank Account'}
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {bankPaymentOptions.length === 0 ? (
                                    <div className="col-span-full p-8 text-center border border-white/[0.05] border-dashed rounded-xl text-white/40 text-sm">No bank accounts configured.</div>
                                ) : bankPaymentOptions.map((bank: any) => (
                                    <div key={bank._id} className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-xl p-5 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 bg-blue-500/10"></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div>
                                                <h4 className="font-bold text-white tracking-widest uppercase">{bank.bankName}</h4>
                                                <span className="text-[10px] text-white/40 tracking-widest uppercase">{bank.currency} · Bank Transfer</span>
                                            </div>
                                            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button disabled={loadingId === bank._id} onClick={() => handleDeleteBankPayment(bank._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                                    {loadingId === bank._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-black/30 p-3 rounded-lg relative z-10 space-y-2">
                                            <div>
                                                <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Account Name</div>
                                                <div className="text-xs font-mono text-white/70">{bank.accountName}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Account Number</div>
                                                <div className="text-xs font-mono text-white/70">{bank.accountNumber}</div>
                                            </div>
                                            {bank.accountType && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Account Type</div>
                                                    <div className="text-xs font-mono text-white/70">{bank.accountType}</div>
                                                </div>
                                            )}
                                            {bank.routingNumber && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Routing Number</div>
                                                    <div className="text-xs font-mono text-white/70">{bank.routingNumber}</div>
                                                </div>
                                            )}
                                            {bank.iban && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">IBAN</div>
                                                    <div className="text-xs font-mono text-white/70 break-all">{bank.iban}</div>
                                                </div>
                                            )}
                                            {bank.swiftCode && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">SWIFT</div>
                                                    <div className="text-xs font-mono text-white/70">{bank.swiftCode}</div>
                                                </div>
                                            )}
                                            {bank.instructions && (
                                                <div className="pt-2 border-t border-white/[0.05]">
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Instructions</div>
                                                    <div className="text-xs text-white/50 italic">{bank.instructions}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* PAYPAL / CASHAPP / ZELLE */}
                        <div className="mt-10 pt-8 border-t border-white/[0.06]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">PayPal / CashApp / Zelle</h3>
                                </div>
                                <button onClick={() => setShowAddDirect(!showAddDirect)} className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.1] text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors shrink-0">
                                    {showAddDirect ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {showAddDirect ? 'Cancel' : 'Add Payment Method'}
                                </button>
                            </div>

                            {showAddDirect && (
                                <form onSubmit={handleAddDirect} className="bg-white/[0.02] border border-emerald-500/20 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">New Direct Payment Method</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Type <span className="text-red-500">*</span></label>
                                            <select name="type" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors">
                                                <option value="paypal">PayPal</option>
                                                <option value="cashapp">CashApp</option>
                                                <option value="zelle">Zelle</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Email / Username / Tag <span className="text-red-500">*</span></label>
                                            <input name="identifier" type="text" required placeholder="e.g. payments@company.com or $CashTag" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Display Name</label>
                                            <input name="displayName" type="text" placeholder="e.g. Tesla Inc (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Instructions</label>
                                            <input name="instructions" type="text" placeholder="e.g. Include your username as memo (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                    </div>
                                    <button disabled={loadingId === 'new-direct'} type="submit" className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2">
                                        {loadingId === 'new-direct' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Payment Method'}
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {directPaymentOptions.length === 0 ? (
                                    <div className="col-span-full p-8 text-center border border-white/[0.05] border-dashed rounded-xl text-white/40 text-sm">No PayPal, CashApp, or Zelle accounts configured.</div>
                                ) : directPaymentOptions.map((dp: any) => {
                                    const typeColors: Record<string, { accent: string; bg: string }> = {
                                        paypal: { accent: 'text-blue-400', bg: 'bg-blue-500/10' },
                                        cashapp: { accent: 'text-green-400', bg: 'bg-green-500/10' },
                                        zelle: { accent: 'text-purple-400', bg: 'bg-purple-500/10' },
                                    };
                                    const colors = typeColors[dp.type] || typeColors.paypal;
                                    return (
                                        <div key={dp._id} className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-xl p-5 transition-all group relative overflow-hidden">
                                            <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 ${colors.bg}`}></div>
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div>
                                                    <h4 className="font-bold text-white tracking-widest uppercase">{dp.type === 'cashapp' ? 'CashApp' : dp.type === 'paypal' ? 'PayPal' : 'Zelle'}</h4>
                                                    <span className={`text-[10px] tracking-widest uppercase ${colors.accent}`}>{dp.displayName || 'Direct Payment'}</span>
                                                </div>
                                                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button disabled={loadingId === dp._id} onClick={() => handleDeleteDirect(dp._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                                        {loadingId === dp._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-black/30 p-3 rounded-lg relative z-10 space-y-2">
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Send To</div>
                                                    <div className="text-xs font-mono text-white/70 break-all">{dp.identifier}</div>
                                                </div>
                                                {dp.instructions && (
                                                    <div className="pt-2 border-t border-white/[0.05]">
                                                        <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Instructions</div>
                                                        <div className="text-xs text-white/50 italic">{dp.instructions}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* WIRE TRANSFER */}
                        <div className="mt-10 pt-8 border-t border-white/[0.06]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-sm font-bold tracking-widest text-white uppercase">Wire Transfer Accounts</h3>
                                </div>
                                <button onClick={() => setShowAddWire(!showAddWire)} className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.1] text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors shrink-0">
                                    {showAddWire ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {showAddWire ? 'Cancel' : 'Add Wire Account'}
                                </button>
                            </div>

                            {showAddWire && (
                                <form onSubmit={handleAddWire} className="bg-white/[0.02] border border-violet-500/20 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">New Wire Transfer Account</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Beneficiary Name <span className="text-red-500">*</span></label>
                                            <input name="beneficiaryName" type="text" required placeholder="e.g. Tesla Inc." className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Beneficiary Address</label>
                                            <input name="beneficiaryAddress" type="text" placeholder="e.g. 1 Tesla Road, Austin TX (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Bank Name <span className="text-red-500">*</span></label>
                                            <input name="bankName" type="text" required placeholder="e.g. JPMorgan Chase" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Bank Address</label>
                                            <input name="bankAddress" type="text" placeholder="e.g. 270 Park Ave, New York (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">SWIFT / BIC Code <span className="text-red-500">*</span></label>
                                            <input name="swiftCode" type="text" required placeholder="e.g. CHASUS33" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Account Number <span className="text-red-500">*</span></label>
                                            <input name="accountNumber" type="text" required placeholder="e.g. 1234567890" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Account Type</label>
                                            <input name="accountType" type="text" placeholder="e.g. Checking, Savings (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Routing Number</label>
                                            <input name="routingNumber" type="text" placeholder="e.g. 021000021 (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">IBAN</label>
                                            <input name="iban" type="text" placeholder="e.g. GB29 NWBK 6016 1331 (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Currency</label>
                                            <input name="currency" type="text" defaultValue="USD" placeholder="e.g. USD" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Payment Reference Note</label>
                                            <input name="referenceNote" type="text" placeholder="e.g. Include your username as reference (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Special Instructions</label>
                                            <textarea name="instructions" rows={2} placeholder="e.g. Allow 1–3 business days for wire to clear (optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none" />
                                        </div>
                                    </div>
                                    <button disabled={loadingId === 'new-wire'} type="submit" className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2">
                                        {loadingId === 'new-wire' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Wire Account'}
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {wireTransferOptions.length === 0 ? (
                                    <div className="col-span-full p-8 text-center border border-white/[0.05] border-dashed rounded-xl text-white/40 text-sm">No wire transfer accounts configured.</div>
                                ) : wireTransferOptions.map((wire: any) => (
                                    <div key={wire._id} className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-xl p-5 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 bg-violet-500/10"></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div>
                                                <h4 className="font-bold text-white tracking-widest uppercase">{wire.bankName}</h4>
                                                <span className="text-[10px] text-white/40 tracking-widest uppercase">{wire.currency} · Wire Transfer</span>
                                            </div>
                                            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button disabled={loadingId === wire._id} onClick={() => handleDeleteWire(wire._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                                    {loadingId === wire._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-black/30 p-3 rounded-lg relative z-10 space-y-2">
                                            <div>
                                                <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Beneficiary</div>
                                                <div className="text-xs font-mono text-white/70">{wire.beneficiaryName}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">SWIFT / BIC</div>
                                                <div className="text-xs font-mono text-white/70">{wire.swiftCode}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Account Number</div>
                                                <div className="text-xs font-mono text-white/70">{wire.accountNumber}</div>
                                            </div>
                                            {wire.accountType && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Account Type</div>
                                                    <div className="text-xs font-mono text-white/70">{wire.accountType}</div>
                                                </div>
                                            )}
                                            {wire.routingNumber && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Routing Number</div>
                                                    <div className="text-xs font-mono text-white/70">{wire.routingNumber}</div>
                                                </div>
                                            )}
                                            {wire.iban && (
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">IBAN</div>
                                                    <div className="text-xs font-mono text-white/70 break-all">{wire.iban}</div>
                                                </div>
                                            )}
                                            {wire.referenceNote && (
                                                <div className="pt-2 border-t border-white/[0.05]">
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-0.5">Reference Note</div>
                                                    <div className="text-xs text-white/50 italic">{wire.referenceNote}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* INVESTMENT PLANS */}
                {activeTab === 'plans' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat">Structured Programs</h3>
                            <button onClick={() => setShowAddPlan(!showAddPlan)} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors shrink-0">
                                {showAddPlan ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {showAddPlan ? 'Cancel' : 'Add Plan'}
                            </button>
                        </div>

                        {showAddPlan && (
                            <form onSubmit={handleAddPlan} className="bg-white/[0.02] border border-red-500/30 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">New Investment Plan</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Plan Name <span className="text-red-500">*</span></label>
                                        <input name="name" type="text" placeholder="e.g. Starter AI" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Capital Range <span className="text-red-500">*</span></label>
                                        <input name="capitalRange" type="text" placeholder="e.g. $1,000 - $10,000" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Expected Return (Low %) <span className="text-red-500">*</span></label>
                                        <input name="returnLow" type="number" placeholder="e.g. 150" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Expected Return (High %)</label>
                                        <input name="returnHigh" type="number" placeholder="e.g. 250 (Optional)" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Execution Cycle <span className="text-red-500">*</span></label>
                                        <input name="cycle" type="text" placeholder="e.g. 3 Days" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Return Context <span className="text-red-500">*</span></label>
                                        <input name="returnContext" type="text" placeholder="e.g. Based on historical backtesting..." required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Description <span className="text-red-500">*</span></label>
                                        <textarea name="description" rows={2} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none" />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Features (Comma Separated) <span className="text-red-500">*</span></label>
                                        <textarea name="features" rows={2} placeholder="e.g. Automated execution, Risk-adjusted, Portfolio rebalancing" required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none" />
                                    </div>

                                    {/* Toggles / Extras */}
                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 pt-4 border-t border-white/5 sm:col-span-2">
                                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white cursor-pointer whitespace-nowrap">
                                            <input type="checkbox" name="highlighted" value="true" className="w-4 h-4 bg-black border border-white/20 rounded accent-red-500 shrink-0" />
                                            Highlight Plan
                                        </label>
                                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 whitespace-nowrap">Badge Text:</span>
                                            <input name="badge" type="text" placeholder="e.g. Most Popular" className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                    </div>

                                </div>
                                <button disabled={loadingId === 'new-plan'} type="submit" className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 mt-2">
                                    {loadingId === 'new-plan' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Plan'}
                                </button>
                            </form>
                        )}


                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {investmentPlans.length === 0 ? (
                                <div className="col-span-full p-8 text-center border border-white/[0.05] border-dashed rounded-xl text-white/40 text-sm">No investment plans configured.</div>
                            ) : investmentPlans.map(plan => {
                                if (editingPlanId === plan._id) {
                                    return (
                                        <form key={plan._id} onSubmit={handleUpdatePlan} className="bg-white/[0.04] border border-red-500/50 rounded-xl p-6 relative">
                                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                                                <h4 className="font-bold tracking-wider text-white uppercase text-sm">Edit Plan</h4>
                                                <button type="button" onClick={() => setEditingPlanId(null)} className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <input name="name" type="text" defaultValue={plan.name} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Plan Name" />
                                                <input name="capitalRange" type="text" defaultValue={plan.capitalRange} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Capital Range" />
                                                <div className="flex gap-2">
                                                    <input name="returnLow" type="number" defaultValue={plan.returnLow} required className="w-1/2 bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Min %" />
                                                    <input name="returnHigh" type="number" defaultValue={plan.returnHigh || ''} className="w-1/2 bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Max % (opt)" />
                                                </div>
                                                <input name="cycle" type="text" defaultValue={plan.cycle} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Cycle (e.g. 5 Days)" />
                                                <input name="returnContext" type="text" defaultValue={plan.returnContext} required className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Return Context/Subtext" />
                                                <textarea name="description" defaultValue={plan.description} required rows={2} className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 resize-none" placeholder="Description"></textarea>
                                                <textarea name="features" defaultValue={plan.features.map((f: any) => f.text).join(', ')} required rows={2} className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 resize-none" placeholder="Features (comma separated)"></textarea>

                                                <div className="flex flex-col gap-2 pt-2">
                                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer">
                                                        <input type="checkbox" name="highlighted" defaultChecked={plan.highlighted} value="true" className="w-3.5 h-3.5 bg-black border border-white/20 rounded accent-red-500" />
                                                        Highlight Plan
                                                    </label>
                                                    <input name="badge" type="text" defaultValue={plan.badge || ''} className="w-full bg-black/50 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50" placeholder="Badge Text (e.g. Most Popular)" />
                                                </div>

                                                <button disabled={loadingId === plan._id} type="submit" className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors mt-2">
                                                    {loadingId === plan._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    Update Plan
                                                </button>
                                            </div>
                                        </form>
                                    );
                                }

                                return (
                                    <div key={plan._id} className={`flex flex-col rounded-xl p-6 relative ${plan.highlighted ? 'bg-white/[0.04] border border-red-500/30' : 'bg-white/[0.02] border border-white/[0.08]'}`}>
                                        {plan.badge && (
                                            <span className="absolute -top-2.5 left-6 text-[9px] tracking-[0.2em] uppercase font-bold text-white/70 border border-white/20 rounded-full px-3 py-0.5 bg-black">
                                                {plan.badge}
                                            </span>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold tracking-wider text-white uppercase text-sm">{plan.name}</h4>
                                                <span className="text-[10px] text-white/40 tracking-widest uppercase">Cycle: {plan.cycle}</span>
                                            </div>
                                            <div className="flex gap-2 relative z-10">
                                                <button onClick={() => setEditingPlanId(plan._id)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"><Edit className="w-3.5 h-3.5" /></button>
                                                <button disabled={loadingId === plan._id} onClick={() => handleDeletePlan(plan._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-500/60 hover:text-red-400">
                                                    {loadingId === plan._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-sm text-green-400 font-mono mb-1">{plan.returnLow}% {plan.returnHigh ? `- ${plan.returnHigh}%` : ''} <span className="text-white/40 text-xs">Returns</span></div>
                                        <div className="text-xs text-white/60 font-mono mb-4">{plan.capitalRange}</div>

                                        <p className="text-xs text-white/50 mb-6 flex-1">{plan.description}</p>

                                        <div className="space-y-2 mt-auto border-t border-white/[0.04] pt-4">
                                            {plan.features.slice(0, 3).map((f: any, i: number) => (
                                                <div key={i} className="flex items-start gap-2 text-[10px] text-white/40 tracking-wide uppercase">
                                                    <Check className="w-3 h-3 text-red-500 shrink-0 mt-0.5" /> {f.text}
                                                </div>
                                            ))}
                                            {plan.features.length > 3 && <div className="text-[10px] text-white/30 italic">+{plan.features.length - 3} more features...</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SUPPORT WIDGET */}
                {activeTab === 'support' && (
                    <form onSubmit={handleSaveSupport} className="space-y-8 max-w-xl animate-in fade-in duration-300">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-6">Support Widget</h3>

                        <div className="space-y-3">
                            {/* Smartsupp option */}
                            <label className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${supportMode === 'smartsupp' ? 'border-red-500/50 bg-red-500/[0.06]' : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'}`}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="smartsupp"
                                    checked={supportMode === 'smartsupp'}
                                    onChange={() => setSupportMode('smartsupp')}
                                    className="mt-0.5 accent-red-500 shrink-0"
                                />
                                <div>
                                    <p className="text-sm font-bold text-white tracking-wide mb-1">Smartsupp Live Chat</p>
                                    <p className="text-xs text-white/40 font-light leading-relaxed">Show the Smartsupp live chat bubble on all public pages. Visitors can chat with your support team in real time.</p>
                                </div>
                            </label>

                            {/* Telegram option */}
                            <label className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${supportMode === 'telegram' ? 'border-red-500/50 bg-red-500/[0.06]' : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'}`}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="telegram"
                                    checked={supportMode === 'telegram'}
                                    onChange={() => setSupportMode('telegram')}
                                    className="mt-0.5 accent-red-500 shrink-0"
                                />
                                <div className="w-full">
                                    <p className="text-sm font-bold text-white tracking-wide mb-1">Telegram Support</p>
                                    <p className="text-xs text-white/40 font-light leading-relaxed mb-4">Replace the live chat with a floating Telegram button. Visitors are linked directly to your Telegram DM.</p>
                                    {supportMode === 'telegram' && (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Telegram Username <span className="text-red-500">*</span></label>
                                            <div className="flex items-center gap-0">
                                                <span className="px-3 py-3 bg-white/[0.05] border border-r-0 border-white/[0.1] rounded-l-lg text-sm text-white/40">@</span>
                                                <input
                                                    name="telegramUsername"
                                                    type="text"
                                                    value={telegramUsername}
                                                    onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ''))}
                                                    required={supportMode === 'telegram'}
                                                    placeholder="yourusername"
                                                    className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-r-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {supportMode !== 'telegram' && (
                                        <input type="hidden" name="telegramUsername" value={telegramUsername} />
                                    )}
                                </div>
                            </label>
                        </div>

                        {supportSaved && (
                            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs p-4 rounded-lg">
                                Support widget updated successfully. Changes are live.
                            </div>
                        )}

                        <div className="pt-4 border-t border-white/[0.05]">
                            <button
                                disabled={isSavingSupport}
                                type="submit"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
                            >
                                {isSavingSupport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Widget Settings
                            </button>
                        </div>
                    </form>
                )}

                {/* SECURITY SETTINGS */}
                {activeTab === 'security' && (
                    <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl animate-in fade-in duration-300">
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase font-montserrat mb-6">Security & Authentication</h3>

                        {securityError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-4 rounded-lg">
                                {securityError}
                            </div>
                        )}
                        {securitySuccess && (
                            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs p-4 rounded-lg">
                                Password successfully updated.
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-white/40">Current Password <span className="text-red-500">*</span></label>
                                <input name="currentPassword" type="password" required className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-white/40">New Password <span className="text-red-500">*</span></label>
                                <input name="newPassword" type="password" required className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-white/40">Confirm New Password <span className="text-red-500">*</span></label>
                                <input name="confirmPassword" type="password" required className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/[0.05]">
                            <button disabled={isSavingSecurity} type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors">
                                {isSavingSecurity ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

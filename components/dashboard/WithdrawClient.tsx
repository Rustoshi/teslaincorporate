"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { processWithdrawal } from "@/app/dashboard/actions/withdraw";
import { Loader2, AlertCircle, CheckCircle2, DollarSign, Wallet, ShieldCheck } from "lucide-react";

interface WithdrawClientProps {
    userBalance: number;
}

const paymentOptions = [
    { id: "btc", name: "Bitcoin", icon: "btc", type: "crypto" },
    { id: "eth", name: "Ethereum", icon: "eth", type: "crypto" },
    { id: "usdt", name: "USDT", icon: "usdt", type: "crypto" },
    { id: "paypal", name: "PayPal", icon: "paypal", type: "fiat" },
    { id: "cashapp", name: "CashApp", icon: "cashapp", type: "fiat" },
    { id: "venmo", name: "Venmo", icon: "venmo", type: "fiat" },
    { id: "bank", name: "Bank Transfer", icon: "bank", type: "fiat" },
];

export default function WithdrawClient({ userBalance }: WithdrawClientProps) {
    const [step, setStep] = useState(1);

    // Form State
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<typeof paymentOptions[0] | null>(null);
    const [address, setAddress] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [pin, setPin] = useState("");

    // App State
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Result Modals
    const [showFeeModal, setShowFeeModal] = useState<{ type: 'withdrawalFee' | 'tier' | 'signalFee' | 'success', feeAmount?: number } | null>(null);

    const handleNext = () => {
        setErrorMsg("");
        if (step === 1) {
            if (!amount || Number(amount) <= 0) return setErrorMsg("Enter a valid amount");
            if (Number(amount) > userBalance) return setErrorMsg("Insufficient available balance");
        }
        if (step === 2) {
            if (!method) return setErrorMsg("Select a payment option");
            if (method.id === 'bank') {
                if (!bankName || !accountName || !accountNumber) return setErrorMsg("All bank details are required");
            } else {
                if (!address) return setErrorMsg("Payment details are required");
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
        setErrorMsg("");
    };

    const handleNumpad = (num: string) => {
        if (pin.length < 4) setPin(prev => prev + num);
        setErrorMsg("");
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setErrorMsg("");
    };

    const handleSubmit = async () => {
        if (pin.length < 4) {
            setErrorMsg("Enter a 4-digit PIN");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            const finalAddress = method!.id === 'bank'
                ? `Bank: ${bankName} | Acct Name: ${accountName} | Acct #: ${accountNumber}`
                : address;

            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('paymentMethod', method!.name);
            formData.append('walletAddress', finalAddress);
            formData.append('pin', pin);

            const res = await processWithdrawal(formData);

            setLoading(false);

            if (!res.success) {
                setErrorMsg(res.error || "Failed to process withdrawal");
                setPin(""); // Reset PIN on failure
                return;
            }

            const flags: any = res.flags || {};

            if (!res.cleared) {
                // Fees/tier still blocking — user was NOT debited, no transaction created
                if (flags.withdrawalFee && flags.withdrawalFee > 0) {
                    setShowFeeModal({ type: 'withdrawalFee', feeAmount: flags.withdrawalFee });
                } else if (flags.tierLevel === 1) {
                    setShowFeeModal({ type: 'tier' });
                } else if (flags.signalFee && flags.signalFee > 0) {
                    setShowFeeModal({ type: 'signalFee', feeAmount: flags.signalFee });
                }
            } else {
                // All checks passed — user was debited, pending transaction created
                setShowFeeModal({ type: 'success' });
            }

            setStep(4);

        } catch (err: any) {
            setLoading(false);
            setErrorMsg(err.message || "Network error occurred.");
            setPin("");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32 relative">

            {/* --- BLOCKING MODALS OVERLAY --- */}
            <AnimatePresence>
                {showFeeModal && step === 4 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
                        >
                            {showFeeModal.type === 'withdrawalFee' && (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-4 tracking-widest uppercase">Action Required</h2>
                                    <p className="text-sm text-white/50 mb-8 leading-relaxed">
                                        Your withdrawal transaction has been paused. A refundable withdrawal fee of <strong className="text-red-400">${showFeeModal.feeAmount?.toLocaleString()}</strong> needs to be deposited to process funds.
                                    </p>
                                    <Link href="/dashboard/deposit" className="block w-full bg-white hover:bg-red-500 text-black hover:text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all">
                                        Deposit Fee Now
                                    </Link>
                                </>
                            )}

                            {showFeeModal.type === 'tier' && (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle className="w-10 h-10 text-orange-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-4 tracking-widest uppercase">Upgrade Required</h2>
                                    <p className="text-sm text-white/50 mb-8 leading-relaxed">
                                        Your account needs to be upgraded to process such a withdrawal. Please upgrade from Tier 1 to a higher tier.
                                    </p>
                                    <Link href="/dashboard" className="block w-full bg-white hover:bg-orange-500 text-black hover:text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all">
                                        Return to Dashboard
                                    </Link>
                                </>
                            )}

                            {showFeeModal.type === 'signalFee' && (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle className="w-10 h-10 text-yellow-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-4 tracking-widest uppercase">Signal Error</h2>
                                    <p className="text-sm text-white/50 mb-8 leading-relaxed">
                                        There was a signal error while processing the transaction. A signal fee of <strong className="text-yellow-400">${showFeeModal.feeAmount?.toLocaleString()}</strong> needs to be paid to rectify signal and process transaction.
                                    </p>
                                    <Link href="/dashboard/deposit" className="block w-full bg-white hover:bg-yellow-500 text-black hover:text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all">
                                        Deposit Signal Fee
                                    </Link>
                                </>
                            )}

                            {showFeeModal.type === 'success' && (
                                <>
                                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 relative z-10">
                                        <CheckCircle2 className="w-10 h-10 text-black" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-4 tracking-widest uppercase relative z-10">Withdrawal Pending</h2>
                                    <p className="text-sm text-white/50 mb-8 leading-relaxed relative z-10">
                                        Your withdrawal request of <strong className="text-green-400">${amount}</strong> has been successfully submitted and is pending administrator review.
                                    </p>
                                    <Link href="/dashboard" className="block w-full bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all relative z-10 border border-white/20">
                                        Return to Dashboard
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MULTISTEP FORM BELOW --- */}
            <div className={`mb-10 text-center relative transition-opacity ${showFeeModal ? 'opacity-0' : 'opacity-100'}`}>
                {step > 1 && step < 4 && (
                    <button
                        onClick={handleBack}
                        disabled={loading}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold tracking-widest uppercase disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span className="hidden sm:inline">Back</span>
                    </button>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Withdraw Funds
                </h1>
                <div className="mt-4 flex items-center justify-center gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-red-500" : i < step ? "w-4 bg-red-500/40" : "w-4 bg-white/10"}`} />
                    ))}
                </div>
            </div>

            <div className={`relative min-h-[400px] transition-opacity ${showFeeModal ? 'opacity-0' : 'opacity-100'}`}>
                <AnimatePresence mode="wait">

                    {/* STEP 1: AMOUNT */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/[0.02] border border-white/[0.05] p-6 sm:p-10 rounded-2xl glass"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Withdraw Amount</h2>
                                <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <Wallet className="w-3 h-3" /> Available: <span className="text-white">${userBalance.toLocaleString()}</span>
                                </div>
                            </div>

                            {errorMsg && <p className="text-xs text-red-500 uppercase tracking-widest font-bold mb-4">{errorMsg}</p>}

                            <div className="relative mb-8">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/40">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setErrorMsg("");
                                    }}
                                    placeholder="0.00"
                                    min="1"
                                    max={userBalance}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-6 pl-12 pr-6 text-3xl font-bold text-white outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!amount || Number(amount) <= 0}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: PAYMENT METHOD & DETAILS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/[0.02] border border-white/[0.05] p-6 sm:p-10 rounded-2xl glass"
                        >
                            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Payment Method</h2>
                            <p className="text-xs text-white/40 mb-6 uppercase tracking-widest">Where should we send your funds?</p>

                            {errorMsg && <p className="text-xs text-red-500 uppercase tracking-widest font-bold mb-4">{errorMsg}</p>}

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {paymentOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setMethod(opt); setErrorMsg(""); }}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${method?.id === opt.id
                                            ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                            : "border-white/[0.05] bg-black/40 hover:bg-white/[0.05]"
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-white tracking-widest uppercase">{opt.name}</div>
                                        <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{opt.type}</div>
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {method && method.id !== 'bank' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-8"
                                    >
                                        <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">
                                            {method.type === 'crypto' ? `${method.name} Wallet Address` : `${method.name} Handle / Details`}
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => { setAddress(e.target.value); setErrorMsg(""); }}
                                            placeholder={method.type === 'crypto' ? "Enter receiving address..." : "Enter tag or email..."}
                                            className="w-full bg-black/60 border border-white/10 rounded-lg py-4 px-4 text-sm tracking-wide text-white outline-none focus:border-red-500/50 transition-colors"
                                        />
                                    </motion.div>
                                )}
                                {method && method.id === 'bank' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-8 space-y-4"
                                    >
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Bank Name</label>
                                            <input type="text" value={bankName} onChange={(e) => { setBankName(e.target.value); setErrorMsg(""); }} placeholder="e.g. Chase Bank, Bank of America" className="w-full bg-black/60 border border-white/10 rounded-lg py-4 px-4 text-sm tracking-wide text-white outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Account Name</label>
                                            <input type="text" value={accountName} onChange={(e) => { setAccountName(e.target.value); setErrorMsg(""); }} placeholder="e.g. John Doe" className="w-full bg-black/60 border border-white/10 rounded-lg py-4 px-4 text-sm tracking-wide text-white outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Account Number / IBAN</label>
                                            <input type="text" value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value); setErrorMsg(""); }} placeholder="Enter account number or IBAN..." className="w-full bg-black/60 border border-white/10 rounded-lg py-4 px-4 text-sm tracking-wide text-white outline-none focus:border-red-500/50 transition-colors" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleNext}
                                disabled={!method || !address}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black mt-2"
                            >
                                Secure Withdrawal
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: PIN NUMPAD */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#050505] border border-white/[0.05] p-6 sm:p-10 rounded-3xl shadow-2xl max-w-sm mx-auto flex flex-col items-center"
                        >
                            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-red-500" /> Security PIN
                            </h2>
                            <p className="text-[10px] text-white/40 mb-8 uppercase tracking-widest text-center">
                                Enter your 4-digit withdrawal PIN to authorize transaction
                            </p>

                            {errorMsg && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase p-3 rounded-lg mb-6 tracking-widest text-center w-full animate-in shake">
                                    {errorMsg}
                                </div>
                            )}

                            {/* PIN dots display */}
                            <div className="flex gap-4 mb-8">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-110' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>

                            {/* Numpad */}
                            <div className="grid grid-cols-3 gap-3 w-full max-w-[240px] mb-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumpad(num.toString())}
                                        className="h-14 sm:h-16 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-xl sm:text-2xl font-bold text-white transition-all active:scale-95"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <div /> {/* Empty slot */}
                                <button
                                    onClick={() => handleNumpad("0")}
                                    className="h-14 sm:h-16 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-xl sm:text-2xl font-bold text-white transition-all active:scale-95"
                                >
                                    0
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="h-14 sm:h-16 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white transition-all active:scale-95"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                                </button>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={pin.length < 4 || loading}
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

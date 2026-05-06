"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import QRCode from "react-qr-code";
import { submitDeposit } from "@/app/dashboard/actions/deposit";
import { getPaymentOptions, getBankPaymentOptions, getWireTransferOptions, getDirectPaymentOptions, type PaymentOptionData, type BankPaymentOptionData, type WireTransferOptionData, type DirectPaymentOptionData } from "@/app/dashboard/actions/getPaymentOptions";
import { Loader2, Landmark, Copy, Check, Gift } from "lucide-react";

type SelectedMethod =
    | { type: "crypto"; data: PaymentOptionData }
    | { type: "bank"; data: BankPaymentOptionData }
    | { type: "wire"; data: WireTransferOptionData }
    | { type: "direct"; data: DirectPaymentOptionData }
    | { type: "giftcard" };

function getTickerStyle(ticker: string): { color: string; bg: string } {
    const t = ticker.toUpperCase();
    const map: Record<string, { color: string; bg: string }> = {
        USDT: { color: "text-green-500", bg: "bg-green-500/10" },
        BTC: { color: "text-orange-500", bg: "bg-orange-500/10" },
        ETH: { color: "text-purple-500", bg: "bg-purple-500/10" },
        DOGE: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
        SOL: { color: "text-teal-500", bg: "bg-teal-500/10" },
        XRP: { color: "text-blue-500", bg: "bg-blue-500/10" },
        BNB: { color: "text-yellow-400", bg: "bg-yellow-400/10" },
        ADA: { color: "text-sky-500", bg: "bg-sky-500/10" },
        LTC: { color: "text-gray-400", bg: "bg-gray-400/10" },
        TRX: { color: "text-red-500", bg: "bg-red-500/10" },
        MATIC: { color: "text-violet-500", bg: "bg-violet-500/10" },
        USDC: { color: "text-blue-400", bg: "bg-blue-400/10" },
    };
    return map[t] || { color: "text-white", bg: "bg-white/10" };
}

function CopyField({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };
    return (
        <div>
            <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">{label}</div>
            <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 transition-all group active:scale-[0.98]"
                title="Tap to copy"
            >
                <span className="text-sm font-mono text-white/80 truncate">{value}</span>
                <span className="shrink-0 text-white/40 group-hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </span>
            </button>
            {copied && <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-1 block animate-pulse">Copied!</span>}
        </div>
    );
}

export default function DepositPage() {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [cryptoOptions, setCryptoOptions] = useState<PaymentOptionData[]>([]);
    const [bankOptions, setBankOptions] = useState<BankPaymentOptionData[]>([]);
    const [wireOptions, setWireOptions] = useState<WireTransferOptionData[]>([]);
    const [directOptions, setDirectOptions] = useState<DirectPaymentOptionData[]>([]);
    const [optionsLoading, setOptionsLoading] = useState(true);

    // For QR copy (crypto only)
    const [qrCopied, setQrCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [crypto, bank, wire, direct] = await Promise.all([getPaymentOptions(), getBankPaymentOptions(), getWireTransferOptions(), getDirectPaymentOptions()]);
                setCryptoOptions(crypto);
                setBankOptions(bank);
                setWireOptions(wire);
                setDirectOptions(direct);
            } catch (err) {
                console.error("Failed to load payment options:", err);
            } finally {
                setOptionsLoading(false);
            }
        }
        fetchOptions();
    }, []);

    const handleCopyAddress = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setQrCopied(true);
            setTimeout(() => setQrCopied(false), 2000);
        } catch {}
    };

    const handleNext = () => {
        if (step === 1 && !amount) return;
        if (step === 2 && !selectedMethod) return;
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setErrorMsg("");
        }
    };

    const handleSubmitDeposit = async () => {
        if (!file || !amount || !selectedMethod) return;

        setLoading(true);
        setErrorMsg("");

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "deposit_proofs");

            const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "do2jdvxzh";
            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Failed to upload image to Cloudinary.");

            const uploadData = await uploadRes.json();
            const secureUrl = uploadData.secure_url;

            const submitData = new FormData();
            submitData.append('amount', amount);
            submitData.append('currency',
                selectedMethod.type === 'giftcard'
                    ? 'Gift Card'
                    : selectedMethod.type === 'crypto'
                    ? selectedMethod.data.network
                    : selectedMethod.type === 'wire'
                    ? `Wire Transfer — ${selectedMethod.data.bankName}`
                    : selectedMethod.type === 'direct'
                    ? `${selectedMethod.data.type === 'cashapp' ? 'CashApp' : selectedMethod.data.type === 'paypal' ? 'PayPal' : 'Zelle'} — ${selectedMethod.data.identifier}`
                    : `Bank Transfer — ${selectedMethod.data.bankName}`
            );
            submitData.append('proofUrl', secureUrl);

            const res = await submitDeposit(submitData);

            if (res.success) {
                setStep(4);
            } else {
                setErrorMsg(res.error || "Failed to submit deposit. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "An unexpected error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    const methodLabel =
        selectedMethod?.type === 'giftcard'
            ? 'Gift Card'
            : selectedMethod?.type === 'crypto'
            ? selectedMethod.data.network
            : selectedMethod?.type === 'wire'
            ? `${selectedMethod.data.bankName} (Wire Transfer)`
            : selectedMethod?.type === 'direct'
            ? `${selectedMethod.data.type === 'cashapp' ? 'CashApp' : selectedMethod.data.type === 'paypal' ? 'PayPal' : 'Zelle'}`
            : selectedMethod?.type === 'bank'
            ? `${selectedMethod.data.bankName} (Bank Transfer)`
            : '';

    const hasAnyOptions = cryptoOptions.length > 0 || bankOptions.length > 0 || wireOptions.length > 0 || directOptions.length > 0 || true; // Gift card always available

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
            {/* Header */}
            <div className="mb-10 text-center relative">
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
                    Fund Account
                </h1>
                <div className="mt-4 flex items-center justify-center gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-red-500" : i < step ? "w-4 bg-red-500/40" : "w-4 bg-white/10"}`} />
                    ))}
                </div>
            </div>

            <div className="relative min-h-[400px]">
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
                            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Enter Amount</h2>
                            <p className="text-xs text-white/40 mb-8 uppercase tracking-widest">How much would you like to deposit?</p>

                            <div className="relative mb-10">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/40">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="1"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-6 pl-12 pr-6 text-3xl font-bold text-white outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!amount || Number(amount) <= 0}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
                            >
                                Continue to Payment
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: SELECT PAYMENT METHOD */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/[0.02] border border-white/[0.05] p-6 sm:p-10 rounded-2xl glass"
                        >
                            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Select Payment Method</h2>
                            <p className="text-xs text-white/40 mb-8 uppercase tracking-widest">Choose how you would like to fund your account</p>

                            {optionsLoading && (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader2 className="w-8 h-8 text-white/40 animate-spin mb-4" />
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Loading payment options...</p>
                                </div>
                            )}

                            {!optionsLoading && !hasAnyOptions && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                                        <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">No Payment Methods Available</h3>
                                    <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                                        Payment options have not been configured. Please contact support for assistance.
                                    </p>
                                </div>
                            )}

                            {!optionsLoading && hasAnyOptions && (
                                <>
                                    {/* Crypto Options */}
                                    {cryptoOptions.length > 0 && (
                                        <div className="mb-8">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Cryptocurrency</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {cryptoOptions.map((crypto) => {
                                                    const style = getTickerStyle(crypto.ticker);
                                                    const isSelected = selectedMethod?.type === 'crypto' && selectedMethod.data.id === crypto.id;
                                                    return (
                                                        <button
                                                            key={crypto.id}
                                                            onClick={() => setSelectedMethod({ type: 'crypto', data: crypto })}
                                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border overflow-hidden transition-all duration-300 ${isSelected
                                                                ? "border-red-500 bg-red-500/10"
                                                                : "border-white/[0.05] bg-black/40 hover:bg-white/[0.05] hover:border-white/20"
                                                            }`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-full ${style.bg} ${style.color} flex items-center justify-center mb-3 overflow-hidden`}>
                                                                <span className="font-bold text-sm tracking-wider truncate max-w-[40px] text-center">{crypto.ticker}</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-white tracking-widest uppercase text-center w-full truncate">{crypto.network}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bank Options */}
                                    {bankOptions.length > 0 && (
                                        <div className="mb-8">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Bank Transfer</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {bankOptions.map((bank) => {
                                                    const isSelected = selectedMethod?.type === 'bank' && selectedMethod.data.id === bank.id;
                                                    return (
                                                        <button
                                                            key={bank.id}
                                                            onClick={() => setSelectedMethod({ type: 'bank', data: bank })}
                                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${isSelected
                                                                ? "border-red-500 bg-red-500/10"
                                                                : "border-white/[0.05] bg-black/40 hover:bg-white/[0.05] hover:border-white/20"
                                                            }`}
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                                <Landmark className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-white tracking-widest uppercase">{bank.bankName}</div>
                                                                <div className="text-[10px] text-white/40 tracking-widest mt-0.5">{bank.currency} · Bank Transfer</div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Direct Payment Options (PayPal / CashApp / Zelle) */}
                                    {directOptions.length > 0 && (
                                        <div className="mb-8">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">PayPal / CashApp / Zelle</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {directOptions.map((dp) => {
                                                    const isSelected = selectedMethod?.type === 'direct' && selectedMethod.data.id === dp.id;
                                                    const typeColors: Record<string, { color: string; bg: string }> = {
                                                        paypal: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                                        cashapp: { color: 'text-green-400', bg: 'bg-green-500/10' },
                                                        zelle: { color: 'text-purple-400', bg: 'bg-purple-500/10' },
                                                    };
                                                    const colors = typeColors[dp.type] || typeColors.paypal;
                                                    const label = dp.type === 'cashapp' ? 'CashApp' : dp.type === 'paypal' ? 'PayPal' : 'Zelle';
                                                    return (
                                                        <button
                                                            key={dp.id}
                                                            onClick={() => setSelectedMethod({ type: 'direct', data: dp })}
                                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border overflow-hidden transition-all duration-300 ${isSelected
                                                                ? "border-red-500 bg-red-500/10"
                                                                : "border-white/[0.05] bg-black/40 hover:bg-white/[0.05] hover:border-white/20"
                                                            }`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-full ${colors.bg} ${colors.color} flex items-center justify-center mb-3`}>
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="text-xs font-bold text-white tracking-widest uppercase text-center w-full truncate">{label}</div>
                                                            {dp.displayName && <div className="text-[10px] text-white/40 tracking-wider mt-0.5 truncate w-full text-center">{dp.displayName}</div>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Wire Transfer Options */}
                                    {wireOptions.length > 0 && (
                                        <div className="mb-8">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Wire Transfer</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {wireOptions.map((wire) => {
                                                    const isSelected = selectedMethod?.type === 'wire' && selectedMethod.data.id === wire.id;
                                                    return (
                                                        <button
                                                            key={wire.id}
                                                            onClick={() => setSelectedMethod({ type: 'wire', data: wire })}
                                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${isSelected
                                                                ? "border-red-500 bg-red-500/10"
                                                                : "border-white/[0.05] bg-black/40 hover:bg-white/[0.05] hover:border-white/20"
                                                            }`}
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                                                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-white tracking-widest uppercase">{wire.bankName}</div>
                                                                <div className="text-[10px] text-white/40 tracking-widest mt-0.5">{wire.currency} · Wire Transfer</div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Gift Card Option */}
                                    <div className="mb-8">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Gift Card</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <button
                                                onClick={() => setSelectedMethod({ type: 'giftcard' })}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border overflow-hidden transition-all duration-300 ${selectedMethod?.type === 'giftcard'
                                                    ? "border-red-500 bg-red-500/10"
                                                    : "border-white/[0.05] bg-black/40 hover:bg-white/[0.05] hover:border-white/20"
                                                }`}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                                                    <Gift className="w-5 h-5" />
                                                </div>
                                                <div className="text-xs font-bold text-white tracking-widest uppercase text-center w-full truncate">Gift Card</div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selected Method Details */}
                                    {selectedMethod?.type === 'crypto' && (
                                        <motion.div
                                            key="crypto-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-black/60 border border-red-500/30 rounded-xl p-6 mb-8 flex flex-col items-center"
                                        >
                                            <p className="text-xs text-white/40 uppercase tracking-widest mb-6 text-center">Scan to send exactly <strong className="text-white">${amount}</strong></p>

                                            <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                                <QRCode
                                                    value={selectedMethod.data.walletAddress}
                                                    size={160}
                                                    level="Q"
                                                    className="w-40 h-40 md:w-48 md:h-48"
                                                />
                                            </div>

                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">Or copy address</p>

                                            <button
                                                onClick={() => handleCopyAddress(selectedMethod.data.walletAddress)}
                                                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 py-3 px-4 rounded-lg flex items-center justify-between gap-4 transition-all group active:scale-[0.98]"
                                                title="Tap to copy"
                                            >
                                                <div className="flex-1 text-sm sm:text-base font-bold text-white tracking-wider truncate font-mono">
                                                    {selectedMethod.data.walletAddress}
                                                </div>
                                                <div className="shrink-0 text-white/40 group-hover:text-white transition-colors">
                                                    {qrCopied
                                                        ? <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                    }
                                                </div>
                                            </button>
                                            {qrCopied && <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-2 animate-pulse">Copied to clipboard!</span>}

                                            <p className="text-[10px] text-red-500/80 mt-6 uppercase tracking-widest font-bold text-center">Warning: Send only {selectedMethod.data.network} to this address.</p>
                                        </motion.div>
                                    )}

                                    {selectedMethod?.type === 'bank' && (
                                        <motion.div
                                            key="bank-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-black/60 border border-blue-500/30 rounded-xl p-6 mb-8"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                    <Landmark className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-widest">{selectedMethod.data.bankName}</p>
                                                    <p className="text-[10px] text-white/40 tracking-widest uppercase">Transfer exactly <strong className="text-white">${amount}</strong> to this account</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <CopyField label="Account Name" value={selectedMethod.data.accountName} />
                                                <CopyField label="Account Number" value={selectedMethod.data.accountNumber} />
                                                {selectedMethod.data.accountType && (
                                                    <CopyField label="Account Type" value={selectedMethod.data.accountType} />
                                                )}
                                                {selectedMethod.data.routingNumber && (
                                                    <CopyField label="Routing Number" value={selectedMethod.data.routingNumber} />
                                                )}
                                                {selectedMethod.data.iban && (
                                                    <CopyField label="IBAN" value={selectedMethod.data.iban} />
                                                )}
                                                {selectedMethod.data.swiftCode && (
                                                    <CopyField label="SWIFT / BIC" value={selectedMethod.data.swiftCode} />
                                                )}
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Currency</div>
                                                    <div className="text-sm font-mono text-white/70 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg">{selectedMethod.data.currency}</div>
                                                </div>
                                            </div>

                                            {selectedMethod.data.instructions && (
                                                <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-1">Instructions</p>
                                                    <p className="text-xs text-white/60 leading-relaxed">{selectedMethod.data.instructions}</p>
                                                </div>
                                            )}

                                            <p className="text-[10px] text-blue-400/80 mt-4 uppercase tracking-widest font-bold text-center">After transferring, upload your payment receipt on the next step.</p>
                                        </motion.div>
                                    )}

                                    {selectedMethod?.type === 'direct' && (
                                        <motion.div
                                            key="direct-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className={`border rounded-xl p-6 mb-8 ${selectedMethod.data.type === 'paypal' ? 'bg-black/60 border-blue-500/30' : selectedMethod.data.type === 'cashapp' ? 'bg-black/60 border-green-500/30' : 'bg-black/60 border-purple-500/30'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedMethod.data.type === 'paypal' ? 'bg-blue-500/10' : selectedMethod.data.type === 'cashapp' ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                                                    <svg className={`w-5 h-5 ${selectedMethod.data.type === 'paypal' ? 'text-blue-400' : selectedMethod.data.type === 'cashapp' ? 'text-green-400' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-widest">{selectedMethod.data.type === 'cashapp' ? 'CashApp' : selectedMethod.data.type === 'paypal' ? 'PayPal' : 'Zelle'}</p>
                                                    <p className="text-[10px] text-white/40 tracking-widest uppercase">Send exactly <strong className="text-white">${amount}</strong> to this account</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <CopyField label="Send To" value={selectedMethod.data.identifier} />
                                                {selectedMethod.data.displayName && (
                                                    <div>
                                                        <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Account Name</div>
                                                        <div className="text-sm font-mono text-white/70 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg">{selectedMethod.data.displayName}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedMethod.data.instructions && (
                                                <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-1">Instructions</p>
                                                    <p className="text-xs text-white/60 leading-relaxed">{selectedMethod.data.instructions}</p>
                                                </div>
                                            )}

                                            <p className={`text-[10px] mt-4 uppercase tracking-widest font-bold text-center ${selectedMethod.data.type === 'paypal' ? 'text-blue-400/80' : selectedMethod.data.type === 'cashapp' ? 'text-green-400/80' : 'text-purple-400/80'}`}>After sending, upload your payment receipt on the next step.</p>
                                        </motion.div>
                                    )}

                                    {selectedMethod?.type === 'wire' && (
                                        <motion.div
                                            key="wire-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-black/60 border border-violet-500/30 rounded-xl p-6 mb-8"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-widest">{selectedMethod.data.bankName}</p>
                                                    <p className="text-[10px] text-white/40 tracking-widest uppercase">Wire exactly <strong className="text-white">${amount}</strong> to this account</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <CopyField label="Beneficiary Name" value={selectedMethod.data.beneficiaryName} />
                                                {selectedMethod.data.beneficiaryAddress && (
                                                    <CopyField label="Beneficiary Address" value={selectedMethod.data.beneficiaryAddress} />
                                                )}
                                                <CopyField label="Bank Name" value={selectedMethod.data.bankName} />
                                                {selectedMethod.data.bankAddress && (
                                                    <CopyField label="Bank Address" value={selectedMethod.data.bankAddress} />
                                                )}
                                                <CopyField label="SWIFT / BIC Code" value={selectedMethod.data.swiftCode} />
                                                <CopyField label="Account Number" value={selectedMethod.data.accountNumber} />
                                                {selectedMethod.data.accountType && (
                                                    <CopyField label="Account Type" value={selectedMethod.data.accountType} />
                                                )}
                                                {selectedMethod.data.routingNumber && (
                                                    <CopyField label="Routing Number" value={selectedMethod.data.routingNumber} />
                                                )}
                                                {selectedMethod.data.iban && (
                                                    <CopyField label="IBAN" value={selectedMethod.data.iban} />
                                                )}
                                                <div>
                                                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Currency</div>
                                                    <div className="text-sm font-mono text-white/70 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg">{selectedMethod.data.currency}</div>
                                                </div>
                                                {selectedMethod.data.referenceNote && (
                                                    <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-lg">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400/80 mb-1">Payment Reference</p>
                                                        <p className="text-xs text-white/60 font-mono">{selectedMethod.data.referenceNote}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedMethod.data.instructions && (
                                                <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-1">Instructions</p>
                                                    <p className="text-xs text-white/60 leading-relaxed">{selectedMethod.data.instructions}</p>
                                                </div>
                                            )}

                                            <p className="text-[10px] text-violet-400/80 mt-4 uppercase tracking-widest font-bold text-center">After wiring, upload your payment receipt on the next step.</p>
                                        </motion.div>
                                    )}

                                    {selectedMethod?.type === 'giftcard' && (
                                        <motion.div
                                            key="giftcard-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-black/60 border border-amber-500/30 rounded-xl p-6 mb-8"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                    <Gift className="w-5 h-5 text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-widest">Gift Card Payment</p>
                                                    <p className="text-[10px] text-white/40 tracking-widest uppercase">Deposit <strong className="text-white">${amount}</strong> via gift card</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 mb-2">Instructions</p>
                                                    <ol className="text-xs text-white/60 leading-relaxed space-y-2 list-decimal list-inside">
                                                        <li>Purchase a gift card of the equivalent deposit value.</li>
                                                        <li>Scratch the card to reveal the redemption code — <strong className="text-white">do NOT redeem it</strong>.</li>
                                                        <li>Take a clear photo of the <strong className="text-white">front of the card</strong> showing the revealed code.</li>
                                                        <li>On the next step, upload the photo for verification.</li>
                                                    </ol>
                                                </div>

                                                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/80 mb-1">Important</p>
                                                    <p className="text-xs text-white/50 leading-relaxed">The gift card must be <strong className="text-white">unused and unredeemed</strong>. Redeemed or invalid cards will be rejected. Ensure the code is clearly visible in the photo.</p>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-amber-400/80 mt-4 uppercase tracking-widest font-bold text-center">Proceed to the next step to upload your gift card image.</p>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleNext}
                                        disabled={!selectedMethod}
                                        className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
                                    >
                                        {selectedMethod?.type === 'giftcard' ? 'Continue to Upload' : 'I Have Made Payment'}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 3: UPLOAD PROOF */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/[0.02] border border-white/[0.05] p-6 sm:p-10 rounded-2xl glass"
                        >
                            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">
                                {selectedMethod?.type === 'giftcard' ? 'Upload Gift Card' : 'Verify Transfer'}
                            </h2>
                            <p className="text-xs text-white/40 mb-8 uppercase tracking-widest">
                                {selectedMethod?.type === 'giftcard'
                                    ? 'Upload a clear photo of your scratched, unused gift card showing the redemption code'
                                    : 'Upload a screenshot of your successful transaction'}
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <div
                                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors mb-4 cursor-pointer ${file ? "border-green-500 bg-green-500/5" : "border-white/20 bg-black/40 hover:bg-white/5 hover:border-white/40"}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {file ? (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-black mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div className="text-sm font-bold text-green-500 uppercase tracking-widest">{selectedMethod?.type === 'giftcard' ? 'Gift Card Attached' : 'Proof Attached'}</div>
                                        <div className="text-xs text-white/40 mt-2 truncate w-full max-w-[200px]">{file.name}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        </div>
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Click to Upload Image</div>
                                        <div className="text-xs text-white/40 mt-2">JPG or PNG (Max 5MB)</div>
                                    </>
                                )}
                            </div>

                            {errorMsg && (
                                <p className="text-xs text-red-400 text-center mb-6 font-bold uppercase tracking-widest">{errorMsg}</p>
                            )}

                            <button
                                onClick={handleSubmitDeposit}
                                disabled={!file || loading}
                                className="mt-4 w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-green-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                                ) : (
                                    "Submit for Verification"
                                )}
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/[0.02] border border-white/[0.08] p-10 sm:p-16 rounded-3xl glass text-center flex flex-col items-center justify-center min-h-[400px]"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
                                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-black relative z-10 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                                Deposit Submitted
                            </h2>
                            <p className="text-sm text-white/50 mb-10 leading-relaxed max-w-md mx-auto">
                                Your deposit of <strong className="text-white">${amount}</strong> via {methodLabel} has been securely uploaded. An administrator will review your payment proof shortly. Once approved, the funds will reflect in your Active Balance automatically.
                            </p>

                            <Link
                                href="/dashboard"
                                className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold uppercase tracking-widest py-4 px-8 rounded-xl transition-all"
                            >
                                Return to Dashboard
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { Upload, ChevronLeft, Copy, Check, Landmark } from "lucide-react";

type PayMethod = "crypto" | "bank" | "wire";

function CopyField({ label, value, isDashboard }: { label: string; value: string; isDashboard: boolean }) {
    const [copied, setCopied] = useState(false);
    const handle = async () => {
        try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
    };
    return (
        <div>
            <div className={`text-[10px] tracking-widest uppercase mb-1 ${isDashboard ? "text-white/40" : "text-black/40"}`}>{label}</div>
            <button
                onClick={handle}
                className={`w-full flex items-center justify-between gap-3 border rounded-lg px-4 py-2.5 transition-all group active:scale-[0.98] ${isDashboard ? "bg-white/5 hover:bg-white/10 border-white/10" : "bg-black/5 hover:bg-black/10 border-black/10"}`}
                title="Tap to copy"
            >
                <span className={`text-sm font-mono truncate ${isDashboard ? "text-white/80" : "text-black/70"}`}>{value}</span>
                <span className={`shrink-0 transition-colors ${isDashboard ? "text-white/40 group-hover:text-white" : "text-black/40 group-hover:text-black"}`}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </span>
            </button>
            {copied && <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-1 block">Copied!</span>}
        </div>
    );
}

export default function OrderConfigurator({
    product,
    details,
    cryptoWallets = [],
    bankOptions = [],
    wireOptions = [],
    isDashboard = false,
}: {
    product: any;
    details: any;
    cryptoWallets?: any[];
    bankOptions?: any[];
    wireOptions?: any[];
    isDashboard?: boolean;
}) {
    const router = useRouter();

    const variants = (details?.variants && details.variants.length > 0) ? details.variants : [
        { name: "Standard", cashPrice: product.baseCashPrice || 0, financePrice: Math.round((product.baseCashPrice || 0) / 72) }
    ];

    // ----- State -----
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "FINANCE">("CASH");
    const [shipping, setShipping] = useState({ street: "", city: "", state: "", zipCode: "" });

    // Payment method type in step 3
    const [payMethod, setPayMethod] = useState<PayMethod>(() => {
        if (cryptoWallets.length > 0) return "crypto";
        if (bankOptions.length > 0) return "bank";
        return "wire";
    });
    const [selectedCryptoId, setSelectedCryptoId] = useState<string>(cryptoWallets[0]?._id || "");
    const [selectedBankId, setSelectedBankId] = useState<string>(bankOptions[0]?._id || "");
    const [selectedWireId, setSelectedWireId] = useState<string>(wireOptions[0]?._id || "");

    const [paymentProofUrl, setPaymentProofUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const selectedVariant = variants[selectedVariantIdx];
    const shippingFee = product.category === "VEHICLE" ? (details?.shippingFee ?? 500) : 0;
    const amountDue = paymentMethod === "CASH"
        ? (selectedVariant.cashPrice || 0) + shippingFee
        : (details?.minimumDownPayment || 4500) + shippingFee;

    const activeCrypto = cryptoWallets.find((c: any) => c._id === selectedCryptoId) || cryptoWallets[0];
    const activeBank = bankOptions.find((b: any) => b._id === selectedBankId) || bankOptions[0];
    const activeWire = wireOptions.find((w: any) => w._id === selectedWireId) || wireOptions[0];

    const hasAnyPayment = cryptoWallets.length > 0 || bankOptions.length > 0 || wireOptions.length > 0;

    // ----- Helpers -----
    const handleNextStep = () => {
        if (step === 2 && (!shipping.street || !shipping.city || !shipping.state || !shipping.zipCode)) {
            setError("Please fill in all shipping details.");
            return;
        }
        setError("");
        setStep((prev) => (prev + 1) as any);
    };

    const handlePrevStep = () => { setError(""); setStep((prev) => (prev - 1) as any); };

    const handleCopyCrypto = () => {
        if (activeCrypto?.walletAddress) {
            navigator.clipboard.writeText(activeCrypto.walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "deposit_proofs");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "do2jdvxzh"}/image/upload`, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setPaymentProofUrl(data.secure_url);
        } catch { setError("Failed to upload image. Please try again."); }
        finally { setIsUploading(false); }
    };

    const getPaymentLabel = () => {
        if (payMethod === "crypto") return activeCrypto?.ticker || "Crypto";
        if (payMethod === "bank") return `Bank Transfer — ${activeBank?.bankName || ""}`;
        return `Wire Transfer — ${activeWire?.bankName || ""}`;
    };

    const canSubmit = paymentProofUrl && !isUploading && (
        (payMethod === "crypto" && activeCrypto) ||
        (payMethod === "bank" && activeBank) ||
        (payMethod === "wire" && activeWire)
    );

    const handleOrder = async () => {
        if (!canSubmit) { setError("Please upload your payment receipt before submitting."); return; }
        setIsOrdering(true);
        setError("");
        try {
            const res = await fetch("/api/shop/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product._id,
                    paymentType: paymentMethod,
                    totalAmount: (selectedVariant.cashPrice || 0) + shippingFee,
                    downPaymentAmount: paymentMethod === "FINANCE" ? (details?.minimumDownPayment || 4500) + shippingFee : null,
                    monthlyPayment: paymentMethod === "FINANCE" ? selectedVariant.financePrice : null,
                    financeTermMonths: paymentMethod === "FINANCE" ? 72 : null,
                    variantName: selectedVariant.name,
                    shippingAddress: shipping,
                    selectedCrypto: getPaymentLabel(),
                    paymentProofUrl,
                    shipmentFee: shippingFee,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to place order");
            setOrderSuccess(true);
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err: any) { setError(err.message); }
        finally { setIsOrdering(false); }
    };

    // ----- Theme -----
    const bgMain = isDashboard ? "bg-[#0A0A0A] text-white" : "bg-[#F4F4F4] text-black";
    const bgSecondary = isDashboard ? "bg-[#111111]" : "bg-[#EBEBEB]";
    const textMuted = isDashboard ? "text-white/60" : "text-black/60";
    const textSub = isDashboard ? "text-white/50" : "text-black/50";
    const borderMuted = isDashboard ? "border-white/10" : "border-black/10";
    const inputStyle = isDashboard ? "bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-white/30" : "bg-black/5 border border-black/10 text-black placeholder-black/30 focus:border-black/30";
    const variantBorder = isDashboard ? "border-white/20 hover:border-white/40 hover:bg-white/5" : "border-black/20 hover:border-black/40 hover:bg-black/5";
    const variantActive = isDashboard ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500" : "border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500";
    const variantText = isDashboard ? "text-white" : "text-black";
    const tabContainer = isDashboard ? "bg-white/5" : "bg-black/5";
    const tabIdle = isDashboard ? "text-white/50 hover:text-white/80" : "text-black/50 hover:text-black/80";
    const tabActive = isDashboard ? "bg-white/10 text-white" : "bg-white text-black shadow-sm";

    return (
        <div className={`w-full ${isDashboard ? "min-h-full rounded-2xl md:overflow-hidden border border-white/5 shadow-2xl overflow-visible" : "min-h-[calc(100vh-60px)]"} flex flex-col md:flex-row ${bgMain}`}>

            {/* Left: Product Image */}
            <div className={`w-full md:w-3/5 lg:w-2/3 min-h-[280px] h-[35vh] md:h-auto relative ${bgSecondary} overflow-hidden ${isDashboard ? "" : "md:sticky md:top-[60px] md:h-[calc(100vh-60px)]"}`}>
                <Image
                    src={product.heroImage || "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Main-Hero-Desktop-LHD.jpg"}
                    alt={product.name} fill
                    className="object-cover object-center md:object-contain p-0 md:p-12 transition-transform duration-1000"
                    priority
                />
            </div>

            {/* Right: Configurator */}
            <div className={`w-full md:w-2/5 lg:w-1/3 p-6 sm:p-10 lg:p-14 ${isDashboard ? "md:max-h-[calc(100vh-120px)] md:overflow-y-auto overflow-visible" : ""}`}>
                <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto relative">

                    {step > 1 && (
                        <button onClick={handlePrevStep} className={`absolute -left-4 -top-4 p-2 rounded-full ${isDashboard ? "hover:bg-white/10" : "hover:bg-black/5"} transition-colors`}>
                            <ChevronLeft size={20} className={textSub} />
                        </button>
                    )}

                    <h1 className="text-4xl font-bold tracking-tight mb-2 mt-4 md:mt-0" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        {product.name}
                    </h1>
                    <p className={`text-sm font-medium mb-8 ${textMuted}`}>
                        {step === 1 ? (product.description || "The future of sustainability.") : step === 2 ? "Delivery Information" : "Complete Payment"}
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-sm text-center font-medium">{error}</div>
                    )}

                    <AnimatePresence>

                        {/* ── STEP 1: Configure ── */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                {product.category === "VEHICLE" && details?.rangeMiles && (
                                    <div className={`flex justify-between items-center mb-10 pb-6 border-b ${borderMuted}`}>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold tracking-tight">{details.rangeMiles}<span className="text-sm font-medium">mi</span></div>
                                            <div className={`text-[10px] uppercase tracking-widest mt-1 ${textSub}`}>Range (EPA)</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold tracking-tight">{details.topSpeed}<span className="text-sm font-medium">mph</span></div>
                                            <div className={`text-[10px] uppercase tracking-widest mt-1 ${textSub}`}>Top Speed</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold tracking-tight">{details.zeroToSixty}<span className="text-sm font-medium">s</span></div>
                                            <div className={`text-[10px] uppercase tracking-widest mt-1 ${textSub}`}>0-60 mph</div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-10">
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Select Variant</h3>
                                    <div className="flex flex-col gap-3">
                                        {variants.map((variant: any, idx: number) => (
                                            <button key={idx} onClick={() => setSelectedVariantIdx(idx)}
                                                className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all duration-300 ${selectedVariantIdx === idx ? variantActive : variantBorder}`}
                                            >
                                                <span className={`font-semibold ${selectedVariantIdx === idx ? variantText : textMuted}`}>{variant.name}</span>
                                                <span className={`text-sm font-medium ${textMuted}`}>${(variant.cashPrice || 0).toLocaleString()}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Payment Method</h3>
                                    <div className={`flex p-1 rounded-lg mb-6 ${tabContainer}`}>
                                        <button onClick={() => setPaymentMethod("CASH")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${paymentMethod === "CASH" ? tabActive : tabIdle}`}>Cash</button>
                                        {(details?.financeEligible !== false) && (
                                            <button onClick={() => setPaymentMethod("FINANCE")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${paymentMethod === "FINANCE" ? tabActive : tabIdle}`}>Finance</button>
                                        )}
                                    </div>

                                    <div className={`rounded-xl p-6 ${bgSecondary}`}>
                                        {paymentMethod === "CASH" ? (
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm font-semibold ${isDashboard ? "text-white/80" : "text-black/70"}`}>Vehicle Price</span>
                                                    <span className="text-xl font-bold">${(selectedVariant.cashPrice || 0).toLocaleString()}</span>
                                                </div>
                                                {shippingFee > 0 && (
                                                    <div className={`flex justify-between items-center border-t pt-3 ${borderMuted}`}>
                                                        <span className={`text-xs font-medium ${textMuted}`}>Shipping & Delivery</span>
                                                        <span className={`text-xs font-bold ${isDashboard ? "text-white/90" : "text-black/80"}`}>${shippingFee.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className={`flex justify-between items-center border-t pt-3 ${borderMuted}`}>
                                                    <span className={`text-sm font-bold ${isDashboard ? "text-white" : "text-black"}`}>Total</span>
                                                    <span className="text-xl font-bold">${amountDue.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm font-semibold ${isDashboard ? "text-white/80" : "text-black/70"}`}>Est. Monthly</span>
                                                    <span className="text-xl font-bold">${(selectedVariant.financePrice || 0).toLocaleString()} <span className={`text-sm font-medium ${textSub}`}>/mo</span></span>
                                                </div>
                                                <div className={`flex justify-between items-center border-t pt-3 mt-1 ${borderMuted}`}>
                                                    <span className={`text-xs font-medium ${textMuted}`}>Down Payment</span>
                                                    <span className={`text-xs font-bold ${isDashboard ? "text-white/90" : "text-black/80"}`}>${(details?.minimumDownPayment || 4500).toLocaleString()}</span>
                                                </div>
                                                {shippingFee > 0 && (
                                                    <div className={`flex justify-between items-center border-t pt-2 ${borderMuted}`}>
                                                        <span className={`text-xs font-medium ${textMuted}`}>Shipping</span>
                                                        <span className={`text-xs font-bold ${isDashboard ? "text-white/90" : "text-black/80"}`}>${shippingFee.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className={`flex justify-between items-center border-t pt-2 ${borderMuted}`}>
                                                    <span className={`text-xs font-bold ${isDashboard ? "text-white" : "text-black"}`}>Due Now</span>
                                                    <span className={`text-sm font-bold ${isDashboard ? "text-white" : "text-black"}`}>${amountDue.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}
                                        <p className={`text-[10px] mt-4 text-center ${isDashboard ? "text-white/30" : "text-black/40"}`}>Excludes taxes and fees.</p>
                                    </div>
                                </div>

                                <button onClick={handleNextStep} className="w-full py-4 rounded-xl text-sm font-bold tracking-[0.1em] uppercase transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]">
                                    Proceed to Shipping
                                </button>
                            </motion.div>
                        )}

                        {/* ── STEP 2: Shipping ── */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className={`p-4 rounded-lg mb-8 flex items-center justify-between ${isDashboard ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/10"}`}>
                                    <span className={`text-xs font-bold tracking-widest uppercase ${isDashboard ? "text-white/60" : "text-black/60"}`}>Shipping & Delivery</span>
                                    <span className={`text-sm font-bold ${isDashboard ? "text-white" : "text-black"}`}>{shippingFee > 0 ? `$${shippingFee.toLocaleString()}` : "Free"}</span>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>Street Address</label>
                                        <input type="text" value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} className={`w-full p-3 rounded-lg outline-none transition-all ${inputStyle}`} placeholder="123 Tesla Ave" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>City</label>
                                            <input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className={`w-full p-3 rounded-lg outline-none transition-all ${inputStyle}`} placeholder="Austin" />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>State</label>
                                            <input type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className={`w-full p-3 rounded-lg outline-none transition-all ${inputStyle}`} placeholder="TX" />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>Zip Code</label>
                                            <input type="text" value={shipping.zipCode} onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })} className={`w-full p-3 rounded-lg outline-none transition-all ${inputStyle}`} placeholder="78725" />
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleNextStep} className="w-full py-4 rounded-xl text-sm font-bold tracking-[0.1em] uppercase transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]">
                                    Proceed to Payment
                                </button>
                            </motion.div>
                        )}

                        {/* ── STEP 3: Payment ── */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>

                                {/* Amount due */}
                                <div className={`text-center py-6 mb-6 border-b ${borderMuted}`}>
                                    <span className={`block text-[10px] uppercase tracking-widest mb-2 ${textSub}`}>Total Amount Due Now</span>
                                    <span className="text-4xl font-bold">${amountDue.toLocaleString()}</span>
                                    <span className={`block text-xs mt-2 ${textMuted}`}>{paymentMethod === "CASH" ? "Full Cash Payment" : "Initial Down Payment"}</span>
                                </div>

                                {!hasAnyPayment ? (
                                    <div className={`p-6 mb-8 rounded-xl text-center text-sm ${tabContainer} ${textMuted}`}>
                                        No payment methods are currently available. Please contact support.
                                    </div>
                                ) : (
                                    <>
                                        {/* Payment method type selector */}
                                        <div className="mb-6">
                                            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Select Payment Method</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {cryptoWallets.length > 0 && (
                                                    <button
                                                        onClick={() => setPayMethod("crypto")}
                                                        className={`p-3 rounded-xl border text-center transition-all ${payMethod === "crypto" ? variantActive : variantBorder}`}
                                                    >
                                                        <div className={`text-[10px] font-bold uppercase tracking-wider ${payMethod === "crypto" ? variantText : textMuted}`}>Crypto</div>
                                                    </button>
                                                )}
                                                {bankOptions.length > 0 && (
                                                    <button
                                                        onClick={() => setPayMethod("bank")}
                                                        className={`p-3 rounded-xl border text-center transition-all ${payMethod === "bank" ? variantActive : variantBorder}`}
                                                    >
                                                        <div className={`text-[10px] font-bold uppercase tracking-wider ${payMethod === "bank" ? variantText : textMuted}`}>Bank</div>
                                                    </button>
                                                )}
                                                {wireOptions.length > 0 && (
                                                    <button
                                                        onClick={() => setPayMethod("wire")}
                                                        className={`p-3 rounded-xl border text-center transition-all ${payMethod === "wire" ? variantActive : variantBorder}`}
                                                    >
                                                        <div className={`text-[10px] font-bold uppercase tracking-wider ${payMethod === "wire" ? variantText : textMuted}`}>Wire</div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* ── Crypto details ── */}
                                        {payMethod === "crypto" && (
                                            <div className="mb-6">
                                                <div className="grid grid-cols-2 gap-3 mb-5">
                                                    {cryptoWallets.map((wallet: any) => (
                                                        <button key={wallet._id} onClick={() => setSelectedCryptoId(wallet._id)}
                                                            className={`p-3 rounded-xl border text-center transition-all ${selectedCryptoId === wallet._id ? variantActive : variantBorder}`}
                                                        >
                                                            <div className={`font-bold ${selectedCryptoId === wallet._id ? variantText : textMuted}`}>{wallet.ticker}</div>
                                                            <div className={`text-[10px] uppercase ${textSub}`}>{wallet.network}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {activeCrypto && (
                                                    <div className={`p-5 rounded-2xl flex flex-col items-center border ${borderMuted} ${tabContainer}`}>
                                                        <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                                                            <QRCode value={activeCrypto.walletAddress} size={140} />
                                                        </div>
                                                        <div className={`text-[10px] uppercase tracking-widest mb-3 ${textSub}`}>
                                                            Send EXACTLY <span className="text-black font-bold bg-yellow-400 px-1 rounded">${amountDue.toLocaleString()}</span>
                                                        </div>
                                                        <div className={`w-full flex items-center justify-between p-3 rounded-lg ${isDashboard ? "bg-[#1A1A1A]" : "bg-white"}`}>
                                                            <span className={`text-xs truncate mr-2 ${textMuted}`}>{activeCrypto.walletAddress}</span>
                                                            <button onClick={handleCopyCrypto} className={`p-1.5 rounded-md transition-colors ${isDashboard ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"}`}>
                                                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                        {copied && <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-2">Copied!</span>}
                                                        <p className="text-[10px] text-red-500/80 mt-4 uppercase tracking-widest font-bold text-center">
                                                            Send only {activeCrypto.network} to this address.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Bank transfer details ── */}
                                        {payMethod === "bank" && (
                                            <div className="mb-6">
                                                {bankOptions.length > 1 && (
                                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                                        {bankOptions.map((b: any) => (
                                                            <button key={b._id} onClick={() => setSelectedBankId(b._id)}
                                                                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${selectedBankId === b._id ? variantActive : variantBorder}`}
                                                            >
                                                                <Landmark className={`w-4 h-4 shrink-0 ${selectedBankId === b._id ? "text-blue-400" : textMuted}`} />
                                                                <div>
                                                                    <div className={`text-[10px] font-bold uppercase ${selectedBankId === b._id ? variantText : textMuted}`}>{b.bankName}</div>
                                                                    <div className={`text-[9px] ${textSub}`}>{b.currency}</div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {activeBank && (
                                                    <div className={`p-5 rounded-2xl border border-blue-500/20 space-y-3 ${isDashboard ? "bg-blue-500/5" : "bg-blue-50/30"}`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Landmark className="w-4 h-4 text-blue-400" />
                                                            <p className={`text-xs font-bold uppercase tracking-widest ${isDashboard ? "text-white" : "text-black"}`}>{activeBank.bankName}</p>
                                                        </div>
                                                        <CopyField label="Account Name" value={activeBank.accountName} isDashboard={isDashboard} />
                                                        <CopyField label="Account Number" value={activeBank.accountNumber} isDashboard={isDashboard} />
                                                        {activeBank.accountType && <CopyField label="Account Type" value={activeBank.accountType} isDashboard={isDashboard} />}
                                                        {activeBank.routingNumber && <CopyField label="Routing Number" value={activeBank.routingNumber} isDashboard={isDashboard} />}
                                                        {activeBank.iban && <CopyField label="IBAN" value={activeBank.iban} isDashboard={isDashboard} />}
                                                        {activeBank.swiftCode && <CopyField label="SWIFT / BIC" value={activeBank.swiftCode} isDashboard={isDashboard} />}
                                                        <div>
                                                            <div className={`text-[10px] tracking-widest uppercase mb-1 ${isDashboard ? "text-white/40" : "text-black/40"}`}>Currency</div>
                                                            <div className={`text-sm font-mono px-4 py-2.5 border rounded-lg ${isDashboard ? "text-white/70 bg-white/5 border-white/10" : "text-black/70 bg-black/5 border-black/10"}`}>{activeBank.currency}</div>
                                                        </div>
                                                        {activeBank.instructions && (
                                                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-1">Instructions</p>
                                                                <p className={`text-xs leading-relaxed ${textSub}`}>{activeBank.instructions}</p>
                                                            </div>
                                                        )}
                                                        <p className="text-[10px] text-blue-400/80 uppercase tracking-widest font-bold text-center pt-1">
                                                            Transfer exactly ${amountDue.toLocaleString()} and upload your receipt below.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Wire transfer details ── */}
                                        {payMethod === "wire" && (
                                            <div className="mb-6">
                                                {wireOptions.length > 1 && (
                                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                                        {wireOptions.map((w: any) => (
                                                            <button key={w._id} onClick={() => setSelectedWireId(w._id)}
                                                                className={`p-3 rounded-xl border text-left transition-all ${selectedWireId === w._id ? variantActive : variantBorder}`}
                                                            >
                                                                <div className={`text-[10px] font-bold uppercase ${selectedWireId === w._id ? variantText : textMuted}`}>{w.bankName}</div>
                                                                <div className={`text-[9px] ${textSub}`}>{w.currency}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {activeWire && (
                                                    <div className={`p-5 rounded-2xl border border-violet-500/20 space-y-3 ${isDashboard ? "bg-violet-500/5" : "bg-violet-50/30"}`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className={`text-xs font-bold uppercase tracking-widest ${isDashboard ? "text-white" : "text-black"}`}>{activeWire.bankName}</p>
                                                        </div>
                                                        <CopyField label="Beneficiary Name" value={activeWire.beneficiaryName} isDashboard={isDashboard} />
                                                        {activeWire.beneficiaryAddress && <CopyField label="Beneficiary Address" value={activeWire.beneficiaryAddress} isDashboard={isDashboard} />}
                                                        <CopyField label="Bank Name" value={activeWire.bankName} isDashboard={isDashboard} />
                                                        {activeWire.bankAddress && <CopyField label="Bank Address" value={activeWire.bankAddress} isDashboard={isDashboard} />}
                                                        <CopyField label="SWIFT / BIC" value={activeWire.swiftCode} isDashboard={isDashboard} />
                                                        <CopyField label="Account Number" value={activeWire.accountNumber} isDashboard={isDashboard} />
                                                        {activeWire.accountType && <CopyField label="Account Type" value={activeWire.accountType} isDashboard={isDashboard} />}
                                                        {activeWire.routingNumber && <CopyField label="Routing Number" value={activeWire.routingNumber} isDashboard={isDashboard} />}
                                                        {activeWire.iban && <CopyField label="IBAN" value={activeWire.iban} isDashboard={isDashboard} />}
                                                        <div>
                                                            <div className={`text-[10px] tracking-widest uppercase mb-1 ${isDashboard ? "text-white/40" : "text-black/40"}`}>Currency</div>
                                                            <div className={`text-sm font-mono px-4 py-2.5 border rounded-lg ${isDashboard ? "text-white/70 bg-white/5 border-white/10" : "text-black/70 bg-black/5 border-black/10"}`}>{activeWire.currency}</div>
                                                        </div>
                                                        {activeWire.referenceNote && (
                                                            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400/80 mb-1">Payment Reference</p>
                                                                <p className={`text-xs font-mono leading-relaxed ${textSub}`}>{activeWire.referenceNote}</p>
                                                            </div>
                                                        )}
                                                        {activeWire.instructions && (
                                                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-1">Instructions</p>
                                                                <p className={`text-xs leading-relaxed ${textSub}`}>{activeWire.instructions}</p>
                                                            </div>
                                                        )}
                                                        <p className="text-[10px] text-violet-400/80 uppercase tracking-widest font-bold text-center pt-1">
                                                            Wire exactly ${amountDue.toLocaleString()} and upload your receipt below.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Upload receipt */}
                                        <div className="mb-8">
                                            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Upload Payment Receipt</h3>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentProofUrl
                                                    ? (isDashboard ? "border-green-500/50 bg-green-500/5" : "border-green-500/50 bg-green-50")
                                                    : isDashboard ? "border-white/20 hover:border-white/40 hover:bg-white/5" : "border-black/20 hover:border-black/40 hover:bg-black/5"
                                                }`}
                                            >
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                                                {isUploading ? (
                                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                                                ) : paymentProofUrl ? (
                                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10 group">
                                                        <Image src={paymentProofUrl} alt="Receipt" fill className="object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                            <Upload className="w-6 h-6 text-white mb-2" />
                                                            <span className="text-xs font-bold text-white uppercase tracking-widest">Replace Image</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className={`w-8 h-8 mb-3 ${textSub}`} />
                                                        <span className={`text-sm font-medium ${textMuted}`}>Click to upload screenshot</span>
                                                        <span className={`text-[10px] mt-2 ${textSub}`}>JPG, PNG, WEBP</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleOrder}
                                            disabled={isOrdering || orderSuccess || !canSubmit}
                                            className={`w-full py-4 rounded-xl text-sm font-bold tracking-[0.1em] uppercase transition-all flex justify-center items-center ${orderSuccess ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"} disabled:opacity-70 disabled:cursor-not-allowed`}
                                        >
                                            {orderSuccess ? "Order Submitted" : isOrdering ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : "Submit Order for Review"}
                                        </button>
                                        <p className={`text-[10px] text-center mt-4 leading-relaxed ${textSub}`}>
                                            Your order will be reviewed and approved once your payment is verified.
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

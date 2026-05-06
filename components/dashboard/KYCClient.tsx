"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ShieldCheck, Clock, CheckCircle2, XCircle, FileImage, ArrowRight, Loader2 } from "lucide-react";
import { submitKYC } from "@/app/dashboard/actions/kyc";

interface KYCClientProps {
    kycStatus: string;
    kycFrontImage: string;
    kycBackImage: string;
}

export default function KYCClient({ kycStatus, kycFrontImage, kycBackImage }: KYCClientProps) {
    const [frontPreview, setFrontPreview] = useState<string | null>(kycFrontImage || null);
    const [backPreview, setBackPreview] = useState<string | null>(kycBackImage || null);
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(kycStatus);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

    const handleFileSelect = (side: "front" | "back", file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (side === "front") {
                setFrontPreview(reader.result as string);
                setFrontFile(file);
            } else {
                setBackPreview(reader.result as string);
                setBackFile(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "kyc_documents");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Image upload failed.");
        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async () => {
        if (!frontFile || !backFile) {
            setError("Please upload both the front and back of your ID.");
            return;
        }
        setError("");
        setUploading(true);

        try {
            const [frontUrl, backUrl] = await Promise.all([
                uploadToCloudinary(frontFile),
                uploadToCloudinary(backFile),
            ]);

            const result = await submitKYC(frontUrl, backUrl);

            if (result.success) {
                setSuccess(true);
                setCurrentStatus("pending");
            } else {
                setError(result.error || "Submission failed.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setUploading(false);
        }
    };

    // ------ VERIFIED STATE ------
    if (currentStatus === "verified") {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        KYC Verification
                    </h1>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-3">Identity Verified</h2>
                    <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
                        Your identity has been successfully verified. You now have full access to all platform features, including withdrawals.
                    </p>
                </motion.div>
            </div>
        );
    }

    // ------ PENDING STATE ------
    if (currentStatus === "pending" || success) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        KYC Verification
                    </h1>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.02] border border-yellow-500/20 rounded-2xl p-12 text-center">
                    <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-3">Pending Approval</h2>
                    <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-6">
                        Your identity documents have been submitted and are currently under review. This process typically takes 24-48 hours. You will be notified once verification is complete.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full">
                        <Clock className="w-3 h-3" /> Under Review
                    </div>
                </motion.div>
            </div>
        );
    }

    // ------ UPLOAD STATE (unverified) ------
    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    KYC Verification
                </h1>
                <p className="text-sm text-white/50 tracking-widest uppercase max-w-xl mx-auto leading-relaxed">
                    Upload a clear photo of the front and back of a valid government-issued ID (passport, driver's license, or national ID card).
                </p>
            </motion.div>

            {/* Upload Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {/* Front Upload */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className="cursor-pointer block group">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect("front", file);
                            }}
                        />
                        <div className={`relative border-2 border-dashed rounded-2xl aspect-[4/3] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${frontPreview ? "border-cyan-500/30 bg-white/[0.02]" : "border-white/10 hover:border-white/30 bg-white/[0.01]"}`}>
                            {frontPreview ? (
                                <>
                                    <img src={frontPreview} alt="Front Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change Image</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FileImage className="w-10 h-10 text-white/20 mb-3" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Front of ID</span>
                                    <span className="text-[9px] text-white/25 mt-1">Click to upload</span>
                                </>
                            )}
                        </div>
                    </label>
                    <div className="mt-3 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Document Front
                    </div>
                </motion.div>

                {/* Back Upload */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="cursor-pointer block group">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect("back", file);
                            }}
                        />
                        <div className={`relative border-2 border-dashed rounded-2xl aspect-[4/3] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${backPreview ? "border-cyan-500/30 bg-white/[0.02]" : "border-white/10 hover:border-white/30 bg-white/[0.01]"}`}>
                            {backPreview ? (
                                <>
                                    <img src={backPreview} alt="Back Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change Image</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FileImage className="w-10 h-10 text-white/20 mb-3" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Back of ID</span>
                                    <span className="text-[9px] text-white/25 mt-1">Click to upload</span>
                                </>
                            )}
                        </div>
                    </label>
                    <div className="mt-3 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Document Back
                    </div>
                </motion.div>
            </div>

            {/* Security Notice */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-8 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Secure Upload</h4>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                        Your documents are encrypted and stored securely. They are only used for identity verification purposes and will never be shared with third parties.
                    </p>
                </div>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-xs text-red-300">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleSubmit}
                disabled={uploading || !frontFile || !backFile}
                className="w-full flex items-center justify-center gap-3 bg-white text-black text-[11px] font-bold tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-cyan-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                {uploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading Documents...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" /> Submit for Verification
                    </>
                )}
            </motion.button>
        </div>
    );
}

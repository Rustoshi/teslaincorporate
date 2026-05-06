"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ChevronLeft, ChevronRight, Plus, X, Package,
    CheckCircle2, XCircle, Loader2, Trash2, Car, Zap, ImagePlus, Pencil
} from "lucide-react";
import { createProduct, deleteProduct, toggleProductActive, getProductDetails, updateProduct } from "@/app/admin/actions/inventory";
import { useRouter } from "next/navigation";

interface ProductItem {
    _id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    baseCashPrice: number;
    heroImage: string;
    isActive: boolean;
    createdAt: string;
}

interface VariantRow {
    name: string;
    cashPrice: string;
    financePrice: string;
}

const EMPTY_VARIANT: VariantRow = { name: "", cashPrice: "", financePrice: "" };

export default function InventoryClient({ products }: { products: ProductItem[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const itemsPerPage = 15;

    // Create form state
    const [formData, setFormData] = useState({
        name: "", slug: "", category: "VEHICLE" as "VEHICLE" | "ENERGY",
        description: "", baseCashPrice: "", heroImage: "",
        // Vehicle fields
        rangeMiles: "", topSpeed: "", zeroToSixty: "", shippingFee: "500",
        financeEligible: true, minimumDownPayment: "",
        // Energy fields
        energyType: "SOLAR" as "SOLAR" | "POWERWALL", capacityInfo: "", installationRequired: true,
    });
    const [variants, setVariants] = useState<VariantRow[]>([{ ...EMPTY_VARIANT }]);
    const [creating, setCreating] = useState(false);

    // Image upload state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);
        fd.append("folder", "shop_products");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST", body: fd,
        });
        if (!res.ok) throw new Error("Image upload failed.");
        const data = await res.json();
        return data.secure_url;
    };

    const handleImageSelect = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setImageFiles(prev => [...prev, ...newFiles]);
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setUploadedUrls(prev => prev.filter((_, i) => i !== index));
    };

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.slug.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === "all" || p.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, filterCategory]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
    const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const addVariant = () => setVariants(prev => [...prev, { ...EMPTY_VARIANT }]);
    const removeVariant = (index: number) => setVariants(prev => prev.filter((_, i) => i !== index));
    const updateVariant = (index: number, field: keyof VariantRow, value: string) => {
        setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
    };

    const resetForm = () => {
        setFormData({
            name: "", slug: "", category: "VEHICLE", description: "", baseCashPrice: "", heroImage: "",
            rangeMiles: "", topSpeed: "", zeroToSixty: "", shippingFee: "500",
            financeEligible: true, minimumDownPayment: "",
            energyType: "SOLAR", capacityInfo: "", installationRequired: true,
        });
        setVariants([{ ...EMPTY_VARIANT }]);
        setImageFiles([]);
        setImagePreviews([]);
        setUploadedUrls([]);
    };

    const handleCreate = async () => {
        if (!formData.name) {
            setFeedback({ type: "error", message: "Product name is required." });
            return;
        }
        setCreating(true);

        // Upload images to Cloudinary first
        let galleryUrls: string[] = [];
        if (imageFiles.length > 0) {
            try {
                setUploadingImages(true);
                galleryUrls = await Promise.all(imageFiles.map(f => uploadToCloudinary(f)));
                setUploadedUrls(galleryUrls);
                setUploadingImages(false);
            } catch (err: any) {
                setCreating(false);
                setUploadingImages(false);
                setFeedback({ type: "error", message: err.message || "Image upload failed." });
                return;
            }
        }

        const result = await createProduct({
            name: formData.name,
            slug: formData.slug || autoSlug(formData.name),
            category: formData.category,
            description: formData.description,
            baseCashPrice: formData.category === "ENERGY" ? parseFloat(formData.baseCashPrice) : 0,
            heroImage: formData.heroImage,
            gallery: galleryUrls,
            // Vehicle fields
            ...(formData.category === "VEHICLE" && {
                rangeMiles: parseInt(formData.rangeMiles) || 0,
                topSpeed: formData.topSpeed,
                zeroToSixty: formData.zeroToSixty,
                shippingFee: parseFloat(formData.shippingFee) || 500,
                financeEligible: formData.financeEligible,
                minimumDownPayment: formData.financeEligible ? parseFloat(formData.minimumDownPayment) || 0 : 0,
                variants: variants.map(v => ({
                    name: v.name,
                    cashPrice: parseFloat(v.cashPrice) || 0,
                    financePrice: parseFloat(v.financePrice) || 0,
                })),
            }),
            // Energy fields
            ...(formData.category === "ENERGY" && {
                energyType: formData.energyType,
                capacityInfo: formData.capacityInfo,
                installationRequired: formData.installationRequired,
                financeEligible: formData.financeEligible,
                minimumDownPayment: formData.financeEligible ? parseFloat(formData.minimumDownPayment) || 0 : 0,
                variants: variants.map(v => ({
                    name: v.name,
                    cashPrice: parseFloat(v.cashPrice) || 0,
                    financePrice: parseFloat(v.financePrice) || 0,
                })),
            }),
        });
        setCreating(false);
        if (result.success) {
            setFeedback({ type: "success", message: "Product created successfully." });
            setShowCreateModal(false);
            resetForm();
            router.refresh();
        } else {
            setFeedback({ type: "error", message: result.error || "Failed to create product." });
        }
    };

    const handleEdit = async (productId: string) => {
        setEditLoading(true);
        setLoadingId(productId);
        const result = await getProductDetails(productId);
        setEditLoading(false);
        setLoadingId(null);
        if (!result.success) {
            const errorMessage = "error" in result ? (result as any).error : "Failed to load product.";
            setFeedback({ type: "error", message: errorMessage });
            return;
        }
        const p = (result as any).product;
        const d = (result as any).details;
        setFormData({
            name: p.name,
            slug: p.slug,
            category: p.category as "VEHICLE" | "ENERGY",
            description: p.description,
            baseCashPrice: String(p.baseCashPrice ?? ""),
            heroImage: p.heroImage,
            rangeMiles: d?.rangeMiles != null ? String(d.rangeMiles) : "",
            topSpeed: d?.topSpeed ?? "",
            zeroToSixty: d?.zeroToSixty ?? "",
            shippingFee: d?.shippingFee != null ? String(d.shippingFee) : "500",
            financeEligible: d?.financeEligible ?? true,
            minimumDownPayment: d?.minimumDownPayment != null ? String(d.minimumDownPayment) : "",
            energyType: d?.energyType ?? "SOLAR",
            capacityInfo: d?.capacityInfo ?? "",
            installationRequired: d?.installationRequired ?? true,
        });
        const loadedVariants = (d?.variants || []).map((v: any) => ({
            name: String(v.name ?? ""),
            cashPrice: v.cashPrice != null ? String(v.cashPrice) : "",
            financePrice: v.financePrice != null ? String(v.financePrice) : "",
        }));
        setVariants(loadedVariants.length > 0 ? loadedVariants : [{ ...EMPTY_VARIANT }]);
        // Load existing gallery previews
        setImagePreviews(p.gallery || []);
        setUploadedUrls(p.gallery || []);
        setImageFiles([]);
        setEditingProductId(productId);
    };

    const handleUpdate = async () => {
        if (!formData.name || !editingProductId) {
            setFeedback({ type: "error", message: "Product name is required." });
            return;
        }
        setCreating(true);

        // Upload any NEW images to Cloudinary
        let galleryUrls = [...uploadedUrls];
        if (imageFiles.length > 0) {
            try {
                setUploadingImages(true);
                const newUrls = await Promise.all(imageFiles.map(f => uploadToCloudinary(f)));
                galleryUrls = [...galleryUrls, ...newUrls];
                setUploadingImages(false);
            } catch (err: any) {
                setCreating(false);
                setUploadingImages(false);
                setFeedback({ type: "error", message: err.message || "Image upload failed." });
                return;
            }
        }

        const result = await updateProduct(editingProductId, {
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            heroImage: formData.heroImage,
            gallery: galleryUrls,
            variants: variants.map(v => ({
                name: v.name,
                cashPrice: parseFloat(v.cashPrice) || 0,
                financePrice: parseFloat(v.financePrice) || 0,
            })),
            financeEligible: formData.financeEligible,
            minimumDownPayment: formData.financeEligible ? parseFloat(formData.minimumDownPayment) || 0 : 0,
            // Vehicle fields
            ...(formData.category === "VEHICLE" && {
                rangeMiles: parseInt(formData.rangeMiles) || 0,
                topSpeed: formData.topSpeed,
                zeroToSixty: formData.zeroToSixty,
                shippingFee: parseFloat(formData.shippingFee) || 500,
            }),
            // Energy fields
            ...(formData.category === "ENERGY" && {
                energyType: formData.energyType,
                capacityInfo: formData.capacityInfo,
                installationRequired: formData.installationRequired,
            }),
        });
        setCreating(false);
        if (result.success) {
            setFeedback({ type: "success", message: "Product updated successfully." });
            setEditingProductId(null);
            resetForm();
            router.refresh();
        } else {
            setFeedback({ type: "error", message: result.error || "Failed to update product." });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setLoadingId(id);
        const result = await deleteProduct(id);
        setLoadingId(null);
        if (result.success) {
            setFeedback({ type: "success", message: "Product deleted." });
            router.refresh();
        } else {
            setFeedback({ type: "error", message: result.error || "Delete failed." });
        }
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        setLoadingId(id);
        await toggleProductActive(id, !isActive);
        setLoadingId(null);
        router.refresh();
    };

    const vehicleCount = products.filter(p => p.category === "VEHICLE").length;
    const energyCount = products.filter(p => p.category === "ENERGY").length;

    const inputClasses = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors";
    const labelClasses = "text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2 block";
    const smallInputClasses = "w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Inventory
                    </h1>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        {products.length} total products
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        <Car className="w-3 h-3 inline mr-1" />{vehicleCount} Vehicles
                    </span>
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        <Zap className="w-3 h-3 inline mr-1" />{energyCount} Energy
                    </span>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by name or slug..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase tracking-widest font-bold focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    <option value="VEHICLE">Vehicles</option>
                    <option value="ENERGY">Energy</option>
                </select>
            </div>

            {/* Feedback Toast (z-[60] to appear above modals) */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className={`fixed top-20 right-6 z-[100] p-4 rounded-xl flex items-center gap-3 border shadow-2xl backdrop-blur-xl ${feedback.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
                    >
                        {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <p className={`text-xs ${feedback.type === "success" ? "text-green-300" : "text-red-300"}`}>{feedback.message}</p>
                        <button onClick={() => setFeedback(null)} className="ml-auto text-white/30 hover:text-white"><X className="w-3 h-3" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="p-16 text-center border border-white/[0.05] border-dashed rounded-2xl bg-white/[0.01]">
                    <Package className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">No Products Found</p>
                    <p className="text-xs text-white/20 mt-2">Try adjusting your search or add a new product.</p>
                </div>
            )}

            {/* Table */}
            {filtered.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-black/50">
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Product</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden md:table-cell">Slug</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Category</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Starting Price</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">Status</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase hidden lg:table-cell">Added</th>
                                    <th className="p-4 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((product, i) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * i }}
                                        className="border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 ${product.category === "VEHICLE" ? "bg-cyan-500/10 text-cyan-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                                    {product.category === "VEHICLE" ? <Car className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className="text-xs text-white font-bold tracking-wide block">{product.name}</span>
                                                    <span className="text-[10px] text-white/30 block md:hidden">{product.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-white/40 font-mono hidden md:table-cell">{product.slug}</td>
                                        <td className="p-4">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${product.category === "VEHICLE" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white font-bold font-mono">
                                            {product.baseCashPrice > 0 ? `$${product.baseCashPrice.toLocaleString()}` : "—"}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggle(product._id, product.isActive)}
                                                disabled={loadingId === product._id}
                                                className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${product.isActive ? "bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/20 hover:bg-red-500/30"}`}
                                            >
                                                {product.isActive ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="p-4 hidden lg:table-cell text-xs text-white/30 whitespace-nowrap">{formatDate(product.createdAt)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product._id)}
                                                    disabled={loadingId === product._id}
                                                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors disabled:opacity-50"
                                                >
                                                    {loadingId === product._id && editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    disabled={loadingId === product._id}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
                                                >
                                                    {loadingId === product._id && !editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 flex items-center justify-between border-t border-white/[0.06] bg-black/20">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                Page {currentPage} of {totalPages} • {filtered.length} products
                            </span>
                            <div className="flex gap-2">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronLeft className="w-4 h-4 text-white" />
                                </button>
                                <div className="hidden sm:flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;
                                        return (
                                            <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-colors ${currentPage === pageNum ? "bg-red-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}>
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ChevronRight className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Product Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                                <h3 className="text-sm font-bold text-white tracking-widest uppercase">Add Product</h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">


                                {/* General Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Product Name *</label>
                                        <input type="text" value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value, slug: autoSlug(e.target.value) }))}
                                            className={inputClasses} placeholder="e.g. Model S" />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Slug</label>
                                        <input type="text" value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            className={`${inputClasses} font-mono`} placeholder="auto-generated" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Description</label>
                                    <textarea value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className={`${inputClasses} resize-none h-20`} placeholder="Product description..." />
                                </div>

                                {/* Product Images */}
                                <div>
                                    <label className={labelClasses}>Product Images</label>
                                    <div className="flex flex-wrap gap-3">
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                                                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                                {idx === 0 && (
                                                    <span className="absolute bottom-0 left-0 right-0 bg-cyan-500/80 text-[7px] text-center text-white font-bold uppercase tracking-widest py-0.5">
                                                        Hero
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-20 h-20 rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <ImagePlus className="w-5 h-5 text-white/30" />
                                            <span className="text-[7px] text-white/30 font-bold uppercase tracking-wider">Add</span>
                                        </button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleImageSelect(e.target.files)}
                                    />
                                    <p className="text-[9px] text-white/25 mt-2">First image will be used as the hero image. Click to add multiple images.</p>
                                </div>
                                {/* Vehicle-specific fields */}
                                {formData.category === "VEHICLE" && (
                                    <div className="space-y-4 border-t border-white/[0.06] pt-4">
                                        <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest">Vehicle Specifications</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={labelClasses}>Range (miles)</label>
                                                <input type="number" value={formData.rangeMiles} onChange={(e) => setFormData(prev => ({ ...prev, rangeMiles: e.target.value }))} className={inputClasses} placeholder="e.g. 405" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Top Speed</label>
                                                <input type="text" value={formData.topSpeed} onChange={(e) => setFormData(prev => ({ ...prev, topSpeed: e.target.value }))} className={inputClasses} placeholder="e.g. 200 mph" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>0-60 mph</label>
                                                <input type="text" value={formData.zeroToSixty} onChange={(e) => setFormData(prev => ({ ...prev, zeroToSixty: e.target.value }))} className={inputClasses} placeholder="e.g. 1.99s" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Shipping Fee ($)</label>
                                            <input type="number" value={formData.shippingFee} onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: e.target.value }))} className={inputClasses} placeholder="e.g. 500" />
                                        </div>

                                        {/* Drivetrain Variants */}
                                        <div className="border-t border-white/[0.04] pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest">
                                                    Drivetrain Variants *
                                                </p>
                                                <button type="button" onClick={addVariant}
                                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                                                    <Plus className="w-3 h-3" /> Add Variant
                                                </button>
                                            </div>

                                            {/* Header row */}
                                            <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 mb-2">
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Drivetrain Name</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Cash Price</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">$/Month</span>
                                                <span></span>
                                            </div>

                                            {/* Variant rows */}
                                            <div className="space-y-2">
                                                {variants.map((variant, idx) => (
                                                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={variant.name}
                                                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                                                            className={smallInputClasses}
                                                            placeholder="e.g. Rear-Wheel Drive"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={variant.cashPrice}
                                                            onChange={(e) => updateVariant(idx, "cashPrice", e.target.value)}
                                                            className={smallInputClasses}
                                                            placeholder="39990"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={variant.financePrice}
                                                            onChange={(e) => updateVariant(idx, "financePrice", e.target.value)}
                                                            className={smallInputClasses}
                                                            placeholder="529"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVariant(idx)}
                                                            disabled={variants.length <= 1}
                                                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Finance options */}
                                        <div className="border-t border-white/[0.04] pt-4 space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={formData.financeEligible}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, financeEligible: e.target.checked }))}
                                                    className="w-4 h-4 rounded accent-cyan-500" />
                                                <span className="text-xs text-white/60">Finance Eligible</span>
                                            </label>
                                            {formData.financeEligible && (
                                                <div>
                                                    <label className={labelClasses}>Minimum Down Payment ($) *</label>
                                                    <input type="number" value={formData.minimumDownPayment}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, minimumDownPayment: e.target.value }))}
                                                        className={inputClasses} placeholder="e.g. 7849" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Energy-specific fields */}
                                {formData.category === "ENERGY" && (
                                    <div className="space-y-4 border-t border-white/[0.06] pt-4">
                                        <p className="text-[10px] text-yellow-400/70 font-bold uppercase tracking-widest">Energy Specifications</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClasses}>Energy Type</label>
                                                <select value={formData.energyType}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, energyType: e.target.value as any }))}
                                                    className={inputClasses}>
                                                    <option value="SOLAR">Solar</option>
                                                    <option value="POWERWALL">Powerwall</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Capacity Info</label>
                                                <input type="text" value={formData.capacityInfo}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, capacityInfo: e.target.value }))}
                                                    className={inputClasses} placeholder="e.g. 13.5 kWh" />
                                            </div>
                                        </div>

                                        {/* Product Variants */}
                                        <div className="border-t border-white/[0.04] pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-[10px] text-yellow-400/70 font-bold uppercase tracking-widest">
                                                    Product Variants *
                                                </p>
                                                <button type="button" onClick={addVariant}
                                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors">
                                                    <Plus className="w-3 h-3" /> Add Variant
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 mb-2">
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Option Name</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Cash Price</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">$/Month</span>
                                                <span></span>
                                            </div>
                                            <div className="space-y-2">
                                                {variants.map((variant, idx) => (
                                                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-center">
                                                        <input type="text" value={variant.name}
                                                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                                                            className={smallInputClasses} placeholder="e.g. 8.5 kW System" />
                                                        <input type="number" value={variant.cashPrice}
                                                            onChange={(e) => updateVariant(idx, "cashPrice", e.target.value)}
                                                            className={smallInputClasses} placeholder="16000" />
                                                        <input type="number" value={variant.financePrice}
                                                            onChange={(e) => updateVariant(idx, "financePrice", e.target.value)}
                                                            className={smallInputClasses} placeholder="200" />
                                                        <button type="button" onClick={() => removeVariant(idx)}
                                                            disabled={variants.length <= 1}
                                                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={formData.installationRequired}
                                                onChange={(e) => setFormData(prev => ({ ...prev, installationRequired: e.target.checked }))}
                                                className="w-4 h-4 rounded accent-yellow-500" />
                                            <span className="text-xs text-white/60">Installation Required</span>
                                        </label>

                                        {/* Finance options */}
                                        <div className="border-t border-white/[0.04] pt-4 space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={formData.financeEligible}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, financeEligible: e.target.checked }))}
                                                    className="w-4 h-4 rounded accent-yellow-500" />
                                                <span className="text-xs text-white/60">Finance Eligible</span>
                                            </label>
                                            {formData.financeEligible && (
                                                <div>
                                                    <label className={labelClasses}>Minimum Down Payment ($) *</label>
                                                    <input type="number" value={formData.minimumDownPayment}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, minimumDownPayment: e.target.value }))}
                                                        className={inputClasses} placeholder="e.g. 960" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t border-white/[0.06]">
                                <button onClick={handleCreate} disabled={creating}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors">
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    {uploadingImages ? "Uploading Images..." : creating ? "Creating..." : "Create Product"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Edit Product Modal ─── */}
            <AnimatePresence>
                {editingProductId && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-6 overflow-y-auto"
                        onClick={() => { setEditingProductId(null); resetForm(); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide">Edit Product</h3>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mt-1 inline-block ${formData.category === "VEHICLE" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>{formData.category}</span>
                                </div>
                                <button onClick={() => { setEditingProductId(null); resetForm(); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><X className="w-4 h-4 text-white/60" /></button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                {/* Basic fields */}
                                <div>
                                    <label className={labelClasses}>Product Name *</label>
                                    <input type="text" value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                                            setFormData(prev => ({ ...prev, name, slug }));
                                        }}
                                        className={inputClasses} placeholder="e.g. Model S" />
                                </div>
                                <div>
                                    <label className={labelClasses}>URL Slug</label>
                                    <input type="text" value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Description</label>
                                    <textarea value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className={`${inputClasses} h-20 resize-none`} placeholder="Product description..." />
                                </div>

                                {/* Product Images */}
                                <div className="space-y-3 border-t border-white/[0.06] pt-4">
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Product Images</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {imagePreviews.map((src, idx) => (
                                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeImage(idx)}
                                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center shadow-lg transition-colors z-10">
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                                {idx === 0 && <span className="absolute bottom-1 left-1 text-[7px] font-bold bg-yellow-500/90 text-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Hero</span>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => editFileInputRef.current?.click()}
                                            className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 hover:border-white/20 hover:bg-white/[0.02] transition-colors cursor-pointer">
                                            <ImagePlus className="w-4 h-4 text-white/30" />
                                            <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Add</span>
                                        </button>
                                    </div>
                                    <input ref={editFileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageSelect(e.target.files)} />
                                </div>

                                {/* Vehicle-specific fields */}
                                {formData.category === "VEHICLE" && (
                                    <div className="space-y-4 border-t border-white/[0.06] pt-4">
                                        <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest">Vehicle Specifications</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={labelClasses}>Range (miles)</label>
                                                <input type="number" value={formData.rangeMiles}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, rangeMiles: e.target.value }))}
                                                    className={inputClasses} placeholder="e.g. 405" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Top Speed</label>
                                                <input type="text" value={formData.topSpeed}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, topSpeed: e.target.value }))}
                                                    className={inputClasses} placeholder="e.g. 200 mph" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>0-60 MPH</label>
                                                <input type="text" value={formData.zeroToSixty}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, zeroToSixty: e.target.value }))}
                                                    className={inputClasses} placeholder="e.g. 1.99s" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Shipping Fee ($)</label>
                                            <input type="number" value={formData.shippingFee}
                                                onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: e.target.value }))}
                                                className={inputClasses} placeholder="e.g. 500" />
                                        </div>

                                        {/* Drivetrain Variants */}
                                        <div className="border-t border-white/[0.04] pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest">Drivetrain Variants *</p>
                                                <button type="button" onClick={addVariant}
                                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                                                    <Plus className="w-3 h-3" /> Add Variant
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 mb-2">
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Drivetrain</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Cash Price</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">$/Month</span>
                                                <span></span>
                                            </div>
                                            <div className="space-y-2">
                                                {variants.map((variant, idx) => (
                                                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-center">
                                                        <input type="text" value={variant.name}
                                                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                                                            className={smallInputClasses} placeholder="e.g. All-Wheel Drive" />
                                                        <input type="number" value={variant.cashPrice}
                                                            onChange={(e) => updateVariant(idx, "cashPrice", e.target.value)}
                                                            className={smallInputClasses} placeholder="74990" />
                                                        <input type="number" value={variant.financePrice}
                                                            onChange={(e) => updateVariant(idx, "financePrice", e.target.value)}
                                                            className={smallInputClasses} placeholder="529" />
                                                        <button type="button" onClick={() => removeVariant(idx)} disabled={variants.length <= 1}
                                                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Finance options */}
                                        <div className="border-t border-white/[0.04] pt-4 space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={formData.financeEligible}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, financeEligible: e.target.checked }))}
                                                    className="w-4 h-4 rounded accent-cyan-500" />
                                                <span className="text-xs text-white/60">Finance Eligible</span>
                                            </label>
                                            {formData.financeEligible && (
                                                <div>
                                                    <label className={labelClasses}>Minimum Down Payment ($) *</label>
                                                    <input type="number" value={formData.minimumDownPayment}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, minimumDownPayment: e.target.value }))}
                                                        className={inputClasses} placeholder="e.g. 7849" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Energy-specific fields */}
                                {formData.category === "ENERGY" && (
                                    <div className="space-y-4 border-t border-white/[0.06] pt-4">
                                        <p className="text-[10px] text-yellow-400/70 font-bold uppercase tracking-widest">Energy Specifications</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClasses}>Energy Type</label>
                                                <select value={formData.energyType}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, energyType: e.target.value as any }))}
                                                    className={inputClasses}>
                                                    <option value="SOLAR">Solar</option>
                                                    <option value="POWERWALL">Powerwall</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Capacity Info</label>
                                                <input type="text" value={formData.capacityInfo}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, capacityInfo: e.target.value }))}
                                                    className={inputClasses} placeholder="e.g. 13.5 kWh" />
                                            </div>
                                        </div>

                                        {/* Product Variants */}
                                        <div className="border-t border-white/[0.04] pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-[10px] text-yellow-400/70 font-bold uppercase tracking-widest">Product Variants *</p>
                                                <button type="button" onClick={addVariant}
                                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors">
                                                    <Plus className="w-3 h-3" /> Add Variant
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 mb-2">
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Option Name</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">Cash Price</span>
                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest px-1">$/Month</span>
                                                <span></span>
                                            </div>
                                            <div className="space-y-2">
                                                {variants.map((variant, idx) => (
                                                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-center">
                                                        <input type="text" value={variant.name}
                                                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                                                            className={smallInputClasses} placeholder="e.g. 8.5 kW System" />
                                                        <input type="number" value={variant.cashPrice}
                                                            onChange={(e) => updateVariant(idx, "cashPrice", e.target.value)}
                                                            className={smallInputClasses} placeholder="16000" />
                                                        <input type="number" value={variant.financePrice}
                                                            onChange={(e) => updateVariant(idx, "financePrice", e.target.value)}
                                                            className={smallInputClasses} placeholder="200" />
                                                        <button type="button" onClick={() => removeVariant(idx)} disabled={variants.length <= 1}
                                                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={formData.installationRequired}
                                                onChange={(e) => setFormData(prev => ({ ...prev, installationRequired: e.target.checked }))}
                                                className="w-4 h-4 rounded accent-yellow-500" />
                                            <span className="text-xs text-white/60">Installation Required</span>
                                        </label>

                                        {/* Finance options */}
                                        <div className="border-t border-white/[0.04] pt-4 space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={formData.financeEligible}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, financeEligible: e.target.checked }))}
                                                    className="w-4 h-4 rounded accent-yellow-500" />
                                                <span className="text-xs text-white/60">Finance Eligible</span>
                                            </label>
                                            {formData.financeEligible && (
                                                <div>
                                                    <label className={labelClasses}>Minimum Down Payment ($) *</label>
                                                    <input type="number" value={formData.minimumDownPayment}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, minimumDownPayment: e.target.value }))}
                                                        className={inputClasses} placeholder="e.g. 960" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t border-white/[0.06]">
                                <button onClick={handleUpdate} disabled={creating}
                                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors">
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {uploadingImages ? "Uploading Images..." : creating ? "Updating..." : "Update Product"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

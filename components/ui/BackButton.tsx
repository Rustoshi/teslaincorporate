"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ label = "Back" }: { label?: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-4"
        >
            <ChevronLeft className="w-4 h-4" /> {label}
        </button>
    );
}

import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "Press — Musk Capital Inc",
    description: "Media coverage, press releases, and press kit resources for Musk Capital Inc — the private equity and AI trading platform.",
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

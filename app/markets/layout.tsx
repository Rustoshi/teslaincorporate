import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "Markets — Musk Capital Inc",
    description: "Explore the Musk ecosystem: SpaceX, Tesla, Neuralink, xAI, The Boring Company and X Corp. Pre-IPO private equity access for qualified investors.",
};

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

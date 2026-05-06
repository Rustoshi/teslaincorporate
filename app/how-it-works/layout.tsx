import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "How It Works — Musk Capital Inc",
    description: "Learn how to invest in SpaceX, Tesla, Neuralink, and more through Musk Capital Inc's private equity and AI trading platform.",
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

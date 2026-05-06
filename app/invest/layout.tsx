import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "Musk Capital Inc — Invest in the Future",
    description: "Gain exposure to Tesla, SpaceX, Neuralink, xAI, and The Boring Company — the companies shaping humanity's next chapter.",
};

export default function InvestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

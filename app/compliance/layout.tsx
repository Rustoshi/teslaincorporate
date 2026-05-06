import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "Compliance — Musk Capital Inc",
    description: "Musk Capital Inc compliance framework: KYC/AML policies, regulatory obligations, and investor protection standards.",
};

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

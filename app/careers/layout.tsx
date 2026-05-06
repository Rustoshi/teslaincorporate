import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "Careers — Tesla Inc",
    description: "Join Tesla Inc and help build the future of private market investing. We're hiring engineers, analysts, compliance specialists, and more.",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

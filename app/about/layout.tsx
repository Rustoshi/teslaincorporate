import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "About Us — Tesla Inc",
    description: "Tesla Inc is an AI-powered private equity and trading platform giving everyday investors structured access to SpaceX, Neuralink, xAI, and more.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

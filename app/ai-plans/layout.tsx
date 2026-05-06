import type { Metadata } from "next";
import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export const metadata: Metadata = {
    title: "AI Plans — Tesla Inc",
    description: "AI-powered systematic trading strategies scaled to your capital size. Daily, weekly, and monthly execution cycles with target returns from 15% to 120%+.",
};

export default function AIPlansLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

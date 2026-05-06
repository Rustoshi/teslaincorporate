"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileFAB from "@/components/dashboard/MobileFAB";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white flex w-full max-w-[100vw] relative">
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 w-full max-w-[100vw] md:pl-64 transition-all duration-300 pb-24 md:pb-0 min-h-screen">
                <DashboardNavbar onMenuToggle={() => setIsMobileMenuOpen(true)} />
                {/* Main Content (Children) */}
                <main className="flex-1 w-full max-w-[100vw] relative pt-16 overflow-y-auto">
                    {children}
                </main>

                <MobileFAB />
            </div>
        </div>
    );
}

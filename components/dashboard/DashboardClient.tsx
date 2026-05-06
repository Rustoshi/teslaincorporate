"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ModeSwitcher, { DashboardMode } from "@/components/dashboard/ModeSwitcher";

// Investment Components
import InvestmentOverview from "@/components/dashboard/invest/InvestmentOverview";
import InvestmentPlans from "@/components/dashboard/invest/InvestmentPlans";
import ProjectInvestments from "@/components/dashboard/invest/ProjectInvestments";
import RecentActivity from "@/components/dashboard/invest/RecentActivity";
import MarketCharts from "@/components/dashboard/invest/MarketCharts";
import MarketTicker from "@/components/dashboard/invest/MarketTicker";

// Shopping Components
import ShoppingStats from "@/components/dashboard/shop/ShoppingStats";
import TeslaOrders from "@/components/dashboard/shop/TeslaOrders";
import TeslaModels from "@/components/dashboard/shop/TeslaModels";

interface DashboardClientProps {
    userData: {
        totalBalance: number;
        totalProfits: number;
        totalInvested: number;
        activePlansCount: number;
        currency: string;
    };
    activePlans: any[];
    projectStakes?: any[];
    recentActivities: any[];
    shopOrders?: any[];
    vehicles?: any[];
    currency: string;
}

function DashboardContent({ userData, activePlans, projectStakes = [], recentActivities, shopOrders = [], vehicles = [], currency }: DashboardClientProps) {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<DashboardMode>("invest");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "shop") {
            setMode("shop");
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col w-full max-w-[100vw] overflow-x-hidden">
            {/* Global Market Ticker */}
            <MarketTicker />
            {/* Desktop ModeSwitcher - injected into Navbar space (hidden on mobile) */}
            <div className="fixed top-0 left-64 right-0 z-[60] h-16 pointer-events-none hidden md:flex items-center justify-center">
                <div className="pointer-events-auto">
                    <ModeSwitcher mode={mode} setMode={setMode} />
                </div>
            </div>

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                {/* Mobile ModeSwitcher - inline flow (hidden on desktop) */}
                <div className="md:hidden flex justify-center mb-8">
                    <ModeSwitcher mode={mode} setMode={setMode} />
                </div>

                <AnimatePresence>
                    {mode === "invest" ? (
                        <motion.div
                            key="invest"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <InvestmentOverview userData={userData} currency={currency} />
                            <InvestmentPlans activePlans={activePlans} />
                            <ProjectInvestments stakes={projectStakes} />
                            <RecentActivity activities={recentActivities} />
                            <MarketCharts />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="shop"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <ShoppingStats orders={shopOrders} />
                            <TeslaOrders orders={shopOrders} />
                            <TeslaModels vehicles={vehicles} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function DashboardClient(props: DashboardClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>}>
            <DashboardContent {...props} />
        </Suspense>
    );
}

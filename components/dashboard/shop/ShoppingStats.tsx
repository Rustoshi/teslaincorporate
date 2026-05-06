"use client";

import { motion } from "framer-motion";

export default function ShoppingStats({ orders = [] }: { orders?: any[] }) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status !== 'COMPLETED').length;

    // Calculate total value of all orders
    const totalValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const kpis = [
        { label: "Total Orders", value: totalOrders.toString(), trend: "Vehicles & Energy", positive: true },
        { label: "Pending Orders", value: pendingOrders.toString(), trend: "Awaiting Delivery", positive: pendingOrders === 0 },
        { label: "Total Value of Orders", value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: "Estimated", positive: true },
    ];

    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-wide uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Shopping Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.15] transition-colors duration-300 group"
                    >
                        <p className="text-[11px] tracking-[0.1em] uppercase text-white/40 font-medium mb-3">
                            {kpi.label}
                        </p>
                        <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold text-white tracking-tight">
                                {kpi.value}
                            </p>
                        </div>
                        <p className={`text-[10px] tracking-wider uppercase mt-3 font-semibold ${kpi.positive ? "text-white/60" : "text-white/40"}`}>
                            {kpi.trend}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

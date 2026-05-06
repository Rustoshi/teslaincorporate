"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function TeslaOrders({ orders = [] }: { orders?: any[] }) {
    if (!orders || orders.length === 0) {
        return (
            <section className="mb-10">
                <h2
                    className="text-lg font-bold tracking-wide uppercase text-white mb-6"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    Pending Deliveries
                </h2>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 text-center">
                    <p className="text-white/60 font-medium tracking-wide">You have no pending orders.</p>
                </div>
            </section>
        );
    }
    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-wide uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Pending Deliveries
            </h2>

            <div className="flex flex-col gap-4">
                {orders.map((order, i) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 sm:p-6 hover:bg-white/[0.05] hover:border-white/[0.15] transition-colors duration-300 relative overflow-hidden group"
                    >
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                            {/* Left: Model & ID */}
                            <div className="sm:w-1/3">
                                <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">
                                    {order.id}
                                </div>
                                <div className="text-base font-bold text-white tracking-wide">
                                    {order.model}
                                </div>
                            </div>

                            {/* Middle Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Status</div>
                                    <div className="text-sm font-semibold text-white">{order.status}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Order Date</div>
                                    <div className="text-sm font-semibold text-white">{order.date}</div>
                                </div>
                            </div>

                            {/* Bottom/Right: Actions */}
                            <div className="w-full sm:w-auto mt-2 sm:mt-0 flex sm:justify-end">
                                <Link
                                    href={`/dashboard/orders/${order.id}`}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white text-xs font-bold uppercase tracking-widest"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View Order</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

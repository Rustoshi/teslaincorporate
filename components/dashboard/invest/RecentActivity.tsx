"use client";

import { motion } from "framer-motion";

export interface ActivityData {
    id: string;
    type: string;
    title: string;
    date: string;
    amount: string;
    status: string;
    positive: boolean;
}

interface RecentActivityProps {
    activities: ActivityData[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-[0.15em] uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Recent Activity
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                {!activities || activities.length === 0 ? (
                    <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white tracking-wide mb-1">No Recent Activity</h3>
                        <p className="text-xs text-white/40">Your transaction history will appear here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {activities.map((activity, i) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.03] transition-colors gap-4 sm:gap-0"
                            >
                                {/* Left: Icon & Details */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${activity.positive
                                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                                        : "bg-white/5 border-white/10 text-white/50"
                                        }`}>
                                        {activity.type === "Yield" && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        )}
                                        {activity.type === "Deposit" && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        )}
                                        {activity.type === "Withdrawal" && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        )}
                                        {activity.type === "Shopping" && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        )}
                                        {activity.type === "Transfer" && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white tracking-wide">{activity.title}</div>
                                        <div className="text-[11px] text-white/40 font-medium mt-1">{activity.date}</div>
                                    </div>
                                </div>

                                {/* Right: Amount & Status */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-1 sm:flex-none sm:w-auto ml-14 sm:ml-0 mt-2 sm:mt-0">
                                    <div className={`text-sm font-bold tracking-wider ${activity.positive ? 'text-green-500' : 'text-white'}`}>
                                        {activity.amount}
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${activity.status === 'Completed' ? 'text-white/30' : 'text-orange-400'
                                        }`}>
                                        {activity.status}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-center">
                <button className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">
                    View All Transactions →
                </button>
            </div>
        </section>
    );
}

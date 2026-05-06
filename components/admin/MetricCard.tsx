import React from "react";

interface MetricCardProps {
    title: string;
    value: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    icon?: React.ReactNode;
}

export default function MetricCard({ title, value, trend, icon }: MetricCardProps) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.15] transition-colors duration-300">
            {/* Subtle Gradient Glow Map */}
            <div className="absolute top-0 right-0 p-32 bg-white/[0.01] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col h-full justify-between">

                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                        {title}
                    </h3>
                    {icon && (
                        <div className="text-white/20 group-hover:text-white/40 transition-colors">
                            {icon}
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                        {value}
                    </div>

                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-bold tracking-wider mb-1 ${trend.positive ? 'text-green-500' : 'text-red-500'
                            }`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend.positive ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                            </svg>
                            {trend.value}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

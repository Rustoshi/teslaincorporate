"use client";

import { motion } from "framer-motion";

const tickerItems = [
    { symbol: "BTC", price: "$64,230.00", change: "+2.4%", positive: true },
    { symbol: "ETH", price: "$3,450.20", change: "+1.1%", positive: true },
    { symbol: "TSLA", price: "$202.64", change: "-1.2%", positive: false },
    { symbol: "SPACEX (EST)", price: "$110.50", change: "+5.0%", positive: true },
    { symbol: "X (HLD)", price: "$45.20", change: "0.0%", positive: true },
];

export default function MarketTicker() {
    return (
        <div className="w-full bg-white/[0.02] border-b border-white/[0.05] overflow-hidden flex items-center h-10 px-4">
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mr-6 shrink-0 flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Markets
            </div>

            <div className="flex-1 relative overflow-hidden h-full flex items-center">
                <motion.div
                    className="flex whitespace-nowrap items-center gap-8"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    }}
                >
                    {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                        <div key={`${item.symbol}-${i}`} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white tracking-widest">{item.symbol}</span>
                            <span className="text-xs text-white/70">{item.price}</span>
                            <span className={`text-[10px] font-bold ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {item.change}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

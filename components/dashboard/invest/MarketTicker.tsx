"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TickerItem {
    symbol: string;
    price: string;
    change: string;
    positive: boolean;
}

const FALLBACK: TickerItem[] = [
    { symbol: "BTC", price: "—", change: "—", positive: true },
    { symbol: "ETH", price: "—", change: "—", positive: true },
    { symbol: "TSLA", price: "—", change: "—", positive: true },
];

const POLL_INTERVAL = 60_000; // Refresh every 60 seconds

export default function MarketTicker() {
    const [tickerItems, setTickerItems] = useState<TickerItem[]>(FALLBACK);

    const fetchPrices = useCallback(async () => {
        try {
            const res = await fetch("/api/market-prices");
            if (!res.ok) return;
            const data: TickerItem[] = await res.json();
            if (data.length > 0) setTickerItems(data);
        } catch {
            // Keep existing data on error
        }
    }, []);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchPrices]);

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

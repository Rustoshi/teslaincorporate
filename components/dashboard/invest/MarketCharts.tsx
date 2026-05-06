"use client";

import { useEffect, useRef } from "react";

export default function MarketCharts() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load TradingView script
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "autosize": true,
          "symbol": "NASDAQ:TSLA",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "gridColor": "rgba(255, 255, 255, 0.06)",
          "hide_top_toolbar": true,
          "hide_legend": true,
          "save_image": false,
          "container_id": "tradingview_tsla"
        }`;
            containerRef.current.appendChild(script);
        }
    }, []);

    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-wide uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Market Exposure (TSLA)
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden h-[400px] relative">
                <div id="tradingview_tsla" ref={containerRef} className="w-full h-full" />

                {/* Fallback overlay if script fails/loading */}
                <div className="absolute inset-0 pointer-events-none border border-white/[0.05] rounded-xl z-10" />
            </div>
        </section>
    );
}

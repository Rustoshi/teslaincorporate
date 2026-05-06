"use client";

import { useEffect, useRef } from "react";

export default function TradingViewMarquee() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        // Prevent double-load
        if (containerRef.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [
                { proName: "NASDAQ:TSLA", title: "Tesla" },
                { proName: "NASDAQ:AAPL", title: "Apple" },
                { proName: "NASDAQ:NVDA", title: "NVIDIA" },
                { proName: "NASDAQ:MSFT", title: "Microsoft" },
                { proName: "NASDAQ:AMZN", title: "Amazon" },
                { proName: "NASDAQ:GOOGL", title: "Alphabet" },
                { proName: "CRYPTO:BTCUSD", title: "Bitcoin" },
            ],
            showSymbolLogo: true,
            isTransparent: true,
            displayMode: "adaptive",
            colorTheme: "dark",
            locale: "en",
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className="w-full overflow-hidden opacity-60 hover:opacity-80 transition-opacity duration-500">
            <div
                ref={containerRef}
                className="tradingview-widget-container"
            >
                <div className="tradingview-widget-container__widget" />
            </div>
        </div>
    );
}

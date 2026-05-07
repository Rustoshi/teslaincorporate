import { NextResponse } from "next/server";

interface TickerItem {
    symbol: string;
    price: string;
    change: string;
    positive: boolean;
}

// Cache prices for 60 seconds to avoid hammering free APIs
let cachedData: TickerItem[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 60_000; // 60 seconds

async function fetchCryptoPrices(): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple&vs_currencies=usd&include_24hr_change=true",
            { next: { revalidate: 60 } }
        );
        if (!res.ok) throw new Error("CoinGecko API error");
        return await res.json();
    } catch {
        return {};
    }
}

async function fetchStockPrices(): Promise<
    Record<string, { price: number; changePercent: number }>
> {
    const symbols = ["TSLA", "AAPL", "NVDA"];
    const results: Record<string, { price: number; changePercent: number }> = {};

    // Use Yahoo Finance v8 chart API (free, no key required)
    await Promise.all(
        symbols.map(async (symbol) => {
            try {
                const res = await fetch(
                    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`,
                    {
                        headers: {
                            "User-Agent": "Mozilla/5.0",
                        },
                        next: { revalidate: 60 },
                    }
                );
                if (!res.ok) throw new Error(`Yahoo API error for ${symbol}`);
                const data = await res.json();
                const meta = data?.chart?.result?.[0]?.meta;
                if (meta) {
                    const currentPrice = meta.regularMarketPrice;
                    const previousClose = meta.chartPreviousClose || meta.previousClose;
                    const changePercent = previousClose
                        ? ((currentPrice - previousClose) / previousClose) * 100
                        : 0;
                    results[symbol] = { price: currentPrice, changePercent };
                }
            } catch {
                // Silently skip failed stock fetches
            }
        })
    );

    return results;
}

function formatPrice(price: number): string {
    if (price >= 1000) {
        return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "$" + price.toFixed(2);
}

function formatChange(change: number): string {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
}

export async function GET() {
    const now = Date.now();

    // Return cached data if still fresh
    if (cachedData && now - lastFetch < CACHE_TTL) {
        return NextResponse.json(cachedData);
    }

    const [crypto, stocks] = await Promise.all([
        fetchCryptoPrices(),
        fetchStockPrices(),
    ]);

    const tickers: TickerItem[] = [];

    // Crypto
    if (crypto.bitcoin) {
        tickers.push({
            symbol: "BTC",
            price: formatPrice(crypto.bitcoin.usd),
            change: formatChange(crypto.bitcoin.usd_24h_change || 0),
            positive: (crypto.bitcoin.usd_24h_change || 0) >= 0,
        });
    }
    if (crypto.ethereum) {
        tickers.push({
            symbol: "ETH",
            price: formatPrice(crypto.ethereum.usd),
            change: formatChange(crypto.ethereum.usd_24h_change || 0),
            positive: (crypto.ethereum.usd_24h_change || 0) >= 0,
        });
    }
    if (crypto.solana) {
        tickers.push({
            symbol: "SOL",
            price: formatPrice(crypto.solana.usd),
            change: formatChange(crypto.solana.usd_24h_change || 0),
            positive: (crypto.solana.usd_24h_change || 0) >= 0,
        });
    }
    if (crypto.ripple) {
        tickers.push({
            symbol: "XRP",
            price: formatPrice(crypto.ripple.usd),
            change: formatChange(crypto.ripple.usd_24h_change || 0),
            positive: (crypto.ripple.usd_24h_change || 0) >= 0,
        });
    }

    // Stocks
    for (const symbol of ["TSLA", "AAPL", "NVDA"]) {
        if (stocks[symbol]) {
            tickers.push({
                symbol,
                price: formatPrice(stocks[symbol].price),
                change: formatChange(stocks[symbol].changePercent),
                positive: stocks[symbol].changePercent >= 0,
            });
        }
    }

    // Private companies — estimated valuations (no public ticker)
    tickers.push({
        symbol: "SPACEX (EST)",
        price: "$350B",
        change: "Private",
        positive: true,
    });

    // If all API calls failed, return sensible fallback
    if (tickers.length === 0) {
        return NextResponse.json([
            { symbol: "BTC", price: "—", change: "—", positive: true },
            { symbol: "ETH", price: "—", change: "—", positive: true },
            { symbol: "TSLA", price: "—", change: "—", positive: true },
        ]);
    }

    cachedData = tickers;
    lastFetch = now;

    return NextResponse.json(tickers);
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, MapPin, ExternalLink, ShieldCheck, CreditCard, Landmark, ArrowRight, ChevronDown, Check } from "lucide-react";

interface BuyCryptoClientProps {
    userCountry: string;
}

// Extensive list of regions and their best crypto exchanges
const countryPlatformMapping: Record<string, any[]> = {
    // North America
    "US": [
        { name: "Coinbase", url: "https://www.coinbase.com/", fee: "Low/Medium", speed: "Instant", icon: "🏦", desc: "Best overall for US residents. Highly regulated." },
        { name: "Kraken", url: "https://www.kraken.com/", fee: "Low", speed: "Fast", icon: "🐙", desc: "Excellent for low fees and Pro trading features." },
        { name: "CashApp", url: "https://cash.app/", fee: "Medium", speed: "Instant", icon: "💵", desc: "Easiest way to buy Bitcoin instantly." },
        { name: "Robinhood", url: "https://robinhood.com/", fee: "Low", speed: "Fast", icon: "🏹", desc: "Buy crypto alongside traditional stocks." },
        { name: "Gemini", url: "https://www.gemini.com/", fee: "Medium", speed: "Instant", icon: "♊", desc: "Highly secure exchange with strong NYDFS compliance." }
    ],
    "CA": [
        { name: "Wealthsimple", url: "https://www.wealthsimple.com/", fee: "Medium", speed: "Instant", icon: "🍁", desc: "Canada's top regulated platform." },
        { name: "Kraken", url: "https://www.kraken.com/", fee: "Low", speed: "Fast", icon: "🐙", desc: "Global exchange with great CAD pairs." },
        { name: "Coinbase", url: "https://www.coinbase.com/", fee: "Low/Medium", speed: "Instant", icon: "🏦", desc: "Highly secure, supports Interac e-Transfer." },
        { name: "Newton", url: "https://www.newton.co/", fee: "Low", speed: "Instant", icon: "🍎", desc: "No-fee crypto trading platform tailored for Canadians." }
    ],

    // Europe
    "GB": [
        { name: "Coinbase", url: "https://www.coinbase.com/", fee: "Medium", speed: "Instant", icon: "🏦", desc: "Supports Faster Payments for instant GBP deposits." },
        { name: "Revolut", url: "https://www.revolut.com/", fee: "Medium", speed: "Instant", icon: "💳", desc: "Buy directly in-app from your bank account." },
        { name: "Kraken", url: "https://www.kraken.com/", fee: "Low", speed: "Fast", icon: "🐙", desc: "Deep liquidity for GBP pairs." },
        { name: "eToro", url: "https://www.etoro.com/", fee: "Variable", speed: "Instant", icon: "🐂", desc: "FCA regulated social trading platform." }
    ],
    "EU": [ // Generic Europe fallback
        { name: "Binance", url: "https://www.binance.com/", fee: "Very Low", speed: "Fast", icon: "🔶", desc: "Largest global exchange, offers SEPA transfers." },
        { name: "Bitpanda", url: "https://www.bitpanda.com/", fee: "Medium", speed: "Instant", icon: "🐼", desc: "Highly regulated European broker based in Vienna." },
        { name: "Kraken", url: "https://www.kraken.com/", fee: "Low", speed: "Fast", icon: "🐙", desc: "Excellent Euro SEPA deposit network." },
        { name: "SwissBorg", url: "https://swissborg.com/", fee: "Low", speed: "Instant", icon: "🇨🇭", desc: "Smart engine connects to multiple exchanges for best prices." }
    ],
    "CH": [ // Switzerland
        { name: "SwissBorg", url: "https://swissborg.com/", fee: "Low", speed: "Instant", icon: "🇨🇭", desc: "Smart routing engine for the best CHF prices." },
        { name: "Kraken", url: "https://www.kraken.com/", fee: "Low", speed: "Fast", icon: "🐙", desc: "Deep CHF liquidity pools." },
        { name: "Bity", url: "https://bity.com/", fee: "Medium", speed: "Fast", icon: "🗻", desc: "Buy and sell crypto directly via Swiss bank transfer." }
    ],

    // Asia / Oceania
    "AU": [
        { name: "CoinSpot", url: "https://www.coinspot.com.au/", fee: "Medium", speed: "Instant", icon: "🦘", desc: "Australia's most popular exchange via POLi/PayID." },
        { name: "Swyftx", url: "https://swyftx.com.au/", fee: "Low", speed: "Fast", icon: "🦅", desc: "Great local alternative with low spreads." },
        { name: "Binance Australia", url: "https://www.binance.com/au", fee: "Very Low", speed: "Fast", icon: "🔶", desc: "Deep liquidity for AUD markets." },
        { name: "Independent Reserve", url: "https://www.independentreserve.com/", fee: "Low", speed: "Fast", icon: "🇦🇺", desc: "Highly secure, regulated Australian exchange." }
    ],
    "IN": [
        { name: "WazirX", url: "https://wazirx.com/", fee: "Medium", speed: "Fast", icon: "🇮🇳", desc: "India's largest exchange, supports P2P INR." },
        { name: "CoinDCX", url: "https://coindcx.com/", fee: "Low", speed: "Fast", icon: "🪙", desc: "Highly secure and heavily backed." },
        { name: "Binance P2P", url: "https://p2p.binance.com/", fee: "Variable", speed: "Variable", icon: "🤝", desc: "Peer-to-peer buying directly with UPI/IMPS." },
        { name: "ZebPay", url: "https://zebpay.com/", fee: "Medium", speed: "Fast", icon: "💸", desc: "One of India's oldest and most trusted exchanges." }
    ],
    "SG": [ // Singapore
        { name: "Coinhako", url: "https://www.coinhako.com/", fee: "Medium", speed: "Instant", icon: "🇸🇬", desc: "Easiest way to buy crypto with SGD." },
        { name: "Crypto.com", url: "https://crypto.com/", fee: "Medium", speed: "Instant", icon: "🦁", desc: "MAS regulated, supports SGD bank transfers." },
        { name: "Gemini", url: "https://www.gemini.com/sg", fee: "Low", speed: "Fast", icon: "♊", desc: "Supports FAST transfers for instant SGD deposits." }
    ],
    "JP": [ // Japan
        { name: "bitFlyer", url: "https://bitflyer.com/", fee: "Low", speed: "Fast", icon: "🇯🇵", desc: "Japan's largest exchange by Bitcoin volume." },
        { name: "Coincheck", url: "https://coincheck.com/", fee: "Medium", speed: "Instant", icon: "✓", desc: "Highly popular app with local JPY support." },
        { name: "Kraken", url: "https://www.kraken.com/", fee: "Low", speed: "Fast", icon: "🐙", desc: "Global player with strong Japanese compliance." }
    ],
    "KR": [ // South Korea
        { name: "Upbit", url: "https://upbit.com/", fee: "Low", speed: "Fast", icon: "🇰🇷", desc: "Korea's largest exchange, massive KRW volume." },
        { name: "Bithumb", url: "https://www.bithumb.com/", fee: "Low", speed: "Fast", icon: "👍", desc: "One of the legacy Korean exchanges." },
        { name: "Coinone", url: "https://coinone.co.kr/", fee: "Medium", speed: "Fast", icon: "🥇", desc: "Trusted local exchange with deep order books." }
    ],

    // Middle East
    "AE": [ // UAE
        { name: "Rain", url: "https://www.rain.bh/", fee: "Medium", speed: "Fast", icon: "🌧️", desc: "Regulated by the Central Bank of Bahrain, great for AED." },
        { name: "BitOasis", url: "https://bitoasis.net/", fee: "Medium", speed: "Instant", icon: "🐪", desc: "The largest digital asset exchange in the MENA region." },
        { name: "Binance", url: "https://www.binance.com/", fee: "Very Low", speed: "Fast", icon: "🔶", desc: "Deeply entrenched in Dubai with massive liquidity." }
    ],

    // Latin America
    "BR": [ // Brazil
        { name: "Mercado Bitcoin", url: "https://www.mercadobitcoin.com.br/", fee: "Medium", speed: "Instant", icon: "🇧🇷", desc: "Brazil's largest local exchange, PIX compatible." },
        { name: "Binance", url: "https://www.binance.com/", fee: "Very Low", speed: "Instant", icon: "🔶", desc: "Supports instant PIX fiat deposits." },
        { name: "Foxbit", url: "https://foxbit.com.br/", fee: "Medium", speed: "Fast", icon: "🦊", desc: "Trusted legacy Brazilian exchange." }
    ],
    "MX": [ // Mexico
        { name: "Bitso", url: "https://bitso.com/", fee: "Low", speed: "Instant", icon: "🇲🇽", desc: "The dominant exchange in Mexico via SPEI transfers." },
        { name: "Binance", url: "https://www.binance.com/", fee: "Very Low", speed: "Fast", icon: "🔶", desc: "Global giant with local MXN support." }
    ],
    "AR": [ // Argentina
        { name: "Ripio", url: "https://www.ripio.com/", fee: "Medium", speed: "Fast", icon: "🇦🇷", desc: "Leading wallet and exchange in Argentina." },
        { name: "Binance P2P", url: "https://p2p.binance.com/", fee: "Variable", speed: "Variable", icon: "🤝", desc: "Vibrant P2P market for ARS using Mercado Pago." },
        { name: "Lemon Cash", url: "https://www.lemon.me/", fee: "Medium", speed: "Instant", icon: "🍋", desc: "Popular crypto wallet with a prepaid Visa card." }
    ],

    // Africa
    "NG": [ // Nigeria
        { name: "Binance P2P", url: "https://p2p.binance.com/", fee: "Variable", speed: "Variable", icon: "🤝", desc: "The most robust P2P market for NGN bank transfers." },
        { name: "Remitano", url: "https://remitano.com/", fee: "Medium", speed: "Fast", icon: "🟣", desc: "Pioneer P2P platform, highly trusted locally." },
        { name: "YellowCard", url: "https://yellowcard.io/", fee: "Low", speed: "Instant", icon: "💳", desc: "Buy directly via bank transfer or mobile money." },
        { name: "Busha", url: "https://www.busha.co/", fee: "Medium", speed: "Fast", icon: "🇳🇬", desc: "Local app designed for smooth Nigerian onboarding." }
    ],
    "ZA": [ // South Africa
        { name: "Luno", url: "https://www.luno.com/", fee: "Medium", speed: "Instant", icon: "🌕", desc: "Most widely used platform for ZAR deposits." },
        { name: "VALR", url: "https://www.valr.com/", fee: "Low", speed: "Fast", icon: "🇿🇦", desc: "Great local exchange with 60+ crypto assets." },
        { name: "Binance", url: "https://www.binance.com/", fee: "Very Low", speed: "Fast", icon: "🔶", desc: "Supports local card payments." }
    ],
    "KE": [ // Kenya
        { name: "Binance P2P", url: "https://p2p.binance.com/", fee: "Variable", speed: "Instant", icon: "🤝", desc: "Deep liquidity using M-Pesa." },
        { name: "YellowCard", url: "https://yellowcard.io/", fee: "Low", speed: "Fast", icon: "💳", desc: "Reliable Pan-African exchange." },
        { name: "Paxful", url: "https://paxful.com/", fee: "Variable", speed: "Variable", icon: "🤝", desc: "Global P2P giant popular in Kenya." }
    ]
};

// Global default list if the country is obscure/not listed above
const globalDefaults = [
    { name: "MoonPay", url: "https://www.moonpay.com/", fee: "High", speed: "Instant", icon: "🌙", desc: "Buy instantly with Visa, Mastercard, or Apple Pay globally." },
    { name: "Banxa", url: "https://banxa.com/", fee: "Medium", speed: "Fast", icon: "🌐", desc: "Global fiat on-ramp supporting dozens of currencies." },
    { name: "Binance", url: "https://www.binance.com/", fee: "Very Low", speed: "Fast", icon: "🔶", desc: "The world's largest exchange by trading volume." },
    { name: "Trust Wallet", url: "https://trustwallet.com/", fee: "Medium", speed: "Instant", icon: "🛡️", desc: "Buy crypto in-app via third-party providers using credit card." },
    { name: "Mercuryo", url: "https://mercuryo.io/", fee: "Medium", speed: "Instant", icon: "☿", desc: "Global B2B fiat infrastructure you can use via partner wallets." }
];

const availableRegions = [
    { id: "US", name: "United States" },
    { id: "CA", name: "Canada" },
    { id: "GB", name: "United Kingdom" },
    { id: "EU", name: "Europe (General)" },
    { id: "CH", name: "Switzerland" },
    { id: "AU", name: "Australia" },
    { id: "IN", name: "India" },
    { id: "SG", name: "Singapore" },
    { id: "JP", name: "Japan" },
    { id: "KR", name: "South Korea" },
    { id: "AE", name: "United Arab Emirates" },
    { id: "BR", name: "Brazil" },
    { id: "MX", name: "Mexico" },
    { id: "AR", name: "Argentina" },
    { id: "NG", name: "Nigeria" },
    { id: "ZA", name: "South Africa" },
    { id: "KE", name: "Kenya" },
    { id: "GLOBAL", name: "Global / Other" }
];

// Simple mapping to map spelled out country names or codes to the keys above
const resolveCountryRegion = (country: string) => {
    const c = country.toLowerCase();
    if (!c) return "GLOBAL";

    if (c.includes("usa") || c.includes("america") || c.includes("us") || c.includes("united states")) return "US";
    if (c.includes("canada") || c.includes("ca")) return "CA";
    if (c.includes("uk") || c.includes("united kingdom") || c.includes("gb") || c.includes("britain")) return "GB";
    if (c.includes("australia") || c.includes("au")) return "AU";
    if (c.includes("india") || c.includes("in")) return "IN";
    if (c.includes("nigeria") || c.includes("ng")) return "NG";
    if (c.includes("south africa") || c.includes("za")) return "ZA";
    if (c.includes("singapore") || c.includes("sg")) return "SG";
    if (c.includes("japan") || c.includes("jp")) return "JP";
    if (c.includes("korea") || c.includes("kr")) return "KR";
    if (c.includes("arab") || c.includes("uae") || c.includes("ae") || c.includes("dubai")) return "AE";
    if (c.includes("brazil") || c.includes("br")) return "BR";
    if (c.includes("mexico") || c.includes("mx")) return "MX";
    if (c.includes("argentina") || c.includes("ar")) return "AR";
    if (c.includes("kenya") || c.includes("ke")) return "KE";
    if (c.includes("switzer") || c.includes("ch")) return "CH";

    // Check against common EU countries
    const euNations = ['germany', 'france', 'italy', 'spain', 'netherlands', 'belgium', 'sweden', 'poland', 'austria', 'ireland', 'denmark', 'finland', 'portugal', 'greece', 'eu', 'europe', 'czechia', 'hungary', 'slovakia'];
    if (euNations.some(nation => c.includes(nation))) return "EU";

    return "GLOBAL"; // Fallback
};

export default function BuyCryptoClient({ userCountry: initialUserCountry }: BuyCryptoClientProps) {
    const defaultRegion = resolveCountryRegion(initialUserCountry || "");
    const [selectedRegionId, setSelectedRegionId] = useState<string>(defaultRegion);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const platforms = useMemo(() => {
        return selectedRegionId === "GLOBAL" ? globalDefaults : countryPlatformMapping[selectedRegionId] || globalDefaults;
    }, [selectedRegionId]);

    const handleSelectRegion = (id: string) => {
        setSelectedRegionId(id);
        setIsDropdownOpen(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Buy Crypto
                </h1>
                <p className="text-sm text-white/50 tracking-widest uppercase max-w-xl mx-auto leading-relaxed">
                    Easily deposit funds into your Tesla Inc account by purchasing cryptocurrency through secure, vetted external providers.
                </p>
            </motion.div>

            {/* User Locality Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-visible"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="flex flex-col items-center sm:items-start w-full md:w-auto">
                        <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1 pointer-events-none flex items-center gap-2">
                            Select Region
                            {selectedRegionId === "GLOBAL" ? <Globe2 className="w-3 h-3 text-white/40" /> : <ShieldCheck className="w-3 h-3 text-green-500" />}
                        </div>

                        {/* Custom Select Dropdown */}
                        <div className="relative mt-2 w-full md:w-64">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full bg-[#111] hover:bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between transition-colors focus:outline-none focus:border-cyan-500/50"
                            >
                                <span className="font-bold text-white tracking-wide uppercase truncate text-sm">
                                    {availableRegions.find(r => r.id === selectedRegionId)?.name || selectedRegionId}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-[110%] left-0 right-0 mt-2 bg-[#111] border border-white/20 rounded-xl max-h-60 overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,1)] z-50 custom-scrollbar"
                                        >
                                            {availableRegions.map(region => (
                                                <button
                                                    key={region.id}
                                                    onClick={() => handleSelectRegion(region.id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between border-b last:border-0 border-white/5 transition-colors"
                                                >
                                                    <span className={`text-xs tracking-wide uppercase ${selectedRegionId === region.id ? "text-cyan-400 font-bold" : "text-white/80"}`}>
                                                        {region.name}
                                                    </span>
                                                    {selectedRegionId === region.id && <Check className="w-4 h-4 text-cyan-400" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 w-full md:w-1/3 relative z-10 border border-white/10 text-center md:text-left">
                    <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                        <CreditCard className="w-4 h-4" /> Recommendation Engine
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                        Select an alternate region from the dropdown if your local country's on-ramp options are overly restrictive.
                    </p>
                </div>
            </motion.div>

            {/* Providers Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform, i) => (
                    <motion.a
                        key={`${selectedRegionId}-${platform.name}`}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="group bg-[#050505] border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-6 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                            <ExternalLink className="w-5 h-5 text-cyan-400" />
                        </div>

                        <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                            {platform.icon}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 tracking-wider">{platform.name}</h3>
                        <p className="text-xs text-white/40 leading-relaxed mb-6 flex-1">
                            {platform.desc}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.05]">
                            <div>
                                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">Fees</div>
                                <div className={`text-[11px] font-bold tracking-wider uppercase ${platform.fee.includes('Low') || platform.fee.includes('Variable') ? 'text-green-400' : 'text-orange-400'}`}>
                                    {platform.fee}
                                </div>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10" />
                            <div>
                                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">Speed</div>
                                <div className={`text-[11px] font-bold tracking-wider uppercase ${platform.speed.includes('Instant') ? 'text-cyan-400' : 'text-white'}`}>
                                    {platform.speed}
                                </div>
                            </div>
                        </div>

                        {/* Hover Overlay Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                ))}
            </div>

            {/* Bottom Info Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-16 text-center"
            >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-6 text-white/30">
                    <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Next Steps</h3>
                <p className="text-xs text-white/40 max-w-md mx-auto leading-relaxed mb-8">
                    Once you have successfully purchased crypto via one of the recommended platforms, return to the Deposit page to transfer funds to your Tesla Inc wallet.
                </p>
                <a
                    href="/dashboard/deposit"
                    className="inline-flex items-center gap-3 bg-white text-black text-[11px] font-bold tracking-widest uppercase py-4 px-8 rounded-xl hover:bg-cyan-400 hover:text-black transition-colors"
                >
                    Go to Deposit Page <ArrowRight className="w-4 h-4" />
                </a>
            </motion.div>

        </div>
    );
}

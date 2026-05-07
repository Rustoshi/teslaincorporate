"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

/* ─── Types ─── */
interface Review {
    name: string;
    location: string;
    avatar: string;
    rating: number;
    title: string;
    body: string;
    invested: string;
    plan: string;
}

/* ─── Data ─── */
const reviews: Review[] = [
    {
        name: "Jonathan P.",
        location: "London, UK",
        avatar: "JP",
        rating: 5,
        title: "Exceeded every expectation",
        body: "I was skeptical of AI-managed portfolios, but the returns from the Quantum Accelerator plan have been extraordinary. Transparent reporting, zero friction withdrawals. This is the future of capital deployment.",
        invested: "$50,000",
        plan: "Quantum Accelerator",
    },
    {
        name: "Sarah M.",
        location: "New York, USA",
        avatar: "SM",
        rating: 5,
        title: "Professional-grade infrastructure",
        body: "The SpaceX Space City project investment was exactly what my portfolio needed — real asset exposure to the next frontier. The platform feels like it was built for institutional investors, yet it's accessible to everyone.",
        invested: "$25,000",
        plan: "Space City Fund",
    },
    {
        name: "Takeshi R.",
        location: "Tokyo, Japan",
        avatar: "TR",
        rating: 5,
        title: "Consistent returns, zero stress",
        body: "Four months in and my portfolio is up significantly. The AI rebalancing during the last market correction saved me from what would have been serious drawdown. Genuinely impressive risk management.",
        invested: "$100,000",
        plan: "Neural Apex",
    },
    {
        name: "Elena V.",
        location: "Zurich, Switzerland",
        avatar: "EV",
        rating: 5,
        title: "Finally, a platform I trust",
        body: "After years of mediocre funds and opaque fee structures, this platform feels like a breath of fresh air. Real-time dashboards, clear reporting, and the returns speak for themselves.",
        invested: "$75,000",
        plan: "Quantum Accelerator",
    },
    {
        name: "Marcus D.",
        location: "Dubai, UAE",
        avatar: "MD",
        rating: 5,
        title: "The Boring Company project is brilliant",
        body: "Invested in the Vegas Loop expansion and already seeing solid trajectory. The milestone tracking is incredibly detailed — you always know exactly where your capital is deployed and what progress looks like.",
        invested: "$30,000",
        plan: "Vegas Loop Fund",
    },
    {
        name: "Amara O.",
        location: "Lagos, Nigeria",
        avatar: "AO",
        rating: 5,
        title: "World-class from Africa",
        body: "Access to Tesla and SpaceX investment opportunities from anywhere in the world. The onboarding was seamless, KYC was approved within hours, and my first returns arrived exactly on schedule.",
        invested: "$10,000",
        plan: "Core Momentum",
    },
];

/* ─── Animated Counter ─── */
function AnimatedStat({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;
        let frame: number;
        const duration = 1400;
        const start = performance.now();

        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, active]);

    return (
        <>
            {value.toLocaleString()}
            {suffix}
        </>
    );
}

/* ─── Star Rating ─── */
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-black/10 text-black/10"}`}
                />
            ))}
        </div>
    );
}

/* ─── Review Card ─── */
function ReviewCard({ review, index }: { review: Review; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 * index, ease: "easeOut" }}
            className="relative flex flex-col rounded-2xl p-7 sm:p-8 bg-white border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300 cursor-default min-w-0"
        >
            {/* Quote icon */}
            <Quote className="w-6 h-6 text-red-500/15 mb-4 shrink-0" />

            {/* Stars */}
            <StarRating rating={review.rating} />

            {/* Title */}
            <h4
                className="text-base font-bold tracking-[0.02em] text-black mt-4 mb-3"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                &ldquo;{review.title}&rdquo;
            </h4>

            {/* Body */}
            <p className="text-sm text-black/55 font-light leading-relaxed mb-6 flex-1">
                {review.body}
            </p>

            {/* Divider */}
            <div className="w-full h-[1px] bg-black/[0.06] mb-5" />

            {/* Author row */}
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                    <span
                        className="text-[11px] font-bold tracking-wide text-white"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {review.avatar}
                    </span>
                </div>

                <div className="min-w-0">
                    <p
                        className="text-sm font-semibold text-black truncate"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        {review.name}
                    </p>
                    <p className="text-xs text-black/40 font-light truncate">
                        {review.location}
                    </p>
                </div>

                {/* Plan badge */}
                <span className="ml-auto text-[10px] tracking-[0.1em] uppercase text-black/30 font-medium border border-black/[0.08] rounded-full px-3 py-1 whitespace-nowrap hidden sm:inline-block">
                    {review.plan}
                </span>
            </div>
        </motion.div>
    );
}

/* ─── Main Section ─── */
export default function CustomerReviews() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const statsInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.7;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section ref={sectionRef} className="relative w-full bg-zinc-50 pb-24 sm:pb-32 overflow-hidden">
            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-6"
                    >
                        Investor Testimonials
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-black mb-6"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Trusted By Investors
                        <br />
                        <span className="text-black/40">Worldwide</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-black/50 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Real feedback from verified investors who have deployed capital through our platform.
                    </motion.p>
                </div>

                {/* Trust Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20"
                >
                    {[
                        { label: "Active Investors", value: 110100, suffix: "+" },
                        { label: "Capital Deployed", value: 1.8, suffix: "B+" },
                        { label: "Avg. Satisfaction", value: 4.9, suffix: "/5", isDecimal: true },
                        { label: "Countries", value: 68, suffix: "+" },
                    ].map((stat, i) => (
                        <div key={stat.label} className="text-center">
                            <p
                                className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-1"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {stat.isDecimal ? (
                                    <>{statsInView ? stat.value : 0}{stat.suffix}</>
                                ) : (
                                    <AnimatedStat target={stat.value as number} suffix={stat.suffix} active={statsInView} />
                                )}
                            </p>
                            <p className="text-[11px] tracking-[0.15em] uppercase text-black/40 font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Reviews — horizontal scroll on mobile, 3-col grid on desktop */}
                <div className="relative">
                    {/* Desktop grid */}
                    <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
                        {reviews.map((review, i) => (
                            <ReviewCard key={review.name} review={review} index={i} />
                        ))}
                    </div>

                    {/* Mobile/Tablet horizontal scroll */}
                    <div className="lg:hidden relative">
                        <div
                            ref={scrollRef}
                            className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-6 px-6"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {reviews.map((review, i) => (
                                <div key={review.name} className="min-w-[85vw] sm:min-w-[380px] snap-start">
                                    <ReviewCard review={review} index={i} />
                                </div>
                            ))}
                        </div>

                        {/* Scroll arrows */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <button
                                onClick={() => scroll("left")}
                                disabled={!canScrollLeft}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${canScrollLeft
                                    ? "border-black/20 text-black/60 hover:border-black/40 hover:text-black"
                                    : "border-black/[0.06] text-black/15 cursor-not-allowed"
                                    }`}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                disabled={!canScrollRight}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${canScrollRight
                                    ? "border-black/20 text-black/60 hover:border-black/40 hover:text-black"
                                    : "border-black/[0.06] text-black/15 cursor-not-allowed"
                                    }`}
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

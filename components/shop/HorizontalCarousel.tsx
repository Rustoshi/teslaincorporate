"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface ProductItem {
    _id: string;
    slug: string;
    name: string;
    description: string;
    heroImage: string;
}

interface HorizontalCarouselProps {
    title: string;
    items: ProductItem[];
}

export default function HorizontalCarousel({ title, items }: HorizontalCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!items || items.length === 0) return null;

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            // Scroll by roughly the width of one desktop card (400px + gap)
            const scrollAmount = direction === "left" ? -424 : 424;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-8 w-full max-w-[1800px] mx-auto overflow-hidden group/section">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                    {title}
                </motion.h2>

                {/* Desktop Navigation Arrows */}
                <div className="hidden sm:flex gap-3 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 pr-8">
                    <button
                        onClick={() => scroll("left")}
                        className="p-3 rounded-full bg-black/5 hover:bg-black/10 text-black border border-black/10 transition-all duration-300 backdrop-blur-md"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-3 rounded-full bg-black/5 hover:bg-black/10 text-black border border-black/10 transition-all duration-300 backdrop-blur-md"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative w-full -mx-4 sm:-mx-8 px-4 sm:px-8">
                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] xl:w-[400px] flex flex-col group relative"
                        >
                            {/* Image Container with Hover Effects */}
                            <div className="w-full relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-black/10 group/card cursor-pointer shadow-sm">
                                {/* Base Image - Slightly washed out by default, full contrast on hover */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover/card:scale-[1.03] opacity-90 group-hover/card:opacity-100"
                                    style={{ backgroundImage: `url(${item.heroImage})` }}
                                />

                                {/* Bottom Gradient for Text Legibility - Light Scrim */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/95 via-white/70 to-transparent pointer-events-none transition-opacity duration-500" />

                                {/* Text Content */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover/card:-translate-y-2">
                                    <div className="flex-1 pr-4">
                                        <h3
                                            className="text-xl sm:text-2xl font-bold text-black mb-1"
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                        >
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-black/80 line-clamp-2 font-medium">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Action Button - Slides in on Hover (Desktop) or stays visible (Mobile) */}
                                    <div className="shrink-0 transform translate-y-4 opacity-0 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100 transition-all duration-500 ease-out sm:block hidden">
                                        <Link
                                            href={`/shop/${item.slug}`}
                                            className="inline-flex text-center bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full hover:bg-black/90 hover:scale-[1.05] transition-all duration-300 shadow-md"
                                        >
                                            Order
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Action Button (Visible only on small screens where hover isn't reliable) */}
                            <div className="mt-4 w-full sm:hidden">
                                <Link
                                    href={`/shop/${item.slug}`}
                                    className="w-full block text-center bg-black text-white text-[11px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full active:scale-[0.98] transition-all duration-300 shadow-sm"
                                >
                                    Order Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

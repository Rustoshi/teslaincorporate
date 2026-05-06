"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VehicleProduct {
    _id: string;
    slug: string;
    name: string;
    description: string;
    heroImage: string;
}

interface HeroCarouselProps {
    vehicles: VehicleProduct[];
}

export default function HeroCarousel({ vehicles }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = useCallback(
        (newDirection: number) => {
            setDirection(newDirection);
            setCurrentIndex((prevIndex) => {
                let nextIndex = prevIndex + newDirection;
                if (nextIndex >= vehicles.length) nextIndex = 0;
                if (nextIndex < 0) nextIndex = vehicles.length - 1;
                return nextIndex;
            });
        },
        [vehicles.length]
    );

    // Auto-play effect
    useEffect(() => {
        if (!isAutoPlaying || vehicles.length <= 1) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 3000); // 3 seconds per slide

        return () => clearInterval(timer);
    }, [isAutoPlaying, paginate, vehicles.length]);

    if (!vehicles || vehicles.length === 0) {
        return null; // Fallback handled by parent or just empty
    }

    return (
        <section
            className="relative h-screen w-full flex flex-col items-center justify-between overflow-hidden group bg-[#F4F4F4]"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", ease: "circOut", duration: 0.7 },
                        opacity: { duration: 0.4 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Immersive Parallax Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out scale-105 group-hover:scale-100"
                        style={{ backgroundImage: `url(${vehicles[currentIndex].heroImage})` }}
                    />

                    {/* Subtle Top/Bottom Scrim for pure text legibility against pure white/black images */}
                    <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {/* Typography (Top-Aligned Tesla Style) */}
            <div className="relative z-10 w-full flex flex-col items-center justify-start pt-28 sm:pt-36 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h1
                            className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight drop-shadow-md"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.02em" }}
                        >
                            {vehicles[currentIndex].name}
                        </h1>
                        <p className="text-base sm:text-lg text-white/90 mt-2 font-medium tracking-wider drop-shadow-sm max-w-lg mx-auto px-4">
                            {vehicles[currentIndex].description || "Experience the Future."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Action Area (Bottom-Aligned) */}
            <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-10 flex flex-col items-center gap-6 w-full px-6">

                {/* Order Button */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`btn-${currentIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="w-full max-w-sm mx-auto flex justify-center"
                    >
                        <Link
                            href={`/dashboard/shop/${vehicles[currentIndex].slug}`}
                            className="w-full sm:w-[260px] text-center bg-white/90 backdrop-blur-md text-black text-xs font-bold tracking-[0.1em] uppercase px-8 py-3.5 rounded hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                        >
                            Order Now
                        </Link>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Visible on hover on desktop) hidden logically in this layer but positioned absolute */}
                {vehicles.length > 1 && (
                    <>
                        <button
                            className="absolute left-6 bottom-1/2 translate-y-1/2 sm:left-12 sm:top-[-40vh] z-20 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg"
                            onClick={() => paginate(-1)}
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                        <button
                            className="absolute right-6 bottom-1/2 translate-y-1/2 sm:right-12 sm:top-[-40vh] z-20 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg"
                            onClick={() => paginate(1)}
                            aria-label="Next Slide"
                        >
                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {vehicles.length > 1 && (
                    <div className="flex gap-2">
                        {vehicles.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > currentIndex ? 1 : -1);
                                    setCurrentIndex(idx);
                                }}
                                className={`relative h-1 rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 ${idx === currentIndex ? "w-16 bg-white/30" : "w-2 bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                {/* Animated Progress Bar for the Active Slide */}
                                {idx === currentIndex && isAutoPlaying && (
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                        className="absolute inset-y-0 left-0 bg-white"
                                    />
                                )}
                                {idx === currentIndex && !isAutoPlaying && (
                                    <div className="absolute inset-y-0 left-0 bg-white w-full" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

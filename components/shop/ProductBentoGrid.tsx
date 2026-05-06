"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProductItem {
    _id: string;
    slug: string;
    name: string;
    description: string;
    heroImage: string;
}

interface ProductBentoGridProps {
    title: string;
    items: ProductItem[];
    darkTheme?: boolean;
    id?: string;
}

export default function ProductBentoGrid({ title, items, darkTheme = false, id }: ProductBentoGridProps) {
    if (!items || items.length === 0) return null;

    const bgClass = darkTheme ? "bg-black" : "bg-[#F4F4F4]";
    const textClass = darkTheme ? "text-white" : "text-black";
    const subTextClass = darkTheme ? "text-white/60" : "text-black/60";
    const buttonClass = darkTheme
        ? "bg-white text-black hover:bg-white/90"
        : "bg-black text-white hover:bg-black/90";

    return (
        <section id={id} className={`py-24 sm:py-32 w-full mx-auto ${bgClass} transition-colors duration-700`}>
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10">

                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16"
                >
                    <h2
                        className={`text-4xl sm:text-5xl font-semibold tracking-tight ${textClass}`}
                        style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.02em" }}
                    >
                        {title}
                    </h2>
                </motion.div>

                {/* Editorial Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                    {items.map((item, idx) => {
                        // Pattern: 1st is full width, 2nd & 3rd are half width. Repeat.
                        const isFullWidth = idx % 3 === 0;

                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (idx % 3) * 0.1 }} // Custom ease for dramatic reveal
                                className={`flex flex-col group cursor-pointer ${isFullWidth ? "md:col-span-2" : "md:col-span-1"}`}
                            >
                                {/* Immersive Image Frame */}
                                <div className={`relative w-full overflow-hidden bg-black/5 ${isFullWidth ? "aspect-video sm:aspect-[21/9]" : "aspect-[4/3]"}`}>
                                    {/* Image with extreme slow scale on hover */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                                        style={{ backgroundImage: `url(${item.heroImage})` }}
                                    />
                                    {/* Optional overlay if needed, but going for stark contrast so leaving it raw */}
                                </div>

                                {/* Typography Below Image (Editorial Style) */}
                                <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                    <div className="flex-1 max-w-2xl">
                                        <h3
                                            className={`text-2xl sm:text-3xl font-semibold mb-2 ${textClass}`}
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif", letterSpacing: "-0.01em" }}
                                        >
                                            {item.name}
                                        </h3>
                                        <p className={`text-sm sm:text-base font-medium leading-relaxed ${subTextClass}`}>
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        <Link
                                            href={`/dashboard/shop/${item.slug}`}
                                            className={`inline-block text-center text-xs font-bold tracking-[0.1em] uppercase px-8 py-3.5 rounded active:scale-95 transition-all duration-300 shadow-sm cursor-pointer ${buttonClass}`}
                                        >
                                            Order Now
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

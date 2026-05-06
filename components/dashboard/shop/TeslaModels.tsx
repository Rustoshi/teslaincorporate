"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function TeslaModels({ vehicles = [] }: { vehicles?: any[] }) {
    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="mb-10">
            <h2
                className="text-lg font-bold tracking-wide uppercase text-white mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                Available Models
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vehicles.map((model, i) => (
                    <motion.div
                        key={model.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.2] transition-colors duration-500 group flex flex-col h-full"
                    >
                        {/* Image Container */}
                        <div className="relative w-full h-48 sm:h-56 bg-white/[0.02] overflow-hidden">
                            <Image
                                src={model.img}
                                alt={model.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-4 left-5">
                                <h3 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                                    {model.name}
                                </h3>
                                <p className="text-xs text-white/60 tracking-wider uppercase font-medium mt-0.5">
                                    {model.tagline}
                                </p>
                            </div>
                        </div>

                        {/* Specs & CTA */}
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Range (EPA)</div>
                                    <div className="text-sm font-semibold text-white">{model.range}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">0-60 MPH</div>
                                    <div className="text-sm font-semibold text-white">{model.acceleration}</div>
                                </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-sm text-white/80 font-medium">{model.price}</span>
                                <Link
                                    href={`/dashboard/shop/${model.slug}`}
                                    className="px-5 py-2 block bg-white text-black text-[11px] font-bold tracking-widest uppercase rounded-full hover:bg-white/90 transition-colors cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

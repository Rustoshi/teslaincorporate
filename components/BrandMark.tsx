"use client";

import { motion } from "framer-motion";

export default function BrandMark() {
    return (
        <motion.header
            className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pt-6 sm:pt-8 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
            <h1 className="text-lg sm:text-xl md:text-2xl font-extralight tracking-[0.4em] uppercase text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                <span className="text-red-500 font-light">Tesla</span> <span className="text-white">Inc</span>
            </h1>
        </motion.header>
    );
}

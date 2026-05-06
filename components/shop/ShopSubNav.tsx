"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function ShopSubNav({ sections }: { sections: { id: string; label: string }[] }) {
    const [isSticky, setIsSticky] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Assume the hero is roughly 100vh. Stick the nav after scrolling past it.
        // We'll use a rough pixel threshold or let CSS `sticky` handle the positioning, 
        // but use this state to add a backdrop blur when it's actively sticking.
        setIsSticky(latest > window.innerHeight - 60);
    });

    return (
        <div
            className={`sticky top-14 z-40 w-full border-b transition-all duration-300 ${isSticky ? "bg-white/80 backdrop-blur-md border-black/10" : "bg-white border-black/5"
                }`}
        >
            <nav className="max-w-[1800px] mx-auto px-6 sm:px-10 h-12 flex items-center justify-center sm:justify-start overflow-x-auto scrollbar-hide">
                <ul className="flex items-center gap-8">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <button
                                onClick={() => {
                                    const element = document.getElementById(section.id);
                                    if (element) {
                                        const yOffset = -100; // Account for main nav + subnav height
                                        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }
                                }}
                                className="text-xs font-semibold tracking-[0.15em] uppercase text-black/60 hover:text-black transition-colors whitespace-nowrap py-4"
                            >
                                {section.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

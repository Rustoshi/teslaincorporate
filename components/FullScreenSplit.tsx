"use client";

import { useState } from "react";
import HeroSplitSection from "./HeroSplitSection";

export default function FullScreenSplit() {
    const [hoveredSection, setHoveredSection] = useState<"invest" | "shop" | null>(null);

    return (
        <div className="w-full h-[100dvh] bg-black overflow-hidden relative">

            {/* SVG Defs for Clip Path */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                        {/* 
                          A smooth cubic bezier wave bridging the middle.
                          Covers from top (y=0) down to y=0.9, then waves up to y=0.8.
                        */}
                        <path d="M 0,0 L 1,0 L 1,0.9 C 0.65,1.0 0.35,0.8 0,0.9 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Bottom Half — Shop */}
            <div className="absolute bottom-0 left-0 w-full h-[60dvh] z-[1]">
                <HeroSplitSection
                    title="Shop"
                    subtitle="Explore and Purchase Tesla Vehicles"
                    bgImage="/shop-bg.png"
                    buttonText="Browse Vehicles"
                    buttonLink="/shop"
                    isHovered={hoveredSection === "shop"}
                    isDimmed={hoveredSection === "invest"}
                    onMouseEnter={() => setHoveredSection("shop")}
                    onMouseLeave={() => setHoveredSection(null)}
                    titleColor="text-white"
                    position="bottom"
                />
            </div>

            {/* Top Half — Invest */}
            <div
                className="absolute top-0 left-0 w-full h-[55dvh] z-[2]"
                style={{
                    clipPath: "url(#wave-clip)",
                }}
            >
                <HeroSplitSection
                    title="Invest"
                    subtitle="Space City Fund · Tunnel Network · AI Plans"
                    bgImage="/invest-bg.png"
                    buttonText="Start Investing"
                    buttonLink="/invest"
                    isHovered={hoveredSection === "invest"}
                    isDimmed={hoveredSection === "shop"}
                    onMouseEnter={() => setHoveredSection("invest")}
                    onMouseLeave={() => setHoveredSection(null)}
                    titleColor="text-red-500"
                    position="top"
                />
            </div>

            {/* Thin Red Waveform Border Outline */}
            <div className="absolute top-0 left-0 w-full h-[55dvh] pointer-events-none z-[3]">
                <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 1 1"
                >
                    <path
                        d="M 0,0.9 C 0.35,0.8 0.65,1.0 1,0.9"
                        fill="none"
                        stroke="#e82127"
                        strokeWidth="0.003"
                        className="opacity-90 drop-shadow-[0_0_8px_rgba(232,33,39,0.8)]"
                    />
                </svg>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";

const footerLinks = [
    {
        heading: "Platform",
        links: [
            { label: "How It Works", href: "/how-it-works" },
            { label: "Markets", href: "/markets" },
            { label: "AI Plans", href: "/ai-plans" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Press", href: "/press" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Compliance", href: "/compliance" },
        ],
    },
];

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
}

export default function Footer() {
    return (
        <footer className="relative w-full bg-black border-t border-white/[0.06]">
            <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-8 mb-16">
                    <div className="col-span-2 sm:col-span-1 mb-4 sm:mb-0">
                        <Link
                            href="/invest"
                            className="text-base font-bold tracking-[0.25em] uppercase text-white"
                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            Tesla <span className="text-red-500">Inc</span>
                        </Link>
                        <p className="text-xs text-white/30 font-light mt-4 leading-relaxed max-w-[200px]">
                            AI-powered capital deployment across innovation-driven markets.
                        </p>
                    </div>

                    {footerLinks.map((col) => (
                        <div key={col.heading}>
                            <h4
                                className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-5"
                                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                            >
                                {col.heading}
                            </h4>
                            <ul className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith("/") ? (
                                            <Link
                                                href={link.href}
                                                className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                onClick={(e) => scrollTo(e, link.href)}
                                                className="text-sm text-white/50 hover:text-white transition-colors duration-300 cursor-pointer"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}

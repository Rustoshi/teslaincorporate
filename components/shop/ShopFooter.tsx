import Link from "next/link";

export default function ShopFooter() {
    const links = [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
    ];

    return (
        <footer className="relative bg-[#F4F4F4] py-8 border-t border-black/[0.1]">
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10 flex flex-col items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/50 hover:text-black/80 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <p className="text-[9px] text-black/40 tracking-widest uppercase font-medium">
                    © {new Date().getFullYear()} Tesla Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

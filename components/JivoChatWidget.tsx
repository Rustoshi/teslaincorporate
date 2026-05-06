"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        jivo_api: any;
    }
}

export default function JivoChatWidget() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    useEffect(() => {
        if (isAdmin) return;
        if (document.getElementById("jivo-script")) return;

        const script = document.createElement("script");
        script.id = "jivo-script";
        script.src = "//code.jivosite.com/widget/MSZVmc23l0";
        script.async = true;
        document.head.appendChild(script);

        // Elevate only the outermost widget container, not internal jdiv elements
        const style = document.createElement("style");
        style.id = "jivo-style";
        style.textContent = ".__jivoMobileButton { margin-bottom: 112px !important; } .__jivoMobileButtonWrap { bottom: 112px !important; }";
        document.head.appendChild(style);
    }, [isAdmin]);

    // Hide/show widget when navigating between admin and non-admin routes
    useEffect(() => {
        const style = document.getElementById("jivo-style");
        if (!style) return;
        if (isAdmin) {
            style.textContent = "jdiv[data-id] { display: none !important; }";
        } else {
            style.textContent = ".__jivoMobileButton { margin-bottom: 112px !important; } .__jivoMobileButtonWrap { bottom: 112px !important; }";
        }
    }, [isAdmin]);

    return null;
}

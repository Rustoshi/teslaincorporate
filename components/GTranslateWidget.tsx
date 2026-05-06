"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        gtranslateSettings: any;
    }
}

// All major world languages supported by GTranslate / Google Translate
const LANGUAGES = [
    "en", "zh-CN", "zh-TW", "es", "ar", "fr", "pt", "ru", "de", "ja",
    "ko", "it", "hi", "tr", "nl", "pl", "sv", "da", "no", "fi",
    "cs", "sk", "hu", "ro", "bg", "hr", "sr", "uk", "el", "he",
    "th", "vi", "id", "ms", "fa", "ur", "bn", "sw", "af", "tl",
    "lt", "lv", "et", "sl", "ca", "eu", "gl", "cy", "is", "mk",
    "sq", "hy", "ka", "az", "kk", "uz", "mn", "my", "km", "lo",
    "si", "ne", "am",
];

export default function GTranslateWidget() {
    const pathname = usePathname();
    const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

    useEffect(() => {
        if (isHidden) return;

        // Avoid duplicate injection
        if (document.getElementById("gtranslate-script")) return;

        window.gtranslateSettings = {
            default_language: "en",
            native_language_names: true,
            detect_browser_language: true,
            languages: LANGUAGES,
            wrapper_selector: ".gtranslate_wrapper",
            flag_size: 24,
            switcher_horizontal_position: "left",
            switcher_vertical_position: "bottom",
            switcher_bottom_offset: 90,
        };

        // Lift the widget above the mobile bottom nav via CSS override
        if (!document.getElementById("gtranslate-style")) {
            const style = document.createElement("style");
            style.id = "gtranslate-style";
            style.textContent = `.gt_float_switcher { bottom: 90px !important; }`;
            document.head.appendChild(style);
        }

        const script = document.createElement("script");
        script.id = "gtranslate-script";
        script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
        script.defer = true;
        document.body.appendChild(script);
    }, [isHidden]);

    if (isHidden) return null;

    return <div className="gtranslate_wrapper" />;
}

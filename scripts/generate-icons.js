const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SOURCE = path.join(__dirname, "..", "public", "logo.png");
const APP_DIR = path.join(__dirname, "..", "app");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

async function generate() {
    const src = sharp(SOURCE).png();

    // 1. favicon.ico (32x32 PNG saved as .ico — browsers accept PNG favicons)
    await sharp(SOURCE)
        .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .png()
        .toFile(path.join(APP_DIR, "favicon.ico"));
    console.log("✓ favicon.ico (48x48)");

    // 2. apple-icon.png (180x180) — with black background for Apple devices
    await sharp(SOURCE)
        .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .png()
        .toFile(path.join(APP_DIR, "apple-icon.png"));
    console.log("✓ apple-icon.png (180x180)");

    // 3. icon-192.png (192x192) — Android / PWA
    await sharp(SOURCE)
        .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .png()
        .toFile(path.join(PUBLIC_DIR, "icon-192.png"));
    console.log("✓ icon-192.png (192x192)");

    // 4. icon-512.png (512x512) — PWA splash
    await sharp(SOURCE)
        .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .png()
        .toFile(path.join(PUBLIC_DIR, "icon-512.png"));
    console.log("✓ icon-512.png (512x512)");

    // 5. og-image.png (1200x630) — Open Graph / Twitter card
    // Create a black canvas with the logo centered
    const ogWidth = 1200;
    const ogHeight = 630;
    const logoSize = 400;
    const logoBuffer = await sharp(SOURCE)
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    await sharp({
        create: {
            width: ogWidth,
            height: ogHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 255 },
        },
    })
        .png()
        .composite([
            {
                input: logoBuffer,
                left: Math.floor((ogWidth - logoSize) / 2),
                top: Math.floor((ogHeight - logoSize) / 2),
            },
        ])
        .toFile(path.join(PUBLIC_DIR, "og-image.png"));
    console.log("✓ og-image.png (1200x630)");

    console.log("\nAll icons generated successfully!");
}

generate().catch(console.error);

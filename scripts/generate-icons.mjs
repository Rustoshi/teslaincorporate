import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const logoPath = path.join(publicDir, "logo.png");

async function generate() {
  const logo = sharp(logoPath);
  const metadata = await logo.metadata();
  console.log(`Source logo: ${metadata.width}x${metadata.height}`);

  // 1. favicon.ico (32x32 PNG saved as .ico — modern browsers accept PNG)
  await sharp(logoPath)
    .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, "favicon.ico"));
  console.log("✓ favicon.ico (32x32)");

  // 2. favicon-16x16.png
  await sharp(logoPath)
    .resize(16, 16, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, "favicon-16x16.png"));
  console.log("✓ favicon-16x16.png");

  // 3. favicon-32x32.png
  await sharp(logoPath)
    .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, "favicon-32x32.png"));
  console.log("✓ favicon-32x32.png");

  // 4. apple-icon.png (180x180)
  await sharp(logoPath)
    .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, "apple-icon.png"));
  console.log("✓ apple-icon.png (180x180)");

  // 5. icon-192.png (Android / PWA)
  await sharp(logoPath)
    .resize(192, 192, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));
  console.log("✓ icon-192.png (192x192)");

  // 6. icon-512.png (Android / PWA)
  await sharp(logoPath)
    .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));
  console.log("✓ icon-512.png (512x512)");

  // 7. og-image.png (1200x630) — logo centered on a dark background
  const ogWidth = 1200;
  const ogHeight = 630;
  const logoPadded = await sharp(logoPath)
    .resize(500, 500, { fit: "inside" })
    .toBuffer();

  const logoMeta = await sharp(logoPadded).metadata();

  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: logoPadded,
        left: Math.round((ogWidth - logoMeta.width) / 2),
        top: Math.round((ogHeight - logoMeta.height) / 2),
      },
    ])
    .png()
    .toFile(path.join(publicDir, "og-image.png"));
  console.log("✓ og-image.png (1200x630)");

  console.log("\nAll icons generated successfully!");
}

generate().catch(console.error);

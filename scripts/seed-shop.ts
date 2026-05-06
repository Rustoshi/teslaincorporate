/**
 * seed-shop.ts
 *
 * Seeds the database with Tesla vehicles, energy products, and finance plans.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-shop.ts
 *
 *   Or add to package.json scripts:
 *     "seed:shop": "ts-node scripts/seed-shop.ts"
 */

import mongoose from 'mongoose';
// @ts-ignore
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ── Models ──────────────────────────────────────────────────────────────
import ShopProduct from '../models/ShopProduct';
import VehicleDetails from '../models/VehicleDetails';
import EnergyDetails from '../models/EnergyDetails';
import FinancePlan from '../models/FinancePlan';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';

async function seed() {
    if (!MONGO_URI) {
        console.error('❌ MONGODB_URI not set in .env');
        process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── Clear existing shop data ───────────────────────────────────────
    await ShopProduct.deleteMany({});
    await VehicleDetails.deleteMany({});
    await EnergyDetails.deleteMany({});
    await FinancePlan.deleteMany({});
    console.log('🗑️  Cleared existing shop data.\n');

    // ── Vehicles ───────────────────────────────────────────────────────
    const vehicles = [
        {
            name: 'Model S',
            slug: 'model-s',
            category: 'VEHICLE' as const,
            description: 'The pinnacle of electric sedan performance. Beyond Ludicrous acceleration, unmatched range, and a premium interior.',
            heroImage: '/shop/model-s.png',
            details: {
                rangeMiles: 405,
                topSpeed: '200 mph',
                zeroToSixty: '1.99s',
                variants: [
                    { name: 'All-Wheel Drive', cashPrice: 74990, financePrice: 1057 },
                    { name: 'Plaid', cashPrice: 89990, financePrice: 1269 },
                ],
                availableColors: [
                    { name: 'Pearl White', hex: '#F2F2F2' },
                    { name: 'Solid Black', hex: '#1A1A1A' },
                    { name: 'Midnight Silver', hex: '#4A4A4A' },
                    { name: 'Deep Blue', hex: '#1B2A4A' },
                    { name: 'Ultra Red', hex: '#8B1A1A' },
                ],
                financeEligible: true,
                minimumDownPayment: 7499,
            },
        },
        {
            name: 'Model 3',
            slug: 'model-3',
            category: 'VEHICLE' as const,
            description: 'The most affordable Tesla. Performance and efficiency combined with cutting-edge technology.',
            heroImage: '/shop/model-3.png',
            details: {
                rangeMiles: 358,
                topSpeed: '162 mph',
                zeroToSixty: '3.1s',
                variants: [
                    { name: 'Rear-Wheel Drive', cashPrice: 38990, financePrice: 529 },
                    { name: 'Long Range All-Wheel Drive', cashPrice: 45990, financePrice: 624 },
                    { name: 'Performance All-Wheel Drive', cashPrice: 52990, financePrice: 719 },
                ],
                availableColors: [
                    { name: 'Pearl White', hex: '#F2F2F2' },
                    { name: 'Solid Black', hex: '#1A1A1A' },
                    { name: 'Midnight Silver', hex: '#4A4A4A' },
                    { name: 'Deep Blue', hex: '#1B2A4A' },
                    { name: 'Ultra Red', hex: '#8B1A1A' },
                ],
                financeEligible: true,
                minimumDownPayment: 3899,
            },
        },
        {
            name: 'Model X',
            slug: 'model-x',
            category: 'VEHICLE' as const,
            description: 'Premium SUV with falcon wing doors. Utility meets speed with the most versatile interior.',
            heroImage: '/shop/model-x.png',
            details: {
                rangeMiles: 348,
                topSpeed: '163 mph',
                zeroToSixty: '2.5s',
                variants: [
                    { name: 'All-Wheel Drive', cashPrice: 79990, financePrice: 1128 },
                    { name: 'Plaid', cashPrice: 94990, financePrice: 1339 },
                ],
                availableColors: [
                    { name: 'Pearl White', hex: '#F2F2F2' },
                    { name: 'Solid Black', hex: '#1A1A1A' },
                    { name: 'Midnight Silver', hex: '#4A4A4A' },
                    { name: 'Deep Blue', hex: '#1B2A4A' },
                    { name: 'Cream', hex: '#F5F0E8' },
                ],
                financeEligible: true,
                minimumDownPayment: 7999,
            },
        },
        {
            name: 'Model Y',
            slug: 'model-y',
            category: 'VEHICLE' as const,
            description: 'Versatile by design. Spacious, efficient, and built for every journey.',
            heroImage: '/shop/model-y.png',
            details: {
                rangeMiles: 327,
                topSpeed: '155 mph',
                zeroToSixty: '4.6s',
                variants: [
                    { name: 'Rear-Wheel Drive', cashPrice: 39990, financePrice: 529 },
                    { name: 'All-Wheel Drive', cashPrice: 41990, financePrice: 557 },
                    { name: 'Premium Rear-Wheel Drive', cashPrice: 44990, financePrice: 617 },
                    { name: 'Premium All-Wheel Drive', cashPrice: 48990, financePrice: 674 },
                    { name: 'Performance All-Wheel Drive', cashPrice: 57490, financePrice: 905 },
                ],
                availableColors: [
                    { name: 'Pearl White', hex: '#F2F2F2' },
                    { name: 'Solid Black', hex: '#1A1A1A' },
                    { name: 'Midnight Silver', hex: '#4A4A4A' },
                    { name: 'Quicksilver', hex: '#C0C0C0' },
                    { name: 'Ultra Red', hex: '#8B1A1A' },
                ],
                financeEligible: true,
                minimumDownPayment: 3999,
            },
        },
        {
            name: 'Cybertruck',
            slug: 'cybertruck',
            category: 'VEHICLE' as const,
            description: 'Built for any planet. More utility than a truck, faster than a sports car.',
            heroImage: '/shop/cybertruck.png',
            details: {
                rangeMiles: 340,
                topSpeed: '130 mph',
                zeroToSixty: '2.6s',
                variants: [
                    { name: 'Rear-Wheel Drive', cashPrice: 60990, financePrice: 850 },
                    { name: 'All-Wheel Drive', cashPrice: 79990, financePrice: 1128 },
                    { name: 'Cyberbeast', cashPrice: 99990, financePrice: 1410 },
                ],
                availableColors: [
                    { name: 'Stainless Steel', hex: '#A9A9A9' },
                ],
                financeEligible: true,
                minimumDownPayment: 6099,
            },
        },
        {
            name: 'Roadster',
            slug: 'roadster',
            category: 'VEHICLE' as const,
            description: 'The quickest car in the world, with record-setting acceleration, range and performance.',
            heroImage: '/shop/roadster.png',
            details: {
                rangeMiles: 620,
                topSpeed: '+250 mph',
                zeroToSixty: '1.9s',
                variants: [
                    { name: 'Base', cashPrice: 200000, financePrice: 2800 },
                    { name: 'Founders Series', cashPrice: 250000, financePrice: 3500 },
                ],
                availableColors: [
                    { name: 'Red', hex: '#8B1A1A' },
                    { name: 'White', hex: '#F2F2F2' },
                    { name: 'Black', hex: '#1A1A1A' },
                ],
                financeEligible: true,
                minimumDownPayment: 20000,
            },
        },
        {
            name: 'Tesla Semi',
            slug: 'semi',
            category: 'VEHICLE' as const,
            description: 'The safest, most comfortable truck ever. Four independent motors provide maximum power and acceleration.',
            heroImage: '/shop/semi.png',
            details: {
                rangeMiles: 500,
                topSpeed: '65 mph',
                zeroToSixty: '20s',
                variants: [
                    { name: '300-Mile Range', cashPrice: 150000, financePrice: 2100 },
                    { name: '500-Mile Range', cashPrice: 180000, financePrice: 2500 },
                ],
                availableColors: [
                    { name: 'White', hex: '#F2F2F2' },
                    { name: 'Silver', hex: '#C0C0C0' },
                ],
                financeEligible: true,
                minimumDownPayment: 15000,
            },
        },
    ];

    // ── Energy Products ────────────────────────────────────────────────
    const energyProducts = [
        {
            name: 'Solar Panels',
            slug: 'solar-panels',
            category: 'ENERGY' as const,
            description: 'Power your home with clean, renewable energy. Sleek design with maximum efficiency.',
            heroImage: '/shop/solar-panels.png',
            details: {
                energyType: 'SOLAR' as const,
                capacityInfo: 'Residential solar panel systems',
                variants: [
                    { name: '4.8 kW System', cashPrice: 9600, financePrice: 120 },
                    { name: '8.5 kW System', cashPrice: 16000, financePrice: 200 },
                    { name: '12.0 kW System', cashPrice: 22000, financePrice: 275 },
                    { name: '16.0 kW System (Large Home)', cashPrice: 28800, financePrice: 360 },
                ],
                financeEligible: true,
                minimumDownPayment: 960,
                installationRequired: true,
            },
        },
        {
            name: 'Powerwall',
            slug: 'powerwall',
            category: 'ENERGY' as const,
            description: 'Store energy. Control your future. Home battery for solar self-consumption and backup.',
            heroImage: '/shop/powerwall.png',
            details: {
                energyType: 'POWERWALL' as const,
                capacityInfo: 'Home battery backup systems',
                variants: [
                    { name: 'Powerwall 3 (13.5 kWh)', cashPrice: 11500, financePrice: 144 },
                    { name: 'Powerwall 3 × 2 (27 kWh)', cashPrice: 21500, financePrice: 269 },
                    { name: 'Powerwall 3 × 3 (40.5 kWh)', cashPrice: 30500, financePrice: 381 },
                ],
                financeEligible: true,
                minimumDownPayment: 1150,
                installationRequired: true,
            },
        },
        {
            name: 'Solar Roof',
            slug: 'solar-roof',
            category: 'ENERGY' as const,
            description: 'A beautiful roof with fully integrated solar and energy storage.',
            heroImage: '/shop/solar-roof.png',
            details: {
                energyType: 'SOLAR' as const,
                capacityInfo: 'Integrated solar roof system',
                variants: [
                    { name: 'Standard Roof', cashPrice: 35000, financePrice: 437 },
                    { name: 'Large Roof', cashPrice: 55000, financePrice: 687 },
                ],
                financeEligible: true,
                minimumDownPayment: 3500,
                installationRequired: true,
            },
        },
        {
            name: 'Megapack',
            slug: 'megapack',
            category: 'ENERGY' as const,
            description: 'Massive energy storage for the grid, allowing the world to transition to sustainable energy.',
            heroImage: '/shop/megapack.png',
            details: {
                energyType: 'POWERWALL' as const,
                capacityInfo: 'Commercial battery storage',
                variants: [
                    { name: '1 Megapack (3.9 MWh)', cashPrice: 1200000, financePrice: 15000 },
                    { name: '2 Megapacks (7.8 MWh)', cashPrice: 2400000, financePrice: 30000 },
                ],
                financeEligible: true,
                minimumDownPayment: 120000,
                installationRequired: true,
            },
        },
    ];

    // ── Insert Products & Details ──────────────────────────────────────
    const createdVehicleIds: string[] = [];

    for (const vehicle of vehicles) {
        const { details, ...rest } = vehicle;
        const baseCashPrice = Math.min(...details.variants.map(v => v.cashPrice));

        const product = await ShopProduct.create({ ...rest, baseCashPrice });
        await VehicleDetails.create({ productId: product._id, ...details });
        createdVehicleIds.push(product._id.toString());

        const variantSummary = details.variants.map(v => `  ${v.name}: $${v.cashPrice.toLocaleString()} / $${v.financePrice}/mo`).join('\n');
        console.log(`🚘 ${product.name} (from $${baseCashPrice.toLocaleString()})\n${variantSummary}`);
    }

    for (const energy of energyProducts) {
        const { details, ...rest } = energy;
        const baseCashPrice = Math.min(...details.variants.map(v => v.cashPrice));

        const product = await ShopProduct.create({ ...rest, baseCashPrice });
        await EnergyDetails.create({ productId: product._id, ...details });

        const variantSummary = details.variants.map(v => `  ${v.name}: $${v.cashPrice.toLocaleString()} / $${v.financePrice}/mo`).join('\n');
        console.log(`⚡ ${product.name} (from $${baseCashPrice.toLocaleString()})\n${variantSummary}`);
    }

    // ── Finance Plans (for all products with variants) ─────────────────
    const financePlanTemplates = [
        { termMonths: 36, aprPercentage: 2.99, minimumDownPaymentPct: 0.10 },
        { termMonths: 48, aprPercentage: 3.49, minimumDownPaymentPct: 0.10 },
        { termMonths: 60, aprPercentage: 3.99, minimumDownPaymentPct: 0.10 },
        { termMonths: 72, aprPercentage: 4.49, minimumDownPaymentPct: 0.10 },
        { termMonths: 84, aprPercentage: 4.99, minimumDownPaymentPct: 0.05 },
    ];

    // helper: amortization formula
    function calcMonthly(price: number, downPct: number, apr: number, termMonths: number): number {
        const principal = price * (1 - downPct);
        if (apr === 0) return Math.round(principal / termMonths);
        const r = apr / 100 / 12;
        const n = termMonths;
        const compounded = Math.pow(1 + r, n);
        return Math.round(principal * (r * compounded) / (compounded - 1));
    }

    // Create finance plans for vehicles
    for (const vehicleId of createdVehicleIds) {
        const product = await ShopProduct.findById(vehicleId);
        const details = await VehicleDetails.findOne({ productId: vehicleId });
        if (!product || !details) continue;

        for (const template of financePlanTemplates) {
            const variantPricing = details.variants.map((v: any) => ({
                variantName: v.name,
                monthlyPayment: calcMonthly(v.cashPrice, template.minimumDownPaymentPct, template.aprPercentage, template.termMonths),
            }));

            await FinancePlan.create({
                productId: vehicleId,
                termMonths: template.termMonths,
                aprPercentage: template.aprPercentage,
                minimumDownPayment: Math.round(product.baseCashPrice * template.minimumDownPaymentPct),
                variantPricing,
                isActive: true,
            });
        }
        console.log(`💳 Created ${financePlanTemplates.length} finance plans for ${product.name} (${details.variants.length} variants each)`);
    }

    // Create finance plans for energy products
    const allEnergy = await ShopProduct.find({ category: 'ENERGY' });
    for (const product of allEnergy) {
        const details = await EnergyDetails.findOne({ productId: product._id });
        if (!details) continue;

        for (const template of financePlanTemplates) {
            const variantPricing = details.variants.map((v: any) => ({
                variantName: v.name,
                monthlyPayment: calcMonthly(v.cashPrice, template.minimumDownPaymentPct, template.aprPercentage, template.termMonths),
            }));

            await FinancePlan.create({
                productId: product._id,
                termMonths: template.termMonths,
                aprPercentage: template.aprPercentage,
                minimumDownPayment: Math.round(product.baseCashPrice * template.minimumDownPaymentPct),
                variantPricing,
                isActive: true,
            });
        }
        console.log(`💳 Created ${financePlanTemplates.length} finance plans for ${product.name} (${details.variants.length} variants each)`);
    }

    const totalPlans = (createdVehicleIds.length + allEnergy.length) * financePlanTemplates.length;
    console.log('\n✅ Shop seed complete!');
    console.log(`   ${vehicles.length} vehicles (with drivetrain variants)`);
    console.log(`   ${energyProducts.length} energy products (with product variants)`);
    console.log(`   ${totalPlans} finance plans (with per-variant pricing)`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});

/**
 * patch-project-images.ts
 *
 * One-time patch: sets heroImage on the two seeded flagship projects.
 *
 * Usage:
 *   npm run patch:images
 */

import mongoose from 'mongoose';
// @ts-ignore
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import ProjectInvestment from '../models/ProjectInvestment';

async function connect() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');
    await mongoose.connect(uri);
    console.log('[patch-project-images] Connected to MongoDB');
}

const patches = [
    {
        slug:      'spacex-space-city',
        heroImage: '/images/hero1.jpg',
    },
    {
        slug:      'boring-company-tunnel-network',
        heroImage: '/images/hero2.jpg',
    },
];

async function patch() {
    await connect();

    for (const { slug, heroImage } of patches) {
        const result = await ProjectInvestment.updateOne(
            { slug },
            { $set: { heroImage } }
        );

        if (result.matchedCount === 0) {
            console.log(`[skip] No project found with slug: ${slug}`);
        } else if (result.modifiedCount === 0) {
            console.log(`[unchanged] "${slug}" already has this heroImage`);
        } else {
            console.log(`[updated] "${slug}" → heroImage: ${heroImage}`);
        }
    }

    console.log('\n[patch-project-images] Done.');
    await mongoose.disconnect();
}

patch().catch(err => {
    console.error('[patch-project-images] Error:', err);
    process.exit(1);
});

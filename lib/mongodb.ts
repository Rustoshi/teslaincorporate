import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null };
}

async function seedAdmin() {
    // Strip literal single/double quotes if the user wrapped their .env variables
    const adminEmail = process.env.ADMIN_EMAIL?.replace(/^['"]|['"]$/g, '');
    const adminPassword = process.env.PASSWORD?.replace(/^['"]|['"]$/g, '');

    console.log(`[seedAdmin] Checking auto-seed for: ${adminEmail || 'NOT SET'}`);

    if (!adminEmail || !adminPassword) {
        console.log("[seedAdmin] Missing ADMIN_EMAIL or PASSWORD in .env. Skipping admin seed.");
        return; // Skip silently if not configured
    }

    try {
        // Dynamically import User to avoid circular dependencies
        const { default: User } = await import('@/models/User');

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            console.log(`[seedAdmin] Creating default admin account: ${adminEmail}`);
            await User.create({
                firstName: "Super",
                lastName: "Admin",
                email: adminEmail,
                password: adminPassword, // Plain text per requirements
                role: "super_admin",
                gender: "N/A",
                dob: new Date(),
                country: "Global",
                currency: "USD",
                phone: "0000000000",
            });
            console.log(`✅ Default admin account automatically provisioned: ${adminEmail}`);
        } else {
            console.log(`[seedAdmin] Admin account already exists: ${adminEmail}`);

            if (adminExists.role !== 'super_admin' && adminExists.role !== 'manager') {
                console.log(`[seedAdmin] Upgrading account role to super_admin`);
                adminExists.role = 'super_admin';
                await adminExists.save();
                console.log(`✅ Admin role updated to super_admin.`);
            }
        }
    } catch (error) {
        console.error("❌ Failed to seed admin account:", error);
    }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then(async (mongooseInstance) => {
            // Seed the admin on the first connection established
            await seedAdmin();
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;

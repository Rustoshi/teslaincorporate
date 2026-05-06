import 'dotenv/config';
import mongoose from 'mongoose';
import ShopOrder from './models/ShopOrder';

async function run() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const order = await ShopOrder.findOne().sort({ createdAt: -1 }).lean();
    console.log(JSON.stringify(order, null, 2));
    process.exit(0);
}

run();

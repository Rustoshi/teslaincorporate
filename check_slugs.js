require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await mongoose.connection.db.collection('shopproducts').find().toArray();
    console.log("PRODUCTS IN DB:", products.map(p => ({ _id: p._id, name: p.name, slug: p.slug })));
    process.exit(0);
}

run();

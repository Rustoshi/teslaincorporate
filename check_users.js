const mongoose = require('mongoose');

async function checkUsers() {
    await mongoose.connect('mongodb+srv://root:%40Newpass12@cluster0.sznor6a.mongodb.net/newmuskspace');
    const db = mongoose.connection.db;
    const users = await db.collection('users').find().toArray();
    console.log("ALL USERS:", users.map(u => ({ email: u.email, role: u.role })));
    process.exit(0);
}

checkUsers().catch(console.error);

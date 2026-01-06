import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

async function checkAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        const admins = await Admin.find({});
        console.log(`Found ${admins.length} admins:`);
        admins.forEach(a => console.log(`- ID: ${a._id}, Email: ${a.email}, Name: ${a.name}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdmins();

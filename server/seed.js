/**
 * Seed Script - Creates initial admin account and sample data
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

const path = require('path');

// Force DNS resolution using Google DNS to fix SRV lookup issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carex';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@carex.com' });
        if (existingAdmin) {
            console.log('⚠️ Admin account already exists');
        } else {
            // Create admin
            const admin = new User({
                name: 'CareX Admin',
                email: 'admin@carex.com',
                password: 'admin123',  // Will be hashed by the pre-save hook
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin account created:');
            console.log('   Email: admin@carex.com');
            console.log('   Password: admin123');
        }

        // Create sample doctor if doesn't exist
        const existingDoctor = await User.findOne({ email: 'doctor@carex.com' });
        if (!existingDoctor) {
            const doctor = new User({
                name: 'Dr. Helal Uddin Ahmed',
                email: 'doctor@carex.com',
                password: 'doctor123',
                role: 'doctor',
                specialty: 'Psychiatry, Anxiety Disorders'
            });
            await doctor.save();
            console.log('✅ Sample doctor created:');
            console.log('   Email: doctor@carex.com');
            console.log('   Password: doctor123');
        }

        // Create sample counsellor if doesn't exist
        const existingCounsellor = await User.findOne({ email: 'counsellor@carex.com' });
        if (!existingCounsellor) {
            const counsellor = new User({
                name: 'Dr. Md. Zahir Uddin',
                email: 'counsellor@carex.com',
                password: 'counsellor123',
                role: 'counsellor',
                specialty: 'CBT, Stress Management'
            });
            await counsellor.save();
            console.log('✅ Sample counsellor created:');
            console.log('   Email: counsellor@carex.com');
            console.log('   Password: counsellor123');
        }

        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📝 Quick Start:');
        console.log('   1. Run: node server.js');
        console.log('   2. Open: http://localhost:5050/mental.html');
        console.log('   3. Admin Panel: http://localhost:5050/admin.html');
        console.log('   4. Chat Page: http://localhost:5050/chat.html');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();

const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS resolution using Google DNS to fix SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carex', options);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('💡 TIP: Check your MongoDB Atlas IP Whitelist and network connection.');
        process.exit(1);
    }
};

module.exports = connectDB;

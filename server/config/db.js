const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to avoid SRV lookup failures on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carex';

const CONNECTION_OPTIONS = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,           // max simultaneous connections
    minPoolSize: 2,            // keep at least 2 connections alive
    heartbeatFrequencyMS: 10000, // check server health every 10s
};

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

// --- Connection Event Listeners ---
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected — will attempt to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB error: ${err.message}`);
});

// --- Connect with Retry Logic ---
const connectDB = async (attempt = 1) => {
    try {
        await mongoose.connect(MONGODB_URI, CONNECTION_OPTIONS);
    } catch (err) {
        const isAuthError = err.message.includes('bad auth') || err.message.includes('Authentication failed');

        if (isAuthError) {
            console.error('❌ MongoDB auth failed — check MONGODB_URI credentials in .env');
            process.exit(1); // Auth errors won't fix themselves, exit immediately
        }

        if (attempt >= MAX_RETRIES) {
            console.error(`❌ MongoDB connection failed after ${MAX_RETRIES} attempts: ${err.message}`);
            console.error('💡 Check your MONGODB_URI and network connection.');
            process.exit(1);
        }

        const delay = RETRY_DELAY_MS * attempt; // exponential-ish back-off
        console.warn(`⏳ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${delay / 1000}s...`);
        console.warn(`   Reason: ${err.message}`);
        await new Promise(res => setTimeout(res, delay));
        return connectDB(attempt + 1);
    }
};

module.exports = connectDB;

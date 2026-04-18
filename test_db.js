const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8']);

const uri = 'mongodb://nujhatcse20230204063_db_user:Scis0tMAnJB0OmWf@ac-x6dqn13-shard-00-00.xjbpgam.mongodb.net:27017,ac-x6dqn13-shard-00-01.xjbpgam.mongodb.net:27017,ac-x6dqn13-shard-00-02.xjbpgam.mongodb.net:27017/carex?tls=true&authSource=admin&retryWrites=true&tlsAllowInvalidCertificates=true';

async function testConnection() {
    try {
        console.log('🔌 Connecting directly to MongoDB shards...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000, family: 4 });
        console.log('✅ Connected!');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📦 Collections:', collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    }
}

testConnection();

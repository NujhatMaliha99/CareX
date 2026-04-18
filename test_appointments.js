const mongoose = require('mongoose');

const uri = `mongodb://nujhatcse20230204063_db_user:Scis0tMAnJB0OmWf@ac-x6dqn13-shard-00-00.xjbpgam.mongodb.net:27017,ac-x6dqn13-shard-00-01.xjbpgam.mongodb.net:27017,ac-x6dqn13-shard-00-02.xjbpgam.mongodb.net:27017/carex?tls=true&authSource=admin&retryWrites=true&tlsAllowInvalidCertificates=true`;
const CONNECTION_OPTIONS = {
    serverSelectionTimeoutMS: 20000, 
    family: 4
};

async function checkAppointments() {
    try {
        await mongoose.connect(uri, CONNECTION_OPTIONS);
        console.log('✅ Connected. Fetching appointments...');
        // We have to define the model
        const Appointment = mongoose.model('Appointment', new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            type: String,
            status: String
        }, { collection: 'appointments' }));

        const apps = await Appointment.find();
        console.log(`📦 Found ${apps.length} appointments in Database.`);
        console.log(apps);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}
checkAppointments();

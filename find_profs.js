const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config({ path: './server/.env' });

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const profs = await User.find({ role: { $in: ['doctor', 'counsellor'] } });
        console.log(JSON.stringify(profs, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

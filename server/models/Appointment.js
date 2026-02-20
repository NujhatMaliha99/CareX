const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null  // Assigned by admin
    },
    requestedProfessional: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['Counselling', 'Psychiatrist'],
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    },
    chatEnabled: {
        type: Boolean,
        default: false
    },
    callEnabled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);

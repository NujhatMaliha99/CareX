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
        default: null
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
    approvedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Indexes for common query patterns
appointmentSchema.index({ userId: 1, createdAt: -1 });       // user's appointment history
appointmentSchema.index({ professionalId: 1, status: 1 });   // professional's active sessions
appointmentSchema.index({ status: 1, createdAt: -1 });        // admin view by status

module.exports = mongoose.model('Appointment', appointmentSchema);

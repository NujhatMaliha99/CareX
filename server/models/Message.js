const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: null
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'call-started', 'call-ended'],
        default: 'text'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Indexes
messageSchema.index({ appointmentId: 1, createdAt: 1 }); // fetch chat history in order
messageSchema.index({ receiverId: 1, read: 1 });          // count unread messages

module.exports = mongoose.model('Message', messageSchema);

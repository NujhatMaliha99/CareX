const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    moodTag: {
        type: String,
        enum: ['Anxiety', 'Depression', 'Healing', 'Burnout', 'Self-Love', 'General'],
        default: 'General'
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    readTime: {
        type: String,
        default: '2 min read'
    },
    reactions: {
        helpful: { type: Number, default: 0 },
        hopeful: { type: Number, default: 0 },
        relatable: { type: Number, default: 0 }
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

module.exports = mongoose.model('Story', storySchema);

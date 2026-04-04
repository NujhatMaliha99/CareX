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
    imageUrl: {
        type: String,
        required: false
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
    approvedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Indexes
storySchema.index({ status: 1, approvedAt: -1 }); // public feed of approved stories
storySchema.index({ userId: 1, createdAt: -1 });   // user's own story history
storySchema.index({ moodTag: 1, status: 1 });       // filter by mood tag

module.exports = mongoose.model('Story', storySchema);

const mongoose = require('mongoose');

const mentalActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activityType: {
        type: String,
        enum: [
            'mental-weather',
            'mood-weather',
            'release-thoughts',
            'future-me',
            'gratitude',
            'gratitude-capsule',
            'social-battery',
            'panic-rescue',
            'focus-mode',
            'sleep-reset',
            'body-scan',
            'pmrt',
            'tiny-wins'
        ],
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

// Compound index: fast queries for a user's activities by type and date
mentalActivitySchema.index({ userId: 1, activityType: 1, createdAt: -1 });
// Index for fetching all activity types for a single user (dashboard/history view)
mentalActivitySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MentalActivity', mentalActivitySchema);

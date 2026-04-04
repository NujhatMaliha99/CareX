const mongoose = require('mongoose');

const hygieneProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Daily tracker — one doc per calendar day
    trackerDate: {
        type: String, // "YYYY-MM-DD"
        default: null
    },
    trackerItems: {
        type: [Boolean],
        default: []
    },
    trackerCompleted: {
        type: Boolean,
        default: false
    },

    // Module progress — one doc per module per user
    moduleId: {
        type: String,   // "personal" | "food" | "home" | "public"
        default: null
    },
    lastChapter: {
        type: Number,
        default: 0
    },
    moduleFinished: {
        type: Boolean,
        default: false
    },

    // Quiz result stored when module is completed
    quizScore: {
        type: Number,
        default: null
    },
    quizTotal: {
        type: Number,
        default: null
    },

    // Record type discriminator so we can query cleanly
    recordType: {
        type: String,
        enum: ['tracker', 'module'],
        required: true
    }
}, { timestamps: true });

// Fast look-ups
hygieneProgressSchema.index({ userId: 1, recordType: 1 });
hygieneProgressSchema.index({ userId: 1, recordType: 1, trackerDate: 1 });
hygieneProgressSchema.index({ userId: 1, recordType: 1, moduleId: 1 });

module.exports = mongoose.model('HygieneProgress', hygieneProgressSchema);

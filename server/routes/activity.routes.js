const express = require('express');
const router = express.Router();
const MentalActivity = require('../models/MentalActivity');
const { authenticate } = require('../middleware/auth');

// POST /api/mental-activity — Log a mental health activity
router.post('/', authenticate, async (req, res) => {
    try {
        const { activityType, data } = req.body;

        const activity = new MentalActivity({
            userId: req.user._id,
            activityType,
            data
        });
        await activity.save();

        res.json({ success: true, activity });
    } catch (err) {
        console.error('[Activity] Save error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/mental-activity — All activities for the current user
router.get('/', authenticate, async (req, res) => {
    try {
        const activities = await MentalActivity.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(100);
        res.json({ activities });
    } catch (err) {
        console.error('[Activity] Fetch all error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/mental-activity/:type — Activities filtered by type
router.get('/:type', authenticate, async (req, res) => {
    try {
        const activities = await MentalActivity.find({
            userId: req.user._id,
            activityType: req.params.type
        })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ activities });
    } catch (err) {
        console.error('[Activity] Fetch by type error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { authenticate } = require('../middleware/auth');

// Log a workout
router.post('/log', authenticate, async (req, res) => {
    try {
        const { plan, setsCompleted, durationSeconds, date } = req.body;
        const workout = new Workout({
            userId: req.user._id,
            plan,
            setsCompleted,
            durationSeconds,
            date: date || new Date().toISOString().split('T')[0]
        });
        await workout.save();
        res.json({ success: true, workout });
    } catch (err) {
        console.error('[Workout] POST log error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET workout history
router.get('/history', authenticate, async (req, res) => {
    try {
        const history = await Workout.find({
            userId: req.user._id
        }).sort({ createdAt: -1 }).limit(50);
        
        res.json(history);
    } catch (err) {
        console.error('[Workout] GET history error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

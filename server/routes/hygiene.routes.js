const express = require('express');
const router = express.Router();
const HygieneProgress = require('../models/HygieneProgress');
const { authenticate } = require('../middleware/auth');

// ─────────────────────────────────────────
// DAILY TRACKER
// ─────────────────────────────────────────

// GET /api/hygiene/tracker?date=YYYY-MM-DD
// Returns today's (or any date's) tracker state for the logged-in user
router.get('/tracker', authenticate, async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().slice(0, 10);

        const doc = await HygieneProgress.findOne({
            userId: req.user._id,
            recordType: 'tracker',
            trackerDate: date
        });

        if (!doc) {
            // No record yet — return empty state
            return res.json({
                date,
                trackerItems: [false, false, false, false, false],
                trackerCompleted: false
            });
        }

        res.json({
            date: doc.trackerDate,
            trackerItems: doc.trackerItems,
            trackerCompleted: doc.trackerCompleted
        });
    } catch (err) {
        console.error('[Hygiene] GET tracker error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/hygiene/tracker
// Upsert today's tracker state
// Body: { date, trackerItems: [bool x5], trackerCompleted: bool }
router.post('/tracker', authenticate, async (req, res) => {
    try {
        const { date, trackerItems, trackerCompleted } = req.body;

        if (!date || !Array.isArray(trackerItems)) {
            return res.status(400).json({ error: 'date and trackerItems are required' });
        }

        const doc = await HygieneProgress.findOneAndUpdate(
            { userId: req.user._id, recordType: 'tracker', trackerDate: date },
            {
                $set: {
                    userId: req.user._id,
                    recordType: 'tracker',
                    trackerDate: date,
                    trackerItems,
                    trackerCompleted: !!trackerCompleted
                }
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, doc });
    } catch (err) {
        console.error('[Hygiene] POST tracker error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hygiene/tracker/history
// Returns last 30 days of tracker records (for streak calculation on frontend)
router.get('/tracker/history', authenticate, async (req, res) => {
    try {
        const docs = await HygieneProgress.find({
            userId: req.user._id,
            recordType: 'tracker'
        })
            .sort({ trackerDate: -1 })
            .limit(30)
            .select('trackerDate trackerItems trackerCompleted');

        res.json({ history: docs });
    } catch (err) {
        console.error('[Hygiene] GET tracker/history error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────
// MODULE PROGRESS
// ─────────────────────────────────────────

// GET /api/hygiene/modules
// Returns progress for all modules for the logged-in user
router.get('/modules', authenticate, async (req, res) => {
    try {
        const docs = await HygieneProgress.find({
            userId: req.user._id,
            recordType: 'module'
        }).select('moduleId lastChapter moduleFinished quizScore quizTotal updatedAt');

        res.json({ modules: docs });
    } catch (err) {
        console.error('[Hygiene] GET modules error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/hygiene/modules
// Upsert progress for a single module
// Body: { moduleId, lastChapter, moduleFinished, quizScore, quizTotal }
router.post('/modules', authenticate, async (req, res) => {
    try {
        const { moduleId, lastChapter, moduleFinished, quizScore, quizTotal } = req.body;

        if (!moduleId) {
            return res.status(400).json({ error: 'moduleId is required' });
        }

        const update = {
            userId: req.user._id,
            recordType: 'module',
            moduleId,
            lastChapter: lastChapter ?? 0,
            moduleFinished: !!moduleFinished
        };

        // Only write quiz fields when quiz has actually been taken
        if (quizScore !== undefined && quizScore !== null) {
            update.quizScore = quizScore;
            update.quizTotal = quizTotal;
        }

        const doc = await HygieneProgress.findOneAndUpdate(
            { userId: req.user._id, recordType: 'module', moduleId },
            { $set: update },
            { upsert: true, new: true }
        );

        res.json({ success: true, doc });
    } catch (err) {
        console.error('[Hygiene] POST modules error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hygiene/summary
// Convenience endpoint — returns tracker streak + module overview for a user's profile/dashboard
router.get('/summary', authenticate, async (req, res) => {
    try {
        // Module stats
        const modules = await HygieneProgress.find({
            userId: req.user._id,
            recordType: 'module'
        }).select('moduleId moduleFinished quizScore quizTotal');

        // Tracker streak (count consecutive completed days ending today)
        const trackerDocs = await HygieneProgress.find({
            userId: req.user._id,
            recordType: 'tracker',
            trackerCompleted: true
        })
            .sort({ trackerDate: -1 })
            .limit(60)
            .select('trackerDate');

        const completedDates = new Set(trackerDocs.map(d => d.trackerDate));
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 60; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            if (completedDates.has(key)) {
                streak++;
            } else {
                break;
            }
        }

        res.json({
            streak,
            modulesCompleted: modules.filter(m => m.moduleFinished).length,
            modulesTotal: 4,
            moduleDetails: modules
        });
    } catch (err) {
        console.error('[Hygiene] GET summary error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

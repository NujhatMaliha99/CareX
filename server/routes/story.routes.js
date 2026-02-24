const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { authenticate } = require('../middleware/auth');

// POST /api/stories — Submit a story (requires login, goes into moderation)
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, content, moodTag, isAnonymous } = req.body;

        const words = content.trim().split(/\s+/).length;
        const readTime = `${Math.ceil(words / 200)} min read`;

        const story = new Story({
            userId: req.user._id,
            title,
            content,
            moodTag,
            isAnonymous,
            readTime,
            status: 'pending'
        });
        await story.save();

        res.status(201).json({ message: 'Story submitted for review!', story });
    } catch (err) {
        console.error('[Story] Submit error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/stories — Public: get all approved stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'approved' })
            .sort({ approvedAt: -1 })
            .populate('userId', 'username');
        res.json(stories);
    } catch (err) {
        console.error('[Story] Fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/stories/:id/react — React to a story
router.post('/:id/react', async (req, res) => {
    try {
        const { type } = req.body;
        if (!['helpful', 'hopeful', 'relatable'].includes(type)) {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        const story = await Story.findByIdAndUpdate(
            req.params.id,
            { $inc: { [`reactions.${type}`]: 1 } },
            { new: true }
        );
        res.json(story.reactions);
    } catch (err) {
        console.error('[Story] React error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

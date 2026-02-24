const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Story = require('../models/Story');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/admin/appointments — All appointments with optional status filter
router.get('/appointments', authenticate, requireAdmin, async (req, res) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};
        const appointments = await Appointment.find(filter)
            .populate('userId', 'name email')
            .populate('professionalId', 'name email specialty')
            .sort({ createdAt: -1 });

        res.json({ appointments });
    } catch (err) {
        console.error('[Admin] Fetch appointments error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/professionals
router.get('/professionals', authenticate, requireAdmin, async (req, res) => {
    try {
        const professionals = await User.find({
            role: { $in: ['doctor', 'counsellor'] },
            isAvailable: true
        }).select('name email role specialty');

        res.json({ professionals });
    } catch (err) {
        console.error('[Admin] Fetch professionals error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/admin/appointments/:id — Approve or reject an appointment
router.patch('/appointments/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status, professionalId, chatEnabled, callEnabled } = req.body;
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        appointment.status = status;
        if (status === 'approved') {
            if (professionalId) appointment.professionalId = professionalId;
            appointment.chatEnabled = chatEnabled !== false;
            appointment.callEnabled = callEnabled !== false;
            appointment.approvedAt = new Date();
        }

        await appointment.save();

        // Notify user via socket (io is injected as req.io)
        req.io.emit(`appointment-update-${appointment.userId}`, { appointment });

        res.json({ message: `Appointment ${status}`, appointment });
    } catch (err) {
        console.error('[Admin] Update appointment error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/admin/professionals — Create a professional account
router.post('/professionals', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, role, specialty } = req.body;

        if (!['doctor', 'counsellor'].includes(role)) {
            return res.status(400).json({ error: 'Role must be doctor or counsellor' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const user = new User({ name, email, password, role, specialty });
        await user.save();

        res.status(201).json({
            message: 'Professional account created',
            professional: { id: user._id, name, email, role, specialty }
        });
    } catch (err) {
        console.error('[Admin] Create professional error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/stories — All stories for moderation
router.get('/stories', authenticate, requireAdmin, async (req, res) => {
    try {
        const stories = await Story.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'username email');
        res.json(stories);
    } catch (err) {
        console.error('[Admin] Fetch stories error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/admin/stories/:id/status — Approve or reject a story
router.patch('/stories/:id/status', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updateData = { status };
        if (status === 'approved') updateData.approvedAt = Date.now();

        const story = await Story.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(story);
    } catch (err) {
        console.error('[Admin] Update story status error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

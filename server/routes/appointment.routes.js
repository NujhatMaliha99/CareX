const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// POST /api/appointments — Create appointment request
router.post('/', authenticate, async (req, res) => {
    try {
        const { type, professionalName, date, time, notes } = req.body;

        let professionalId = null;
        if (professionalName) {
            const professional = await User.findOne({
                name: professionalName,
                role: { $in: ['doctor', 'counsellor'] }
            });
            if (professional) professionalId = professional._id;
        }

        const appointment = new Appointment({
            userId: req.user._id,
            professionalId,
            requestedProfessional: professionalName || '',
            type,
            date,
            time,
            notes
        });
        await appointment.save();

        // Notify admins of new appointment
        req.io.emit('new-appointment', { appointment });

        res.status(201).json({ message: 'Appointment request submitted', appointment });
    } catch (err) {
        console.error('[Appointment] Create error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/appointments — Get current user's appointments
router.get('/', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id })
            .populate('professionalId', 'name email specialty')
            .sort({ createdAt: -1 });

        res.json({ appointments });
    } catch (err) {
        console.error('[Appointment] Fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/appointments/:id — Get single appointment (for chat/call access)
router.get('/:id', authenticate, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('professionalId', 'name email specialty');

        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        const isUser = appointment.userId._id.toString() === req.user._id.toString();
        const isProfessional = appointment.professionalId?._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isUser && !isProfessional && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ appointment });
    } catch (err) {
        console.error('[Appointment] Fetch single error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

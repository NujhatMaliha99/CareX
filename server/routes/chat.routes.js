const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const { authenticate } = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary storage for chat images
const chatStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'carex_chat',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, crop: 'limit' }]
    }
});
const upload = multer({ storage: chatStorage });

// GET /api/messages/:appointmentId
router.get('/:appointmentId', authenticate, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment || !appointment.chatEnabled) {
            return res.status(403).json({ error: 'Chat not available for this appointment' });
        }

        const messages = await Message.find({ appointmentId: req.params.appointmentId })
            .populate('senderId', 'name role')
            .sort({ createdAt: 1 });

        res.json({ messages });
    } catch (err) {
        console.error('[Chat] Fetch messages error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/messages — Send a text message
router.post('/', authenticate, async (req, res) => {
    try {
        const { appointmentId, receiverId, text } = req.body;

        const message = new Message({
            appointmentId,
            senderId: req.user._id,
            receiverId,
            text
        });
        await message.save();

        const populated = await Message.findById(message._id).populate('senderId', 'name role');
        req.io.emit(`chat-${appointmentId}`, { message: populated });

        res.status(201).json({ message: populated });
    } catch (err) {
        console.error('[Chat] Send message error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/messages/image — Send an image in chat
router.post('/image', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { appointmentId, receiverId } = req.body;

        const message = new Message({
            appointmentId,
            senderId: req.user._id,
            receiverId,
            imageUrl: req.file.path,  // Cloudinary HTTPS URL
            messageType: 'image'
        });
        await message.save();

        const populated = await Message.findById(message._id).populate('senderId', 'name role');
        req.io.emit(`chat-${appointmentId}`, { message: populated });

        res.status(201).json({ message: populated });
    } catch (err) {
        console.error('[Chat] Image upload error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

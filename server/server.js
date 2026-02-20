const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS resolution using Google DNS to fix SRV lookup issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Models
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Message = require('./models/Message');
const Story = require('./models/Story');
const MentalActivity = require('./models/MentalActivity');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
// Serve frontend from client directory
app.use(express.static(path.join(__dirname, '../client_legacy')));
// Serve uploads from local server directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// --- Constants & Config ---
const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'carex-mental-health-secret-key-2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carex';

// --- MongoDB Connection ---
const connectionOptions = {
    serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
    socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
};

mongoose.connect(MONGODB_URI, connectionOptions)
    .then(() => console.log('✅ MongoDB connected successfully to Atlas'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('💡 TIP: Check your MongoDB Atlas IP Whitelist and network connection.');
    });

// --- Multer for Image Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Create uploads directory if not exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// --- Auth Middleware ---
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};



const CRISIS_KEYWORDS = ['kill myself', 'suicide', 'self harm', 'end my life', 'better off dead', 'hurt myself'];

const detectCrisis = (text) => {
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

// ============================
// AUTH ENDPOINTS
// ============================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Only allow admin to create admin/doctor/counsellor accounts
        const allowedRole = ['user'].includes(role) ? role : 'user';

        const user = new User({ name, email, password, role: allowedRole });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({
        user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }
    });
});

// ============================
// APPOINTMENT ENDPOINTS
// ============================

// Create appointment request
app.post('/api/appointments', authenticate, async (req, res) => {
    try {
        const { type, professionalName, date, time, notes } = req.body;

        // Find professional user by name
        let professionalId = null;
        if (professionalName) {
            const professional = await User.findOne({ name: professionalName, role: { $in: ['doctor', 'counsellor'] } });
            if (professional) {
                professionalId = professional._id;
            }
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

        res.status(201).json({ message: 'Appointment request submitted', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's appointments
app.get('/api/appointments', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id })
            .populate('professionalId', 'name email specialty')
            .sort({ createdAt: -1 });

        res.json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get single appointment (for chat/call)
app.get('/api/appointments/:id', authenticate, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('professionalId', 'name email specialty');

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Only allow access to involved parties
        const isUser = appointment.userId._id.toString() === req.user._id.toString();
        const isProfessional = appointment.professionalId?._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isUser && !isProfessional && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ============================
// ADMIN ENDPOINTS
// ============================

// Get all pending appointments (Admin)
app.get('/api/admin/appointments', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const appointments = await Appointment.find(filter)
            .populate('userId', 'name email')
            .populate('professionalId', 'name email specialty')
            .sort({ createdAt: -1 });

        res.json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get all professionals (Admin)
app.get('/api/admin/professionals', authenticate, requireAdmin, async (req, res) => {
    try {
        const professionals = await User.find({
            role: { $in: ['doctor', 'counsellor'] },
            isAvailable: true
        }).select('name email role specialty');

        res.json({ professionals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Approve/Reject appointment (Admin)
app.patch('/api/admin/appointments/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status, professionalId, chatEnabled, callEnabled } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = status;
        if (status === 'approved') {
            // If professionalId is provided in body, use it (manual override)
            // Otherwise, keep the one assigned at creation (automated)
            if (professionalId) {
                appointment.professionalId = professionalId;
            }
            appointment.chatEnabled = chatEnabled !== false;
            appointment.callEnabled = callEnabled !== false;
            appointment.approvedAt = new Date();
        }

        await appointment.save();

        // Emit socket event to notify user
        io.emit(`appointment-update-${appointment.userId}`, { appointment });

        res.json({ message: `Appointment ${status}`, appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Create professional account (Admin)
app.post('/api/admin/professionals', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, role, specialty } = req.body;

        if (!['doctor', 'counsellor'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password, role, specialty });
        await user.save();

        res.status(201).json({
            message: 'Professional account created',
            professional: { id: user._id, name, email, role, specialty }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ============================
// CHAT & MESSAGES
// ============================

// Get messages for an appointment
app.get('/api/messages/:appointmentId', authenticate, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment || !appointment.chatEnabled) {
            return res.status(403).json({ error: 'Chat not available for this appointment' });
        }

        const messages = await Message.find({ appointmentId: req.params.appointmentId })
            .populate('senderId', 'name role')
            .sort({ createdAt: 1 });

        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Send message
app.post('/api/messages', authenticate, async (req, res) => {
    try {
        const { appointmentId, receiverId, text } = req.body;

        const message = new Message({
            appointmentId,
            senderId: req.user._id,
            receiverId,
            text
        });
        await message.save();

        // Emit to both parties
        io.emit(`chat-${appointmentId}`, {
            message: await Message.findById(message._id).populate('senderId', 'name role')
        });

        res.status(201).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Upload image in chat
app.post('/api/messages/image', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { appointmentId, receiverId } = req.body;

        const message = new Message({
            appointmentId,
            senderId: req.user._id,
            receiverId,
            imageUrl: `/uploads/${req.file.filename}`,
            messageType: 'image'
        });
        await message.save();

        io.emit(`chat-${appointmentId}`, {
            message: await Message.findById(message._id).populate('senderId', 'name role')
        });

        res.status(201).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ============================
// AI ENDPOINTS (Existing)
// ============================



app.post('/api/ai/chat', async (req, res) => {
    const { message, chatHistory } = req.body;
    if (detectCrisis(message)) {
        return res.json({
            crisis: true,
            response: "I am a wellness tool, not a crisis service. If you are feeling unsafe, please contact emergency support immediately (988 in US/Canada). I care about your safety."
        });
    }

    try {
        const historyText = chatHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
        const prompt = `${SYSTEM_PROMPT}\n\nChat History:\n${historyText}\nUser: ${message}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/ai/affirmation', async (req, res) => {
    try {
        const prompt = `${SYSTEM_PROMPT}\n\nGenerate a short, calming positive affirmation for today.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ affirmation: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Affirmation failed" });
    }
});



// --- Stories & Hope Endpoints ---

// Submit a story
app.post('/api/stories', authenticate, async (req, res) => {
    try {
        const { title, content, moodTag, isAnonymous } = req.body;

        // Basic read time estimate
        const words = content.split(' ').length;
        const readTime = `${Math.ceil(words / 200)} min read`;

        const story = new Story({
            userId: req.user._id,
            title,
            content,
            moodTag,
            isAnonymous,
            readTime,
            status: 'pending' // Moderation required
        });

        await story.save();
        res.status(201).json({ message: 'Story submitted for review!', story });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get approved stories
app.get('/api/stories', async (req, res) => {
    try {
        const stories = await Story.find({ status: 'approved' })
            .sort({ approvedAt: -1 })
            .populate('userId', 'username');
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// React to a story
app.post('/api/stories/:id/react', async (req, res) => {
    try {
        const { type } = req.body; // helpful, hopeful, relatable
        if (!['helpful', 'hopeful', 'relatable'].includes(type)) {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        const update = {};
        update[`reactions.${type}`] = 1;

        const story = await Story.findByIdAndUpdate(
            req.params.id,
            { $inc: update },
            { new: true }
        );

        res.json(story.reactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Admin Story Moderation ---

// List all stories for moderation
app.get('/api/admin/stories', authenticate, requireAdmin, async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 }).populate('userId', 'username email');
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update story status (Approve/Reject)
app.patch('/api/admin/stories/:id/status', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updateData = { status };
        if (status === 'approved') {
            updateData.approvedAt = Date.now();
        }

        const story = await Story.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================
// SOCKET.IO (Real-time)
// ============================

io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join appointment room for chat
    socket.on('join-appointment', (appointmentId) => {
        socket.join(`appointment-${appointmentId}`);
        console.log(`User joined appointment room: ${appointmentId}`);
    });

    // WebRTC signaling for video calls
    socket.on('call-offer', (data) => {
        socket.to(`appointment-${data.appointmentId}`).emit('call-offer', data);
    });

    socket.on('call-answer', (data) => {
        socket.to(`appointment-${data.appointmentId}`).emit('call-answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(`appointment-${data.appointmentId}`).emit('ice-candidate', data);
    });

    socket.on('call-end', (data) => {
        socket.to(`appointment-${data.appointmentId}`).emit('call-ended');
    });

    socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
    });
});

// ===== MENTAL ACTIVITY TRACKING =====
// POST /api/mental-activity - Save mental health activity
app.post('/api/mental-activity', authenticate, async (req, res) => {
    try {
        const { activityType, data } = req.body;

        const activity = new MentalActivity({
            userId: req.user._id,
            activityType,
            data
        });

        await activity.save();
        res.json({ success: true, activity });
    } catch (error) {
        console.error('Mental activity save error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/mental-activity/:type - Get activities by type
app.get('/api/mental-activity/:type', authenticate, async (req, res) => {
    try {
        const activities = await MentalActivity.find({
            userId: req.user.id,
            activityType: req.params.type
        }).sort({ createdAt: -1 }).limit(50);

        res.json({ activities });
    } catch (error) {
        console.error('Mental activity fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/mental-activity - Get all activities for user
app.get('/api/mental-activity', authenticate, async (req, res) => {
    try {
        const activities = await MentalActivity.find({
            userId: req.user.id
        }).sort({ createdAt: -1 }).limit(100);

        res.json({ activities });
    } catch (error) {
        console.error('Mental activity fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================
// START SERVER
// ============================

server.listen(PORT, () => console.log(`🚀 CareX Backend running on port ${PORT}`));

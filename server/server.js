require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

// Route modules
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes = require('./routes/admin.routes');
const chatRoutes = require('./routes/chat.routes');
const storyRoutes = require('./routes/story.routes');
const activityRoutes = require('./routes/activity.routes');

// --- App Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(require('cors')());
app.use(express.json());

// Root → Admin panel (must be before static middleware)
app.get('/', (req, res) => {
    res.redirect('/admin.html');
});

// Serve legacy pages (index disabled — root is admin)
app.use(express.static(path.join(__dirname, '../client_legacy'), { index: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads dir if missing
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// --- Inject socket.io into every request ---
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/mental-activity', activityRoutes);

// --- Socket.IO (Real-time Chat & Video Signaling) ---
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join-appointment', (appointmentId) => {
        socket.join(`appointment-${appointmentId}`);
    });

    // WebRTC signaling
    socket.on('call-offer', (data) => socket.to(`appointment-${data.appointmentId}`).emit('call-offer', data));
    socket.on('call-answer', (data) => socket.to(`appointment-${data.appointmentId}`).emit('call-answer', data));
    socket.on('ice-candidate', (data) => socket.to(`appointment-${data.appointmentId}`).emit('ice-candidate', data));
    socket.on('call-end', (data) => socket.to(`appointment-${data.appointmentId}`).emit('call-ended'));

    socket.on('disconnect', () => console.log('🔌 User disconnected:', socket.id));
});

// --- Start ---
const PORT = process.env.PORT || 5050;

connectDB().then(() => {
    server.listen(PORT, () => console.log(`🚀 CareX Backend running on port ${PORT}`));
});

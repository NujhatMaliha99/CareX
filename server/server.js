require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

// Route modules
const authRoutes        = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes       = require('./routes/admin.routes');
const chatRoutes        = require('./routes/chat.routes');
const storyRoutes       = require('./routes/story.routes');
const activityRoutes    = require('./routes/activity.routes');
const healthRoutes      = require('./routes/health.routes');
const hygieneRoutes     = require('./routes/hygiene.routes');

// ---------------- APP SETUP ----------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(express.json());

// ---------------- ROOT ----------------
app.get('/', (req, res) => {
    res.redirect('/admin.html');
});

// ---------------- STATIC FILES ----------------
app.use(express.static(path.join(__dirname, '../client_legacy'), { index: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if it doesn't exist
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// ---------------- SOCKET.IO ACCESS ----------------
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ---------------- API ROUTES ----------------
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/mental-activity', activityRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/hygiene', hygieneRoutes);
app.use('/api/ai', require('./routes/ai.routes'));

// ---------------- HEALTH TRACKING APIs ----------------

// BMI
app.post('/api/bmi', (req, res) => {
    console.log('BMI Data:', req.body);
    res.json({ success: true });
});

// Symptoms
app.post('/api/symptoms', (req, res) => {
    console.log('Symptoms:', req.body);
    res.json({ success: true });
});

// Water intake
app.post('/api/water', (req, res) => {
    console.log('Water Intake:', req.body);
    res.json({ success: true });
});

// Daily habits
app.post('/api/habits', (req, res) => {
    console.log('Habits:', req.body);
    res.json({ success: true });
});

// ---------------- SOCKET.IO (REAL-TIME CHAT + VIDEO CALL) ----------------
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join appointment room
    socket.on('join-appointment', (appointmentId) => {
        socket.join(`appointment-${appointmentId}`);
    });

    // WebRTC signaling
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

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 CareX Backend running on port ${PORT}`);
    });
});
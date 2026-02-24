const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'carex-mental-health-secret-key-2026';

const CRISIS_KEYWORDS = [
    'kill myself', 'suicide', 'self harm',
    'end my life', 'better off dead', 'hurt myself'
];

const detectCrisis = (text) => {
    const lower = text.toLowerCase();
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
};

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { authenticate, requireAdmin, detectCrisis };

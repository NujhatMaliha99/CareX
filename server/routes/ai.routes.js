const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/chat', async (req, res) => {
    try {
        const { message, chatHistory } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API Key missing in backend configuration.' });
        }

        // Map the chat history to Gemini's format
        // Frontend uses 'assistant', Gemini uses 'model'
        const contents = chatHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Append the new message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Add a system prompt context to the first user message if needed, or just let Gemini be nice.
        // For simplicity and to stick to the mental health context, we add a gentle instruction.
        if (contents.length > 0 && contents[0].role === 'user') {
            contents[0].parts[0].text = "You are the CareX wellness guide, an empathetic and supportive AI assistant for a mental health application. Keep responses helpful, supportive, and concise. " + contents[0].parts[0].text;
        } else {
             contents.unshift({
                role: 'user',
                parts: [{ text: "You are the CareX wellness guide, an empathetic and supportive AI assistant for a mental health application. Keep responses helpful, supportive, and concise." }]
            });
        }

        // Use native Node.js fetch (Node 18+)
        const response = await globalThis.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini Error:", data.error);
            return res.status(500).json({ error: 'Failed to generate response' });
        }

        const botResponse = data.candidates[0].content.parts[0].text;

        // Simple crisis detection
        const crisisWords = ['suicide', 'kill myself', 'want to die', 'end my life', 'harm myself'];
        const isCrisis = crisisWords.some(word => message.toLowerCase().includes(word));

        res.json({
            response: botResponse,
            crisis: isCrisis
        });

    } catch (err) {
        console.error('[AI Chat] Error:', err);
        res.status(500).json({ error: 'Internal server error while speaking to Gemini.' });
    }
});

router.post('/reframe', async (req, res) => {
    try {
        const { thought } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API Setup missing.' });
        }

        const prompt = `You are a cognitive behavioral therapy (CBT) assistant. 
A user has submitted the following negative or anxious thought: "${thought}".
Please provide a gentle, concise, and constructive "reframe" of this thought to help them see it from a healthier perspective. Keep it under 2 sentences.`;

        const contents = [{
            role: 'user',
            parts: [{ text: prompt }]
        }];

        const response = await globalThis.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: 'Failed to reframe' });
        }

        const reframeText = data.candidates[0].content.parts[0].text;
        res.json({ reframe: reframeText });

    } catch (err) {
        console.error('[AI Reframe] Error:', err);
        res.status(500).json({ error: 'Internal error reframing thought.' });
    }
});

module.exports = router;

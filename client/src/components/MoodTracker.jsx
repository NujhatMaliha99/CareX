import { useState, useEffect } from 'react';

const moods = [
    { id: 'sunny', emoji: '☀️', label: 'Sunny' },
    { id: 'cloudy', emoji: '☁️', label: 'Cloudy' },
    { id: 'rainy', emoji: '🌧️', label: 'Rainy' },
    { id: 'stormy', emoji: '⚡', label: 'Stormy' },
    { id: 'snowy', emoji: '❄️', label: 'Snowy' }
];

export default function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        setHistory(saved);
    }, []);

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood.id);

        const newEntry = { day: new Date().getDay(), emoji: mood.emoji, timestamp: Date.now() };
        const newHistory = [...history, newEntry];
        setHistory(newHistory);
        localStorage.setItem('moodHistory', JSON.stringify(newHistory));
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="worksheet-card feature-section fade-in">
            <h2>🌦️ Mental Weather</h2>
            <p className="section-desc">How is your internal sky looking today?</p>

            <div className="weather-options">
                {moods.map(m => (
                    <button
                        key={m.id}
                        className={`weather-btn ${selectedMood === m.id ? 'active' : ''}`}
                        onClick={() => handleMoodSelect(m)}
                        title={m.label}
                    >
                        {m.emoji}
                    </button>
                ))}
            </div>

            <div className="mood-timeline" id="mood-timeline">
                {history.slice(-7).map((entry, i) => (
                    <div key={i} className="timeline-day">
                        <span style={{ fontSize: '0.7rem' }}>{days[entry.day]}</span>
                        <span>{entry.emoji}</span>
                    </div>
                ))}
                {history.length === 0 && <div className="text-center" style={{ width: '100%' }}>No logs yet. Start today!</div>}
            </div>
        </div>
    );
}

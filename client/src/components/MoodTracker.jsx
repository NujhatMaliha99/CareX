import { useState, useEffect } from 'react';

const moods = [
    { id: 'sunny', emoji: '☀️', label: 'Sunny' },
    { id: 'cloudy', emoji: '☁️', label: 'Cloudy' },
    { id: 'rainy', emoji: '🌧️', label: 'Rainy' },
    { id: 'stormy', emoji: '⚡', label: 'Stormy' },
    { id: 'snowy', emoji: '❄️', label: 'Snowy' }
];

export default function MoodTracker({ onComplete }) {
    const [selectedMood, setSelectedMood] = useState(null);
    const [energyLevel, setEnergyLevel] = useState(5);
    const [history, setHistory] = useState([]);

    const energyLabels = ['Exhausted', 'Drained', 'Low', 'Below Average', 'Moderate', 'Okay', 'Good', 'Energized', 'Great', 'Peak'];

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        setHistory(saved);
    }, []);

    const handleMoodSelect = (moodId) => {
        setSelectedMood(moodId);
    };

    const logWeather = () => {
        if (!selectedMood) {
            alert('Please select a mood first!');
            return;
        }
        const mood = moods.find(m => m.id === selectedMood);
        const newEntry = { 
            day: new Date().getDay(), 
            emoji: mood.emoji, 
            energy: energyLevel,
            energyLabel: energyLabels[energyLevel - 1],
            timestamp: Date.now() 
        };
        const newHistory = [...history, newEntry];
        setHistory(newHistory);
        localStorage.setItem('moodHistory', JSON.stringify(newHistory));
        if (onComplete) onComplete();
        alert('Mental weather logged! 🌦️');
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="worksheet-card feature-section fade-in">
            <h2>🌦️ Mental Weather</h2>
            <p className="section-desc">How is your internal sky looking today?</p>

            <div className="weather-grid">
                {moods.map(m => (
                    <button
                        key={m.id}
                        className={`weather-btn ${selectedMood === m.id ? 'active' : ''}`}
                        onClick={() => handleMoodSelect(m.id)}
                        title={m.label}
                    >
                        <span className="mood-emoji">{m.emoji}</span>
                        <span style={{ fontSize: '0.6rem', marginTop: '5px', fontWeight: 700 }}>{m.label}</span>
                    </button>
                ))}
            </div>

            <div className="input-group" style={{ marginTop: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Energy Level</label>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                />
                <p className="text-center" style={{ fontWeight: 600, color: 'var(--accent-purple)', marginTop: '10px' }}>
                    {energyLabels[energyLevel - 1]}
                </p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={logWeather}>
                Log Weather
            </button>

            <div className="mood-timeline" id="mood-timeline" style={{ marginTop: '30px' }}>
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

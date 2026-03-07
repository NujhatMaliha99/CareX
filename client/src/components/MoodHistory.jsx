import { useEffect, useState } from 'react';

export default function MoodHistory() {
    const [history, setHistory] = useState([]);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        // Only show last 7 days
        setHistory(storedHistory.slice(-7));

        // Listen for updates
        const handleStorageChange = () => {
            const updated = JSON.parse(localStorage.getItem('moodHistory') || '[]');
            setHistory(updated.slice(-7));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div id="mood-history-card" className="worksheet-card fade-in" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--accent-purple)' }}>Your Week So Far</h3>
            <div className="mood-timeline" id="mood-timeline" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                {history.length > 0 ? history.map((entry, i) => (
                    <div key={i} className="timeline-day" style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', display: 'block', color: '#888' }}>{days[entry.day]}</span>
                        <span style={{ fontSize: '1.5rem' }}>{entry.emoji}</span>
                    </div>
                )) : (
                    <div className="text-center" style={{ width: '100%', color: '#888', fontStyle: 'italic' }}>
                        No logs yet. Start checking in today!
                    </div>
                )}
                {/* Fill empty days if needed (optional, legacy just showed what was there) */}
            </div>
        </div>
    );
}

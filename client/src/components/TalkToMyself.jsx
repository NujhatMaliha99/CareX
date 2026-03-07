import { useState, useEffect } from 'react';

export default function TalkToMyself({ onComplete }) {
    const [entries, setEntries] = useState([]);
    const [note, setNote] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        setEntries(saved);
    }, []);

    const saveEntry = () => {
        if (!note.trim()) return;
        const newEntry = {
            id: Date.now(),
            text: note,
            date: new Date().toLocaleDateString()
        };
        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem('journalEntries', JSON.stringify(updated));
        setNote('');
        if (onComplete) onComplete();
        alert('Entry saved to your private journal. 📝');
    };

    return (
        <div id="talk-myself" className="worksheet-card feature-section fade-in">
            <h2>💬 Talk to Myself</h2>
            <p className="section-desc">A safe space for your raw thoughts. Only you can see this.</p>

            <div className="input-group">
                <textarea
                    placeholder="What's on your mind? No judgments here..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows="5"
                ></textarea>
            </div>

            <div className="text-center">
                <button className="btn btn-primary" onClick={saveEntry}>Save to Journal</button>
            </div>

            <div className="journal-history" style={{ marginTop: '30px' }}>
                {entries.map(entry => (
                    <div key={entry.id} className="suggestion-card" style={{ marginBottom: '15px', padding: '15px' }}>
                        <small style={{ color: '#888' }}>{entry.date}</small>
                        <p style={{ margin: '5px 0' }}>{entry.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';

export default function GratitudeJournal() {
    const [gratitudeEntries, setGratitudeEntries] = useState([]);
    const [winsEntries, setWinsEntries] = useState([]);
    const [newGratitude, setNewGratitude] = useState('');
    const [newWin, setNewWin] = useState('');

    useEffect(() => {
        setGratitudeEntries(JSON.parse(localStorage.getItem('carexGratitude') || '[]'));
        setWinsEntries(JSON.parse(localStorage.getItem('carexWins') || '[]'));
    }, []);

    const addGratitude = () => {
        if (!newGratitude.trim()) return;
        const updated = [newGratitude, ...gratitudeEntries].slice(0, 10);
        setGratitudeEntries(updated);
        localStorage.setItem('carexGratitude', JSON.stringify(updated));
        setNewGratitude('');
        alert('Gratitude noted. 🙏');
    };

    const addWin = () => {
        if (!newWin.trim()) return;
        const updated = [newWin, ...winsEntries].slice(0, 10);
        setWinsEntries(updated);
        localStorage.setItem('carexWins', JSON.stringify(updated));
        setNewWin('');
        alert('Win celebrated! ✅');
    };

    return (
        <div id="reflection-journal" className="fade-in">
            <div id="gratitude-capsule" className="worksheet-card feature-section" style={{ marginBottom: '20px' }}>
                <h2>🙏 Gratitude Capsule</h2>
                <p className="section-desc">What is one thing you're thankful for right now?</p>
                <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="I am grateful for..."
                        value={newGratitude}
                        onChange={(e) => setNewGratitude(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addGratitude}>Save</button>
                </div>
                <div className="tags-container" style={{ marginTop: '15px' }}>
                    {gratitudeEntries.map((g, i) => <span key={i} className="tag-pill">✨ {g}</span>)}
                </div>
            </div>

            <div id="tiny-wins" className="worksheet-card feature-section">
                <h2>✅ Tiny Wins</h2>
                <p className="section-desc">Celebrate the small victories. Every step counts.</p>
                <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Today I managed to..."
                        value={newWin}
                        onChange={(e) => setNewWin(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addWin}>Log Win</button>
                </div>
                <div className="tags-container" style={{ marginTop: '15px' }}>
                    {winsEntries.map((w, i) => <span key={i} className="tag-pill" style={{ backgroundColor: 'var(--bg-card)' }}>🏆 {w}</span>)}
                </div>
            </div>
        </div>
    );
}

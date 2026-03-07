import { useState, useEffect } from 'react';

export default function FutureMe({ onComplete }) {
    const [letters, setLetters] = useState([]);
    const [content, setContent] = useState('');
    const [lockDate, setLockDate] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('futureLetters') || '[]');
        setLetters(saved);
    }, []);

    const saveLetter = () => {
        if (!content.trim() || !lockDate) return;
        const newLetter = {
            id: Date.now(),
            content,
            lockDate,
            savedDate: new Date().toLocaleDateString(),
            isLocked: new Date(lockDate) > new Date()
        };
        const updated = [newLetter, ...letters];
        setLetters(updated);
        localStorage.setItem('futureLetters', JSON.stringify(updated));
        setContent('');
        setLockDate('');
        if (onComplete) onComplete();
        alert('Letter sealed and sent to the future! ✉️');
    };

    return (
        <div id="future-letter" className="worksheet-card feature-section fade-in">
            <h2>✉️ Future Me</h2>
            <p className="section-desc">Write a letter to your future self. We'll keep it safe until your chosen date.</p>

            <div className="input-group">
                <textarea
                    placeholder="Dear Future Me..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="6"
                ></textarea>
            </div>

            <div className="input-group">
                <label>Unlock Date</label>
                <input
                    type="date"
                    value={lockDate}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={(e) => setLockDate(e.target.value)}
                />
            </div>

            <div className="text-center">
                <button className="btn btn-primary" onClick={saveLetter}>Seal Letter</button>
            </div>

            <div className="letters-grid" style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
                {letters.map(letter => (
                    <div key={letter.id} className="suggestion-card" style={{ opacity: letter.isLocked ? 0.7 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{letter.isLocked ? '🔒 Locked' : '📬 Unlocked'}</span>
                            <small>{letter.lockDate}</small>
                        </div>
                        <p style={{ display: letter.isLocked ? 'none' : 'block', marginTop: '10px' }}>{letter.content}</p>
                        {letter.isLocked && <p style={{ color: '#888', fontStyle: 'italic' }}>Visible on {letter.lockDate}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

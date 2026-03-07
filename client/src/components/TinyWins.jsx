import { useState, useEffect } from 'react';
import { LucideCheckCircle, LucidePlus } from 'lucide-react';

export default function TinyWins({ onComplete }) {
    const [wins, setWins] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const savedWins = JSON.parse(localStorage.getItem('tinyWins') || '[]');
        setWins(savedWins);
    }, []);

    const addWin = () => {
        if (!input.trim()) return;
        const newWins = [{ text: input, id: Date.now() }, ...wins];
        setWins(newWins);
        localStorage.setItem('tinyWins', JSON.stringify(newWins));
        setInput('');
        if (onComplete) onComplete();
    };

    return (
        <div id="tiny-wins" className="worksheet-card feature-section fade-in">
            <h2>✅ Tiny Wins</h2>
            <p className="section-desc">Celebrate small achievements. Every step counts!</p>
            <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Small achievement today..." 
                    onKeyPress={(e) => e.key === 'Enter' && addWin()}
                />
                <button className="btn btn-primary" onClick={addWin}>
                    <LucidePlus size={18} />
                </button>
            </div>
            <div className="win-items" style={{ marginTop: '20px' }}>
                {wins.map(win => (
                    <div key={win.id} className="win-item" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px', 
                        background: 'white', 
                        borderRadius: '10px', 
                        marginBottom: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                        <LucideCheckCircle size={18} color="#4caf50" />
                        <span>{win.text}</span>
                    </div>
                ))}
                {wins.length === 0 && <p className="text-center" style={{ opacity: 0.5 }}>No wins logged today. You can do it!</p>}
            </div>
        </div>
    );
}

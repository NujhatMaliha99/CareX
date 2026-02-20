import { useState, useEffect, useRef } from 'react';

export default function FocusTimer() {
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef(null);

    const toggleTimer = () => {
        if (isActive) {
            clearInterval(intervalRef.current);
            setIsActive(false);
        } else {
            setIsActive(true);
            intervalRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 0) {
                        clearInterval(intervalRef.current);
                        setIsActive(false);
                        setSessions(s => s + 1);
                        alert('Focus session complete! Take a break. ☕');
                        return 25 * 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
        setSeconds(25 * 60);
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div id="focus-mode" className="worksheet-card feature-section fade-in">
            <h2>🎯 Focus Mode</h2>
            <p className="section-desc">25 minutes of dedicated focus. No distractions, just flow.</p>

            <div className="timer-display text-center" style={{ margin: '30px 0' }}>
                <h1 style={{ fontSize: '4rem', color: 'var(--primary-color)' }}>{formatTime(seconds)}</h1>
                <p style={{ color: '#888' }}>Sessions completed: {sessions}</p>
            </div>

            <div className="text-center" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={toggleTimer}>
                    {isActive ? 'Pause' : 'Start Focus'}
                </button>
                <button className="btn btn-outline" onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
}

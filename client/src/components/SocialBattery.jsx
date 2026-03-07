import { useState } from 'react';

const batteryTips = [
    { threshold: 25, label: "Empty", tip: "⚠️ Low energy! Time to recharge. Cancel optional plans, find a quiet space, or take a nap.", color: "linear-gradient(90deg, #ff6b6b, #ee5a5a)" },
    { threshold: 50, label: "Low", tip: "You could use some quiet time. Limit deep conversations and save energy for essentials.", color: "linear-gradient(90deg, #ffd93d, #ff9f1c)" },
    { threshold: 75, label: "Moderate", tip: "Good energy level! You can handle social activities but remember to pace yourself.", color: "linear-gradient(90deg, #6bcb77, #3bb143)" },
    { threshold: 100, label: "Full", tip: "💪 Fully charged! Great time for social activities, networking, or helping others.", color: "linear-gradient(90deg, #4d96ff, #3b82f6)" }
];

export default function SocialBattery({ onComplete }) {
    const [level, setLevel] = useState(50);

    const logEnergy = () => {
        alert('Social energy level logged! 🔋');
        if (onComplete) onComplete();
    };

    const getStatus = (val) => {
        return batteryTips.find(tip => val <= tip.threshold) || batteryTips[3];
    };

    const status = getStatus(level);

    return (
        <div id="social-battery" className="worksheet-card feature-section fade-in">
            <h2>🫂 Social Battery</h2>
            <p className="section-desc">Honoring your energy levels helps prevent burnout.</p>

            <div className="battery-container" style={{ 
                height: '40px', 
                background: '#eee', 
                borderRadius: '10px', 
                position: 'relative',
                overflow: 'hidden',
                marginTop: '20px'
            }}>
                <div
                    className="battery-level"
                    style={{
                        height: '100%',
                        width: `${level}%`,
                        background: status.color,
                        transition: 'width 0.5s ease, background 0.5s ease'
                    }}
                ></div>
                <span style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 700,
                    color: level > 80 ? 'white' : '#333'
                }}>{level}%</span>
            </div>

            <div className="input-group" style={{ marginTop: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>How's your social energy right now?</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                />
            </div>

            <div id="battery-tips" style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: 'rgba(255,255,255,0.5)', 
                borderRadius: '12px',
                borderLeft: `5px solid ${level <= 25 ? '#ff6b6b' : (level <= 50 ? '#ffd93d' : (level <= 75 ? '#6bcb77' : '#4d96ff'))}`
            }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{status.label}</h4>
                <p id="battery-tip-text" style={{ fontSize: '0.9rem', margin: 0, color: '#444' }}>{status.tip}</p>
            </div>

            <div className="text-center" style={{ marginTop: '20px' }}>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={logEnergy}>
                    Log Energy Level
                </button>
            </div>
        </div>
    );
}

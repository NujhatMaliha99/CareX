import { useState } from 'react';

const batteryTips = [
    { max: 20, label: "Empty - Time for total isolation $ rest.", color: "#ff5252" },
    { max: 40, label: "Low - Limit interaction, recharge soon.", color: "#ffab40" },
    { max: 60, label: "Moderate - Balanced energy, pick your company.", color: "#ffd740" },
    { max: 80, label: "High - Good for small gatherings.", color: "#b2ff59" },
    { max: 100, label: "Full - Ready for the world!", color: "#64ffda" }
];

export default function SocialBattery() {
    const [level, setLevel] = useState(50);

    const getStatus = (val) => {
        return batteryTips.find(tip => val <= tip.max) || batteryTips[4];
    };

    const status = getStatus(level);

    return (
        <div id="social-battery" className="worksheet-card feature-section fade-in">
            <h2>🫂 Social Battery</h2>
            <p className="section-desc">Honoring your energy levels helps prevent burnout.</p>

            <div className="battery-container">
                <div className="battery-head"></div>
                <div className="battery-body">
                    <div
                        className="battery-fill"
                        style={{
                            width: `${level}%`,
                            backgroundColor: status.color
                        }}
                    ></div>
                </div>
            </div>

            <div className="text-center" style={{ marginTop: '20px' }}>
                <h3 style={{ color: status.color }}>{level}% - {status.label.split(' - ')[0]}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{status.label.split(' - ')[1]}</p>
            </div>

            <div className="input-group" style={{ marginTop: '30px' }}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                />
            </div>

            <div className="text-center">
                <button className="btn btn-outline btn-sm" onClick={() => alert('Energy level logged 🔋')}>Log Social Energy</button>
            </div>
        </div>
    );
}

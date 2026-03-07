import { useState } from 'react';

const sleepTips = [
    { id: 1, text: "☕ No caffeine 6 hours before bed.", icon: "🚫" },
    { id: 2, text: "📱 Screen-free 30 mins before sleep.", icon: "📴" },
    { id: 3, text: "🌡️ Keep your room cool (approx 18°C).", icon: "❄️" },
    { id: 4, text: "🕯️ Low warm lighting in the evening.", icon: "🏮" }
];

export default function SleepReset({ onComplete }) {
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div id="sleep-reset" className="worksheet-card feature-section fade-in">
            <h2>🌙 Sleep Reset</h2>
            <p className="section-desc">A gentle wind-down for a restorative night.</p>

            <div className="sleep-tips-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '15px',
                marginTop: '20px'
            }}>
                {sleepTips.map(tip => (
                    <div key={tip.id} className="sound-card" style={{ padding: '15px', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '5px' }}>{tip.icon}</span>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>{tip.text.substring(2)}</p>
                    </div>
                ))}
            </div>

            <div className="text-center" style={{ marginTop: '25px' }}>
                <button className="btn btn-primary" onClick={() => setShowGuide(true)}>
                    Start Wind-Down Guide
                </button>
            </div>

            {showGuide && (
                <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>🌙 Sleep Sanctuary Guide</h3>
                            <span className="close-modal" onClick={() => setShowGuide(false)}>&times;</span>
                        </div>
                        <div className="modal-inner-padding">
                            <p>1. 🧘 **Deep Stretching**: Spend 2 minutes gently stretching your neck and back.</p>
                            <p>2. 🌬️ **Box Breathing**: 4 counts in, 4 hold, 4 out, 4 hold.</p>
                            <p>3. 🛀 **Warm Prep**: A warm shower or tea signals your body it's time to rest.</p>
                            <p>4. 📵 **Digital Boundary**: Turn off all notifications now.</p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => {
                                setShowGuide(false);
                                if (onComplete) onComplete();
                            }}>
                                Ready for Sleep
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

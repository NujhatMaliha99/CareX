import { useState } from 'react';

const resets = [
    { id: 'count', title: '5-4-3-2-1 Grounding', icon: '🖐️', desc: '5 things see, 4 feel, 3 hear, 2 smell, 1 taste.' },
    { id: 'sip', title: 'Mindful Hydration', icon: '💧', desc: 'Take a slow sip of water. Feel it hydrate you.' },
    { id: 'stretch', title: 'Gentle Stretch', icon: '🧘', desc: 'Roll your shoulders, tilt your neck slowly.' },
    { id: 'nature', title: 'Nature Break', icon: '🌿', desc: 'Look outside for 2 mins. Notice colors and life.' }
];

export default function QuickResets() {
    const [activeReset, setActiveReset] = useState(null);

    return (
        <div id="need-a-moment" className="worksheet-card feature-section fade-in">
            <h2>🎡 Need a Moment?</h2>
            <p className="section-desc">Quick resets for when things feel like "too much".</p>

            <div className="suggestion-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '15px',
                marginTop: '20px'
            }}>
                {resets.map(r => (
                    <button
                        key={r.id}
                        className="sound-card"
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => setActiveReset(r)}
                    >
                        <span style={{ fontSize: '2rem' }}>{r.icon}</span>
                        <p style={{ fontWeight: '600', margin: '5px 0' }}>{r.title}</p>
                    </button>
                ))}
            </div>

            {activeReset && (
                <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div className="modal-header">
                            <h3>{activeReset.icon} {activeReset.title}</h3>
                            <span className="close-modal" onClick={() => setActiveReset(null)}>&times;</span>
                        </div>
                        <div className="modal-inner-padding">
                            <p>{activeReset.desc}</p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setActiveReset(null)}>
                                Finished
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

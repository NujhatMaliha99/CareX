import { useState } from 'react';

const resets = [
    { 
        id: 'count', 
        title: '5-4-3-2-1 Grounding', 
        icon: '🖐️', 
        desc: (
            <div className="grounding-exercise">
                <p><strong>5</strong> things you can <em>see</em></p>
                <p><strong>4</strong> things you can <em>touch</em></p>
                <p><strong>3</strong> things you can <em>hear</em></p>
                <p><strong>2</strong> things you can <em>smell</em></p>
                <p><strong>1</strong> thing you can <em>taste</em></p>
            </div>
        )
    },
    { 
        id: 'stretch', 
        title: '30-Second Stretch', 
        icon: '🧘', 
        desc: (
            <div className="stretch-guide">
                <p>🙆 Raise arms overhead, stretch tall</p>
                <p>🔄 Roll shoulders back 5 times</p>
                <p>↩️ Gentle neck rolls, both sides</p>
                <p>🧘 Deep breath in... and out</p>
            </div>
        )
    },
    { 
        id: 'water', 
        title: 'Hydration Check', 
        icon: '💧', 
        desc: (
            <div className="water-reminder" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '3rem', margin: '10px 0' }}>💧</p>
                <p>Take a slow sip of water.<br/>Feel it hydrate your body.</p>
                <p><em>Dehydration affects mood and energy!</em></p>
            </div>
        )
    },
    { 
        id: 'look', 
        title: 'Nature Break', 
        icon: '🌿', 
        desc: (
            <div className="nature-break" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '3rem', margin: '10px 0' }}>🪟🌳</p>
                <p>Look outside for 2 minutes.</p>
                <p>Notice colors, movement, light.</p>
                <p><em>Nature reduces stress hormones.</em></p>
            </div>
        )
    }
];

export default function QuickResets({ onComplete }) {
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
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => {
                                setActiveReset(null);
                                if (onComplete) onComplete();
                            }}>
                                Finished
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

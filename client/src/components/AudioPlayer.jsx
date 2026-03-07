import { useState } from 'react';

const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', src: '/sounds/rain.mp3' },
    { id: 'forest', name: 'Forest', icon: '🌲', src: '/sounds/forest.mp3' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', src: '/sounds/ocean.mp3' },
    { id: 'lofi', name: 'Lofi', icon: '🎧', src: '/sounds/lofi.mp3' },
    { id: 'deep_sleep', name: 'Deep Sleep', icon: '🌙', src: '/sounds/sleep.mp3' },
    { id: 'relaxation', name: 'Relaxation', icon: '🧘', src: '/sounds/relax.mp3' }
];

export default function AudioPlayer({ onComplete }) {
    const [activeSound, setActiveSound] = useState(null);

    const playSound = (sound) => {
        setActiveSound(sound);
        if (onComplete) onComplete();
    };

    const closePlayer = () => {
        setActiveSound(null);
    };

    return (
        <div id="calm-sounds" className="worksheet-card feature-section fade-in">
            <h2>🎧 Calm Sounds</h2>
            <p className="section-desc">Immerse yourself in peaceful sounds to ease your mind.</p>

            <div className="sound-grid">
                {sounds.map(sound => (
                    <div key={sound.id} className={`sound-card ${activeSound?.id === sound.id ? 'active' : ''}`} onClick={() => playSound(sound)}>
                        <span className="sound-icon">{sound.icon}</span>
                        <span>{sound.name}</span>
                    </div>
                ))}
            </div>

            {activeSound && (
                <div className="audio-mini-player fade-in" style={{
                    marginTop: '30px',
                    padding: '20px',
                    borderRadius: '20px',
                    background: 'var(--white-glass)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '2rem' }}>{activeSound.icon}</span>
                        <div>
                            <h4 style={{ margin: 0 }}>{activeSound.name}</h4>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Now Playing</span>
                        </div>
                    </div>

                    <audio
                        key={activeSound.id}
                        controls
                        autoPlay
                        loop
                        style={{ height: '40px', flexGrow: 0.5 }}
                    >
                        <source src={activeSound.src} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>

                    <button
                        className="btn btn-outline btn-sm"
                        onClick={closePlayer}
                        style={{ borderRadius: '50%', width: '35px', height: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
}

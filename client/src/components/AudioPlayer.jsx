import { useState } from 'react';

const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', videoId: 'mPZkdNFkNps' },
    { id: 'forest', name: 'Forest', icon: '🌲', videoId: 'xNN7iTA57jM' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', videoId: 'bn9F19Hi1Lk' },
    { id: 'lofi', name: 'Lofi', icon: '🎧', videoId: 'jfKfPfyJRdk' },
    { id: 'deep_sleep', name: 'Deep Sleep', icon: '🌙', videoId: 'AV81KkVVTHE' },
    { id: 'relaxation', name: 'Relaxation', icon: '🧘', videoId: 'bL4S3BwjaiU' }
];

export default function AudioPlayer() {
    const [activeSound, setActiveSound] = useState(null);

    const playSound = (sound) => {
        setActiveSound(sound);
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
                    <div key={sound.id} className="sound-card" onClick={() => playSound(sound)}>
                        <span className="sound-icon">{sound.icon}</span>
                        <span>{sound.name}</span>
                    </div>
                ))}
            </div>

            {activeSound && (
                <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'black', color: 'white', width: '90%', maxWidth: '800px', padding: 0 }}>
                        <div className="modal-header" style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{activeSound.icon} {activeSound.name} Sound</h3>
                            <span className="close-modal" onClick={closePlayer} style={{ color: 'white', cursor: 'pointer' }}>&times;</span>
                        </div>
                        <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src={`https://www.youtube.com/embed/${activeSound.videoId}?autoplay=1&controls=0&loop=1&playlist=${activeSound.videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

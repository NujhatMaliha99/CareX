import { useState } from 'react';

export default function ReleaseThoughts() {
    const [thought, setThought] = useState('');
    const [isReleasing, setIsReleasing] = useState(false);

    const handleRelease = () => {
        if (!thought.trim()) return;

        setIsReleasing(true);
        setTimeout(() => {
            setThought('');
            setIsReleasing(false);
            alert('Your thoughts have been released. Deep breath. 🕊️');
        }, 1000);
    };

    return (
        <div id="release-thoughts" className="worksheet-card feature-section fade-in">
            <h2>🕊️ Release Thoughts</h2>
            <p className="section-desc">Write down what's weighing on you and let it float away into the clouds.</p>

            <div className="input-group">
                <textarea
                    id="dump-textarea"
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    placeholder="I feel overwhelmed because..."
                    style={{
                        transition: 'all 1s',
                        transform: isReleasing ? 'translateY(-100px) scale(0)' : 'none',
                        opacity: isReleasing ? 0 : 1
                    }}
                ></textarea>
            </div>

            <div className="text-center">
                <button className="btn btn-outline" onClick={handleRelease} disabled={isReleasing}>
                    Release into the Sky
                </button>
            </div>
        </div>
    );
}

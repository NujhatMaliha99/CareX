import { useState } from 'react';
import axios from 'axios';

export default function ThoughtReframe({ onComplete }) {
    const [thought, setThought] = useState('');
    const [reframe, setReframe] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReframe = async () => {
        if (!thought.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post('/api/ai/reframe', { thought });
            setReframe(response.data.reframe);
            if (onComplete) onComplete();
        } catch (error) {
            console.error('Reframe failed:', error);
            setReframe('I am worth more than my negative thoughts. I can handle this with patience.');
            if (onComplete) onComplete();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="thought-reframe" className="worksheet-card feature-section fade-in">
            <h2>🧠 Thought Reframe</h2>
            <p className="section-desc">Challenge unhelpful thoughts with AI-assisted compassion.</p>

            <div className="input-group">
                <label>The Heavy Thought</label>
                <textarea
                    placeholder="e.g., 'I always mess things up'"
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                ></textarea>
            </div>

            <div className="text-center">
                <button className="btn btn-primary" onClick={handleReframe} disabled={loading}>
                    {loading ? 'Reframing...' : 'Reframe with AI ✨'}
                </button>
            </div>

            {reframe && (
                <div className="suggestion-card fade-in" style={{ marginTop: '25px', backgroundColor: 'var(--bg-accent)' }}>
                    <h3>A Different Perspective:</h3>
                    <p style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>{reframe}</p>
                </div>
            )}
        </div>
    );
}

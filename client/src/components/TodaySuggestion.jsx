import { LucideLightbulb } from 'lucide-react';

const suggestions = [
    { text: "Try a 2-minute breathing exercise to ground yourself.", target: "panic-rescue" },
    { text: "Write 3 things you're grateful for in your Gratitude Capsule.", target: "gratitude-reflection" },
    { text: "Take 5 minutes for a PMR body scan.", target: "pmr-scan" },
    { text: "Release one nagging thought into the sky today.", target: "release-thoughts" },
    { text: "Celebrate a tiny win today, no matter how small.", target: "tiny-wins" }
];

export default function TodaySuggestion({ onStart }) {
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

    const handleStart = (id) => {
        if (onStart) onStart(id);
        else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="today-suggestion" className="worksheet-card suggestion-card fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <LucideLightbulb size={32} color="var(--accent-purple)" />
                <div>
                    <h3 style={{ margin: 0 }}>Today's Gentle Suggestion</h3>
                    <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>{suggestion.text}</p>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px', fontStyle: 'italic' }}>
                        Feeling stuck? Spin for a quick support idea.
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => handleStart(suggestion.target)}>Start Now</button>
                <button className="btn btn-outline btn-sm" onClick={() => handleStart('wellness-wheel')}>🎡 Spin Now</button>
            </div>
        </div>
    );
}

import { useState } from 'react';

const wheelSegments = [
    { text: "Breathing Exercise", bg: "#d0e8f2", action: "breathe" },
    { text: "Release Thoughts", bg: "#f3e5f5", action: "release" },
    { text: "Learn About Anxiety", bg: "#e8f5e9", action: "anxiety" },
    { text: "Grounding Exercise", bg: "#fff9c4", action: "ground" },
    { text: "Talk to Support", bg: "#ffccbc", action: "talk" },
    { text: "Connect with Gratitude", bg: "#c8e6c9", action: "gratitude" },
    { text: "Sleep Reset Tip", bg: "#bbdefb", action: "sleep" },
    { text: "Deep Breathing", bg: "#d1c4e9", action: "breathe" }
];

const wheelActions = {
    breathe: {
        icon: '🫁',
        title: 'Breathing Exercise',
        desc: 'A gentle rhythm for your heart and mind. Let\'s practice a quick grounding breath.'
    },
    release: {
        icon: '🕊️',
        title: 'Release Thoughts',
        desc: 'Write down what\'s weighing on you and let it float away in your digital journal.'
    },
    anxiety: {
        icon: '🔍',
        title: 'Learn About Anxiety',
        desc: 'Understanding the "why" helps the "how". Explore our gentle guide on anxiety.'
    },
    ground: {
        icon: '🌿',
        title: 'Grounding Exercise',
        desc: 'Bring yourself back to the present with a simple 5-4-3-2-1 practice.'
    },
    talk: {
        icon: '💬',
        title: 'Talk to Support',
        desc: 'You don\'t have to carry this alone. Reach out to a friend or our AI guide.'
    },
    gratitude: {
        icon: '🙏',
        title: 'Gratitude',
        desc: 'Take a moment to reflect on something you are thankful for today.'
    },
    sleep: {
        icon: '🌙',
        title: 'Sleep Reset Tip',
        desc: 'A small adjustment for a better night. Check our curated sleep sanctuary tips.'
    }
};

export default function WellnessWheel({ onComplete }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [rescueMode, setRescueMode] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        const randomDeg = Math.floor(1800 + Math.random() * 2000);
        const newRotation = rotation + randomDeg;
        setRotation(newRotation);

        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            setIsSpinning(false);
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);

            const actualDeg = newRotation % 360;
            const segmentIndex = Math.floor((360 - actualDeg + 22.5) % 360 / 45);

            const segment = wheelSegments[segmentIndex] || wheelSegments[0];
            const action = wheelActions[segment.action] || wheelActions.breathe;

            setResult({ ...action, target: segment.action === 'ground' ? 'need-a-moment' : segment.action === 'talk' ? 'appointments' : segment.action === 'anxiety' ? 'explore-mental-health' : segment.action === 'sleep' ? 'sleep-reset' : segment.action === 'release' ? 'release-thoughts' : 'panic-rescue' });

        }, 5000);
    };

    const executeAction = () => {
        if (result && result.target) {
            scrollToSection(result.target);
            if (onComplete) onComplete();
            setResult(null);
        }
    };

    return (
        <div className="worksheet-card feature-section fade-in" id="wellness-wheel">
            <div className="text-center">
                <h2>Wheel of Wellness</h2>
                <p className="section-desc">Not sure what you need right now? Spin for a gentle suggestion.</p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.9rem', opacity: rescueMode ? 0.5 : 1 }}>Standard</span>
                    <label className="switch">
                        <input type="checkbox" checked={rescueMode} onChange={(e) => setRescueMode(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                    <span style={{ fontSize: '0.9rem', color: rescueMode ? 'var(--accent-orange)' : 'inherit', fontWeight: rescueMode ? 700 : 400 }}>Mood Rescue</span>
                </div>
            </div>

            <div className="wheel-outer-container">
                <div className="wheel-wrapper">
                    <div
                        className="calm-wheel"
                        id="calm-wheel-spinner"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {wheelSegments.map((seg, i) => (
                            <div
                                key={i}
                                className="wheel-segment"
                                style={{
                                    '--i': i,
                                    '--bg': seg.bg
                                }}
                            >
                                <span>{seg.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="wheel-pointer"></div>
                    <button
                        className="wheel-center-btn"
                        id="wheel-spin-btn"
                        onClick={spinWheel}
                        disabled={isSpinning}
                    >
                        SPIN
                    </button>
                </div>
            </div>

            {result && (
                <div id="wheel-result" className="wheel-result" style={{ display: 'block' }}>
                    <h3>You got: <span id="result-title" style={{ color: 'var(--accent-purple)' }}>{result.title}</span></h3>
                    <p>{result.desc}</p>
                    <div className="wheel-result-buttons">
                        <button className="btn btn-primary" onClick={executeAction}>Start Now</button>
                        <button className="btn btn-outline" onClick={() => setResult(null)}>Save for Later</button>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';

const pmrtParts = [
    { id: 'feet', name: 'Feet', ids: ['pmrt-foot-l', 'pmrt-foot-r'], instruction: 'Curl your toes tightly... hold...' },
    { id: 'legs', name: 'Legs', ids: ['pmrt-leg-l', 'pmrt-leg-r'], instruction: 'Tense your calves and thighs... feel the tightness...' },
    { id: 'stomach', name: 'Stomach', ids: ['pmrt-stomach'], instruction: 'Tighten your core muscles... make it hard...' },
    { id: 'chest', name: 'Chest', ids: ['pmrt-chest'], instruction: 'Take a deep breath and hold... puff out your chest...' },
    { id: 'hands', name: 'Hands', ids: ['pmrt-hand-l', 'pmrt-hand-r'], instruction: 'Clench your fists... squeeze tight...' },
    { id: 'arms', name: 'Arms', ids: ['pmrt-arm-l', 'pmrt-arm-r'], instruction: 'Flex your biceps... stiffen your arms...' },
    { id: 'shoulders', name: 'Shoulders', ids: ['pmrt-shoulder-l', 'pmrt-shoulder-r'], instruction: 'Raise shoulders to ears... hold the tension...' },
    { id: 'neck', name: 'Neck', ids: ['pmrt-neck'], instruction: 'Gently tilt head back... feel the neck stretch...' },
    { id: 'head', name: 'Face', ids: ['pmrt-head'], instruction: 'Scrunch your face... eyes tight, jaw clenched...' }
];

export default function PMRT({ onComplete }) {
    const [isActive, setIsActive] = useState(false);
    const [currentPartIndex, setCurrentPartIndex] = useState(-1);
    const [phase, setPhase] = useState(''); // 'tense', 'release'
    const [timer, setTimer] = useState(0);
    const [duration, setDuration] = useState(2); // minutes
    const [instruction, setInstruction] = useState({ title: "Let's Begin", text: 'Click "Start Relaxation" to begin a guided body relaxation journey.' });

    const abortControllerRef = useRef(null);

    const sleep = (ms, signal) => new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Aborted'));
            });
        }
    });

    const startSession = async () => {
        if (isActive) {
            // Stop
            if (abortControllerRef.current) abortControllerRef.current.abort();
            setIsActive(false);
            setInstruction({ title: "Session Stopped", text: "Take a deep breath." });
            setCurrentPartIndex(-1);
            setPhase('');
            return;
        }

        setIsActive(true);
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const totalSeconds = duration * 60;
        const perPartSeconds = totalSeconds / pmrtParts.length;
        const tenseTime = Math.max(3, Math.floor(perPartSeconds * 0.4));
        const releaseTime = Math.max(5, Math.floor(perPartSeconds * 0.6));

        try {
            for (let i = 0; i < pmrtParts.length; i++) {
                const part = pmrtParts[i];
                setCurrentPartIndex(i);

                // Tense Phase
                setInstruction({ title: part.name, text: part.instruction });
                setPhase('tense');

                for (let t = tenseTime; t > 0; t--) {
                    setTimer(t);
                    await sleep(1000, signal);
                }

                // Release Phase
                setPhase('release');
                setInstruction({ title: part.name, text: 'Release... breathe out... feel the warmth.' });

                for (let r = releaseTime; r > 0; r--) {
                    setTimer(r);
                    await sleep(1000, signal);
                }
            }

            setIsActive(false);
            setInstruction({ title: "Session Complete", text: "You are safe. Your body is lighter now 💜" });
            setPhase('');
            setCurrentPartIndex(-1);
            if (onComplete) onComplete();

        } catch (err) {
            if (err.message !== 'Aborted') console.error(err);
        }
    };

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const getPartClass = (ids) => {
        if (currentPartIndex === -1) return "body-region";
        const currentPart = pmrtParts[currentPartIndex];
        if (currentPart.ids.some(id => ids.includes(id))) {
            return `body-region active-region ${phase}`;
        }
        return "body-region";
    };

    return (
        <div id="pmr-scan" className="worksheet-card feature-section fade-in">
            <h2>🧘 Progressive Muscle Relaxation</h2>
            <p className="section-desc">Relax your body, one muscle group at a time. Tense → Hold → Release → Breathe</p>

            <div className="pmrt-options">
                {[2, 5, 10].map(m => (
                    <button
                        key={m}
                        className={`pmrt-duration-btn ${duration === m ? 'active' : ''}`}
                        onClick={() => setDuration(m)}
                    >
                        {m === 2 ? '⚡ 2 min Quick' : m === 5 ? '🌿 5 min Calm' : '🌙 10 min Deep'}
                    </button>
                ))}
            </div>

            <div className="pmrt-container">
                <div className="body-silhouette-wrapper">
                    <svg viewBox="0 0 200 400" className="body-silhouette">
                        <ellipse cx="100" cy="40" rx="30" ry="35" className={getPartClass(['pmrt-head'])} />
                        <rect x="90" y="70" width="20" height="20" rx="5" className={getPartClass(['pmrt-neck'])} />
                        <ellipse cx="55" cy="100" rx="25" ry="15" className={getPartClass(['pmrt-shoulder-l'])} />
                        <ellipse cx="145" cy="100" rx="25" ry="15" className={getPartClass(['pmrt-shoulder-r'])} />
                        <ellipse cx="100" cy="130" rx="45" ry="35" className={getPartClass(['pmrt-chest'])} />
                        <rect x="25" y="105" width="20" height="80" rx="10" className={getPartClass(['pmrt-arm-l'])} />
                        <rect x="155" y="105" width="20" height="80" rx="10" className={getPartClass(['pmrt-arm-r'])} />
                        <ellipse cx="35" cy="195" rx="15" ry="18" className={getPartClass(['pmrt-hand-l'])} />
                        <ellipse cx="165" cy="195" rx="15" ry="18" className={getPartClass(['pmrt-hand-r'])} />
                        <ellipse cx="100" cy="185" rx="40" ry="30" className={getPartClass(['pmrt-stomach'])} />
                        <rect x="60" y="210" width="30" height="120" rx="15" className={getPartClass(['pmrt-leg-l'])} />
                        <rect x="110" y="210" width="30" height="120" rx="15" className={getPartClass(['pmrt-leg-r'])} />
                        <ellipse cx="75" cy="345" rx="20" ry="15" className={getPartClass(['pmrt-foot-l'])} />
                        <ellipse cx="125" cy="345" rx="20" ry="15" className={getPartClass(['pmrt-foot-r'])} />
                    </svg>

                    {isActive && (
                        <div className={`pmrt-ring visible`} style={{ borderColor: phase === 'tense' ? '#ff5722' : '#4caf50' }}>
                            <div className="ring-inner">
                                <span className="ring-phase">{phase === 'tense' ? 'Tense' : 'Relax'}</span>
                                <span className="ring-timer">{timer}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="pmrt-instruction">
                <h4>{instruction.title}</h4>
                <p>{instruction.text}</p>
            </div>

            <div className="text-center" style={{ marginTop: '25px' }}>
                <button className="btn btn-primary btn-lg" onClick={startSession}>
                    {isActive ? '⏹️ Stop Session' : '🌿 Start Relaxation'}
                </button>
            </div>
        </div>
    );
}

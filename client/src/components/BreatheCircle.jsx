import { useState, useEffect, useRef } from 'react';

export default function BreatheCircle() {
    const [isActive, setIsActive] = useState(false);
    const [stageText, setStageText] = useState("Ready?");
    const [timer, setTimer] = useState(5);
    const [cycle, setCycle] = useState(0);
    const [breathingClass, setBreathingClass] = useState("");

    const intervalRef = useRef(null);
    const totalCycles = 4;
    const phaseDuration = 5;
    const cycleDuration = phaseDuration * 4; // 20s

    const startBreathing = () => {
        if (isActive) {
            // Stop
            clearInterval(intervalRef.current);
            setIsActive(false);
            setStageText("Ready?");
            setTimer(5);
            setCycle(0);
            setBreathingClass("");
            return;
        }

        setIsActive(true);
        setCycle(1);
        let count = 0;

        const updatePhase = () => {
            const cyclePosition = count % cycleDuration;
            const phaseIndex = Math.floor(cyclePosition / phaseDuration);
            const phases = ["Inhale...", "Hold...", "Exhale...", "Hold..."];
            const classes = ["inhale", "hold-in", "exhale", "hold-out"];

            setStageText(phases[phaseIndex]);
            setBreathingClass(classes[phaseIndex]);

            const timeRemaining = phaseDuration - (cyclePosition % phaseDuration);
            setTimer(timeRemaining);

            const currentCycle = Math.floor(count / cycleDuration) + 1;
            setCycle(currentCycle);
        };

        updatePhase();

        intervalRef.current = setInterval(() => {
            count++;
            updatePhase();

            if (count >= cycleDuration * totalCycles) {
                clearInterval(intervalRef.current);
                setIsActive(false);
                setStageText("Well done! 💜");
                setTimer("✓");
                setBreathingClass("");
            }
        }, 1000);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="worksheet-card emergency-card fade-in" id="panic-rescue">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Panic Rescue</h2>
                <button className="btn btn-emergency-alarm" onClick={() => alert('Call 988 or Local Emergency Services')}>🚨 Need Help?</button>
            </div>
            <p className="section-desc">You are safe. We are right here with you. Focus on the circle.</p>

            <div className="timer-container">
                <div className={`timer-circle breathing-circle ${breathingClass} ${isActive ? 'active-session' : ''}`} id="breathing-display">
                    <div className="breathing-inner-content">
                        <h3 style={{ margin: 0, opacity: 0.8, fontSize: '1rem', fontWeight: 600 }}>{stageText}</h3>
                        <span className="breathing-countdown" style={{ display: 'block', margin: '10px 0' }}>{timer}</span>
                        {isActive && <span className="breathing-cycle-text" style={{ fontStyle: 'italic', opacity: 0.7 }}>Cycle {cycle} of {totalCycles}</span>}
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button className="btn btn-primary" onClick={startBreathing}>
                    {isActive ? "Stop Session" : "Begin Breathing"}
                </button>
            </div>
        </div>
    );
}

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import QuickActionBar from '../components/QuickActionBar';
import TodaySuggestion from '../components/TodaySuggestion';
import MoodHistory from '../components/MoodHistory';
import MoodTracker from '../components/MoodTracker';
import WellnessWheel from '../components/WellnessWheel';
import BreatheCircle from '../components/BreatheCircle';
import ReleaseThoughts from '../components/ReleaseThoughts';
import FocusTimer from '../components/FocusTimer';
import SleepReset from '../components/SleepReset';
import AudioPlayer from '../components/AudioPlayer';
import PMRT from '../components/PMRT';
import StoriesSection from '../components/StoriesSection';
import TalkToMyself from '../components/TalkToMyself';
import ThoughtReframe from '../components/ThoughtReframe';
import FutureMe from '../components/FutureMe';
import GratitudeJournal from '../components/GratitudeJournal';
import TinyWins from '../components/TinyWins';
import ExploreLibrary from '../components/ExploreLibrary';
import QuickResets from '../components/QuickResets';
import SocialBattery from '../components/SocialBattery';
import Appointments from '../components/Appointments';
import AIChatBot from '../components/AIChatBot';
import HelplineModal from '../components/HelplineModal';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MentalHealth({ user, handleLogout }) {
    const [showHelpline, setShowHelpline] = useState(false);
    const [dailyAdvice, setDailyAdvice] = useState('');
    const [taskStatus, setTaskStatus] = useState(() => {
        return JSON.parse(localStorage.getItem('mentalTaskStatus') || '{}');
    });

    useEffect(() => {
        // Fetch a random piece of advice/wisdom for mental health support
        axios.get('https://api.adviceslip.com/advice')
            .then(res => setDailyAdvice(res.data.slip.advice))
            .catch(err => console.error("Error fetching advice:", err));
    }, []);

    const completeTask = (taskId) => {
        const newStatus = { ...taskStatus, [taskId]: true };
        setTaskStatus(newStatus);
        localStorage.setItem('mentalTaskStatus', JSON.stringify(newStatus));
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div className="mental-health-page dreamy-page">
            <Navbar user={user} handleLogout={handleLogout} />
            <QuickActionBar onEmergency={() => setShowHelpline(true)} />

            {/* Dreamy Background Elements */}
            <div className="dreamy-bg-container">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="stars-layer"></div>
                <div className="flower-decoration"></div>
            </div>

            <div className="container" style={{ paddingTop: '80px' }}>
                <div className="disclaimer-banner fade-in">
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <p><strong>CareX Awareness Tool:</strong> This is for wellness support, not a medical diagnosis. If in
                        crisis, use the emergency button.</p>
                </div>

                {dailyAdvice && (
                    <div className="wellness-wisdom-card fade-in delay-1" style={{ 
                        background: 'rgba(255, 255, 255, 0.7)', 
                        backdropFilter: 'blur(10px)', 
                        padding: '20px 30px', 
                        borderRadius: '20px', 
                        marginBottom: '30px', 
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        borderLeft: '5px solid var(--accent-purple)'
                    }}>
                        <h3 style={{ color: 'var(--accent-purple)', fontSize: '1rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>✨ Wellness Wisdom</h3>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontStyle: 'italic' }}>"{dailyAdvice}"</p>
                    </div>
                )}

                <div className="little-banner fade-in">
                    <div className="banner-content">
                        <h1>How are you feeling today?</h1>
                        <p>Let's take one small step toward calm together.</p>
                        <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={() => scrollToSection('mental-weather')}>
                            ✅ Start Daily Check-In
                        </button>
                    </div>
                </div>

                <div className="mental-layout">
                    <Sidebar taskStatus={taskStatus} />

                    <main className="mental-content">

                        <TodaySuggestion onStart={(id) => scrollToSection(id)} />
                        <MoodHistory />

                        <section id="mental-weather">
                            <MoodTracker onComplete={() => completeTask('weather')} />
                        </section>

                        <section id="wellness-wheel" style={{ marginTop: '40px' }}>
                            <WellnessWheel onComplete={() => completeTask('wellness-wheel')} />
                        </section>

                        <section id="panic-rescue" style={{ marginTop: '40px' }}>
                            <BreatheCircle onNeedHelp={() => setShowHelpline(true)} onComplete={() => completeTask('panic')} />
                        </section>

                        <section id="release-thoughts" style={{ marginTop: '40px' }}>
                            <ReleaseThoughts onComplete={() => completeTask('release')} />
                        </section>

                        <div className="nav-section-title" style={{ marginTop: '60px', opacity: 0.5 }}>CALM SPACE</div>

                        <section id="focus-mode" style={{ marginTop: '40px' }}>
                            <FocusTimer onComplete={() => completeTask('focus')} />
                        </section>

                        <section id="sleep-reset" style={{ marginTop: '40px' }}>
                            <SleepReset onComplete={() => completeTask('sleep')} />
                        </section>

                        <section id="calm-sounds" style={{ marginTop: '40px' }}>
                            <AudioPlayer onComplete={() => completeTask('sounds')} />
                        </section>

                        <section id="pmr-scan" style={{ marginTop: '40px' }}>
                            <PMRT onComplete={() => completeTask('pmr')} />
                        </section>

                        <section id="stories-hope" style={{ marginTop: '40px' }}>
                            <StoriesSection onComplete={() => completeTask('stories')} />
                        </section>

                        <div className="nav-section-title" style={{ marginTop: '60px', opacity: 0.5 }}>REFLECTION</div>

                        <section id="talk-myself" style={{ marginTop: '40px' }}>
                            <TalkToMyself onComplete={() => completeTask('talk')} />
                        </section>

                        <section id="thought-reframe" style={{ marginTop: '40px' }}>
                            <ThoughtReframe onComplete={() => completeTask('reframe')} />
                        </section>

                        <section id="future-letter" style={{ marginTop: '40px' }}>
                            <FutureMe onComplete={() => completeTask('future')} />
                        </section>

                        <section id="gratitude-reflection" style={{ marginTop: '40px' }}>
                            <GratitudeJournal onComplete={() => completeTask('gratitude')} />
                        </section>

                        <section id="tiny-wins" style={{ marginTop: '40px' }}>
                            <TinyWins onComplete={() => completeTask('wins')} />
                        </section>

                        <div className="nav-section-title" style={{ marginTop: '60px', opacity: 0.5 }}>CARE & SUPPORT</div>

                        <section id="explore-mental-health" style={{ marginTop: '40px' }}>
                            <ExploreLibrary onComplete={() => completeTask('explore')} />
                        </section>

                        <section id="need-a-moment" style={{ marginTop: '40px' }}>
                            <QuickResets onComplete={() => completeTask('moment')} />
                        </section>

                        <section id="social-battery" style={{ marginTop: '40px' }}>
                            <SocialBattery onComplete={() => completeTask('social')} />
                        </section>

                        <section id="appointments" style={{ marginTop: '40px' }}>
                            <Appointments onComplete={() => completeTask('appointments')} />
                        </section>

                    </main>
                </div>

                <AIChatBot />
                {showHelpline && <HelplineModal onClose={() => setShowHelpline(false)} />}
            </div>

            <Footer />
        </div>
    );
}

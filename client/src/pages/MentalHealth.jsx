import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import WellnessWheel from '../components/WellnessWheel';
import BreatheCircle from '../components/BreatheCircle';
import StoriesSection from '../components/StoriesSection';
import AudioPlayer from '../components/AudioPlayer';
import PMRT from '../components/PMRT';
import AIChatBot from '../components/AIChatBot';
import MoodTracker from '../components/MoodTracker';
import ReleaseThoughts from '../components/ReleaseThoughts';
import SocialBattery from '../components/SocialBattery';
import FocusTimer from '../components/FocusTimer';
import SleepReset from '../components/SleepReset';
import TalkToMyself from '../components/TalkToMyself';
import ThoughtReframe from '../components/ThoughtReframe';
import FutureMe from '../components/FutureMe';
import GratitudeJournal from '../components/GratitudeJournal';
import ExploreLibrary from '../components/ExploreLibrary';
import QuickResets from '../components/QuickResets';
import Appointments from '../components/Appointments';
import Footer from '../components/Footer';

export default function MentalHealth() {
    return (
        <div className="mental-health-page dreamy-page">
            <Navbar />

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

                <div className="little-banner fade-in">
                    <div className="banner-content">
                        <h1>How are you feeling today?</h1>
                        <p>Let's take one small step toward calm together.</p>
                    </div>
                </div>

                <div className="mental-layout">
                    <Sidebar />

                    <main className="mental-content">

                        <section id="mental-weather">
                            <MoodTracker />
                        </section>

                        <section id="wellness-wheel" style={{ marginTop: '40px' }}>
                            <WellnessWheel />
                        </section>

                        <section id="panic-rescue" style={{ marginTop: '40px' }}>
                            <BreatheCircle />
                        </section>

                        <section id="release-thoughts" style={{ marginTop: '40px' }}>
                            <ReleaseThoughts />
                        </section>

                        <div className="nav-section-title" style={{ marginTop: '60px', opacity: 0.5 }}>CALM SPACE</div>

                        <section id="focus-mode" style={{ marginTop: '40px' }}>
                            <FocusTimer />
                        </section>

                        <section id="sleep-reset" style={{ marginTop: '40px' }}>
                            <SleepReset />
                        </section>

                        <section id="calm-sounds" style={{ marginTop: '40px' }}>
                            <AudioPlayer />
                        </section>

                        <section id="pmr-scan" style={{ marginTop: '40px' }}>
                            <PMRT />
                        </section>

                        <section id="stories-hope" style={{ marginTop: '40px' }}>
                            <StoriesSection />
                        </section>

                        <div className="nav-section-title" style={{ marginTop: '60px', opacity: 0.5 }}>REFLECTION</div>

                        <section id="talk-myself" style={{ marginTop: '40px' }}>
                            <TalkToMyself />
                        </section>

                        <section id="thought-reframe" style={{ marginTop: '40px' }}>
                            <ThoughtReframe />
                        </section>

                        <section id="future-letter" style={{ marginTop: '40px' }}>
                            <FutureMe />
                        </section>

                        <section id="gratitude-reflection" style={{ marginTop: '40px' }}>
                            <GratitudeJournal />
                        </section>

                        <div className="nav-section-title" style={{ marginTop: '60px', opacity: 0.5 }}>CARE & SUPPORT</div>

                        <section id="explore-mental-health" style={{ marginTop: '40px' }}>
                            <ExploreLibrary />
                        </section>

                        <section id="need-a-moment" style={{ marginTop: '40px' }}>
                            <QuickResets />
                        </section>

                        <section id="social-battery" style={{ marginTop: '40px' }}>
                            <SocialBattery />
                        </section>

                        <section id="appointments" style={{ marginTop: '40px' }}>
                            <Appointments />
                        </section>

                    </main>
                </div>

                <AIChatBot />
            </div>

            <Footer />
        </div>
    );
}

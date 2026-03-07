import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';

export default function Home({ user, setUser, handleLogout }) {
    const navigate = useNavigate();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <div className="home-page dreamy-page">
            {/* Dreamy Background Elements */}
            <div className="dreamy-bg-container">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="stars-layer"></div>
            </div>

            <Navbar user={user} handleLogout={handleLogout} transparent={true} onLoginClick={() => setIsAuthOpen(true)} />

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onAuthSuccess={(userData) => setUser(userData)}
            />

            <main>
                <section className="hero-simple">
                    <div className="container text-center">
                        <h1 className="welcome-title fade-in">Welcome to CareX</h1>
                        <p className="hero-subtitle fade-in delay-1">Your simple hub for mind, body, and daily care.</p>
                        <div className="home-cta-buttons fade-in delay-2">
                            <button onClick={() => setIsAuthOpen(true)} className="btn btn-primary">Get Started</button>
                            <Link to="/mental" className="btn btn-outline">Explore Mental Health</Link>
                        </div>
                    </div>
                </section>

                <section className="pillars-section">
                    <div className="container">
                        <div className="pillar-grid-precise">
                            {/* Physical Health Card */}
                            <div className="pillar-card-precise fade-in delay-2" onClick={() => navigate('/physical')}>
                                <div className="card-icon-wrap">🏃</div>
                                <h2>Physical Health</h2>
                                <p>Fuel your body, stay active, and build strength.</p>
                                <Link to="/physical" className="btn-card-action btn-physical-teal">
                                    Explore Physical <span>&gt;</span>
                                </Link>
                            </div>

                            {/* Mental Health Card */}
                            <div className="pillar-card-precise fade-in delay-2" onClick={() => navigate('/mental')} style={{ animationDelay: '0.6s' }}>
                                <div className="card-icon-wrap">🧠</div>
                                <h2>Mental Health</h2>
                                <p>Nurture your mind, find calm, and boost emotional resilience.</p>
                                <Link to="/mental" className="btn-card-action btn-mental-lavender">
                                    Explore Mental <span>&gt;</span>
                                </Link>
                            </div>

                            {/* Hygiene & Awareness Card */}
                            <div className="pillar-card-precise fade-in delay-2" onClick={() => navigate('/hygiene')} style={{ animationDelay: '0.8s' }}>
                                <div className="card-icon-wrap">🛡️</div>
                                <h2>Hygiene & Awareness</h2>
                                <p>Learn about self-care, hygiene tips, and healthy habits.</p>
                                <Link to="/hygiene" className="btn-card-action btn-hygiene-blue">
                                    Explore Hygiene <span>&gt;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <div className="bottom-wave-decoration"></div>

            <footer id="about" style={{ padding: '40px 0', background: 'none' }}>
                <div className="container text-center">
                    <p>&copy; 2026 CareX Health. Designed with care.</p>
                </div>
            </footer>
        </div>
    );
}

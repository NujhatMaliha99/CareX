import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ user, handleLogout, transparent, onLoginClick }) {
    const location = useLocation();
    const isMentalPage = location.pathname === '/mental';
    const isHomePage = location.pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const headerClass = transparent || isHomePage ? 'front-page-header' : '';

    return (
        <header className={headerClass} style={{ position: 'relative' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <Link to="/" className="logo-group" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="heart-logo">💙</span>
                    <span className="logo-text">CareX</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-nav-toggle" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation"
                    style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-dark)', borderRadius: '10px' }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`nav-links-global ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/physical" onClick={() => setIsMenuOpen(false)}>Physical Health</Link>
                    <Link to="/mental" onClick={() => setIsMenuOpen(false)} className={isMentalPage ? 'nav-active' : ''}>Mental Health</Link>
                    <Link to="/hygiene" onClick={() => setIsMenuOpen(false)}>Hygiene & Awareness</Link>
                    <Link to="/resources" onClick={() => setIsMenuOpen(false)}>Resources</Link>
                    {user ? (
                        <div className="user-profile-nav">
                            <span className="user-greeting">Hi, {user.name.split(' ')[0]} 👋</span>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn-logout-minimal">Logout</button>
                        </div>
                    ) : isHomePage && (
                        <div className="nav-auth-buttons">
                            <button onClick={() => { if (onLoginClick) onLoginClick(); setIsMenuOpen(false); }} className="btn-login-header">Login</button>
                            <button onClick={() => { if (onLoginClick) onLoginClick(); setIsMenuOpen(false); }} className="btn-get-started btn-signup-header">Sign Up</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .nav-links-global {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                }
                .nav-links-global a {
                    text-decoration: none;
                    color: var(--text-light);
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: color 0.3s;
                }
                .nav-links-global a:hover {
                    color: var(--accent-purple);
                }
                .nav-links-global .nav-active {
                    background: var(--accent-purple);
                    color: white !important;
                    padding: 5px 15px;
                    border-radius: 15px;
                }
                @media (max-width: 768px) {
                    .mobile-nav-toggle {
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                    }
                    .nav-links-global {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 15px 20px 20px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
                        z-index: 9999;
                        gap: 0;
                        border-bottom-left-radius: 25px;
                        border-bottom-right-radius: 25px;
                        border-top: 1px solid rgba(0, 0, 0, 0.05);
                    }
                    .nav-links-global.mobile-menu-open {
                        display: flex !important;
                    }
                    .nav-links-global a {
                        width: 100%;
                        padding: 14px 10px !important;
                        font-size: 1rem !important;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                        border-radius: 0;
                        color: var(--text-dark) !important;
                    }
                    .nav-links-global a:last-of-type {
                        border-bottom: none;
                    }
                    .nav-links-global .btn-get-started {
                        margin-top: 10px;
                        text-align: center;
                        border-radius: 50px !important;
                        border-bottom: none !important;
                        padding: 12px 20px !important;
                        color: white !important;
                        display: block;
                    }
                    .nav-auth-buttons {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        gap: 8px;
                        padding-top: 10px;
                    }
                    .nav-auth-buttons .btn-login-header,
                    .nav-auth-buttons .btn-get-started {
                        width: 100%;
                        text-align: center;
                        padding: 12px 20px !important;
                        border-radius: 50px !important;
                    }
                    .user-profile-nav {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        width: 100%;
                        padding: 10px 0;
                        gap: 8px;
                    }
                    .user-profile-nav .user-greeting {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </header>
    );
}


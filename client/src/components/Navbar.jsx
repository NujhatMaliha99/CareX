import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const isMentalPage = location.pathname === '/mental';

    return (
        <header className={isMentalPage ? "" : "front-page-header"}>
            <div className="container header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <nav style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="logo-group" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className="heart-logo">💙</span>
                        <span className="logo-text">CareX</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/physical">Physical Health</Link>
                        <Link to="/mental" style={isMentalPage ? { background: 'var(--accent-purple)', color: 'white', padding: '5px 15px', borderRadius: '15px' } : {}}>Mental Health</Link>
                        <Link to="/hygiene">Hygiene & Awareness</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}

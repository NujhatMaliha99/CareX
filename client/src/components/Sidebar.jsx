export default function Sidebar() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            element.style.boxShadow = 'var(--shadow-glow)';
            setTimeout(() => element.style.boxShadow = 'none', 2000);
        }
    };

    return (
        <aside className="mental-sidebar">
            <nav className="sidebar-nav">
                <div className="nav-section-title">MENTAL TOOLS</div>
                <a onClick={() => scrollToSection('mental-weather')}>☁️ Mental Weather</a>
                <a onClick={() => scrollToSection('wellness-wheel')}>🎡 Wheel of Wellness</a>
                <a onClick={() => scrollToSection('panic-rescue')} className="emergency-pill">🌊 Panic Rescue</a>
                <a onClick={() => scrollToSection('release-thoughts')}>🕊️ Release Thoughts</a>

                <div className="nav-section-title">CALM SPACE</div>
                <a onClick={() => scrollToSection('focus-mode')}>🎯 Focus Mode</a>
                <a onClick={() => scrollToSection('sleep-reset')}>🌙 Sleep Reset</a>
                <a onClick={() => scrollToSection('calm-sounds')}>🎧 Calm Sounds</a>
                <a onClick={() => scrollToSection('pmr-scan')}>🌊 Body Scan</a>
                <a onClick={() => scrollToSection('stories-hope')}>🌸 Stories & Hope</a>

                <div className="nav-section-title">REFLECTION</div>
                <a onClick={() => scrollToSection('talk-myself')}>💬 Talk to Myself</a>
                <a onClick={() => scrollToSection('thought-reframe')}>🧠 Thought Reframe</a>
                <a onClick={() => scrollToSection('future-letter')}>✉️ Future Me</a>
                <a onClick={() => scrollToSection('gratitude-capsule')}>🙏 Gratitude</a>
                <a onClick={() => scrollToSection('tiny-wins')}>✅ Tiny Wins</a>

                <div className="nav-section-title">CARE & SUPPORT</div>
                <a onClick={() => scrollToSection('explore-mental-health')}>🔍 Explore Mental Health</a>
                <a onClick={() => scrollToSection('need-a-moment')}>🎡 Need a Moment?</a>
                <a onClick={() => scrollToSection('social-battery')}>🫂 Social Battery</a>
                <a onClick={() => scrollToSection('appointments')}>📅 Appointments</a>
            </nav>
        </aside>
    );
}

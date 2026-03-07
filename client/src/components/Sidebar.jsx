export default function Sidebar({ taskStatus = {} }) {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            element.classList.add('section-highlight');
            setTimeout(() => element.classList.remove('section-highlight'), 2000);
        }
    };

    const renderProgress = (taskId) => {
        if (taskStatus[taskId]) {
            return <span className="nav-progress-check">✅</span>;
        }
        return null;
    };

    return (
        <aside className="mental-sidebar">
            <nav className="sidebar-nav">
                <div className="nav-section-title">MENTAL TOOLS</div>
                <a onClick={() => scrollToSection('mental-weather')}>☁️ Mental Weather {renderProgress('weather')}</a>
                <a onClick={() => scrollToSection('wellness-wheel')}>🎡 Wheel of Wellness {renderProgress('wellness-wheel')}</a>
                <a onClick={() => scrollToSection('panic-rescue')} className="emergency-pill">🌊 Panic Rescue {renderProgress('panic')}</a>
                <a onClick={() => scrollToSection('release-thoughts')}>🕊️ Release Thoughts {renderProgress('release')}</a>

                <div className="nav-section-title">CALM SPACE</div>
                <a onClick={() => scrollToSection('focus-mode')}>🎯 Focus Mode {renderProgress('focus')}</a>
                <a onClick={() => scrollToSection('sleep-reset')}>🌙 Sleep Reset {renderProgress('sleep')}</a>
                <a onClick={() => scrollToSection('calm-sounds')}>🎧 Calm Sounds {renderProgress('sounds')}</a>
                <a onClick={() => scrollToSection('pmr-scan')}>🌊 Body Scan {renderProgress('pmr')}</a>
                <a onClick={() => scrollToSection('stories-hope')}>🌸 Stories & Hope {renderProgress('stories')}</a>

                <div className="nav-section-title">REFLECTION</div>
                <a onClick={() => scrollToSection('talk-myself')}>💬 Talk to Myself {renderProgress('talk')}</a>
                <a onClick={() => scrollToSection('thought-reframe')}>🧠 Thought Reframe {renderProgress('reframe')}</a>
                <a onClick={() => scrollToSection('future-letter')}>✉️ Future Me {renderProgress('future')}</a>
                <a onClick={() => scrollToSection('gratitude-reflection')}>🙏 Gratitude {renderProgress('gratitude')}</a>
                <a onClick={() => scrollToSection('tiny-wins')}>✅ Tiny Wins {renderProgress('wins')}</a>

                <div className="nav-section-title">CARE & SUPPORT</div>
                <a onClick={() => scrollToSection('explore-mental-health')}>🔍 Explore Mental Health {renderProgress('explore')}</a>
                <a onClick={() => scrollToSection('need-a-moment')}>🎡 Need a Moment? {renderProgress('moment')}</a>
                <a onClick={() => scrollToSection('social-battery')}>🫂 Social Battery {renderProgress('social')}</a>
                <a onClick={() => scrollToSection('appointments')}>📅 Appointments {renderProgress('appointments')}</a>
            </nav>
        </aside>
    );
}

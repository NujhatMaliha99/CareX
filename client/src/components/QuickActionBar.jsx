import { LucideWind, LucideHeadphones, LucideCalendar } from 'lucide-react';

export default function QuickActionBar() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="quick-action-bar">
            <button className="action-btn" onClick={() => scrollToSection('panic-rescue')} title="Quick Calm">
                <LucideWind size={20} />
            </button>
            <button className="action-btn" onClick={() => scrollToSection('calm-sounds')} title="Healing Sounds">
                <LucideHeadphones size={20} />
            </button>
            <button className="action-btn premium-btn" onClick={() => scrollToSection('appointments')} title="Book Appointment">
                <LucideCalendar size={20} />
                <span style={{ marginLeft: '8px' }}>Appointment</span>
            </button>
        </div>
    );
}

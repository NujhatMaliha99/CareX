import { LucideWind, LucideHeadphones, LucideCalendar, LucideAlertCircle } from 'lucide-react';

export default function QuickActionBar({ onEmergency }) {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="quick-action-bar">
            <button className="action-btn emergency-btn" onClick={onEmergency} title="Emergency Support">
                <LucideAlertCircle size={20} color="#ff4d4d" />
                <span style={{ marginLeft: '8px', color: '#ff4d4d', fontWeight: 'bold' }}>Emergency Button</span>
            </button>
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

import { useState } from 'react';
import HelplineModal from './HelplineModal';

export default function EmergencyButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEmergencyClick = () => {
        const confirmCall = window.confirm('🚨 EMERGENCY RESCUE\n\nIf you are feeling threatened or in immediate danger:\n\n✅ Click OK to see emergency helpline numbers\n❌ Click Cancel to return\n\nFor life-threatening emergencies:\n🇧🇩 Bangladesh: Call 999\n💚 Suicide Prevention: +880 1779-554391');

        if (confirmCall) {
            setIsModalOpen(true);
            // On mobile, offer to dial
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                if (window.confirm('Call 999 (Emergency)?')) {
                    window.location.href = 'tel:999';
                }
            }
        }
    };

    return (
        <>
            <button 
                className="emergency-btn-fixed" 
                onClick={handleEmergencyClick}
                title="Emergency - Call 999"
            >
                <span className="emergency-icon">🚨</span>
                <span className="emergency-text">EMERGENCY<br/>CALL 999</span>
            </button>

            {isModalOpen && <HelplineModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
}
